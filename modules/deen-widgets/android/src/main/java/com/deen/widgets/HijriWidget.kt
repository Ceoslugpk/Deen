package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import expo.modules.deenwidgets.R

class HijriWidget : WidgetBase("hijri") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        DeenWidgetContent(widgetOpenModifier("hijri")) {
            Column(GlanceModifier.fillMaxSize()) {
                Eyebrow(W(R.string.widget_today)); Gap(8)
                if (snap.hijri.isBlank()) EmptyState(W(if (snap.expired) R.string.widget_expired else R.string.widget_open))
                else {
                    Headline(snap.hijri,if (LocalSize.current.width.value<200) 17 else 21)
                    Gap(8); Body(snap.gregorian,12,2)
                    if (LocalSize.current.height.value>=190 && snap.place.isNotBlank()) { Gap(12); Body(snap.place,11,2) }
                }
            }
        }
    }
}
