# Separate offline 16-line Quran

## Entry point and current scope

**Quran → Explore → 16-line Quran** opens a separate screen. It is not a Reader setting and does not re-enable the retired Mushaf (`MUSHAF_ENABLED` remains false). Existing Reader settings, translation/reciter choices, bookmarks, notes and stored user data remain independent.

The screen contains:

- the supplied **Taj Company IndoPak 16-line / 548-page** layout, matching verbatim Nastaleeq word text and the supplied **AlQuran IndoPak by QuranWBW v2.100** font;
- a tappable **top page counter**, page entry including Arabic/Persian digits, one responsive **Go to → Surah / Juz / Verse** picker, independent page bookmarks and one exact ayah/word-level Continue reading marker;
- lightweight paper-fold swipes: **right → next page; left → previous page**, in every interface language;
- **Focus mode instead of Zoom**: the complete, undistorted paper fits the available safe screen, the app header/top controls/mini-player disappear, and a small **top-right Unlock** restores normal mode. Audio keeps playing;
- per-verse hit targets and a larger **Go to → Verse** alternative, whole-ayah highlighting and a small three-icon recitation/translation/reading-marker popup;
- current-recitation highlighting and page/line following from the authoritative audio queue, independent of selection, saved reading point and page bookmarks;
- shared labels and feature copy in all **22 interface languages**. Uzbek/Kazakh remain Cyrillic; Malay and Indonesian remain distinct;
- the bottom tab menu hidden **only on this screen**, even in normal mode, with its empty reserve reclaimed;
- a short Sources panel showing the edition and `QUL / Tarteel · QuranWBW`; the resource notices retain full credits, original restrictions and permission notes;
- light/dark colours and existing brand assets. No new illustration, dependency, orientation policy or release configuration is introduced.

Reading pages needs no scripture/layout API call. Audio and translations use the existing app's network/download availability; no recordings or new translations are bundled.

## Edition and content integrity

| Item | Verified result |
| --- | --- |
| Pages | 548 |
| Original layout rows | 8,742 |
| Ayah / Surah heading / basmalah rows | 8,598 / 114 / 30 |
| Word and marker records | 83,668 |
| Canonical verses / Surahs / Juz | 6,236 / 114 / 30 |
| Lazy page chunks | 18, at most 32 pages each |
| Unique shaped texts / original-font glyphs | 22,761 / 572 |
| Generated runtime JSON | 8,788,559 bytes |

The original SQLite and TTF remain byte-identical. Checksums, sources, original font notice, attribution and the owner's permission record are in [`resources/quran/indopak-taj-16/NOTICE.md`](../resources/quran/indopak-taj-16/NOTICE.md). The generator fails closed on changed original layout, font, raw word text or pinned Surah metadata. The owner's distribution permission is recorded, not independently verified or represented as an open licence.

All word IDs join the source layout exactly once and in order. Original strings—including diacritics, private-use symbols and embedded spaces—remain verbatim. Page breaks, line ranges/types and centering flags are copied directly. There is no tatweel insertion, letter normalization, arbitrary 16-row regrouping or substitution of the 604-page Madani map. Source-defined short pages remain short: pages **1/2 have 7 rows**, **529/530 have 15**, and **548 has 10**; all other pages have 16.

The database supplies line boundaries/types, not scanned images or exact printed coordinates. The renderer fits those original lines within a scalable frame. Its border/spacing are not claimed to be a pixel-identical facsimile of a printed book.

## Rendering and implementation

`indopakMushaf.ts` owns canonical lookup, original line placement and fitting. `IndopakMushafReader.tsx` owns this edition's controls, gestures and live viewport. `IndopakPageCanvas.tsx` shares original-font rendering between the live page and the non-interactive outgoing snapshot. `App.tsx` handles entry/routing, existing-audio/Reader callbacks and this route's menu/player placement.

An early running-app check caught browser SVG text separating leading waqf marks from private-use ayah symbols; native SVG also has its own bidi/shaping engine. The canvas therefore draws **the original font's contours at precomputed HarfBuzz RTL positions**, one composed SVG path per word. The font is neither modified nor subset, and remains bundled once and hash-verified in each production export. No platform-specific text reshaping is used for scripture placement.

