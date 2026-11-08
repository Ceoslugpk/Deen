/**
 * Drops permissions the app does not use, so the manifest asks for what it
 * actually does and nothing more.
 *
 * `expo-sensors` declares `ACTIVITY_RECOGNITION` in its library manifest, and
 * the Gradle manifest merger copies every library permission into the app.
 * Nothing in this app touches it: the only sensors used are the magnetometer
 * and the accelerometer, which drive the Qibla compass and need no permission
 * at all on any Android version. `ACTIVITY_RECOGNITION` is there for the
 * pedometer, and there is no pedometer here.
 *
 * That matters because Google Play files it under **Health and fitness**. An
 * app that declares it has to answer a health-permission declaration and, in
 * Play's own words, justify access to the user's physical activity — for an
 * app whose health story is "it stores a menstrual cycle record the user typed
 * in, on the device, and never uploads it". Asking for step recognition to
 * draw a compass is the wrong trade however it is answered.
 *
 * The removal is done with `tools:node="remove"`, which is how the manifest
 * merger is told to drop a node a library contributed. Deleting the line from
 * node_modules would not survive an install, and a patch would have to be
 * re-made on every upgrade. This is written into the app's own manifest once,
 * at prebuild, and holds.
 *
 * If a step counter is ever added, delete its entry from the list below and
 * answer Play's declaration instead — the permission goes back in on the next
 * prebuild and nothing else has to change.
 */

const { withAndroidManifest } = require('expo/config-plugins');

/** Permissions a library declares that this app has no feature for. */
const REMOVED = [
  {
    name: 'android.permission.ACTIVITY_RECOGNITION',
    why:
      'Declared by expo-sensors for its pedometer. Only the magnetometer and ' +
      'accelerometer are used here, for the Qibla compass, and neither needs ' +
      'a permission. Play files this one under Health and fitness.',
  },
  {
    name: 'android.permission.SYSTEM_ALERT_WINDOW',
    why:
      'Draw over other apps. Nothing here draws over anything: the floating ' +
      'menu is a view inside the app, not an overlay. It reaches the release ' +
      'manifest by accident of the build — Expo folds React Native\'s debug ' +
      'manifest into the app\'s own, and that one carries this permission for ' +
      'the red developer error box. Play treats it as high risk and expects a ' +
      'declaration for it, so an app that never asked for it should not be ' +
      'answering questions about it.',
  },
  {
    name: 'android.permission.USE_FINGERPRINT',
    why:
      'The pre-Android 9 fingerprint permission, superseded by USE_BIOMETRIC, ' +
      'which is declared as well. expo-local-authentication still ships both ' +
      'for old devices; there is no supported device where only this one ' +
      'would do the job, so it is dead weight in the declaration.',
  },
];

const TOOLS_NS = 'xmlns:tools';
const TOOLS_URI = 'http://schemas.android.com/tools';

module.exports = function withUnusedPermissions(config) {
  return withAndroidManifest(config, (c) => {
    const manifest = c.modResults;

    /* The `tools:` prefix has to be declared on the root element before it can
       be used on a child, or the merger rejects the attribute as unknown. */
    manifest.manifest.$ = manifest.manifest.$ || {};
    manifest.manifest.$[TOOLS_NS] = TOOLS_URI;

    if (!Array.isArray(manifest.manifest['uses-permission'])) {
      manifest.manifest['uses-permission'] = [];
    }

    for (const entry of REMOVED) {
      /* Drop any plain declaration first. Some of these arrive already written
         into the app's own manifest — Expo folds React Native's debug manifest
         into it during prebuild — and a plain entry sitting next to a `remove`
         marker for the same permission is the marker arguing with itself in
         one file. The marker is what removes a library's contribution at merge
         time; the app's own line has to be taken out here, by hand. */
      manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'].filter(
        (p) =>
          !(
            p?.$?.['android:name'] === entry.name &&
            p?.$?.['tools:node'] === undefined
          ),
      );

      const already = manifest.manifest['uses-permission'].some(
        (p) => p?.$?.['android:name'] === entry.name && p?.$?.['tools:node'] === 'remove',
      );
      if (already) continue;
      manifest.manifest['uses-permission'].push({
        $: { 'android:name': entry.name, 'tools:node': 'remove' },
      });
    }

    return c;
  });
};

/** What this plugin removes, for the manifest report. */
module.exports.REMOVED = REMOVED;
