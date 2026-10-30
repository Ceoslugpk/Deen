# Islamic — Implementation Requirements

Scope: wiring the Islamic Data Quran provider into the app, and specifying the
Hadith API to build on the same Cloudflare Worker.

Status: **Quran adapter is written and tested** (`src/services/islamicDataApi.ts`,
43/43 against the live API). **Hadith Worker endpoints do not exist yet** — this
document specifies them. No screen is wired to either yet.

Every number here was measured against the live services on 2026-10-29, not
estimated.

---

## 0. Principles

These five rules decide most questions below. When something is ambiguous, the
answer is whichever option follows them.

1. **One provider owns structure; the other owns text.** Page, juz, hizb, Arabic
   script, chapters, audio and search come from `api.alquran.cloud`. Translation
   and Tafsir text come from the Worker. Neither is asked to fake what it does
   not have.
2. **Never invent data.** No synthesised Arabic, no guessed translator. A field
   the source does not supply stays empty and the UI degrades instead.
3. **Validate before caching.** A payload is checked in full before it is
   written. A malformed response can never displace good cached content.
4. **Cache is not optional, it is the offline story.** Every fetch goes through
   `contentCache`, which is what Downloads and offline mode read.
5. **A failed refresh must cost the user nothing.** Falling back to cache is
   normal operation, not an error path.

---

## 1. Where things stand

| Piece | State |
|---|---|
| Quran Worker (`api.islamicdata.uz/v1`) | Live. 307 translations, 83 tafsir, 6,236 ayahs each, verified |
| Quran adapter | Written, typechecks, **43/43 live tests pass**. Not wired to any screen |
| Hadith Worker endpoints | **Do not exist.** Specified in §4 |
| Hadith today | jsDelivr (`fawazahmed0/hadith-api@1`) for collections; `api.islamic.app` for the daily hadith |
| Unpushed commits | `fa6fba4` (sheet overlay fix), `35f267b` (Quran adapter) |

---

## 2. Quran — implementation requirements

### R1. Keep two providers, do not replace one

`api.alquran.cloud` keeps supplying: Arabic script (`quran-uthmani`), `page`,
`juz`, `hizbQuarter`, the chapter list, search, and audio. The Worker supplies
translation and Tafsir text only.

*Why:* the Worker has zero Arabic editions and no structural fields. Verified:
0 editions with `language: "ar"`; per-surah responses return `nameSimple`,
`nameArabic`, `nameEnglish` and `revelationPlace` as empty strings.

### R2. The adapter never produces a `Verse`

It returns `TranslationRow { verseKey, numberInSurah, globalNumber, text, words? }`.
`mergeTranslations(verses, rows)` joins text onto verses from the other provider,
leaving `text_uthmani`, `page`, `juz` and `hizbQuarter` untouched.

*Acceptance:* merging a 7-row surah 1 onto alquran.cloud verses yields rows with
correct `text_uthmani` **and** correct `translation`, and `page`/`juz` unchanged.
(Test 10.)

### R3. Edition identity needs its own preference field

`preferences.translationEdition` currently holds an alquran.cloud identifier
(`en.sahih`). Worker IDs are opaque hashes (`b06.translation.57df29716a55f6aa1f17`).
Storing both in one field will silently send the wrong ID to the wrong host.

**Required change to `QuranPreferences`** (`src/services/quranState.ts`):

```ts
translationSource: 'alquran' | 'islamic-data';   // default 'alquran'
islamicDataTranslationId: string | null;         // opaque Worker id
islamicDataTafsirId: string | null;              // opaque Worker id
```

Migration: existing installs keep `translationEdition` and get
`translationSource: 'alquran'`. Defaults are unchanged, so nobody's current
translation moves under them.

### R4. Pickers must show `variant`

One work appears as up to four separate editions, one per `variant`, each with
its own ID. `en-sahih-international` exists four times; so do
`bridges-translation`, `al-hasan-efendi` and `tafsir-e-usmani`. Across the
catalog, **134 of 307** quran editions are duplicates by name+language.

