package com.deen.adhanalarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

/**
 * Wakes the app when a prayer time arrives, and puts the alarms back after a
 * reboot.
 *
 * Alarms do not survive a restart, so without the boot branch the adhan would
 * stop sounding the first time the phone was turned off - which for many
 * people is every night.
 */
class AdhanAlarmReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "DeenAdhanAlarm"
    }

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            AdhanAlarmModule.ACTION_PLAY -> {
                val file = intent.getStringExtra(AdhanAlarmModule.EXTRA_FILE)
                val title = intent.getStringExtra(AdhanAlarmModule.EXTRA_TITLE)
                    ?: context.getString(android.R.string.unknownName)
                val prayer = intent.getStringExtra(AdhanAlarmModule.EXTRA_PRAYER) ?: "prayer"
                if (file.isNullOrBlank()) return

                val service = Intent(context, AdhanAlarmService::class.java).apply {
                    putExtra(AdhanAlarmModule.EXTRA_FILE, file)
                    putExtra(AdhanAlarmModule.EXTRA_TITLE, title)
                    putExtra(AdhanAlarmModule.EXTRA_PRAYER, prayer)
                }
                // A background service cannot be started on Android 8+, and the
                // app is almost certainly in the background at dawn.
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(service)
                } else {
                    context.startService(service)
                }
            }

            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            "android.intent.action.QUICKBOOT_POWERON" -> reschedule(context)
        }
    }

    /** Re-arms every alarm in the saved schedule, dropping any already past. */
    private fun reschedule(context: Context) {
        try {
            val prefs = context.getSharedPreferences(
                AdhanAlarmModule.PREFS,
                Context.MODE_PRIVATE,
            )
            val saved = prefs.getString(AdhanAlarmModule.KEY_SCHEDULE, null) ?: return
            val items = org.json.JSONArray(saved)
            val manager = context.getSystemService(Context.ALARM_SERVICE) as? android.app.AlarmManager
                ?: return
            val now = System.currentTimeMillis()

            for (i in 0 until items.length()) {
                val item = items.optJSONObject(i) ?: continue
                val at = item.optLong("at", 0L)
                val prayer = item.optString("prayer", "prayer")
                val file = item.optString("file", "")
                val title = item.optString("title", "Prayer")
                if (at <= 0L || file.isBlank()) continue

                val pending = android.app.PendingIntent.getBroadcast(
                    context,
                    AdhanAlarmModule.requestCodeFor(prayer),
                    Intent(AdhanAlarmModule.ACTION_PLAY)
                        .setClass(context, AdhanAlarmReceiver::class.java)
                        .putExtra(AdhanAlarmModule.EXTRA_FILE, file)
                        .putExtra(AdhanAlarmModule.EXTRA_TITLE, title)
                        .putExtra(AdhanAlarmModule.EXTRA_PRAYER, prayer),
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT or
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                            android.app.PendingIntent.FLAG_IMMUTABLE else 0,
                )
                // A time that passed while the phone was off is skipped: an
                // adhan for a prayer that is already over is not a reminder,
                // it is a noise.
                if (at > now) manager.setAlarmClock(android.app.AlarmManager.AlarmClockInfo(at, pending), pending)
            }
        } catch (error: Exception) {
            Log.e(TAG, "reschedule failed", error)
        }
    }
}
