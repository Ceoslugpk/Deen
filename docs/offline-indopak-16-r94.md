# Separate offline 16-line Quran

## Entry point and scope

**Quran → Explore → 16-line Quran** opens a new, separate screen. It is not a Reader setting and does not re-enable the retired Mushaf (`MUSHAF_ENABLED` remains false). Existing Reader logic, translation and reciter choices, bookmarks, notes, audio behaviour, and existing stored user data remain unchanged.

The screen contains:

- the supplied **Taj Company IndoPak 16-line / 548-page** layout;
- matching, verbatim Nastaleeq word text from the owner's Islamic Data API;
- the supplied **AlQuran IndoPak by QuranWBW v2.100** font;
- page entry (including Arabic/Persian digits), Surah and canonical verse-based Juz navigation;
- edition-specific page bookmarks and last-page/zoom restoration;
- single-finger page swiping at 1×: **right → next page; left → previous page**, following Quran RTL page order in every interface language;
- 1× / 1.5× / 2× zoom with scrolling; very short landscape panes use width-fit scrolling rather than shrinking the entire page to an unreadable thumbnail;
- per-verse hit targets and a larger Verse-list alternative, existing audio playback, and an explicit handoff to the existing Reader for translation and other verse actions;
- feature copy in English and all 21 other supported interface languages, with the existing copy service supplying shared labels. Uzbek and Kazakh remain Cyrillic; Malay and Indonesian have distinct copy;
- the bottom tab menu hidden **only while this screen is focused**, with its empty reserve reclaimed and existing audio controls positioned inside the safe area;
- a short Sources panel showing the edition and `QUL / Tarteel · QuranWBW`; full credits, original restrictions and permission notes remain unchanged in the resource notices;
- light/dark colours and existing app icon assets. No new artwork, dependencies, release settings or orientation policy were introduced.

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

`src/services/indopakMushaf.ts` owns the edition namespace, canonical verse lookup, source line placement and safe width/height fitting. `src/components/IndopakMushafReader.tsx` owns the new screen's reader/navigation UI; `App.tsx` handles its entry point, route, existing-audio/Reader callbacks and focused-screen-only menu/player placement. Other screens keep their established layout.

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

The page viewport claims only deliberate horizontal, single-finger movement at 1×. A release advances at most one page, within 1–548, and saves through the existing edition-specific state flow. Vertical drags, short drags, cancellation and multi-touch—including adding a second finger after capture—do not turn pages. Captured gestures briefly suppress verse hit targets to prevent an accidental verse panel; deliberate later taps still work. At 1.5×/2×, gestures remain available for panning rather than turning pages. Native recognizers may take over; a terminated gesture cannot turn a page. Swipe guidance is included in all 22 supported interface languages.

React Native web's disabled ScrollView applies `touch-action:none` to descendants as well. Its wrappers therefore stay enabled and scroll only if content actually overflows; the unzoomed viewport uses `pan-y` so vertical landscape scrolling coexists with JS horizontal page turns. Native wrappers remain zoom/overflow-aware. This distinction is covered by real touch-input checks, including a tall narrow viewport where only the horizontal axis overflows.

No original scripture, layout, font, generated data or licensing/permission file changed in this refinement. No runtime dependency or new persistent preference was added.

## Validation completed

### Static and source regression checks

- **126 automated tests passed**: all 98 pre-existing regressions, 14 edition-specific tests and 14 focused-route/swipe interaction tests.
- Full TypeScript check: **zero diagnostics**.
- New tests cover resource hashes/notice retention, all 548 source pages, all 83,668 records, headings/centering/short pages, line geometry, original-font glyph/shape availability, every canonical verse lookup, all 30 Juz mappings, invalid/Arabic/Persian page entry, fitting/zoom, supported-language copy and independent read-only-on-load state. Interaction tests add focused/inactive navigation, malformed/cyclic states, RTL swipe directions, thresholds, page limits, zoom/multi-touch rejection and retained credits/native cancellation hooks.
- Original font bytes were found unchanged in both successful native export asset sets.
- Generated assets rebuilt reproducibly from the approved local inputs. Runtime builds use the checked-in data.

### Running production web app, real content

`tests/verify-indopak-web.cjs` runs against the actual fresh Expo web export, with no mocked scripture, layout or audio responses.

Passing checks:

- **All 548 pages rendered while the browser was offline**, after local app/font assets loaded. Every page retained its source row count; actual SVG outline bounds remained within the printed body. This is a geometric/rendering check, not a claim of independent scholarly proofreading.
- Representative opening, middle, Surah-start and shorter/final pages: 1, 2, 3, 76, 77, 100, 200, 274, 400, 500, 529, 530 and 548.
- Nine viewports: 240×640, 280×720, 320×568, 390×844, 844×390, 800×1280, 1280×800, 884×1104 and 1440×900.
- Five live simulated system-navigation fixtures: gesture, three-button, larger button bar, right-side keys and left-side keys. Page tools/navigation stayed within the app's safe box, with the footer absent only here and no empty tab-bar reserve.
- Real Chromium touch input, not direct page setters: right/left swipes, first/final bounds, gesture-saved page restoration, a swipe beginning on a verse without opening its panel, later verse taps, vertical/short/cancelled drags, two-finger starts and an added finger after capture. Zoomed horizontal/vertical panning and overflowing unzoomed landscape scrolling remain functional.
- The menu returns on exit, all five tabs, the full audio player and explicit existing Reader handoff. Returning hides it again. Five active-audio viewport/inset fixtures keep page controls clear of the lowered mini-player; closing audio reclaims that space. System dark/light changes remount navigation while preserving the page and focused-screen-only menu rule.
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

Separate **web, Android and iOS production exports passed**, including native Hermes bytecode, after this refinement. The 2 GB sandbox required sequential checks: final native exports used one Metro worker, a disk-backed `TMPDIR`, large web/research artifacts moved off RAM-backed `/tmp` without deleting them, and 320 MB Node heaps for both Android and iOS. Earlier constrained attempts hit a Node heap limit or a compiler memory kill; the final exports completed successfully. TypeScript ran separately with a larger heap. No app or native release configuration was changed. The pre-existing Apple team configuration warning remains unchanged.

These are **not APK/AAB installation or physical Android/iOS device tests**. No emulator/device or store release was used. Chromium inset fixtures do not exercise an OEM system navigation service, native font preview, native screen-reader traversal, native edge-back/swipe arbitration or native keyboard. Physical-device visual/interaction review remains part of release QA. There is no Vercel deployment or store submission in this change.

## Reproduction

```sh
# Optional asset regeneration; normal Expo builds need neither Python nor a network.
pip install uharfbuzz==0.57.0 fonttools==4.68.0
python3 scripts/build_indopak_16.py --words /path/to/original/indopak-nastaleeq.json

npm run test:regressions
node node_modules/typescript/bin/tsc --noEmit

# Against a freshly exported, locally served production WEB app:
INDOPAK_URL=http://127.0.0.1:8105 INDOPAK_SWEEP=1 \
  node tests/verify-indopak-web.cjs
```

Use the Node version required by this Expo project. Browser reports/screenshots go to a temporary QA directory by default; `INDOPAK_ARTIFACTS_DIR` can override it.