*Requirement:* every edition row shows `editionSubtitle(edition)` — language plus
`variantLabel(variant)`. A picker showing only the name lists Sahih International
four times and looks broken.

### R5. Never display `author`

`author` is `null` on **all 390** editions, `authorSource` too. Build attribution
from language + variant. Do not add an "unknown" placeholder — it would fill the
UI with noise.

### R6. Treat `language` as a hint, never a sole filter

Ten editions carry the wrong code. The Mokhtasar Tafsir series is systematically
mislabelled:

| edition | tagged | actually |
|---|---|---|
| `pashto-mokhtasar` | `ur` | Pashto |
| `kurdish-mokhtasar` | `ur` | Kurdish |
| `persian-mokhtasar` | `ur` | Persian |
| `uzbek-mokhtasar` | `ru` | Uzbek |
| `serbian-mokhtasar` | `ru` | Serbian |
| `vietnamese-mokhtasar` | `es` | Vietnamese |
| `bosnian-mokhtasar` | `pt` | Bosnian |
| `tagalog-mokhtasar` | `sw` | Tagalog |
| `maududi-roman-urdu` | `en` | romanised Urdu |
| `indonesian-word-by-word-translation` | `ms` | Indonesian |

*Requirement:* let the user browse by language, but always show the edition name
alongside, and never assume a language filter is exhaustive.

### R7. Tafsir & Compare changes shape

Today: `getAyahEditions(verseKey, ids)` → one request for three editions of one
verse.

The Worker has no per-ayah route, so it becomes **one surah per edition**:

```ts
const [a, b, c] = await Promise.all(ids.map((id) => getSurah('tafsir', id, surahNumber)));
const rowFor = (s) => s.rows.find((r) => r.verseKey === verseKey);
```

*Requirement:* fetch only the surah in view, and let the cache absorb the cost.
Cold, this is three surah fetches — show a loading state rather than blocking the
screen.

### R8. Prettify names; never invent translators

Catalog `name` values are slugs: `urud`, `de-bubenheim`, `ro-grigore`, and some
admit ignorance — `mrn-unknown`, `dv-unknow`, `bs-unknown`.
`editionDisplayName()` capitalises and strips the trailing `unknown`, but the
result stays honest (it does not guess a language name).

### R9. `languageName` needs a fallback

Quran editions return `"English"`; Tafsir editions return `"en"`.
`languageName(edition)` returns the uppercased code when the two match, so the UI
never shows a user their own locale string.

### R10. Handle the Worker's two HTTP quirks

- Catalog routes answer a plain `GET` with **`206 Partial Content`** carrying the
  whole body. The adapter accepts 200 and 206. Any new client must too.
- **`304` is a real answer.** The adapter sends `If-None-Match` when it holds an
  ETag and reuses the cached body on 304. Health and manifest ask
  unconditionally, because a health check answerable "unchanged" has stopped
  being a health check.

### R11. Validation is mandatory, in this order

`schemaVersion === 1` → `category` matches → `edition.id` matches the request →
`surah.number` matches → `ayahs` is a non-empty array → `numberInSurah` is
sequential from 1 → `versesCount` equals the array length → every row has
non-empty text.

Failure means: return the cached copy if there is one, otherwise throw. **Never
write an unvalidated payload.**

### R12. Caching budget

Cache key: `category + editionId + surahNumber + dataVersion`. The data version is
persisted and learned from the `x-data-version` response header, so `/health`
runs at most once per session.

Existing `contentCache` limits (native / web): quran 120 / 32 MB, tafsir 35 / 8 MB,
hadith 60 / 26 MB, total 240 / 72 MB. One surah of translation is ~2–8 KB, so
caching all 114 surahs of one edition costs roughly 300 KB — comfortably inside
budget. Caching many editions is not: budget for it in Downloads.

---

## 3. Quran — the five connection points

