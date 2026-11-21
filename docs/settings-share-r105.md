# Settings dedication and cleaner Share App — R105

This is a follow-up to the completed [R104 Share App / Focus release](share-focus-r104.md), based on `1bc7a1fdee79def8fa2f438279baab36c7c1ee65`. R104's historical documentation, screenshots and validation record are retained unchanged.

## Delivered

### Share App without a printed URL

- Removed the raw URL text from **Settings → Share app**. The removed element is absent, not merely hidden by styling.
- The bundled offline QR, native/Web Share payload, honest clipboard fallback and Google Play action still use exactly `https://play.google.com/store/apps/details?id=com.qashi.islamic`.
- The English primary action remains **“Share app with your friends and family”**. Sharing is user-initiated; cancellation stays silent, never secretly copies, and is not presented as recipient delivery. Busy/repeated-tap protection is unchanged.
- All six copy fields—title, QR explanation, sharing action, store action, copied status and error status—cover **all 22 interface languages**. Back and accessibility labels follow the interface language too. `Islamic Companion` and `Google Play` remain proper product names.
- Updated every error translation to offer retry or Google Play. No language tells the user to select a link that is no longer on screen.
- Share App opts into a wrapping toolbar title. A new strict glyph check caught the French title being truncated at 280px; all translated titles now pass. Other screens keep the original single-line toolbar by default. No unrelated redesign was applied.

### Dedication at the very end of Settings

The dedication is the **last Settings content**, below the existing Made with footer. English is exactly the supplied text:

> 2026 © Islamic. This app is a hadiyah for my beloved parents and the entire Muslim Ummah. May Allah accept it as sadaqah jariyah and grant them His mercy and forgiveness.🤲❤️

`src/services/settingsDedication.ts` provides localized wording for all **22 interface languages**:

`en ar ur fa ps fr tr ru uz kk zh vi az bs bg si bn hi id ms ta ml`

The year, `Islamic` brand and final emojis are fixed. Uzbek and Kazakh remain Cyrillic; Malay and Indonesian have their own wording. Arabic, Urdu, Persian and Pashto use RTL direction. Text wraps without a line limit or font shrinking, uses existing theme colors and has no storage, clock or network dependency. Unsupported locale names safely fall back to the exact English text.

## Verification on the current build

Machine-readable reports, source/test/screenshot hashes and bundle identities are in [settings-share-r105.json](settings-share-r105.json).

| Check | Result |
| --- | --- |
| Complete unit/regression suite | **252 / 252 passed**, including seven new tests |
| TypeScript | `tsc --noEmit` passed |
| Production exports | **Web, Android Hermes and iOS Hermes passed** |
| Fresh Share/Settings browser contexts | **24**, no page, console, HTTP or failed-request errors |
| Share App layouts | **50**; all 22 languages at 280px and 390px, plus compact, landscape, tablet and live-switch/reload observations |
| Complete dedication layouts | **51**; exact rendered text, final-child position, RTL/LTR, per-glyph clipping, safe bounds and offline coverage |
| Localized copied/error status pairs | **44**: both outcomes in every language at both phone widths, **88 rendered status observations** |
| Language persistence | Real English → Arabic choice in the actual Settings picker; both screens immediately update and remain Arabic after a same-profile reload |
| QR | **51 screenshots of the running app's rendered QR independently decoded** with OpenCV to the exact destination, including offline navigation |
| Sharing behavior | Original payload, repeated-tap busy guard, silent cancellation, actual browser clipboard fallback, denied clipboard and exact store-navigation target passed |
| Existing Focus browser regression | **24 contexts**, nine profiles, five inset fixtures, **44 localized layouts**, all eight existing check groups passed |
| Total fresh browser contexts in this revision | **48** |
| Integrity | **473 protected tracked paths unchanged**, including all 456 protected by R104, original reader/zoom/QR sources, language/storage services and historical R104 evidence |
| Original supplied Quran font | Byte-identical; present **exactly once in each of the three exports** |

The complete 548-page offline sweep and instrumented pinch/audio suite were not rerun for this copy-only revision. Their [R104 evidence](share-focus-r104.md) and original 16-line component/resource sources remain unchanged. The full existing Focus browser regression was rerun against this revision's actual web bundle.

### What the browser checks do and do not prove

- Web Share success/cancellation/failure use explicit browser bridge doubles because Chromium/Linux has no Android/iOS sharing sheet. The primary English clipboard success uses the actual browser clipboard; its later denial case uses an explicitly rejecting clipboard double, not a browser permission dialog. The repeated all-language copied/error status checks also use explicit clipboard doubles. No recipient-delivery claim is made.
- The Google Play navigation response is intercepted only by the test; it verifies the exact URL, not a live store listing or published app update. OpenCV decoding is software verification, not a physical-camera guarantee.
- An initial persistence test transferring complete application storage into a fresh HTTP-cache context observed three aborted background requests; their root cause was not established. The final test uses one-time initial fixture preferences, the actual Settings picker and a normal same-profile reload, without re-seeding preferences on every load. No application networking code was changed or claimed fixed. All error assertions remain strict and the final contexts have empty error arrays.
- Authored translations and complete rendered coverage are not professional linguistic review. Native exports establish bundling, not installed-device rendering, OS sharing sheets, screen readers, hardware gestures or performance.

## Real running-app screenshots

All six are **unaltered production Expo web / Chromium captures at 390 × 844**, not mockups or native-device screenshots. Settings captures are deliberately scrolled to the very end.

1. [Settings dedication — English / light](screenshots/settings-dedication-en-r105.png)
2. [Share App — English / light, no printed URL](screenshots/share-app-en-r105.png)
3. [Settings dedication — Arabic / dark](screenshots/settings-dedication-ar-r105.png)
4. [Share App — Arabic / dark](screenshots/share-app-ar-r105.png)
5. [Settings dedication — Urdu / dark](screenshots/settings-dedication-ur-r105.png)
6. [Share App — Urdu / dark](screenshots/share-app-ur-r105.png)

[Open the self-contained offline screenshot gallery](settings-share-r105-gallery.html).

## Reproduction

Use Node 22.13+, installed Playwright Chromium, Python/OpenCV for independent development-time QR decoding, and a fresh production web export. OpenCV is not an app dependency.

```sh
NODE=node_modules/node/bin/node
"$NODE" --max-old-space-size=768 node_modules/typescript/bin/tsc --noEmit
"$NODE" --test tests/*.test.cjs plugins/__tests__/*.test.js

# Serve the fresh export on an available port, then:
INDOPAK_URL=http://127.0.0.1:8114 \
APP_SHARE_ARTIFACTS_DIR=/tmp/islamic-r105-share \
  "$NODE" tests/verify-app-share-web.cjs

INDOPAK_URL=http://127.0.0.1:8114 \
INDOPAK_FOCUS_ARTIFACTS_DIR=/tmp/islamic-r105-focus \
  "$NODE" tests/verify-indopak-focus-web.cjs
```

Those are local test-runner addresses, not browser-facing application API URLs. Use an empty artifact directory for each complete QR run so screenshots from a previous run cannot affect its count.

No new runtime dependency, generated artwork, user-data migration/deletion, release configuration, deployment or store submission. Tajweed and Mufahras remain deferred; original Quran text/font/layout, supplied-resource permission boundaries and notices are unchanged.
