# Building Deen Companion for Android and iOS

A complete, from-scratch guide to producing an installable **APK**, an uploadable
**AAB** (Android App Bundle), and a signed **IPA** for TestFlight or the App Store.

Deen Companion is an **Expo SDK 58** app (React Native 0.88, React 19.3) with no
native code of its own. That matters: you never have to open Android Studio or
Xcode to produce a store binary, because [EAS Build](https://docs.expo.dev/build/introduction/)
compiles it on Expo's own macOS and Linux machines. Local builds are documented too,
for when you want them.

---

## 1. What each output is for

| Output | Extension | Use it for | Built from |
| --- | --- | --- | --- |
| Android APK | `.apk` | Sideloading, direct install, internal testing, QA on real devices | `distribution: "internal"` |
| Android App Bundle | `.aab` | **The only format Google Play accepts for new apps** | `distribution: "store"` |
| iOS IPA (ad hoc / internal) | `.ipa` | Devices registered in your Apple Developer account, or an Enterprise account | `distribution: "internal"` |
| iOS IPA (App Store) | `.ipa` | TestFlight and App Store submission | `distribution: "store"` |

If you only want to hand someone a file to install, build the **APK**. If you intend
to publish, build the **AAB** and the **App Store IPA**.

---

## 2. Requirements

### 2.1 Accounts

| Account | Cost | Needed for |
| --- | --- | --- |
| [Expo](https://expo.dev/signup) | Free tier is enough to build | EAS Build. Not needed for local builds. |
| [Google Play Console](https://play.google.com/console) | One-time US$25 | Publishing to Play |
| [Apple Developer Program](https://developer.apple.com/programs/) | US$99/year | **Any** signed IPA, including TestFlight |

You cannot produce an installable IPA without the paid Apple membership. There is no
way around it — even a build for your own phone needs a signing certificate from Apple.

### 2.2 Toolchain

The app pins `engines.node: ">=22.13.0"`. Expo SDK 58 requires Node **22.13+, 24.3+
or 26+**; odd-numbered releases (23, 25) are not supported [1](https://docs.expo.dev/versions/latest/).
Use an LTS line and a version manager:

```bash
nvm install 22.13.1 && nvm use 22.13.1   # or 24.3+, or 26+
node -v                                   # must not be 23.x or 25.x
```

**For EAS Build (cloud) you need almost nothing local** — just Node, Git and the CLI.
Expo's build servers already carry the rest: the `sdk-58` Android image runs
`ubuntu-26.04-jdk-17-ndk-r27b` with Java 17, NDK 27.1.12297006 and Node 22.23.2, and
the `sdk-58` iOS image runs `macos-tahoe-26.6-xcode-27.1` [7](https://docs.expo.dev/build-reference/infrastructure/).

**For local builds** you need the full native toolchain:

| | Android | iOS |
| --- | --- | --- |
| Operating system | macOS, Linux or Windows | **macOS only** |
| JDK | **17** (Temurin). Do not use 21+ | 17 |
| Android SDK | Platform **37**, Build-Tools **37.0.0** | — |
| NDK | 27.1.12297006 (only if you add native code) | — |
| Gradle / AGP / Kotlin | 9.4.1 / 9.2.1 (AGP 9 is supported in SDK 58) / 2.2.x — all supplied by the generated project [2](https://expo.dev/changelog/sdk-58) [16](https://github.com/zakariaf/ReactNative-Skills/blob/main/skills/expo-sdk-upgrade/references/sdk-58-changes.md) | — |
| Xcode | — | **26.4 or newer** [1](https://docs.expo.dev/versions/latest/) |
| CocoaPods | — | `brew install cocoapods`, then `npx pod-install` |
| Minimum OS | Android 7.0 (API 24) | iOS 16.4 [1](https://docs.expo.dev/versions/latest/) |

Compiled against: `compileSdk 37`, `targetSdk 36`, `minSdk 24` [1](https://docs.expo.dev/versions/latest/).

Environment variables for local Android builds:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk      # macOS
# export ANDROID_HOME=$HOME/Android/Sdk             # Linux
export JAVA_HOME=$(/usr/libexec/java_home -v 17)    # macOS
# export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64   # Linux
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

### 2.3 Machine

- ~4 GB free disk for `node_modules` (the install is large; React Native, Expo and
  the Google Fonts packages dominate).
- **Recommended: build on EAS.** Local Android builds need the Android SDK (~5 GB)
  and local iOS builds are impossible off macOS.

---

## 3. One-time setup

```bash
git clone <your-repo-url> deen-companion
cd deen-companion
npm install                 # or: npm ci   (respects package-lock.json exactly)
npm install -g eas-cli      # the build service CLI
eas login                   # your Expo account
eas whoami                  # confirm you are signed in
npx expo install --check    # verifies every Expo package matches SDK 58
npx expo-doctor             # reports toolchain problems before you build
```

### 3.1 `eas.json`

The repository has no `eas.json` yet. Create one at the project root:

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

- `preview` → an **APK** you can install anywhere.
- `production` → an **AAB** and an App Store **IPA**, with `versionCode` /
  `buildNumber` bumped for you.
- `development` → a dev client for testing native features (biometrics,
  notifications) that Expo Go cannot run. This profile needs `expo-dev-client`,
  which is not installed yet:

  ```bash
  npx expo install expo-dev-client
  ```

  Skip the profile entirely if you are happy testing on release builds.

On the first build, EAS asks to create and link an EAS project and writes the
project ID into `app.json`. Let it.

---

## 4. App config checklist — do this before the first real build

Open `app.json`. Everything here ships inside the binary, so a mistake means
another full build.

**1. Identifiers (must be unique and permanent — they cannot be changed after publishing):**

```json
"ios":     { "bundleIdentifier": "app.deen.companion" },
"android": { "package": "app.deen.companion" }
```

Already set. Own the domain or use a reverse-domain you control.

**2. Face ID usage description — currently missing.** The app locks with biometrics
(`expo-local-authentication`), and iOS requires a reason string. Without it, iOS
silently falls back to the device passcode and App Review will reject the build
[1](https://docs.expo.dev/versions/latest/sdk/local-authentication/). Add:

```json
"ios": {
  "infoPlist": {
    "NSFaceIDUsageDescription": "Face ID unlocks Deen Companion so your private worship records stay private."
  }
},
"plugins": [
  "expo-location",
  ["expo-local-authentication", { "faceIDPermission": "Face ID unlocks Deen Companion so your private worship records stay private." }],
  "expo-font",
  "expo-audio",
  "expo-notifications"
]
```

**3. Icons.** `assets/icon.png` is 1024×1024 with no alpha channel — correct for both
stores. The Android adaptive layers (`android-icon-foreground.png`,
`android-icon-background.png`, `android-icon-monochrome.png`) are 512, 512 and 432;
regenerate them at **1024×1024** so adaptive icons stay crisp on high-density
devices.

**4. Version.** `version` is `1.0.0`. Android `versionCode` and iOS `buildNumber`
must increase on every upload — `autoIncrement: true` in the production profile
handles this.

**5. Permissions already declared** (nothing to add):

| Permission | Why the app needs it | Declared by |
| --- | --- | --- |
| `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION` | Prayer times and Qibla | `app.json` → `expo-location` plugin |
| `POST_NOTIFICATIONS` | Prayer reminders (Android 13+) | `expo-notifications` plugin |
| `USE_BIOMETRIC`, `USE_FINGERPRINT` | Private-area lock | `expo-local-authentication` plugin |
| Microphone / audio | Recitation playback | `expo-audio` plugin |

Location is requested **at runtime, only when the user asks for it** — the first run
requires an explicit location choice and there is no silent fallback.

**7. No Firebase, and no push certificate.** Reminders are scheduled **locally** on
the device (`Notifications.scheduleNotificationAsync`); the app never requests an Expo
push token. That means no `google-services.json`, no FCM project, and no APNs key for
push — one less thing to configure. If you ever add remote push, that changes.

**6. No secrets.** The app calls public, unauthenticated APIs (AlAdhan, Quran.com,
`mp3quran.net`, hadith edition files, `open.er-api.com`, `api.gold-api.com`). There
are no `EXPO_PUBLIC_*` variables, no `.env`, and no key files. Nothing to configure.

---

## 5. Building with EAS (recommended)

### Android APK — installable file

```bash
eas build --platform android --profile preview
```

EAS uploads the project, builds in the cloud and prints a download URL plus a QR
code. Install on a device by scanning it, or drag the APK onto an emulator.

### Android App Bundle — for Google Play

```bash
eas build --platform android --profile production
```

First run: let EAS **generate the upload keystore** and store it. Then **back it up**:

```bash
eas credentials --platform android     # → "Download credentials" / backup keystore
```

> Losing the upload keystore after publication is unrecoverable for that package
> name. Store the file and its passwords in your password manager the same day.

### iOS IPA — TestFlight / App Store

```bash
eas build --platform ios --profile production
```

First run, answer the prompts:

1. **Apple Distribution certificate** — let EAS create and reuse it.
2. **App Store Connect API key** or Apple ID login — EAS will offer to set one up.
   An API key (App Store Connect → Users and Access → Keys) is more reliable than
   Apple ID + 2FA in CI.
3. **Provisioning profile** — EAS creates and manages it for `app.deen.companion`.

The result is an App Store-signed IPA, ready for the next step.

### iOS IPA for specific devices (no App Store)

```bash
eas build --platform ios --profile preview     # internal distribution
eas device:create                              # register each test device UDID
```

Ad hoc builds only install on registered UDIDs.

### Build both at once

```bash
eas build --platform all --profile production
```

### Useful flags

| Flag | Effect |
| --- | --- |
| `--local` | Build on this machine instead of the cloud (needs the full toolchain) |
| `--clear-cache` | Force a clean Gradle/CocoaPods cache — first fix for a mysterious failure |
| `--profile <name>` | Pick a profile from `eas.json` |
| `--no-wait` | Queue the build and return immediately |
| `eas build:list` | Show builds and their status |
| `eas build:view <id>` | Open logs for one build |

---

## 6. Building locally (no EAS account)

Only do this if you need the binary on your own machine. It generates the `android/`
and `ios/` directories, which are **not** in this repository — that is deliberate
with Continuous Native Generation, and they are safe to delete afterwards.

```bash
npx expo prebuild              # add --clean to regenerate from scratch
```

### Android

```bash
npx expo run:android --variant release        # installs on a connected device/emulator
```

Or with Gradle directly:

```bash
cd android
./gradlew assembleRelease     # → android/app/build/outputs/apk/release/app-release.apk
./gradlew bundleRelease       # → android/app/build/outputs/bundle/release/app-release.aab
cd ..
```

The APK Gradle produces is **unsigned**. Sign it before it will install:

```bash
keytool -genkeypair -v -keystore deen.keystore -alias deen \
  -keyalg RSA -keysize 2048 -validity 10000

~/Library/Android/sdk/build-tools/37.0.0/apksigner sign \
  --ks deen.keystore \
  --out deen-release-signed.apk \
  android/app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
npx pod-install                                  # once, after prebuild
npx expo run:ios --configuration Release         # device or simulator
```

For the store binary, open the workspace in Xcode and let it handle signing:

```bash
open ios/*.xcworkspace
```

Then: select the app target → **Signing & Capabilities** → tick *Automatically manage
signing* → choose your team → **Product ▸ Archive** → **Distribute App** →
*App Store Connect* → *Upload*.

### Keep generated directories out of git

```bash
printf '\n# Native projects are generated by `npx expo prebuild`\n/android/\n/ios/\n' >> .gitignore
```

---

## 7. Versioning and future releases

- **`version`** (`1.0.0`) is the user-facing string. Bump it deliberately.
- **Android `versionCode`** and **iOS `buildNumber`** must strictly increase on every
  upload. `autoIncrement: true` handles it on EAS.
- To bump the user-facing version: edit `version` in `app.json`, then rebuild.
- Over-the-air JS updates are **not** configured (`expo-updates` is not a dependency).
  Every JS change is a new store build today.

---

## 8. Submitting to the stores

```bash
eas submit --platform android --latest     # Play Console
eas submit --platform ios --latest         # App Store Connect
```

Android submission needs a **Google Cloud service-account JSON** with *Release
manager* rights on the Play app, created in Play Console → *Setup → API access*.
EAS prompts for the file path and remembers it. iOS submission reuses the App Store
Connect API key you set up during the first iOS build.

Or upload the AAB / IPA by hand in Play Console and App Store Connect / TestFlight.

**Play Console** will ask you to declare:

- **Data safety** — the app collects **nothing**. No account, no analytics, no
  tracking, no SDK that reports home. Location stays on the device.
- **Target API level** — 36 via SDK 58, so no Play policy warning [1](https://docs.expo.dev/versions/latest/).

**App Store Connect** will ask you to declare:

- **Privacy manifest / nutrition labels** — no collection, no tracking.
- **Export compliance** — the app makes ordinary HTTPS calls; answer *Yes* to
  encryption and claim the exemption for apps that only use standard HTTPS.
- **A privacy policy URL** — required for App Store review. Host a short page stating
  that nothing is collected and that all data stays on device; several free
  privacy-policy generators can produce one.

---

## 9. Quality checks before you ship a release build

```bash
npx tsc --noEmit                       # types
npx expo-doctor                        # toolchain and dependency health
npm run build:web                      # proves the whole graph bundles (outputs web-build/)
```

Then, on a **release** build specifically (not Expo Go, not dev client):

- **Notifications** — schedule a prayer reminder and confirm it fires.
- **Biometrics** — enable the private-area lock and confirm Face ID / fingerprint
  appears rather than the passcode fallback.
- **Audio** — play a recitation, then background the app.
- **Offline** — enable airplane mode; cached prayer times, Quran and adhkar must
  still open.
- **RTL / Arabic** — switch language and walk every tab.

> Test a release build early. SDK 58 turns **R8 minification on for Android release
> builds** by default, so a bug that only appears in the store binary is possible.

---

## 10. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `Unsupported Node version` | Node 23 or 25. Switch to 22.13+, 24.3+ or 26+ [1](https://docs.expo.dev/versions/latest/) |
| `SDK location not found` | `ANDROID_HOME` unset. Export it and install *SDK Platform 37* + *Build-Tools 37.0.0* |
| `Unable to locate a Java Runtime` / Gradle JVM errors | JDK 17 required. Set `JAVA_HOME` to a JDK 17 path |
| `AAR metadata: requires compileSdk 37` | Install Android SDK Platform 37; the generated project compiles against 37 [16](https://github.com/zakariaf/ReactNative-Skills/blob/main/skills/expo-sdk-upgrade/references/sdk-58-changes.md) |
| Gradle wrapper errors after upgrading | SDK 58 ships Gradle 9.4.1 / AGP 9.2.1; let `expo prebuild --clean` regenerate the project [16](https://github.com/zakariaf/ReactNative-Skills/blob/main/skills/expo-sdk-upgrade/references/sdk-58-changes.md) |
| iOS build fails on a Mac with an older Xcode | Xcode 26.4+ is required [1](https://docs.expo.dev/versions/latest/) |
| Face ID silently uses the passcode | Missing `NSFaceIDUsageDescription` — see §4.2 |
| `Pod install` fails | `cd ios && pod install --repo-update`, or `npx pod-install` |
| Build worked yesterday, fails now with no code change | `eas build --clear-cache` |
| Release APK crashes where debug worked | R8 minification. Read the ProGuard mapping in the build logs and test release builds earlier |
| Play rejects the AAB | `versionCode` not incremented — use `autoIncrement: true` |
| IPA will not install on a test phone | Ad hoc profile does not contain that UDID: `eas device:create`, then rebuild |
| Fonts render as boxes or the app sits on the loader | Font files must live under `assets/fonts/` so the bundler copies them — see the note in `App.tsx` |

---

## 11. Command reference

```bash
# Setup
npm install
npm install -g eas-cli && eas login
npx expo install --check && npx expo-doctor

# Everyday development
npx expo start                  # Expo Go / dev client

# Cloud builds
eas build --platform android --profile preview      # APK
eas build --platform android --profile production   # AAB
eas build --platform ios --profile production       # App Store IPA
eas build --platform all --profile production       # both
eas build --platform ios --profile preview --local  # on this Mac

# Devices and credentials
eas device:create
eas credentials --platform android

# Submission
eas submit --platform android --latest
eas submit --platform ios --latest

# Local native builds
npx expo prebuild --clean
npx expo run:android --variant release
npx expo run:ios --configuration Release

# Web (Vercel deploys this)
npm run build:web               # → web-build/
```

---

## 12. Where the native configuration lives

| Concern | File |
| --- | --- |
| Name, slug, version, identifiers, permissions, plugins | `app.json` |
| Build profiles | `eas.json` (create it — §3.1) |
| Icon, splash, adaptive icon layers, fonts | `assets/` |
| Runtime permissions requested at runtime | `App.tsx`, `src/services/notifications.ts` |
| Web deployment | `vercel.json` |
| Design and architecture notes | `DESIGN_SYSTEM.md`, `IMPLEMENTATION_PHASES.md` |
