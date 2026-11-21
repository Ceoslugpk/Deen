# R110 — optional native shake-to-report and location-permission safeguards

## Status and approved scope

Implemented after the user's approval of the R109 recommendation. Baseline: `f11890d39a2c33acba5c3a38c0152766ddb703dc`.

- Optional **Shake to report**, **off by default**, on Android/iOS only, below the existing manual reporting action in Settings.
- A deliberate shake shows **Report a problem?**. **Open report form** alone invokes the unchanged external-form helper with exactly `https://forms.gle/9jbqgcvUTBDV4g9Z6`.
- Cancel, Android Back, accessibility escape, backgrounding, navigation or a blocking context dismiss the confirmation without submitting anything.
- Existing manual Settings action remains immediately below Share app. Web still uses its secure real new-tab anchor and does **not** display the native setting, subscribe for shaking, or request browser motion/location permission.
- Explicit Android location-permission blocks and corrected Privacy Policy/Data Safety copy. No removal of an existing declared location grant is claimed: those permissions were absent in R109's inspected current inputs.

**Local implementation/verification complete; push and public deployment verification pending at the time of this initial evidence commit.** The final rollout section is updated after verification.

[Self-contained gallery: seven actual running-web captures](shake-feedback-location-r110-gallery.html). These are real production-web screenshots, not mockups, native screenshots or a simulated shake popup.

## Native behavior and privacy

The shortcut uses the already-installed `expo-sensors` accelerometer; no dependency or new sensor/location permission is added. A separate strict-boolean preference at `@deen/shake-report/v1` defaults off. It uses the existing verified/retried storage layer, exposes failed saves, and never rewrites prayer settings, the selected city or reading records. If a save fails, the UI explicitly says the choice applies only for this session and asks the user to retry before closing.

The signal processor filters estimated gravity and requires four alternating peaks within 1,250ms, at least 110ms between peaks and 400ms across the gesture, plus hysteresis, a 600ms warmup and invalid/gapped-sample resets. Sensing is 25Hz; accepted/dismissed prompts have a 20-second cooldown. No React state is updated for ordinary samples. No motion samples or gesture history are persisted or uploaded.

These are our conservative engineering thresholds, **not Instagram's private algorithm and not physical-device-calibrated values**. Synthetic stationary, rotation, walking-like, isolated-bump, drop/landing and same-direction fixtures do not trigger; deliberate three-axis fixtures do. Real walking, transport, accessibility and battery behavior still need device QA.

Sensing is detached during:

- App background/inactive state, Android window blur before a prompt, cooldown, and while a confirmation/browser handoff is active.
- Splash/onboarding, an active privacy lock, Qibla, Backup, Reader Settings and 16-line Quran Focus mode.
- Open overlay sheets, other `SystemModal` windows, guarded native alerts and keyboard entry.

An Android modal can itself take window focus. The host deliberately ignores that *own-prompt* blur rather than immediately dismissing its own confirmation; real app background changes and independent modal/lock gates still close it. Native-bridge tests cover this wiring, but do not replace Android device validation.

One accelerometer broker owns the subscription/update interval for Qibla and the shortcut. The fastest live consumer wins; removing one restores the remaining rate. Qibla keeps its existing 80ms request and only senses when its screen/app is focused/active. No `removeAllListeners()` or guessed shared interval is used. Qibla's bearing, distance, declination model, arrow/Kaaba geometry and selected coordinates are unchanged.

The popup has localized wrapping buttons, an explicit cancel, an accessibility header/modal boundary, Android system-safe window spacing and an honest retryable browser error. It does not pause/restart audio, capture screenshots, gather logs, prefill identifiers, embed Google Forms or submit reports. Form submission and Google's form privacy practices remain external to the app.

## Location safeguard and policy corrections

`app.json` now explicitly blocks:

| Android permission | Expo-derived manifest result |
| --- | --- |
| `android.permission.ACCESS_FINE_LOCATION` | `tools:node="remove"` |
| `android.permission.ACCESS_COARSE_LOCATION` | `tools:node="remove"` |
| `android.permission.ACCESS_BACKGROUND_LOCATION` | `tools:node="remove"` |
| `android.permission.FOREGROUND_SERVICE_LOCATION` | `tools:node="remove"` |

These XML nodes are **merger-removal instructions**, not requests for access. Configuration introspection confirmed all four markers, no effective location permission, and the same 13 other effective Android permissions as the read-only R109 baseline. Existing activity-recognition, overlay and obsolete fingerprint blocks remain intact. No new iOS location usage key is added.

This is the Expo-managed configuration workflow: no generated native project, hand-edited application manifest, `eas.json`, dependency patch or Xcode change is included. The existing external build configuration remains external.

The Privacy Policy and Data Safety pages now consistently explain, in all 22 UI languages:

- No device-location read or location permission request.
- Manual city/coordinate choice and Makkah until a place is chosen.
- Selected coordinates **are saved locally** and may be used in relevant content requests; no location history is recorded.
- Optional local accelerometer processing, no stored/uploaded samples, confirmation before external navigation.
- Voluntary Google Form reports, no automatic attachments/prefill/submission, and the form owner/Google's role when the user submits.
- Local-data deletion versus a voluntarily submitted report, plus children's information guidance.

