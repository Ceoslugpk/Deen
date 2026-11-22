package com.deen.widgets

import android.content.Context
import android.os.Build
import android.widget.RemoteViews
import androidx.glance.LocalContext
import androidx.glance.appwidget.AndroidRemoteViews
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.ImageProvider
import androidx.glance.LocalSize
import androidx.glance.action.Action
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.LinearProgressIndicator
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.updateAll
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.width
import androidx.glance.semantics.contentDescription
import androidx.glance.semantics.semantics
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import expo.modules.deenwidgets.R
import org.json.JSONObject
import java.text.NumberFormat
import java.util.Locale
import java.util.UUID

/** Presentation only. Goal rollover, reset, history and transactional tap
 * behavior remain in the unchanged native TasbihStore/WidgetRepository. */
class TasbihWidget : WidgetBase("tasbih") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size = LocalSize.current
        val palette = LocalWidgetPalette.current
        val compact = size.height.value < 190
        val narrow = size.width.value < 200
        val fontScale = LocalContext.current.resources.configuration.fontScale.coerceAtLeast(1f)
        DeenWidgetContent(widgetOpenModifier("tasbih")) {
            val counter = snap.tasbih
            if (counter == null) {
                val context = LocalContext.current
                val width = size.width.value-2*widgetPadding(size)
                val message = W(R.string.widget_counter)
                val available = size.height.value-2*widgetPadding(size)-widgetHeadingHeight(context,W(R.string.widget_tasbih),width)-widgetTextHeight(context,W(R.string.widget_open),11,width-20,2)-20
                var lines = 3
                while(lines>1 && widgetTextHeight(context,message,11,width,lines)>available) lines--
                Column(GlanceModifier.fillMaxSize()) {
                    Eyebrow(W(R.string.widget_tasbih))
                    Column(GlanceModifier.defaultWeight().fillMaxWidth(),verticalAlignment = Alignment.CenterVertically) { Body(message,11,lines) }
                    GlassPanel(GlanceModifier.fillMaxWidth()) { Body(W(R.string.widget_open),11,2) }
                }
            }
            else Column(GlanceModifier.fillMaxSize()) {
                // On short cards the phrase is the heading, not a hidden line.
                Eyebrow(if (compact) counter.label.ifBlank { W(R.string.widget_tasbih) } else W(R.string.widget_tasbih))
                Column(GlanceModifier.defaultWeight().fillMaxWidth(),verticalAlignment = Alignment.CenterVertically,horizontalAlignment = Alignment.CenterHorizontally) {
                    if (!compact && counter.label.isNotBlank()) { Body(counter.label,if (narrow) 12 else 14,2); Gap(6) }
                    val digits = counter.count.toString().length
                    val stacked = narrow && digits + counter.target.toString().length > 7
                    val base = if (stacked && compact) 28 else if (size.height.value < 145) 32 else if (compact && narrow) (if(size.height.value>=165)48 else 36) else if (compact) 48 else 64
                    val padding = widgetPadding(size)
                    val controls = if (size.height.value < 145) 40 else 44
                    val gap = if (size.height.value < 145) 5 else 8
                    val phraseSize = if (narrow) 12 else 14
                    val phraseLines = if (counter.label.length*phraseSize*0.6f*fontScale > size.width.value-2*padding) 2 else 1
                    val phraseHeight = if (!compact && counter.label.isNotBlank()) phraseSize*1.4f*fontScale*phraseLines+6 else 0f
                    val metadataHeight = if (!compact) 15*fontScale+5 else 0f
                    val heading = if(compact) counter.label.ifBlank { W(R.string.widget_tasbih) } else W(R.string.widget_tasbih)
                    val centerHeight = size.height.value - 2*padding - widgetHeadingHeight(LocalContext.current,heading,size.width.value-2*padding) - controls - 5 - gap - metadataHeight
                    val heightLimit = (centerHeight - phraseHeight - if (stacked) 14*fontScale else 0f)/(1.4f*fontScale)
                    val targetWidth = if (stacked) 0f else (counter.target.toString().length+2)*(if (narrow) 12 else 15)*0.65f*fontScale + if (narrow) 5 else 10
                    val widthLimit = (size.width.value - 2*padding - targetWidth)/(digits*0.68f*fontScale)
                    val countSize = minOf((base - (digits-3).coerceAtLeast(0)*3).coerceAtLeast(20).toFloat(),heightLimit,widthLimit).toInt().coerceAtLeast(12)
                    if (stacked) {
                        CountNumber(counter.count,countSize)
                        Body("/ ${counter.target}",10)
                    } else Row(verticalAlignment = Alignment.CenterVertically) {
                        CountNumber(counter.count,countSize)
                        GapW(if (narrow) 5 else 10)
                        Body("/ ${counter.target}",if (narrow) 12 else 15)
                    }
                }
                val progress = tasbihProgress(counter.count,counter.target)
                if (!compact) {
                    FullRow {
                        Body("${counter.count} / ${counter.target}",11,modifier = GlanceModifier.defaultWeight())
                        Body(NumberFormat.getPercentInstance(Locale.forLanguageTag(snap.language)).format(progress.toDouble()),11)
                    }
                    Gap(5)
                }
                LinearProgressIndicator(progress,GlanceModifier.fillMaxWidth().height(5.dp).semantics { contentDescription = "${counter.count} / ${counter.target}" },
                    color = ColorProvider(palette.accent),backgroundColor = ColorProvider(palette.track))
                Gap(if (size.height.value < 145) 5 else 8)
                Row(GlanceModifier.fillMaxWidth()) {
                    TapButton("+1",GlanceModifier.defaultWeight(),true,if (size.height.value < 145) 40 else 44,actionRunCallback<TasbihCountAction>())
                    GapW(6)
                    TapButton(W(R.string.widget_reset),GlanceModifier.width((if (narrow) 58 else 90).dp),false,if (size.height.value < 145) 40 else 44,actionRunCallback<TasbihResetAction>())
                }
            }
        }
    }
}
fun tasbihProgress(count: Int,target: Int): Float = (count.toFloat()/target.coerceAtLeast(1).toFloat()).coerceIn(0f,1f)

