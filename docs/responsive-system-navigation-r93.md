# Responsive Android header/footer and system navigation

## Scope

Keep the existing appearance and navigation. Make shared headers, floating tabs and bottom controls fit the available device/window space with full-screen gestures, classic three-section navigation, other navigation-key bar sizes, and system navigation on either side. No artwork, dependency, release configuration or orientation-lock change is included.

## Findings and changes

- The prior shell already protected Android bottom/side system insets. The footer still calculated its width from the **whole window** and forced a **300px minimum**. A live baseline at a 280px viewport reproduced a 300px footer from x = -10 to x = 290, outside the app window. A side navigation bar could similarly reduce the real content width without reducing that forced minimum.
- Android now consumes the measured **top, bottom, left and right** safe-area insets at the shell boundary. Page styles no longer add the startup-only `StatusBar.currentHeight`; this avoids stale top spacing after geometry changes and prevents adding the top inset twice.
- The unpadded inner content view remains the anchor for absolute tabs, mini-player, overlays and onboarding. It publishes its **actual measured size** to shared layout consumers. The safe-area frame/insets provide the initial Android size before the first layout measurement.
- The capsule measures its own parent as well. It keeps the existing normal-phone/tablet widths and normal gutters, reduces only outer gutters on very narrow windows, and never requires a 300px-wide safe box. The tab targets share the available width rather than imposing their own minimum widths. Width caps also protect the interval while a new layout is being measured.
- Header titles/branding can shrink/truncate without pushing their action buttons outside the safe area. The reader uses the safe width, not the full display width, when deciding whether section arrows fit. Mini-player text shrinks before its playback/close controls do.
- Day-tool, correction and verse-action height caps now use the same measured content frame. They therefore respond to status/navigation bars and window resizing instead of budgeting against the entire display.
- The final landscape browser review also exposed a sheet entrance spring briefly overshooting above its safe top. Sheet springs now stop on arrival rather than oscillating through the final position; translations also clamp at their final position, and the inner safe content box clips in-flight content so opening/closing animations cannot draw controls into system-bar space.
- React Native modals are separate Android windows. Both modal call sites now use `SystemModal`, with a fresh safe-area provider and the same boundary inside that window. The modal provider is **not** seeded with the root window's cached initial metrics. A window which is already fitted inside system bars reports zero overlap, so another fixed navigation gap is not added.
- Native safe-area/layout updates handle live navigation-mode changes, rotation, resizing and split-screen. There is no guessed mode name, device model, hardcoded production bar height, saved navigation-mode setting or manual device-selection UI.
- Existing normal tab/player gaps, colours, artwork, labels, destinations and iOS per-screen safe areas are preserved. The splash background continues behind the status area with the matching contrast. No user data or preferences are cleared or migrated.

## Validation

### Automated regression coverage

**98 tests passed:**

- 31 responsive-frame/footer/integration cases;
- 14 safe-boundary/modal cases, including top protection, both side positions, zero/already-fitted insets and iOS/web preservation;
- all 22 previous audio tests;
- all 24 translation/persistence tests;
- all 7 optional-portrait manifest tests.

Full TypeScript checking passed with zero diagnostics. Whitespace and browser-script syntax checks passed. Release identifiers, versions, dependencies, plugins, `app.json` and existing release configuration were checked unchanged.

### Running-app browser checks

The new `tests/verify-responsive-navigation-web.cjs` uses the actual fresh Expo WEB export, real content and no mocked responses. It checks bounding boxes, non-overlapping targets and usable header/footer controls while resizing **without reloading**.

All five tabs' shared headers and footer passed at these **11 viewport sizes** (55 tab/profile checks):

| Profile | Viewport |
| --- | --- |
| Compact phone | 240 × 640 |
| Foldable cover | 280 × 720 |
| Small phone | 320 × 568 |
| Phone | 360 × 800 |
| Large phone | 390 × 844 |
| Phone landscape | 844 × 390 |
| Tablet portrait | 800 × 1280 |
| Tablet landscape | 1280 × 800 |
| Unfolded foldable | 884 × 1104 |
| Large tablet | 1200 × 1920 |
| Desktop window | 1440 × 900 |

Additional passing checks:

- 14 live layout transitions: gesture, three-button, larger key-bar, left-side, right-side, cutout-plus-side and zero-inset fixtures, at both portrait and landscape sizes;
- four reader-header/mini-player size checks, with the player above the footer and its controls inside its safe parent;
- three verse-action sheet/footer checks, including side-key landscape;
- three first-run header/footer checks;
- an Urdu right-to-left header/footer check;
- the R92 Urdu/audio-fallback/reload persistence browser regression;
- the R91 real-media first-tap/repeat/new-ayah playback regression on phone and tablet.

The final browser runs had empty page, console, HTTP-error and failed-request arrays. Reports and QA screenshots are temporary artifacts, not new store assets.

### Bundles and environment

Separate production **web, Android and iOS exports passed**, including native Hermes bytecode. Initial native checks exceeded the sandbox's RAM budget; a smaller Node heap, removal of reproducible old temporary exports, and disk-backed temporary Metro storage allowed the checks to finish. No app/native build configuration was changed. The pre-existing missing Apple team warning remains unchanged.

These results do **not** establish behaviour on every physical device. Chromium checks window geometry, not Android system UI; the system-bar layouts are explicitly simulated inset fixtures. Safe-area unit tests exercise the real component/library JavaScript adapter with fixtures, not an OEM navigation service. Native bundle exports are not APK/AAB installation or device tests. No emulator/device was available and no public deployment/store release is included.

## Re-run

```sh
npm run test:regressions
npx tsc --noEmit
# Use one platform at a time. In a RAM-limited environment, TMPDIR can point
# to a disk-backed disposable cache directory and Node's heap can be bounded.
npx expo export --platform web --max-workers 1 --output-dir /tmp/islamic-r93-web
python3 -m http.server 8103 --bind 0.0.0.0 --directory /tmp/islamic-r93-web
# Run the browser checks in a separate terminal while that server is running:
RESPONSIVE_URL=http://127.0.0.1:8103 node tests/verify-responsive-navigation-web.cjs
TRANSLATION_URL=http://127.0.0.1:8103 node tests/verify-translation-selection-web.cjs
HOTFIX_URL=http://127.0.0.1:8103 node tests/verify-hotfix-web.cjs
```

## Device checklist before public delivery

1. On a real Android phone, switch between full-screen gestures and classic/three-button/navigation-key modes, then return to the running app. Check all five tabs, reader headers, the mini-player, first-run screens and both modal dialogs. Controls must remain above the system navigation area, with no doubled gap.
2. Repeat on a device with a larger navigation-key bar, display cutout, and left/right side navigation where supported. Check window resizing, multi-window and a tablet/foldable. Test supported orientations without changing the app's existing orientation policy.
3. Open/close the keyboard in note/report/time-related screens and verify that bottom actions are reachable. Confirm system Back closes overlays before navigating away; existing hardware/gesture Back integration is unchanged.
4. Confirm the previous exact-ayah playback and Urdu text/audio/persistence fixes still work on-device. Install/update through the existing release workflow and verify saved records/downloads remain intact.
