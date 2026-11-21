# Share App and Focus-only pinch zoom — R104

## Delivered behavior

### Share App

- **Settings → Share app** is immediately below **Privacy Policy / Terms of Use / Data Safety**, before the Made with footer. It opens a separate page with the existing themed toolbar and working Back action.
- The QR, visible selectable URL, Google Play action and shared message use exactly:

  `https://play.google.com/store/apps/details?id=com.qashi.islamic`

- The English primary button is **“Share app with your friends and family”**. Native platforms use React Native's sharing sheet; web uses Web Share when supported. The link appears once in the shared message, alongside the app name.
- Unsupported web sharing uses the browser's clipboard API and shows **“Link copied. Paste it into a message.”** only after it resolves successfully. There is no claim that a recipient received anything. Cancellation is silent and never secretly copies. An error leaves a localized explanation, the selectable link and **Open in Google Play** available.
- A synchronous in-flight guard prevents repeated taps from launching another sheet. The accessible busy state is explicitly exposed on web as well as native.
- New copy covers all **22 interface languages**, including RTL and Cyrillic Uzbek/Kazakh. No contact permission, account, analytics or QR-service request is added.

#### A real, offline QR

`src/data/app-share-qr.json` contains a fixed **41 × 41** QR matrix, **Q error correction**, and a **four-module quiet zone** on every edge. `AppShareQr` renders black modules on opaque white in both themes, with integer module sizes at the checked widths. There is no logo covering modules and no runtime QR encoder or new app dependency.

The development-only `scripts/build-app-share-qr.cjs` uses `toqr` already present in the locked Expo toolchain. The checked-in matrix is reproducible. More importantly, **OpenCV independently decoded 49 screenshots of the running app's actual rendered QR** to the exact URL—not just a separately recreated source matrix. The captures include compact/phone/landscape/tablet, 22 languages, dark/RTL, and an explicitly offline navigation back to this page. This establishes software decoding, not physical-camera or store-listing availability QA.

### 16-line Quran: pinch only in Focus

- **Focus mode only** accepts a two-finger pinch from **1× whole-page fit to 3× that fit**, keeping the original page aspect ratio. Normal reading remains at its previous fit with **no zoom buttons and no new normal-mode magnification**.
- An immutable paper-space anchor keeps the pinch centre under the fingers; moving both fingers can also pan. At magnification above fit, a one-finger drag pans both axes, including at paper edges, **instead of turning a page**.
- Pinching back to exactly 1× restores ordinary **RIGHT → next / LEFT → previous** page swipes in every interface language.
- The small **Unlock stays fixed at the physical safe top-right**, outside the page gesture viewport. The shell, reading controls and player remain hidden in Focus. Magnified paper can extend behind that fixed control; it stays independently reachable and the paper can be panned. At whole-page fit, the existing clearance keeps all original ink clear of Unlock.
- Unlock/re-entry, Escape or the existing Focus Back action, leaving/blur, a viewport change/rotation, or a **different printed page** resets magnification to fit. Cancellation itself retains the last valid bounded scale but never turns/marks a page. These are **transient route-local values**, not saved reading preferences. Older persisted zoom values are left untouched and ignored for display.
- A second finger cancels the pending 500ms word hold. Adding one during an already captured Focus swipe can become a pinch, not a turn. A third finger, or lifting one pinch finger and dragging the other, blocks the remainder until release. Fresh gestures still work afterward.
- Real word taps, the **0.5-second exact-word reading mark**, ayah actions, bookmarks and authoritative audio-follow remain separate. The current audio page does not move beneath an active pinch; after release, following a different printed page resets to fit. Playing/paused intent is preserved in the final browser checks.
- Browser trackpad pinch is handled through a Focus-only, non-passive **Ctrl+wheel** listener. It changes the Quran SVG viewport, not the browser page zoom. Native Focus scrolling is owned by the page responder; normal native/vertical scrolling remains unchanged.

