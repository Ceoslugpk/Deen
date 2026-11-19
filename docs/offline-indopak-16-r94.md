# Separate offline 16-line Quran

## Entry point and scope

**Quran → Explore → 16-line Quran** opens a new, separate screen. It is not a Reader setting and does not re-enable the retired Mushaf (`MUSHAF_ENABLED` remains false). Existing Reader logic, translation and reciter choices, bookmarks, notes, audio behaviour, and existing stored user data remain unchanged.

The screen contains:

- the supplied **Taj Company IndoPak 16-line / 548-page** layout;
- matching, verbatim Nastaleeq word text from the owner's Islamic Data API;
- the supplied **AlQuran IndoPak by QuranWBW v2.100** font;
- a tappable **top page counter** with page entry (including Arabic/Persian digits), Surah and canonical verse-based Juz navigation;
- edition-specific page bookmarks, last-page/zoom restoration and one exact ayah/word-level continue-reading marker;
- lightweight paper-fold page swiping at 1×: **right → next page; left → previous page**, following Quran RTL page order in every interface language;
- 1× / 1.5× / 2× position-preserving zoom with scrolling and memoized fixed-word rendering; very short landscape panes use width-fit scrolling rather than shrinking the entire page to an unreadable thumbnail;
- per-verse hit targets and a larger Verse-list alternative, full-ayah highlighting and a small anchored three-icon popup for recitation, translation and saving the reading position;
- feature copy in English and all 21 other supported interface languages, with the existing copy service supplying shared labels. Uzbek and Kazakh remain Cyrillic; Malay and Indonesian have distinct copy;
- the bottom tab menu hidden **only while this screen is focused**, with its empty reserve reclaimed and existing audio controls positioned inside the safe area;
- a short Sources panel showing the edition and `QUL / Tarteel · QuranWBW`; full credits, original restrictions and permission notes remain unchanged in the resource notices;
- light/dark colours and existing brand assets, with proper magnifier-plus/minus zoom icons in the app’s existing vector style. No illustration assets, dependencies, release settings or orientation policy were introduced.

Reading the pages requires no scripture/layout API call. Audio and translations use the existing app's network/download availability; this feature does not bundle recitation recordings or new translations.

## Edition and content integrity

| Item | Verified result |
| --- | --- |
| Pages | 548 |
| Original layout rows | 8,742 |
| Ayah / Surah heading / basmalah rows | 8,598 / 114 / 30 |
| Word and marker records | 83,668 |
| Canonical verses / Surahs / Juz | 6,236 / 114 / 30 |
| Lazy page chunks | 18, at most 32 pages each |
| Unique shaped texts, including headings / original-font glyphs | 22,761 / 572 |
| Generated runtime JSON | 8,788,559 bytes |

The original SQLite and TTF remain byte-identical. Checksums, sources, original font notice, attribution and the permission record are in [`resources/quran/indopak-taj-16/NOTICE.md`](../resources/quran/indopak-taj-16/NOTICE.md). The generator fails closed on changed original layout, font, raw word text or pinned Surah metadata.

All word IDs join the source layout exactly once and in order, without omitted/unused IDs or mismatched Surah starts. Original strings—including diacritics, private-use symbols and embedded spaces—are copied verbatim. Page breaks, line ranges, line types and centering flags are copied directly. There is no tatweel insertion, letter normalization, arbitrary 16-row regrouping or substitution of the 604-page Madani map.

The source-defined shorter pages remain shorter:

| Pages | Source rows |
| --- | --- |
| 1, 2 | 7 each |
| 529, 530 | 15 each |
| 548 | 10 |

The layout database provides line boundaries/types, not a scanned page image or exact printed glyph coordinates. The renderer fits those original lines within its own scalable frame. Its borders and spacing are not claimed to be a pixel-identical facsimile of a printed book.

## Rendering and bundle implementation

`src/services/indopakMushaf.ts` owns the edition namespace, canonical verse lookup, source line placement and safe width/height fitting. `src/components/IndopakMushafReader.tsx` owns the new screen's reader/navigation UI and `IndopakPageCanvas.tsx` shares the unchanged-font rendering between the live page and its outgoing animation snapshot; `App.tsx` handles its entry point, route, existing-audio/Reader callbacks and focused-screen-only menu/player placement. Other screens keep their established layout.

