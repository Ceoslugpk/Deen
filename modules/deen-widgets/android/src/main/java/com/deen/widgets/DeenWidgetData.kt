package com.deen.widgets

import androidx.datastore.preferences.core.Preferences
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/** Immutable render data; calendars are selected at render time, not at the
 * last app launch. Legacy v1 remains readable without destructive migration. */
object DeenWidgetData {
    data class Prayer(val key: String, val label: String, val time: String, val at: Long)
    data class Ayah(val ref: String, val ar: String, val text: String, val surah: String)
    data class Tasbih(val count: Int, val target: Int, val label: String)
    data class Snapshot(
        val updatedAt: Long = 0, val place: String = "", val method: String = "", val hijri: String = "", val hijriShort: String = "",
        val today: List<Prayer> = emptyList(), val upcoming: List<Prayer> = emptyList(), val ayah: Ayah? = null, val tasbih: Tasbih? = null,
        val dark: Boolean = false, val themeFamily: String = "islamic", val language: String = "en", val timezone: String = TimeZone.getDefault().id, val gregorian: String = "",
        val expired: Boolean = false, val configured: Boolean = false, val savedAyah: Boolean = false, val timeFormat: String = "24",
    ) { val isEmpty: Boolean get() = today.isEmpty() }
    fun parse(prefs: Preferences, now: Long = System.currentTimeMillis()): Snapshot {
        val raw = prefs[WidgetRepository.SNAPSHOT]
        val root = if (raw.isNullOrBlank()) JSONObject() else JSONObject(raw)
        val timezone = root.optString("timezone").ifBlank { TimeZone.getDefault().id }
        val date = dateKey(now, timezone)
        val days = root.optJSONArray("days")
        var selected: JSONObject? = null
        val all = mutableListOf<Prayer>(); var ayah: Ayah? = null; var saved = false
        if (days != null) {
            for (i in 0 until days.length()) {
                val day = days.optJSONObject(i) ?: continue
                all.addAll(prayers(day.optJSONArray("prayers")))
                if (day.optString("date") == date) selected = day
                if (day.optString("date") <= date) day.optJSONObject("ayah")?.let { ayah = ayah(it); saved = day.optString("date") != date }
            }
        } else {
            all.addAll(prayers(root.optJSONArray("today"))); all.addAll(prayers(root.optJSONArray("tomorrow")))
            // Legacy snapshots have no calendar identity. Never assert their
            // cached Hijri/today values are current on a different local day.
            if (root.optLong("updatedAt") > 0 && dateKey(root.optLong("updatedAt"), timezone) == date) {
                selected = root; ayah = root.optJSONObject("ayah")?.let { ayah(it) }
            }
        }
        if (ayah == null) root.optJSONObject("savedAyah")?.let { cached ->
            if (cached.optString("date") <= date) cached.optJSONObject("ayah")?.let { value -> ayah = ayah(value); saved = true }
        }
        val counter = prefs[WidgetRepository.TASBIH]?.let { JSONObject(it) }
        val tasbih = counter?.let { Tasbih(it.optInt("count"), it.optInt("goal",33).coerceAtLeast(1), prefs[WidgetRepository.LABEL] ?: "") }
        val configured = root.optJSONObject("config")?.optJSONObject("location") != null || root.optString("place").isNotBlank()
        return Snapshot(updatedAt=root.optLong("updatedAt"),place=root.optString("place"),method=root.optString("method"),
            hijri=selected?.optString("hijri") ?: "",hijriShort=selected?.optString("hijriShort") ?: "",
            today=prayers(selected?.optJSONArray(if (days != null) "prayers" else "today")),upcoming=all.filter { it.at > now }.sortedBy { it.at },
            ayah=ayah,tasbih=tasbih,dark=root.optString("theme")=="dark",
            themeFamily=if (root.optJSONObject("config")?.optString("themeFamily")=="palestine") "palestine" else "islamic",
            language=root.optString("language","en"),timezone=timezone,
            gregorian=selected?.optString("gregorian").orEmpty(),expired=raw!=null && selected==null,configured=configured,savedAyah=saved,
            timeFormat=root.optJSONObject("config")?.optString("timeFormat","24") ?: "24")
    }
    fun dateKey(now: Long, zone: String): String = SimpleDateFormat("yyyy-MM-dd",Locale.ROOT).apply { timeZone=TimeZone.getTimeZone(zone) }.format(Date(now))
    private fun ayah(o: JSONObject): Ayah? {
        val ar=o.optString("ar"); val text=o.optString("text")
        return if (ar.isBlank() && text.isBlank()) null else Ayah(o.optString("ref"),ar,text,o.optString("surah"))
    }
    private fun prayers(array: JSONArray?): List<Prayer> {
        if (array==null) return emptyList()
        return (0 until array.length()).mapNotNull { i -> array.optJSONObject(i)?.let { p ->
            p.optLong("at").takeIf { it>0 }?.let { Prayer(p.optString("name"),p.optString("label",p.optString("name")),p.optString("time"),it) }
        } }.sortedBy { it.at }
    }
    fun isPrayer(key: String) = key != "Sunrise"
    data class Now(val current: Prayer?, val next: Prayer?)
    fun resolveNow(snap: Snapshot, now: Long = System.currentTimeMillis()) = Now(
        snap.today.lastOrNull { it.at<=now && isPrayer(it.key) },
        if (snap.expired) null else snap.upcoming.firstOrNull { it.at>now && isPrayer(it.key) },
    )
}
