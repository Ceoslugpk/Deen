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

## Build for Android and iOS

Everything needed to produce an APK, an AAB and a signed IPA — toolchain versions,
accounts, store submission and troubleshooting — is in **[BUILD.md](./BUILD.md)**.

In short, on Expo's build servers:

```bash
npm install
npm install -g eas-cli && eas login
eas build --platform android --profile preview      # APK to install
eas build --platform android --profile production   # AAB for Google Play
eas build --platform ios --profile production       # IPA for TestFlight
```

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

## Product architecture

The app follows a five-tab worship-first information architecture: Home, Prayer, Quran, Library, and Tools. Prayer holds the times themselves together with Qibla, the call and its reminders, the location they are calculated from, the Hijri calendar, Ramadan, the fasts, and the weekly summary. Library holds what you read, recite and remember — adhkar, duas, the Names, hadith, and the step-by-step worship guides. Tools holds what you calculate, look up, travel for, or record — zakat, mosques, the pilgrimage journeys, the women's records, and the privacy lock. Nothing in one tab is repeated in another.

Settings is no longer a tab: it opens from the control at the right of the shared header, which also carries notifications and the theme toggle. The first run requires an explicit prayer location choice; there is no silent location fallback and no account system. Premium typography is bundled locally with DM Sans, Newsreader, and Noto Naskh Arabic.
