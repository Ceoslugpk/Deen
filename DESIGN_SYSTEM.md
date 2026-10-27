# Design system — premium feel and spacing

This is the working reference for how the app looks and how it is spaced. New screens
should follow it rather than invent their own numbers; the values below are the ones
actually in `App.tsx` and `src/design/tokens.ts` today.

---

## 1. What makes it feel premium

Premium is not decoration. It is **restraint plus consistency**: fewer decisions,
repeated exactly, with one or two places where richness is allowed to show.

### Type carries the personality
| Role | Face | Sizes |
|---|---|---|
| Headings, big numbers | Newsreader (serif) | 32 (h1), 22 (section h2), 24 (counters) |
| Interface | DM Sans 400 / 600 / 700 | 9–11 overline & meta, 13–15 names & body, 14 intro |
| Quran and Arabic display | KFGQPC Uthmanic Script Hafs | 18–30, line-height 1.6–1.9 |
| Interface Arabic | IBM Plex Sans Arabic | matches Latin sizes |

Three families, three weights, one serif accent. Line heights run 1.35–1.6 for text
and 1.6+ for Arabic script. Nothing is set below 9px.

### Colour is mostly neutral
```
bg    #F7F5F2  card  #FFFDF9  ink   #25233A  muted #747381  line #E7E2E5
accent #5146A4 (violet)  secondary #2F6F73 (teal)  detail #B49352 (gold)
gold   #B49352  deep  #292744  mint  #F2EFF8
```
Surfaces and borders are neutral in ~nine cases out of ten; the accent appears on the
active tab, links, and progress. Gold is reserved for small details, never fills a card.
Colour is semantic: completed = accent, destructive = `#8B5960`, nothing is coloured
"because it looked nice".

### One card family
Every content card: **16 padding, 20 radius, 1px `#E7E2E5` border, soft shadow.**
Panels that wrap other cards use 24; heroes use 28 and a stronger shadow. Because the
padding and radius never change, a screen reads as one set of objects.

### Two levels of elevation, and no more
```js
soft   = { shadowColor:'#3B3568', offset:{0,4},  opacity:.07, radius:14, elevation:2 }
shadow = { shadowColor:'#292750', offset:{0,10}, opacity:.11, radius:24, elevation:5 }
```
Borders do most of the separating; shadow is only for things that should lift.

### Custom iconography
65 bespoke illustrations, each 160×160 with a genuinely transparent background, drawn in
the same palette and optical weight — one per tool, per rite, per prayer, plus the five
menu glyphs. No library icon sets, so the icon language stays consistent.

### Motion that means something
The hero is the only place allowed continuous motion: three slow light auras (24–34s),
a 30s image zoom, a 20s sheen, and parallax tied to scroll. Everything else is 150ms
fades. `AccessibilityInfo.isReduceMotionEnabled` turns all continuous motion off.

### Honest states
No mock or placeholder data. Empty, error, loading and offline states are designed
rather than blanked, and "saved on device" is shown as a *state* — never as branding.

---

## 2. How spacing works

### Two grids
- **8pt grid for layout** — screen edges, section rhythm, space between groups.
- **4pt sub-grid inside components** — icon-to-label gaps, chips, tight pairs.

Tokens (`src/design/tokens.ts`):
```ts
SPACE   = { hairline:2, xs:4, sm:8, md:12, lg:16, xl:20, xxl:24, section:32, block:48 }
RADIUS  = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24, pill:999 }
CARD    = { padding:16, radius:20, gap:12 }
CARD_GAP = 12   SECTION_GAP = 32   TOUCH = 44
```

### The ladder, outside in
| Where | Value |
|---|---|
| Screen edge (`scroll`, `dataPage`) | 20 horizontal; content capped at 980 / 860 and centred |
| Above a section title / below it | 28 top, 16 bottom |
| Between cards in a list | 12 |
| Inside a card | 16 (compact rows 12, hero panels 20) |
| Between an icon and its label | 8 |
| Between closely related lines | 4 |
| Chips and pill grids | 8 gutter |

**Proximity rule:** if two related elements sit 12–16 apart, the gap to the next group
is about double (28–32). That is what makes sections read as sections.

