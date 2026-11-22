package com.deen.widgets

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Rect
import android.widget.ProgressBar
import java.io.File
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.datastore.preferences.core.preferencesOf
import androidx.glance.ExperimentalGlanceApi
import androidx.glance.appwidget.compose
import androidx.test.core.app.ApplicationProvider
import expo.modules.deenwidgets.R
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.*
import org.junit.FixMethodOrder
import org.junit.Test
import org.junit.runners.MethodSorters
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/** Real Android/Glance/DataStore APIs under Robolectric, not a phone/launcher
 * or full Expo release build. Production source and resources are compiled. */
@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class WidgetNativeTest {
    private val context: Context get()=ApplicationProvider.getApplicationContext()
    private fun state(count: Int=0, goal: Int=33)=JSONObject().put("phraseId","subhan-allah").put("goal",goal).put("count",count).put("rounds",2)
        .put("days",JSONObject().put("2020-01-01",7)).put("sessions",JSONArray().put(JSONObject().put("id","saved-session").put("phrase","Subhan Allah").put("count",12).put("goal",33).put("completedAt",1)))
    private fun command(op: String)=JSONObject().put("op",op)
    private fun snapshot(now: Long=System.currentTimeMillis()): JSONObject {
        val date=DeenWidgetData.dateKey(now,"UTC")
        fun prayer(name: String,at: Long)=JSONObject().put("name",name).put("label",name).put("time","05:30").put("at",at)
        val today=JSONArray().put(prayer("Fajr",now-120_000)).put(prayer("Sunrise",now+60_000)).put(prayer("Dhuhr",now+120_000)).put(prayer("Asr",now+180_000)).put(prayer("Maghrib",now+240_000)).put(prayer("Isha",now+300_000))
        val day=JSONObject().put("date",date).put("hijri","20 Jumādá al-ūlá 1448").put("hijriShort","20 Jumādá al-ūlá").put("gregorian",date).put("prayers",today)
            .put("ayah",JSONObject().put("ref","1:2").put("ar","الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ").put("text","All praise is for Allah, Lord of all worlds.").put("surah",""))
        return JSONObject().put("v",1).put("schema",2).put("updatedAt",now).put("date",date).put("timezone","UTC").put("language","en").put("theme","light")
            .put("place","Test city").put("method","UAE (IACAD)").put("days",JSONArray().put(day)).put("today",today).put("tomorrow",JSONArray())
            .put("config",JSONObject().put("location",JSONObject().put("latitude",25.2048).put("longitude",55.2708)).put("timeFormat","24"))
    }
    @Test fun a_legacyMigrationRetainsOriginalAndNeverErasesCounter()=runBlocking {
        val old=snapshot().toString()
        context.getSharedPreferences("deen_widgets",Context.MODE_PRIVATE).edit().putString("snapshot",old).commit()
        assertNotNull(WidgetRepository.read(context)[WidgetRepository.SNAPSHOT])
        assertEquals(old,context.getSharedPreferences("deen_widgets",Context.MODE_PRIVATE).getString("snapshot",null))
        WidgetRepository.command(context,command("restore").put("state",state(9)).put("label","Subhan Allah").toString())
        WidgetRepository.clearDerived(context)
        val persisted=WidgetRepository.read(context)
        assertNull(persisted[WidgetRepository.SNAPSHOT])
        assertEquals(9,JSONObject(persisted[WidgetRepository.TASBIH]!!).getInt("count"))
        assertEquals(old,context.getSharedPreferences("deen_widgets",Context.MODE_PRIVATE).getString("snapshot",null))
    }
    @Test fun b_hundredConcurrentTapsPreserveRealHistoryAndGoalSemantics()=runBlocking {
        WidgetRepository.command(context,command("restore").put("state",state()).toString())
        (1..100).map { i -> async(Dispatchers.IO) { WidgetRepository.command(context,command("tap").put("idempotencyKey","concurrent-$i").toString()) } }.awaitAll()
        val stored=JSONObject(WidgetRepository.read(context)[WidgetRepository.TASBIH]!!)
        assertEquals(1,stored.getInt("count")); assertEquals(5,stored.getInt("rounds"))
        val days=stored.getJSONObject("days"); assertEquals(107L,days.keys().asSequence().sumOf { days.getLong(it) })
        assertEquals("saved-session",stored.getJSONArray("sessions").getJSONObject(0).getString("id"))
    }
    @Test fun c_duplicateCommandsAreIdempotentAndHomeCannotOverwriteTaps()=runBlocking {
        WidgetRepository.command(context,command("restore").put("state",state()).toString())
        val tap=command("tap").put("idempotencyKey","one-exact-tap").toString()
        WidgetRepository.command(context,tap); WidgetRepository.command(context,tap)
        val incoming=snapshot().put("tasbih",JSONObject().put("count",0).put("target",33))
        assertTrue(WidgetRepository.publish(context,incoming.toString()))
        assertEquals(1,JSONObject(WidgetRepository.read(context)[WidgetRepository.TASBIH]!!).getInt("count"))
        assertEquals(1,JSONObject(WidgetRepository.json(context)!!).getJSONObject("tasbih").getInt("count"))
    }
    @Test fun d_conflictingBackgroundConfigurationIsRejected()=runBlocking {
        val foreground=snapshot().put("place","New selected city")
        WidgetRepository.publish(context,foreground.toString())
        val stale=snapshot().put("expectedConfig","old-config").put("place","Old city")
        assertFalse(WidgetRepository.publish(context,stale.toString()))
        assertEquals("New selected city",JSONObject(WidgetRepository.json(context)!!).getString("place"))
    }
    @Test fun e_cachedAyahSurvivesUnrelatedPublications()=runBlocking {
        val original=snapshot(); WidgetRepository.publish(context,original.toString())
        val update=snapshot(); update.getJSONArray("days").getJSONObject(0).put("ayah",JSONObject.NULL)
        WidgetRepository.publish(context,update.toString())
        assertEquals("1:2",DeenWidgetData.parse(WidgetRepository.read(context)).ayah!!.ref)
    }
    @Test fun f_redrawDoesNotPretendToRefreshSourceFreshness()=runBlocking {
        WidgetRepository.publish(context,snapshot().put("updatedAt",1234).toString())
        WidgetRepository.tick(context)
        assertEquals(1234L,DeenWidgetData.parse(WidgetRepository.read(context)).updatedAt)
    }
    @Test fun g_nextPrayerSkipsSunriseAndExpiredDataNeverReturnsPastFajr() {
        val now=1_800_000_000_000L
        val json=snapshot(now); val model=DeenWidgetData.parse(preferencesOf(WidgetRepository.SNAPSHOT to json.toString()),now)
        assertEquals("Dhuhr",DeenWidgetData.resolveNow(model,now).next!!.key)
        val expired=DeenWidgetData.parse(preferencesOf(WidgetRepository.SNAPSHOT to json.toString()),now+4*86_400_000)
        assertTrue(expired.expired); assertNull(DeenWidgetData.resolveNow(expired,now+4*86_400_000).next)
    }
    @Test fun h_calendarSelectsMatchingDayAfterMidnight() {
        val now=1_800_000_000_000L; val json=snapshot(now); val tomorrow=snapshot(now+86_400_000).getJSONArray("days").getJSONObject(0)
        tomorrow.put("hijri","new-calendar-day")
        json.getJSONArray("days").put(tomorrow)
        val model=DeenWidgetData.parse(preferencesOf(WidgetRepository.SNAPSHOT to json.toString()),now+86_400_000)
        assertEquals("new-calendar-day",model.hijri); assertFalse(model.expired)
        assertTrue(model.today.all { it.at>=now+86_400_000-120_000 })
    }
    @Test fun i_goalResetPhraseAndSessionsDoNotAlterExistingHistory() {
        var current=state(32)
        current=TasbihStore.reduce(current.toString(),command("tap"),1_800_000_000_000L)
        assertEquals(0,current.getInt("count"));assertEquals(3,current.getInt("rounds"))
        val before=current.getJSONObject("days").toString()
        current=TasbihStore.reduce(current.toString(),command("goal").put("goal",99))
        current=TasbihStore.reduce(current.toString(),command("phrase").put("phraseId","alhamdulillah"))
        current=TasbihStore.reduce(current.toString(),command("reset"))
        assertEquals(before,current.getJSONObject("days").toString())
        assertEquals("saved-session",current.getJSONArray("sessions").getJSONObject(0).getString("id"))
    }
    @Test fun j_initNeverReplacesAnAlreadyInitializedNativeCounter() {
        val original=state(17).put("custom-preserved-field","kept")
        val result=TasbihStore.reduce(original.toString(),command("init").put("state",state(0)))
        assertEquals(17,result.getInt("count"));assertEquals("kept",result.getString("custom-preserved-field"))
    }
    @Test fun k_everyXmlLoadingErrorAndPreviewIsVisibleAndInflates() {
        val layouts=listOf(R.layout.widget_loading,R.layout.widget_error,R.layout.widget_preview_prayer,R.layout.widget_preview_ayah,R.layout.widget_preview_tasbih,R.layout.widget_preview_hijri)
        for (layout in layouts) {
            val view=LayoutInflater.from(context).inflate(layout,FrameLayout(context),false)
            assertNotNull(view.background); assertTrue(texts(view).any { it.isNotBlank() })
        }
    }
    @Test fun l_allTwentyTwoLanguagesHaveLocalizedRecoveryAndClockLabels() {
        val languages=listOf("en","ar","ur","fa","ps","fr","tr","ru","uz","kk","zh","vi","az","bs","bg","si","bn","hi","id","ms","ta","ml")
        val fallback=context.getString(R.string.widget_error)
        for(language in languages) {
            val local=localizedContext(context,language)
            assertTrue(local.getString(R.string.widget_counter).isNotBlank())
            if(language!="en") { assertNotEquals("Recovery locale $language",fallback,local.getString(R.string.widget_error));assertNotEquals("Clock locale $language","Now",local.getString(R.string.widget_now)) }
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @Test fun m_allFourActualGlanceCompositionsProduceInflatableRemoteViews()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(7)).put("label","Subhan Allah").toString())
        WidgetRepository.publish(context,snapshot().toString())
        for(widget in DEEN_WIDGETS) for(size in listOf(DpSize(150.dp,150.dp),DpSize(300.dp,170.dp),DpSize(300.dp,360.dp))) {
            val views=withTimeout(20_000) { widget.compose(context,size=size) }
            val view=views.apply(context,FrameLayout(context))
            assertTrue("${widget.javaClass.simpleName} $size must have text, not an invisible frame",texts(view).any { it.isNotBlank() })
            assertFalse(texts(view).any { it.contains("Unable to show") || it.contains("Can't show content") })
            val expected = when(widget) {
                is PrayerWidget -> "Dhuhr"
                is AyahWidget -> "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
                is TasbihWidget -> "7"
                else -> "20"
            }
            assertTrue("${widget.javaClass.simpleName} $size must render its actual data",texts(view).contains(expected))
            if(widget is HijriWidget) assertTrue(texts(view).containsAll(listOf("20","Jumādá al-ūlá","1448")))
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @Test fun n_noSnapshotStillRendersVisibleRecoverableContentForEveryFamily()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(11)).toString())
        WidgetRepository.clearDerived(context)
        for(widget in DEEN_WIDGETS) {
            val views=withTimeout(20_000) { widget.compose(context,size=DpSize(150.dp,150.dp)) }
            val content=texts(views.apply(context,FrameLayout(context)))
            val expected=when(widget) {
                is PrayerWidget -> context.getString(R.string.widget_choose)
                is TasbihWidget -> "11"
                else -> context.getString(R.string.widget_open)
            }
            assertTrue("${widget.javaClass.simpleName} must not be an invisible card",content.contains(expected))
        }
    }
    @Test fun o_configPreconditionComparesJsonSemanticsNotObjectFieldOrder()=runBlocking {
        val foreground=snapshot();WidgetRepository.publish(context,foreground.toString())
        val expected=JSONObject().put("timeFormat","24").put("location",JSONObject().put("longitude",55.2708).put("latitude",25.2048))
        val background=snapshot().put("expectedConfig",expected.toString()).put("place","Accepted refill")
        assertTrue(WidgetRepository.publish(context,background.toString()))
        assertEquals("Accepted refill",JSONObject(WidgetRepository.json(context)!!).getString("place"))
    }
    @Test fun p_yesterdaysRealVerseSurvivesNewRunwayButIsLabeledSavedNotDaily()=runBlocking {
        val now=System.currentTimeMillis()
        WidgetRepository.publish(context,snapshot(now-86_400_000).toString())
        val today=snapshot(now);today.getJSONArray("days").getJSONObject(0).remove("ayah")
        WidgetRepository.publish(context,today.toString())
        val saved=DeenWidgetData.parse(WidgetRepository.read(context),now)
        assertEquals("1:2",saved.ayah!!.ref);assertTrue(saved.savedAyah)
        today.put("language","ur")
        WidgetRepository.publish(context,today.toString())
        assertNull(DeenWidgetData.parse(WidgetRepository.read(context),now).ayah)
    }
    @Test fun q_savingNewSessionDoesNotTrimAnyPreviouslyImportedSession() {
        val original=state(9);val history=JSONArray()
        for(i in 0..84) history.put(JSONObject().put("id","kept-$i").put("count",i))
        original.put("sessions",history)
        val saved=TasbihStore.reduce(original.toString(),command("saveSession").put("label","Subhan Allah"))
        assertEquals(86,saved.getJSONArray("sessions").length())
        assertEquals("kept-84",saved.getJSONArray("sessions").getJSONObject(85).getString("id"))
        assertEquals(0,saved.getInt("count"))
    }
    @OptIn(ExperimentalGlanceApi::class)
    @Test fun r_selectedRtlWorksEvenWhenTheHostLanguageIsEnglish()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(7)).toString())
        for(language in listOf("ar","ur","fa","ps")) {
            WidgetRepository.publish(context,snapshot().put("language",language).toString())
            val views=withTimeout(20_000) { TasbihWidget().compose(context,size=DpSize(300.dp,180.dp)) }
            val view=views.apply(context,FrameLayout(context))
            assertEquals(language,View.LAYOUT_DIRECTION_RTL,view.findViewById<View>(R.id.widget_direction).layoutDirection)
            assertTrue(texts(view).contains("7"));assertTrue(texts(view).contains("/ 33"))
        }
    }
    @Test fun s_v1SnapshotStillDecodesWithoutChangingOrDeletingItsFields() {
        val now=System.currentTimeMillis();val original=snapshot(now)
        original.put("ayah",original.getJSONArray("days").getJSONObject(0).getJSONObject("ayah"))
        original.remove("days");original.remove("schema");original.remove("config");original.remove("date")
        val raw=original.toString()
        val parsed=DeenWidgetData.parse(preferencesOf(WidgetRepository.SNAPSHOT to raw),now)
        assertFalse(parsed.expired);assertEquals(6,parsed.today.size);assertEquals("1:2",parsed.ayah!!.ref)
        assertEquals("Dhuhr",DeenWidgetData.resolveNow(parsed,now).next!!.key)
        assertEquals(raw,original.toString())
    }
    @Test fun t_additiveAppearanceDefaultsSafelyAndPreservesV1Brightness() {
        val original=snapshot()
        fun parse()=DeenWidgetData.parse(preferencesOf(WidgetRepository.SNAPSHOT to original.toString()))
        assertEquals("islamic",parse().themeFamily);assertFalse(parse().dark)
        original.getJSONObject("config").put("themeFamily","palestine");original.put("theme","dark")
        assertEquals("palestine",parse().themeFamily);assertTrue(parse().dark)
        original.getJSONObject("config").put("themeFamily","unknown")
        assertEquals("islamic",parse().themeFamily);assertTrue(parse().dark)
    }
    @Test fun u_aStaleBackgroundRefillCannotUndoAThemeChangeOrCounterHistory()=runBlocking {
        WidgetRepository.command(context,command("restore").put("state",state(19)).put("label","Subhan Allah").toString())
        val first=snapshot();first.getJSONObject("config").put("themeFamily","islamic").put("dark",false)
        WidgetRepository.publish(context,first.toString());val expected=first.getJSONObject("config").toString()
        val changed=snapshot().put("theme","dark");changed.getJSONObject("config").put("themeFamily","palestine").put("dark",true)
        assertTrue(WidgetRepository.publish(context,changed.toString()))
        assertFalse(WidgetRepository.publish(context,first.put("expectedConfig",expected).toString()))
        val parsed=DeenWidgetData.parse(WidgetRepository.read(context));assertEquals("palestine",parsed.themeFamily);assertTrue(parsed.dark)
        assertEquals(19,parsed.tasbih!!.count)
        assertEquals("saved-session",JSONObject(WidgetRepository.read(context)[WidgetRepository.TASBIH]!!).getJSONArray("sessions").getJSONObject(0).getString("id"))
        val refill=snapshot().put("theme","dark").put("expectedConfig",changed.getJSONObject("config").toString()).put("config",changed.getJSONObject("config"))
        assertTrue(WidgetRepository.publish(context,refill.toString()));assertEquals("palestine",DeenWidgetData.parse(WidgetRepository.read(context)).themeFamily)
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun v_allFourPalettesRenderActualDataColorsAndUnclippedControlsAcrossSizes()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(7)).put("label","Subhan Allah").toString())
        val sizes=listOf(DpSize(128.dp,128.dp),DpSize(150.dp,150.dp),DpSize(300.dp,170.dp),DpSize(220.dp,280.dp),DpSize(300.dp,360.dp))
        for(family in listOf("islamic","palestine")) for(dark in listOf(false,true)) {
            val json=snapshot().put("theme",if(dark) "dark" else "light");json.getJSONObject("config").put("themeFamily",family).put("dark",dark)
            WidgetRepository.publish(context,json.toString());val palette=widgetPalette(family,dark)
            for(widget in DEEN_WIDGETS) for(size in sizes) {
                val views=withTimeout(20_000) { widget.compose(context,size=size) }
                val view=views.apply(context,FrameLayout(context));measure(view,size)
                val expected=when(widget) { is PrayerWidget->"Dhuhr";is AyahWidget->"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";is TasbihWidget->"7";else->"20" }
                val main=descendants(view).filterIsInstance<TextView>().firstOrNull { it.text.toString()==expected }
                assertNotNull("$family/$dark ${widget.javaClass.simpleName} $size real content",main)
                assertEquals("$family/$dark ${widget.javaClass.simpleName} ink",context.getColor(palette.ink),main!!.currentTextColor)
                if(widget is PrayerWidget) { assertVisibleText(view,"Dhuhr");assertVisibleText(view,"05:30") }
                if(widget is HijriWidget) assertHijriVisible(view)
                if(widget is TasbihWidget) {
                    for(text in listOf("7","/ 33","+1",context.getString(R.string.widget_reset)))assertVisibleText(view,text)
                    val bar=descendants(view).filterIsInstance<ProgressBar>().single()
                    assertFalse(bar.isIndeterminate);assertEquals(7f/33f,bar.progress.toFloat()/bar.max,0.015f)
                    assertEquals(context.getColor(palette.accent),bar.progressTintList!!.defaultColor)
                }
                if(widget is PrayerWidget && size.height.value>=145) {
                    assertEquals(context.getColor(palette.muted),view.findViewById<TextView>(R.id.widget_clock).currentTextColor)
                    assertEquals(context.getColor(palette.muted),view.findViewById<TextView>(R.id.widget_clock_label).currentTextColor)
                }
                // Optional internal raster of actual test-composed RemoteViews.
                // Not a home-screen/device screenshot or a running-app gallery.
                System.getProperty("islamic.widgets.captureDir")?.let { folder ->
                    val file=File(folder,"${family}_${if(dark) "dark" else "light"}_${widget.javaClass.simpleName}_${size.width.value.toInt()}x${size.height.value.toInt()}.png")
                    file.parentFile?.mkdirs();val bitmap=Bitmap.createBitmap(view.width,view.height,Bitmap.Config.ARGB_8888)
                    val canvas=Canvas(bitmap);canvas.drawColor(0xFF71817A.toInt());view.draw(canvas)
                    file.outputStream().use { bitmap.compress(Bitmap.CompressFormat.PNG,100,it) };bitmap.recycle()
                    File(folder,file.nameWithoutExtension+".txt").writeText(describe(view))
                }
            }
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @Config(qualifiers="night")
    @Test fun w_explicitLightAppPaletteDoesNotInheritTheLaunchersDarkMode()=runBlocking(Dispatchers.Default) {
        val json=snapshot();json.getJSONObject("config").put("themeFamily","palestine")
        WidgetRepository.publish(context,json.toString())
        val views=withTimeout(20_000) { HijriWidget().compose(context,size=DpSize(300.dp,170.dp)) }
        val actual=descendants(views.apply(context,FrameLayout(context))).filterIsInstance<TextView>().first { it.text.toString()=="20" }
        assertEquals(context.getColor(R.color.widget_palestine_light_ink),actual.currentTextColor)
    }
    @Test fun x_progressIsClampedAndNeverChangesTheGoalRolloverContract() {
        assertEquals(0f,tasbihProgress(0,33));assertEquals(7f/33f,tasbihProgress(7,33));assertEquals(1f,tasbihProgress(40,33))
        assertEquals(0f,tasbihProgress(-1,33));assertEquals(1f,tasbihProgress(1,0))
        val completed=TasbihStore.reduce(state(32).toString(),command("tap"))
        assertEquals(0,completed.getInt("count"));assertEquals(3,completed.getInt("rounds"));assertEquals(0f,tasbihProgress(completed.getInt("count"),33))
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun y_longGoalsAndAllTwentyTwoResetLabelsFitTheCompactCounter()=runBlocking(Dispatchers.Default) {
        val languages=listOf("en","ar","ur","fa","ps","fr","tr","ru","uz","kk","zh","vi","az","bs","bg","si","bn","hi","id","ms","ta","ml")
        for(language in languages) {
            WidgetRepository.command(context,command("restore").put("state",state(999_999,1_000_000)).put("label","Subhan Allah").toString())
            val json=snapshot().put("language",language);json.getJSONObject("config").put("themeFamily","palestine")
            WidgetRepository.publish(context,json.toString());val size=DpSize(128.dp,128.dp)
            val views=withTimeout(20_000) { TasbihWidget().compose(context,size=size) }
            val view=views.apply(context,FrameLayout(context));measure(view,size)
            for(text in listOf("999999","/ 1000000","+1",localizedContext(context,language).getString(R.string.widget_reset)))assertVisibleText(view,text)
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @Config(sdk=[24])
    @Test fun z_minimumAndroidStillInflatesAllFourGlassWidgetsWithoutBlurOrNewPermissions()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(7)).put("label","Subhan Allah").toString())
        val json=snapshot().put("theme","dark");json.getJSONObject("config").put("themeFamily","palestine")
        WidgetRepository.publish(context,json.toString())
        for(widget in DEEN_WIDGETS) {
            val views=withTimeout(20_000) { widget.compose(context,size=DpSize(150.dp,150.dp)) }
            val actual=texts(views.apply(context,FrameLayout(context)))
            assertFalse(actual.any { it.contains("Unable to show") || it.contains("Can't show content") });assertTrue(actual.any { it.isNotBlank() })
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun za_largeSystemTypeDoesNotClipCompactPrayerOrCounterControls()=runBlocking(Dispatchers.Default) {
        org.robolectric.RuntimeEnvironment.setFontScale(1.3f)
        try {
            WidgetRepository.command(context,command("restore").put("state",state(7)).put("label","Subhan Allah").toString())
            WidgetRepository.publish(context,snapshot().toString())
            for(size in listOf(DpSize(128.dp,128.dp),DpSize(150.dp,150.dp),DpSize(300.dp,170.dp),DpSize(300.dp,360.dp))) for(widget in listOf(PrayerWidget(),TasbihWidget())) {
                val views=withTimeout(20_000) { widget.compose(context,size=size) };val view=views.apply(context,FrameLayout(context));measure(view,size)
                if(widget is PrayerWidget) { assertVisibleText(view,"Dhuhr");assertVisibleText(view,"05:30") }
                else for(text in listOf("7","/ 33","+1",context.getString(R.string.widget_reset)))assertVisibleText(view,text)
            }
        } finally { org.robolectric.RuntimeEnvironment.setFontScale(1f) }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun zb_resizeBreakpointsKeepTheHeadlineCounterAndActionsVisible()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(7)).put("label","Subhan Allah").toString())
        WidgetRepository.publish(context,snapshot().put("theme","dark").toString())
        val sizes=listOf(DpSize(128.dp,190.dp),DpSize(150.dp,190.dp),DpSize(300.dp,190.dp),DpSize(300.dp,230.dp),DpSize(300.dp,250.dp),DpSize(300.dp,310.dp),DpSize(180.dp,360.dp),DpSize(480.dp,128.dp))
        for(size in sizes) for(widget in DEEN_WIDGETS) {
            val views=withTimeout(20_000) { widget.compose(context,size=size) };val view=views.apply(context,FrameLayout(context));measure(view,size)
            when(widget) {
                is PrayerWidget->{assertVisibleText(view,"Dhuhr");assertVisibleText(view,"05:30")}
                is TasbihWidget->for(text in listOf("7","/ 33","+1",context.getString(R.string.widget_reset)))assertVisibleText(view,text)
                is HijriWidget->assertHijriVisible(view)
                else->assertVisibleText(view,"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",allowEllipsis=true)
            }
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun zc_longVerseAndMeaningEllipsizeAtWholeLinesInsteadOfClipping()=runBlocking(Dispatchers.Default) {
        val json=snapshot();val ayah=json.getJSONArray("days").getJSONObject(0).getJSONObject("ayah")
        // Stress-only repetitions, never published as real daily content.
        val arabic=List(20){ayah.getString("ar")}.joinToString(" ")
        val meaning=List(12){ayah.getString("text")}.joinToString(" ")
        ayah.put("ar",arabic).put("text",meaning);WidgetRepository.publish(context,json.toString())
        for(size in listOf(DpSize(128.dp,128.dp),DpSize(150.dp,150.dp),DpSize(300.dp,230.dp),DpSize(300.dp,300.dp),DpSize(300.dp,360.dp))) {
            val views=withTimeout(20_000) { AyahWidget().compose(context,size=size) };val view=views.apply(context,FrameLayout(context));measure(view,size)
            assertVisibleText(view,arabic,allowEllipsis=true)
            if(size.height.value>=230)assertVisibleText(view,meaning,allowEllipsis=true)
        }
    }
    @Test fun zd_explicitCounterBoundaryProtectsFullStateAndAcknowledgesBeforeRedraw()=runBlocking {
        val failures=mutableListOf<Throwable>();val scope=CoroutineScope(SupervisorJob()+Dispatchers.IO+CoroutineExceptionHandler { _,error -> failures.add(error) })
        val release=CompletableDeferred<Unit>();val bridge=TasbihBridge(scope,redraw={release.await();throw LinkageError("redraw unavailable")})
        try {
            val original=state(8).put("unknown","retain")
            WidgetRepository.command(context,command("restore").put("state",original).toString())
            val first=Reply();bridge.read(context,first);assertEquals(8,JSONObject(withTimeout(10_000){first.value.await()}!!).getInt("count"))
            val imported=Reply()
            bridge.command(context,command("init").put("state",state(0)).put("label","Subhan Allah").put("idempotencyKey","bridge-init").toString(),imported)
            val result=JSONObject(withTimeout(10_000){imported.value.await()}!!);assertEquals(8,result.getInt("count"));assertEquals("retain",result.getString("unknown"))
            val tapped=Reply();val tap=command("tap").put("idempotencyKey","bridge-one-tap").toString();bridge.command(context,tap,tapped)
            assertEquals(9,JSONObject(withTimeout(10_000){tapped.value.await()}!!).getInt("count"))
            assertEquals(9,JSONObject(WidgetRepository.read(context)[WidgetRepository.TASBIH]!!).getInt("count"))
            release.complete(Unit);delay(220);assertTrue(failures.isEmpty());assertEquals(1,tapped.settlements)
            val duplicate=Reply();bridge.command(context,tap,duplicate);assertEquals(9,JSONObject(withTimeout(10_000){duplicate.value.await()}!!).getInt("count"))
            assertEquals("saved-session",JSONObject(WidgetRepository.read(context)[WidgetRepository.TASBIH]!!).getJSONArray("sessions").getJSONObject(0).getString("id"))
        } finally { scope.cancel() }
    }
    @Test fun ze_counterReadWriteAndRuntimeErrorsRejectExactlyOnceWithoutEscapingScope()=runBlocking {
        val escaped=mutableListOf<Throwable>();val scope=CoroutineScope(SupervisorJob()+Dispatchers.IO+CoroutineExceptionHandler { _,error -> escaped.add(error) })
        try {
            for(error in listOf(java.io.IOException("unavailable"),IllegalStateException("not ready"),LinkageError("binary mismatch"))) {
                val bridge=TasbihBridge(scope,readState={throw error},applyCommand={_,_->throw error},redraw={fail("Failed commands cannot redraw")})
                val read=Reply();bridge.read(context,read);withTimeout(10_000){read.failed.await()};assertEquals("E_TASBIH_READ",read.code);assertEquals(1,read.settlements)
                val write=Reply();bridge.command(context,"{}",write);withTimeout(10_000){write.failed.await()};assertEquals("E_TASBIH_COMMAND",write.code);assertEquals(1,write.settlements)
            }
            delay(150);assertTrue(escaped.isEmpty())
        } finally { scope.cancel() }
    }
    @Test fun zf_aReleasedReactReplyCannotCrashTheCounterCoroutineOrUndoItsCommit()=runBlocking {
        WidgetRepository.command(context,command("restore").put("state",state(8)).toString())
        val escaped=mutableListOf<Throwable>();val scope=CoroutineScope(SupervisorJob()+Dispatchers.IO+CoroutineExceptionHandler { _,error -> escaped.add(error) })
        try {
            val reply=object:TasbihReply { override fun resolve(value:String?){throw IllegalStateException("React runtime destroyed")};override fun reject(code:String,cause:Throwable){fail("Do not reject a saved command a second time")} }
            TasbihBridge(scope,redraw={}).command(context,command("tap").put("idempotencyKey","released-reply-tap").toString(),reply).join()
            assertEquals(9,JSONObject(WidgetRepository.read(context)[WidgetRepository.TASBIH]!!).getInt("count"));assertTrue(escaped.isEmpty())
        } finally { scope.cancel() }
    }
    @Test fun zg_hijriTypographySeparatesOnlyTheKnownPublishedDateContract() {
        assertEquals(Triple("12","Jumādá al-ākhirah","1448"),hijriParts("12 Jumādá al-ākhirah 1448","12 Jumādá al-ākhirah"))
        assertEquals(Triple("١٢","جمادى الآخرة","١٤٤٨"),hijriParts("١٢ جمادى الآخرة ١٤٤٨","١٢ جمادى الآخرة"))
        assertNull(hijriParts("An older complete date","older"));assertNull(hijriParts("12 month unexpected suffix","12 month"))
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun zh_screenshotShapedSquaresFitTwelveHourTimesFullCityAndLongHijriMonth()=runBlocking(Dispatchers.Default) {
        WidgetRepository.command(context,command("restore").put("state",state(18)).put("label","Subhan Allah").toString())
        val json=snapshot().put("place","Dubai, United Arab Emirates").put("theme","dark")
        json.getJSONObject("config").put("timeFormat","12")
        val day=json.getJSONArray("days").getJSONObject(0);day.put("hijri","12 Jumādá al-ākhirah 1448").put("hijriShort","12 Jumādá al-ākhirah").put("gregorian","Sun, November 22, 2026")
        val prayers=day.getJSONArray("prayers");for(i in 0 until prayers.length())prayers.getJSONObject(i).put("time","12:08 PM")
        WidgetRepository.publish(context,json.toString())
        for(size in listOf(DpSize(160.dp,160.dp),DpSize(170.dp,170.dp),DpSize(180.dp,180.dp))) for(widget in DEEN_WIDGETS) {
            val views=withTimeout(20_000){widget.compose(context,size=size)};val view=views.apply(context,FrameLayout(context));measure(view,size)
            when(widget) {
                is PrayerWidget->{assertVisibleText(view,"Dhuhr");assertVisibleText(view,"12:08 PM");val time=descendants(view).filterIsInstance<TextView>().first { it.text.toString()=="12:08 PM" };assertTrue(time.text is android.text.Spanned);assertTrue((time.text as android.text.Spanned).getSpans(0,time.text.length,android.text.style.AbsoluteSizeSpan::class.java).isNotEmpty())}
                is HijriWidget->for(text in listOf("12","Jumādá al-ākhirah","1448","Sun, November 22, 2026"))assertVisibleText(view,text)
                is TasbihWidget->for(text in listOf("18","/ 33","+1",context.getString(R.string.widget_reset)))assertVisibleText(view,text)
                else->assertVisibleText(view,"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",allowEllipsis=true)
            }
        }
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun zi_localizedDatesVersesRecoveryAndPickerPreviewsKeepWholeLinesAtMinimumSize()=runBlocking(Dispatchers.Default) {
        val languages=listOf("en","ar","ur","fa","ps","fr","tr","ru","uz","kk","zh","vi","az","bs","bg","si","bn","hi","id","ms","ta","ml")
        val recovery=object:WidgetBase("tasbih") { @Composable override fun WidgetBody(snap:DeenWidgetData.Snapshot) { TasbihWidget().WidgetBody(snap.copy(tasbih=null)) } }
        val errors=mutableListOf<String>()
        fun check(label:String,work:()->Unit) {try {work()} catch(error:AssertionError) {errors.add("$label: ${error.message}")}}
        try {
            for(language in languages) {
                org.robolectric.RuntimeEnvironment.setFontScale(1f)
                val local=localizedContext(context,language)
                for(layout in listOf(R.layout.widget_preview_prayer,R.layout.widget_preview_ayah,R.layout.widget_preview_tasbih,R.layout.widget_preview_hijri)) {
                    val view=LayoutInflater.from(local).inflate(layout,FrameLayout(local),false);measure(view,DpSize(128.dp,128.dp))
                    for(text in texts(view).filter { it.isNotBlank() }) check("$language preview $layout") {assertVisibleText(view,text)}
                }
                val json=snapshot().put("language",language);val day=json.getJSONArray("days").getJSONObject(0)
                val full=local.getString(R.string.widget_preview_hijri);val year=local.getString(R.string.widget_preview_hijri_year)
                day.put("hijri",full).put("hijriShort",full.removeSuffix(" $year")).put("gregorian",local.getString(R.string.widget_preview_gregorian))
                WidgetRepository.publish(context,json.toString())
                org.robolectric.RuntimeEnvironment.setFontScale(1.3f)
                for(widget in listOf(HijriWidget(),AyahWidget(),recovery)) {
                    val size=DpSize(128.dp,128.dp);val views=withTimeout(20_000){widget.compose(context,size=size)};val view=views.apply(context,FrameLayout(context));measure(view,size)
                    check("$language ${widget.javaClass.simpleName}") { when(widget) {
                        is HijriWidget->for(text in listOf(local.getString(R.string.widget_preview_hijri_day),local.getString(R.string.widget_preview_hijri_month),year))assertVisibleText(view,text)
                        is AyahWidget->assertVisibleText(view,"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",allowEllipsis=true)
                        else->{assertVisibleText(view,local.getString(R.string.widget_tasbih));assertVisibleText(view,local.getString(R.string.widget_counter),allowEllipsis=true);assertVisibleText(view,local.getString(R.string.widget_open),allowEllipsis=true)}
                    } }
                }
            }
            assertTrue(errors.joinToString("\n\n"),errors.isEmpty())
        } finally {org.robolectric.RuntimeEnvironment.setFontScale(1f)}
    }
    @OptIn(ExperimentalGlanceApi::class)
    @GraphicsMode(GraphicsMode.Mode.NATIVE)
    @Test fun zj_compactTwelveHourPeriodRemainsReadableAtLargeSystemType()=runBlocking(Dispatchers.Default) {
        val json=snapshot();json.getJSONObject("config").put("timeFormat","12")
        val prayers=json.getJSONArray("days").getJSONObject(0).getJSONArray("prayers")
        for(i in 0 until prayers.length())prayers.getJSONObject(i).put("time","12:08 PM")
        WidgetRepository.publish(context,json.toString())
        org.robolectric.RuntimeEnvironment.setFontScale(1.3f)
        try {
            for(size in listOf(DpSize(128.dp,128.dp),DpSize(150.dp,150.dp),DpSize(160.dp,160.dp))) {
                val views=withTimeout(20_000){PrayerWidget().compose(context,size=size)};val view=views.apply(context,FrameLayout(context));measure(view,size)
                assertVisibleText(view,"Dhuhr");assertVisibleText(view,"12:08 PM")
                val time=descendants(view).filterIsInstance<TextView>().single {it.text.toString()=="12:08 PM"}
                val span=(time.text as android.text.Spanned).getSpans(0,time.text.length,android.text.style.AbsoluteSizeSpan::class.java).single()
                val minimum=android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_SP,10f,context.resources.displayMetrics)
                assertTrue("AM/PM must not shrink below 10sp",span.size>=minimum)
            }
        } finally {org.robolectric.RuntimeEnvironment.setFontScale(1f)}
    }
    private class Reply:TasbihReply {
        val value=CompletableDeferred<String?>();val failed=CompletableDeferred<Unit>();var code:String?=null;var settlements=0
        override fun resolve(value:String?){settlements++;this.value.complete(value)}
        override fun reject(code:String,cause:Throwable){settlements++;this.code=code;failed.complete(Unit)}
    }
    private fun assertHijriVisible(root:View) { for(text in listOf("20","Jumādá al-ūlá","1448"))assertVisibleText(root,text) }
    private fun describe(view: View,depth: Int=0): String = "  ".repeat(depth)+"${view.javaClass.simpleName} ${view.width}x${view.height} at ${view.x},${view.y} lp=${view.layoutParams.width}x${view.layoutParams.height} weight=${(view.layoutParams as? android.widget.LinearLayout.LayoutParams)?.weight} ${(view as? TextView)?.text}\n"+if(view is ViewGroup)(0 until view.childCount).joinToString("") { describe(view.getChildAt(it),depth+1) } else ""
    private fun measure(view: View,size: DpSize) {
        val density=context.resources.displayMetrics.density
        val width=(size.width.value*density).toInt();val height=(size.height.value*density).toInt()
        view.measure(View.MeasureSpec.makeMeasureSpec(width,View.MeasureSpec.EXACTLY),View.MeasureSpec.makeMeasureSpec(height,View.MeasureSpec.EXACTLY));view.layout(0,0,width,height)
    }
    private fun descendants(view: View): List<View> = listOf(view)+if(view is ViewGroup)(0 until view.childCount).flatMap { descendants(view.getChildAt(it)) } else emptyList()
    private fun assertVisibleText(root: View,text: String,allowEllipsis: Boolean=false) {
        val view=descendants(root).filterIsInstance<TextView>().firstOrNull { it.text.toString()==text }
        assertNotNull("Missing $text",view);view!!
        assertTrue("$text has no measured area",view.width>0 && view.height>0)
        val bounds=Rect(0,0,view.width,view.height);(root as ViewGroup).offsetDescendantRectToMyCoords(view,bounds)
        assertTrue("$text is outside ${root.width}x${root.height}: $bounds\n${describe(root)}",bounds.left>=0 && bounds.top>=0 && bounds.right<=root.width && bounds.bottom<=root.height)
        val layout=view.layout
        assertNotNull("$text has no text layout",layout)
        assertTrue("$text is vertically clipped (${layout.height} > ${view.height})\n${describe(root)}",layout.height<=view.height-view.paddingTop-view.paddingBottom)
        if(!allowEllipsis)for(line in 0 until layout.lineCount) assertEquals("$text is ellipsized",0,layout.getEllipsisCount(line))
    }
    private fun texts(view: View): List<String> = when(view) {
        is TextView -> listOf(view.text.toString())
        is ViewGroup -> (0 until view.childCount).flatMap { texts(view.getChildAt(it)) }
        else -> emptyList()
    }
}
