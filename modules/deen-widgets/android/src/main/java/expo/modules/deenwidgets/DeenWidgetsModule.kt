package expo.modules.deenwidgets

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * The JavaScript side of the home-screen widgets.
 *
 * Four things happen here, and they are separate on purpose:
 *
 *   - `publish` stores the snapshot. It does not redraw.
 *   - `refresh` redraws from whatever is stored. It does not recompute.
 *   - `read` hands the snapshot back, so the app can pick up a count that was
 *     tapped on the home screen while the app was closed.
 *   - `clear` forgets it, for when the location goes away.
 *
 * Keeping publish and refresh apart is what lets the counter be written on
 * every tap without waking the launcher each time.
 *
 * The widget classes are not referenced by name in code. They live in the
 * app's own package, which this module cannot see at compile time, so refresh
 * reaches them the way any other app does — by broadcasting an update to the
 * component names. That indirection is the price of the module living outside
 * the app, and it is worth paying: it is what lets autolinking register this
 * module without a hand-written package list that the next prebuild deletes.
 */
class DeenWidgetsModule : Module() {

    companion object {
        private const val PREFS = "deen_widgets"
        private const val KEY_SNAPSHOT = "snapshot"

        /** The receivers the config plugin writes into the manifest. */
        private val RECEIVERS = arrayOf(
            "com.deen.widgets.PrayerWidgetReceiver",
            "com.deen.widgets.AyahWidgetReceiver",
            "com.deen.widgets.TasbihWidgetReceiver",
            "com.deen.widgets.HijriWidgetReceiver",
        )
    }

    private val scope = CoroutineScope(Dispatchers.Default)

    private fun context(): Context = appContext.reactContext ?: throw IllegalStateException("no context")

    private fun prefs(): android.content.SharedPreferences =
        context().getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    override fun definition() = ModuleDefinition {
        Name("DeenWidgetBridge")

        /** Store the snapshot. Does not redraw. */
        AsyncFunction("publish") { json: String ->
            prefs().edit().putString(KEY_SNAPSHOT, json).apply()
            true
        }

        /**
         * Redraw every widget on the home screen.
         *
         * Broadcast rather than direct call: the update runs in the app's own
         * process either way, and this keeps the module from depending on the
         * widget classes.
         */
        AsyncFunction("refresh") {
            scope.launch {
                val context = context()
                val manager = AppWidgetManager.getInstance(context)
                val packageName = context.packageName
                for (name in RECEIVERS) {
                    val component = ComponentName(packageName, name)
                    val ids = manager.getAppWidgetIds(component)
                    if (ids.isEmpty()) continue // not on the home screen
                    val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE).apply {
                        putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                        setComponent(component)
                    }
                    context.sendBroadcast(intent)
                }
            }
            true
        }

        /** The stored snapshot, for the app to reconcile against. */
        AsyncFunction("read") {
            prefs().getString(KEY_SNAPSHOT, null)
        }

        /** Forget the snapshot, then redraw so the widgets show their empty state. */
        AsyncFunction("clear") {
            prefs().edit().remove(KEY_SNAPSHOT).apply()
            val context = context()
            val manager = AppWidgetManager.getInstance(context)
            for (name in RECEIVERS) {
                val component = ComponentName(context.packageName, name)
                val ids = manager.getAppWidgetIds(component)
                if (ids.isEmpty()) continue
                context.sendBroadcast(
                    Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE).apply {
                        putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                        setComponent(component)
                    },
                )
            }
            true
        }

        /*
         * Live Activities are an iOS idea. Android's equivalent is an ongoing
         * notification, and the app already has one for the adhan — so rather
         * than invent a second thing here, these report that they did nothing
         * and the caller carries on.
         */
        AsyncFunction("startActivity") { _: String, _: String, _: Double, _: String, _: String ->
            false
        }

        AsyncFunction("stopActivity") {
            false
        }
    }
}
