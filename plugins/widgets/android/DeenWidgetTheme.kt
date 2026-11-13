package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.appwidget.cornerRadius
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider

/**
 * The app's own ten brand colours, and the shapes the widgets are drawn with.
 *
 * These are copied rather than shared. A widget's classpath cannot see the
 * app's design tokens, and inventing a second palette here would be worse than
 * duplicating: a home screen widget that is nearly the right indigo reads as a
 * different app. These are the brand's own hexes, and anything a widget needs
 * beyond them is mixed from two brand colours.
 *
 * If the brand ever changes, this file and `src/design/brand.ts` move together.
 */
object DeenTheme {

    // ---- the ten brand colours -------------------------------------------
    val midnightInk = Color(0xFF14121F)
    val deepIndigo = Color(0xFF2D187D)
    val royalIndigo = Color(0xFF452D9F)
    val violet = Color(0xFF5D40C3)
    val lavender = Color(0xFF8B6BE8)
    val mist = Color(0xFFE6DEFA)
    val radiantGold = Color(0xFFDFB163)
    val antiqueGold = Color(0xFFC28D3F)
    val bronze = Color(0xFF9A611A)
    val pearl = Color(0xFFF9F2EB)

    /** The hero ground. Every widget sits on this, as the Prayer screen does. */
    val hero = deepIndigo

    /** Accents on the hero — the gold the app uses on its own indigo. */
    val onHero = radiantGold

    /** Body copy on the hero: Pearl, which is 12:1 on Deep Indigo. */
    val onHeroBody = pearl

    /** Labels and secondary lines: dimmed Pearl, still 5:1 on the hero. */
    val onHeroMuted = Color(0xFFB9AEE0)

    /** The chip the countdown sits in: Royal Indigo lifted off the hero. */
    val pill = royalIndigo

    /** A hairline between schedule rows — Mist at low strength on the hero. */
    val rule = Color(0xFF3A2A78)

    /** The light card the Ayah widget draws, like the reader's own verse card. */
    val lightCard = Color(0xFFFDFAF6)
    val lightInk = midnightInk
    val lightMuted = Color(0xFF6B6478)

    val radius = 20.dp
    val pillRadius = 999.dp
}

/**
 * Which of the three widget shapes we are drawing.
 *
 * Read from the size the host reports rather than assumed from the family,
 * because launchers disagree about how big a "small" widget actually is, and a
 * widget that guesses wrong shows a clipped layout.
 */
enum class WidgetShape { SMALL, MEDIUM, LARGE }

fun shapeFor(size: DpSize): WidgetShape = when {
    size.width < 200.dp && size.height < 200.dp -> WidgetShape.SMALL
    size.height < 250.dp -> WidgetShape.MEDIUM
    else -> WidgetShape.LARGE
}

/** The hero ground, rounded to the app's card radius. */
@Composable
fun DeenWidgetContent(content: @Composable () -> Unit) {
    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(DeenTheme.hero)
            .cornerRadius(DeenTheme.radius)
            .padding(14.dp),
        content = content,
    )
}

/** The small gold label every widget opens with — 'NEXT ·', 'AYAH OF THE DAY'. */
@Composable
fun Eyebrow(text: String) {
    Text(
        text = text,
        style = TextStyle(
            color = ColorProvider(DeenTheme.onHero),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Start,
        ),
        maxLines = 1,
    )
}

/** The headline: the prayer name, or the surah reference. */
@Composable
fun Headline(text: String, sizeSp: Int = 20) {
    Text(
        text = text,
        style = TextStyle(
            color = ColorProvider(DeenTheme.onHeroBody),
            fontSize = sizeSp.sp,
            fontWeight = FontWeight.Bold,
        ),
        maxLines = 1,
    )
}

/** The big clock. Tabular figures would be ideal; Glance has no such setting. */
@Composable
fun BigTime(text: String, sizeSp: Int = 34) {
    Text(
        text = text,
        style = TextStyle(
            color = ColorProvider(DeenTheme.onHeroBody),
            fontSize = sizeSp.sp,
            fontWeight = FontWeight.Bold,
        ),
        maxLines = 1,
    )
}

/** Supporting copy — the place, the hijri date, the translation. */
@Composable
fun Body(text: String, sizeSp: Int = 12, lines: Int = 1) {
    Text(
        text = text,
        style = TextStyle(
            color = ColorProvider(DeenTheme.onHeroMuted),
            fontSize = sizeSp.sp,
        ),
        maxLines = lines,
    )
}

/** The countdown chip, matching the pill under the Prayer screen's big clock. */
@Composable
fun CountdownPill(text: String) {
    Box(
        modifier = GlanceModifier
            .background(DeenTheme.pill)
            .cornerRadius(DeenTheme.pillRadius)
            .padding(horizontal = 10.dp, vertical = 5.dp),
    ) {
        Text(
            text = text,
            style = TextStyle(
                color = ColorProvider(DeenTheme.onHeroBody),
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
            ),
            maxLines = 1,
        )
    }
}

/** A full-width row, used by the schedule list. */
@Composable
fun FullRow(
    verticalAlignment: Alignment.Vertical = Alignment.CenterVertically,
    content: @Composable () -> Unit,
) {
    Row(
        modifier = GlanceModifier.fillMaxWidth(),
        verticalAlignment = verticalAlignment,
        content = content,
    )
}

@Composable
fun Gap(dp: Int) {
    Spacer(modifier = GlanceModifier.height(dp.dp))
}

@Composable
fun GapW(dp: Int) {
    Spacer(modifier = GlanceModifier.width(dp.dp))
}

/** Centre the empty state, so a widget with no data still looks deliberate. */
@Composable
fun EmptyState(message: String) {
    Column(
        modifier = GlanceModifier.fillMaxSize(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Body(message, sizeSp = 12, lines = 2)
    }
}
