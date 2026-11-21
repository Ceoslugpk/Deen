package com.deen.widgets

import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.UUID

/** Pure reducer shared by app commands and widget buttons. The whole state
 * is committed in one DataStore transaction. Existing history survives import. */
object TasbihStore {
    fun reduce(previous: String?, command: JSONObject, now: Long = System.currentTimeMillis()): JSONObject {
        val op = command.optString("op")
        require(op in setOf("init", "restore", "read", "tap", "reset", "goal", "phrase", "saveSession", "removeSession"))
        val existing = previous?.let { JSONObject(it) }
        if (op == "restore" || (existing == null && op == "init")) {
            val imported = JSONObject(command.getJSONObject("state").toString())
            require(imported.opt("count") is Number && imported.optInt("count") >= 0)
            require(imported.optInt("goal") > 0 && imported.optJSONObject("days") != null && imported.optJSONArray("sessions") != null)
            return imported // Unknown fields and all existing sessions are preserved.
        }
        val state = existing ?: throw IllegalStateException("counter_not_initialized")
        if (op == "init" || op == "read") return state
        when (op) {
            "tap" -> {
                val count = state.optInt("count") + 1
                val goal = state.optInt("goal", 33).coerceAtLeast(1)
                val complete = count >= goal
                val key = SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).apply { timeZone = TimeZone.getTimeZone("UTC") }.format(Date(now))
                val days = state.optJSONObject("days") ?: JSONObject()
                days.put(key, days.optLong(key) + 1)
                state.put("days", days).put("count", if (complete) 0 else count)
                if (complete) state.put("rounds", state.optLong("rounds") + 1)
            }
            "reset" -> state.put("count", 0)
            "goal" -> {
                val goal = command.getInt("goal"); require(goal in 1..1_000_000)
                state.put("goal", goal).put("count", 0)
            }
            "phrase" -> {
                val phrase = command.getString("phraseId"); require(phrase.isNotBlank() && phrase.length < 100)
                state.put("phraseId", phrase).put("count", 0)
            }
            "saveSession" -> {
                if (state.optInt("count") > 0) {
                    val sessions = JSONArray().put(JSONObject().put("id", UUID.randomUUID().toString())
                        .put("phrase", command.optString("label")).put("count", state.optInt("count"))
                        .put("goal", state.optInt("goal")).put("completedAt", now))
                    val old = state.optJSONArray("sessions") ?: JSONArray()
                    for (i in 0 until old.length()) sessions.put(old.get(i))
                    state.put("sessions", sessions).put("count", 0)
                }
            }
            "removeSession" -> {
                val id = command.getString("id"); val old = state.optJSONArray("sessions") ?: JSONArray(); val kept = JSONArray()
                for (i in 0 until old.length()) { val item = old.getJSONObject(i); if (item.optString("id") != id) kept.put(item) }
                state.put("sessions", kept)
            }
        }
        return state
    }
}
