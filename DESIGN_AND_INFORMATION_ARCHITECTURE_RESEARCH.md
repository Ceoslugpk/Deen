# Islamic — Premium Design & Islamic App Structure Research

**Date:** 26 October 2026  
**Scope:** Research and product direction only. This document defines what should be designed before another implementation pass.

---

## Executive conclusion

A premium Islamic app should not look like a generic dashboard decorated with crescents. It should feel **calm, trustworthy, reverent, precise, and effortless at the moment of worship**.

The strongest direction for Islamic is:

- **Editorial, not ornamental:** strong typography, quiet spacing, carefully framed imagery, and fewer competing cards.
- **Polychromatic but controlled:** midnight indigo as the brand anchor, with teal, saffron, coral, and plum assigned semantic roles—not random colors per tile.
- **Content-first:** prayer and Quran content must dominate; decoration must never compete with Qur’anic Arabic or time-critical information.
- **Private by design:** no account, no ads, no social feed, no engagement pressure, and device-local preferences.
- **Trust made visible:** always expose source, prayer calculation method, Asr convention, location, timezone, Hijri adjustment, and hadith/dua references.
- **Progressively disclosed:** daily essentials first; the full library remains easy to find without placing every feature on Home.
- **Arabic-native:** Arabic is not a secondary translation layer. The information architecture, typography, mixed-direction text, controls, and testing strategy must work natively in RTL.

The recommended primary navigation remains five destinations, but with clearer jobs:

1. **Today** — what matters now
2. **Prayer** — times, Qibla, calendar, Ramadan
3. **Quran** — read, listen, search, study
4. **Library** — duas, hadith, names, Tasbih, Zakat, mosques
5. **Settings** — private device preferences and sources

---

# Part I — What makes the design feel premium

## 1. Premium means restraint, not more decoration

Apple’s current design guidance emphasizes expressing hierarchy through layout and grouping rather than unnecessary backgrounds and borders. Material 3 similarly uses typography, tonal palettes, shape, and purposeful motion to establish hierarchy. Both directions point away from “every item is a colorful card” and toward a more disciplined visual system.

### Apply this to Islamic

- One dominant visual moment per screen.
- One obvious primary action per screen.
- Use negative space to separate meaning, not excessive lines or shadows.
- Reserve richly illustrated surfaces for Home, Quran entry, Ramadan, and special moments.
- Use quiet, flat or tonal surfaces for schedules, lists, settings, and long-form reading.
- Avoid a grid of equally loud cards; equal visual weight creates no hierarchy.
- Use gold sparingly. Gold should mark sacred or significant moments, not function as a default accent.

**Sources:**
- Apple, *Get to know the new design system*: https://developer.apple.com/videos/play/wwdc2025/356/
- Material 3 Expressive: https://m3.material.io/
- Material hierarchy and accessibility: https://m2.material.io/design/usability/accessibility.html

## 2. Recommended visual identity

### Brand idea: “Night sky, illuminated knowledge”

The visual language should combine the quiet of evening worship with the warmth of illuminated manuscripts.

### Color roles

| Role | Suggested direction | Usage |
|---|---|---|
| Brand primary | Midnight indigo | Navigation, key actions, selected states, prayer hero |
| Spiritual secondary | Deep teal | Qibla, location, live data, mosque-related content |
| Sacred emphasis | Saffron / restrained gold | Current ayah, important date, next prayer, selected Quran marker |
| Human warmth | Muted coral | Duas, reminders, caring prompts—not errors |
| Reflection | Plum | Hadith, tafsir, learning and contemplation |
| Background | Warm parchment-lilac neutral | Main canvas; avoids sterile white and avoids green saturation |
| Text | Blue-black / charcoal-indigo | Primary reading text |
| Success/live | Emerald used selectively | Live status and successful completion only |

### Rules

- Use a **60/30/10 ratio**: neutral surfaces dominate, indigo structures the experience, accents supply meaning.
- Colors identify domains consistently. Qibla should not be teal on one screen and coral on another.
- Navigation icons remain mostly neutral; only the selected destination receives the primary color.
- Never communicate prayer status, errors, or grades using color alone.
- Define tonal variants for each role rather than inventing hex values screen by screen.