The generator uses `uharfbuzz==0.57.0` and `fonttools==4.68.0`, emitting UTF-8 JSON-string envelopes for large numeric tables. Only requested page chunks expand; six-chunk and 512-word-path caches bound derived data. Builds use checked-in runtime data; the source database is retained for audit/regeneration, not runtime queries. No SQLite package or new runtime dependency is needed.

R100 separated **memoized fixed line ink/hit targets, headings, paper and live highlights**. SVG resizing or selection/recitation/marker changes do not recreate the fixed-word component. Stable dispatchers use the latest committed callbacks, not stale page/hold/action state. This work remains in R102. Native SVG still redraws the vector surface as needed; memoization does not make drawing free.

## State isolation

- Edition: `indopak-taj-16`; storage: `@deen/quran/indopak-taj-16/state/v1`.
- Existing schema: validated page 1–548, sorted valid saved pages, optional `readingPoint: { page, verse, wordId }`, and the older 1/1.5/2 zoom field.
- **R101 retains old zoom values on disk but never uses them to magnify rendering or disable swipes.** Loading a saved 2× page cannot trap someone in an inaccessible old mode. No zoom migration or deletion is performed.
- Opening/restoring the screen performs no write. Page, page-bookmark and explicit reading-marker actions save through the existing edition-specific path. Focus/Unlock and the last-used Go to tab are temporary UI state, not persistent preferences. Opening, switching or searching the picker does not change the saved reading point or page.
- No shared Reader position/preference/note/bookmark migration, clearing or heuristic deletion occurs. A translation action deliberately opens the existing Reader with `focusVerse`, where normal Reader behaviour applies.
- Canonical Surah:Ayah keys remain authoritative, including verses split across printed pages. Juz lookup uses verse boundaries, not another edition's page map.

## Normal controls and navigation (R95–R97, retained)

The top counter is **Page N / 548**, tappable for direct selection and exposing increment/decrement accessibility actions. **Go to**, page saving, **Focus** and Sources stay above the normal page. Go to replaces the three standalone Surah/Juz/Verse buttons; it always retains its visible localized label, even at 240px. Compact widths keep the established icon-only Focus/Sources controls; short wide landscape frames combine the top groups into one row. Toolbar buttons wrap at their natural width/height rather than squeezing labels or imposing a two-line cap. All targets remain at least 44px. There is no bottom pager, pager arrows, hint/footer row or duplicate printed page number. In normal mode an active mini-player keeps its safe reserve; short landscape panes retain width-fit vertical reading/scrolling.

Route detection follows only the navigation state's active leaf. An inactive Quran stack, stored route or route parameter cannot hide other screens' menu/player. Leaving this screen, opening the full audio player or opening the existing Reader restores the normal shell. The original Reader's persistent scroll-triggered Focus preference is untouched. Android retains the shared four-edge system-safe boundary; iOS retains its safe-area handling and mini-player bottom inset.

Deliberate horizontal single-finger swipes advance at most one authentic page. Vertical/short/cancelled drags and multi-touch, including a finger added after capture, cannot turn a page. Native recognizers may take over; terminated gestures do not turn. A brief suppression window prevents a swipe/turn from opening ayah actions accidentally. R101 always passes the unzoomed scale to these guards, independently of old stored zoom.

Web ScrollView wrappers remain enabled: disabling them would impose `touch-action:none` on descendants. The page stage uses `pan-y` so real vertical landscape scrolling coexists with horizontal JS page turns. Native vertical scrolling depends on actual overflow; horizontal paper scrolling is no longer needed. Viewport changes preserve a bounded physical page-centre anchor via `indopakResizeOffset`, independently of interface direction. Explicit pending Continue reading/Verse reveals and recitation following retain priority over generic resize corrections. Asynchronous content-size callbacks reapply only an explicit correction, not an unconditional snap to the right edge.

Page changes use the **320ms lightweight native-driven paper fold**, not a slide or heavy 3D mesh. A curved blank back, crease and soft shadow reveal the stationary next page. Higher page numbers fold left → right; lower numbers reverse, regardless of interface language. Direct jumps use the same rule.

`IndopakPageFold.tsx` clips a non-interactive outgoing canvas; equal/opposite clip and face translations keep scripture stationary, without scale/reflection/skew. Only decorative paper/shadow transforms animate. `indopakFold.ts` uses actual centred paper edges and captured scroll offsets. The snapshot has no word targets, is hidden from accessibility and cannot intercept touches. There is no per-frame React state or path rebuilding. Reduced motion skips it; geometry changes, enabling reduced motion, leaving the route or pressing Unlock in a focused fold settle and remove the old layer safely.