An initial running-app check caught browser SVG text separating leading waqf marks from private-use ayah symbols. Native SVG text also has a different bidi/shaping implementation. Pages therefore draw the **original font's contours at precomputed HarfBuzz RTL positions**, with one composed SVG path per word. The original font file is neither changed nor subset, and remains bundled and hash-verified in both native export asset sets. R98 removes the former full-verse text/modal preview in favour of on-page highlighting and icons. This avoids relying on different platform SVG text engines for scripture placement. Original text remains available for canonical references and verse actions.

The generator uses `uharfbuzz==0.57.0` and `fonttools==4.68.0`. It emits UTF-8 JSON-string envelopes for large numeric tables; only a requested page chunk is expanded. A six-chunk cache and a 512-word-path cache bound derived data retained during long reading sessions. No SQLite package or new runtime dependency is needed. The original source database is retained for audit/regeneration, not queried by the app.

## State isolation and existing actions

- Edition ID: `indopak-taj-16`.
- Storage: `@deen/quran/indopak-taj-16/state/v1`.
- Persisted values: validated 1–548 page, 1/1.5/2 zoom, sorted unique valid saved pages and an optional `readingPoint: { page, verse, wordId }` (or `null`). Older v1 records without this field still load without rewriting or migrating their existing values.
- Merely opening/restoring this screen does not write defaults. Only explicit page/zoom/page-bookmark/reading-marker actions save.
- No shared Quran position, preference, note or bookmark migration, clearing or heuristic deletion is performed.
- Surah:Ayah keys remain canonical even when a verse spans printed pages. Juz entries use canonical verse boundaries, not another edition's page numbers.
- Playback calls the existing `playFromReader` flow with the selected canonical key. The explicit translation/actions button opens the existing Reader with `focusVerse`; normal existing Reader behaviour then applies.
- Directories use the established safe-content frame and `SystemModal`; the ayah popup is non-modal and anchored inside the safe page viewport. Compact widths keep 44px tool targets; landscape consolidates controls within this screen.

## Reader interaction refinement (R95)

`src/services/indopakInteraction.ts` reads only the navigation state's focused leaf. An inactive Quran tab, saved stack entry or route parameter cannot hide the menu elsewhere. The existing Reader's independent focus-mode flag is not changed. Leaving this screen, opening the full audio player or explicitly opening the existing Reader restores the normal menu and mini-player placement; returning removes only this screen's menu again. Android continues to use the shared system-safe boundary, and the lowered iOS mini-player also includes the current bottom safe inset.

The page viewport claims only deliberate horizontal, single-finger movement at 1×. A release advances at most one page, within 1–548, and saves through the existing edition-specific state flow. Vertical drags, short drags, cancellation and multi-touch—including adding a second finger after capture—do not turn pages. Captured gestures briefly suppress verse hit targets to prevent an accidental ayah popup; deliberate later taps still work. At 1.5×/2×, gestures remain available for panning rather than turning pages. Native recognizers may take over; a terminated gesture cannot turn a page. The controls use all 22 supported interface languages.

React Native web's disabled ScrollView applies `touch-action:none` to descendants as well. Its wrappers therefore stay enabled and scroll only if content actually overflows; the unzoomed viewport uses `pan-y` so vertical landscape scrolling coexists with JS horizontal page turns. Native wrappers remain zoom/overflow-aware. This distinction is covered by real touch-input checks, including a tall narrow viewport where only the horizontal axis overflows.

No original scripture, layout, font, generated data or licensing/permission file changed in this refinement. No runtime dependency or new persistent preference was added.

## Top controls and page motion (R96)

The bottom pager, its arrows and the bottom hint row are removed completely. The duplicate number inside the rendered page frame is also removed: **Page N / 548 is now at the top**, remains tappable for direct page selection, and exposes next/previous accessibility actions. Surah, Juz, page saving, Verse-list access, zoom and Sources remain available above the page. Compact widths use icon controls and move Verse access alongside the counter; wide, short landscape frames combine the two top groups into one row. All targets remain at least 44px. The reclaimed area belongs to the page, not an empty footer reserve; the existing audio-player reserve remains when needed.

R96 initially introduced a short horizontal slide. The lightweight fold described below replaces that effect; the top layout, turn locks, outgoing-snapshot isolation and reduced-motion/cancellation safeguards remain.