| # | Place | What changes |
|---|---|---|
| 1 | Reader | Fetch rows for `preferences.islamicDataTranslationId`, merge onto `getVerses()` |
| 2 | Tafsir & Compare | One surah per edition; pick the row by `verseKey` |
| 3 | Edition pickers | `toEditionChoices()`; always show variant; separate translation and tafsir lists |
| 4 | Offline / Downloads | Already works — the adapter uses the `quran`/`tafsir` namespaces |
| 5 | Diagnostics | `runRolloutGate()` on the data-sources screen |

Sequencing matters: do **1 → 3 → 2 → 5**. Point 2 is the largest change and the
least visible win, so it should come after the Reader works.

---

## 4. Hadith — the API to build on the Worker

### 4.1 What exists today, and why it is fragile

Two providers, neither yours:

- **Collections:** `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-{slug}.min.json`
  and `ara-{slug}.min.json`. Ten collections. Fetched whole, merged in memory.
- **Daily hadith:** `https://api.islamic.app/v1/hadith/today/bukhari`.

Risks, measured:

| Risk | Evidence |
|---|---|
| Whole-collection fetches | Bukhari English alone is **4.6 MB**; with Arabic, **13.6 MB** |
| Total payload is large | **36,512 hadith**, 21.4 MB English + 42.4 MB Arabic ≈ **63.8 MB** |
| Exceeds the cache budget | Bilingual total (63.8 MB) is over the native hadith limit (60 MB) |
| No versioning | jsDelivr `@1` floats; content can change with no signal to the app |
| Third-party uptime | Two extra services in the critical path for the daily hadith |
| Arabic arrives late | Separate second fetch; UI shows English first, Arabic when it lands |

### 4.2 The shape of the data

Per-book sizes decide the endpoint design. Largest book in each collection:

| Collection | Hadith | Books | Largest book | Bilingual size of largest |
|---|---|---|---|---|
| Bukhari | 7,589 | 98 | 499 | 1.04 MB |
| Muslim | 7,563 | 57 | 583 | 0.88 MB |
| Abu Dawud | 5,274 | 43 | 770 | **1.28 MB** |
| Tirmidhi | 3,998 | 49 | 424 | 1.12 MB |
| Nasai | 5,765 | 52 | 467 | 0.66 MB |
| Ibn Majah | 4,343 | 38 | 630 | 0.94 MB |
| Malik | 1,858 | 62 | 251 | 0.39 MB |
| Nawawi | 42 | 2 | — | tiny |
| Qudsi | 40 | 2 | — | tiny |
| Dehlawi | 40 | 2 | — | tiny |

**A whole book is too big to fetch.** A whole collection is far worse. Books must
be paginated. Measured on the worst case (Abu Dawud, 770 hadiths, 1.28 MB
bilingual): a page of 50 is **~83 KB**, a page of 100 is **~166 KB**.

### 4.3 Endpoints to build

Base: `https://api.islamicdata.uz/v1`. All GET. Mirror the Quran envelope:
`schemaVersion`, `category`, then the payload.

```http
GET /hadith/collections
GET /hadith/collections/{slug}
GET /hadith/collections/{slug}/books/{bookNumber}?limit=50&offset=0
GET /hadith/collections/{slug}/hadith/{hadithNumber}
GET /hadith/search?q={query}&collection={slug}&limit=40
GET /hadith/daily
```

**`GET /hadith/collections`** — the catalog.

```json
{
  "schemaVersion": 1,
  "category": "hadith",
  "collections": [
    {
      "slug": "bukhari",
      "name": "Sahih al-Bukhari",
      "arabicName": "صحيح البخاري",
      "author": "Imam al-Bukhari",
      "kind": "Sahih",
      "graded": false,
      "bookCount": 98,
      "hadithCount": 7589,
      "languages": ["en", "ar"],
      "complete": true
    }
  ]
}
```

**`GET /hadith/collections/{slug}`** — metadata only, no hadith. This is the
screen-first request: it is small enough to fetch on open.

