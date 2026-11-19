# Audio player translation controls — R103

## What changed

- **Translation audio On/Off lives in Now playing**, with a labelled switch and a persisted setting. It uses the same setting as Audio Center, not another independent mute.
- The player exposes **all 11 real spoken translations**, including Urdu, Azerbaijani and Bosnian. Language and performer are shown separately, with wrapping labels and 44px-or-larger targets. Language names and the new hints/errors cover all 22 interface languages.
- A voice choice updates the **active transport and future queue**, not just a stored label. While a translated ayah is playing, the old recording is paused before preparing the replacement. The new recording starts at **zero in the same ayah** and continues without a second Play tap. Seconds are not copied between different-language recordings.
- During Arabic recitation, keep the current Arabic source and playhead; the next accompaniment uses the selected voice. The web transport does not replace or re-play unchanged Arabic. The native playlist rebuild restores its source/position but can briefly pause/seek; seamless device audio has not been established.
- A voice change while paused stays paused. Selecting a future voice while translation is explicitly **Off does not turn it back on**. Disabling an active translation removes its tracks and follows the existing repeat/range/end progression, rather than continuing the old voice.
- Shared service reconciliation covers the player, Audio Center and automatic reading-language/audio matching. Revision guards make newer selections, Pause, Stop, Clear and queue changes supersede older asynchronous operations. Storage writes do not delay source reconciliation and still use the existing per-key storage queue.
- Preserve custom queue order and Arabic reciters during live voice changes. Playback rate, independent volumes and repeat settings are not reset. Saved sessions record actual translation presence plus ayah/kind, while retaining fallback support for older session records.
- Reader **text translation, notes, bookmarks and the independent 16-line reader are not changed by choosing an audio voice**.

### Untimed recordings

Whole-Surah and single downloaded recordings do not contain an ayah timing map. Keep those recordings unchanged and show “Translation audio is available with verse-by-verse playback.” The choice is saved for suitable future playback; no synthetic timing alignment or first-verse replacement is introduced.

### A recording fails to load

The web player reports an unavailable translation, stops automatic interruption-resume attempts for that failed source, and lets an explicit Play retry reload the selected recording. It does not keep speaking the previous language. This was checked using real Chromium offline mode and real recovery, not a mocked successful MP3 response.

## Validation

Machine-readable measurements and exact production bundle identities: [audio-player-translation-r103.json](audio-player-translation-r103.json).

| Check | Result |
| --- | --- |
| TypeScript, exact runtime tree | Passed (`tsc --noEmit`) |
| Full regression suite | **219/219**, including 35 new audio translation checks |
| Production web export | Passed |
| Android and iOS Hermes exports | Both passed; sequential exports, not installed builds |
| New production-web player checks | **30 isolated Chromium contexts** |
| Real selected recordings | **11/11** streamed and advanced at 2:255, including the English 192 / Urdu 64 / Persian 40 kbps URLs and both EveryAyah naming schemes |
| Player language/layout checks | 22 languages at 280px, plus 240px, RTL dark and two short-landscape profiles; all 11 language/performer labels checked for actual rendered-text clipping |
| Current Arabic continuity | Same `ar.alafasy/262.mp3`, advancing from 0.518103 to 5.050653 seconds, with no extra Play/source replacement from enabling/changing the future translation |
| Live language change | Same translated ayah, no second Play; final run measured 833ms from the automation's pre-click timestamp to the new Play call, including scrolling/tapping—not a device or network-latency benchmark |
| Paused, explicit Off, rapid choices, reload | Passed against real transport state and persisted browser storage |
| Shared Audio Center controls | English → Urdu and translation Off changed the live transport |
| Explicit offline failure/retry | Passed; the intentionally denied MP3 request/console error is recorded separately, not counted as an unexpected error |
| 16-line playback/follow regression | 3 contexts / 21 real media observations, including Focus without restart, natural next ayah, repeat, split verses and sequential translation |
| Original reader audio | Phone and tablet first/repeated/changed-ayah playback passed |
| Existing translation preferences | New/saved Urdu and Tamil's real English-audio fallback passed; English UI and explicit audio Off remain independent |
| Protected Quran assets/configuration | No diff; original font byte-identical and present exactly once in each export |

The 35 new tests model both native transport contracts and web behavior: same-ayah voice replacement, unchanged Arabic time, paused intent, Off/On, latest-choice wins, custom and translation-only queues, automatic sync, repeat/range/end, untimed recordings, delayed seek cancellation, session reopen, source failure and locale copy. Model tests use distinct fixture URLs; the separate browser runner uses actual production URLs and clocks.

The browser regression runner's “Start reading” tap now uses minimal scrolling rather than centering text inside the scroll-height-driven hero. The new audio runner waits for the displayed **Pause** action and verifies the real media elements are paused before testing a paused voice choice; a source can advance before Expo's periodic status repaint. Neither adjustment bypasses a control or fakes playback.

## Real running-app screenshots

These are unaltered **production Expo web + Chromium** captures, not mockups and not Android/iOS device screenshots.

- [Translation On, French selected and playing](screenshots/audio-player-translation-on.png)
- [Translation Off, Arabic continues](screenshots/audio-player-translation-off.png)
- [Arabic RTL / dark / saved Urdu voice while Off](screenshots/audio-player-translation-ar-dark.png)

## Reproducing the checks

Use Node 22.13 or later and serve a fresh production web export on an available port. These commands use this workspace's local Node installation; the browser URL is the local runner address, not a browser-facing backend URL.

```sh
NODE=node_modules/node/bin/node
NODE_OPTIONS=--max-old-space-size=768 "$NODE" node_modules/typescript/bin/tsc --noEmit
"$NODE" --test tests/*.test.cjs plugins/__tests__/*.test.js

AUDIO_TRANSLATION_URL=http://127.0.0.1:8111 "$NODE" tests/verify-audio-translation-web.cjs
INDOPAK_URL=http://127.0.0.1:8111 "$NODE" tests/verify-indopak-playback-web.cjs
HOTFIX_URL=http://127.0.0.1:8111 "$NODE" tests/verify-hotfix-web.cjs
TRANSLATION_URL=http://127.0.0.1:8111 "$NODE" tests/verify-translation-selection-web.cjs
```

The audio runner can isolate `live`, `center`, `catalogue`, `offline` or `layout` using `AUDIO_TRANSLATION_ONLY`. Successful audio is never mocked. Offline mode is used only in the explicitly named failure/retry scenario.

## Remaining device checks / scope

- No physical Android/iOS device, simulator, native screen reader or installed APK/AAB/IPA was available. Hermes exports establish bundle compatibility, not device playback correctness or timing.
- Verify native queue rebuild/seek behavior, rapid language changes, paused intent, notification/lock-screen metadata, real interruptions and background transitions on devices. Browser clocks and inset/text fixtures cannot establish native behavior.
- Stream startup depends on the network/provider. There is no crossfade, overlapping old voice, invented new language recording or whole-Surah timing map.
- No new dependency, artwork, Quran typography/data, native release setting, deployment or store submission. The supplied IndoPak font/layout/outlines and original reader settings/data remain untouched.