## On-ayah actions and reading marker (R98, retained)

Tapping an ayah highlights all its original-line fragments and opens **only three icons**: recitation, translation and save reading position. Each has a canonical, localized accessible label and a 44px target. There is no large verse panel, visible popup text or extra close button. The popup prefers above the whole visible ayah, falls below at the upper edge, and stays inside the actual page viewport. A very long/clipped ayah may use the tapped fragment if neither outer edge fits. Coordinates are physical LTR; icon order follows the interface language. In Focus, the popup also clears Unlock without covering the selected fragment.

The mark icon and a **500ms stationary single-finger hold** both set the **same one Continue reading point**, not a whole-Surah bookmark or another Reader preference. Page, canonical ayah and original global word ID validate against the bundled page. A later line/page of a long ayah resumes exactly. The marked ayah keeps a restrained gold-edged highlight after dismissal; selection and current recitation remain separate.

**Page → Bookmarks → Continue reading** reveals the exact saved word/line; reopening that marked page also reveals it. Browsing other pages never moves the explicit marker. Last visited page and saved pages remain independent.

Native SVG uses its supported 500ms long-press handler. Web uses one cancellable timer because its SVG adapter lacks the native responder mixin. Movement over 8px, scrolling, multi-touch, cancellation, page/geometry/Focus changes or unmounting cancel unfinished holds. Release after a completed hold cannot trigger playback/translation. Dragging a popup icon cannot turn or mark. Outside taps, scrolling, mode/geometry changes, Escape, accessibility escape and native Back dismiss actions without deleting the mark. Success is announced only after saving; normal mode retains the storage-error retry UI.

## Recitation-follow highlighting (R99, retained)

The audio emitter derives the published track from the resulting **queue and index**, not a stale track object. Natural advancement, next/previous, repeats, sequential translation and mini-player metadata stay consistent. `useIndopakRecitation.ts` observes a primitive canonical-ayah snapshot; ordinary progress/buffering ticks do not rerender the reader subscription. No guessed durations, new timing map or content changes are used. Pause retains the current highlight; clearing audio removes only that highlight. Untimed whole-Surah/downloaded tracks (`globalNumber: 0`) do not receive a fabricated current ayah.

An on-page Play enables following. Targets use this 548-page edition, preserve a visible later-page fragment of a split ayah and reveal only offscreen anchors. Following waits for the requested audio key, runs only on the active screen, and defers during touch/holds, selection, pickers, pending reveals and turns. Manual page navigation/Continue reading opts out until another on-page Play; highlighting still reflects the actual current ayah on the browsed page. Following updates only the last visited edition page, not the saved mark/bookmarks. Focus mode keeps this behaviour and never pauses, clears or restarts the queue merely to hide its controls.

## Full-page Focus / Unlock (R101)

- **Zoom is removed**, replaced by the existing localized **Focus mode** label and fullscreen-style vector icon. Normal rendering is always 1×, ignoring—but preserving—the older saved zoom field.
- A temporary, route-gated `IndopakFocusContext` coordinates this reader with the app shell. Entering Focus unmounts the app header, reader controls and mini-player and removes their reserved spacing, the normal bottom 12px and the desktop 1180px page-width cap. The original Reader's Focus setting and global scroll-chrome logic are not reused.
- `fitIndopakFocusPage` uniformly fits the original **1000×1640** paper within the complete available safe viewport, including landscape. It never stretches, crops, reshapes or reflows scripture. At paper-like aspect ratios it reduces the fit only enough to keep the source body clear of the corner control. Width-limited portrait and height-limited landscape naturally retain unused space on the other axis.
- A **44×44px open-lock button**, 8px from the **physical top right**, is outside the page swipe responder. It remains reachable in RTL, safe-area fixtures, rotation and page turns. Unlock returns normal chrome/player placement without resetting audio or deleting data. The safe viewport remains outside OS status/navigation/cutout areas; no browser/OS immersive API or orientation setting is changed.
- Transient ayah actions still work. `clearIndopakFocusPopover` shifts an above-ayah popup left when necessary so none of its three actions overlaps Unlock; exceptionally narrow panes can use a below-ayah placement. Normal mode popup geometry is unchanged.
- Mode/geometry changes cancel unfinished holds, dismiss actions and settle outgoing folds. Focus is part of the recitation reveal token, so an active ayah is rechecked at the new fit. Web Enter/Space activates Focus, keyboard focus transfers to Unlock and returns to Focus on exit; Escape exits after dismissing an open ayah popup first. Native Back/accessibility escape provide return paths in addition to Unlock.
- Blur/unmount resets temporary Focus. It cannot hide UI on another route or persist a locked screen for the next visit. Hiding a paused or playing mini-player changes visibility/reserve only—there is no audio transport operation in the Focus path.

