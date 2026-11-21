package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.appwidget.cornerRadius
import androidx.glance.background
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import expo.modules.deenwidgets.R

class AyahWidget : WidgetBase("ayah") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size=LocalSize.current
        val ink=if (snap.dark) DeenTheme.pearl else DeenTheme.lightInk
        val muted=if (snap.dark) DeenTheme.onHeroMuted else DeenTheme.lightMuted
        Box(widgetOpenModifier("ayah").fillMaxSize().background(if (snap.dark) DeenTheme.midnightInk else DeenTheme.lightCard).cornerRadius(DeenTheme.radius).padding(12.dp)) {
            val ayah=snap.ayah
            if (ayah==null) {
                Text(W(R.string.widget_open),style=TextStyle(color=ColorProvider(muted),fontSize=13.sp),maxLines=3)
            } else Column(GlanceModifier.fillMaxSize()) {
                Text(listOf(W(if (snap.savedAyah) R.string.widget_saved else R.string.widget_ayah),ayah.ref).joinToString(" · "),style=TextStyle(color=ColorProvider(if (snap.dark) DeenTheme.radiantGold else DeenTheme.antiqueGold),fontSize=10.sp),maxLines=2)
                Gap(5)
                Text(ayah.ar,modifier=GlanceModifier.defaultWeight(),style=TextStyle(color=ColorProvider(ink),fontSize=if (size.width.value<200) 16.sp else 18.sp,textAlign=TextAlign.Right),maxLines=if (size.height.value<220) 4 else 7)
                if (size.height.value>=220 && ayah.text.isNotBlank()) { Gap(6); Text(ayah.text,style=TextStyle(color=ColorProvider(muted),fontSize=11.sp),maxLines=if (size.height.value>=300) 5 else 2) }
            }
        }
    }
}