The zoom control now draws a real magnifier with **plus** at 1×/1.5× and **minus** at 2× (return to 1×). It keeps the same 1 → 1.5 → 2 → 1 cycle and saved zoom state. New icon names are implemented in `CustomIcon.tsx`; they no longer fall through to its generic symbol. Existing icon cases and all other screens are unchanged.

## Lightweight paper fold (R97)

Page changes now use a **320ms, native-driven lightweight paper fold**, not a horizontal slide or a heavy 3D mesh curl. A curved blank paper back, a narrow crease and a soft shadow travel across the page to reveal the next page underneath. Higher page numbers fold left → right; lower numbers reverse, independently of the interface language. Direct page/Surah/Juz jumps use the same direction rule.

`IndopakPageFold.tsx` clips one non-interactive outgoing canvas above the stationary incoming page. Moving the clip and counter-translating its contents by exactly the opposite amount keeps **every original-font scripture outline fixed and undistorted**. Only the blank decorative back/shadow scales or mirrors, never the Quran canvas. `indopakFold.ts` derives the visible paper edges, centred position, actual captured horizontal/vertical scroll offsets and bounded curved band geometry. The overlay uses its own LTR physical coordinate space even in an RTL interface. Light and dark paper/shadow colours follow the current page palette.

Only transforms and decorative opacity animate, using the existing React Native native driver and existing SVG support. There is no per-frame React state, path rebuilding, mesh renderer, additional graphics dependency or persistent animation setting. The old snapshot has no word hit targets, is hidden from accessibility and cannot intercept touches. Another turn or zoom is held during the brief fold; accidental verse taps remain suppressed. Same-page selections and restoration do not animate. Reduced motion skips the fold entirely; enabling it mid-turn, changing geometry/zoom or leaving the screen stops the animation and removes the old layer safely. Existing zoom panning, landscape scrolling, audio/safe-area clearance and focused-screen-only menu behaviour are unchanged. No scripture, font, page data, notices, application configuration or unrelated screen was changed.

## On-ayah actions and reading marker (R98)

Tapping an ayah no longer opens a large verse panel. The complete ayah is highlighted across its original line fragments, and `IndopakAyahPopover.tsx` shows **only three icons**: recitation, translation and save reading position. Each is a 44px labelled accessibility target; the popup contains no visible text or extra close button. It prefers the area above the whole visible ayah, falls below when the upper edge has no room, and stays within the page viewport at zoom/scroll offsets. Very long/clipped ayahs can anchor to the tapped fragment if neither outer edge fits. Its physical positioning is independent of the interface direction; the icons follow the interface's RTL/LTR order. Audio uses the unchanged canonical-ayah playback flow; translation explicitly opens the existing Reader focused on that same ayah.

The bookmark icon and a **500ms stationary single-finger hold** both set the **same one continue-reading point**, as confirmed by the user. This is not a whole-Surah bookmark or another shared Reader preference. The saved point contains the original printed page, canonical verse key and original global word ID, validated against the bundled page. Thus a later line or later page of a long ayah is resumable, rather than incorrectly opening its first page. The marked ayah keeps a restrained gold-edged highlight after its popup is dismissed; the currently selected ayah uses the existing selection colour. Headings/basmalah rows are never accidentally marked as ayahs.

**Page → Bookmarks → Continue reading** returns to that exact word/line at the reader's current saved zoom. Reopening that same marked page also reveals its saved position automatically. Merely browsing another page does not move the explicit marker; last-visited-page restoration and all existing page bookmarks remain independent and unchanged. The one optional field stays inside the existing edition-specific v1 state key. Loading old state performs no write; no existing user-data key is changed or removed.

Native SVG uses its supported `onLongPress` with a 500ms delay. The web SVG click adapter does not register that native responder mixin, so web uses one cancellable 500ms timer with the same guards. Movement over 8px, scrolling/panning, multi-touch (including an added finger), cancellation, geometry/page/zoom changes and unmounting prevent an unfinished hold from saving. A completed hold does not trigger audio or translation on release. Dragging a popup icon cannot turn a page. Tapping elsewhere, panning, changing zoom/geometry, Escape, accessibility escape or native Back dismisses the popup without deleting the saved marker. The success announcement is issued only after a successful save; the existing retry/error UI handles storage failures. The 22-language screen hint explains the half-second gesture, while existing translated labels name the icons and continue-reading entry.

