# Cloudflare Quran API — pre-integration audit

Target: `https://api.islamicdata.uz/v1`
Worker: `islamicdata` · snapshot `2026-10-29-branded-01` · deployment `f8aa9aa9-8322-4451-bbae-faecbcdd7ecd`
Audited: 2026-10-29

## Verdict

The API is **healthy, correct, and production-ready for what it contains** — but it is a
**translations-and-tafsir service, not a Quran data service**. It cannot replace
`api.alquran.cloud` as the app's primary Quran provider, because it carries no Arabic
script, no audio, and no page/juz/hizb structure.

Recommended role: **a second provider behind the existing adapter, supplying translation
and tafsir catalogs and text.** Keep alquran.cloud for Arabic, structure and audio.

---

## What passed

| Check | Result |
|---|---|
| `GET /health` | `200` · `ok:true` · `dataVersion 2026-10-29-branded-01` |
| `GET /manifest` | `307` quran + `83` tafsir + 2 catalog objects = 392 · `ayahsPerEdition 6236` |
| `GET /quran/editions` | `307` editions, all `complete:true`, coverage `6236/0/true`, 81 languages |
| `GET /tafsir/editions` | `83` editions, all `complete:true`, coverage `6236/0/true`, 13 languages |
| EN / UR / ZH translation, surah 1 | `200`, correct text, 7 ayahs, sequential |
| Tafsir EN (al-jalalayn), surah 1 | `200`, `category:"tafsir"`, 7 ayahs |
| Surah 114 (EN) | `200`, 6 ayahs |
| **6,236-ayah coverage** | **Verified for real** — swept all 114 surahs on 3 editions (EN, UR, tafsir): total `6236` each, all sequential, no empty ayahs, canonical counts match (2→286, 36→83, 55→78, 67→30, 112→4, 114→6) |
| Missing edition | `404 {"error":{"code":404,"message":"Edition not found"}}` |
| Invalid surah (`0`, `115`, `abc`) | `400 {"error":{"code":400,"message":"Invalid edition or surah"}}` |
| ETag / `If-None-Match` | `304`, 0 bytes |
| CORS simple GET | `access-control-allow-origin` echoes the Origin |
| CORS preflight | `204` · `allow-methods: GET, HEAD, OPTIONS` · `allow-headers: If-None-Match, Range, Content-Type` |
| Category separation | quran ID on `/tafsir/...` → `404`; tafsir ID on `/quran/...` → `404` |
| `words` array | present on all 11 `word-map` editions |
| Mobile User-Agents | iOS `CFNetwork`, Android `okhttp`, `Dalvik`, `Expo`, short app UA, empty UA — all `200` |
| Cache headers (surah) | `cache-control: public, max-age=31536000, immutable` |

Global ayah `number` runs 1→6236 (surah 2 starts at 8, surah 114 ends at 6236), so
`verse_key` is derivable as `surahNumber:numberInSurah`, or from `number` plus a surah
offset table.

---

## Blockers — why this cannot be the primary provider

The app's `Verse` type (`src/services/api.ts:7`) is
`{ id, verse_key, text_uthmani, translation, audio, page, juz, hizbQuarter, surah_name }`.
An ayah from this API is `{ number, numberInSurah, text }`.

1. **No Arabic Quran text.** Zero editions with `language: "ar"` in the quran catalog —
   no Uthmani script, no IndoPak, no tajweed. `text_uthmani` is the backbone of the
   reader *and* the entire Mushaf page layout. (The one `b06.script.*` edition is
   `urud` — Urdu word-by-word.)
2. **No `page`, `juz`, `hizbQuarter`.** The reader needs all three per verse: Mushaf
   paging, Juz/Hizb navigation, the "Juz · Page" footer, and the division markers
   between verses.
3. **No chapter list.** No `/chapters` route exists, and the per-surah response returns
   `nameSimple`, `nameArabic`, `nameEnglish` and `revelationPlace` as **empty strings**.
   The app needs all 114 chapters with names and verse counts.
4. **No search.** `/search` returns `404`. The app has `searchQuran`.
5. **No audio.** No per-verse audio, no reciters. The app uses `ar.alafasy` and
   `/edition/format/audio`.

### Endpoints that do not exist (probed, all `404`)

`/chapters` · `/surahs` · `/quran/surahs` · `/quran/chapters` · `/meta` ·
`/quran/editions/{id}` (no metadata route) · `/quran/editions/{id}/surahs/1/ayahs/1` ·
`/quran/ayah/{n}` · `/audio` · `/reciters` · `/quran/editions/{id}/full` ·
`/search` · `/quran/search/{q}`

---

## Friction to design around

6. **Per-surah only.** There is no per-ayah route. The Tafsir & Compare screen currently
   calls `/ayah/{key}/editions/{a},{b},{c}`. With this API comparing three editions for
   one verse means three full-surah fetches — fine once cached, a real change
   regardless.
