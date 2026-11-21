# Native home-screen widgets — R112 repair

The approved repair covers **Prayer, Ayah, Tasbih and Hijri on Android**, including picker/initial visibility, durable state, updates and interactions. These are native Glance widgets, not a web widget or a screenshot workaround.

**Release status:** source implemented; TypeScript, **396 JavaScript/plugin regressions** and **19 Android/Robolectric tests** passed. The production widget Kotlin/resources compile in the standalone Android harness. This is **not a full Expo application/release build or a device/launcher pass**. Installed Play widgets require a **new Android binary**; a Vercel deployment or JavaScript export cannot install this native repair.

## What changed

| Family | Android behavior |
| --- | --- |
| Prayer | Canonical selected-city schedule, next Salah (never Sunrise), absolute prayer time, and an OS-ticked city `TextClock`. Larger/taller sizes reveal the schedule. No frozen/negative relative countdown. |
| Ayah | Cached Arabic/reference, translation where space permits, light/dark card. If only an older real verse is cached, it is identified as **Saved ayah**, not represented as today's verse. No invented religious content. |
| Tasbih | Native transactional **+1 / Reset**, shared count/goal/phrase/round/day/session state with the app. A Home/theme refresh cannot overwrite widget taps. Existing history and imported unknown fields are retained. |
| Hijri | Matching selected-city calendar day, app's existing Hijri table and Gregorian date; visible refresh guidance when the runway is exhausted. |

All families have visible loading/error states, separate XML picker previews, an older-launcher image fallback copied from **existing shipped artwork**, and exact-size layouts. Preview content is illustrative, **not a screenshot of an installed launcher**. The screenshot supplied for the audit showed blank reorder thumbnails; it did not identify the installed binary's full failure path.

Existing receiver identities stay unchanged so installed instances can upgrade in place:

```
com.deen.widgets.PrayerWidgetReceiver
com.deen.widgets.AyahWidgetReceiver
com.deen.widgets.TasbihWidgetReceiver
com.deen.widgets.HijriWidgetReceiver
```

### Data and lifecycle

- An invisible `WidgetLifecycle` under the existing providers publishes **outside Home**, after saved city, language, worship settings and theme hydrate. Local prayer publication does not wait for Ayah/hadith/network requests.
- `widgetSync.ts` uses the **same prayer calculator/method/madhab and Hijri table as the app**, with a **32-day** calendar in the selected city's timezone. Display strings and epoch milliseconds derive from the same calculation; Sunrise remains in the schedule but is excluded from next/current Salah.
- The checked JS adapter calls the local module's actual exported wrapper methods. Writes are serialized and deduplicated only after persistence/redraw acknowledgment; a rejection remains retryable.
- Glance observes **DataStore `deen_widget_state_v2` inside its composition**, rather than holding a pre-composition snapshot for the session's lifetime.
- The former `SharedPreferences("deen_widgets") / "snapshot"` is imported without deleting its original file. Android's full Tasbih state is a separate transactional authority; AsyncStorage remains a backup/web/iOS mirror. Read errors do not initialize a replacement zero counter. No historical widget contributions are invented from count-only snapshots.
- Ordinary startup/resume reads native counter authority first. **Only an explicit backup restore** replaces it from the restored app record. Ambiguous native command errors never fall through to a second counter; successful persistence is not reported as a failed command merely because its redraw failed.
- Cold-start destinations and warm native intent events open the existing Prayer, Home/Ayah, Tasbih or Hijri screen. Pending-intent URIs distinguish families; destinations are allowlisted. App-lock/navigation readiness remains owned by the existing app shell.

### Refresh and time: important limits

- The host's native `TextClock` ticks without a JavaScript interval or per-second app wakeup. Ticking a clock **does not select the next prayer**.
- Native WorkManager redraws are periodic (30 minutes) plus opportunistic one-off boundary work. Boot, package update, date, time and timezone broadcasts request catch-up.
- Android Expo task `com.qashi.islamic.widgets.replenish.v2` requests replenishment at a **minimum 360-minute interval**, using the same JS calculator. Its definition is at module scope for headless startup. Missing new native modules fail closed on an older binary; web/iOS do not register this Android task.
- Background refills include an expected-configuration precondition. Native comparison is JSON-semantic, not dependent on object-key order, so a refill begun with old settings cannot overwrite a newer manual city/theme/language selection.
- **Both WorkManager and Expo background tasks are inexact** and can be deferred by battery controls/Doze. There is no promise of exact prayer-boundary rollover, continuous execution after force-stop, or unlimited freshness. An exhausted calendar shows refresh guidance instead of an old Fajr masquerading as next.
- Ayah publication uses actual cached content; the calendar refill is not a guarantee of a newly downloaded verse every day.

## Preservation boundaries

- **Manual city/no GPS:** no location sensor, `expo-location`, new exact-alarm request or tracking was added. The four Android location-permission blocks remain. Only the boot permission is declared by the widget module itself; transitive platform dependencies still need the normal full-app manifest review.
- All **22 interface languages** have native strings for picker/recovery/controls; the selected app language and RTL can differ from the launcher language. Indonesian uses Android's `values-in` alias, Uzbek/Kazakh Gregorian formatting explicitly selects Cyrillic, and Arabic verse alignment is independent of UI direction.
- The shipped indigo/gold/pearl design and existing icons are reused. No unrelated reader/UI redesign or data cleanup is included.
- **iOS Swift/WidgetKit/Live Activity sources are unchanged.** The additive snapshot retains `v: 1` and existing fields. JS preserves the Swift counter timestamp contract before full snapshot writes. AppGroup remains **`group.com.qashi.islamic`**. This repair does not certify an iOS native build.

