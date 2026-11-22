package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.LocalSize
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import expo.modules.deenwidgets.R

class AyahWidget : WidgetBase("ayah") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size = LocalSize.current
        val context = LocalContext.current
        val palette = LocalWidgetPalette.current
        val compact = size.width.value < 200
        DeenWidgetContent(widgetOpenModifier("ayah")) {
            val ayah = snap.ayah
            if (ayah == null) EmptyState(W(R.string.widget_open))
            else {
                val padding = widgetPadding(size)
                val width = size.width.value - 2*padding
                var arabicSize = if (compact) 18 else if (size.height.value >= 300) 25 else 22
                val translationLines = if (size.height.value >= 300) 4 else 2
                val heading = W(if (snap.savedAyah) R.string.widget_saved else R.string.widget_ayah)
                val reference = listOf(ayah.surah,ayah.ref).filter { it.isNotBlank() }.joinToString(" · ")
                val verse = ayah.ar.ifBlank { ayah.text }
                val scale = context.resources.configuration.fontScale.coerceAtLeast(1f)
                val meaningPanel = size.height.value >= 230*scale
                val meaningHeight = widgetTextHeight(context,ayah.text,if(meaningPanel)12 else 11,width-(if(meaningPanel)20 else 0),translationLines)+(if(meaningPanel)28 else 7)
                val available = size.height.value - 2*padding - widgetHeadingHeight(context,heading,width) - widgetTextHeight(context,reference,11,width,1) - (if(size.height.value>=175)20 else 12)
                val minimumVerse = widgetTextHeight(context,verse,arabicSize,width,2)
                val showTranslation = size.height.value >= 160*scale && ayah.ar.isNotBlank() && ayah.text.isNotBlank() && available-meaningHeight >= minimumVerse
                val verseHeight = available - if(showTranslation)meaningHeight else 0f
                // Arabic fallback fonts/diacritics do not share Latin line
                // metrics. Measure with Android's text engine, not sp*lines,
                // so an ellipsized verse ends on a whole visible line.
                while(arabicSize>12 && widgetTextHeight(context,verse,arabicSize,width,1)>verseHeight) arabicSize--
                var verseLines = 7
                while (verseLines > 1 && widgetTextHeight(context,verse,arabicSize,width,verseLines) > verseHeight) verseLines--
                Column(GlanceModifier.fillMaxSize()) {
                    Eyebrow(heading)
                    Gap(6)
                    Box(GlanceModifier.defaultWeight().fillMaxWidth(),contentAlignment = Alignment.CenterEnd) {
                        Text(verse,GlanceModifier.fillMaxWidth(),style = TextStyle(color = ColorProvider(palette.ink),fontSize = arabicSize.sp,
                            textAlign = if (ayah.ar.isNotBlank()) TextAlign.Right else TextAlign.Start),maxLines = verseLines)
                    }
                    if (showTranslation) {
                        Gap(8)
                        if (meaningPanel) GlassPanel(GlanceModifier.fillMaxWidth()) { Body(ayah.text,12,translationLines) }
                        else Body(ayah.text,11,translationLines)
                    }
                    Gap(6)
                    if(size.height.value>=175) { GlassRule();Gap(7) }
                    Text(reference,style = TextStyle(color = ColorProvider(palette.accent),fontSize = 11.sp,fontWeight = FontWeight.Bold),maxLines = 1)
                }
            }
        }
    }
}