7. **`verse_key` is not returned.** Synthesise `surahNumber:numberInSurah`.
8. **One work appears as several editions.** 134 of 307 quran editions are duplicates by
   name+language — `en-sahih-international` ×4, `bridges-translation` ×4,
   `al-hasan-efendi` ×4, `tafsir-e-usmani` ×4. They differ only by `variant`
   (simple / chunks / footnotes / footnotes-inline). A picker that shows only `name`
   will list "en-sahih-international" four times. **The UI must surface `variant`.**

---

## Data-quality issues

9. **`author` is `null` on all 390 editions**, and `authorSource` too. Your own
   integration doc requires the adapter to "preserve `author`" — there is nothing to
   preserve. Any "translated by…" line will be blank.
10. **10 language mislabels.** The Mokhtasar tafsir series is systematically wrong:

    | edition name | tagged | should be |
    |---|---|---|
    | `tagalog-mokhtasar` | `sw` | `tl` |
    | `pashto-mokhtasar` | `ur` | `ps` |
    | `kurdish-mokhtasar` | `ur` | `ku` |
    | `persian-mokhtasar` | `ur` | `fa` |
    | `uzbek-mokhtasar` | `ru` | `uz` |
    | `serbian-mokhtasar` | `ru` | `sr` |
    | `vietnamese-mokhtasar` | `es` | `vi` |
    | `bosnian-mokhtasar` | `pt` | `bs` |
    | `maududi-roman-urdu` | `en` | `ur` (romanised) |
    | `indonesian-word-by-word-translation` | `ms` | `id` |

    Also `fr-hussein-taji` is tagged `fa`. Language-driven filtering will misfile these.
11. **Tafsir language detection is weak:** only **3 of 83** are `high` confidence;
    66 `medium`, **14 `low`**. Quran is better: 177 high / 128 medium / 2 low.
12. **`languageName` is inconsistent.** Quran editions return `"English"`; tafsir returns
    `"en"` (the raw code). Don't display this field without a fallback.
13. **`provenanceStatus: "review-required"` on all 390 editions**, and the manifest flags
    the whole snapshot. Worth resolving before you publish attribution.
14. **`name` is a slug, not a display name** — `urud`, `de-bubenheim`, `ro-grigore`,
    `mrn-unknown`, `dv-unknow`, `bs-unknown`, `abdul-hamid-haidar-kanhi-muhammad`. These
    need a prettifier, or the picker will look unfinished.
15. **Non-standard `206` on plain GET.** `/manifest`, `/quran/editions` and
    `/tafsir/editions` return `206 Partial Content` with
    `content-range: bytes 0-N/N` — the full body, but a 206 status. `fetch` accepts it
    (`ok` covers 200–299) so it works, but strict clients and some caches will not.
    Worth returning `200` when no Range was requested.

---

## Doc corrections

16. **The `translation` field never appears.** The doc says translation entries "may
    contain `translation`". Across sampled editions the ayah keys are only
    `{number, numberInSurah, text}`, plus `words` for word-map. **Read `text`.**
17. **The suggested types are incomplete.** Real editions also carry
    `authorizationStatus`, `provenanceStatus`, `counterpartStatus`, `coverage`, `object`,
    `languagePair`, `bilingual`, `authorSource`, `languageConfidence`,
    `languageDetectionSource`.
18. **The documented surah shape shows empty strings for the name fields** — that
    example is accidentally accurate; they really are empty. Worth stating explicitly so
    nobody builds on them.

---

## Note on testing

Requests with a `Python-urllib/3.x` User-Agent get **HTTP 403, Cloudflare error 1010**
(Browser Integrity Check). This is a false alarm for the app: every realistic mobile UA
tested returns `200`. If you run automated checks, set a browser or app User-Agent or
you will chase a ghost.

---

## Recommended integration

1. Keep `api.alquran.cloud` for Arabic script, `page`/`juz`/`hizbQuarter`, chapters,
   search and audio.
2. Add this Worker as a **translation/tafsir provider** behind the existing adapter,
   selected by edition ID.
3. In the adapter, map `{ number, numberInSurah, text }` → `Verse` with a synthesised
   `verse_key`, leaving `page`/`juz`/`hizbQuarter` to the structural provider.
4. Surface `variant` in every edition picker; prettify `name`; never rely on `author`.
5. Treat `language` as a hint; do not filter on it alone (see item 10).
6. Cache by `category + editionId + surahNumber + dataVersion`, and use ETag/304 as the
   doc says — both are verified working.

## Rollout gate

| Gate | Status |
|---|---|
| `/health` returns `ok:true` | PASS |
| `/manifest` reports expected snapshot | PASS |
| One EN translation | PASS |
| One UR translation | PASS |
| One non-Latin translation (ZH) | PASS |
| One Tafsir edition, separately | PASS |
| Surah 1 and Surah 114 | PASS |
| Missing edition → 404 | PASS |
| ETag / 304 | PASS |
| Offline cache fallback | not testable from here — app-side |
| App never exposes credentials | n/a — public GETs only |
| **Coverage claim (6,236 × 114)** | **PASS — verified by full sweep** |
| **Can it be the primary provider?** | **NO — see blockers 1–5** |