```json
{
  "schemaVersion": 1,
  "category": "hadith",
  "collection": { "slug": "bukhari", "name": "Sahih al-Bukhari", "arabicName": "صحيح البخاري",
                  "author": "Imam al-Bukhari", "kind": "Sahih", "graded": false },
  "books": [
    { "number": 1, "name": "Revelation", "arabicName": "كتاب بدء الوحى",
      "first": 1, "last": 7, "count": 7 }
  ],
  "counts": { "hadiths": 7589, "books": 98 }
}
```

**`GET /hadith/collections/{slug}/books/{n}?limit&offset`** — one page of one book,
**bilingual in a single response**. Arabic must not be a second round trip; that
is the main improvement over today.

```json
{
  "schemaVersion": 1,
  "category": "hadith",
  "collection": { "slug": "bukhari", "name": "Sahih al-Bukhari", "arabicName": "صحيح البخاري", "graded": false },
  "book": { "number": 1, "name": "Revelation", "arabicName": "كتاب بدء الوحى", "first": 1, "last": 7, "count": 7 },
  "hadiths": [
    {
      "number": 1,
      "arabicNumber": 1,
      "book": 1,
      "arabic": "حَدَّثَنَا الْحُمَيْدِيُّ...",
      "text": "Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger...",
      "grades": [{ "name": "Al-Albani", "grade": "Sahih" }]
    }
  ],
  "page": { "offset": 0, "limit": 50, "total": 7, "hasMore": false }
}
```

`grades` is `[]` for Bukhari, Muslim, Nawawi, Qudsi and Dehlawi — the source has
no grades for those. It is populated for Abu Dawud (5,274), Tirmidhi (3,954),
Nasai (5,758), Ibn Majah (4,341) and Malik (1,858).

**`GET /hadith/collections/{slug}/hadith/{n}`** — a single hadith, bilingual. Used
by deep links, saved items and the daily hadith.

**`GET /hadith/daily`** — deterministic. Pick the hadith from the date so the
result is stable, cacheable and identical for every user that day:

```
index = FNV1a32(dateString) % bukhariCount
```

```json
{
  "schemaVersion": 1,
  "category": "hadith",
  "date": "2026-10-29",
  "collection": { "slug": "bukhari", "name": "Sahih al-Bukhari" },
  "hadith": { "number": 1, "arabicNumber": 1, "arabic": "...", "text": "...", "grades": [] }
}
```

Making it deterministic removes a round trip, makes it cacheable for the whole
day, and means the app stops depending on `api.islamic.app` staying up.

**`GET /hadith/search`** — optional, but worth it. Today `searchLoadedCollections`
can only search collections already in memory (3 at a time). A server-side search
across all 36,512 hadith is a genuine improvement. Support `?collection=` to
scope it.

### 4.4 Requirements for the Worker

| # | Requirement |
|---|---|
| H1 | Bilingual in one response — Arabic and English in the same hadith object |
| H2 | Paginate books: `limit` default 50, max 100; always return `page.total` and `page.hasMore` |
| H3 | Immutable snapshot objects with `ETag` and `x-data-version`, exactly like the Quran objects |
| H4 | `Cache-Control: public, max-age=31536000, immutable` on hadith pages |
| H5 | CORS: `Access-Control-Allow-Origin` echo, preflight `204`, `Allow-Headers: If-None-Match, Range, Content-Type` (do **not** add `User-Agent` — see §6) |
| H6 | Errors in the same envelope: `{"error":{"code":404,"message":"..."}}`. Codes 400 / 404 / 405 / 503 |
| H7 | Serve `200` for unconditional GETs. The Quran catalog routes return `206` — do not copy that |
| H8 | Preserve `arabicNumber`, `book`, `grades[]` and `arabicName` — the app uses all four |
| H9 | Keep the ten slugs identical to `HADITH_COLLECTIONS` so no mapping table is needed |
| H10 | `complete: true` only when the collection has its full hadith count and both languages |

### 4.5 Data quality to fix while building it

- **Grade completeness.** Bukhari and Muslim have **no grades at all** in the
  source. The app shows `grades[0].grade` when present. Either leave it absent or
  add grades from a licensed source — do not fabricate.