### Radius ladder
`4` inline chips → `8` small tiles → `12` inputs and compact cards → `16` buttons and
badges → `20` the standard card → `24` panels, list containers, the floating menu →
`28` hero cards and large pills. A radius that closes a circle (half the side of a
square) is exempt from the ladder.

### Touch targets
44 minimum for standalone buttons (`iconBtn`), 54 for menu items (`floatItem`), 42 for
stepper buttons, 69 for list rows. Known exception: the rite checkbox in the journey
screen is 32 — it sits inside a 76px row, but it should be raised to 44.

### Responsive
```js
const wide = width >= 760;     // one screen uses 850
```
- Phone: one column; two-up tiles at `width:'48%'`; the Juz grid at `22.8%` (four-up).
- Wide: three-up (`exploreCardWide` 32.3%), two-up for Surah cards (`flexBasis:'47%'`),
  content capped and centred, gutters widened to 16.
- Nothing uses fixed pixel widths that assume a phone.

### Touch targets
| Control | Minimum |
| --- | --- |
| Standalone button, row, chip, stepper | 44 × 44 (chips also get `minWidth:44`) |
| Primary / secondary button | `minHeight:48` / `minHeight:44` |
| Floating menu item | 54 |
| Dense inline verse actions in the reader (play, bookmark, more) | 36 × 36 |
| Platform `Switch` | left to the platform control (renders 40 × 20 on web, 51 × 31 on device) |

Inline text links ("Gulf Region · Shafi →", "Mark position", "Source") keep their
14–26px text but carry `s.sectionLink`, which adds `paddingVertical:15` /
`marginVertical:-15` (and ±10 horizontally) so the hit area is ≥ 44pt while the
layout is unchanged. That is the only legitimate use of a negative margin here;
the other two exceptions are `seekKnob.marginLeft:-6` (centres a 13pt knob on a
5pt track) and `prayerRail.marginTop:-1` (hairline join).

Note: `hitSlop` is **not** honoured by React Native Web (no overlay is rendered),
so touch targets must be real boxes.

### Right-to-left
React Native does **not** mirror `flexDirection:'row'` automatically, so every row that
has an icon-then-text order is written as:
```jsx
style={[s.row, { flexDirection: rtl ? 'row-reverse' : 'row' }]}
```
Horizontal padding and margins use symmetric values so they flip for free; text
alignment is left to `textAlign:'auto'` except for Arabic script, which is pinned right.

### How it is kept honest
- Tokens live in `src/design/tokens.ts` and are referenced by the newer styles.
- 394 existing spacing and radius values were snapped onto the 4pt grid in one pass
  (circles and hairlines preserved).
- `qa-tools/redesign-qa.cjs` checks every tab at 320 / 390 / 768 / 1280 in both
  directions for horizontal overflow and for text clipped by its own box.
- `qa-tools/screen-drill.cjs` walks every reachable screen (40 at the last run) and
  reports, per screen: the header text, whether a back button is present, overflow,
  clipped text, and any press target under 44pt. `node qa-tools/screen-drill.cjs 1 390`.
- `qa-tools/layout-audit.cjs` (overflow + touch targets per tab) and
  `qa-tools/final-layout.cjs` (four widths, LTR + RTL, title→intro rhythm) complete
  the sweep. All four must stay clean; that is the regression test for this document.

---

## 3. Checklist for a new screen

1. `Page` → `ToolBar` (name + back) or `TopBar` (tab roots) → `ScrollView` with
   `contentContainerStyle={s.dataPage}`. A screen reached from a tab root is a stack
   child, so it uses `ToolBar`; only the five tab roots use `TopBar`.
2. `ToolGraphic` at the top (72–82px), then `s.dataTitle`, then one `s.intro` sentence.
3. Sections with `s.section` rhythm; cards use `s.dataCard` or the `CARD` tokens.
4. Every interactive row ≥ 44 tall (see the touch-target table), with an
   `accessibilityLabel` and `accessibilityRole`.
5. One icon per feature, one accent colour, no colour for its own sake.
6. Run `qa-tools/screen-drill.cjs` and the width sweep at all four widths, in English
   and Arabic, before committing.
