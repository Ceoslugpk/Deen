package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.LocalSize
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.semantics.contentDescription
import androidx.glance.semantics.semantics
import expo.modules.deenwidgets.R

/** Reuses the published calendar wording, not a second Hijri calculation.
 * Only the known `day month` + year contract is separated for typography;
 * an older/unrecognized format keeps its complete original date. */
fun hijriParts(full: String, short: String): Triple<String,String,String>? {
    val match = Regex("^([\\p{Nd}]{1,2})\\s+(.+)$").matchEntire(short) ?: return null
    val year = full.takeIf { it.startsWith("$short ") }?.removePrefix(short)?.trim() ?: return null
    if (!year.matches(Regex("[\\p{Nd}]{3,5}"))) return null
    return Triple(match.groupValues[1],match.groupValues[2],year)
}
class HijriWidget : WidgetBase("hijri") {
    @Composable override fun WidgetBody(snap: DeenWidgetData.Snapshot) {
        val size = LocalSize.current
        val context = LocalContext.current
        val narrow = size.width.value < 200
        val width = size.width.value-2*widgetPadding(size)
        val scale = context.resources.configuration.fontScale.coerceAtLeast(1f)
        val panel = size.height.value >= 240*scale
        val footerSize = if (size.height.value < 150) 9 else 10
        val footerHeight = widgetTextHeight(context,snap.gregorian,footerSize,width-(if(panel)20 else 0),2)+(if(panel)20 else 0)
        val placeHeight = if (panel && snap.place.isNotBlank()) widgetTextHeight(context,snap.place,11,width,2)+7 else 0f
        val mainHeight = size.height.value-2*widgetPadding(size)-widgetHeadingHeight(context,context.getString(R.string.widget_today),width)-footerHeight-placeHeight-12
        DeenWidgetContent(widgetOpenModifier("hijri")) {
            if (snap.hijri.isBlank()) EmptyState(W(if (snap.expired) R.string.widget_expired else R.string.widget_open))
            else Column(GlanceModifier.fillMaxSize()) {
                Eyebrow(W(R.string.widget_today))
                Gap(if (size.height.value < 150) 4 else 7)
                Column(GlanceModifier.defaultWeight().fillMaxWidth().semantics { contentDescription = snap.hijri },verticalAlignment = Alignment.CenterVertically) {
                    val parts = hijriParts(snap.hijri,snap.hijriShort)
                    if (parts == null) {
                        val textSize = fitWidgetText(context,snap.hijri,if(narrow)18 else 26,12,width,mainHeight,3,true)
                        Headline(snap.hijri,textSize,3)
                    } else if (narrow) {
                        val monthSize = fitWidgetText(context,parts.second,if(size.height.value>=240)17 else 13,10,width,mainHeight*0.52f,2,true)
                        val monthHeight = widgetTextHeight(context,parts.second,monthSize,width,2,true)
                        val daySize = fitWidgetText(context,parts.first,if(size.height.value>=240)54 else 38,14,width*0.6f,mainHeight-monthHeight-4,bold=true)
                        FullRow {
                            Column(GlanceModifier.defaultWeight()) { Headline(parts.first,daySize) }
                            Body(parts.third,11)
                        }
                        Headline(parts.second,monthSize,2)
                    } else {
                        val daySize = fitWidgetText(context,parts.first,if(size.height.value>=240)62 else 46,22,width*0.38f,mainHeight,bold=true)
                        Row(GlanceModifier.fillMaxWidth(),verticalAlignment = Alignment.CenterVertically) {
                            Headline(parts.first,daySize)
                            GapW(12)
                            Column(GlanceModifier.defaultWeight()) {
                                val monthSize = fitWidgetText(context,parts.second,if(size.height.value>=240)21 else 17,11,width*0.6f,mainHeight-18*scale,2,true)
                                Headline(parts.second,monthSize,2)
                                Gap(3)
                                Body(parts.third,12)
                            }
                        }
                    }
                }
                Gap(if (size.height.value < 150) 3 else 7)
                if (panel) {
                    GlassPanel(GlanceModifier.fillMaxWidth()) { Body(snap.gregorian,footerSize,2) }
                    if (snap.place.isNotBlank()) { Gap(7); Body(snap.place,11,2) }
                } else Body(snap.gregorian,footerSize,2)
            }
        }
    }
}
