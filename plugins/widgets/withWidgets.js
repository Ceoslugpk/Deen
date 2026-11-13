/**
 * Adds the home-screen widgets to the generated native projects.
 *
 * A widget is not a screen and cannot be written in React Native: the
 * operating system draws it, in a process the app does not own. On Android
 * that means real Kotlin — Glance, which is Jetpack Compose for app widgets —
 * in the app's own source tree, plus the manifest entries and provider
 * metadata that make the launcher aware of it.
 *
 * Four things are written:
 *
 *   - the Kotlin widget sources, into the app's own package
 *   - `buildFeatures.compose` and the Glance dependency in app/build.gradle
 *   - the four `<receiver>` entries in AndroidManifest.xml
 *   - one `appwidget-provider` XML per widget, plus the loading layout and
 *     the picker descriptions those XMLs point at
 *
 * Every edit searches for known text and inserts beside it. When that text is
 * not found the edit is skipped with a warning rather than guessed at, because
 * a future Expo release that moves a Gradle block should cost you a widget,
 * not a build.
 *
 * The JavaScript side is a local Expo module (`modules/deen-widgets`), so
 * there is deliberately no MainApplication edit here — autolinking registers
 * the module, and re-registers it on every prebuild.
 *
 * The iOS half is generated from `targets/widgets/` by `@bacons/apple-targets`.
 * All this plugin owes it is the App Group on the app's own entitlements.
 */
const { withDangerousMod, withAndroidManifest, withEntitlementsPlist, withAppBuildGradle } =
  require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'android');
const PACKAGE_DIR = 'com/deen/widgets';

const SOURCES = [
  'DeenWidgetData.kt',
  'DeenWidgetTheme.kt',
  'PrayerWidget.kt',
  'AyahWidget.kt',
  'TasbihWidget.kt',
  'HijriWidget.kt',
  'DeenWidgetReceivers.kt',
];

/**
 * The four widgets, and what the launcher is told about each.
 *
 * `updatePeriodMillis` is 30 minutes because that is the shortest interval
 * Android will honour — asking for less does not get you more, it gets you
 * ignored. The countdown is therefore correct when drawn, and refreshed
 * whenever the app publishes, which covers every app open and every prayer
 * time.
 */
const WIDGETS = [
  { cls: 'PrayerWidgetReceiver', name: 'Prayer times', xml: 'prayer_widget_info' },
  { cls: 'AyahWidgetReceiver', name: 'Ayah of the day', xml: 'ayah_widget_info' },
  { cls: 'TasbihWidgetReceiver', name: 'Tasbih counter', xml: 'tasbih_widget_info' },
  { cls: 'HijriWidgetReceiver', name: 'Hijri date', xml: 'hijri_widget_info' },
];

/** Must match the Swift `suiteName` and both entitlement files. */
const APP_GROUP = 'group.com.qashi.islamic';

function warn(message) {
  console.warn('withWidgets: ' + message);
}

// ---- 1. app/build.gradle: compose + Glance ------------------------------

const GLANCE_DEP = "implementation 'androidx.glance:glance-appwidget:1.1.1'";
const COMPOSE_PLUGIN = 'org.jetbrains.kotlin.plugin.compose';

const withComposeGradle = (config) =>
  withAppBuildGradle(config, (gradle) => {
    let text = gradle.modResults.contents;

    /* Glance is Compose, so the app has to be able to compile it. On Kotlin
       2.x that means the Compose compiler Gradle plugin; on 1.x it meant a
       `composeOptions` block. Both are attempted, and both are skipped if the
       project already has them, because which one applies depends on the
       Kotlin version Expo is shipping this month. */
    if (!text.includes(COMPOSE_PLUGIN)) {
      const plugins = text.match(/plugins\s*\{/);
      if (plugins) {
        text = text.replace(plugins[0], `${plugins[0]}\n    id '${COMPOSE_PLUGIN}'`);
      } else {
        /* The SDK 58 template writes `apply plugin: "..."` lines rather than a
           `plugins {}` block, so there is nowhere for `id '...'` to go. The
           plugin is applied the way the rest of the file is written instead.

           `buildFeatures { compose true }` below is not enough on its own: it
           tells Android Gradle Plugin that Compose is in use, but the Kotlin
           compiler plugin is what turns `@Composable` into code. Without it
           the widget sources fail to compile on Kotlin 2.x. */
        const applies = text.match(/apply plugin:\s*["'][^"']+["']/g);
        if (applies && applies.length) {
          const last = applies[applies.length - 1];
          text = text.replace(last, `${last}\napply plugin: "${COMPOSE_PLUGIN}"`);
        } else {
          warn('no plugins block or apply-plugin line in app/build.gradle; apply the Compose compiler plugin by hand.');
        }
      }
    }

    if (!text.includes('buildFeatures')) {
      const androidBlock = text.match(/\n(\s*)android\s*\{/);
      if (androidBlock) {
        const pad = androidBlock[1] + '    ';
        text = text.replace(
          androidBlock[0],
          `${androidBlock[0]}\n${pad}buildFeatures {\n${pad}    compose true\n${pad}}`,
        );
      } else {
        warn('no android block in app/build.gradle; enable compose by hand.');
      }
    }

    if (!text.includes('androidx.glance')) {
      const deps = text.match(/\n(\s*)dependencies\s*\{/);
      if (deps) {
        text = text.replace(deps[0], `${deps[0]}\n${deps[1]}    ${GLANCE_DEP}`);
      } else {
        warn('no dependencies block in app/build.gradle; add the Glance dependency by hand.');
      }
    }

    gradle.modResults.contents = text;
    return gradle;
  });

// ---- 2. AndroidManifest: the four receivers -----------------------------

const withReceivers = (config) =>
  withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const app = manifest.manifest.application?.[0];
    if (!app) {
      warn('no <application> in the manifest; the widgets will not appear in the picker.');
      return mod;
    }
    if (!Array.isArray(app.receiver)) app.receiver = [];

    for (const w of WIDGETS) {
      const name = `com.deen.widgets.${w.cls}`;
      if (app.receiver.some((r) => r?.$?.['android:name'] === name)) continue;
      app.receiver.push({
        $: {
          'android:name': name,
          'android:exported': 'true',
          /* What the widget picker shows under the icon. */
          'android:label': w.name,
        },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } },
            ],
          },
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.appwidget.provider',
              'android:resource': `@xml/${w.xml}`,
            },
          },
        ],
      });
    }
    return mod;
  });