The supplied font, Quran text, PUA/diacritics, source line breaks, 548-page geometry, outline paths and original `IndopakPageCanvas` are **unchanged**. Only SVG viewport dimensions and bounded scroll offsets change. One stable PanResponder survives the size renders, and native content-size callbacks reapply only the explicit pending scroll correction. Same-page path-node identity and original `d` / shape transforms survive pinch, holds, Focus toggles and rotation.

## Validation

Exact runtime hashes, production bundle identities, new browser reports and regression summaries are in [share-focus-r104.json](share-focus-r104.json).

| Check | Result |
| --- | --- |
| TypeScript | `tsc --noEmit`: passed |
| Full automated regression suite | **245/245**, zero failures/skips; **26 new checks** (15 Share / 11 Focus zoom) |
| Production web / Android / iOS exports | All passed; native artifacts are Hermes exports, not installed builds |
| Share page | **23 isolated browser contexts**, **48 layouts**, all 22 languages, actual clipping/target/URL checks |
| QR | **49/49 actual rendered screenshots independently decoded**, including offline |
| Sharing behavior | Actual RN Web → Web Share payload mapping, repeat-tap guard, silent cancel, honest error; real browser clipboard success and explicit denial; exact outbound Google Play navigation target |
| New Focus zoom checks | **8 contexts**, six extra compact/cover/RTL-dark/side-key/landscape/tablet profiles; actual multitouch and Ctrl+wheel input |
| Pinch interactions | Bounded focal zoom, pan, return-to-fit swipes, interrupted hold, cancel, third finger, split finger release, exact-word hold/tap, fixed Unlock, rotation/blur/reset and legacy state isolation passed |
| Real Arabic continuity during pinch/pan/Unlock | Same `ar.alafasy/2250.mp3`: **0.279795 → 1.728925 → 1.829468 seconds**, one Play call in the final instrumented run |
| Paused / cross-page audio | Paused stays paused; a real near-end seek advances 2:4 → 2:5 while a held pinch defers page follow until release |
| Existing Focus regression | **24 contexts**, nine profiles, five inset fixtures, **44 localized layouts**; keyboard/Escape, original fit, corner popup and Unlock checks passed |
| Complete printed-reader regression | **29 contexts**, 13 detailed pages, nine profiles, swipes/folds/modals/theme/audio/isolation; all **548 pages rendered offline** with correct rows and no outline bounds failures |
| Go to regression | **23 contexts**, 11 profiles, five inset fixtures, two enlarged-text profiles, **66 localized layouts** |
| Existing 16-line playback/follow | **3 contexts / 21 real-media observations**, natural advance, repeat, split verses, Focus and sequential translation |
| Original Reader playback | Phone and tablet first tap, repeat tap, changed ayah, actual progress and bounds passed |
| Total browser contexts across these runs | **112** (31 new-feature + 81 regression contexts) |
| Integrity | **456 protected tracked paths** had no diff; supplied font byte-identical and present exactly once per export |

### Honesty of these checks

- Web Share success/cancel/failure are **explicit bridge test doubles** because Chromium/Linux does not provide an Android/iOS sharing sheet. They verify the real UI/service payload and handling, not OS delivery. Clipboard operations, browser navigation, QR rendering/decoding, gestures and successful media are real. The external Google Play response was intercepted only in the navigation test; its URL was verified without claiming a live listing exists.
- The legacy Expo Clipboard web fallback returns `true` even if `execCommand('copy')` returns `false`. A real denial test caught this. The new page instead calls the browser's rejecting clipboard API directly; it does not inherit that false-success path.
- The new label checker measures each non-whitespace glyph. Chromium's Range API can report an invisible soft-wrap-space box outside a container even though the actual wrapped label is not clipped. This is not an excuse to accept clipped letters or ellipses.
- Intentional navigation to a different printed page naturally creates that page's nodes. The DOM-identity snapshot is renewed after such navigation, then checked across changes to the **same** page.
- The outer shell reached its 360-second tool limit during the comprehensive reader run. Its existing child was **not duplicated**; it subsequently completed all assertions and wrote the full, failure-free report. The 548-page offline sweep took 277,967ms including expensive per-outline bounds checks; that is **not a reader/device performance benchmark**.
- One preliminary zoom/media run saw an extra `HTMLMediaElement.play()` call with an unchanged source (2 versus 1). Its cause was not established. Four instrumented isolated reruns and the final instrumented full eight-context suite did not reproduce it; the successful source/time/call observations are retained in the JSON. No unrelated audio runtime was changed, and that isolated observation is recorded as an **unconfirmed validation anomaly**, not a claimed diagnosed/fixed audio defect.
- The final zoom and playback suites classify two and one respectively cancelled real-media range requests separately; they have no unexpected page/console/HTTP/request errors. Simulated safe insets are not native system-navigation tests.

