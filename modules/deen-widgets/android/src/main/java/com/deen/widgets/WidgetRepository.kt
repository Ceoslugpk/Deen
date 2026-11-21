package com.deen.widgets

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import org.json.JSONArray
import org.json.JSONObject

private val Context.widgetStore by preferencesDataStore(name = "deen_widget_state_v2")

/** One transactional native authority. No external process is declared for
 * receivers/workers, and neither Home nor a widget rewrites a second counter. */
object WidgetRepository {
    val SNAPSHOT = stringPreferencesKey("snapshot")
    val TASBIH = stringPreferencesKey("tasbih")
    val LABEL = stringPreferencesKey("tasbih_label")
    val TICK = longPreferencesKey("render_revision")
    private val MIGRATED = booleanPreferencesKey("imported_v1")
    private val COMMANDS = stringPreferencesKey("recent_commands")

    fun observe(context: Context): Flow<Preferences> = context.applicationContext.widgetStore.data
    suspend fun read(context: Context): Preferences { migrate(context); return observe(context).first() }
    private suspend fun migrate(context: Context) {
        context.applicationContext.widgetStore.edit { prefs ->
            if (prefs[MIGRATED] != true) {
                val old = context.getSharedPreferences("deen_widgets", Context.MODE_PRIVATE).getString("snapshot", null)
                // Leave the original file intact, including an unreadable value.
                if (prefs[SNAPSHOT] == null && old != null && runCatching { JSONObject(old) }.isSuccess) prefs[SNAPSHOT] = old
                prefs[MIGRATED] = true
            }
        }
    }
    suspend fun publish(context: Context, raw: String): Boolean {
        val incoming = JSONObject(raw)
        require(incoming.optInt("v") == 1 && incoming.optJSONArray("days") != null)
        migrate(context)
        var accepted = false
        context.applicationContext.widgetStore.edit { prefs ->
            // A background calculation begun under previous settings must not
            // overwrite a newer foreground configuration.
            val old = prefs[SNAPSHOT]?.let { runCatching { JSONObject(it) }.getOrNull() }
            val expected = incoming.optString("expectedConfig", "")
            if (expected.isNotEmpty()) {
                val expectedValue = runCatching { JSONObject(expected) }.getOrNull()
                if (expectedValue == null || !sameJson(old?.optJSONObject("config"), expectedValue)) return@edit
            }
            incoming.remove("expectedConfig")
            // An unrelated counter/theme write must not erase an Ayah that
            // was already cached for the same day/language.
            if (old?.optString("language","en") == incoming.optString("language","en")) {
                val before = old?.optJSONArray("days")
                val after = incoming.optJSONArray("days")
                val byDate = mutableMapOf<String, JSONObject>()
                if (before != null) for (i in 0 until before.length()) before.optJSONObject(i)?.let { byDate[it.optString("date")] = it }
                if (after != null) for (i in 0 until after.length()) after.optJSONObject(i)?.let { day ->
                    if (day.optJSONObject("ayah") == null) byDate[day.optString("date")]?.optJSONObject("ayah")?.let { day.put("ayah",it) }
                }
                // The next runway starts at today. Retain the last genuinely
                // cached verse separately instead of dropping yesterday's
                // content or relabeling it as today's verse.
                val today = incoming.optString("date")
                var saved = old.optJSONObject("savedAyah")?.takeIf { it.optString("date") <= today }
                if (before == null) old.optJSONObject("ayah")?.let { verse ->
                    val date = old.optString("date").ifBlank { DeenWidgetData.dateKey(old.optLong("updatedAt"),old.optString("timezone","UTC")) }
                    if (date <= today) saved = JSONObject().put("date",date).put("ayah",verse)
                }
                if (before != null) for (i in 0 until before.length()) before.optJSONObject(i)?.let { day ->
                    day.optJSONObject("ayah")?.let { verse ->
                        if (day.optString("date") <= today && (saved == null || day.optString("date") > saved!!.optString("date")))
                            saved = JSONObject().put("date",day.optString("date")).put("ayah",verse)
                    }
                }
                if (saved != null) incoming.put("savedAyah",saved)
            }
            accepted = true
            prefs[SNAPSHOT] = incoming.toString()
            prefs[TICK] = maxOf(System.currentTimeMillis(), (prefs[TICK] ?: 0L) + 1L)
        }
        return accepted
    }
    /** JSON object field order and 9 versus 9.0 are not config changes. */
    private fun sameJson(a: Any?, b: Any?): Boolean = when {
        a is JSONObject && b is JSONObject -> {
            val keys = a.keys().asSequence().toSet()
            keys == b.keys().asSequence().toSet() && keys.all { sameJson(a.opt(it),b.opt(it)) }
        }
        a is JSONArray && b is JSONArray -> a.length() == b.length() && (0 until a.length()).all { sameJson(a.opt(it),b.opt(it)) }
        a is Number && b is Number -> a.toDouble() == b.toDouble()
        else -> a == b
    }
    suspend fun clearDerived(context: Context) {
        migrate(context)
        context.applicationContext.widgetStore.edit { prefs -> prefs.remove(SNAPSHOT); prefs[TICK] = maxOf(System.currentTimeMillis(), (prefs[TICK] ?: 0L) + 1L) }
        // Intentionally retain TASBIH and the old import file. This is not a data reset.
    }
    suspend fun tick(context: Context) {
        context.applicationContext.widgetStore.edit { it[TICK] = maxOf(System.currentTimeMillis(), (it[TICK] ?: 0L) + 1L) }
    }
    suspend fun command(context: Context, raw: String): String {
        migrate(context)
        val command = JSONObject(raw); var result = ""
        context.applicationContext.widgetStore.edit { prefs ->
            val ids = prefs[COMMANDS]?.let { JSONArray(it) } ?: JSONArray()
            val id = command.optString("idempotencyKey")
            val duplicate = id.isNotBlank() && (0 until ids.length()).any { ids.optString(it) == id }
            if (duplicate) { result = prefs[TASBIH] ?: throw IllegalStateException("missing_counter"); return@edit }
            val previous = prefs[TASBIH]
            result = TasbihStore.reduce(previous, command).toString()
            prefs[TASBIH] = result
            if (command.has("label") && (previous == null || command.optString("op") in setOf("phrase", "restore", "saveSession"))) prefs[LABEL] = command.getString("label")
            if (id.isNotBlank()) {
                val recent = JSONArray().put(id)
                for (i in 0 until minOf(ids.length(), 127)) recent.put(ids.getString(i))
                prefs[COMMANDS] = recent.toString()
            }
            prefs[TICK] = maxOf(System.currentTimeMillis(), (prefs[TICK] ?: 0L) + 1L)
        }
        return result
    }
    suspend fun json(context: Context): String? {
        val prefs = read(context); val raw = prefs[SNAPSHOT] ?: return null
        val root = JSONObject(raw)
        prefs[TASBIH]?.let { state -> val counter=JSONObject(state); root.put("tasbih", JSONObject().put("count",counter.optInt("count")).put("target",counter.optInt("goal",33)).put("label",prefs[LABEL] ?: "")) }
        return root.toString()
    }
}
