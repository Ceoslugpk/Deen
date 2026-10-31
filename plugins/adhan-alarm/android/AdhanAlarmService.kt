package com.deen.adhanalarm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.util.Log

/**
 * Plays the adhan.
 *
 * A foreground service is not optional here. The app is in the background at
 * dawn, and Android stops background playback within minutes - the adhan would
 * begin and then cut out halfway through. Foreground status is what makes it
 * finish, and the visible notification is the price Android charges for that.
 */
class AdhanAlarmService : Service() {

    companion object {
        private const val TAG = "DeenAdhanAlarm"
        private const val CHANNEL_ID = "deen_adhan_playback"
        private const val NOTIFICATION_ID = 4701
    }

    private var player: MediaPlayer? = null
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val file = intent?.getStringExtra(AdhanAlarmModule.EXTRA_FILE)
        val title = intent?.getStringExtra(AdhanAlarmModule.EXTRA_TITLE) ?: "Prayer time"
        if (file.isNullOrBlank()) {
            stopSelf()
            return START_NOT_STICKY
        }

        createChannel()
        startForeground(NOTIFICATION_ID, buildNotification(title))

        // The CPU may be asleep. Without this the playback stalls as soon as
        // the screen is off, which is exactly when the dawn adhan happens.
        val power = getSystemService(Context.POWER_SERVICE) as? PowerManager
        wakeLock = power?.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "deen:adhan-playback",
        )?.apply { acquire(10 * 60 * 1000L) }

        try {
            player = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build(),
                )
                setDataSource(file)
                setOnCompletionListener { stopSelf() }
                setOnErrorListener { _, what, extra ->
                    Log.e(TAG, "playback error $what/$extra")
                    stopSelf()
                    true
                }
                prepare()
                start()
            }
        } catch (error: Exception) {
            Log.e(TAG, "could not play $file", error)
            stopSelf()
        }

        return START_NOT_STICKY
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            ?: return
        if (manager.getNotificationChannel(CHANNEL_ID) != null) return
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Adhan playback",
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = "Shown while the adhan is playing."
            setSound(null, null)
        }
        manager.createNotificationChannel(channel)
    }

    /** The notification Android requires; it is also how the adhan is stopped. */
    private fun buildNotification(title: String): android.app.Notification {
        val stopIntent = Intent(this, AdhanAlarmStopReceiver::class.java)
        val stopFlags = android.app.PendingIntent.FLAG_UPDATE_CURRENT or
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                android.app.PendingIntent.FLAG_IMMUTABLE else 0
        val stopPending = android.app.PendingIntent.getBroadcast(this, 4702, stopIntent, stopFlags)

        return android.app.Notification.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText("Adhan")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setOngoing(true)
            .setCategory(android.app.Notification.CATEGORY_ALARM)
            .addAction(android.R.drawable.ic_media_pause, "Stop", stopPending)
            .setContentIntent(stopPending)
            .build()
    }

    private fun releasePlayer() {
        try {
            player?.apply {
                if (isPlaying) stop()
                release()
            }
        } catch (_: Exception) {
        } finally {
            player = null
        }
    }

    private fun releaseWakeLock() {
        try {
            if (wakeLock?.isHeld == true) wakeLock?.release()
        } catch (_: Exception) {
        } finally {
            wakeLock = null
        }
    }

    override fun onDestroy() {
        releasePlayer()
        releaseWakeLock()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) stopForeground(STOP_FOREGROUND_REMOVE)
        super.onDestroy()
    }
}