Material 3’s color model supports primary, secondary, tertiary, neutral, and neutral-variant tonal palettes, which fits this approach better than a single-green brand system.

**Source:** https://developer.android.com/develop/ui/compose/designsystems/material3

## 3. Typography must carry the premium feeling

The current app relies heavily on tiny labels and bold sans-serif text. Premium editorial design needs greater contrast between display, heading, body, metadata, and Arabic scripture.

### Recommended type system

- **English display/editorial:** a refined serif or high-contrast text face for special headings only.
- **English UI:** a highly legible sans-serif for controls, times, settings, and metadata.
- **Arabic UI:** Noto Naskh Arabic or Noto Sans Arabic, depending on role.
- **Quran text:** an approved Uthmani/QPC rendering aligned with the exact text field being displayed.

### Scale

| Style | Recommended use |
|---|---|
| Display 36–44 | Next prayer time, Ramadan day, Qibla bearing |
| Headline 28–32 | Screen titles |
| Title 20–24 | Major sections and cards |
| Body 16–18 | Reading and explanatory copy |
| Label 13–15 | Buttons, tabs, chips |
| Metadata 12–13 minimum | Sources, calculation method, references |
| Quran Arabic 28–36+ | Verse text, with approximately 1.8–2.0 line height |

Tiny 8–10 px labels may look elegant in screenshots but are not acceptable for essential information. Apple recommends maintaining information hierarchy as text scales, and Material specifies 4.5:1 contrast for small text and 3:1 for large text.

For Quran rendering, Quran Foundation documents specific pairings between text fields and fonts. QPC Hafs text should use the corresponding Uthmanic Hafs font; QCF glyph-based text requires its matching page font. Generic Arabic typography must not be substituted casually for sacred text.

**Sources:**
- Apple typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Apple accessibility: https://developers.apple.com/design/human-interface-guidelines/foundations/accessibility
- Material typography and contrast: https://m3.material.io/styles/typography/applying-type
- Noto Naskh Arabic: https://fonts.google.com/noto/specimen/Noto%2BNaskh%2BArabic
- Quran Foundation font rendering: https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/

## 4. Iconography should be custom, coherent, and semantic

Custom icons are valuable only when they form a system. A collection of unrelated colorful glyphs still feels inexpensive.

### Icon system specification

- One grid, optical size, corner language, and stroke family.
- Two-tone treatment: primary stroke plus one restrained domain accent.
- Filled state reserved for selected navigation or completion.
- Domain accents remain stable:
  - Quran — teal
  - Prayer — indigo
  - Qibla/location — cyan
  - Dua/dhikr — coral
  - Calendar/Ramadan — saffron
  - Hadith/learning — plum
- Minimum 44×44 pt interactive region, even when the drawn icon is 20–24 pt.
- Every icon must have a text label or accessibility label where meaning is not universally obvious.
- Motion should explain state: compass rotation, audio playing pulse, Tasbih count confirmation, download progress, bookmark saved.

## 5. Motion should clarify worship state

Material describes motion as a way to guide focus and communicate hierarchy; Apple advises against requiring animation and recommends respecting reduced-motion preferences.

### Use motion for

- Next-prayer countdown transitioning to the new prayer.
- Qibla compass calibration and direction lock.
- Quran audio progress and current-ayah transition.
- Tasbih tap confirmation.
- Expanding tafsir, translation, and source details.
- Smooth but restrained navigation transitions.

### Avoid

- Continuous bobbing icons across a whole dashboard.
- Decorative looping particles.
- Large parallax movement behind Quran text.
- Bounce-heavy motion during prayer or Quran reading.
- Animation that delays immediate access to worship tools.

Provide a reduced-motion mode and use opacity or short cross-fades as the fallback.

**Sources:**
- Material accessibility and motion: https://m2.material.io/design/usability/accessibility.html
- Apple accessibility and reduced motion: https://developers.apple.com/design/human-interface-guidelines/foundations/accessibility