The corrected sections bypass obsolete GPS translation-table entries rather than accidentally translating new policy text into old behavior. Unrelated legal sections are not rewritten. Privacy/Data Safety date: `2026-10-26`.

**Artifact limit:** no user-supplied APK/AAB, application AndroidManifest.xml or Gradle final merger/blame report was available. Expo introspection is not a full Gradle/AAR release-merge inspection. The exact older/reported permission's provenance is still unverified. Native permission configuration changes require a new Android binary; a website/OTA update cannot change an installed manifest. No store release was performed.

## Verification

### Automated and export checks

- **343/343 regression tests**, including **59 new** signal/controller/preference/native-bridge/permission/copy checks; no skipped tests.
- TypeScript `tsc --noEmit` passed.
- Production **web, Android Hermes and iOS Hermes exports** passed, sequential native exports with one worker.
- Expo configuration introspection succeeded with no stderr; all four location blocks present and no other effective permission changes.
- No package/lockfile, Quran data/font/layout, city persistence, prayer calculation, sharing helper, feedback destination, audio service or scheduling-loop changes.
- **243 of 250 pre-existing top-level App functions are byte-identical**, including the ordinary Quran reader, Share App and 16-line reader functions. Seven narrowly scoped functions changed for gates/sensors/Settings/legal/Root integration, plus one added native host wrapper.
- All **484 tracked data/resource/asset paths** are byte-identical to the baseline. Detailed source/export/screenshot hashes are in [the machine-readable evidence](shake-feedback-location-r110.json).

One initial full-suite failure was an existing source-string guard expecting route bookkeeping inline. The same focused-route predicate now runs in a shared callback; the guard was updated to assert that callback and both bindings without dropping its route-scoping checks. The final full suite passed. Modal composition tests now render through React's server adapter instead of directly calling a component that uses hooks; their safe-window assertions remain intact.

### Actual running production-web checks (normal motion)

| Check | Result |
| --- | --- |
| Corrected policy + Data Safety | 22 language contexts; 47 viewport layouts; 141 location/motion/report section wrapping checks |
| Browser permission trip-wires | No geolocation or motion-permission API call, including with a seeded native opt-in |
| Manual feedback regression | 22 languages; 48 layouts; 24 exact new-tab navigations, with pointer/keyboard/reload and isolated opener/referrer |
| Ordinary animated Quran | 55: all 78/78 ayahs; 2: all 286/286, with bounded virtualization rather than mounting everything |
| Distant targets | 2:156, 2:255, 2:282, 2:286, Continue at 2:156, fast flick and rotation |
| Original 16-line reader shell | English/Arabic/Urdu: real Focus/Unlock/Back, rotation, 16 original lines, fixed physical top-right Unlock, restored tabs only after leaving reader |
| Preservation | Existing selected city, prayer settings, old-reader bookmarks/notes/position, separate IndoPak state and audio preferences checked in relevant contexts |
| Errors | Zero page, console, HTTP or failed-request errors across all 48 local browser contexts |

Form navigation was intercepted *only* at the external destination with a harmless page. No Google Form was submitted, and these tests do not establish Google's availability, authentication rules or report delivery.

### Important native-release checks still required

No Android/iPhone, emulator, `adb`, final APK/AAB or store release was available. Native bridge doubles, view/hook composition tests and Hermes exports are **not installed-device testing**. Before releasing a new binary, check:

1. Enable/disable persistence, startup/off behavior, storage failure, denied/missing/silent sensor and genuine device motion availability.
2. Deliberate shakes versus walking, travel, rotation, bumps and low-end-device JS load; tune thresholds if needed. Never test by dropping or forcefully shaking a device.
3. Android own-modal focus, Back, system three-button/gesture navigation, notification shade, background/resume, iOS lifecycle and screen-reader behavior.
4. Qibla figure-eight calibration, privacy/backup locks, other dialogs, typing, Quran Focus/pinch/swipes and ongoing audio.
5. All 22 native text layouts, large accessibility text, battery/performance and external-browser failure/retry.
6. The final release-merged manifest/permission listing of the built Android artifact, including the exact artifact where the user originally saw location access.

## Reproduce

```bash
npm run test:regressions
npx tsc --noEmit
# Serve a production web export on a local test port, then:
SHAKE_WEB_URL=http://127.0.0.1:8118 node tests/verify-shake-location-web.cjs
FEEDBACK_URL=http://127.0.0.1:8118 node tests/verify-app-feedback-web.cjs
READER_URL=http://127.0.0.1:8118 READER_PROFILE=phone node tests/verify-quran-reader-web.cjs
INDOPAK_URL=http://127.0.0.1:8118 node tests/verify-shake-reader-shell-web.cjs
```

The loopback URLs above are automation inside the workspace, not browser-facing app API endpoints. No production code was changed to call localhost.

## Public rollout

Pending push/verification in this initial local evidence snapshot. The website will show the corrected policy and preserve manual feedback. The native-only setting and manifest safeguard require a newly built native application.
