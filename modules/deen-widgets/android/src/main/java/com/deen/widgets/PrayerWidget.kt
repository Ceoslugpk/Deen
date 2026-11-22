package com.deen.widgets

import android.text.SpannableString
import android.text.Spanned
import android.text.style.AbsoluteSizeSpan
import android.util.TypedValue
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
import androidx.glance.semantics.contentDescription
import androidx.glance.semantics.semantics
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import expo.modules.deenwidgets.R

/** An absolute Salah time, not a frozen relative countdown. Compact cards use
 * one clear headline with a smaller day-period; the footer is city + OS clock. */
class PrayerWidget : WidgetBase("prayer") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size = LocalSize.current
        val context = LocalContext.current
        val scale = context.resources.configuration.fontScale.coerceAtLeast(1f)
        val narrow = size.width.value < 200
        val expanded = size.width.value >= 220 && size.height.value >= 310*scale
        val padding = widgetPadding(size)
        val width = size.width.value - 2*padding
        val displayPlace = if (narrow) snap.place.substringBefore(',').substringBefore('،').trim() else snap.place
        val clockHeight = if (size.height.value >= 145) 14*scale else 0f
        val placeHeight = if (!expanded && snap.place.isNotBlank()) widgetTextHeight(context,displayPlace,10,width,1)+3 else 0f
        val mainHeight = (size.height.value-2*padding-widgetHeadingHeight(context,context.getString(R.string.widget_next),width)-clockHeight-placeHeight-10).coerceAtLeast(35f)
        val now = DeenWidgetData.resolveNow(snap)
        DeenWidgetContent(widgetOpenModifier("prayer")) {
            if (snap.isEmpty || now.next == null) EmptyState(W(if (snap.configured) R.string.widget_expired else R.string.widget_choose))
            else Column(GlanceModifier.fillMaxSize()) {
                Eyebrow(W(R.string.widget_next))
                Gap(if (size.height.value < 150) 5 else 8)
                Column(GlanceModifier.defaultWeight().fillMaxWidth(),verticalAlignment = Alignment.CenterVertically) {
                    val labelSize = fitWidgetText(context,now.next.label,if (narrow) 17 else 21,11,width,mainHeight*0.4f,bold=true)
                    val labelHeight = widgetTextHeight(context,now.next.label,labelSize,width,1,true)
                    val timeHeight = mainHeight-labelHeight-2
                    Headline(now.next.label,labelSize)
                    Gap(2)
                    NativePrayerTime(now.next.time,if (narrow) 34 else 44,width,timeHeight)
                    if (expanded && snap.place.isNotBlank()) { Gap(4); Body(snap.place,11) }
                }
                if (expanded) {
                    Gap(8)
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
                } else if (size.height.value >= 175) { Gap(5); GlassRule(); Gap(7) }
                if (!expanded && snap.place.isNotBlank()) { Body(displayPlace,10,modifier=GlanceModifier.semantics { contentDescription = snap.place }); Gap(3) }
                if (size.height.value >= 145) NativeCityClock(snap)
                if (size.height.value >= 350 && expanded) { Gap(3); Body(snap.method,10) }
            }
        }
    }
}
/** Native spans keep AM/PM secondary without splitting/reordering a localized
 * time string or its accessibility label. No Latin-only UI label is added. */
@Composable private fun NativePrayerTime(text: String, preferred: Int, width: Float, height: Float) {
    val context = LocalContext.current
    val split = Regex("^([\\p{Nd}]{1,2}:[\\p{Nd}]{2})\\s+(.+)$").matchEntire(text)
    val suffix = split?.groups?.get(2)?.range?.first ?: text.length
    var size = preferred
    while (size > 16) {
        val measured = if (split == null) widgetTextWidth(context,text,size,true) else
            widgetTextWidth(context,text.substring(0,suffix),size,true)+widgetTextWidth(context,text.substring(suffix),kotlin.math.ceil(maxOf(10f,size*0.44f)).toInt(),true)
        if (measured <= width && widgetTextHeight(context,text.substring(0,suffix),size,width,1,true) <= height) break
        size--
    }
    // Android 14+ scales small/large type nonlinearly. A relative span could
    // make a nominal 10sp period smaller than 10sp at large system type.
    val styled = SpannableString(text).apply { if (suffix < length) setSpan(AbsoluteSizeSpan(kotlin.math.ceil(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,maxOf(10f,size*0.44f),context.resources.displayMetrics)).toInt()),suffix,length,Spanned.SPAN_EXCLUSIVE_EXCLUSIVE) }
    val views = RemoteViews(context.packageName,R.layout.widget_prayer_time).apply {
        setTextViewText(R.id.widget_prayer_time,styled)
        setTextViewTextSize(R.id.widget_prayer_time,TypedValue.COMPLEX_UNIT_SP,size.toFloat())
        setTextColor(R.id.widget_prayer_time,context.getColor(LocalWidgetPalette.current.ink))
        setContentDescription(R.id.widget_prayer_time,text)
    }
    val actualHeight = widgetTextHeight(context,text.substring(0,suffix),size,width,1,true)
    AndroidRemoteViews(views,modifier = GlanceModifier.fillMaxWidth().height(actualHeight.dp))
}
@Composable private fun NativeCityClock(snap: DeenWidgetData.Snapshot) {
    val context = LocalContext.current
    val color = context.getColor(LocalWidgetPalette.current.muted)
    // Minute precision is intentional: do not compete visually with the next
    // Salah's time. TextClock still advances natively without waking RN.
    val format = if (snap.timeFormat == "12") "h:mm a" else "HH:mm"
    val views = RemoteViews(context.packageName,R.layout.widget_clock).apply {
        setString(R.id.widget_clock,"setTimeZone",snap.timezone)
        setCharSequence(R.id.widget_clock,"setFormat12Hour",format)
        setCharSequence(R.id.widget_clock,"setFormat24Hour",format)
        setTextViewText(R.id.widget_clock_label,context.getString(R.string.widget_now))
        setTextColor(R.id.widget_clock,color)
        setTextColor(R.id.widget_clock_label,color)
    }
    AndroidRemoteViews(views,modifier = GlanceModifier.fillMaxWidth().height((14*context.resources.configuration.fontScale).dp))
}
