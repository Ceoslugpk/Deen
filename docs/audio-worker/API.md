# Quran Content Worker API v1

## Release status

This is a separate deployed Worker project at `/home/ubuntu/quran-project/quran-content-worker`. The existing Islamic Data Worker and its documentation are untouched. Worker script `audio`, active version `d34c0b2e-9e10-4219-b225-c96b3feba20b`, serves the custom domain `https://audio.islamicdata.uz`. Local Wrangler development uses `http://127.0.0.1:8787`.

The Worker proxies AlQuran Cloud and UmmahAPI JSON and streams their published audio files through fixed allowlists; it does not save audio or Quran text in R2. JSON adds `sourceApi: "Islamic - Your Daily Companion"`; translation, translator, edition, and reciter metadata from upstream responses are retained.

## Base URL and request behavior

Local base URL: `http://127.0.0.1:8787`; production base URL: `https://audio.islamicdata.uz`. All routes are under `/v1`.

- Read methods: `GET` and `HEAD`.
- CORS preflight: `OPTIONS` → `204`.
- Other methods: `405`.
- Query strings are rejected except `translation`, `script`, and `reciter` on the UmmahAPI surah route; values are validated and rebuilt, never passed through arbitrarily.
- Callers do not supply API keys. The Cloudflare secret binding `UMMAHAPI_API_KEY` is configured on the Worker and sent only to UmmahAPI as `X-API-Key`; its value is not in project files.
- The Worker calls only fixed hosts: `api.alquran.cloud`, `cdn.islamic.network`, `ummahapi.com`, `everyayah.com`, `download.quranicaudio.com`, `server8.mp3quran.net`, and `cdn.mp3quran.net`, with fixed media path prefixes and one validated MP3Quran redirect. It is not an arbitrary URL proxy.
- Provider/network failures return `502`; provider HTTP status codes are otherwise preserved for valid JSON/media responses.
- JSON responses default to `public, max-age=300, s-maxage=600`; media uses upstream caching headers or `public, max-age=3600`.
- AlQuran Cloud audio URLs are rewritten to `/v1/audio/media/...`; UmmahAPI recitation URLs are rewritten to `/v1/ummahapi/audio/media/...`. Media bytes are streamed without buffering or storing them.
- Range/If-Range are forwarded. UmmahAPI-linked EveryAyah, Quranicaudio, and MP3Quran streams returned `206` for ranged live samples; AlQuran Cloud CDN returned full `200` responses for the sampled ayah and surah assets, so clients should accept either.

## Quran text translations

The live AlQuran Cloud text catalog returned 141 text editions, of which 118 were tagged `translation` across 49 language codes when checked on 2026-10-30. The API response is dynamic; the catalog endpoint is authoritative.

| Method | Path | Behavior |
|---|---|---|
| GET, HEAD | `/v1/translations/editions` | Proxies `/v1/edition/format/text`, filters `data` to `type: "translation"`, and adds `total`. Tafsir entries are excluded. |
| GET, HEAD | `/v1/translations/ayahs/{surah}/{ayah}/{edition}` | One translated ayah, via the upstream `surah:ayah` reference. |
| GET, HEAD | `/v1/translations/surahs/{surah}/{edition}` | One surah in a selected text-translation edition. |

`surah` is 1–114; `ayah` is 1–286 and must exist in the selected surah. `edition` is an identifier from `/translations/editions` (for example `en.sahih`).

```bash
curl --fail http://127.0.0.1:8787/v1/translations/editions
curl --fail http://127.0.0.1:8787/v1/translations/ayahs/2/255/en.sahih
curl --fail http://127.0.0.1:8787/v1/translations/surahs/1/en.sahih
```

The Worker only filters catalog metadata; it does not rewrite translated text.

## UmmahAPI text and recitation

UmmahAPI provides written translation text with Quran surah data and Arabic recitation metadata/URLs. Its documented audio is recitation, not spoken translation audio. The catalog/overview and reciter endpoints are live and dynamic.

| Method | Path | Behavior |
|---|---|---|
| GET, HEAD | `/v1/ummahapi/quran` | Proxies UmmahAPI Quran overview, including its translation metadata. |
| GET, HEAD | `/v1/ummahapi/quran/reciters` | Lists UmmahAPI reciters. |
| GET, HEAD | `/v1/ummahapi/quran/surahs/{surah}?translation={id}&script={script}&reciter={id}` | Arabic surah data and selected written translation/reciter metadata. Only these three query keys are accepted. `surah` is 1–114; `reciter` is 1–13; query values are validated. |
| GET, HEAD | `/v1/ummahapi/quran/audio/{surah}` | Full-surah recitation links for available reciters. |
| GET, HEAD | `/v1/ummahapi/quran/audio/{surah}/{ayah}` | Ayah-by-ayah recitation links. |
| GET, HEAD | `/v1/ummahapi/audio/media/{provider}/{path...}` | Streams a recognized UmmahAPI-linked MP3 from a fixed host/path allowlist; supports byte ranges. |

