/**
 * Keep portrait as the activity's preferred orientation, not an install filter.
 *
 * Google Play infers a required portrait hardware feature from screenOrientation
 * unless it is explicitly optional. This declaration lets devices that do not
 * advertise portrait support install the app without changing its phone UI.
 * It is reapplied whenever EAS generates the native Android project.
 */
const { withAndroidManifest } = require('expo/config-plugins');

const PORTRAIT_FEATURE = 'android.hardware.screen.portrait';

module.exports = function withOptionalPortrait(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const features = manifest['uses-feature'] || [];
    const portrait = features.find(
      (feature) => feature?.$?.['android:name'] === PORTRAIT_FEATURE,
    ) || { $: { 'android:name': PORTRAIT_FEATURE } };

    portrait.$['android:required'] = 'false';

    // Replace any existing declarations so repeated builds cannot add duplicates
    // or leave a conflicting required="true" declaration in the app manifest.
    manifest['uses-feature'] = [
      ...features.filter(
        (feature) => feature?.$?.['android:name'] !== PORTRAIT_FEATURE,
      ),
      portrait,
    ];

    return mod;
  });
};
