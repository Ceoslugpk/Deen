package com.deen.widgets

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/**
 * The snapshot the app published, read back by the widgets.
 *
 * The store is deliberately ordinary SharedPreferences under a fixed name.
 * It is not a DataStore and not a database: the app writes one small string
 * and the widget reads one small string, and a preference file is the one
 * thing both sides get for free without an extra dependency in the widget's
 * own classpath.
 *
 * This is safe across processes because a Glance widget is laid out inside
 * this app — the launcher only renders the RemoteViews it is handed. So the
 * file is read by the same uid that wrote it, and MODE_PRIVATE is enough.
 */
object DeenWidgetData {

    const val PREFS = "deen_widgets"
    const val KEY_SNAPSHOT = "snapshot"

    /** One of the six moments in a day. */
    data class Prayer(
        val key: String,   // 'Fajr' — the stable English key
        val label: String, // already localised
        val time: String,  // already formatted
        val at: Long,      // epoch ms
    )

    data class Ayah(
        val ref: String,
        val ar: String,
        val text: String,
        val surah: String,
    )

    data class Tasbih(val count: Int, val target: Int, val label: String)

    class Snapshot internal constructor(
        val updatedAt: Long,
        val place: String,
        val method: String,
        val hijri: String,
        val hijriShort: String,
        val today: List<Prayer>,
        val tomorrow: List<Prayer>,
        val ayah: Ayah?,
        val tasbih: Tasbih?,
        val dark: Boolean,
    ) {
        /** False until the app has a location and has published real times. */
        val isEmpty: Boolean get() = today.isEmpty()
    }

    fun read(context: Context): Snapshot {
        val raw = try {
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString(KEY_SNAPSHOT, null)
        } catch (e: Exception) {
            null
        }
        if (raw.isNullOrBlank()) return Snapshot(0, "", "", "", "", emptyList(), emptyList(), null, null, false)
        return try {
            parse(JSONObject(raw))
        } catch (e: Exception) {
            // A snapshot we cannot read is a snapshot we do not have.
            Snapshot(0, "", "", "", "", emptyList(), emptyList(), null, null, false)
        }
    }

    private fun parse(o: JSONObject): Snapshot {
        val today = prayers(o.optJSONArray("today"))
        val tomorrow = prayers(o.optJSONArray("tomorrow"))
        val ayah = o.optJSONObject("ayah")?.let {
            val ar = it.optString("ar", "")
            val text = it.optString("text", "")
            if (ar.isBlank() && text.isBlank()) null
            else Ayah(it.optString("ref", ""), ar, text, it.optString("surah", ""))
        }
        val tasbih = o.optJSONObject("tasbih")?.let {
            Tasbih(it.optInt("count", 0), it.optInt("target", 33), it.optString("label", ""))
        }
        return Snapshot(
            updatedAt = o.optLong("updatedAt", 0L),
            place = o.optString("place", ""),
            method = o.optString("method", ""),
            hijri = o.optString("hijri", ""),
            hijriShort = o.optString("hijriShort", o.optString("hijri", "")),
            today = today,
            tomorrow = tomorrow,
            ayah = ayah,
            tasbih = tasbih,
            dark = o.optString("theme", "light") == "dark",
        )
    }

    private fun prayers(array: JSONArray?): List<Prayer> {
        if (array == null) return emptyList()
        val out = ArrayList<Prayer>(array.length())
        for (i in 0 until array.length()) {
            val p = array.optJSONObject(i) ?: continue
            out.add(
                Prayer(
                    key = p.optString("name", ""),
                    label = p.optString("label", p.optString("name", "")),
                    time = p.optString("time", ""),
                    at = p.optLong("at", 0L),
                )
            )
        }
        return out
    }

    /** Sunrise is in the list for the schedule, but it is not a prayer. */
    fun isPrayer(key: String): Boolean = key != "Sunrise"

    /** Where we are in the day, worked out from the widget's own clock. */
    data class Now(val current: Prayer?, val next: Prayer?, val untilMs: Long)

    fun resolveNow(snap: Snapshot, now: Long = System.currentTimeMillis()): Now {
        var current: Prayer? = null
        var next: Prayer? = null
        for (p in snap.today) {
            if (p.at <= now) current = p else if (next == null) next = p
        }
        // After Isha the next one belongs to tomorrow.
        if (next == null) next = snap.tomorrow.firstOrNull()
        return Now(current, next, next?.let { (it.at - now).coerceAtLeast(0) } ?: 0L)
    }

    /** '2h 14m', '48m' — or 'now' inside the last minute. */
    fun formatUntil(ms: Long): String {
        if (ms <= 0) return ""
        val minutes = (ms / 60_000L).toInt()
        val hours = minutes / 60
        val rem = minutes % 60
        return when {
            hours > 0 -> "${hours}h ${rem}m"
            rem > 0 -> "${rem}m"
            else -> "now"
        }
    }

    /**
     * How stale the snapshot is, as words. A widget can be drawn hours after
     * the app last ran, and a countdown that has quietly stopped is worse
     * than one that says it is out of date.
     */
    fun staleness(updatedAt: Long, now: Long = System.currentTimeMillis()): String {
        if (updatedAt <= 0) return ""
        val minutes = ((now - updatedAt) / 60_000L).toInt()
        return when {
            minutes < 2 -> ""
            minutes < 60 -> "updated ${minutes}m ago"
            minutes < 60 * 24 -> "updated ${minutes / 60}h ago"
            else -> "updated ${minutes / (60 * 24)}d ago"
        }
    }
}
