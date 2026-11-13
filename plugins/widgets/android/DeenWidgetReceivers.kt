package com.deen.widgets

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

/**
 * One receiver per widget, because Android identifies a widget by its receiver
 * class. Four of them, and each is three lines: everything they draw lives in
 * the `GlanceAppWidget` they hand back.
 */
class PrayerWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = PrayerWidget()
}

class AyahWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = AyahWidget()
}

class TasbihWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = TasbihWidget()
}

class HijriWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HijriWidget()
}

/** Every widget the app offers, in the order the picker shows them. */
val DEEN_WIDGETS: List<GlanceAppWidget> = listOf(
    PrayerWidget(),
    AyahWidget(),
    TasbihWidget(),
    HijriWidget(),
)
