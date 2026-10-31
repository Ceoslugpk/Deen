package com.deen.adhanalarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONArray

/**
 * Hands prayer times to the operating system as exact alarms.
 *
 * The recordings live on the device now rather than being compiled into the
 * app, and a notification can only play a sound that was compiled in - so the
 * adhan has to be played by the app when the alarm goes off, not by the
 * notification. This is the only reason this module exists.
 */
class AdhanAlarmModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "DeenAdhanAlarm"
        const val PREFS = "deen_adhan_alarms"
        const val KEY_SCHEDULE = "schedule"
        const val KEY_NEXT_INDEX = "next_index"
        const val ACTION_PLAY = "com.deen.adhanalarm.PLAY"
        const val EXTRA_FILE = "file"
        const val EXTRA_TITLE = "title"
        const val EXTRA_PRAYER = "prayer"

        /** One alarm per prayer, so each has a stable id to cancel by. */
        fun requestCodeFor(prayer: String): Int = 9000 + (prayer.hashCode() and 0x00FFFF)
    }

    override fun getName(): String = "DeenAdhanAlarm"

    private val prefs
        get() = reactContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    private val alarmManager: AlarmManager?
        get() = reactContext.getSystemService(Context.ALARM_SERVICE) as? AlarmManager

    /**
     * @param scheduleJson a JSON array of
     *   { "at": <epoch millis>, "prayer": "Fajr", "file": "/abs/path.mp3", "title": "Fajr" }
     */
    @ReactMethod
    fun schedule(scheduleJson: String, promise: Promise) {
        try {
            val items = JSONArray(scheduleJson)
            val manager = alarmManager
            if (manager == null) {
                promise.resolve(false)
                return
            }

            // Any alarm from a previous schedule is dropped first, so a prayer
            // that has been switched off does not keep sounding.
            cancelInternal(manager)
            prefs.edit()
                .putString(KEY_SCHEDULE, scheduleJson)
                .putInt(KEY_NEXT_INDEX, items.length())
                .apply()

            for (i in 0 until items.length()) {
                val item = items.optJSONObject(i) ?: continue
                val at = item.optLong("at", 0L)
                val prayer = item.optString("prayer", "prayer")
                val file = item.optString("file", "")
                val title = item.optString("title", "Prayer")
                if (at <= 0L || file.isBlank()) continue
                setExact(manager, at, prayer, file, title)
            }
            promise.resolve(true)
        } catch (error: Exception) {
            Log.e(TAG, "schedule failed", error)
            promise.reject("E_ADHAN_ALARM", error.message, error)
        }
    }

    @ReactMethod
    fun cancel(promise: Promise) {
        try {
            val manager = alarmManager
            if (manager != null) cancelInternal(manager)
            prefs.edit().remove(KEY_SCHEDULE).apply()
            promise.resolve(true)
        } catch (error: Exception) {
            Log.e(TAG, "cancel failed", error)
            promise.reject("E_ADHAN_ALARM", error.message, error)
        }
    }

    /**
     * Whether the system will actually let us use exact alarms.
     *
     * Android 12+ grants this by default but the user can withdraw it, and
     * some manufacturers refuse it. When it is missing the alarm may be late
     * or dropped, and the caller is told so it can keep the notification
     * sounding instead - a late adhan is better than a silent one.
     */
    @ReactMethod
    fun canScheduleExact(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
                promise.resolve(true)
                return
            }
            val manager = alarmManager
            promise.resolve(manager?.canScheduleExactAlarms() == true)
        } catch (error: Exception) {
            promise.resolve(false)
        }
    }

    private fun setExact(
        manager: AlarmManager,
        at: Long,
        prayer: String,
        file: String,
        title: String,
    ) {
        val intent = Intent(ACTION_PLAY).apply {
            setClass(reactContext, AdhanAlarmReceiver::class.java)
            putExtra(EXTRA_FILE, file)
            putExtra(EXTRA_TITLE, title)
            putExtra(EXTRA_PRAYER, prayer)
        }
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        val pending = PendingIntent.getBroadcast(
            reactContext,
            requestCodeFor(prayer),
            intent,
            flags,
        )
        // setAlarmClock is the most reliable of the four: the system treats it
        // as an alarm the user set, will not defer it indefinitely, and shows
        // the alarm icon in the status bar.
        val info = AlarmManager.AlarmClockInfo(at, pending)
        manager.setAlarmClock(info, pending)
    }

    private fun cancelInternal(manager: AlarmManager) {
        val saved = prefs.getString(KEY_SCHEDULE, null) ?: return
        val items = JSONArray(saved)
        for (i in 0 until items.length()) {
            val prayer = items.optJSONObject(i)?.optString("prayer") ?: continue
            val flags = PendingIntent.FLAG_NO_CREATE or
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
            val pending = PendingIntent.getBroadcast(
                reactContext,
                requestCodeFor(prayer),
                Intent(ACTION_PLAY).setClass(reactContext, AdhanAlarmReceiver::class.java),
                flags,
            )
            if (pending != null) {
                manager.cancel(pending)
                pending.cancel()
            }
        }
    }
}
