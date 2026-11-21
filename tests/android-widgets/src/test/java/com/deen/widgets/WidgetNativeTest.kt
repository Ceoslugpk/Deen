package com.deen.widgets

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.datastore.preferences.core.preferencesOf
import androidx.glance.ExperimentalGlanceApi
import androidx.glance.appwidget.compose
import androidx.test.core.app.ApplicationProvider
import expo.modules.deenwidgets.R
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
        val today=JSONArray().put(prayer("Fajr",now-120_000)).put(prayer("Sunrise",now+60_000)).put(prayer("Dhuhr",now+120_000))
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
                is TasbihWidget -> "7 / 33"
                else -> "20 Jumādá al-ūlá 1448"
            }
            assertTrue("${widget.javaClass.simpleName} $size must render its actual data",texts(view).contains(expected))
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
                is TasbihWidget -> "11 / 33"
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
            assertTrue(texts(view).contains("7 / 33"))
        }
    }
    @Test fun s_v1SnapshotStillDecodesWithoutChangingOrDeletingItsFields() {
        val now=System.currentTimeMillis();val original=snapshot(now)
        original.put("ayah",original.getJSONArray("days").getJSONObject(0).getJSONObject("ayah"))
        original.remove("days");original.remove("schema");original.remove("config");original.remove("date")
        val raw=original.toString()
        val parsed=DeenWidgetData.parse(preferencesOf(WidgetRepository.SNAPSHOT to raw),now)
        assertFalse(parsed.expired);assertEquals(3,parsed.today.size);assertEquals("1:2",parsed.ayah!!.ref)
        assertEquals("Dhuhr",DeenWidgetData.resolveNow(parsed,now).next!!.key)
        assertEquals(raw,original.toString())
    }
    private fun texts(view: View): List<String> = when(view) {
        is TextView -> listOf(view.text.toString())
        is ViewGroup -> (0 until view.childCount).flatMap { texts(view.getChildAt(it)) }
        else -> emptyList()
    }
}
