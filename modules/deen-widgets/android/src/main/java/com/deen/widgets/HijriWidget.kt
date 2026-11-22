package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import expo.modules.deenwidgets.R

class HijriWidget : WidgetBase("hijri") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size = LocalSize.current
        val compact = size.width.value < 200
        DeenWidgetContent(widgetOpenModifier("hijri")) {
            if (snap.hijri.isBlank()) EmptyState(W(if (snap.expired) R.string.widget_expired else R.string.widget_open))
            else Column(GlanceModifier.fillMaxSize()) {
                Eyebrow(W(R.string.widget_today))
                Column(GlanceModifier.defaultWeight().fillMaxWidth(),verticalAlignment = Alignment.CenterVertically) {
                    Headline(snap.hijri,if (compact) 18 else if (size.height.value >= 250) 32 else 26,if (compact) 3 else 2)
                }
                if (size.height.value >= 190) {
                    GlassPanel(GlanceModifier.fillMaxWidth()) { Body(snap.gregorian,12,2) }
                    if (snap.place.isNotBlank()) { Gap(8); Body(snap.place,11,2) }
                } else Body(snap.gregorian,11,2)
            }
        }
    }
}