R100's memoized rendering and viewport-correction work remain. Its removed Zoom UI/browser runners are historical; [the recorded before/after measurements](indopak-zoom-r100.json) remain available, with original runner sources at commit `b1e3b90`. Those timings are not Focus or native-performance benchmarks. The current active runner is `tests/verify-indopak-focus-web.cjs`, and geometry tests are named `indopak-viewport.test.cjs`.

## Consolidated Go to and complete labels (R102)

The user chose **one Go to button**, not three separately resized controls. It opens a picker with exactly **Surah / Juz / Verse** tabs. The most recently used directory tab is remembered only for this mounted reader session; it is never written into edition or Reader preferences. Switching tabs resets that tab's search/list position so a Surah search cannot accidentally hide Juz or ayah entries.

`indopakNavigation.ts` groups the three directories separately from **Page / Bookmarks**. Page entry and saved pages remain accessible from the existing top counter; its bookmark icon still toggles only the current page. Sources remains its short separate panel, and Focus/Unlock is unchanged. Canonical Surah/Juz targets and on-page ayah actions use the same existing callbacks. **Verse still lists the current printed page**, now explicitly captioned `Page N / 548`; this is not a new global verse/Quran/Hadith search implementation.

The old shrinking five-control toolbar becomes three controls. Buttons and picker tabs can wrap, have natural height and at least 44px targets, and do not use a two-line truncation cap. Long translations may use more than one row instead of clipping. The new Go to label is localized in all 22 interface languages in the feature copy service, without shifting any older positional copy value; Uzbek/Kazakh stay Cyrillic and Malay/Indonesian labels differ.

Picker headings, tabs and search scroll with the virtualized list; Page/Sources use a scrollable content area. The independent Close action stays inside the safe panel when the viewport is short or a keyboard-height fixture is applied. Actual short-pane list selection and page entry were exercised, not only modal bounds. Tabs expose selected semantics and a roving web tab stop, transfer focus on selection, and support physical left/right arrows (including RTL), vertical arrows for wrapped tabs, Home/End and Escape. Escape also works during the opening web fade; native Back retains the existing SystemModal close path.

## Validation completed on R102

[Durable bundle identities, counts, checks and limitations](indopak-navigation-r102.json).

- **184/184 automated tests passed**; TypeScript had **zero diagnostics**. Seven new tests cover exact tab grouping, temporary memory/wiring, physical LTR/RTL and wrapped keyboard policy, complete localized copy, one toolbar entry without line caps, scrollable picker content and retained independent controls. All existing content/state/fold/Focus/playback tests passed.
- **Navigation-specific production WEB:** **11 viewport profiles**, including the 330px breakpoint, 844×268 short landscape and a 390×320 keyboard-height fixture; **five safe-inset fixtures**; **two 2× browser-label-size fixtures**; **66 localized checks** (22 languages at 240/280/390px); **23 error-free contexts**. All toolbar and tab targets stayed safe and non-overlapping, with complete rendered labels checked using actual DOM text ranges and scroll dimensions, not just accessible names or button boxes. Surah 55/Juz 30 jumps, exact current-page Verse selection, separate Page/Bookmarks, search reset, remembered tab, keyboard/RTL, Escape, short-pane scroll/selection/page entry, connected scripture nodes and unchanged old Reader keys passed.
- **Full reader:** all **548 pages offline**, real touch swipes and original SVG contour/source-row checks, **zero failed bounds**, **305,650ms** for the deliberate exhaustive sweep (not rendering performance or scholarly proofreading); **29 error-free contexts**, 44 translated top layouts, nine normal viewports, five inset fixtures and 12 picker/source geometry checks. Fold motion and its cancellation/reduced-motion protections passed.
- **Focus:** all prior entry/Unlock, physical-corner/ink/popup clearance, mode reset, audio reserve, keyboard focus, swipes/rotation and old 2× data-preservation checks passed: **24 error-free contexts / 44 localized checks**.
- **Ayah/marker:** **23 error-free contexts / 44 localized checks**; a real stationary hold saved at **516.1ms**, not at 350ms. Exact marker/resume/reopen, cancellation/movement/multi-touch/resize, popup dismissal, page bookmarks and old Reader data passed after migrating Verse access through Go to.
- **Playback:** **21 actual media observations / three error-free contexts**. Focus entry preserved the real playing URI/play-call count and advanced 55:5 from **0.093260s → 0.589744s**, then naturally to 55:6. Cross-page, manual-browse deferral, repeat/pause, split ayahs, landscape/Focus on-page actions, Urdu dark mode and real sequential translation passed. **Six intentional media-range cancellations** are kept separately; there were no unexpected page/console/HTTP/request errors.
- **Existing audio, translation-selection and 11-profile app navigation/Reader/player/sheets/onboarding/RTL regressions passed** against the same export. No original Reader, app shell, scripture/layout/font/generated resource, state schema, dependency or app/release configuration changed in R102.
- **Web, Android and iOS production exports passed**, including native Hermes bytecode. Original font found exactly once in each asset set with the unchanged hash below. Web JavaScript changed by **+2,156 raw / +553 gzip bytes** versus R101, not an APK/AAB install-size or RAM measurement.

