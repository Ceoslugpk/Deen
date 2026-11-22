package com.deen.widgets

import android.content.Context
import android.util.Log
import androidx.glance.appwidget.updateAll
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/** Explicit, single-settlement counter boundary. The Expo module supplies a
 * Promise adapter; this class owns IO, failures and best-effort redraws. It is
 * also exercised against the real DataStore by the native integration tests. */
interface TasbihReply {
    fun resolve(value: String?)
    fun reject(code: String, cause: Throwable)
}
class TasbihBridge(
    private val scope: CoroutineScope,
    private val readState: suspend (Context) -> String? = { WidgetRepository.read(it)[WidgetRepository.TASBIH] },
    private val applyCommand: suspend (Context, String) -> String = { context, raw -> WidgetRepository.command(context,raw) },
    private val redraw: suspend (Context) -> Unit = { TasbihWidget().updateAll(it) },
) {
    private var redrawJob: Job? = null
    private val redrawLock = Any()

    fun read(context: Context, reply: TasbihReply) = execute("E_TASBIH_READ",reply) { readState(context.applicationContext) }
    fun command(context: Context, raw: String, reply: TasbihReply) = execute("E_TASBIH_COMMAND",reply) {
        applyCommand(context.applicationContext,raw)
    }.also { transaction ->
        // This completion runs after the durable transaction, not as a child
        // whose failure could reject an already saved command. A short burst
        // requests one redraw; active compositions also observe DataStore.
        transaction.invokeOnCompletion { error -> if (error == null) requestRedraw(context.applicationContext) }
    }
    private fun execute(code: String, reply: TasbihReply, work: suspend () -> String?): Job = scope.launch {
        val result = try { work() } catch (error: Throwable) {
            if (error is VirtualMachineError || error is ThreadDeath) throw error
            val failureCode = if (error is CancellationException) "E_TASBIH_CANCELLED" else code
            // Never log command JSON, counts, phrases or history.
            Log.e("DeenWidgets","$failureCode: ${error.javaClass.simpleName}")
            settle { reply.reject(failureCode,error) }
            // No success completion/redraw after a rejected transaction.
            throw CancellationException(failureCode,error)
        }
        settle { reply.resolve(result) }
    }
    private fun requestRedraw(context: Context) = synchronized(redrawLock) {
        if (redrawJob?.isActive != true) redrawJob = scope.launch {
            delay(120)
            try { redraw(context) } catch (error: Throwable) {
                if (error is VirtualMachineError || error is ThreadDeath) throw error
                if (error !is CancellationException) Log.e("DeenWidgets","Saved counter; redraw deferred: ${error.javaClass.simpleName}")
            }
        }
    }
    private inline fun settle(deliver: () -> Unit) {
        // A React runtime being destroyed must not turn an IO callback into an
        // uncaught process exception or trigger a second Promise settlement.
        try { deliver() } catch (error: Throwable) {
            if (error is VirtualMachineError || error is ThreadDeath) throw error
            Log.e("DeenWidgets","Counter reply unavailable: ${error.javaClass.simpleName}")
        }
    }
}
