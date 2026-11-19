# Separate offline 16-line Quran

## Entry point and scope

**Quran → Explore → 16-line Quran** opens a new, separate screen. It is not a Reader setting and does not re-enable the retired Mushaf (`MUSHAF_ENABLED` remains false). Existing Reader logic, translation and reciter choices, bookmarks, notes, audio behaviour, and existing stored user data remain unchanged.

The screen contains:

- the supplied **Taj Company IndoPak 16-line / 548-page** layout;
- matching, verbatim Nastaleeq word text from the owner's Islamic Data API;
- the supplied **AlQuran IndoPak by QuranWBW v2.100** font;
- a tappable **top page counter** with page entry (including Arabic/Persian digits), Surah and canonical verse-based Juz navigation;
- edition-specific page bookmarks and last-page/zoom restoration;
- lightweight paper-fold page swiping at 1×: **right → next page; left → previous page**, following Quran RTL page order in every interface language;
- 1× / 1.5× / 2× zoom with scrolling; very short landscape panes use width-fit scrolling rather than shrinking the entire page to an unreadable thumbnail;
- per-verse hit targets and a larger Verse-list alternative, existing audio playback, and an explicit handoff to the existing Reader for translation and other verse actions;
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

An initial running-app check caught browser SVG text separating leading waqf marks from private-use ayah symbols. Native SVG text also has a different bidi/shaping implementation. Pages therefore draw the **original font's contours at precomputed HarfBuzz RTL positions**, with one composed SVG path per word. The original font file is neither changed nor subset, and is also retained in both native export asset sets for the full-verse font preview. This avoids relying on different platform SVG text engines for scripture placement. Original text remains available for canonical references and verse actions.

The generator uses `uharfbuzz==0.57.0` and `fonttools==4.68.0`. It emits UTF-8 JSON-string envelopes for large numeric tables; only a requested page chunk is expanded. A six-chunk cache and a 512-word-path cache bound derived data retained during long reading sessions. No SQLite package or new runtime dependency is needed. The original source database is retained for audit/regeneration, not queried by the app.

## State isolation and existing actions

- Edition ID: `indopak-taj-16`.
- Storage: `@deen/quran/indopak-taj-16/state/v1`.
- Persisted values: validated 1–548 page, 1/1.5/2 zoom, sorted unique valid saved pages.
- Merely opening/restoring this screen does not write defaults. Only explicit page/zoom/bookmark actions save.
- No shared Quran position, preference, note or bookmark migration, clearing or heuristic deletion is performed.
- Surah:Ayah keys remain canonical even when a verse spans printed pages. Juz entries use canonical verse boundaries, not another edition's page numbers.
- Playback calls the existing `playFromReader` flow with the selected canonical key. The explicit translation/actions button opens the existing Reader with `focusVerse`; normal existing Reader behaviour then applies.
- Navigation and modals use the established safe-content frame and `SystemModal`. Compact widths keep 44px tool targets; landscape consolidates controls within this screen.

## Reader interaction refinement (R95)

`src/services/indopakInteraction.ts` reads only the navigation state's focused leaf. An inactive Quran tab, saved stack entry or route parameter cannot hide the menu elsewhere. The existing Reader's independent focus-mode flag is not changed. Leaving this screen, opening the full audio player or explicitly opening the existing Reader restores the normal menu and mini-player placement; returning removes only this screen's menu again. Android continues to use the shared system-safe boundary, and the lowered iOS mini-player also includes the current bottom safe inset.

The page viewport claims only deliberate horizontal, single-finger movement at 1×. A release advances at most one page, within 1–548, and saves through the existing edition-specific state flow. Vertical drags, short drags, cancellation and multi-touch—including adding a second finger after capture—do not turn pages. Captured gestures briefly suppress verse hit targets to prevent an accidental verse panel; deliberate later taps still work. At 1.5×/2×, gestures remain available for panning rather than turning pages. Native recognizers may take over; a terminated gesture cannot turn a page. The controls use all 22 supported interface languages.

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

## Validation completed

### Static and source regression checks