No font, scripture, generated layout, existing Reader, global app UI, native/release setting, runtime dependency or permission notice changed. The lightweight fold, zoom/panning, audio clearance, focused-screen-only menu rule and top-only controls remain.

## Recitation-follow highlighting (R99)

The live page now highlights **the current canonical ayah from the audio queue**, separately from the manually selected popup ayah and the explicitly saved reading marker. The audio service previously updated its queue index without updating the published track unless the queue itself changed. The state emitter now derives the current track from both queue and index, so natural advancement, next/previous, repeats, translation tracks and the mini-player metadata remain consistent.

`useIndopakRecitation.ts` observes a read-only audio snapshot through a primitive-key external-store subscription: ordinary progress/buffering ticks do not themselves change the reader's subscription value. No timers, guessed durations, new timing maps, runtime dependencies or scripture/font changes are involved. A paused ayah stays highlighted; closing the queue removes only the recitation highlight. A sequential spoken translation keeps the same ayah highlighted before the next Arabic track advances it. Untimed whole-Surah/downloaded files (`globalNumber: 0`) are deliberately not assigned a fabricated current ayah.

Playing from this reader also enables page/line following. Targets use the authentic 548-page edition, retain an already-visible later-page fragment of a split ayah, and reveal an offscreen anchor at the actual zoom/scroll offsets without moving an already-readable anchor. Short landscape panes reduce unnecessary headroom. Following waits for the requested audio key rather than an older track that is still loading, runs only while this screen is focused, and defers during active page touches, popup selection, navigation pickers and page turns. Manually turning/jumping pages or choosing Continue reading opts out of automatic page following until another on-page Play action; playback highlighting still reflects any current ayah on the page being browsed. Following updates only the last visited edition page, never the explicit reading point or page bookmarks.

## Zoom and screen responsiveness (R100)

Zoom previously recreated every word's React elements and touch callbacks, even though the page's original-font outlines, placement and word IDs were unchanged. `IndopakPageCanvas.tsx` now separates **memoized line ink/hit targets, headings, paper and live highlights**. Resizing the SVG viewport or changing a selected/reciting/marked ayah does not rerun the fixed-word component. Stable event dispatchers read the latest committed callbacks through a layout-effect-updated ref, so memoization does not retain stale page, zoom, hold or action state. Line-fragment grouping is derived once per placed page. Native SVG still redraws the vector surface as required; this is not a claim that drawing becomes free.

The existing magnifier and **1 → 1.5 → 2 → 1** presets remain; no toolbar redesign, continuous pinch mode or new gesture dependency was added. Zoom and same-page viewport changes now keep the **same physical page point at the viewport centre**, clamping only where the paper edge makes that impossible. `indopakZoomOffset` includes the true centred paper origin on both axes, independent of the UI language. A different page still starts at the top/right. The old unconditional horizontal content-size → `scrollToEnd` callback is removed: explicit scroll corrections are reapplied for asynchronous native content layout, then relinquished to touch/drag/wheel panning. Exact Continue reading/Verse-list reveals and authoritative recitation following use the same correction path rather than being overwritten by a delayed right-edge snap. Rapid zoom presses read the latest requested state, not a stale render's preset. Geometry changes still cancel holds and dismiss the popup without changing the saved marker.

### Controlled before/after web measurement

`tests/profile-indopak-zoom-web.cjs` compares the real R99 production export (`40f7d49`) with the R100 final export on the same sandbox. Each fresh context opens actual page **274**, then makes **12 real zoom-button clicks**, covering four complete preset cycles, with **6× Chromium CPU throttling**. The metric is click capture → the next animation frame observing changed SVG width; it is **not screen-presentation latency, a native frame-rate test or a physical-device speed guarantee**. Each version renders the same 160 paths. Timings vary with host load; long tasks remain at this artificial throttle.

| Browser viewport | Before median | After median | Median delay reduction |
| --- | ---: | ---: | ---: |
| Phone, 390×844 | 188.8ms | 86.9ms | 54.0% |
| Landscape, 844×390 | 123.4ms | 74.9ms | 39.3% |
| Narrow cover, 280×720 | 175.5ms | 74.6ms | 57.5% |

