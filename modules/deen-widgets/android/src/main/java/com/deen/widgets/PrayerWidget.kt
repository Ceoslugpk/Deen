package com.deen.widgets

import android.widget.RemoteViews
import androidx.compose.runtime.Composable
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.LocalSize
import androidx.glance.appwidget.AndroidRemoteViews
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import expo.modules.deenwidgets.R

/** Absolute next-prayer time plus an OS-ticked city clock. Delayed background
 * work cannot turn this into a frozen/negative relative countdown. */
class PrayerWidget : WidgetBase("prayer") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size=LocalSize.current
        val shape=shapeFor(size)
        val now=DeenWidgetData.resolveNow(snap)
        DeenWidgetContent(widgetOpenModifier("prayer")) {
            if (snap.isEmpty || now.next==null) {
                EmptyState(W(if (snap.configured) R.string.widget_expired else R.string.widget_choose))
            } else {
                Column(modifier=GlanceModifier.fillMaxSize()) {
                    Eyebrow(W(R.string.widget_next)); Gap(3)
                    Headline(now.next.label,if (shape==WidgetShape.SMALL) 17 else 20)
                    BigTime(now.next.time,if (shape==WidgetShape.SMALL) 25 else 30)
                    if (size.height.value>=160) { Gap(4); Body(snap.place,11) }
                    if (size.height.value>=190 && shape!=WidgetShape.SMALL) {
                        Gap(8)
                        for (prayer in snap.today) FullRow { Body(prayer.label,11); androidx.glance.layout.Spacer(GlanceModifier.defaultWeight()); Body(prayer.time,11) }
                    }
                    if (size.height.value>=130) { Gap(5); NativeCityClock(snap) }
                    if (shape==WidgetShape.LARGE) { Gap(6); Body(snap.method,10) }
                }
            }
        }
    }
}
@Composable private fun NativeCityClock(snap: DeenWidgetData.Snapshot) {
    val context=LocalContext.current
    val format=if (snap.timeFormat=="12") "h:mm:ss a" else "HH:mm:ss"
    val views=RemoteViews(context.packageName,R.layout.widget_clock).apply {
        setString(R.id.widget_clock,"setTimeZone",snap.timezone)
        setCharSequence(R.id.widget_clock,"setFormat12Hour",format)
        setCharSequence(R.id.widget_clock,"setFormat24Hour",format)
        setTextViewText(R.id.widget_clock_label,context.getString(R.string.widget_now))
    }
    AndroidRemoteViews(views)
}
