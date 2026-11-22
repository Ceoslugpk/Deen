# Native home-screen widgets — Tasbih recovery and layout refinement (R114)

The Android widget work covers **Prayer, Ayah, Tasbih and Hijri**, using the app’s **Islamic / Palestine × light / dark** palettes. R114 refines the compact launcher layouts and adds guarded Tasbih error recovery after the supplied launcher screenshot and the report of an app-counter error followed by closure. iOS native widgets and Live Activity are not redesigned. These are native Glance/RemoteViews widgets, not web widgets.

**Verification:** TypeScript, **420 JavaScript/plugin tests**, **36 production-source Android/Robolectric tests**, and **five JS-to-native counter integration cases** (six TAP tests including their parent) passed. Web, Android and iOS JavaScript graph exports passed. These checks **do not compile/run the complete Expo module/application, Expo JNI, Hermes or R8, and are not a device/launcher pass**. A **new Android binary** is required; a web deployment or JavaScript export cannot install native changes.

**Reported closure remains unverified:** the user’s counter error/closure is genuine reported behavior, but no native exception stack, release artifact or device session was supplied. This revision hardens the counter boundary and recovery path; it does **not establish the original native failure or certify that the phone closure is fixed**. The first release/device gate below is blocking.

## Counter failure and safe recovery

The supplied launcher image showed “Open the app to sync your counter”. The user then confirmed that tapping the counter **inside the app** produced:

> Could not confirm this change. Reopen Islamic to check your saved counter.

R114 replaces that circular app guidance with an **inline, localized Retry** and a stable diagnostic code. While the saved state is unconfirmed, the app does not present a fabricated zero/empty history or permit new mutations. Retry reads/reconciles the saved native authority; **it never replays the uncertain tap**. Mutations already queued after a failure are rejected until a read succeeds, not silently replayed later.

| App code | Meaning |
| --- | --- |
| `TW_READ` | Native authority or the initial app backup could not be read. |
| `TW_IMPORT` | Initial import / explicit restore was not acknowledged. |
| `TW_COMMAND` | A counter mutation was not acknowledged. |
| `TW_DATA` | A malformed record was rejected before React rendering or backup mirroring. The original store is retained. |
| `TW_BACKUP` | A local-only counter write was not confirmed. A failed Android backup mirror cannot undo an acknowledged native transaction. |

- Android’s counter functions now use an **explicit Expo Promise adapter** and a lifecycle-cancelled IO supervisor. Context is captured at invocation. Read/write/runtime errors settle a failure once instead of escaping the counter coroutine; a destroyed React reply is contained. Native diagnostics identify the stage/error class without printing counter JSON, phrases or history.
- A durable command is acknowledged **before** best-effort launcher redraw. Active Glance sessions observe the transaction; short bursts coalesce a separate redraw request over 120 ms. A delayed/failed redraw cannot make a saved tap look retryable. Launcher timing is still OS-owned.
- Native state is validated before it reaches React. Unknown fields and valid full history remain intact. A throwing backup writer or screen subscriber cannot turn a successful native save into an ambiguous command failure.
- Haptic Promise rejections are now consumed as well as synchronous errors. This closes an unhandled-feedback path, **not a diagnosis that haptics caused the reported closure**. Existing feedback mappings are retained.
- There is **no reset, clear-data, uninstall/reinstall workaround, second Android counter, new tracking or uploaded diagnostic history**. The same DataStore, reducer, migration, receiver identities, saved city and explicit-restore rules remain in place. Shared app failure guards also apply to web/iOS; Swift, WidgetKit, Live Activity and AppGroup sources remain unchanged.

## What changed

