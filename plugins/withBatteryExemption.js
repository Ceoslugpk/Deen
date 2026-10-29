/**
 * Declares the permission behind the one-tap battery fix.
 *
 * Android refuses to show the "ignore battery optimisation" dialog unless the
 * app holds `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`. Without this line the
 * intent in `src/services/batteryOptimization.ts` is silently ignored and the
 * button appears to do nothing — which is worse than not offering it.
 *
 * The permission is only ever used to show Android's own dialog for this one
 * setting, and never to change anything else or to send anything anywhere.
 */
const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

const PERMISSION = 'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS';

module.exports = function withBatteryExemption(config) {
  return withAndroidManifest(config, (c) => {
    const manifest = c.modResults;
    if (!Array.isArray(manifest.manifest['uses-permission'])) {
      manifest.manifest['uses-permission'] = [];
    }
    const already = manifest.manifest['uses-permission'].some(
      (entry) => entry?.$?.['android:name'] === PERMISSION,
    );
    if (!already) {
      manifest.manifest['uses-permission'].push({ $: { 'android:name': PERMISSION } });
    }
    void AndroidConfig;
    return c;
  });
};
