# Data sources

Every external source the app uses, and every source it could use, with the
result of a live check against each.

This is a record, not a registry: the **Data sources** screen keeps its own
list in `App.tsx` (`DATA_SOURCES`). A machine-readable version used to live in
`src/services/sources.ts`, but the screen stopped reading it and the two
drifted, so it was removed. When a source's status changes, update the screen
and this note together.

**Last verified: 2026-10-28.** 28 sources: **20 live**, **7 available but not
wired**, **1 broken**.

`probe` is the exact URL that was requested. A source is only marked **live**
when that request answered 200.

## Quran

| Source | Endpoint | Status |
|---|---|---|
| AlQuran Cloud | `api.alquran.cloud/v1/surah` | live |
| Quran JSON (fallback Arabic text) | `quran-json.risanb.com/text/hafs-nastaliq/chapters/1.json` | live |
| Quran.com API v4 | `api.quran.com/api/v4/chapters/1` | not wired |
| QuranHub (tajweed script) | `quranhub.io` | not wired |

## Tafsir

| Source | Endpoint | Status |
|---|---|---|
| spa5k Tafsir API via jsDelivr | `cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/1.json` | not wired |

123 editions, including Ibn Kathir, Jalalayn, As-Sa'di, Tabari, Qurtubi,
Baghawi and Muyassar across Arabic, English, Urdu and Bengali.

> The English Ibn Kathir slug is misspelled upstream: `en-tafisr-ibn-kathir`,
> not `en-tafsir`. Arabic slugs use the correct spelling
> (`ar-tafsir-muyassar`, `ar-tafsir-ibn-kathir`). Guessing slugs 404s — read
> them from the repository listing.

## Hadith

| Source | Endpoint | Status |
|---|---|---|
| Islamic.app — hadith of the day | `api.islamic.app/v1/hadith/today/bukhari` | live |
| fawazahmed0 hadith-api via jsDelivr | `cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json` | live |
| Sunnah.com (citation links) | `sunnah.com/bukhari:1` | live |

Collection files are `editions/{lang}-{collection}.min.json`. The bare
`editions` directory returns 404 — it is not an index.

## Names, dhikr, prayer, location

| Source | Endpoint | Status |
|---|---|---|
| Islamic.app — Asma al-Husna | `api.islamic.app/v1/asma-al-husna` | live |
| Islamic.app — adhkar | `api.islamic.app/v1/dhikr` | live |
| Islamic.app — qibla | `api.islamic.app/v1/qibla/{lat}/{lng}` | live |
| Islamic.app — nearby mosques | `api.islamic.app/v1/masajid/near` | live |
| AlAdhan — prayer times | `api.aladhan.com/v1/timings` | live |
| AlAdhan — Hijri calendar | `api.aladhan.com/v1/hijriCalendar/{y}/{m}` | live |
| Nominatim (reverse geocoding) | `nominatim.openstreetmap.org/reverse` | not wired |
| EsmaulHusna.org (Names audio) | `esmaulhusna.org` | not wired |
| Overpass (places of worship) | `overpass-api.de/api/interpreter` | **broken** |

## Audio

| Source | Endpoint | Status |
|---|---|---|
| Islamic.network CDN | `cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3` | live |
| MP3Quran (reciter directory) | `www.mp3quran.net/api/v3/reciters` | live |
| Internet Archive (adhan) | `archive.org/download/adhan.recordings...` | live |
| EveryAyah (translation audio) | `everyayah.com/data/...` | not wired |
| Adhan recordings on GitHub | `github.com/kiwifu/adhan-mp3` | not wired |

## Live, finance, reference

| Source | Endpoint | Status |
|---|---|---|
| Makkah Live | `makkahlive.net` | live |
| YouTube official channels | `youtube.com/@alharamain_sa` | live |
| Gold API | `api.gold-api.com/price/XAU` | live |
| Exchange Rate API | `open.er-api.com/v6/latest/USD` | live |
| Quran.com (verse links) | `quran.com/1` | live |
| Corpus Quran (grammar) | `corpus.quran.com/lemmas.jsp` | live |

## Where reality differs from the brief

Three corrections worth knowing, because they contradict the summary this
registry was built from:

- **Prayer times come from AlAdhan, not Islamic.app.** AlAdhan resolves the
  timezone from the coordinates, which Islamic.app does not.
- **Mosques come from Islamic.app `/masajid/near`, not Overpass.** Overpass was
  checked on three mirrors and all three failed, so it is recorded as broken
  rather than available.
- **Adhan audio is served from archive.org, not the GitHub Kiwifu
  repository.** Both work; only archive.org is wired.

## Re-verifying

Re-run a GET against each `probe` URL and update `status` plus
`SOURCES_VERIFIED_ON`. Sources drift — an endpoint that answered 200 in
October is not guaranteed to answer in March.
