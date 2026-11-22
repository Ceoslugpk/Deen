package com.deen.widgets

import android.content.Context
import android.graphics.Paint
import android.os.Build
import android.text.StaticLayout
import android.text.TextPaint
import android.text.TextUtils
import android.util.TypedValue
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
                val padding = if (size.width.value < 150 || size.height.value < 150) 10 else 14
                val width = size.width.value - 2*padding
                val arabicSize = if (compact) 18 else if (size.height.value >= 300) 25 else 22
                val translationLines = if (size.height.value >= 300) 4 else 2
                val showTranslation = size.height.value >= 230*context.resources.configuration.fontScale.coerceAtLeast(1f) && ayah.ar.isNotBlank() && ayah.text.isNotBlank()
                val heading = W(if (snap.savedAyah) R.string.widget_saved else R.string.widget_ayah)
                val reference = listOf(ayah.surah,ayah.ref).filter { it.isNotBlank() }.joinToString(" · ")
                val verse = ayah.ar.ifBlank { ayah.text }
                val meaningHeight = if (showTranslation) widgetTextHeight(context,ayah.text,12,width-20,translationLines)+28 else 0f
                val verseHeight = size.height.value - 2*padding - maxOf(11f,widgetTextHeight(context,heading,10,width-14,1)) - widgetTextHeight(context,reference,11,width,1) - 12 - meaningHeight
                // Arabic fallback fonts/diacritics do not share Latin line
                // metrics. Measure with Android's text engine, not sp*lines,
                // so an ellipsized verse ends on a whole visible line.
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
                        GlassPanel(GlanceModifier.fillMaxWidth()) { Body(ayah.text,12,translationLines) }
                    }
                    Gap(6)
                    Text(reference,style = TextStyle(color = ColorProvider(palette.accent),fontSize = 11.sp,fontWeight = FontWeight.Bold),maxLines = 1)
                }
            }
        }
    }
}

private fun widgetTextHeight(context: Context,text: String,sizeSp: Int,widthDp: Float,maxLines: Int): Float {
    val metrics = context.resources.displayMetrics
    val paint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply { textSize = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,sizeSp.toFloat(),metrics) }
    val width = (widthDp*metrics.density).toInt().coerceAtLeast(1)
    val builder = StaticLayout.Builder.obtain(text,0,text.length,paint,width).setMaxLines(maxLines).setIncludePad(true).setEllipsize(TextUtils.TruncateAt.END)
    if (Build.VERSION.SDK_INT >= 28) builder.setUseLineSpacingFromFallbacks(true)
    return builder.build().height/metrics.density
}
