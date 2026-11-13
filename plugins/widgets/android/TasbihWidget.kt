package com.deen.widgets

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.action.Action
import androidx.glance.action.ActionParameters
import androidx.glance.action.actionRunCallback
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.defaultWeight
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

/**
 * A counter you can tap without opening the app.
 *
 * This is the only widget that changes state on its own, and that is the part
 * worth being careful about: the count exists in two places now. The app holds
 * one; the widget writes another. If both were allowed to be the truth, a
 * person could count to 33 on the home screen, open the app, and find 0.
 *
 * So the rule is last-write-wins, timestamped. Tapping the widget writes the
 * new count *and* the moment it was written. The app, when it next comes to
 * the front, compares that moment with the last time it published and adopts
 * whichever is newer. Nothing is merged, because two counters cannot be merged
 * — only one of them can be right.
 */
class TasbihWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val snap = DeenWidgetData.read(context)
        provideContent {
            TasbihContent(snap)
        }
    }
}

@Composable
private fun TasbihContent(snap: DeenWidgetData.Snapshot) {
    val shape = shapeFor(LocalSize.current)
    val tasbih = snap.tasbih
    val count = tasbih?.count ?: 0
    val target = tasbih?.target?.takeIf { it > 0 } ?: 33
    val label = tasbih?.label.orEmpty()
    // Complete is worth marking: it is the moment the counter exists for.
    val done = count > 0 && count % target == 0

    DeenWidgetContent {
        Column(modifier = GlanceModifier.fillMaxSize()) {
            Eyebrow("TASBIH")
            Gap(4)
            if (label.isNotBlank()) {
                Body(label, sizeSp = 12)
                Gap(4)
            }

            Box(
                modifier = GlanceModifier.fillMaxSize().defaultWeight(),
                contentAlignment = Alignment.Center,
            ) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = count.toString(),
                        style = TextStyle(
                            color = ColorProvider(if (done) DeenTheme.onHero else DeenTheme.onHeroBody),
                            fontSize = (if (shape == WidgetShape.SMALL) 34 else 44).sp,
                            fontWeight = FontWeight.Bold,
                        ),
                        maxLines = 1,
                    )
                    Text(
                        text = " / $target",
                        style = TextStyle(
                            color = ColorProvider(DeenTheme.onHeroMuted),
                            fontSize = (if (shape == WidgetShape.SMALL) 15 else 18).sp,
                        ),
                        maxLines = 1,
                    )
                }
            }

            Row(modifier = GlanceModifier.fillMaxWidth()) {
                TapButton(
                    text = "+1",
                    primary = true,
                    modifier = GlanceModifier.defaultWeight(),
                    onClick = actionRunCallback<TasbihCountAction>(),
                )
                GapW(8)
                TapButton(
                    text = "Reset",
                    primary = false,
                    onClick = actionRunCallback<TasbihResetAction>(),
                )
            }
        }
    }
}

/** A chip the launcher will treat as a button. */
@Composable
private fun TapButton(
    text: String,
    primary: Boolean,
    modifier: GlanceModifier = GlanceModifier,
    onClick: Action,
) {
    Box(
        modifier = modifier
            .background(if (primary) DeenTheme.onHero else DeenTheme.pill)
            .cornerRadius(DeenTheme.pillRadius)
            .padding(horizontal = 14.dp, vertical = 8.dp)
            .clickable(onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = text,
            style = TextStyle(
                color = ColorProvider(
                    if (primary) DeenTheme.midnightInk else DeenTheme.onHeroBody
                ),
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
            ),
            maxLines = 1,
        )
    }
}

/** The shared work behind both buttons: read, change, write, redraw. */
private suspend fun mutate(
    context: Context,
    glanceId: GlanceId,
    change: (Int) -> Int,
) = withContext(Dispatchers.Default) {
    val prefs = context.getSharedPreferences(DeenWidgetData.PREFS, Context.MODE_PRIVATE)
    val raw = prefs.getString(DeenWidgetData.KEY_SNAPSHOT, null) ?: return@withContext
    val root = try {
        JSONObject(raw)
    } catch (e: Exception) {
        return@withContext
    }
    val tasbih = root.optJSONObject("tasbih") ?: JSONObject()
    val target = tasbih.optInt("target", 33).takeIf { it > 0 } ?: 33
    val next = change(tasbih.optInt("count", 0)).coerceIn(0, 9999)
    tasbih.put("count", next)
    tasbih.put("target", target)
    root.put("tasbih", tasbih)
    // The stamp the app reconciles against. Without it there is no way to
    // tell a widget tap from an app tap that happened to be older.
    root.put("tasbihAt", System.currentTimeMillis())
    prefs.edit().putString(DeenWidgetData.KEY_SNAPSHOT, root.toString()).apply()

    TasbihWidget().update(context, glanceId)
}

class TasbihCountAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        mutate(context, glanceId) { it + 1 }
    }
}

class TasbihResetAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        mutate(context, glanceId) { 0 }
    }
}
