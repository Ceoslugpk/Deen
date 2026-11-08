/**
 * Installs the adhan alarm into the Android project.
 *
 * The recordings are fetched onto the device rather than compiled into the
 * app, and a notification can only play a sound that was compiled in. So at
 * each prayer time the operating system wakes this app, and a small foreground
 * service plays the file. Nothing here is needed for any other platform:
 * iOS has no exact alarms at all.
 *
 * Three things are written:
 *
 *   - the Kotlin sources, copied into the app's own package
 *   - the manifest entries: the permissions, the receiver that wakes us, the
 *     service that plays, and the boot receiver that re-arms after a restart
 *   - the package registration in MainApplication, without which the
 *     JavaScript side sees no native module at all
 *
 * The MainApplication edit is done with a search for the package-list block.
 * If that text changes in a future Expo release the edit is skipped with a
 * warning rather than failing the build: the adhan then falls back to an
 * ordinary notification tone, which is a smaller problem than an app that
 * will not compile.
 */
const { withDangerousMod, withAndroidManifest } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'adhan-alarm', 'android');
const PACKAGE_DIR = 'com/deen/adhanalarm';

const SOURCES = [
  'AdhanAlarmPackage.kt',
  'AdhanAlarmModule.kt',
  'AdhanAlarmReceiver.kt',
  'AdhanAlarmService.kt',
  'AdhanAlarmStopReceiver.kt',
];

const PERMISSIONS = [
  /* SCHEDULE_EXACT_ALARM, and deliberately not USE_EXACT_ALARM. Both grant
     exact alarms; they differ in who can take them away. USE_EXACT_ALARM is
     granted on install and cannot be revoked, which is exactly why Play
     restricts it to a short list of cases and asks for a declaration — an
     app that can set an exact alarm the user cannot switch off has to
     justify that. SCHEDULE_EXACT_ALARM is granted by default and the user
     can turn it off in settings, which is the one an alarm app is expected
     to use. Losing the irrevocable one costs nothing: the prayer times are
     still exact, and the user keeps the switch. */
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.WAKE_LOCK',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.POST_NOTIFICATIONS',
];

function ensurePermissions(manifest) {
  if (!Array.isArray(manifest.manifest['uses-permission'])) {
    manifest.manifest['uses-permission'] = [];
  }
  for (const name of PERMISSIONS) {
    const already = manifest.manifest['uses-permission'].some(
      (entry) => entry?.$?.['android:name'] === name,
    );
    if (!already) manifest.manifest['uses-permission'].push({ $: { 'android:name': name } });
  }
}

module.exports = function withAdhanAlarm(config) {
  // ---- 1. manifest -------------------------------------------------------
  config = withAndroidManifest(config, (c) => {
    const manifest = c.modResults;
    ensurePermissions(manifest);
    const app = manifest.manifest.application?.[0];
    if (app) {
      if (!Array.isArray(app.receiver)) app.receiver = [];
      if (!Array.isArray(app.service)) app.service = [];

      const receiverName = 'com.deen.adhanalarm.AdhanAlarmReceiver';
      if (!app.receiver.some((e) => e?.$?.['android:name'] === receiverName)) {
        app.receiver.push({
          $: {
            'android:name': receiverName,
            'android:enabled': 'true',
            'android:exported': 'false',
          },
          'intent-filter': [
            {
              action: [{ $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } }],
            },
            {
              action: [
                { $: { 'android:name': 'android.intent.action.MY_PACKAGE_REPLACED' } },
              ],
            },
            {
              action: [{ $: { 'android:name': 'android.intent.action.QUICKBOOT_POWERON' } }],
            },
          ],
        });
      }

      const stopName = 'com.deen.adhanalarm.AdhanAlarmStopReceiver';
      if (!app.receiver.some((e) => e?.$?.['android:name'] === stopName)) {
        app.receiver.push({
          $: { 'android:name': stopName, 'android:enabled': 'true', 'android:exported': 'false' },
        });
      }

      const serviceName = 'com.deen.adhanalarm.AdhanAlarmService';
      if (!app.service.some((e) => e?.$?.['android:name'] === serviceName)) {
        app.service.push({
          $: {
            'android:name': serviceName,
            'android:enabled': 'true',
            'android:exported': 'false',
            'android:foregroundServiceType': 'mediaPlayback',
          },
        });
      }
    }
    return c;
  });

  // ---- 2. sources + MainApplication --------------------------------------
  config = withDangerousMod(config, [
    'android',
    async (c) => {
      const projectRoot = c.modRequest.platformProjectRoot;

      const destDir = path.join(projectRoot, 'app', 'src', 'main', 'java', PACKAGE_DIR);
      fs.mkdirSync(destDir, { recursive: true });
      for (const file of SOURCES) {
        const from = path.join(SOURCE_DIR, file);
        if (fs.existsSync(from)) {
          fs.copyFileSync(from, path.join(destDir, file));
        }
      }

      // Register the package. Expo generates MainApplication with a
      // PackageList(...).apply { } block; several shapes have been used over
      // the SDK releases, so each is tried in turn.
      const appDir = path.join(projectRoot, 'app', 'src', 'main', 'java');
      const candidates = [];
      const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/MainApplication\.(kt|java)$/.test(entry.name)) candidates.push(full);
        }
      };
      walk(appDir);

      for (const file of candidates) {
        let text = fs.readFileSync(file, 'utf8');
        if (text.includes('AdhanAlarmPackage')) continue;
        const marker = text.match(/PackageList\(this\)\.packages\.apply\s*\{/);
        if (!marker) {
          console.warn(
            'withAdhanAlarm: could not find the package list in MainApplication, ' +
              'so the adhan alarm will not be available. The adhan falls back to a notification tone.',
          );
          continue;
        }
        const insertAt = marker.index + marker[0].length;
        text =
          text.slice(0, insertAt) +
          '\n      add(com.deen.adhanalarm.AdhanAlarmPackage())' +
          text.slice(insertAt);
        fs.writeFileSync(file, text);
      }
      return c;
    },
  ]);

  return config;
};
