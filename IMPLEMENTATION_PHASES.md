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

- [x] Phase 1 — Complete
  - [x] Persistent worship settings foundation
  - [x] Configurable calculation method, madhab, and 12/24-hour display
  - [x] Prayer-time cache with honest cached status
  - [x] GPS, city, and manual-coordinate location with local persistence
  - [x] Daily prayer completion, weekly progress, and streak foundation
  - [x] Live/cached Ayah, Hadith, Name of Allah, and Dua daily content
  - [x] Morning and evening Adhkar plus persistent quick Tasbih
  - [x] Native prayer/Quran notification permission, scheduling, test, and recovery flow
  - [x] Bundled and streamed public-domain Adhan previews with per-prayer controls
  - [x] Referenced Wudu, Salah, Janazah, Eid, Istikhara, Taraweeh, Shahada, Ramadan, fasting, Laylatul Qadr, and Zakat al-Fitr guides
  - [x] RTL/LTR and responsive validation for the new Phase 1 destinations
  - [x] Cross-phase Quran-progress and global-player responsibilities explicitly retained in Phases 2 and 3
- [x] Phase 2 — Complete
  - [x] Live 114-Surah directory with debounced multilingual metadata search and verse-reference opening
  - [x] Full-text Arabic/translation search with local history management
  - [x] Live translation edition and language selection with attribution
  - [x] Juz 1–30 directory and live Juz reading
  - [x] Cache-first Surah reader with honest offline status
  - [x] Ayah cards and continuous reading modes
  - [x] Uthmani/Imla’i script choices, Arabic size, and line-spacing controls
  - [x] Local bookmarks, private notes, reading position, recents, and continuation
  - [x] Ayah copy, share, audio, note, position, Tafsir, and comparison actions
  - [x] Live Jalalayn Tafsir and edition comparison
  - [x] 30/60/90/120-day local reading plans
  - [x] 114-Surah local Hifz status tracker and filters
  - [x] Managed cache-first full-Quran preparation with progress, pause/resume, skip, and cleanup
  - [x] Curated Quran topics with live verified Arabic/translation passages and ayah navigation
  - [x] Quranic Arabic vocabulary flashcards with private review and known-word progress
  - [x] Live Tajweed edition parsing, colour legend, explanations, practice, and normal-text fallback
  - [x] Uthmani, Imla’i, source-attributed IndoPak/Nastaliq, and Tajweed script choices plus Noto Naskh and Amiri fonts
  - [x] Advanced 604-page Mushaf reader with direct page entry, previous/next navigation, progress, restoration, and page cache
  - [x] Juz and 60-Hizb navigation with live quarter-Hizb reading
  - [x] Dynamic two/three-edition translation comparison with language flags, responsive columns, and Arabic reference
  - [x] Dynamic Tafsir source/language selection with bounded offline Tafsir caching and verse browsing
  - [x] Hifz hide-and-peek recall practice and memory self-assessment
  - [x] Managed full-Quran preparation that persists across screens, resumes after restart when enabled, prioritizes continuation, skips cached Surahs, exposes progress, and pauses cleanly
- [ ] Phase 3 — In progress
  - [x] Live reciter catalogue with search, filtering, sample playback and 28 verse-by-verse Arabic reciters
  - [x] 243-reciter full-Surah directory (MP3Quran) with riwayah and Surah coverage, selected per mode
  - [x] Translation audio in the ten languages the source publishes, with sequential Arabic-then-translation queue mode
  - [x] Ayah, full-Surah, queue, next/previous, repeat none/one/all, speed and stop playback
  - [x] Global mini player above the tab bar, page inset so no content is obscured, and full player with drag-to-seek, elapsed/duration and Arabic text
  - [x] User playlists, recently played history, queue insertion, removal, direct selection and session resume
  - [x] Reader integration: play this Surah and play a specific verse from the reader
  - [x] Local persistence of reciter choice, translation choice, recents, playlists and last session
  - [x] Lock-screen metadata and background audio session on native; honest no-op on web
  - [x] Thirty-one missing interface icons drawn as real SVGs, replacing every generic fallback glyph
  - [ ] Hadith collections, books, search, grading, saves and progress
  - [ ] Dua and Adhkar categories with transliteration, copying and sharing
  - [ ] Tasbih presets, targets, daily totals and history
  - [ ] Names, Prophets, vocabulary and weekly summaries
  - [ ] Quran download manager with validation and cleanup
- [ ] Phase 4 — Not started
- [ ] Phase 5 — Not started