These checks establish the new browser layout and existing source/transport contracts, **not installed-device behaviour**. The reported old button truncation was not reproduced in 30 sampled R101 web labels; no physical device/emulator is available here. Native font scaling, text shaping, accessibility/keyboard/long-press and OEM navigation services still need device QA. The fix removes the crowded three-button arrangement and its shrink/line-cap constraints rather than claiming a measured native before/after result. No search implementation, deployment or store submission was added. QA captures are real running-app images, not generated artwork.

## Earlier Focus validation (R101, historical)

The following records describe the previous Focus delivery. Current R102 results are above; [R101 evidence is retained](indopak-focus-r101.json).

### Static, content and state checks

- **177/177 automated tests passed**; full TypeScript check had **zero diagnostics**. Existing tests retain content hashes/joins/rows, 6,236 canonical targets, all Juz entries, fold/selection/playback contracts and independent data storage.
- Nine Focus-specific tests cover **96 viewport fits**, unchanged paper ratio, maximum fit/corner clearance, every original word across all 548 pages, every ayah popup across all pages at five widths (including 166px fallback), invalid geometry, all 22 translated labels, route/shell/accessibility wiring and read-only restoration of old 2× bookmarks/reading-point state.
- Six retained viewport/render-isolation tests include 972 size/scroll combinations, original path immutability, centre/bounded resizing, pending reveal priority and current committed callbacks. Old zoom-scale fixtures still exercise geometry/legacy compatibility, not a visible zoom option.
- Original scripture/layout/font/generated data/notices/generator, dependencies and app/release configuration are unchanged in R101. The original **310,912-byte** font was found exactly once in each final web, Android and iOS asset set, SHA-256 `a6463e24e36651404e9eff52dae26e18e9ef0718eb620636a66a20026a75c563`.

### Real running production web app

No scripture/layout/audio responses, action callbacks or completion states are mocked. Browser profiles use isolated fixture preferences, not anyone's real user data. Insets are explicit browser layout fixtures, not OEM navigation-mode tests.

