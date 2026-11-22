package com.deen.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.util.Log
import android.widget.RemoteViews
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.action.clickable
import androidx.glance.appwidget.AndroidRemoteViews
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.fillMaxSize
import expo.modules.deenwidgets.R
import java.util.Locale

abstract class WidgetBase(private val destination: String) : GlanceAppWidget(errorUiLayout=R.layout.widget_error) {
    override val sizeMode = SizeMode.Exact
    final override suspend fun provideGlance(context: Context, id: GlanceId) {
        val initial = try { WidgetRepository.read(context) } catch (error: Exception) {
            Log.e("DeenWidgets","Widget state could not be read",error)
            provideContent { DeenWidgetContent(widgetOpenModifier(destination)) { EmptyState(W(R.string.widget_error)) } }
        }
        provideContent {
            val prefs by WidgetRepository.observe(context).collectAsState(initial)
            val snap = DeenWidgetData.parse(prefs)
            val local = localizedContext(context,snap.language)
            CompositionLocalProvider(LocalContext provides local,LocalWidgetPalette provides widgetPalette(snap.themeFamily,snap.dark)) {
                // The launcher can use a different language from the app.
                // An explicit RemoteViews root direction makes selected-app
                // RTL work independently of the host's own configuration.
                val frame = RemoteViews(context.packageName,R.layout.widget_direction).apply {
                    setInt(R.id.widget_direction,"setLayoutDirection",local.resources.configuration.layoutDirection)
                }
                AndroidRemoteViews(frame,R.id.widget_direction,GlanceModifier.fillMaxSize()) { WidgetBody(snap) }
            }
        }
    }
    @Composable abstract fun WidgetBody(snap: DeenWidgetData.Snapshot)
    override fun onCompositionError(context: Context, glanceId: GlanceId, appWidgetId: Int, throwable: Throwable) {
        Log.e("DeenWidgets","Widget composition failed: ${javaClass.simpleName}",throwable)
        val views = RemoteViews(context.packageName,R.layout.widget_error)
        launchIntent(context,destination)?.let { intent ->
            views.setOnClickPendingIntent(R.id.widget_recovery,PendingIntent.getActivity(context,appWidgetId,intent,PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE))
        }
        AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId,views)
    }
}
fun localizedContext(context: Context, language: String): Context = context.createConfigurationContext(Configuration(context.resources.configuration).apply { setLocale(Locale.forLanguageTag(language)) })
fun launchIntent(context: Context, destination: String): Intent? = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    putExtra("deen_widget_destination",destination)
    // PendingIntents for different families must not alias each other.
    data = android.net.Uri.parse("islamic-widget://${destination}")
}
@Composable fun widgetOpenModifier(destination: String): GlanceModifier {
    val context = LocalContext.current
    val intent = launchIntent(context,destination)
    return if (intent == null) GlanceModifier else GlanceModifier.clickable(actionStartActivity(intent))
}
@Composable fun W(id: Int): String = LocalContext.current.getString(id)