## 6. Imagery and Islamic visual language

Use imagery as an atmosphere, not as evidence or religious authority.

### Suitable

- Architectural details, geometric light, landscape, sky, paper, fabric, carved pattern, and calligraphic texture.
- Abstracted or cropped mosque imagery with enough empty area for readable text.
- Subtle seasonal changes for Ramadan and Eid.

### Avoid

- AI-generated Arabic calligraphy that may contain malformed or meaningless text.
- Decorative Quran verses baked into images.
- Every screen using a mosque dome.
- Excessive crescents, lanterns, stars, and gold borders.
- Human imagery that makes the app feel like stock advertising.
- Visual effects that reduce the clarity or dignity of Quran text.

## 7. Layout and responsiveness

A premium design should adapt its composition, not merely stretch cards.

### Compact phones

- One-column flow.
- Bottom navigation.
- Sticky compact audio player when Quran audio is active.
- Thumb-reachable primary actions.
- Avoid placing more than one large hero before the first useful interaction.

### Large phones and tablets

- Two-pane Quran reading: navigation/translation controls beside the reading surface.
- Prayer calendar next to the day schedule.
- Navigation rail on medium/large widths.
- Library category rail or sidebar.
- Keep long-form reading at a comfortable maximum width.

Material’s adaptive guidance explicitly pairs bottom navigation with compact widths and navigation rails/drawers with medium and large layouts.

**Source:** https://developer.android.com/develop/ui/compose/designsystems/material3

## 8. Accessibility is part of premium quality

A beautiful app that cannot scale text, expose focus, or distinguish controls is not premium.

Required standards:

- 4.5:1 minimum contrast for normal text.
- 3:1 for large text and essential non-text UI boundaries.
- 44×44 pt iOS and approximately 48×48 dp Android interaction targets.
- Visible keyboard focus on web and tablet keyboards.
- Screen-reader names, roles, values, and hints.
- Dynamic text without clipping.
- No state communicated only by color.
- Reduced-motion support.
- Audio controls usable without precise gestures.
- Bottom navigation must not obscure focused or scroll-targeted content.

**Sources:**
- W3C mobile guidance: https://www.w3.org/TR/wcag2mobile-22/
- Apple accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Material accessibility: https://m2.material.io/design/usability/accessibility.html

---

# Part II — How to structure a complete Islamic app

## 9. Organize around user intentions, not a list of features

Researching Muslim Pro, Islam360, Quran.com, Islamic.app, and prayer-focused apps reveals recurring user jobs:

1. **What do I need now?** Next prayer, current date, immediate dua, continue reading.
2. **Help me pray correctly.** Times, notifications, Qibla, calculation method, mosque.
3. **Help me read or listen to Quran.** Surah/juz navigation, translation, audio, bookmarks, search.
4. **Help me remember Allah.** Duas, adhkar, Tasbih, Names.
5. **Help me learn from trusted sources.** Hadith, tafsir, references, search.
6. **Help me plan Islamic time and obligations.** Hijri calendar, Ramadan, fasting, Zakat.
7. **Respect my privacy and preferences.** No account, transparent permissions, local state.

Competitor breadth is useful, but the strongest Quran products keep the reader clean and focused. Quran.com emphasizes reading, listening, translation, tafsir, word-by-word study, search, and bookmarks in a distraction-free experience. Islam360’s differentiator is deep Quran and Hadith search, references, roots, tafsir, and multi-language study. Muslim Pro’s strength is breadth around daily worship, location, Ramadan, and nearby services.

**Sources:**
- Muslim Pro features: https://www.muslimpro.com/features/
- Islam360 App Store listing: https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149
- Quran.com about: https://quran.com/about-us
- Quran.com apps: https://quran.com/apps

## 10. Recommended primary information architecture

### Tab 1 — Today

Purpose: answer “what matters now?” within seconds.

Order:

1. Location and Hijri date
2. Next prayer + countdown + immediate prayer notification control
3. Compact five-prayer timeline
4. Continue Quran reading/listening
5. Contextual daily action
   - Morning/evening adhkar by time
   - Friday Surah Al-Kahf prompt
   - Ramadan suhoor/iftar during Ramadan
6. One sourced hadith or dua—not both as competing large cards
7. Quick actions, personalized locally by recent use

Rules:

- Home is not the whole app compressed into one screen.
- Maximum six quick actions before “View all.”
- The first viewport must show prayer information and one useful action.
- Do not add streak shame, social counts, upgrade prompts, or account prompts.

### Tab 2 — Prayer

Purpose: all prayer, direction, and Islamic-time tools.

Subsections:

- Today’s prayer schedule
- Weekly/monthly timetable
- Qibla
- Adhan/reminder controls
- Hijri calendar
- Ramadan mode and 30-day timetable
- Nearby mosques
- Prayer settings and method explanation

Always visible or one tap away:

- Location
- Timezone
- Calculation method
- Asr school/convention
- High-latitude method where applicable
- Manual minute offsets
- Source timestamp

AlAdhan supports calculation method, Asr school, high-latitude adjustment, midnight mode, and per-prayer tuning. Hiding those parameters makes a calculated time look more authoritative than it is.

**Sources:**
- AlAdhan calculation methods: https://aladhan.com/calculation-methods
- AlAdhan prayer calendar: https://aladhan.com/calendar
- AlAdhan API schema: https://api.aladhan.com/v1/documentation/openapi/prayer-times/yaml

### Tab 3 — Quran

Purpose: a dedicated reading and listening product inside the app.

Entry screen:

- Continue reading/listening
- Search
- Browse by Surah, Juz, page, Hizb
- Bookmarks and local notes
- Downloads/offline status
- Reading preferences

Reader:

- Arabic text is the visual priority.
- Translation appears below or in an optional parallel pane.
- Sticky but unobtrusive audio controls.
- Per-ayah actions: play, repeat, bookmark, share, tafsir, word-by-word.
- Translation, tafsir, and reciter are selectable without leaving the reading context.
- Current recited ayah receives a saffron highlight.
- Reader remembers local progress without an account.
- Provide a distraction-free mode.

Study and search:

- Search Arabic, translation, and topic separately.
- Show exact ayah reference and translation source in every result.
- Distinguish Quran text, translation, tafsir, and user notes visually and semantically.

### Tab 4 — Library

Purpose: a structured catalogue—not a miscellaneous “Explore” dumping ground.

Recommended groups:

**Remember**
- Duas
- Morning/evening adhkar
- After-prayer adhkar
- Tasbih
- 99 Names

**Learn**
- Hadith collections
- Hadith of the day
- Tafsir entry points
- Islamic topics/search

**Plan and calculate**
- Zakat
- Hijri events
- Ramadan

**Nearby**
- Mosques

Each collection needs category browsing, search, favorites stored locally, and clear source references.

Islamic.app exposes 268 Hisn al-Muslim duas across 132 categories with named shortcuts for morning, evening, after prayer, travel, protection, and other common jobs. This is a better organizing model than a single flat dua feed.

**Source:** https://docs.islamic.app/api-reference/dhikr

### Tab 5 — Settings

Purpose: privacy, accuracy, language, content, audio, and accessibility.

Groups:

- Language and text direction
- Location and privacy
- Prayer calculation
- Adhan and notifications
- Quran script, translation, reciter, font size
- Appearance, contrast, and reduced motion
- Downloads and storage
- Data sources and attribution
- About and methodology

No profile, login, membership, subscription, or cloud-account language.

## 11. Global search architecture

A full Islamic app benefits from one search entry, but results must never blur different content types.

Result groups:

- Quran
- Translation
- Tafsir
- Hadith
- Duas/adhkar
- App tools

Every result must display:

- Content type
- Primary source
- Exact reference
- Language/translation
- Grade and grader for hadith when available

Islam360’s key differentiator is advanced Quran and Hadith search across Arabic words, roots, topics, and translations. The lesson is not to place search everywhere; it is to build a trustworthy, source-aware result model.