Medians use the mean of the two middle sorted samples. [Recorded samples, exact bundle identities, validation summary and limitations](indopak-zoom-r100.json) are checked in. The production web bundle grows by only **2,335 raw bytes / 584 gzip bytes** versus R99; there are no new assets or dependencies. Original scripture/layout/font/notices, app/release configuration, state schema and existing Reader data are unchanged. These figures are web JavaScript sizes, not APK/AAB install-size or RAM measurements.

`tests/verify-indopak-zoom-web.cjs` separately checks **six real running-app contexts**: phone, 280px cover, landscape, tall cover with no vertical overflow, tablet and Urdu dark mode. It records 30 preset-anchor checks and 12 resize-anchor checks; exercises actual touch panning, Enter/Space activation and 42 rapid preset presses; retains the same connected original-font path nodes/attributes; marks an exact word at 2× without a scroll jump; and verifies that zoom never changes the explicit marker, saved-page list or original Reader keys. Different-page reset and exact-word resume take precedence over the generic zoom anchor. All six contexts have empty page/console/HTTP/failed-request arrays. This is browser evidence; native touch arbitration and phone performance still require installed-device QA.

## Validation completed

### Static and source regression checks

- **168 automated tests passed**: all 98 pre-existing regressions, 14 edition-specific tests, 19 focused-route/swipe/motion/zoom interaction tests, 7 fold geometry/rendering tests, 12 ayah-selection/marker tests, 12 playback-follow tests and 6 new zoom/render-isolation tests. The latter include 972 preset/viewport/scroll-position geometry combinations, centred and panned anchors, edge clamping, invalid inputs, source immutability and fresh-callback/memoization wiring.
- Full TypeScript check: **zero diagnostics**.
- New tests cover resource hashes/notice retention, all 548 source pages, all 83,668 records, headings/centering/short pages, line geometry, original-font glyph/shape availability, every canonical verse lookup, all 30 Juz mappings, invalid/Arabic/Persian page entry, fitting/zoom, supported-language copy and independent read-only-on-load state. Interaction tests add focused/inactive navigation, malformed/cyclic states, RTL swipe directions, thresholds, page limits, zoom/multi-touch rejection and retained credits/native cancellation hooks, page-motion direction/reduced-motion planning, top-only page controls and semantic zoom icons. Fold tests cover centred/zoomed/landscape paper, both scroll offsets, 101 progress points in both directions, anchored ink, bounded band sizes, invalid/unmeasured/offscreen inputs, physical RTL-independent coordinates and the separation of decorative transforms from scripture. Selection tests cover every ayah fragment on all 548 pages, full-line selection bounds, popup safe-edge/zoom/scroll/multi-line geometry, exact word anchors and clamped resume offsets, the 500ms/movement guard, canonical reading-point validation (including page-spanning verses), legacy-state preservation, icon-only actions and cancellation/accessibility wiring.
- Playback-follow tests cover all 6,236 verse-to-word/page targets, split-verse retention, malformed/untimed tracks, readable/offscreen/short-pane geometry, primitive subscription snapshots and actual service/engine code with explicit Android/iOS transport test doubles. Natural completion, native playlist track-change events, pause/resume, seek, next/previous, sequential translation, repeat-one and clear are checked; these contract tests are not installed-device playback tests.
- Original font bytes were found unchanged in both successful native export asset sets.
- Generated assets rebuilt reproducibly from the approved local inputs. Runtime builds use the checked-in data.

### Running production web app, real content

`tests/verify-indopak-web.cjs` runs against the actual fresh Expo web export, with no mocked scripture, layout or audio responses.

Passing checks:

