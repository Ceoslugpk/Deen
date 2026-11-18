# Text/audio translation selection and persistence

## Behaviour

- Selecting an Urdu text translation automatically selects the existing **Shamshad Ali Khan** Urdu recording (`ur.khan`, 64 kbps) for translation audio.
- Where the selected text language has no published recording in the shipped audio catalogue, select **Ibrahim Walk** English audio (`en.walk`, 192 kbps). The selected **text** remains in its chosen language.
- This selects a voice; it does not start playback or turn on a switch the person turned off. An old mute applied automatically by the previous no-recording policy is lifted, but an explicit off choice stays off.
- A voice chosen manually afterwards remains selected until the text language changes. No Pashto/Tamil or other unavailable recording is invented.
- Onboarding text selection seeds the corresponding voice or English too. Its existing separate-voice override remains available. No layout/styles/artwork were redesigned.

## What caused the English selection symptom

1. `useContentLanguageSync` depended on the selected translation and a callback recreated for every preference change. With an English interface, choosing Urdu caused that effect to choose English again. It now follows actual interface-language changes, with a persisted `translationAppLanguage` marker so manual text choices survive a relaunch. Older saved choices are adopted as-is, not reset.
2. Translation and Reading settings headers used the saved edition's language while the person was browsing a different language. They now follow the browsing language; saved edition identity is also resolved before the catalogue arrives.
3. The shared edition picker's effect watched its own local language state and could put a tapped language straight back on its initial English pill. It now reacts to external choices/catalogue hydration instead.
4. `loadQuranPreferences` contained a reset-based migration that replaced valid stored translations with English whenever an old flag was missing. That reset is retired. Existing values and the old flag are not deleted.

## Storage and audio state

- Reading preference reads/writes now use the existing `storage.ts` retry, per-key ordering and small-write read-back verification, rather than raw unverified preference writes.
- A provider-local preference store patches the latest snapshot. Rapid changes cannot merge against stale render state; choices made during initial hydration merge with saved settings before any write.
- Audio settings hydrate before automatic matching, preventing default switches/volumes from overwriting saved ones. Newer selection requests supersede older pending syncs.
- Audio centre/player screens subscribe to settings changes, rather than retaining an old local English selection after another screen changes the text language.
- Matching uses the verified, bundled audio catalogue and works without fetching a catalogue. Existing recording URLs and bitrates are unchanged.
- No user records, notes, prayer history, downloads or preferences are cleared. Release identifiers, versions, dependencies, plugins and EAS/store configuration are unchanged.

## Validation

- **61 regression tests passed**, including all 37 previous hotfix/manifest tests and 24 translation/persistence tests.
- Tests cover Urdu matching; English fallback for Pashto, Tamil, Sinhala, Malay and German; real shipped bitrates; preserved explicit audio-off state; old automatic mutes; saved volumes/reciter; voice overrides; pending-load races; subscriptions; saved Urdu without a migration flag; dropped/out-of-order writes; rapid preference patches; and hydration-time selections.
- Full TypeScript check passed with zero diagnostics; whitespace and test-script syntax checks passed.
- Separate production **web, Android and iOS exports passed**. Native bundling initially hit sandbox memory limits; bounded Node heaps/one worker and removal of old, reproducible temporary validation exports allowed it to complete. No app configuration was changed. The pre-existing Apple team configuration warning remains unchanged.
- Live **390 × 844 Chromium** checks with real catalogues and no mocked responses verified:
  - Urdu browsing header and visibly checked Urdu edition in the Translation screen;
  - the exact Urdu edition/check mark and `ur.khan` audio survive a reload, with the interface independently English;
  - changing to Tamil in Reading settings keeps Tamil text and selects English audio;
  - the exact Tamil edition/check mark and English fallback survive a page reload;
  - an existing saved Urdu edition (without the old migration flag) and a saved font size are preserved;
  - saved audio-off state and translation volume remain unchanged.
- The previous first-tap/playback browser regression also passed on the new export at phone and tablet viewports: first tap 55:5, repeat tap 55:5, then 55:7, with real media time advancing and correct player/menu bounds.
- Page, console, HTTP and failed-request error arrays were empty in the final browser runs.

### Re-run

```sh
npm run test:regressions
npx tsc --noEmit
npx expo export --platform web --max-workers 1 --output-dir /tmp/islamic-r92-web
# Serve that export in a separate terminal:
python3 -m http.server 8102 --bind 0.0.0.0 --directory /tmp/islamic-r92-web
TRANSLATION_URL=http://127.0.0.1:8102 node tests/verify-translation-selection-web.cjs
HOTFIX_URL=http://127.0.0.1:8102 node tests/verify-hotfix-web.cjs
```

Browser reports/screenshots are temporary QA artifacts, not new store assets. The storage tests run the actual TypeScript storage/store code with an AsyncStorage test double; Chromium uses browser storage, **not native AsyncStorage**. Android/iOS exports check bundling/Hermes compilation, **not an installed APK/AAB or physical-device behaviour**.

Before public delivery, verify on a real Android device: select an Urdu edition, reopen both text/audio pickers, close/relaunch the app, and confirm the same edition stays selected and the chosen voice is audible when translation audio is enabled. Repeat with a language without audio and verify English audio plus unchanged text. No public release or store submission is included in this change; use the existing release workflow.