Hadith grades must be reproduced from named upstream scholarship—not invented or flattened into a generic “verified” label. Islamic.app states that its grades come from upstream recognized graders and that it does not independently regrade reports.

**Sources:**
- Islam360 feature listing: https://play.google.com/store/apps/details?id=com.islam360
- Islamic.app grades: https://islamic.app/hadith/grades

## 12. Trust and provenance architecture

Every religious-content entity should have structured provenance fields.

### Quran

- Surah and ayah
- Arabic script/text edition
- Translation name and translator
- Tafsir title and author
- Reciter and audio edition
- Data provider/version

### Hadith

- Collection
- Book/chapter
- Hadith number and reference convention
- Arabic and translation source
- Grade
- Grader
- Provider

### Dua/adhkar

- Arabic
- Translation
- Transliteration, optional
- Repetition count where sourced
- Occasion/category
- Source reference
- Provider

### Prayer

- Coordinates or selected city
- Timezone
- Calculation method
- Asr convention
- High-latitude rule
- Manual offsets
- Source/fetched time

### Hijri dates

- Calculation source
- Regional/manual adjustment
- A note that local moon-sighting announcements may differ

This metadata belongs in the data model, not as marketing copy added later.

## 13. Privacy architecture

The app’s no-account decision should shape both product and technical architecture.

### Device-local

- Preferences
- Bookmarks
- Last-read position
- Notes
- Tasbih state
- Notification settings
- Download index
- Optional prayer/fasting records

### Permissions

- Ask for foreground location only when the user activates a location-dependent feature.
- Explain why before the system prompt.
- Offer manual city entry.
- Do not request continuous/background location for basic prayer times.
- Do not place a silent Dubai fallback under a “live” location label.
- Display the selected location and allow correction.

Google Play notes that location used only on device is not considered collected, while data sent to an API can be considered ephemeral only under specific handling conditions. The product should truthfully explain whether coordinates leave the device to reach AlAdhan or Islamic.app.

**Sources:**
- Google Play Data Safety: https://support.google.com/googleplay/answer/11416267
- Android privacy checklist: https://developer.android.com/privacy-and-security/about

## 14. Arabic and RTL architecture

Arabic support is a platform requirement, not merely translated labels.

- All UI copy must come from localization keys.
- Use start/end rather than left/right for directional spacing.
- Mirror navigation and directional icons where semantics require it.
- Do not mirror universal media controls or the physical Qibla bearing.
- Keep phone numbers, coordinates, times, verse numbers, and URLs directionally isolated inside Arabic copy.
- Let Quran Arabic remain RTL even when the English interface is active.
- Test English UI with Arabic content, Arabic UI with English references, and mixed numerals.
- Test pseudo-locales and large text.

Expo SDK 58 follows React Native `I18nManager`; RTL is enabled by default when the device uses a supported RTL locale. Native direction changes require an app restart. Android’s official guidance also emphasizes locale-specific resources and proper handling of mixed RTL/LTR text.

**Sources:**
- Expo localization and RTL: https://docs.expo.dev/guides/localization/
- React Native I18nManager: https://reactnative.dev/docs/i18nmanager
- Android language and BiDi guidance: https://developer.android.com/training/basics/supporting-devices/languages

## 15. Progressive disclosure for a full feature suite

A full suite does not require every feature to be visible simultaneously. Nielsen Norman Group recommends progressive disclosure for complex applications, especially on mobile.

Use three levels:

1. **Today:** frequent, time-sensitive actions.
2. **Primary destinations:** Prayer, Quran, Library.
3. **Detail and advanced settings:** calculation methods, tafsir, audio setup, data sources.

Rules:

- No more than two navigation levels before reaching content.
- Search and recent items provide expert shortcuts.
- Advanced settings remain discoverable through clearly labeled controls.
- Do not hide essential accuracy or source information behind unexplained gestures.

**Source:** https://www.nngroup.com/articles/progressive-disclosure/

---

# Part III — Recommended screen system