- **All 548 pages rendered while the browser was offline**, after local app/font assets loaded, with reduced motion enabled. The sweep advanced through all pages using real Chromium touch swipes, not direct state setters. Every page retained its source row count; actual SVG outline bounds remained within the printed body. This is a geometric/rendering check, not a claim of independent scholarly proofreading.
- Representative opening, middle, Surah-start and shorter/final pages: 1, 2, 3, 76, 77, 100, 200, 274, 400, 500, 529, 530 and 548.
- Nine viewports: 240×640, 280×720, 320×568, 390×844, 844×390, 800×1280, 1280×800, 884×1104 and 1440×900.
- Five live simulated system-navigation fixtures: gesture, three-button, larger button bar, right-side keys and left-side keys. Top controls and the page viewport stayed within the app's safe box, with no bottom pager or empty tab-bar reserve.
- Real Chromium touch input, not direct page setters: right/left swipes, first/final bounds, gesture-saved page restoration, a swipe beginning on a verse without opening its panel, later verse taps, vertical/short/cancelled drags, two-finger starts and an added finger after capture. Zoomed horizontal/vertical panning and overflowing unzoomed landscape scrolling remain functional.
- The menu returns on exit, all five tabs, the full audio player and explicit existing Reader handoff. Returning hides it again. Five active-audio viewport/inset fixtures keep the page viewport clear of the lowered mini-player; closing audio reclaims that space. System dark/light changes remount navigation while preserving the page and focused-screen-only menu rule.
- **44 localized top-layout checks**: all 22 interface languages at 280px and 390px widths, using a three-digit page counter. All page/Verse/Sources/Surah/Juz/save/zoom targets remain in the top area without overlap.
- Actual intermediate fold frames were observed in **12 normal-motion scenarios** (17–21 frames each in the R98 Chromium run, with all scenarios rerun successfully after R99 and R100): next, previous, direct jump, zoomed jumps in both directions, vertically scrolled landscape in both directions, a compact cover screen, and next/previous folds in Urdu RTL and dark mode. The crease moved monotonically, the mask and face translations cancelled exactly, and the outgoing and incoming scripture stayed stationary without scaling, reflection or skew. Real curved-back and separate shadow gradients were present; the old layer was removed at rest. The snapshot retained its exact zoom and horizontal/vertical scroll offsets while the revealed page independently reset its scroll. In-flight rotation, enabling reduced motion, and leaving/re-entering the screen all settled correctly. Reduced-motion swipes created no outgoing animation layer. Mid-fold QA images are actual running-app captures, not generated or staged mockups. This is browser interaction evidence, not a native frame-rate benchmark.
- The magnifier lens/handle and plus/minus SVG strokes were checked across the zoom cycle, not merely the icon name or button label.
- Twelve modal geometry checks: page, Surah, Juz, saved pages, sources and verse list, each at small-phone and landscape sizes with explicit local modal inset fixtures. Web modals are portals without the Android-only provider; the fixtures are correctly applied to their local roots, not the unrelated app boundary behind them.
- Page limits, rejected 604-page input, Persian-digit page entry, Surah/Juz jumps, page saving, 2× zoom, exit/re-entry restoration and independently preserved existing preferences/position/bookmarks/notes.
- Cold-player first tap on **55:5** requested the actual `ar.alafasy/4906.mp3` and advanced real media playback; the explicit Reader action focused **55:5**.
- Urdu RTL and dark-theme page/anchored-popup rendering, including the supplied private-use glyphs. QA images are real running-app captures and remain temporary, not new store/gallery assets.
- Empty runtime, console, HTTP-error and failed-request arrays in final runs.

`tests/verify-indopak-ayah-web.cjs` adds actual running-app selection/marking checks against the same final export:

- Three icon-only actions, canonical accessible labels, non-overlapping 44px targets, on-page highlighting and safe popup geometry on phone, zoomed/scrolled pages and landscape Verse-list selection.
- A normal tap does not save a reading point. The bookmark icon does, shows its selected state and leaves the marker visible after dismissal.
- A real held touch does not overwrite the marker at 350ms, then saves before release after the half-second threshold (519ms observed in the final R100 browser run). Short released presses, two-finger starts, an added finger, cancelled/moved touches and an in-flight resize leave the existing marker unchanged.
- Exact word/line resume after browsing another page, plus exit/re-entry restoration at 1.5×. Page bookmarks remain separate; the existing Reader's preferences, position, bookmarks and notes remain byte-for-byte unchanged.
- Verse-list selection reveals an offscreen ayah; real panning and zoom dismiss the popup. Outside mouse clicks dismiss it, Escape works, and dragging a popup icon neither turns a page nor saves a marker.
- **44 localized popup checks**, all 22 interface languages at 280px and 390px, including RTL and dark-mode captures. The focused runner's 23 contexts and the full reader runner's 29 contexts all had empty page/console/HTTP/failed-request arrays.

`tests/verify-indopak-playback-web.cjs` adds actual streamed-audio advancement checks, rerun against the final R100 production export:

- Natural **55:5 → 55:6** playback moves every printed fragment of the recitation highlight; the separate saved **55:5** marker remains unchanged. The popup closes without losing the playing highlight, pause/resume keeps the current ayah, and a different manually selected popup does not replace the audio key.
- Repeat-one retains the ayah until the real queue advances. Real near-end media seeks (not fabricated ended events) keep the remaining checks bounded: **2:4 → 2:5** follows page **2 → 3**, waits for an active touch to end, and updates mini-player metadata. Manual browsing does not snap back.
- Zoomed landscape **18:109 → 18:110** reveals the actual current line. Playing split **2:25** on page **5** does not jump back to its first page. A hidden reader does not turn/persist pages behind the audio screen; returning follows the actual current ayah.
- Real English spoken translation **1:1 → translation 1:1 → Arabic 1:2** retains then advances the correct key. Urdu dark-mode playback also follows. Closing audio removes its highlight without altering existing Reader data, the exact saved mark or page bookmarks.
- The three isolated browser contexts recorded 19 real media observations, with no page/console/HTTP/unexpected request failures. Intentional cancelled media-range requests during source changes/queue clearing are retained separately in `expectedMediaCancellations`, not counted as playback or network failures. No audio/content responses, completion callbacks or audio state are mocked.
- The separate full reader sweep was repeated after R100: all **548 pages offline**, **zero failed outline bounds**, **303,890ms** for the exhaustive page sweep; the reader and popup runners again passed all 29 and 23 contexts respectively. This full-sweep duration includes deliberate touch/wait/geometry checks and is not a rendering-performance comparison.

The existing running-web regressions also passed against this same export:

- first-tap / repeated-tap / changed-ayah real audio playback on phone and tablet;
- translation/audio matching, persistent checked selection and existing Urdu preference restoration;
- the 11-profile / five-tab responsive navigation, live inset transitions, reader/player, sheets, onboarding and Urdu RTL checks from R93.

### Production exports and limitations

Separate **web, Android and iOS production exports passed**, including native Hermes bytecode, after R100. In this 2 GB sandbox, final native exports ran sequentially with one Metro worker, disk-backed temporary/export paths and 320 MB Node heaps for both Android and iOS. TypeScript ran separately with a larger heap. The original supplied font was hash-verified in both new native asset sets. No app or native release configuration was changed. The pre-existing Apple team configuration warning remains unchanged.

These are **not APK/AAB installation or physical Android/iOS device tests**. No emulator/device or store release was used. Chromium inset fixtures do not exercise an OEM system navigation service, native long-press arbitration, native screen-reader traversal, native edge-back/swipe arbitration or native keyboard. Physical-device visual/interaction and animation review remains part of release QA. There is no Vercel deployment or store submission in this change.

## Reproduction

```sh
# Optional asset regeneration; normal Expo builds need neither Python nor a network.
pip install uharfbuzz==0.57.0 fonttools==4.68.0
python3 scripts/build_indopak_16.py --words /path/to/original/indopak-nastaleeq.json

npm run test:regressions
node node_modules/typescript/bin/tsc --noEmit

# Against a freshly exported, locally served production WEB app:
INDOPAK_URL=http://127.0.0.1:8107 INDOPAK_SWEEP=1 \
  node tests/verify-indopak-web.cjs
INDOPAK_URL=http://127.0.0.1:8107 node tests/verify-indopak-ayah-web.cjs
INDOPAK_URL=http://127.0.0.1:8107 node tests/verify-indopak-playback-web.cjs
INDOPAK_URL=http://127.0.0.1:8107 node tests/verify-indopak-zoom-web.cjs

# Compare independently served baseline and optimized exports on the same machine:
INDOPAK_URL=http://127.0.0.1:8106 INDOPAK_ZOOM_PROFILE=/tmp/zoom-before.json \
  node tests/profile-indopak-zoom-web.cjs
INDOPAK_URL=http://127.0.0.1:8107 INDOPAK_ZOOM_PROFILE=/tmp/zoom-after.json \
  node tests/profile-indopak-zoom-web.cjs
```

Use the Node version required by this Expo project. Browser reports/screenshots go to a temporary QA directory by default; `INDOPAK_ARTIFACTS_DIR`, `INDOPAK_AYAH_ARTIFACTS_DIR`, `INDOPAK_PLAYBACK_ARTIFACTS_DIR` and `INDOPAK_ZOOM_ARTIFACTS_DIR` can override each runner’s output directory. The profiler writes to `INDOPAK_ZOOM_PROFILE`.