| Family | Android behavior |
| --- | --- |
| Prayer | Canonical selected-city schedule and next Salah (never Sunrise). Measured headline typography, a smaller localized AM/PM span with a **10 sp minimum**, compact city label with full accessible text, and a quieter minute-precision native city clock. The period size respects Android’s nonlinear large-font scaling. Taller cards reveal the schedule. No frozen countdown. |
| Ayah | Cached Arabic/reference with measured, whole-line fitting, adaptive minimum-card typography and a separated reference footer. Meaning appears when it genuinely fits, including suitable shorter cards; taller cards use an inset. An older real verse remains identified as **Saved ayah**, not today’s verse. No invented religious content. |
| Tasbih | Prominent count/phrase, native goal progress and a stronger **+1** action beside a distinct Reset. The uninitialized card has a Tasbih heading and recognizable app-opening affordance rather than an anonymous centered message. Existing goal rollover, rounds, day/session history and native authority are retained. |
| Hijri | Clear **day / month / year** hierarchy instead of a long equally weighted date, plus the Gregorian footer and city where space allows. It separates only the known published date format and otherwise retains the complete original string. Same selected-city calendar and existing Hijri table; no second calculation. |

All families retain the existing translucent gradients, restrained two-colour marker, fine rims and palette-derived insets. Insets, long localized headings, content budgets and picker previews now follow the refined hierarchy; preview control rows explicitly avoid baseline alignment that can push tall-script Reset labels outside their card. They also have visible loading/error states, separate XML picker previews, an older-launcher image fallback copied from **existing shipped artwork**, and exact-size layouts. Preview content is illustrative, **not a screenshot of an installed launcher**. The earlier audit’s reorder thumbnails and the later supplied placed-widget screenshot are distinct evidence; neither supplies the app’s native exception stack.

Existing receiver identities stay unchanged so installed instances can upgrade in place:

```
com.deen.widgets.PrayerWidgetReceiver
com.deen.widgets.AyahWidgetReceiver
com.deen.widgets.TasbihWidgetReceiver
com.deen.widgets.HijriWidgetReceiver
```

### Glass appearance and theme synchronization

- **Supported material, not wallpaper blur:** checked-in XML drawables layer translucent palette-derived washes, gradients and fine strokes. They do not read the wallpaper or call a backdrop-blur API. Dense washes deliberately protect readability over busy backgrounds. No new artwork or dependency is added.
- `scripts/widget-glass-tokens.cjs` derives the four materials and text/control colours directly from the app’s existing `src/design/brand.ts` palettes. `scripts/generate-widget-resources.cjs` writes deterministic colour/drawable/picker resources; the four older-launcher icons remain byte-for-byte copies of shipped assets.
- The app’s selected Android `themeFamily` and resolved `dark` enter the existing hydrated lifecycle. Changes coalesce through its **150 ms debounce**, then persist and request updates for all four native families. No Home visit, restart or network result is required. **The launcher/Android controls final display timing; this is not an exact latency guarantee.**
- `config.themeFamily` is additive and Android-only. Missing/unknown family defaults to Islamic; top-level `theme` remains `light`/`dark` for the unchanged v1/Swift contract. Full expected-config checks include family/brightness, so stale background work cannot restore an older appearance. Android appearance-only changes reuse the calendar and its calculation timestamp; the existing iOS cache/publication behavior is retained.
- The selected app palette is explicitly provided to every composition, independent of the launcher’s day/night setting. The host-ticked city clock and Reset label are recoloured from that same palette. Picker/first-load/composition-error XML has no app-state context and uses a neutral Islamic host-light/dark fallback until a successful composition.
- Tasbih’s smaller target no longer competes with the count; long custom goals stack when necessary. Progress is clamped presentation of `count / goal`; **existing automatic goal rollover still returns the current count/progress to zero and increments rounds**. No quick-goal controls, new counter operations, reset semantics or history changes are introduced. Short layouts use the phrase as their heading; taller cards also show the localized Tasbih title and percentage. Native label autosizing preserves long Reset translations.
- Native measurements cover the minimum 128 × 128 card, compact/wide/tall layouts, screenshot-shaped 160/170/180 squares, resize breakpoints, and 1.3× system type. All 22 localized Hijri/Ayah/recovery layouts and all 88 XML picker/locale combinations are measured. This does not certify every OEM font/display scale; actual launcher accessibility checks remain below.

