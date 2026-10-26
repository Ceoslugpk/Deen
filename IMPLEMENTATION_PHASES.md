# Deen Companion — Five-Phase Delivery Plan

Source scope: `SALAH_FEATURES_5_SECTIONS.md` (976 lines), reviewed in full on 26 October 2026.

## Delivery rules applying to every phase

- Everything exposed in the interface must work; unfinished controls remain hidden.
- No accounts, advertising, subscriptions, or social engagement.
- Live public sources remain attributed. Offline behavior uses verified bundled content or previously fetched cache—never fabricated data.
- Every feature destination receives a bespoke graphical icon in the shared ivory, midnight-indigo, and antique-gold visual language.
- Motion is lightweight, purposeful, and reduced-motion aware; animated PNG/SVG transitions are preferred to heavy looping GIFs.
- Every screen must pass LTR and RTL checks at phone, tablet, and desktop widths.
- Data is local-first where appropriate. Sensitive data never leaves the device.
- Every phase ends with TypeScript, production export, interaction, API/error-state, RTL/LTR, overflow, and accessibility validation.

## Phase 1 — Prayer, Home, Location, Notifications, Adhan, and Worship Guides

### Scope
- Complete the Home dashboard, including dates, prayer progress/completion, daily content, shortcuts, Quran progress, summaries, and mini-player integration point.
- Configurable and cached prayer calculation: method, madhab, time format, date/location awareness, loading/error/retry, offline cached display.
- Complete explicit location setup: GPS, city/manual coordinates, persistence, permission recovery, refresh, and shared state.
- Prayer tracking, completed count, streaks, and weekly summary foundations.
- Notification permission/status, per-prayer reminders, offsets, scheduling/recovery, test action, and Quran reminders.
- Adhan reciter selection, preview controls, per-prayer settings, bundled fallback, persistence, and notification synchronization.
- Wudu, Salah, Janazah, Eid, Istikhara, Taraweeh, Shahada, Ramadan, fasting, Laylatul Qadr, and Zakat al-Fitr guides.

### First implementation tranche
- Persistent worship settings model.
- Prayer calculation method, madhab, and 12/24-hour display.
- Prayer-time caching and cached-data status.
- Persistent explicit location.
- Daily prayer completion and progress foundation.
- Phase 1 feature inventory and routes only when operational.

### Exit criteria
Every Phase 1 item in the source checklist is either working and tested or explicitly recorded as unavailable due to an operating-system limitation; no placeholder controls.

## Phase 2 — Quran Reading, Search, Study, Plans, Hifz, and Preparation

### Scope
- 114-Surah directory, advanced/debounced/reference search, history, Juz filters, recents, continuation, and cache-first opening.
- Translation language/edition selection and attribution.
- Ayah-card and continuous Mushaf/page modes with restoration and progress.
- Uthmani/Imla’i/IndoPak/Tajweed typography controls and accessible Arabic rendering.
- Reader translation controls and all ayah actions.
- Tafsir, topics, translation comparison, bookmarks, notes, Khatmah plans, Hifz, vocabulary, and Tajweed study.
- Managed full-Quran/translation background preparation.

### Exit criteria
Reading, study, persistence, search, and offline cache flows work without fake data in Arabic and supported translations.

## Phase 3 — Audio, Hadith, Duas, Education, and Downloads

### Scope
- Full Quran audio center, reciters, translation audio, queues, playlists, player, mini-player, background controls, caching, and downloads.
- Hadith collections/books/search/detail/grading/saves/progress with provenance.
- Dua and Adhkar categories, reading, copying, sharing, and verified offline bundles.
- Persistent Tasbih presets, targets, totals, and history.
- Names, Prophet catalogue, vocabulary, guides, and weekly summaries.
- Safe Quran text/audio download manager with validation and cleanup.

### Exit criteria
Audio lifecycle, source attribution, local persistence, download integrity, and offline playback are validated on supported platforms.

## Phase 4 — Tools, Fasting, Zakat, Pilgrimage, Live Streams, and Women’s Privacy

### Scope
- Qibla sensor/calculation, mosque finder, city/radius/manual search, maps routing.
- Fasting tracker, voluntary fasts, Qada ledger, streak/history, and Ramadan progress.
- Multi-asset/multi-currency Zakat with Nisab and local history.
- Full Hijri calendar navigation/conversion/events.
- Umrah and Hajj journeys, checklists, references, and holy-site live channels.
- Opt-in women’s worship area with PIN/session lock, cycle/purity/Nifas records, guidance, and Qada fasts.

### Exit criteria
Sensitive records are local and protected; religious/medical guidance is sourced and appropriately qualified; live and sensor features have honest fallbacks.

## Phase 5 — Settings, Personalization, Offline, Privacy, Backup, Localization, and Accessibility

### Scope
- Complete validated settings system with readback, sanitization, queueing, and rollback.
- Paper/light, ink/dark, and system appearance plus restrained accent palettes.
- English, Arabic, Urdu-ready localization with direction hydrated before UI.
- Local database/cache/download architecture across all feature domains.
- Validated export/import backup and corruption handling.
- Privacy, terms, providers, permissions, and redacted diagnostics.
- Accessibility, reduced motion, large text, keyboard/safe-area behavior, reliability, and recovery hardening.

### Exit criteria
The complete application passes privacy, offline, localization, accessibility, responsive, persistence, migration, recovery, and production-release checks.

## Progress

- [ ] Phase 1 — In progress
  - [x] Persistent worship settings foundation
  - [x] Configurable calculation method, madhab, and 12/24-hour display
  - [x] Prayer-time cache with honest cached status
  - [x] Persistent explicit location
  - [x] Daily prayer completion and progress foundation
  - [ ] Remaining Home, notification, Adhan, location, streak/summary, and guide work
- [ ] Phase 2 — Not started
- [ ] Phase 3 — Not started
- [ ] Phase 4 — Not started
- [ ] Phase 5 — Not started