// ---- 3. Kotlin sources, provider XML, layout, strings -------------------

const withSources = (config) =>
  withDangerousMod(config, [
    'android',
    (mod) => {
      const projectRoot = mod.modRequest.projectRoot || mod.modRequest.platformProjectRoot;
      const mainRoot = path.join(projectRoot, 'android', 'app', 'src', 'main');

      // 3a. Kotlin sources
      const destDir = path.join(mainRoot, 'java', PACKAGE_DIR);
      fs.mkdirSync(destDir, { recursive: true });
      for (const file of SOURCES) {
        const src = path.join(SOURCE_DIR, file);
        if (!fs.existsSync(src)) {
          warn(`missing source ${file}`);
          continue;
        }
        fs.writeFileSync(path.join(destDir, file), fs.readFileSync(src));
      }

      // 3b. appwidget-provider metadata, one file per widget
      const xmlDir = path.join(mainRoot, 'res', 'xml');
      fs.mkdirSync(xmlDir, { recursive: true });
      for (const w of WIDGETS) {
        fs.writeFileSync(
          path.join(xmlDir, `${w.xml}.xml`),
          `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="110dp"
    android:minHeight="110dp"
    android:targetCellWidth="2"
    android:targetCellHeight="2"
    android:maxResizeWidth="480dp"
    android:maxResizeHeight="480dp"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/widget_loading"
    android:previewLayout="@layout/widget_loading"
    android:description="@string/widget_${w.xml.replace('_widget_info', '')}_description"
    android:widgetFeatures="reconfigurable" />
`,
        );
      }

      /* 3c. The layout a widget shows for the moment before Glance has drawn.
         `initialLayout` is resolved at build time, so a resource that is not
         there is a compile error rather than a blank frame. */
      const layoutDir = path.join(mainRoot, 'res', 'layout');
      fs.mkdirSync(layoutDir, { recursive: true });
      fs.writeFileSync(
        path.join(layoutDir, 'widget_loading.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/transparent" />
`,
      );

      /* 3d. The one-line description under each widget in the picker, in its
         own file rather than merged into strings.xml, which is generated. */
      const valuesDir = path.join(mainRoot, 'res', 'values');
      fs.mkdirSync(valuesDir, { recursive: true });
      const descriptions = WIDGETS.map(
        (w) =>
          `    <string name="widget_${w.xml.replace('_widget_info', '')}_description">${w.name}</string>`,
      ).join('\n');
      fs.writeFileSync(
        path.join(valuesDir, 'deen_widgets.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
${descriptions}
</resources>
`,
      );

      return mod;
    },
  ]);

// ---- 4. iOS: the App Group the widgets read through ---------------------

const withIosAppGroup = (config) =>
  withEntitlementsPlist(config, (mod) => {
    const existing = mod.modResults['com.apple.security.application-groups'] || [];
    if (!existing.includes(APP_GROUP)) {
      mod.modResults['com.apple.security.application-groups'] = [...existing, APP_GROUP];
    }
    return mod;
  });

module.exports = function withWidgets(config) {
  config = withComposeGradle(config);
  config = withReceivers(config);
  config = withSources(config);
  config = withIosAppGroup(config);
  return config;
};

module.exports.APP_GROUP = APP_GROUP;