### Data and lifecycle

- An invisible `WidgetLifecycle` under the existing providers publishes **outside Home**, after saved city, language, worship settings and theme hydrate. Local prayer publication does not wait for Ayah/hadith/network requests.
- `widgetSync.ts` uses the **same prayer calculator/method/madhab and Hijri table as the app**, with a **32-day** calendar in the selected city's timezone. Display strings and epoch milliseconds derive from the same calculation; Sunrise remains in the schedule but is excluded from next/current Salah.
- The checked JS adapter calls the local module's actual exported wrapper methods. **Snapshot publications** are serialized and deduplicated only after persistence/redraw acknowledgment; failed snapshot publication remains retryable. Counter commands use the separate guarded acknowledgment/read-only recovery boundary above.
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
- Islamic indigo/gold/pearl and Palestine black/white/green/red derive from the shipped app palettes; existing icons are reused. Only the explicitly approved Android widget design changes. No unrelated reader/app UI redesign or data cleanup is included.
- **iOS Swift/WidgetKit/Live Activity sources are unchanged.** The additive snapshot retains `v: 1` and existing fields. JS preserves the Swift counter timestamp contract before full snapshot writes. AppGroup remains **`group.com.qashi.islamic`**. This repair does not certify an iOS native build.

## Source ownership

```
App.tsx / index.ts                   provider lifecycle + headless entry
src/services/widget{Snapshot,Sync,Bridge,Background,Navigation,Copy}.ts
src/services/tasbihService.ts        native authority / safe mirror / restore
modules/deen-widgets/index.ts        typed exported wrapper
modules/deen-widgets/android/        actual library Gradle, manifest, Kotlin, resources
plugins/widgets/withWidgets.js       former-generated-file migration + existing iOS entitlement
scripts/{generate-widget-resources,widget-glass-tokens}.cjs
src/data/widgetCopy.json             22-language additional copy
```

Compose is enabled in the **autolinked library** (`coreFeatures: ["compose"]`), not through fragile app-Gradle/source insertion. Pinned Glance is **1.1.1**, DataStore **1.1.1**; WorkManager **2.10.5** matches the new Expo background-task dependency. No Glance 1.2 generated-preview API is assumed. The config plugin removes only the old generator-owned app widget files/receiver declarations to avoid duplicate classes and transparent resource overrides; it does not remove app preferences or unrelated native files.

## Automated verification

Run project checks with the repository's supported Node 22 environment:

```
npx tsc --noEmit
node --test --test-concurrency=1 tests/*.test.cjs plugins/__tests__/*.test.js
```

Native harness: `tests/android-widgets` compiles the **actual production `com/deen/widgets` Kotlin (including `TasbihBridge`), manifest and resources**. It uses Java 17, Gradle 8.10.2, AGP 8.7.3, Kotlin/Compose 2.0.21, Android SDK/target 35 and Robolectric 4.14.1 (API 35 plus minimum-Android API 24 inflation). It deliberately **excludes the Expo DSL bridge**. The bridge API/import contract is source-checked against the installed Expo SDK, not certified by this harness.

With those Android tools and Node 22 dependencies available, `scripts/test-android-widgets.sh` runs the Android compiler and then JUnit **after Gradle exits**, bounding concurrent JVM memory. It then runs the JS/native integration in a fresh Android VM. Gradle caches/build/test classpaths stay ignored. The runtime tests cover:

