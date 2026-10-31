package com.deen.adhanalarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Stops the adhan.
 *
 * The playback notification is what Android requires while a foreground
 * service is running, so it might as well be useful: tapping it, or the Stop
 * action on it, ends the adhan instead of opening the app.
 */
class AdhanAlarmStopReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        context.stopService(Intent(context, AdhanAlarmService::class.java))
    }
}
