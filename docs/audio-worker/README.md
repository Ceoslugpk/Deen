# Quran Content Worker

A separate Cloudflare Worker for Quran translations and recitation audio, using AlQuran Cloud and UmmahAPI. It does not modify or share routes with the existing Islamic Data Worker and has no R2 binding.

## Status

- Deployed Worker script: `audio` at `https://audio.islamicdata.uz`.
- Active Worker version: `d34c0b2e-9e10-4219-b225-c96b3feba20b`.
- `UMMAHAPI_API_KEY` is configured as a Cloudflare secret binding; its value is not in source, Wrangler config, docs, or tests.
- AlQuran Cloud supplies the translation catalog, Arabic recitations, and its available translation-audio editions. UmmahAPI supplies written translations, reciter metadata, and ayah/full-surah recitation URLs.
- The Worker streams audio and proxies JSON; it does not store or download Quran data.
- The owner reports provider authorization for reproduction/reuse. Edition, translator, and reciter attribution is preserved; provider notes are recorded in the API guide.
- The optional UmmahAPI key is read only from the Cloudflare secret binding `UMMAHAPI_API_KEY`; its value is not in source, Wrangler config, docs, or tests.

UmmahAPI audio is Arabic recitation, not spoken translation audio. The Worker rewrites only its known audio hosts (EveryAyah, Quranicaudio, MP3Quran) to same-origin streaming routes.

## Local setup

Requires Node.js 18+ and Wrangler 3.114.17.

```bash
npm ci
npm test
npm run dev
```

Local base URL: `http://127.0.0.1:8787/v1`.

## Main routes

- `GET /translations/editions` — translation-only catalog
- `GET /translations/ayahs/{surah}/{ayah}/{edition}`
- `GET /translations/surahs/{surah}/{edition}`
- `GET /audio/editions` — audio edition catalog
- `GET /audio/ayahs/{surah}/{ayah}/{edition}` — verse-by-verse editions
- `GET /audio/surahs/{surah}/{edition}` — surah metadata/audio links
- `GET /audio/media/{audio|audio-surah}/{bitrate}/{edition}/{asset}.mp3` — streamed MP3; supports Range
- `GET /ummahapi/quran` — UmmahAPI catalog/overview
- `GET /ummahapi/quran/reciters`
- `GET /ummahapi/quran/surahs/{surah}?translation=...&script=...&reciter=...` — Arabic text and selected written translation; query keys are allowlisted
- `GET /ummahapi/quran/audio/{surah}` and `/ummahapi/quran/audio/{surah}/{ayah}` — full-surah and ayah recitation links
- `/ummahapi/audio/media/...` — same-origin streamed MP3; supports Range

See [`docs/API.md`](docs/API.md) and [`docs/openapi.yaml`](docs/openapi.yaml) for full behavior.

## Checks

```bash
npm test
npm run dry-run
```

`npm run dry-run` bundles the current source without publishing it. Production is deployed at `audio.islamicdata.uz`; the existing `api.islamicdata.uz` Worker was not changed. Wrangler 3.114.17 warns that it is out-of-date; local runtime fell back to compatibility date `2025-07-18` for testing.