- all four actual Glance compositions × four palettes × five sizes (**80 rasterized RemoteViews**) with main-data/colour assertions; Prayer/Hijri/count/goal/action bounds are measured, not just checked for source-string presence;
- eight additional resize breakpoints, screenshot-shaped compact squares, a full six-row prayer schedule, 1.3× Prayer/Tasbih system type, minimum readable 12-hour periods under nonlinear font scaling, and long Ayah/meaning whole-line ellipsis;
- all 22 compact Reset translations and a 999,999 / 1,000,000 stress goal; all 22 minimum-card Hijri/Ayah/sync-recovery layouts at 1.3× type; all 88 picker/locale combinations measured at 128 × 128; and API 24 inflation;
- selected RTL on an English host and resources for all 22 languages;
- concurrent taps, command idempotency, goals, rounds, existing day/session history; explicit counter-bridge IO/runtime failures, destroyed replies, and acknowledgment before a failed/deferred redraw;
- non-destructive v1 import, explicit derived-state clearing that retains the counter;
- midnight/calendar selection, expiry, Sunrise exclusion and source freshness;
- stale-background rejection including a Palestine/brightness change, semantic configuration comparison and cached-verse retention.

The **80 optional internal rasters come from actual test-composed RemoteViews under Robolectric native graphics**, not a phone, launcher or running-app screenshot gallery; they are not substituted for device acceptance. Set JVM property `islamic.widgets.captureDir` to a scratch folder to reproduce them.

A separate **JS/native counter integration** executes the actual `tasbihService` → checked adapter → exported module wrapper against production `TasbihBridge`, DataStore and reducer in a fresh Robolectric VM. A **test-only stdio transport replaces Expo JNI**, not the state/reducer. It verifies first import of a full 85-session record, 100 app taps/rollover, a widget-side transaction adopted in full, an intentionally lost reply **after a real native commit**, read-only recovery without duplication, and phrase/goal/session/reset preservation. This adds meaningful cross-language coverage that the earlier isolated tests lacked; **it still does not test the Expo DSL/JNI or installed binary**. No production server or transport is added.

The JS/plugin tests additionally cover actual TasbihScreen Retry handlers with hook/component doubles, async haptic rejection, malformed native records, thrown backup/subscriber failures, queue suspension, the real bridge wrapper, provider hydration/foreground races, warm/cold route wiring, old-binary/background-module guards, selected-zone/DST calculations, iOS counter preservation and deterministic/reused resources. These are automated/source-level checks, **not phone battery, native release or launcher evidence**.

Current results, source/log hashes, preservation checks and unresolved release gates are recorded in [R114 validation](widgets-r114-validation.json). Historical glass-design evidence remains in [R113 validation](widgets-r113-validation.json). Native-platform JS export checks use `--no-bytecode`: they validate the module graph/bundles, **not Hermes compilation, an APK/AAB or an iOS native build**. Large test/bundler scratch stays on disk under the user cache rather than this workspace’s RAM-backed `/tmp`. The earlier repair’s evidence remains separately available in [R112 validation](widgets-r112-validation.json).

## Native release/device acceptance — still required

Use the existing external Android build/release workflow. No `eas.json`, manual project regeneration or Xcode edits are introduced here.

- [ ] Full Expo app/release build: module Gradle plugin/bridge, app manifest merge, resolved dependency graph, R8 and signed APK/AAB. Confirm location blocks remain effective in that final artifact.
- [ ] **Blocking reported flow:** on the new binary, open Tasbih from its placed widget, tap the app counter repeatedly, return to the widget and verify the same count/history with no error or closure. Capture the Android crash stack if closure recurs, or the displayed `TW_*` code if recovery appears. A source/test pass is not closure verification.
- [ ] In a test build, inject a transient native read failure and a lost post-commit reply; verify inline Retry recovers without replay, zero initialization or lost history. Do not corrupt/delete a real user’s files to perform this check.
- [ ] Upgrade over the existing installed package **without uninstalling or clearing data**. Existing widget instances and saved manual city/Tasbih history must survive.
- [ ] Inspect actual picker/reorder thumbnails **and placed widgets**; verify populated, no-snapshot, loading, recovery and exhausted-calendar behavior. Static previews alone are insufficient.
- [ ] Test representative small/wide/tall resize, large font/display scale, all four Islamic/Palestine light/dark palettes, all language resources and the four RTL languages on LTR/RTL launcher settings. Toggle family/mode/system brightness with widgets already placed and check prompt redraw without lost counts; do not assume exact launcher timing.
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
