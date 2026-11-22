package com.deen.widgets

import android.widget.RemoteViews
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.LocalSize
import androidx.glance.appwidget.AndroidRemoteViews
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import expo.modules.deenwidgets.R

/** Absolute next-prayer time plus an OS-ticked city clock. Delayed background
 * work cannot turn this into a frozen/negative relative countdown. */
class PrayerWidget : WidgetBase("prayer") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size = LocalSize.current
        val compact = size.width.value < 200
        val fontScale = LocalContext.current.resources.configuration.fontScale.coerceAtLeast(1f)
        val expanded = size.width.value >= 220 && size.height.value >= 310*fontScale
        val padding = if (size.width.value < 150 || size.height.value < 150) 10 else 14
        val coreHeight = size.height.value - 2*padding - 14*fontScale - (if (snap.place.isNotBlank()) 14*fontScale+3 else 0f) - (if (size.height.value>=145) 14*fontScale else 0f)
        val headlineBase = if (compact) 18 else 23
        val timeBase = if (compact) 30 else 40
        val fit = if (size.height.value<200) minOf(1f,coreHeight/((headlineBase+timeBase)*1.4f*fontScale)) else 1f
        val now = DeenWidgetData.resolveNow(snap)
        DeenWidgetContent(widgetOpenModifier("prayer")) {
            if (snap.isEmpty || now.next == null) {
                EmptyState(W(if (snap.configured) R.string.widget_expired else R.string.widget_choose))
            } else Column(GlanceModifier.fillMaxSize()) {
                Eyebrow(W(R.string.widget_next))
                Column(GlanceModifier.defaultWeight().fillMaxWidth(),verticalAlignment = Alignment.CenterVertically) {
                    Headline(now.next.label,(headlineBase*fit).toInt().coerceAtLeast(12))
                    BigTime(now.next.time,(timeBase*fit).toInt().coerceAtLeast(20))
                    if (expanded && snap.place.isNotBlank()) { Gap(3); Body(snap.place,11) }
                }
                if (expanded) {
                    GlassPanel(GlanceModifier.fillMaxWidth()) {
                        for (prayer in snap.today) FullRow {
                            val active = prayer.key == now.next.key
                            Text(prayer.label,GlanceModifier.defaultWeight().padding(vertical = 2.dp),
                                style = TextStyle(color = ColorProvider(if (active) LocalWidgetPalette.current.accent else LocalWidgetPalette.current.muted),fontSize = 11.sp,
                                    fontWeight = if (active) FontWeight.Bold else FontWeight.Normal),maxLines = 1)
                            Body(prayer.time,11)
                        }
                    }
                    Gap(8)
                }
                if (!expanded && snap.place.isNotBlank()) { Body(snap.place,10); Gap(3) }
                if (size.height.value >= 145) NativeCityClock(snap)
                if (size.height.value >= 350) { Gap(3); Body(snap.method,10) }
            }
        }
    }
}
@Composable private fun NativeCityClock(snap: DeenWidgetData.Snapshot) {
    val context = LocalContext.current
    val color = context.getColor(LocalWidgetPalette.current.muted)
    val format = if (snap.timeFormat == "12") "h:mm:ss a" else "HH:mm:ss"
    val views = RemoteViews(context.packageName,R.layout.widget_clock).apply {
        setString(R.id.widget_clock,"setTimeZone",snap.timezone)
        setCharSequence(R.id.widget_clock,"setFormat12Hour",format)
        setCharSequence(R.id.widget_clock,"setFormat24Hour",format)
        setTextViewText(R.id.widget_clock_label,context.getString(R.string.widget_now))
        setTextColor(R.id.widget_clock,color)
        setTextColor(R.id.widget_clock_label,color)
    }
    // AndroidRemoteViews defaults to match-parent height even when its XML
    // child wraps. Bound this footer so it cannot consume the headline space.
    AndroidRemoteViews(views,modifier = GlanceModifier.fillMaxWidth().height((14*context.resources.configuration.fontScale).dp))
}
