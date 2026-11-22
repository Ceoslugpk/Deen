package com.deen.widgets

import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceModifier
import androidx.glance.ImageProvider
import androidx.glance.LocalContext
import androidx.glance.LocalSize
import androidx.glance.appwidget.cornerRadius
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.ColumnScope
import androidx.glance.layout.Row
import androidx.glance.layout.RowScope
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
import expo.modules.deenwidgets.R

/** The generator derives every resource from src/design/brand.ts. Explicit
 * app-selected resources deliberately do not follow the launcher's night mode.
 * This is translucent RemoteViews material, never a wallpaper-blur API. */
data class WidgetPalette(
    val card: Int, val inset: Int, val button: Int,
    val ink: Int, val muted: Int, val accent: Int, val secondary: Int,
    val onPrimary: Int, val rule: Int, val track: Int,
)

fun widgetPalette(family: String = "islamic", dark: Boolean = false): WidgetPalette = when {
    family == "palestine" && dark -> WidgetPalette(
        R.drawable.widget_glass_palestine_dark,R.drawable.widget_inset_palestine_dark,R.drawable.widget_button_palestine_dark,
        R.color.widget_palestine_dark_ink,R.color.widget_palestine_dark_muted,R.color.widget_palestine_dark_accent,R.color.widget_palestine_dark_secondary,
        R.color.widget_palestine_dark_on_primary,R.color.widget_palestine_dark_rule,R.color.widget_palestine_dark_track)
    family == "palestine" -> WidgetPalette(
        R.drawable.widget_glass_palestine_light,R.drawable.widget_inset_palestine_light,R.drawable.widget_button_palestine_light,
        R.color.widget_palestine_light_ink,R.color.widget_palestine_light_muted,R.color.widget_palestine_light_accent,R.color.widget_palestine_light_secondary,
        R.color.widget_palestine_light_on_primary,R.color.widget_palestine_light_rule,R.color.widget_palestine_light_track)
    dark -> WidgetPalette(
        R.drawable.widget_glass_islamic_dark,R.drawable.widget_inset_islamic_dark,R.drawable.widget_button_islamic_dark,
        R.color.widget_islamic_dark_ink,R.color.widget_islamic_dark_muted,R.color.widget_islamic_dark_accent,R.color.widget_islamic_dark_secondary,
        R.color.widget_islamic_dark_on_primary,R.color.widget_islamic_dark_rule,R.color.widget_islamic_dark_track)
    else -> WidgetPalette(
        R.drawable.widget_glass_islamic_light,R.drawable.widget_inset_islamic_light,R.drawable.widget_button_islamic_light,
        R.color.widget_islamic_light_ink,R.color.widget_islamic_light_muted,R.color.widget_islamic_light_accent,R.color.widget_islamic_light_secondary,
        R.color.widget_islamic_light_on_primary,R.color.widget_islamic_light_rule,R.color.widget_islamic_light_track)
}
val LocalWidgetPalette = staticCompositionLocalOf { widgetPalette() }

enum class WidgetShape { SMALL, MEDIUM, LARGE }
fun shapeFor(size: DpSize): WidgetShape = when {
    size.width < 200.dp && size.height < 200.dp -> WidgetShape.SMALL
    size.height < 250.dp -> WidgetShape.MEDIUM
    else -> WidgetShape.LARGE
}

@Composable
fun DeenWidgetContent(modifier: GlanceModifier = GlanceModifier, content: @Composable () -> Unit) {
    val size = LocalSize.current
    val padding = widgetPadding(size).dp
    Box(modifier.fillMaxSize().background(ImageProvider(LocalWidgetPalette.current.card))
        .cornerRadius(26.dp).padding(padding),content = content)
}

/** A restrained two-colour marker: indigo/gold or Palestine green/red. */
@Composable
fun Eyebrow(text: String) {
    val palette = LocalWidgetPalette.current
    val context = LocalContext.current
    val size = LocalSize.current
    val (font,lines) = widgetHeadingSpec(context,text,size.width.value-2*widgetPadding(size))
    Row(GlanceModifier.fillMaxWidth(),verticalAlignment = Alignment.CenterVertically) {
        Box(GlanceModifier.width(3.dp).height(11.dp).background(palette.accent).cornerRadius(2.dp)) {}
        GapW(2)
        Box(GlanceModifier.width(3.dp).height(6.dp).background(palette.secondary).cornerRadius(2.dp)) {}
        GapW(6)
        Text(text,GlanceModifier.defaultWeight(),style = TextStyle(color = ColorProvider(palette.accent),fontSize = font.sp,fontWeight = FontWeight.Bold),maxLines = lines)
    }
}

@Composable
fun Headline(text: String, sizeSp: Int = 22, lines: Int = 1) {
    Text(text,style = TextStyle(color = ColorProvider(LocalWidgetPalette.current.ink),fontSize = sizeSp.sp,fontWeight = FontWeight.Bold),maxLines = lines)
}

@Composable
fun BigTime(text: String, sizeSp: Int = 38) {
    Text(text,style = TextStyle(color = ColorProvider(LocalWidgetPalette.current.ink),fontSize = sizeSp.sp,fontWeight = FontWeight.Bold),maxLines = 1)
}

@Composable
fun Body(text: String, sizeSp: Int = 12, lines: Int = 1, modifier: GlanceModifier = GlanceModifier) {
    Text(text,modifier,style = TextStyle(color = ColorProvider(LocalWidgetPalette.current.muted),fontSize = sizeSp.sp),maxLines = lines)
}

@Composable
fun GlassPanel(modifier: GlanceModifier = GlanceModifier, content: @Composable ColumnScope.() -> Unit) {
    Column(modifier.background(ImageProvider(LocalWidgetPalette.current.inset)).cornerRadius(16.dp).padding(10.dp),content = content)
}

@Composable
fun GlassRule() { Box(GlanceModifier.fillMaxWidth().height(1.dp).background(LocalWidgetPalette.current.rule)) {} }

@Composable
fun FullRow(content: @Composable RowScope.() -> Unit) {
    Row(GlanceModifier.fillMaxWidth(),verticalAlignment = Alignment.CenterVertically,content = content)
}
@Composable fun Gap(dp: Int) { Spacer(GlanceModifier.height(dp.dp)) }
@Composable fun GapW(dp: Int) { Spacer(GlanceModifier.width(dp.dp)) }

@Composable
fun EmptyState(message: String) {
    Column(GlanceModifier.fillMaxSize(),verticalAlignment = Alignment.CenterVertically,horizontalAlignment = Alignment.CenterHorizontally) {
        Text(message,style = TextStyle(color = ColorProvider(LocalWidgetPalette.current.muted),fontSize = 12.sp,textAlign = TextAlign.Center),maxLines = 4)
    }
}
