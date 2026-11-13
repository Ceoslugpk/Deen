# Home-screen widgets

Four widgets for Android and iOS, plus a Live Activity on iOS.

| Widget | Sizes | What it shows |
| --- | --- | --- |
| Prayer times | small / medium / large | Next prayer, live countdown, today's six |
| Ayah of the day | small / medium / large | Today's verse on a Pearl card |
| Tasbih counter | small / medium | Count, goal, and +1 / Reset buttons |
| Hijri date | small / medium | Today's date in both calendars |

---

## What a widget is not

A widget is not a screen. It is drawn by the operating system, in a process the
app does not own, at moments the app does not choose. That has consequences
worth stating before anything else, because they explain every design decision
below:

- **It cannot be written in React Native.** Both platforms require real native
  code — SwiftUI/WidgetKit on iOS, Glance (Compose) on Android.
- **It cannot call into the app.** It cannot fetch, cannot await, and cannot
  read AsyncStorage. It gets one synchronously-readable value.
- **It cannot animate.** Not on either platform, in the sense a screen animates.

So the architecture is: the app *publishes* a snapshot, and the widget *renders*
it. Nothing is polled by the widget and nothing is called back into the app.

```
App.tsx (useHomeData, TasbihScreen)
   └── src/services/widgetSync.ts     builds the snapshot
         └── src/services/widgetBridge.ts
               └── modules/deen-widgets (local Expo module)
                     ├── App Group UserDefaults   (iOS)
                     └── SharedPreferences        (Android)
                              │
                     ┌────────┴────────┐
              WidgetKit views      Glance composables
```

### The snapshot

Defined in `src/services/widgetSnapshot.ts`. Two rules hold it together:

- **Everything displayed is pre-formatted.** Times arrive as `"05:05"`, not as
  timestamps to be rendered. Formatting needs a locale and a clock style, and a
  widget that guesses at either will disagree with the app it came from.
- **Everything needed to work out *where in the day it is* is still a number.**
  `at` is epoch milliseconds. The widget compares that against its own clock —
  which it has to do, because it may be drawn hours after the app last ran, and
  a "next prayer" decided then would be wrong by then.

Tomorrow's times are published alongside today's for one reason: after Isha
there is no "next" left in today's list, and a widget showing "—" from Maghrib
until midnight is wrong for a third of the day.

---

## Motion: what is actually possible

You asked for good animations. Here is the honest picture, because promising
more than the platform gives is how you end up with a widget that looks broken.

### iOS

| Effect | How | Where |
| --- | --- | --- |
| Live countdown | `Text(timerInterval:countsDown:)` — redrawn by the system every second | All three sizes |
| Rolling digits | `.contentTransition(.numericText(countsDown:))` (iOS 17+) | Tasbih count |
| Entry transitions | System transition when a timeline entry becomes current | All |
| Continuously live countdown | **Live Activity** — Lock Screen + Dynamic Island | Separate feature |

The timeline is the mechanism that makes the transitions land at the right
moment: an entry is written at each prayer time, so the widget moves from
"Dhuhr is next" to "Asr is next" exactly when that becomes true, and does not
redraw in between. The countdown inside an entry ticks on its own, without new
entries.

**The Live Activity** (`PrayerLiveActivity.swift`) is the only genuinely
continuous animation available to this app. Home-screen widgets hand the system
a static view and a schedule; a Live Activity is a view the system keeps live.
It is where a countdown that visibly counts belongs.

### Android

Android gives an app widget no per-second surface. `updatePeriodMillis` is
honoured at 30 minutes and no less — asking for more frequent updates gets you
ignored, not served. So on Android:

- the countdown is **correct when drawn**, and redrawn whenever the app
  publishes (every app open, every foreground, every prayer time);
- Android 12+ crossfades between updates, which is the one transition
  available;
- the countdown does not tick continuously. That is a platform limit, not an
  omission — the equivalent of the iOS Live Activity would be an ongoing
  notification, and the app already has one for the adhan.

---

## Setup

### 1. Install

```bash
npm install
```

This pulls in `@bacons/apple-targets`, which generates the iOS widget
extension on every prebuild. Managed Expo regenerates `ios/` from scratch, so
anything added to that folder by hand is lost — the target has to be generated,
and this is the tool that does it.

### 2. iOS: register the App Group

**This is the one manual step, and nothing works without it.**

1. Apple Developer → Certificates, Identifiers & Profiles → App Groups
2. Register `group.com.qashi.islamic`
3. Add it to both the app's App ID and the widget extension's App ID
4. Regenerate provisioning profiles

The identifier appears in three places and all three must agree:

- `plugins/widgets/withWidgets.js` → `APP_GROUP` (app entitlements)
- `targets/widgets/DeenWidgets.entitlements`
- `DeenWidgetData.swift` → `suiteName`

When they disagree nothing crashes. The widget reads an empty store forever and
renders its empty state, which is the harder failure to notice.

### 3. Set your team id

```bash
export EXPO_APPLE_TEAM_ID=YOURTEAMID
```

or add it as an EAS secret. Without it the extension is signed with a team the
App Store will reject.

### 4. Prebuild and build

```bash
npx expo prebuild --clean
npx expo run:ios      # or: eas build --platform ios
npx expo run:android  # or: eas build --platform android
```

---

## Android build notes

Verified against SDK 58: `expo prebuild --platform android` completes cleanly
and writes all three of the things Glance needs into `android/app/build.gradle`:

```gradle
apply plugin: "org.jetbrains.kotlin.plugin.compose"   // line 4
android { buildFeatures { compose true } }            // line 89
implementation 'androidx.glance:glance-appwidget:1.1.1'
```

All three are required. `buildFeatures { compose true }` tells Android Gradle
Plugin that Compose is in use, but the Kotlin **compiler** plugin is what turns
`@Composable` into code — without it the widget sources do not compile on
Kotlin 2.x. The SDK 58 template writes `apply plugin: "…"` lines rather than a
`plugins { }` block, so the plugin adds it in the same style as the rest of the
file rather than as `id '…'`.

If you ever see `This version of the Compose Compiler requires Kotlin version
X`, that pairing is what has come apart; pin the Glance version in
`plugins/widgets/withWidgets.js` to match.

These warnings are expected and harmless:

- `withWidgets: could not find MainApplication` — not needed; autolinking registers the module
- `[bacons/apple-targets] Expo config is missing required ios.appleTeamId` — set `EXPO_APPLE_TEAM_ID` before building for iOS

---

## Verification checklist

Nothing below has been run. This sandbox has no Xcode and no Android SDK, so
the native code is **written but not compiled**. Work through this on a device:

**Android**

- [ ] Long-press the home screen → Widgets → "Islamic" shows all four
- [ ] Prayer widget: small shows next prayer + time + countdown
- [ ] Prayer widget: medium and large list all six, current one highlighted
- [ ] Prayer widget: resizing re-lays out rather than stretching
- [ ] Ayah widget: Arabic right-aligned and not clipped
- [ ] Tasbih: **+1** increments on the home screen without opening the app
- [ ] Tasbih: open the app — the count matches what the widget showed
- [ ] Hijri date shows both calendars
- [ ] Killing the app does not blank the widgets

**iOS**

- [ ] All four appear in the widget picker
- [ ] Countdown visibly ticks (it should change while you watch)
- [ ] Widget moves to the next prayer at the moment that prayer passes
- [ ] Tasbih **+1** works from the lock screen / home screen
- [ ] Live Activity appears on the Lock Screen after opening the app
- [ ] Dynamic Island (iPhone 14 Pro+) shows the compact countdown
- [ ] Dark mode: the ayah card flips to the dark ground

**Both**

- [ ] Changing the calculation method updates the widget
- [ ] Clearing the location shows the empty state, not stale times
- [ ] No widget shows a time the app disagrees with

---

## Files

```
src/services/widgetSnapshot.ts   the contract, and resolveNow()
src/services/widgetSync.ts       builds it from app state
src/services/widgetBridge.ts     guarded JS side
modules/deen-widgets/            native module (autolinked)
  ios/DeenWidgetBridge.swift     UserDefaults + ActivityKit
  android/.../DeenWidgetsModule.kt
plugins/widgets/
  withWidgets.js                 config plugin (Android + App Group)
  android/                       Glance sources, copied into the app
targets/widgets/                 WidgetKit sources for @bacons/apple-targets
  Sources/DeenWidgetData.swift   reads the App Group
  Sources/DeenTheme.swift        the ten brand colours
  Sources/PrayerWidget.swift     + the timeline
  Sources/PrayerLiveActivity.swift
```

**One file is deliberately compiled twice.** `PrayerActivityAttributes.swift`
lives in the widget target and is copied into the app by the plugin, because
both must build the same attributes type. A copy that drifts would not fail to
compile — it would fail at runtime, with an activity the app starts and the
extension cannot render.

**The palette is duplicated on purpose.** `DeenTheme.swift` (iOS) and
`DeenTheme.kt` (Android) restate the ten brand colours, because a widget's
classpath cannot see `src/design/brand.ts`. If the brand changes, those three
files move together.
