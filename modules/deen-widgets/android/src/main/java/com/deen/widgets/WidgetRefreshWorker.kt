package com.deen.widgets

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import androidx.glance.appwidget.updateAll
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import java.util.Calendar
import java.util.TimeZone
import java.util.concurrent.TimeUnit

/** Native redraws are cheap and independent of JS/Adhan. The separate Expo
 * background task replenishes the calendar with the canonical JS calculator.
 * WorkManager is explicitly inexact; the UI never relies on it for ticking. */
class WidgetRefreshWorker(context: Context,params: WorkerParameters) : CoroutineWorker(context,params) {
    override suspend fun doWork(): Result = try { refresh(applicationContext); Result.success() } catch (_: Exception) { Result.retry() }
    companion object {
        private const val PERIODIC="deen-widget-catch-up-v2"
        private const val BOUNDARY="deen-widget-boundary-v2"
        private val RECEIVERS=listOf(PrayerWidgetReceiver::class.java,AyahWidgetReceiver::class.java,TasbihWidgetReceiver::class.java,HijriWidgetReceiver::class.java)
        fun hasWidgets(context: Context): Boolean = RECEIVERS.any { AppWidgetManager.getInstance(context).getAppWidgetIds(ComponentName(context,it)).isNotEmpty() }
        fun enqueue(context: Context) {
            WorkManager.getInstance(context).enqueueUniqueWork("deen-widget-now-v2",ExistingWorkPolicy.REPLACE,OneTimeWorkRequestBuilder<WidgetRefreshWorker>().build())
        }
        suspend fun refresh(context: Context) {
            if (!hasWidgets(context)) { cancel(context); return }
            WidgetRepository.tick(context)
            for (widget in DEEN_WIDGETS) widget.updateAll(context)
            val manager=WorkManager.getInstance(context)
            manager.enqueueUniquePeriodicWork(PERIODIC,ExistingPeriodicWorkPolicy.KEEP,PeriodicWorkRequestBuilder<WidgetRefreshWorker>(30,TimeUnit.MINUTES).build())
            val snap=DeenWidgetData.parse(WidgetRepository.read(context)); val now=System.currentTimeMillis()
            val midnight=Calendar.getInstance(TimeZone.getTimeZone(snap.timezone)).apply {
                timeInMillis=now; add(Calendar.DAY_OF_MONTH,1); set(Calendar.HOUR_OF_DAY,0); set(Calendar.MINUTE,0); set(Calendar.SECOND,1); set(Calendar.MILLISECOND,0)
            }.timeInMillis
            val next=minOf(snap.upcoming.firstOrNull { it.at>now }?.at ?: midnight,midnight)
            manager.enqueueUniqueWork(BOUNDARY,ExistingWorkPolicy.REPLACE,OneTimeWorkRequestBuilder<WidgetRefreshWorker>().setInitialDelay((next-now+1000).coerceAtLeast(1000),TimeUnit.MILLISECONDS).build())
        }
        fun cancel(context: Context) {
            val manager=WorkManager.getInstance(context)
            manager.cancelUniqueWork(PERIODIC); manager.cancelUniqueWork(BOUNDARY)
        }
    }
}
class WidgetTimeReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context,intent: Intent) { if (WidgetRefreshWorker.hasWidgets(context)) WidgetRefreshWorker.enqueue(context) }
}