@Composable private fun CountNumber(count: Int,size: Int) {
    Text(count.toString(),style = TextStyle(color = ColorProvider(LocalWidgetPalette.current.ink),fontSize = size.sp,fontWeight = FontWeight.Bold),maxLines = 1)
}
@Composable private fun TapButton(text: String,modifier: GlanceModifier,primary: Boolean,height: Int,onClick: Action) {
    val palette = LocalWidgetPalette.current
    Box(modifier.height(height.dp).background(ImageProvider(if (primary) palette.button else palette.inset)).cornerRadius(16.dp).clickable(onClick),contentAlignment = Alignment.Center) {
        if (primary) Text(text,style = TextStyle(color = ColorProvider(palette.onPrimary),fontSize = 20.sp,fontWeight = FontWeight.Bold),maxLines = 1)
        else {
            val context = LocalContext.current
            val label = RemoteViews(context.packageName,R.layout.widget_button_label).apply {
                setTextViewText(R.id.widget_button_label,text)
                setTextColor(R.id.widget_button_label,context.getColor(palette.secondary))
                // Framework autosizing starts on 26. Keep an explicit readable
                // two-line fallback for the unchanged Android 24/25 minimum.
                if (Build.VERSION.SDK_INT < 26) setTextViewTextSize(R.id.widget_button_label,android.util.TypedValue.COMPLEX_UNIT_SP,9f)
            }
            AndroidRemoteViews(label,modifier = GlanceModifier.fillMaxSize())
        }
    }
}
private suspend fun mutate(context: Context,op: String) {
    WidgetRepository.command(context,JSONObject().put("op",op).put("idempotencyKey",UUID.randomUUID().toString()).toString())
    TasbihWidget().updateAll(context)
}
class TasbihCountAction : ActionCallback {
    override suspend fun onAction(context: Context,glanceId: GlanceId,parameters: ActionParameters) { mutate(context,"tap") }
}
class TasbihResetAction : ActionCallback {
    override suspend fun onAction(context: Context,glanceId: GlanceId,parameters: ActionParameters) { mutate(context,"reset") }
}
