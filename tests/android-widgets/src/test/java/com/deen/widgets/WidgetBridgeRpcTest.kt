package com.deen.widgets

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.json.JSONObject
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

/** Test-only stdio transport. Node drives the ACTUAL JS service -> adapter ->
 * exported module wrapper -> this transport -> production TasbihBridge and
 * DataStore/reducer in a fresh Android VM. This is NOT Expo JNI/Hermes/R8 or
 * a launcher/device test. No production transport/server is added. */
@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
class WidgetBridgeRpcTest {
    @Test fun serveProductionCounterForJsIntegration() = runBlocking {
        val context:Context=ApplicationProvider.getApplicationContext()
        val scope=CoroutineScope(SupervisorJob()+Dispatchers.IO)
        val bridge=TasbihBridge(scope,redraw={})
        val input=System.`in`.bufferedReader()
        fun send(value:JSONObject) { println("ISLAMIC_WIDGET_RPC $value");System.out.flush() }
        send(JSONObject().put("event","ready"))
        try {
            while(true) {
                val line=input.readLine() ?: break
                val request=JSONObject(line);val response=JSONObject().put("id",request.getInt("id"))
                if(request.getString("method")=="close") {send(response.put("result",true));break}
                val reply=CompletableDeferred<String?>()
                val completion=object:TasbihReply {
                    override fun resolve(value:String?) {reply.complete(value)}
                    override fun reject(code:String,cause:Throwable) {reply.completeExceptionally(IllegalStateException(code,cause))}
                }
                try {
                    when(request.getString("method")) {
                        "read" -> bridge.read(context,completion)
                        "command" -> bridge.command(context,request.getString("command"),completion)
                        "widgetTap" -> reply.complete(WidgetRepository.command(context,JSONObject().put("op","tap").put("idempotencyKey",request.getString("key")).toString()))
                        else -> throw IllegalArgumentException("unknown_test_method")
                    }
                    response.put("result",withTimeout(10_000){reply.await()} ?: JSONObject.NULL)
                } catch(error:Exception) {response.put("error",error.message ?: error.javaClass.simpleName)}
                send(response)
            }
        } finally {scope.cancel()}
        Unit
    }
}
