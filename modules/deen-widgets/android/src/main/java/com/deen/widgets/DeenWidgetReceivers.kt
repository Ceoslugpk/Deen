package com.deen.widgets

import android.content.Context
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

abstract class DeenWidgetReceiver : GlanceAppWidgetReceiver() {
    override fun onEnabled(context: Context) { super.onEnabled(context); WidgetRefreshWorker.enqueue(context) }
    override fun onDisabled(context: Context) { super.onDisabled(context); if (!WidgetRefreshWorker.hasWidgets(context)) WidgetRefreshWorker.cancel(context) }
}
// These FQCNs must not change: Android uses them to identify existing instances.
class PrayerWidgetReceiver : DeenWidgetReceiver() { override val glanceAppWidget: GlanceAppWidget = PrayerWidget() }
class AyahWidgetReceiver : DeenWidgetReceiver() { override val glanceAppWidget: GlanceAppWidget = AyahWidget() }
class TasbihWidgetReceiver : DeenWidgetReceiver() { override val glanceAppWidget: GlanceAppWidget = TasbihWidget() }
class HijriWidgetReceiver : DeenWidgetReceiver() { override val glanceAppWidget: GlanceAppWidget = HijriWidget() }
val DEEN_WIDGETS: List<GlanceAppWidget> = listOf(PrayerWidget(),AyahWidget(),TasbihWidget(),HijriWidget())
