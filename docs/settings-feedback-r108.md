# Settings: report or request a feature — R108

## Requested change

Added **“Report or request a feature”** directly beneath **Share app** in Settings. It uses the exact publisher-supplied destination:

**https://forms.gle/9jbqgcvUTBDV4g9Z6**

The existing Settings row styling is reused, with the existing chat and external-link icons. Long translated labels wrap naturally. Share app, the legal rows, Made with and the final localized dedication retain their existing order and behavior.

## External browser behavior

- **Web:** a real HTML link opens a separate tab using `target="_blank"` and `rel="noopener noreferrer"`. The original Settings page stays open. There is no simultaneous JavaScript opener, so one activation does not open the form twice. Keyboard Enter and ordinary link behavior remain available.
- **Android/iOS:** `Linking.openURL` hands the exact HTTPS link to the user's external default handler/browser. No embedded WebView or in-app browser is introduced. The OS ultimately controls the selected handler.
- Native duplicate presses are ignored while the browser handoff is pending. A rejected handoff displays a localized retry message; no success or submitted-report claim is shown.
- No app state, notes, reading history, contact data, account ID, tracking parameters or prefilled form answers are attached. The app does not load, fill or submit the form. Submission is entirely the user's action on the external site.
- Button and failure copy are translated in **all 22 interface languages**. Uzbek and Kazakh remain Cyrillic; Malay and Indonesian are separately translated.

## Verification

| Check | Result |
| --- | --- |
| Production-web Settings layouts | **22 fresh normal-motion contexts**, **48 layouts**, including all 22 languages at 280px and 390px, English 240px, landscape, desktop and reload |
| Row placement and label | Directly below Share app; exact English; full localized label visible without ellipsis/clipped glyphs; accessible link label |
| Safe reachability | Complete row remains inside safe content and above the navigation boundary |
| External navigation | **24 real new-tab activations**, including keyboard Enter and after reload; exact URL, GET navigation, no referrer, `window.opener === null`, original Settings retained |
| Before user action | No form request or prefetch |
| Existing Settings behavior | Share app still opens its QR page and has no printed store URL; dedication remains the last Settings content |
| User data | Existing notes, bookmarks and both normal/separate IndoPak reading points remained byte-identical |
| Unit/regression suite | **284/284 passed**, including ten new external-link/localization/placement/native-handler tests |
| TypeScript | Passed |
| Production exports | Web, Android Hermes and iOS Hermes passed |
| Normal-motion Quran regression | Actual wheel scrolling through Ar-Rahman **78/78** and Al-Baqarah **286/286**, distant references, Continue Reading, fast flick and rotation passed on the new export |

The external form requests are intercepted **only in the browser test** with a harmless document. This proves the actual destination and tab isolation without sending a report, relying on third-party authentication or claiming the Google form's availability. Native handoff, duplicate-press and failure tests use explicit bridge doubles and the actual Settings handler. Hermes exports are not installed-device tests.

[Machine-readable evidence and source/export hashes](settings-feedback-r108.json) · [Actual running-app screenshot gallery](settings-feedback-r108-gallery.html).

## Reproduction

```sh
NODE=node_modules/node/bin/node
"$NODE" --test tests/app-feedback.test.cjs
FEEDBACK_URL=http://127.0.0.1:8117 \
FEEDBACK_ARTIFACTS_DIR=/tmp/islamic-r108-feedback \
  "$NODE" tests/verify-app-feedback-web.cjs
```

`FEEDBACK_LANGUAGE=en` restricts the same browser checks to English for rollout smoke testing; without it the full 22-language matrix runs. The local test-server address is not an application destination. No new dependency, artwork, storage migration/deletion, reader changes, permission prompt, domain/project-setting change or app-store submission is included.