## 16. Reusable premium screen patterns

### A. Time-critical dashboard

Used by Today and Prayer.

- Context strip: date, location, source state
- Dominant metric: next prayer/time
- Timeline
- One primary action
- Supporting detail below

### B. Reading surface

Used by Quran, tafsir, hadith, duas.

- Calm background
- High-legibility content column
- Source and reference near content
- Actions grouped consistently
- Expandable secondary commentary
- Persistent reading/audio state

### C. Directional instrument

Used by Qibla.

- Calibration state
- Location
- Bearing
- Direction indicator
- Accuracy/confidence note
- Accessible textual alternative

### D. Collection browser

Used by Quran chapters, hadith books, duas, names.

- Search
- Category filters
- Recent/favorites
- Clear list hierarchy
- Source-aware detail view

### E. Calculator/form

Used by Zakat and advanced prayer settings.

- Step-based inputs
- Explanations beside unfamiliar terms
- Live result summary
- Methodology and disclaimer
- No false religious certainty

## 17. Current app: retain, revise, and remove

### Retain

- No-account, privacy-first positioning.
- Live-source approach.
- Strong illustrated Home and Quran entry points.
- Responsive compact/tablet/desktop foundations.
- Custom icon direction.
- Clear primary destinations.

### Revise

- Increase metadata and navigation text sizes.
- Reduce the number of equally prominent cards.
- Convert the color system from per-icon variety to stable semantic domain colors.
- Create a real typography system with locally bundled fonts.
- Make location permission and selected location explicit across Prayer, Qibla, and Mosques.
- Replace silent Dubai defaults with onboarding/manual location selection.
- Make calculation method and Asr convention editable.
- Expand Quran into a complete reader/listener/search product.
- Replace flat data screens with collection browsers and detailed source views.
- Implement actual Arabic localization and tested RTL, not just Arabic content.

### Add before calling the product complete

- Full Hijri Calendar screen.
- Ramadan dashboard and 30-day timetable.
- Global source-aware search.
- Local bookmarks and reading position.
- Dua categories and references.
- Hadith collection/reference/grade model.
- Prayer methodology settings.
- Manual city selection.
- Accessibility labels, text scaling, contrast audit, and reduced motion.

### Remove or avoid

- Decorative icon animation on every static item.
- Tiny 8–10 px essential labels.
- Generic “verified” labels without provenance.
- A flat Explore grid as the only discovery system.
- Artificial streaks or engagement pressure.
- Unnecessary account, social, ad, subscription, or cloud language.

---

# Part IV — Implementation order after approval

## Phase 1 — Foundations

1. Design tokens: semantic color, typography, spacing, radius, elevation, motion.
2. Locally bundled English, Arabic UI, and Quran fonts with verified licensing.
3. Reusable custom icon system with domain colors and accessibility labels.
4. Localization architecture and true RTL test mode.
5. Shared location/permission model.
6. Local storage model with no account.

## Phase 2 — Core worship

1. Today
2. Prayer and method settings
3. Qibla
4. Quran browse, reader, audio, search, bookmarks

## Phase 3 — Structured library

1. Dua/adhkar categories
2. Hadith collections and references
3. 99 Names
4. Tasbih
5. Zakat
6. Mosques

## Phase 4 — Islamic time

1. Hijri calendar
2. Ramadan dashboard
3. Fasting timetable
4. Islamic events and regional Hijri adjustment

## Phase 5 — Quality

1. Arabic copy review
2. Religious-content source audit
3. Accessibility audit
4. Responsive tablet/web audit
5. Offline and poor-network states
6. Performance and bundle audit

---

# Final design brief

Islamic should look like a **private digital prayer companion and reading room**, not a commercial lifestyle super-app.

Its premium quality should come from:

- confident typography,
- dignified Quran presentation,
- stable semantic color,
- precise source information,
- quiet motion,
- responsive composition,
- thoughtful Arabic behavior,
- and immediate access to prayer and Quran.

The next redesign should begin with a tokenized design system and this information architecture—not with another isolated Home-screen styling pass.
