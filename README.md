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

## Visual system

The interface uses a custom SVG icon system in `src/components/CustomIcon.tsx`, animated press states, and a multi-accent indigo, cyan, coral, saffron, and teal palette. The app has no account creation, profile, or tracking flow.
