# Android navigation insets and first-tap Qur’an audio

## Scope

Two production fixes only: keep bottom UI above Android Back/Home/Recents, and start a tapped ayah at that ayah on the first attempt. No interface redesign, new dependency, artwork, storage migration, release identifier/version change, EAS configuration change or store submission is included.

## Changes

### System navigation

- The existing app shell is now inside `SystemNavigationBoundary`, using the already-installed `react-native-safe-area-context` and one root `SafeAreaProvider`.
- Android consumes the measured bottom/side system insets **once**. An inner flex container gives absolutely positioned tabs, the mini-player, sheets, onboarding and screen content the same safe content box.
- Existing tab/player gaps and scroll reserves are unchanged. No per-screen copy of the bottom inset is added. Existing top/status-bar spacing, iOS safe areas and web spacing are unchanged.
- The safe-area library updates the boundary when the system navigation mode or window geometry changes. There is no hardcoded three-button-bar height.

### First-tap ayah playback

- The service previously called `engine.prepare()` before it had any sources. That created an empty native playlist, bypassing the engine’s intended “construct with the first queue” path. Native preparation now waits for a real queue and concurrent preparations share one promise.
- Queue construction, clear/add and seeking are guarded against being mistaken for a completed ayah. A stale self-driven track-change event cannot overwrite the current selection.
- Reader verse actions call `playVerse`, which uses per-ayah tracks directly. A downloaded whole-Surah file has no ayah timing map and is **not** a safe fallback for a verse action. Whole-Surah playback still prefers the downloaded file; downloads and the person’s reciter preference are preserved.
- The tapped `verse_key` supplies both the Surah and ayah, including in mixed-Surah Juz/Hizb reading. Missing verse audio produces the existing translated audio-unavailable error rather than silently playing ayah 1.
- A newer verse/queue request or closing the player supersedes an older queue-building/session-restore request. A delayed saved-position seek also checks that it still belongs to the active queue.

## Validation performed

- **37 automated regression tests passed**: 22 audio tests, 8 safe-boundary tests and the 7 existing optional-portrait manifest tests. Audio coverage also checks stale timeline events and genuine completion immediately after a near-end seek.
- Full TypeScript check: `tsc --noEmit` passed with zero diagnostics.
- Separate production Expo exports passed for **web, Android and iOS**, using `--max-workers 1`. The first combined all-platform attempt was killed by the sandbox; separate bounded-worker exports succeeded. The pre-existing Apple team configuration warning was not changed.
- A live Chromium smoke test of the fresh web export passed at **390 × 844** and **900 × 1600**. With no prior playback, the first tap on **55:5** requested and played `ar.alafasy/4906.mp3`; a repeat tap stayed on 55:5; a later tap on **55:7** selected `4908.mp3`. Actual media time advanced. The player stayed above the floating menu. Page, console, HTTP and failed-request error lists were empty for both profiles.
- `git diff --check` passed. `app.json` and native/config-plugin release settings were not modified.

### Important limits

The native audio tests execute the real TypeScript service/engine against explicit native-module test doubles. In particular, the cold-timeline double deliberately models a dropped initial seek when a playlist is constructed empty; that is a defensive regression model, **not a reproduced Android device trace**. The safe-boundary tests use inset fixtures and the library’s JavaScript adapter, not Android system UI.

The native exports check bundling/Hermes compilation. They are **not APK/AAB builds**, native installation tests or proof of Android/iOS device behavior. No Android emulator/device was available here. No update has been submitted or released to public users.

## Re-run

```sh
npm run test:regressions
npx tsc --noEmit
npx expo export --platform web --max-workers 1 --output-dir /tmp/islamic-r91-web
npx expo export --platform android --max-workers 1 --output-dir /tmp/islamic-r91-android
npx expo export --platform ios --max-workers 1 --output-dir /tmp/islamic-r91-ios
```

Serve the fresh **web** export, then run the live browser check:

```sh
# Run the server in its own terminal.
python3 -m http.server 8101 --bind 0.0.0.0 --directory /tmp/islamic-r91-web
HOTFIX_URL=http://127.0.0.1:8101 node tests/verify-hotfix-web.cjs
```

Browser reports/screenshots default to the operating system temporary directory and are not store assets. The probe observes real media playback; it does not replace content/audio responses.

## Before public delivery

Use the existing release workflow, without creating a new EAS configuration. Check on a real Android device or emulator:

1. Enable **three-button navigation**. Check all five tabs, the reader’s last rows, mini-player, bottom sheets and onboarding. Buttons/content must stay above Back/Home/Recents. Repeat in gesture mode; there must not be a doubled bottom gap.
2. Force-close/reopen the app. Without playing the Surah first, tap a non-first ayah. Confirm the **audible recitation**, player title and selected ayah agree on the first tap. Repeat the same tap and choose another ayah.
3. Repeat with a saved playback session, a downloaded whole-Surah file, full-Surah reciter preference and translation sequencing. The verse action must not restart the whole-Surah file at ayah 1. A verse not cached for offline use may require a connection; do not substitute the wrong ayah when offline.
4. Check a verse in a Juz/Hizb after a Surah boundary, normal next/previous/repeat, notification controls, and background Qur’an playback. Live broadcasts must remain foreground-only.
5. Install/update through the existing release path and verify that notes, prayer records, preferences and downloaded files remain intact.
