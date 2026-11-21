package com.deen.widgets

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.action.Action
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
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
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import expo.modules.deenwidgets.R
import org.json.JSONObject
import java.util.UUID

class TasbihWidget : WidgetBase("tasbih") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        DeenWidgetContent(widgetOpenModifier("tasbih")) {
            val counter=snap.tasbih
            if (counter==null) EmptyState(W(R.string.widget_counter))
            else Column(GlanceModifier.fillMaxSize()) {
                Eyebrow(W(R.string.widget_tasbih))
                if (LocalSize.current.height.value>=180 && counter.label.isNotBlank()) { Gap(4); Body(counter.label,12) }
                Box(GlanceModifier.defaultWeight().fillMaxWidth(),contentAlignment=Alignment.Center) {
                    Text("${counter.count} / ${counter.target}",style=TextStyle(color=ColorProvider(DeenTheme.onHeroBody),fontSize=28.sp,fontWeight=FontWeight.Bold),maxLines=1)
                }
                Row(GlanceModifier.fillMaxWidth()) {
                    TapButton("+1",GlanceModifier.defaultWeight(),actionRunCallback<TasbihCountAction>())
                    GapW(6)
                    TapButton(W(R.string.widget_reset),GlanceModifier.defaultWeight(),actionRunCallback<TasbihResetAction>())
                }
            }
        }
    }
}
@Composable private fun TapButton(text: String,modifier: GlanceModifier,onClick: Action) {
    Box(modifier.background(DeenTheme.pill).cornerRadius(DeenTheme.radius).padding(horizontal=6.dp,vertical=12.dp).clickable(onClick),contentAlignment=Alignment.Center) {
        Text(text,style=TextStyle(color=ColorProvider(DeenTheme.onHeroBody),fontSize=12.sp,fontWeight=FontWeight.Bold),maxLines=1)
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