## Real running-app screenshots

All are unaltered **production Expo web / Chromium, 390 × 844** captures, not mockups or native-device screenshots. Magnified page cropping is intentional; the original full page can be panned and pinched back to fit.

1. [Settings placement below the three legal/privacy pages](screenshots/share-app-settings.png)
2. [Share App, English / light](screenshots/share-app-en.png)
3. [Share App, Arabic / dark](screenshots/share-app-ar-dark.png)
4. [Focus whole-page fit](screenshots/focus-fit-r104.png)
5. [Focus 2× pinch and exact reading marker](screenshots/focus-pinched-r104.png)
6. [Focus Arabic / dark, 2.4× with top/bottom inset fixtures](screenshots/focus-pinched-ar-dark-r104.png)

[Open the self-contained, offline screenshot gallery](share-focus-r104-gallery.html).

## Reproduction

Use Node 22.13+, installed Playwright Chromium, and a fresh production Expo web export. QR decoding additionally uses development-machine Python with OpenCV; this is **not an app dependency**.

```sh
NODE=node_modules/node/bin/node
NODE_OPTIONS=--max-old-space-size=768 "$NODE" node_modules/typescript/bin/tsc --noEmit
"$NODE" --test tests/*.test.cjs plugins/__tests__/*.test.js

# Recreate the fixed development-time QR only when intentionally needed.
"$NODE" scripts/build-app-share-qr.cjs

# Serve the fresh production export on an available port, then:
INDOPAK_URL=http://127.0.0.1:8113 "$NODE" tests/verify-app-share-web.cjs
INDOPAK_URL=http://127.0.0.1:8113 "$NODE" tests/verify-indopak-zoom-web.cjs
INDOPAK_URL=http://127.0.0.1:8113 "$NODE" tests/verify-indopak-focus-web.cjs
INDOPAK_URL=http://127.0.0.1:8113 INDOPAK_SWEEP=1 "$NODE" tests/verify-indopak-web.cjs
INDOPAK_URL=http://127.0.0.1:8113 "$NODE" tests/verify-indopak-navigation-web.cjs
INDOPAK_URL=http://127.0.0.1:8113 "$NODE" tests/verify-indopak-playback-web.cjs
HOTFIX_URL=http://127.0.0.1:8113 "$NODE" tests/verify-hotfix-web.cjs
```

These URLs are local **test-runner addresses**, not browser-facing service URLs in the app. Artifact directories can be overridden using the documented environment variables at the top of each runner. Allow enough time for the optional full offline/outline sweep; do not launch a duplicate if a wrapper times out while its child is still running.

## Remaining device checks / scope

Physical Android/iOS pinch/responder arbitration, platform share sheets, camera scanning, OS Back and edge gestures, screen readers, OEM navigation modes and real-device performance remain device QA. Exports and browser fixtures do not establish them. Native share results do not prove recipient delivery, and the UI does not claim that. Translation coverage is not professional linguistic review.

No new app dependency, generated promotional artwork, font/text/outline replacement, user-data migration/deletion, app release setting, deployment or store submission. **Tajweed and Mufahras remain deferred.** Supplied-resource permission boundaries and original notices remain intact.
