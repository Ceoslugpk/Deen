package com.deen.widgets

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.defaultWeight
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider

/**
 * The ayah of the day, drawn as the reader draws a verse.
 *
 * This is the one widget that is deliberately not on the indigo hero. A verse
 * is read, not glanced at, and the app reads verses on Pearl with Midnight Ink
 * text — so this widget is a card rather than a hero, and it is the only one
 * that answers the light/dark setting, because it is the only one whose ground
 * is light.
 *
 * The Arabic is the point of it and is never truncated mid-word: the small
 * shape shows the reference and as much Arabic as fits, and the larger shapes
 * add the translation underneath.
 */
class AyahWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val snap = DeenWidgetData.read(context)
        provideContent {
            AyahContent(snap)
        }
    }
}

@Composable
private fun AyahContent(snap: DeenWidgetData.Snapshot) {
    val shape = shapeFor(LocalSize.current)
    val dark = snap.dark

    val ground = if (dark) DeenTheme.midnightInk else DeenTheme.lightCard
    val ink = if (dark) DeenTheme.pearl else DeenTheme.lightInk
    val muted = if (dark) DeenTheme.onHeroMuted else DeenTheme.lightMuted
    val gold = if (dark) DeenTheme.radiantGold else DeenTheme.antiqueGold

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(ground)
            .cornerRadius(DeenTheme.radius)
            .padding(14.dp),
    ) {
        val ayah = snap.ayah
        if (ayah == null) {
            Column(
                modifier = GlanceModifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = "Open Islamic for today's ayah",
                    style = TextStyle(color = ColorProvider(muted), fontSize = 12.sp),
                    maxLines = 2,
                )
            }
        } else {
            Column(modifier = GlanceModifier.fillMaxSize()) {
                // The surah name and reference, in the app's gold.
                Text(
                    text = listOf(ayah.surah, ayah.ref).filter { it.isNotBlank() }.joinToString(" · "),
                    style = TextStyle(
                        color = ColorProvider(gold),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                    ),
                    maxLines = 1,
                )
                Gap(8)
                // The Arabic. Given every line it does not use, because it is
                // the reason this widget exists.
                Text(
                    text = ayah.ar,
                    modifier = GlanceModifier.defaultWeight(),
                    style = TextStyle(
                        color = ColorProvider(ink),
                        fontSize = (if (shape == WidgetShape.SMALL) 15 else 17).sp,
                        textAlign = TextAlign.End,
                    ),
                    maxLines = if (shape == WidgetShape.SMALL) 4 else 6,
                )
                if (shape != WidgetShape.SMALL && ayah.text.isNotBlank()) {
                    Gap(8)
                    Text(
                        text = ayah.text,
                        style = TextStyle(color = ColorProvider(muted), fontSize = 11.sp),
                        maxLines = if (shape == WidgetShape.LARGE) 6 else 3,
                    )
                }
            }
        }
    }
}