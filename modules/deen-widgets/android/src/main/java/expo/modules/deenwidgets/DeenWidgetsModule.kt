package expo.modules.deenwidgets

import android.content.Intent
import com.deen.widgets.TasbihWidget
import com.deen.widgets.WidgetRepository
import com.deen.widgets.WidgetRefreshWorker
import androidx.glance.appwidget.updateAll
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class DeenWidgetsModule : Module() {
    private var pendingDestination: String? = null
    private fun context() = appContext.reactContext?.applicationContext ?: throw IllegalStateException("no_context")
    override fun definition() = ModuleDefinition {
        Name("DeenWidgetBridge")
        Events("onWidgetDestination")
        OnNewIntent { intent: Intent ->
            intent.getStringExtra("deen_widget_destination")?.let {
                pendingDestination = it
                intent.removeExtra("deen_widget_destination")
                // A warm widget tap can arrive without an AppState change.
                sendEvent("onWidgetDestination",emptyMap<String,Any?>())
            }
        }
        AsyncFunction("publish") Coroutine { json: String -> withContext(Dispatchers.IO) { WidgetRepository.publish(context(), json) } }
        AsyncFunction("refresh") Coroutine { withContext(Dispatchers.IO) { WidgetRefreshWorker.refresh(context()); true } }
        AsyncFunction("read") Coroutine { withContext(Dispatchers.IO) { WidgetRepository.json(context()) } }
        AsyncFunction("clear") Coroutine { withContext(Dispatchers.IO) { WidgetRepository.clearDerived(context()); WidgetRefreshWorker.refresh(context()); true } }
        AsyncFunction("tasbihRead") Coroutine { withContext(Dispatchers.IO) { WidgetRepository.read(context())[WidgetRepository.TASBIH] } }
        AsyncFunction("tasbihCommand") Coroutine { command: String -> withContext(Dispatchers.IO) {
            val result = WidgetRepository.command(context(), command)
            // Once persisted, a redraw failure must not turn a successful tap
            // into an ambiguous/retryable counter command in JavaScript.
            try { TasbihWidget().updateAll(context()) } catch (error: Exception) {
                android.util.Log.e("DeenWidgets", "Counter saved; widget redraw deferred", error)
            }
            result
        } }
        AsyncFunction("consumeDestination") {
            val intent = appContext.currentActivity?.intent
            val destination = pendingDestination ?: intent?.getStringExtra("deen_widget_destination")
            pendingDestination = null
            intent?.removeExtra("deen_widget_destination")
            destination?.takeIf { it in setOf("prayer", "ayah", "tasbih", "hijri") }
        }.runOnQueue(Queues.MAIN)
        AsyncFunction("startActivity") { _: String, _: String, _: Double, _: String, _: String -> false }
        AsyncFunction("stopActivity") { false }
    }
}