## Source ownership

```
App.tsx / index.ts                   provider lifecycle + headless entry
src/services/widget{Snapshot,Sync,Bridge,Background,Navigation,Copy}.ts
src/services/tasbihService.ts        native authority / safe mirror / restore
modules/deen-widgets/index.ts        typed exported wrapper
modules/deen-widgets/android/        actual library Gradle, manifest, Kotlin, resources
plugins/widgets/withWidgets.js       former-generated-file migration + existing iOS entitlement
scripts/generate-widget-resources.cjs
src/data/widgetCopy.json             22-language additional copy
```

Compose is enabled in the **autolinked library** (`coreFeatures: ["compose"]`), not through fragile app-Gradle/source insertion. Pinned Glance is **1.1.1**, DataStore **1.1.1**; WorkManager **2.10.5** matches the new Expo background-task dependency. No Glance 1.2 generated-preview API is assumed. The config plugin removes only the old generator-owned app widget files/receiver declarations to avoid duplicate classes and transparent resource overrides; it does not remove app preferences or unrelated native files.

## Automated verification

Run project checks with the repository's supported Node 22 environment:

```
npx tsc --noEmit
node --test --test-concurrency=1 tests/*.test.cjs plugins/__tests__/*.test.js
```

Native harness: `tests/android-widgets` compiles the **actual production `com/deen/widgets` Kotlin, manifest and resources**. It uses Java 17, Gradle 8.10.2, AGP 8.7.3, Kotlin/Compose 2.0.21, Android SDK/target 35 and Robolectric 4.14.1 (API 35). It deliberately **excludes the Expo DSL bridge**. The bridge API/import contract is source-checked against the installed Expo SDK, not certified by this harness.

With those Android tools available, `scripts/test-android-widgets.sh` runs the Android compiler and then JUnit **after Gradle exits**, bounding concurrent JVM memory. Gradle caches/build/test classpaths stay ignored. The runtime tests cover:

- all four real Glance compositions with actual data at three sizes, plus visible empty states;
- selected RTL on an English host and resources for all 22 languages;
- concurrent taps, command idempotency, goals, rounds, existing day/session history;
- non-destructive v1 import, explicit derived-state clearing that retains the counter;
- midnight/calendar selection, expiry, Sunrise exclusion and source freshness;
- stale-background rejection, semantic configuration comparison and cached-verse retention.

The JS/plugin tests additionally cover the real bridge wrapper, native acknowledgments/failures, provider hydration/foreground races, warm/cold route wiring, old-binary/background-module guards, selected-zone/DST calculations, iOS counter preservation and deterministic/reused resources. These are automated/source-level checks, **not phone battery, native release or launcher evidence**.

Current export evidence: **web JS export passed**. An Android JS-export attempt exhausted the workspace's memory before completion; iOS export was not reached in that attempt. This does not negate the native harness result, and neither a successful nor failed JS export proves installed widget behavior.

## Native release/device acceptance — still required

Use the existing external Android build/release workflow. No `eas.json`, manual project regeneration or Xcode edits are introduced here.

- [ ] Full Expo app/release build: module Gradle plugin/bridge, app manifest merge, resolved dependency graph, R8 and signed APK/AAB. Confirm location blocks remain effective in that final artifact.
- [ ] Upgrade over the existing installed package **without uninstalling or clearing data**. Existing widget instances and saved manual city/Tasbih history must survive.
- [ ] Inspect actual picker/reorder thumbnails **and placed widgets**; verify populated, no-snapshot, loading, recovery and exhausted-calendar behavior. Static previews alone are insufficient.
- [ ] Test representative small/wide/tall resize, large font/display scale, light/dark, all language resources and the four RTL languages on LTR/RTL launcher settings.
- [ ] Verify +1/Reset at speed, goal crossing, app-to-widget/widget-to-app return, multiple instances, backup restore, and restart/reboot without lost history.
- [ ] Verify cold/warm/already-foreground widget destinations and the existing app lock.
- [ ] Compare selected city/method/madhab/clock style against the app, including a different phone timezone, midnight, DST, reboot and delayed background work. Do not require exact WorkManager timing.
- [ ] Exercise offline/background/Doze and app process death on actual Android/launcher versions. Document force-stop limitations; do not claim it is equivalent to normal backgrounding.
- [ ] Preserve iOS WidgetKit/Live Activity/AppGroup behavior in the normal iOS release checks.

### Official references

- [Glance state and updates](https://developer.android.com/develop/ui/compose/glance/glance-app-widget)
- [Glance errors/recovery](https://developer.android.com/develop/ui/compose/glance/error-handling)
- [Glance RemoteViews interop](https://developer.android.com/develop/ui/compose/glance/interoperability)
- [Picker previews](https://developer.android.com/develop/ui/views/appwidgets/previews)
- [Periodic work and scheduling limits](https://developer.android.com/reference/androidx/work/PeriodicWorkRequest)

The audit also inspected the pinned Glance 1.1.1 source artifacts; newer documentation examples are not assumed to be available in that version.
