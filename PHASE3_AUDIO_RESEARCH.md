# Phase 3 research — Quran audio, and how the audio centre should be organised

Verified live on 26 October 2026. Every endpoint below was called from this workspace and returned HTTP 200 with `access-control-allow-origin: *`, so the web build can call them directly without a proxy.

## Audio providers evaluated

| Provider | Granularity | Catalogue size | Verified | Verdict |
| --- | --- | --- | --- | --- |
| Al Quran Cloud audio editions (`/edition/format/audio`) | per ayah | 190 editions — 176 Arabic, 14 translation | `surah/1/ar.alafasy` returns `https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3` per ayah | Primary source for verse-by-verse recitation |
| Islamic Network CDN | files | — | `206 Partial Content` observed during playback | Delivery host used by Al Quran Cloud ayah records |
| MP3Quran API v3 (`/reciters?language=eng`) | whole Surah | 243 reciters | `https://cdn.mp3quran.net/audio/ibrahim-akhdar/r1/001.mp3` returned 200 | Primary source for continuous full-Surah recitation |
| Quran Foundation (`/resources/recitations`) | ayah by ayah | 12 recitations | reachable, but a much smaller catalogue and a different ID space | Not needed |
| EveryAyah (`everyayah.com/data/...`) | per ayah | large, but no catalogue API | not used | No machine-readable reciter list, so it cannot be attributed cleanly |

## Decisions taken from the research

1. **Two honest recitation modes instead of one fake-unified list.**
   Al Quran Cloud publishes which editions are `versebyverse` (24) and which are `surahbysurah` (148). The `surahbysurah` editions return `audio: null` per ayah, so pretending they support verse playback would produce dead tracks. The app therefore exposes:
   - **Verse by verse** — Arabic editions that actually return per-ayah URLs (28 after including four Arabic editions the API mislabels as `translation`).
   - **Full Surah** — the MP3Quran directory (243 reciters with a complete 114-Surah mushaf), played as one continuous track per Surah.
   Both modes are labelled with their source in the interface.

2. **Translation audio is limited to what the source publishes.**
   Al Quran Cloud offers translation audio for English, Urdu, Chinese, French, Russian, Kazakh, Turkish, Persian, Uzbek and Burmese. The product specification also asks for Azerbaijani and Bosnian; those do not exist in any keyless source, so they are simply absent rather than faked.

3. **No reciter-country data is displayed.**
   Neither Al Quran Cloud nor MP3Quran publishes a country field. Rather than inventing nationalities, the app shows what the sources do provide — riwayah, mushaf name and Surah coverage.

4. **Playback is queue-based, not a single long file.**
   Verse mode builds one track per ayah with optional translation segments interleaved (`Arabic → translation`), which is what makes ayah-level seeking, repeat-one, the reader controls and resume-by-verse possible.

5. **Persistence stays small.**
   Recents (24), playlists (12 × 300 tracks) and settings are stored locally. Audio files themselves are never cached in AsyncStorage; ayah URL maps are cached in the existing bounded `audio-meta` cache namespace.

## Interface structure

- **Listen entry points** — a *Listen* button on the Quran hero, a *Listen and recite* card on the Quran home that names the current reciter, a Library card, and per-verse plus per-Surah controls in the reader.
- **Audio centre** — continue-listening card, now-playing shortcut, four tabs (Reciters, Translation, Surahs, Saved), a recitation-source switch, and attribution.
- **Global mini player** — rendered above the tab bar on every screen, with the page container reserving space so nothing is obscured.
- **Full player** — artwork, Arabic text of the current ayah, drag-to-seek bar, previous/play/next, repeat off/one/all, speed, stop, queue with selection and removal, and save-queue-as-playlist.

## Icons

Thirty-one icons were missing and were silently rendering as the generic fallback glyph (pause, stop, close, trash, add, remove, list, repeat, save, copy, share, eye, create, checkmark circle, volume, speedometer, musical notes, heart, person, star and others). All were drawn as real SVGs in the shared restrained palette, so the fallback glyph is no longer visible anywhere.

## Hadith source research (added with the Hadith module)

The community hadith-api corpus (`cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1`) is the only keyless source that pairs Arabic and English editions for the major collections. Measured on 26 October 2026:

| Collection | English minified | Hadith | Books | Graded |
| --- | --- | --- | --- | --- |
| Sahih al-Bukhari | 4.7 MB | 7,589 | 98 | no |
| Sahih Muslim | 3.8 MB | 7,563 | 57 | no |
| Sunan Abu Dawud | 3.5 MB | 5,274 | 44 | yes (Al-Albani) |
| Sunan an-Nasa'i | 3.2 MB | 5,765 | 52 | yes |
| Sunan Ibn Majah | 2.5 MB | 4,343 | 38 | yes |
| Jami' at-Tirmidhi | 2.5 MB | 3,998 | 50 | yes |
| Muwatta Malik | 1.4 MB | 1,858 | 62 | yes |
| Forty Hadith of an-Nawawi | 33 KB | 42 | 2 | no |
| Forty Hadith Qudsi | 38 KB | 40 | 2 | no |
| Forty Hadith of Shah Waliullah | 5 KB | 40 | 2 | no |

The Arabic editions are roughly twice the size of the English ones, which drove two decisions:

1. **English first, Arabic hydrated in the background.** Waiting for both languages before rendering would mean a 14 MB download before the first hadith appears. The list is interactive in about two seconds and the Arabic text fills in as it arrives.
2. **The cache limit for the hadith namespace was raised** (26 MB on web, 60 MB native) so a merged Arabic-English collection can survive a reload; least-recently-used collections still evict each other.

Verified in the browser: with `cdn.jsdelivr.net` blocked, a previously opened collection reloads complete with Arabic text, which is the offline fallback the specification asks for.
