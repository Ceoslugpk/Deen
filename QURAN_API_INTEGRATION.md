# Wiring the Islamic Data adapter into the app

The adapter is `src/services/islamicDataApi.ts`. It is written and tested, but
**deliberately not wired into any screen yet** — nothing changes in the app until
you choose to. This note is the map of the places it would connect.

## What it is

A second provider, beside `api.alquran.cloud`. It supplies **translation and
Tafsir text only**. It has no Arabic, no page/juz/hizb, no chapters, no audio, no
search — so it never produces a `Verse`. It produces `TranslationRow`s and joins
them onto verses that came from the provider that does know the structure.

```ts
import { getEditions, getSurah, mergeTranslations } from './src/services/islamicDataApi';

const rows = (await getSurah('quran', editionId, surahNumber)).rows;
const verses = mergeTranslations(await getVerses(surahNumber), rows);
// verses keep their text_uthmani, page, juz, hizbQuarter — and gain .translation
```

## Configuration

```
EXPO_PUBLIC_QURAN_API_BASE_URL=https://api.islamicdata.uz/v1
```

Read at build time by Metro (static inlining — the literal must stay literal).
If unset, the adapter falls back to that same URL, so it works today with no
`.env` at all.

## The five connection points

### 1. Reader — a second translation source

`src/services/api.ts` `getVerses()` fetches script + translation together from
alquran.cloud. To use an Islamic Data edition instead, fetch its rows and merge:

```ts
const verses  = await getVerses(chapterId, { script, translation });
const cloud   = await getSurah('quran', islamicDataEditionId, chapterId);
const merged  = mergeTranslations(verses, cloud.rows);
```

`preferences.translationEdition` currently holds an alquran.cloud identifier
(`en.sahih`). Islamic Data IDs are opaque (`b06.translation.57df2971…`), so they
need their own preference field — say `translationEditionSource: 'alquran' |
'islamic-data'` plus the id — otherwise the two schemes will be confused.

### 2. Tafsir & Compare screen

Today: `getAyahEditions(verseKey, [id1, id2, id3])` hits
`/ayah/{key}/editions/{…}` — one request for three editions of one verse.

The Worker has no per-ayah route, so this becomes **one surah per edition**:

```ts
const [a, b, c] = await Promise.all(ids.map((id) => getSurah('tafsir', id, surahNumber)));
const rowFor = (s: CachedSurah) => s.rows.find((r) => r.verseKey === verseKey);
```

Cheap after the first time — each surah is cached. But it does mean opening that
screen cold can pull three surahs, so it is worth doing only for the surah in view.

### 3. Edition pickers

Use `toEditionChoices(editions)` — it sorts by language, then name, then variant.

**Always show `variantLabel(edition.variant)`.** One work appears up to four
times, once per variant: `en-sahih-international` exists as plain, grouped,
footnotes and notes-in-text, with four different IDs. A picker that shows only
the name lists it four times and looks broken.

Do not show `author` — it is `null` on all 390 editions. `editionSubtitle()`
gives you "English · Plain text" instead.

### 4. Offline / Downloads

`getSurah()` and `getEditions()` already read and write through
`contentCache` under the existing `'quran'` and `'tafsir'` namespaces, so they
participate in the offline cache and the Downloads accounting with no extra work.

### 5. Diagnostics

`runRolloutGate()` returns `{check, passed, detail}[]` — handy on a data-sources
screen. `clearIslamicDataCache(category?)` empties it.

## Behaviour you get for free

| Behaviour | Detail |
|---|---|
| Validation | schemaVersion, category, edition.id, surah.number, non-empty ayahs, sequential `numberInSurah`, `versesCount` match, non-empty text |
| Bad payload | Never written over good cache; the cached copy is returned instead |
| Failures | Fall back to cache on timeout / network / 404 / 503 / invalid |
| Retries | One, and only for timeout / network / 503 |
| Conditional GET | `If-None-Match` sent when we hold an ETag; `304` reuses the cached body |
| 206 quirk | Accepted as success — the catalog routes answer a plain GET with 206 |
| Cache keys | `category + editionId + surahNumber + dataVersion` |
| Data version | Persisted and learned from response headers, so `/health` runs at most once |
| Timeouts | `AbortController`, 12 s |

## Known limits (see QURAN_API_AUDIT.md)

- No Arabic, no `page`/`juz`/`hizbQuarter`, no chapters, no search, no audio.
- `author` is `null` everywhere.
- 10 editions carry a wrong `language` code (the Mokhtasar series) — treat
  `language` as a hint, never as the sole filter.
- `name` is a slug; `editionDisplayName()` tidies it.
- Tafsir `languageName` returns the raw code (`"en"`); `languageName()` handles it.

## Testing

```
NODE_PATH=/tmp/ida3/node_modules node probes/adapter.test.js
```

43 assertions against the **live** API — no mocks. Coverage claim, validation,
bad input, 404, cache-isolation, word-by-word, display helpers, merge, and the
rollout gate.