- **Book names.** Source `metadata.sections` gives English names only. The app
  falls back to `Book {n}`. If you can add `arabicName`, do.
- **Numbering.** `hadithnumber` (the global number used for ordering and
  `arabicnumber` (the printed number) are different for some collections. Both
  must be returned; the app displays `arabicNumber` and sorts by `number`.

---

## 5. App-side Hadith implementation

### 5.1 New service

`src/services/hadithWorkerApi.ts`, mirroring `islamicDataApi.ts`:

```ts
getHadithCollections(): Promise<HadithApiCollection[]>
getHadithCollection(slug): Promise<HadithApiCollectionMeta>
getHadithBook(slug, book, {limit, offset}): Promise<HadithApiBookPage>
getHadith(slug, number): Promise<HadithApiHadith>
getDailyHadith(date?): Promise<HadithApiDaily>
searchHadith(query, options): Promise<HadithApiHadith[]>
```

Same rules as the Quran adapter: validate before caching, never displace good
cache, one retry on transient failure only, `AbortController` timeout, ETag/304.

### 5.2 Validation rules (H-analogue of R11)

`schemaVersion === 1` → `category === "hadith"` → `collection.slug` matches the
request → `book.number` matches → `hadiths` is an array → every hadith has a
numeric `number` and at least one of `text` / `arabic` non-empty → `number` values
are strictly increasing within a page → `page.total` is consistent with
`page.hasMore` and the returned count.

### 5.3 Mapping

Keep `Hadith` as the app type so no screen changes:

```ts
{
  id: `${slug}:${number}`, slug, number, arabicNumber,
  book, bookName, english: text, arabic, grades
}
```

### 5.4 What changes in `hadithService.ts`

`loadHadithCollection(slug)` currently fetches and merges whole collections into
memory (`MEMORY_LIMIT = 3`). Replace with:

1. `getHadithCollection(slug)` for metadata — small, safe to fetch on open.
2. `getHadithBook(slug, book, {limit, offset})` on demand, appended to a
   paged store.
3. Keep the in-memory collection cache as a view over cached book pages.

`hydrateHadithArabic` disappears entirely — H1 makes Arabic part of the same
response, which removes the second fetch and the `arabicReady` two-phase UI.

### 5.5 Fallback during migration

Until the Worker is up, keep jsDelivr as the source. Structure the service so the
source is a switch, then flip it once the Hadith gate passes:

```
EXPO_PUBLIC_HADITH_API_BASE_URL=https://api.islamicdata.uz/v1
```

---

## 6. Cross-cutting requirements

### X1. Do not set a custom `User-Agent`

Browsers forbid setting it (silently dropped), and the Worker's
`Access-Control-Allow-Headers` is `If-None-Match, Range, Content-Type`. Adding one
risks breaking preflight in the web build for no gain: every realistic mobile UA
already returns 200.

*Testing note:* a `Python-urllib/3.x` UA gets **403, Cloudflare error 1010**. That
is a false alarm for the app — but it will bite any script you write.

### X2. Every fetch goes through `contentCache`

That is what Downloads and offline mode read. Bypassing it means content silently
disappears offline.

### X3. Never show a blank screen after a failed request

If valid data is cached, show it. The Quran adapter already does this; the Hadith
service must too.

### X4. Correction reports stay local

`CorrectionSheet` writes to local storage and mail. No Worker endpoint needed for
either Quran or Hadith.

### X5. Diagnostics

`runRolloutGate()` exists for Quran. Add the Hadith equivalent. Both belong on the
data-sources screen with `dataVersion` and snapshot date visible.

---

## 7. Phasing

**Phase 1 — Quran, visible value first**
1. Add `translationSource` + Worker id fields to `QuranPreferences` (R3).
2. Wire the Reader (point 1) behind those fields.
3. Build the edition picker with variants (points 3, R4–R9).
4. Ship. Nothing changes for anyone on the default translation.

**Phase 2 — Quran, the rest**
5. Tafsir & Compare on Worker editions (point 2, R7).
6. `runRolloutGate()` on the diagnostics screen (point 5).
7. Downloads accounting for cached editions.

**Phase 3 — Hadith**
8. Build the Worker endpoints (§4.3–4.4).
9. Run the Hadith gate (§8).
10. Write `hadithWorkerApi.ts` (§5.1–5.3).
11. Flip `hadithService` to the Worker, keeping jsDelivr as fallback (§5.5).
12. Delete `hydrateHadithArabic` — no longer needed once H1 lands.

Phase 1 and Phase 3's step 8 are independent and can run in parallel.

---

## 8. Hadith rollout gate

Ship when all of these pass. They mirror the Quran gate that already runs green.

| Gate | Pass condition |
|---|---|
| `/health` | `ok: true`, expected `dataVersion` |
| `/hadith/collections` | 10 collections, all `complete: true` |
| `/hadith/collections/bukhari` | 98 books, `hadithCount` 7,589 |
| Counts match the source | Bukhari 7,589 · Muslim 7,563 · Abu Dawud 5,274 · Tirmidhi 3,998 · Nasai 5,765 · Ibn Majah 4,343 · Malik 1,858 · Nawawi 42 · Qudsi 40 · Dehlawi 40 |
| One small collection end to end | Nawawi: 42 hadith, both languages, all numbered |
| One large book paginated | Abu Dawud book with 770 hadith pages cleanly; last page `hasMore: false` |
| Bilingual in one response | Every hadith carries non-empty `arabic` **and** `text` |
| Grades | Abu Dawud/Tirmidhi/Nasai/Ibn Majah/Malik carry grades; Bukhari/Muslim return `[]` |
| Single hadith | `/hadith/bukhari/hadith/1` returns both languages |
| Daily determinism | Same date returns the same hadith across calls and cache clears |
| Search (if built) | A known phrase returns the expected hadith |
| Missing collection / book / hadith | `404` in the error envelope |
| Invalid book (0, 999, `abc`) | `400` |
| ETag / 304 | `If-None-Match` → `304`, 0 bytes |
| Page size guard | `limit=1000` clamps to 100 rather than erroring |
| Largest page under budget | Worst page ≤ ~200 KB |
| CORS preflight | `204` with the three allowed headers |
| Mobile User-Agents | iOS `CFNetwork`, Android `okhttp` both `200` |

---

## 9. Open questions

1. **More collections?** The app ships 10. If you want Ahmad, Darimi or Bayhaqi,
   the catalog is the place to add them — but confirm licensing and completeness
   first (H10).
2. **Grades for Bukhari and Muslim.** Absent in the source. Add from a licensed
   source, or leave absent? Fabricating is not an option.
3. **Arabic book names.** Available in some sources. Worth adding to the Worker,
   or keep the `Book {n}` fallback?
4. **Search across all collections.** Genuinely useful, but needs an index. Build
   it, or keep search scoped to downloaded collections?
5. **Hadith audio.** Not currently in the app and not in the Worker. Out of scope
   unless you want it.

---

## Appendix — reference

| Item | Value |
|---|---|
| Quran Worker | `https://api.islamicdata.uz/v1` |
| Quran env var | `EXPO_PUBLIC_QURAN_API_BASE_URL` |
| Hadith env var (proposed) | `EXPO_PUBLIC_HADITH_API_BASE_URL` |
| Quran adapter | `src/services/islamicDataApi.ts` |
| Quran tests | `probes/adapter.test.js` — 43/43 live |
| Quran audit | `QURAN_API_AUDIT.md` |
| Quran wiring guide | `QURAN_API_INTEGRATION.md` |
| Hadith source today | `cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions` |
| Daily hadith today | `api.islamic.app/v1/hadith/today/bukhari` |
| Cache limits (native) | quran 120 MB · tafsir 35 MB · hadith 60 MB · total 240 MB |
| Cache limits (web) | quran 32 MB · tafsir 8 MB · hadith 26 MB · total 72 MB |
