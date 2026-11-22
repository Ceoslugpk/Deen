package com.deen.widgets

import android.content.Context
import android.graphics.Paint
import android.graphics.Typeface
import android.os.Build
import android.text.StaticLayout
import android.text.TextPaint
import android.text.TextUtils
import android.util.TypedValue
import androidx.compose.ui.unit.DpSize

fun widgetPadding(size: DpSize): Int = if (size.width.value < 150 || size.height.value < 150) 10 else if (size.width.value < 190 || size.height.value < 190) 14 else 16

/** Actual Android fallback-font/diacritic metrics, in dp. Whole visible lines
 * are essential for Arabic; Latin character-count estimates are not enough. */
fun widgetTextHeight(context: Context, text: String, sizeSp: Int, widthDp: Float, maxLines: Int, bold: Boolean = false): Float {
    val metrics = context.resources.displayMetrics
    val paint = widgetPaint(context,sizeSp,bold)
    val width = (widthDp*metrics.density).toInt().coerceAtLeast(1)
    val builder = StaticLayout.Builder.obtain(text,0,text.length,paint,width).setMaxLines(maxLines).setIncludePad(true).setEllipsize(TextUtils.TruncateAt.END)
    if (Build.VERSION.SDK_INT >= 28) builder.setUseLineSpacingFromFallbacks(true)
    return builder.build().height/metrics.density
}
fun widgetTextWidth(context: Context, text: String, sizeSp: Int, bold: Boolean = false): Float =
    widgetPaint(context,sizeSp,bold).measureText(text)/context.resources.displayMetrics.density

fun fitWidgetText(context: Context, text: String, preferred: Int, minimum: Int, width: Float, height: Float, lines: Int = 1, bold: Boolean = false): Int {
    for (size in preferred downTo minimum) {
        if ((lines != 1 || widgetTextWidth(context,text,size,bold) <= width)
            && widgetTextHeight(context,text,size,width,lines,bold) <= height) return size
    }
    return minimum
}
private fun widgetPaint(context: Context,sizeSp: Int,bold: Boolean) = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
    textSize = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,sizeSp.toFloat(),context.resources.displayMetrics)
    typeface = if (bold) Typeface.DEFAULT_BOLD else Typeface.DEFAULT
}

fun widgetHeadingSpec(context: Context,text: String,width: Float): Pair<Int,Int> {
    val usable=(width-14).coerceAtLeast(1f)
    val font=if(widgetTextWidth(context,text,10,true)<=usable)10 else 9
    return font to if(widgetTextWidth(context,text,font,true)<=usable)1 else 2
}
fun widgetHeadingHeight(context: Context,text: String,width: Float): Float {
    val (font,lines)=widgetHeadingSpec(context,text,width)
    return maxOf(11f,widgetTextHeight(context,text,font,(width-14).coerceAtLeast(1f),lines,true))
}
