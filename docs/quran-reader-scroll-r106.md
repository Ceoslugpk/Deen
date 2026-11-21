# Normal Quran reader: blank scrolling window — R106

## Reproduced defect and cause

The user's report was reproduced on the previous production web build, commit `d7951b3c3ac82eb03e333a34af7236b9e16dfeff`:

- Both live Ar-Rahman responses contained **all 78 ayahs**, numbered 1–78: the Arabic script and the English translation. This was not a provider returning only 14 ayahs.
- The new real-scroll regression reached a **blank viewport at 4000px**, with only ayahs **55:1 through 55:14** mounted. An unaltered screenshot and the failing report are preserved.
- The normal reader supplied `getItemLayout` with a single estimated height for every ayah. The actual cards have variable Arabic/translation lengths, section markers, fonts and wrapping widths. React Native treats `getItemLayout` as exact, can skip cell measurement when it is provided, and uses those offsets for virtualization. The false geometry caused the render window and spacers to diverge from the actual content.

This is a shared normal-reader path used by web and native. Android was also reported by the user; a physical Android reproduction was not available in this workspace.

## Targeted fix

- Removed the fabricated fixed-height `getItemLayout` and its height-estimate formula. **FlatList now measures the actual rows.** No Quran text, translation, font, API, saved data or reading layout was replaced.
- Kept virtualization: seven-screen window, 12 initial rows and eight rows per rendering batch. This is not a workaround that mounts all 286 ayahs and their controls at once.
- Added `quranReaderScroll.ts` for distant search/Continue targets. It uses the list's measured average only as a coarse recovery scroll destination after `onScrollToIndexFailed`, never as supposedly exact cell geometry. The list measures more rows and the target is refined once.
- Restoration has a strict retry limit, checks that the target still belongs to the current data, and cancels on a different target, screen cleanup or user scrolling/touch/wheel input. Old timers cannot keep pulling the reader back after they leave or take control.
- Row/list test IDs were added for real rendered-content checks; no visible controls or unrelated UI were added.
- The separate 16-line Quran, Focus pinch behavior, audio engine, Share App and Settings dedication are unchanged.

## Verification

[Machine-readable evidence and hashes](quran-reader-scroll-r106.json) retain the failing old-build result separately from the passing current-build result.

| Check | Result |
| --- | --- |
| Regression on the old production build | **Fails as expected:** blank at 4000px after the initial 14 mounted ayahs, despite complete responses |
| Current normal reader, phone | Every ayah was **actually visible and Arabic matched the live response**: Ar-Rahman **78/78**, Al-Baqarah **286/286** |
| Urdu RTL, 36px Arabic with translation | Ar-Rahman **78/78** visibly rendered, no blank window |
| Large-screen 44px Arabic, continuous mode, translation off | Ar-Rahman **78/78** visibly rendered, no blank window |
| Total verse observations across the four full walks | **520**, across three fresh browser contexts and 436 viewport samples |
| Virtualization retained | Maximum mounted rows: **35** for phone Ar-Rahman, **28** for Al-Baqarah, **34** for Urdu and **48** for large-screen continuous mode |
| Distant direct references | **2:156, 2:255, 2:282 and 2:286** all reached their visible target controls |
| Continue Reading | Marked **2:156**, left the reader, used the actual Continue Reading control and returned to that ayah |
| Fast browser flick and rotation | Settled on real rendered ayahs, not an empty window |
| User data | Existing notes, separate IndoPak reading point/bookmarks and audio preferences remained byte-identical in each scan context |
| Entire unit/regression suite | **267/267 passed**, including 15 new scroll-recovery/integration tests |
| TypeScript | Passed |
| Production exports | Web, Android Hermes and iOS Hermes passed |

The browser test checks every expected ayah key and the full Arabic text against the unmodified live script response, not merely the header count or the initial DOM batch. It allows virtualization to unmount off-screen rows and does not mock Quran responses. Source/test/export hashes and the existing audio smoke result are recorded in the JSON.

The first iOS export was killed by the 2GB validation machine while Hermes compiled. The same source exported successfully in a separate sequential run with a smaller Node heap (256MB); no app code, dependencies or release settings were changed for that build-resource issue.

## Actual screenshots

[Open the self-contained before/after gallery](quran-reader-scroll-r106-gallery.html).

- [Before: reproduced blank reader](screenshots/reader-blank-before-r106.png)
- [After: initial-batch boundary remains populated](screenshots/reader-past-14-r106.png)
- [After: final ayah of Ar-Rahman](screenshots/reader-55-end-r106.png)
- [After: end of Al-Baqarah](screenshots/reader-2-end-r106.png)

All captures are unaltered production-web / Chromium screenshots, not mockups or installed-device captures. A long ayah can extend above a viewport; its complete text was verified during the continuous scan.

## Reproduction

```sh
NODE=node_modules/node/bin/node
"$NODE" --test tests/quran-reader-scroll.test.cjs

# Against the previous export: must fail with the real blank-window assertion.
READER_URL=http://127.0.0.1:8114 READER_BASELINE=1 \
READER_ARTIFACTS_DIR=/tmp/islamic-r106-before \
  "$NODE" tests/verify-quran-reader-web.cjs

# Against a fresh current production web export: must pass all profiles.
READER_URL=http://127.0.0.1:8115 \
READER_ARTIFACTS_DIR=/tmp/islamic-r106-reader \
  "$NODE" tests/verify-quran-reader-web.cjs
```

These are local test-runner addresses, not application API URLs. Physical Android/iOS scrolling, OEM clipping behavior and device performance still need an updated native build and device QA. Exporting Hermes bytecode is not an installed-device test. A Git push alone does not update an already installed Android binary; no store release or manual website deployment is included here. No app-data reset or deletion is part of this fix.
