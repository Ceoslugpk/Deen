package expo.modules.deenwidgets

import android.content.Intent
import com.deen.widgets.TasbihBridge
import com.deen.widgets.TasbihReply
import com.deen.widgets.WidgetRepository
import com.deen.widgets.WidgetRefreshWorker
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.withContext

class DeenWidgetsModule : Module() {
    private var pendingDestination: String? = null
    private val counterScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val counterBridge = TasbihBridge(counterScope)
    private fun context() = appContext.reactContext?.applicationContext ?: throw IllegalStateException("no_context")
    private fun reply(promise: Promise) = object : TasbihReply {
        override fun resolve(value: String?) { promise.resolve(value as Any?) }
        override fun reject(code: String, cause: Throwable) { promise.reject(code,"Saved counter unavailable; no reset was performed",cause) }
    }
    override fun definition() = ModuleDefinition {
        Name("DeenWidgetBridge")
        Events("onWidgetDestination")
        OnNewIntent { intent: Intent ->
            intent.getStringExtra("deen_widget_destination")?.let {
                pendingDestination = it
                intent.removeExtra("deen_widget_destination")
                // A warm widget tap can arrive without an AppState change.
                sendEvent("onWidgetDestination",emptyMap<String,Any?>())
            }
        }
        AsyncFunction("publish") Coroutine { json: String -> withContext(Dispatchers.IO) { WidgetRepository.publish(context(), json) } }
        AsyncFunction("refresh") Coroutine { withContext(Dispatchers.IO) { WidgetRefreshWorker.refresh(context()); true } }
        AsyncFunction("read") Coroutine { withContext(Dispatchers.IO) { WidgetRepository.json(context()) } }
        AsyncFunction("clear") Coroutine { withContext(Dispatchers.IO) { WidgetRepository.clearDerived(context()); WidgetRefreshWorker.refresh(context()); true } }
        // Capture the application context at invocation. Explicit Promise
        // settlement contains IO/runtime failures and acknowledges persistence
        // without waiting for launcher/Glance redraw work.
        AsyncFunction("tasbihRead") { promise: Promise ->
            counterBridge.read(context(),reply(promise)); Unit
        }
        AsyncFunction("tasbihCommand") { command: String, promise: Promise ->
            counterBridge.command(context(),command,reply(promise)); Unit
        }
        OnDestroy { counterScope.cancel() }
        AsyncFunction("consumeDestination") {
            val intent = appContext.currentActivity?.intent
            val destination = pendingDestination ?: intent?.getStringExtra("deen_widget_destination")
            pendingDestination = null
            intent?.removeExtra("deen_widget_destination")
            destination?.takeIf { it in setOf("prayer", "ayah", "tasbih", "hijri") }
        }.runOnQueue(Queues.MAIN)
        AsyncFunction("startActivity") { _: String, _: String, _: Double, _: String, _: String -> false }
        AsyncFunction("stopActivity") { false }
    }
}
