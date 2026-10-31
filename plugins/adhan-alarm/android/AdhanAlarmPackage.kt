package com.deen.adhanalarm

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * Registers the alarm module with React Native.
 *
 * This is a plain React Native package rather than an Expo module so that it
 * does not depend on autolinking discovering it; the config plugin adds it to
 * MainApplication directly.
 */
class AdhanAlarmPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> = listOf(AdhanAlarmModule(reactContext))

    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
