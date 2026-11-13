package com.deen.widgets

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.cornerRadius
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
 * The prayer widget, in three shapes.
 *
 * Small makes one promise and keeps it: the next prayer, when, and how long.
 * Medium adds today's six so the day can be read at a glance. Large adds the
 * place and the method the times were worked out from, because a time nobody
 * can trace to a method is a time that cannot be trusted.
 *
 * The countdown is rendered as text rather than ticked. Android gives an app
 * widget no per-second surface: the host decides when to redraw, and the
 * shortest cadence it will honour is half an hour. So the countdown is
 * correct at the moment it is drawn and refreshed whenever the app publishes —
 * which includes every time the app is opened, and once at each prayer time.
 */
class PrayerWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val snap = DeenWidgetData.read(context)
        provideContent {
            PrayerContent(snap)
        }
    }
}

@Composable
private fun PrayerContent(snap: DeenWidgetData.Snapshot) {
    val shape = shapeFor(LocalSize.current)

    if (snap.isEmpty) {
        DeenWidgetContent {
            EmptyState("Open Islamic to set your location")
        }
        return
    }

    val now = DeenWidgetData.resolveNow(snap)
    val next = now.next

    DeenWidgetContent {
        Column(modifier = GlanceModifier.fillMaxSize()) {
            Eyebrow("NEXT ·")
            Gap(2)
            Headline(next?.label ?: "—", if (shape == WidgetShape.SMALL) 17 else 19)

            if (shape == WidgetShape.SMALL) {
                // The small shape gets the clock and the countdown and nothing
                // else; a schedule squeezed into 130dp is unreadable.
                Box(
                    modifier = GlanceModifier.fillMaxSize(),
                    contentAlignment = Alignment.BottomStart,
                ) {
                    Column {
                        BigTime(next?.time ?: "—", 26)
                        Gap(6)
                        if (next != null) {
                            CountdownPill("in ${DeenWidgetData.formatUntil(now.untilMs)}")
                        }
                    }
                }
            } else {
                Gap(4)
                BigTime(next?.time ?: "—", 32)
                Gap(8)
                if (next != null) {
                    CountdownPill("in ${DeenWidgetData.formatUntil(now.untilMs)}")
                }
                Gap(10)
                Schedule(snap, now, compact = shape == WidgetShape.MEDIUM)
                // Only the large shape has room to say where these came from.
                if (shape == WidgetShape.LARGE) {
                    Gap(8)
                    Footnote(snap)
                }
            }
        }
    }
}

/**
 * Today's six, with the one that is happening marked.
 *
 * Sunrise is listed because the app lists it, but it is never highlighted —
 * it is a time to know, not a prayer that is due.
 */
@Composable
private fun Schedule(
    snap: DeenWidgetData.Snapshot,
    now: DeenWidgetData.Now,
    compact: Boolean,
) {
    Column(modifier = GlanceModifier.fillMaxWidth()) {
        for (p in snap.today) {
            val isCurrent = now.current?.key == p.key && DeenWidgetData.isPrayer(p.key)
            val isNext = now.next?.key == p.key
            FullRow {
                Text(
                    text = p.label,
                    modifier = GlanceModifier.defaultWeight(),
                    style = TextStyle(
                        color = ColorProvider(
                            when {
                                isNext -> DeenTheme.onHeroBody
                                isCurrent -> DeenTheme.onHeroMuted
                                else -> DeenTheme.onHeroMuted
                            }
                        ),
                        fontSize = (if (compact) 11 else 12).sp,
                        fontWeight = if (isNext || isCurrent) FontWeight.Bold else FontWeight.Normal,
                    ),
                    maxLines = 1,
                )
                Text(
                    text = p.time,
                    style = TextStyle(
                        color = ColorProvider(
                            if (isNext) DeenTheme.onHero else DeenTheme.onHeroMuted
                        ),
                        fontSize = (if (compact) 11 else 12).sp,
                        fontWeight = if (isNext) FontWeight.Bold else FontWeight.Medium,
                        textAlign = TextAlign.End,
                    ),
                    maxLines = 1,
                )
            }
            if (!compact) Gap(3)
        }
    }
}

/**
 * The place and the method, for the large shape only.
 *
 * Deliberately the last thing in the widget and the smallest text in it. It
 * is there for the person who has checked a time against another source and
 * wants to know why they differ — not for anyone glancing at their home screen.
 */
@Composable
private fun Footnote(snap: DeenWidgetData.Snapshot) {
    val parts = listOfNotNull(
        snap.place.takeIf { it.isNotBlank() },
        snap.method.takeIf { it.isNotBlank() },
    )
    if (parts.isEmpty()) return
    Text(
        text = parts.joinToString(" · "),
        style = TextStyle(color = ColorProvider(DeenTheme.onHeroMuted), fontSize = 10.sp),
        maxLines = 1,
    )
}