- **Full reader:** all **548 pages offline**, reduced motion, real touch-swiped traversal, original source row counts and actual SVG contour bounds; **zero failed bounds**, **278,467ms** for the exhaustive sweep. This includes intentional gestures/waits/assertions and is not a rendering-speed comparison or independent scholarly proofreading. Also: nine normal viewports, five inset fixtures, 12 directory-modal checks, 44 localized top layouts, bookmarks/directories, Persian page input, first/final limits and no 604-page map. All **29 contexts** had empty page/console/HTTP/failed-request arrays.
- **Motion:** actual intermediate frames passed next/previous/jump, Focus next/previous, scrolled landscape both ways, compact and Urdu/dark variants. The scripture remained stationary/undistorted, the crease stayed bounded/monotonic, the curved blank back/shadow appeared, and snapshots had no interactive targets. Unlock during a focused fold, resize, reduced-motion change and route exit/re-entry settled cleanly. Reduced-motion turns produced no outgoing layer.
- **Focus runner:** **nine viewport profiles**, **five system-inset fixtures**, **44 localized checks** and **24 error-free contexts**. The stage filled the safe area exactly, including desktop width with no old width cap, while whole paper/contours fit. Only Unlock remained at rest. Repeated toggles, focused rotation, connected/unchanged original path nodes, Enter/Space/Escape/focus return, swipe cancellation and icon drag, top-row popup/Unlock independent hit targets, route exit/re-entry and unchanged old Reader keys passed. A seeded old 2× record loaded without a write, rendered normally, survived Focus/Unlock unchanged and still allowed page swipes without losing its saved zoom/bookmarks/marker.
- **Ayah runner:** **44 localized popup checks / 23 error-free contexts**. Phone, Focus and landscape geometry passed; all three actions retained 44px targets. A normal tap did not save; the icon and real stationary touch saved the exact word. The final observed hold delay was **503.6ms**, with no write at 350ms. Short/moved/cancelled/multi-touch/resize cases did not replace the mark. Exact resume/reopen, separate page bookmarks, old Reader data, outside click, Escape, mode/scroll dismissal and icon-drag rejection passed.
- **Playback runner:** **21 actual media observations / three error-free contexts**. Playing 55:5 progressed from **0.079241s → 0.496655s** across Focus entry with unchanged URI/play-call count, naturally advanced to 55:6 while chrome stayed hidden, and restored normal controls on Unlock. Real near-end seeks, not fake completion events, bounded remaining checks: 2:4→2:5 followed page 2→3 in Focus after an active touch ended; manual browsing opted out; normal landscape revealed 18:110; an on-page action started real playback while staying in landscape Focus. Split 2:25/page 5, repeat/pause, screen-blur deferral, Urdu dark mode and actual sequential English translation passed. Explicit mark/bookmarks/old Reader keys remained separate. **Two intentional media-range cancellations** are recorded separately, not hidden or reported as unexpected failures.
- **Existing app regressions:** phone/tablet first/repeated/changed-ayah audio; saved translation/audio matching and independent English UI/Urdu restoration; 11-profile/five-tab navigation, live insets, original Reader/player, sheets, onboarding and Urdu RTL all passed against the same export.

QA screenshots are actual running-app captures, kept in temporary QA output, not generated artwork or new store screenshots.

### Production exports and limitations

**Web, Android and iOS production exports passed**, including Android/iOS Hermes bytecode. Native exports ran sequentially, one worker, disk-backed temporary paths and 320MB Node heaps in this 2GB sandbox; TypeScript ran separately. Web JavaScript changed by **+2,909 raw / +838 gzip bytes** versus R100 (not APK/AAB install size or RAM). No runtime dependency, source asset, native/release configuration, deployment or store submission was added.

These are **not installed APK/AAB/IPA or physical Android/iOS device tests**. No emulator/device is available here. OEM gesture/three-button/side-bar navigation, native screen-reader traversal/accessibility escape, native long-press and edge-back arbitration, keyboard and phone animation performance still require installed-device QA. Chromium fixtures and transport-contract test doubles are not substitutes for those checks.

## Reproduction

```sh
# Optional regeneration; normal Expo builds need neither Python nor a network.
pip install uharfbuzz==0.57.0 fonttools==4.68.0
python3 scripts/build_indopak_16.py --words /path/to/original/indopak-nastaleeq.json

npm run test:regressions
node node_modules/typescript/bin/tsc --noEmit

# Against a fresh, locally served production WEB export:
INDOPAK_URL=http://127.0.0.1:8109 INDOPAK_SWEEP=1 node tests/verify-indopak-web.cjs
INDOPAK_URL=http://127.0.0.1:8109 node tests/verify-indopak-navigation-web.cjs
INDOPAK_URL=http://127.0.0.1:8109 node tests/verify-indopak-focus-web.cjs
INDOPAK_URL=http://127.0.0.1:8109 node tests/verify-indopak-ayah-web.cjs
INDOPAK_URL=http://127.0.0.1:8109 node tests/verify-indopak-playback-web.cjs
```

Use the Node version required by this Expo project. Browser reports/screenshots default to temporary QA directories; `INDOPAK_ARTIFACTS_DIR`, `INDOPAK_NAV_ARTIFACTS_DIR`, `INDOPAK_FOCUS_ARTIFACTS_DIR`, `INDOPAK_AYAH_ARTIFACTS_DIR` and `INDOPAK_PLAYBACK_ARTIFACTS_DIR` override their respective output directories.
