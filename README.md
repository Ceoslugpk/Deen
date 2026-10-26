# Deen Companion

A polished Expo + React Native Islamic companion app for iOS, Android, and web.

## Included

- Location-aware prayer times using the AlAdhan public API
- Quran chapter and Uthmani verse data using Quran.com API v4
- Full Quran reader foundation with bookmarks and recitation controls
- Qibla direction experience
- Functional Tasbih counter with haptics
- Duas, Hijri calendar, Zakat, Hadith, mosque, and Ramadan modules
- English UI with Arabic Quran typography and RTL-ready preferences
- Graceful local fallback data when APIs are unavailable

## Run locally

```bash
npm install
npx expo start
```

Then press `i` for iOS, `a` for Android, or `w` for web. You can also scan the QR code with Expo Go.

## Data sources

- Prayer times: `https://api.aladhan.com/v1`
- Quran: `https://api.quran.com/api/v4`

For production, review API terms, introduce persistent caching, add a dedicated translation/recitation selection flow, and verify prayer calculation defaults by region.