- **138 automated tests passed**: all 98 pre-existing regressions, 14 edition-specific tests, 19 focused-route/swipe/motion/zoom interaction tests and 7 fold geometry/rendering tests.
- Full TypeScript check: **zero diagnostics**.
- New tests cover resource hashes/notice retention, all 548 source pages, all 83,668 records, headings/centering/short pages, line geometry, original-font glyph/shape availability, every canonical verse lookup, all 30 Juz mappings, invalid/Arabic/Persian page entry, fitting/zoom, supported-language copy and independent read-only-on-load state. Interaction tests add focused/inactive navigation, malformed/cyclic states, RTL swipe directions, thresholds, page limits, zoom/multi-touch rejection and retained credits/native cancellation hooks, page-motion direction/reduced-motion planning, top-only page controls and semantic zoom icons. Fold tests cover centred/zoomed/landscape paper, both scroll offsets, 101 progress points in both directions, anchored ink, bounded band sizes, invalid/unmeasured/offscreen inputs, physical RTL-independent coordinates and the separation of decorative transforms from scripture.
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
- Actual intermediate fold frames were observed in **12 normal-motion scenarios** (18–21 frames each in the final Chromium run): next, previous, direct jump, zoomed jumps in both directions, vertically scrolled landscape in both directions, a compact cover screen, and next/previous folds in Urdu RTL and dark mode. The crease moved monotonically, the mask and face translations cancelled exactly, and the outgoing and incoming scripture stayed stationary without scaling, reflection or skew. Real curved-back and separate shadow gradients were present; the old layer was removed at rest. The snapshot retained its exact zoom and horizontal/vertical scroll offsets while the revealed page independently reset its scroll. In-flight rotation, enabling reduced motion, and leaving/re-entering the screen all settled correctly. Reduced-motion swipes created no outgoing animation layer. Mid-fold QA images are actual running-app captures, not generated or staged mockups. This is browser interaction evidence, not a native frame-rate benchmark.
- The magnifier lens/handle and plus/minus SVG strokes were checked across the zoom cycle, not merely the icon name or button label.
- Fourteen modal geometry checks: page, Surah, Juz, saved pages, sources, verse list and verse panel, each at small-phone and landscape sizes with explicit local modal inset fixtures. Web modals are portals without the Android-only provider; the fixtures are correctly applied to their local roots, not the unrelated app boundary behind them.
- Page limits, rejected 604-page input, Persian-digit page entry, Surah/Juz jumps, page saving, 2× zoom, exit/re-entry restoration and independently preserved existing preferences/position/bookmarks/notes.
- Cold-player first tap on **55:5** requested the actual `ar.alafasy/4906.mp3` and advanced real media playback; the explicit Reader action focused **55:5**.
- Urdu RTL and dark-theme page/verse-panel rendering, including the supplied private-use glyphs. QA images are real running-app captures and remain temporary, not new store/gallery assets.
- Empty runtime, console, HTTP-error and failed-request arrays in final runs.

The existing running-web regressions also passed against this same export:

- first-tap / repeated-tap / changed-ayah real audio playback on phone and tablet;
- translation/audio matching, persistent checked selection and existing Urdu preference restoration;
- the 11-profile / five-tab responsive navigation, live inset transitions, reader/player, sheets, onboarding and Urdu RTL checks from R93.

### Production exports and limitations

Separate **web, Android and iOS production exports passed**, including native Hermes bytecode, after R97. In this 2 GB sandbox, final native exports ran sequentially with one Metro worker, disk-backed temporary/export paths and 320 MB Node heaps for both Android and iOS. TypeScript ran separately with a larger heap. The original supplied font was hash-verified in both new native asset sets. No app or native release configuration was changed. The pre-existing Apple team configuration warning remains unchanged.

These are **not APK/AAB installation or physical Android/iOS device tests**. No emulator/device or store release was used. Chromium inset fixtures do not exercise an OEM system navigation service, native font preview, native screen-reader traversal, native edge-back/swipe arbitration or native keyboard. Physical-device visual/interaction and animation review remains part of release QA. There is no Vercel deployment or store submission in this change.

## Reproduction

```sh
# Optional asset regeneration; normal Expo builds need neither Python nor a network.
pip install uharfbuzz==0.57.0 fonttools==4.68.0
python3 scripts/build_indopak_16.py --words /path/to/original/indopak-nastaleeq.json

npm run test:regressions
node node_modules/typescript/bin/tsc --noEmit

# Against a freshly exported, locally served production WEB app:
INDOPAK_URL=http://127.0.0.1:8106 INDOPAK_SWEEP=1 \
  node tests/verify-indopak-web.cjs
```

Use the Node version required by this Expo project. Browser reports/screenshots go to a temporary QA directory by default; `INDOPAK_ARTIFACTS_DIR` can override it.