The provider returns audio URLs from `everyayah.com/data/`, `download.quranicaudio.com/quran/`, and `server8.mp3quran.net/buajan/`; MP3Quran redirects the latter to `cdn.mp3quran.net/audio/`, which the Worker follows only for that validated host/path pair. The Worker rewrites them to same-origin media paths. Unsupported hosts or path prefixes are not proxied.

```bash
curl --fail http://127.0.0.1:8787/v1/ummahapi/quran
curl --fail http://127.0.0.1:8787/v1/ummahapi/quran/reciters
curl --fail 'http://127.0.0.1:8787/v1/ummahapi/quran/surahs/1?translation=sahih_international&script=uthmani&reciter=1'
curl --fail http://127.0.0.1:8787/v1/ummahapi/quran/audio/1
curl --fail http://127.0.0.1:8787/v1/ummahapi/quran/audio/1/1
```

## Quran recitation and translation audio

The live AlQuran Cloud audio catalog returned 190 editions when checked on 2026-10-30: 176 Arabic and 14 non-Arabic. Six editions were explicitly translation-labelled (English 3, Persian 1, Kazakh 1, Turkish 1); exact availability may change. Some editions are verse-by-verse, some surah-by-surah. Use each edition's `type` field to choose the correct route. Translation-audio availability is limited; the text-translation catalog is much broader.

| Method | Path | Behavior |
|---|---|---|
| GET, HEAD | `/v1/audio/editions` | Proxies the audio edition catalog. |
| GET, HEAD | `/v1/audio/ayahs/{surah}/{ayah}/{edition}` | Ayah metadata/audio URL for verse-by-verse editions. |
| GET, HEAD | `/v1/audio/surahs/{surah}/{edition}` | Surah metadata/audio URL; full-surah editions return one surah file, verse-by-verse editions return ayah files. |
| GET, HEAD | `/v1/audio/media/{kind}/{bitrate}/{edition}/{asset}.mp3` | Streams the actual MP3 from the fixed CDN. `kind=audio` uses a global ayah index 1–6,236; `kind=audio-surah` uses a surah number 1–114. Bitrate is 1–320. Supports `Range` and `If-Range`. |

Examples:

```bash
curl --fail http://127.0.0.1:8787/v1/audio/editions
curl --fail http://127.0.0.1:8787/v1/audio/ayahs/2/255/ar.alafasy
curl --fail http://127.0.0.1:8787/v1/audio/surahs/1/en.misharyrashidalafasyenglishtranslationsaheehibrahimwalk
curl --fail -H 'Range: bytes=0-1023' \
  http://127.0.0.1:8787/v1/audio/media/audio/128/ar.alafasy/1.mp3
```

An invalid surah/ayah/edition/media path returns `400` or `404`; a media item absent upstream returns its upstream `404`. The text/audio API may return an HTTP `200` envelope whose `code` field indicates an upstream error; clients should inspect both HTTP status and JSON `code`.

## Provider, attribution, and permissions

- AlQuran Cloud text/catalog API: `https://api.alquran.cloud/v1`; audio CDN: `https://cdn.islamic.network/quran`. No key is required. It documents a soft per-IP-per-second API limit; the audio CDN recommends caching. The numeric-limit help link was unavailable when checked.
- UmmahAPI JSON API: `https://ummahapi.com/api`. Anonymous quota documented at 5,000 requests per 15 minutes. The Worker sends the configured `UMMAHAPI_API_KEY` secret only in an `X-API-Key` header; the value is not stored in this project.
- The owner reports that both providers permit reproduction and reuse. Preserve provider, edition, translator, and reciter attribution. AlQuran Cloud public references: [API docs](https://alquran.cloud/api), [CDN docs](https://alquran.cloud/cdn), [terms](https://alquran.cloud/terms-and-conditions). UmmahAPI references: [API docs](https://ummahapi.com/api/docs), [privacy](https://ummahapi.com/privacy).

## Custom domain and deployment

`audio.islamicdata.uz` is live on Worker script `audio`, active version `d34c0b2e-9e10-4219-b225-c96b3feba20b`. The `UMMAHAPI_API_KEY` secret binding is present on that Worker. The existing `api.islamicdata.uz` Worker was deliberately not used or changed. The deployment was smoke-tested through the custom domain, including translation catalogs, AlQuran Cloud and UmmahAPI JSON routes, same-origin audio rewriting, Range streaming, HEAD, and OPTIONS.
