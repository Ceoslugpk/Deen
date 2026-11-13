package com.deen.widgets

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.defaultWeight
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Today's date in both calendars.
 *
 * The smallest of the four and the calmest: no countdown, nothing to tap, one
 * line of gold and one of Pearl. It exists because the Hijri date is the
 * question the app is asked that a Gregorian calendar cannot answer, and
 * because it is the one thing here that stays true all day — it needs no
 * refresh between midnight and midnight.
 *
 * The Gregorian line is formatted here rather than published by the app, on
 * purpose: it is the one string the widget can produce perfectly on its own,
 * from the device's own locale, and shipping it across the bridge would only
 * make it stale.
 */
class HijriWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val snap = DeenWidgetData.read(context)
        provideContent {
            HijriContent(snap)
        }
    }
}

@Composable
private fun HijriContent(snap: DeenWidgetData.Snapshot) {
    val shape = shapeFor(LocalSize.current)
    val gregorian = SimpleDateFormat("EEE d MMMM y", Locale.getDefault()).format(Date())

    DeenWidgetContent {
        Column(modifier = GlanceModifier.fillMaxSize()) {
            Eyebrow("TODAY")
            Gap(6)

            Box(
                modifier = GlanceModifier.fillMaxSize().defaultWeight(),
                contentAlignment = Alignment.CenterStart,
            ) {
                Column {
                    Text(
                        text = snap.hijriShort.ifBlank { "—" },
                        style = TextStyle(
                            color = ColorProvider(DeenTheme.onHero),
                            fontSize = (if (shape == WidgetShape.SMALL) 17 else 21).sp,
                            fontWeight = FontWeight.Bold,
                        ),
                        maxLines = 2,
                    )
                    Gap(4)
                    Text(
                        text = gregorian,
                        style = TextStyle(
                            color = ColorProvider(DeenTheme.onHeroMuted),
                            fontSize = (if (shape == WidgetShape.SMALL) 11 else 12).sp,
                        ),
                        maxLines = 1,
                    )
                }
            }

            if (shape != WidgetShape.SMALL && snap.place.isNotBlank()) {
                Text(
                    text = snap.place,
                    style = TextStyle(
                        color = ColorProvider(DeenTheme.onHeroMuted),
                        fontSize = 10.sp,
                    ),
                    maxLines = 1,
                )
            }
        }
    }
}
