const assert = require('node:assert/strict');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { createAudioHarness, deferred, tick } = require('./helpers/audio-harness.cjs');

const PREFS = '@deen/quran/preferences/v1';
const AUDIO = '@deen/audio-settings/v1';
const URDU = {
  translationEdition: 'tr_ur_fateh_muhammad_jalandhry',
  translationName: 'فتح محمد جالندھری', translationLanguage: 'Urdu',
};

function persistenceHarness(options = {}) {
  const storage = options.storage || new Map();
  const writes = [];
  let droppedWrites = options.droppedWrites || 0;
  const load = createLoader({
    '@react-native-async-storage/async-storage': {
      getItem: async (key) => options.getItem ? options.getItem(key, storage) : storage.get(key) ?? null,
      setItem: async (key, value) => {
        writes.push({ key, value });
        if (droppedWrites-- > 0) return;
        if (options.beforeWrite) await options.beforeWrite(key, value);
        storage.set(key, value);
      },
      removeItem: async (key) => storage.delete(key),
    },
    './contentCache': {},
  }, { __DEV__: false });
  const quran = load('src/services/quranState.ts');
  return { storage, writes, load, quran };
}

test('Urdu text automatically selects the real Urdu audio without changing the audio switch', async () => {
  const h = createAudioHarness();
  await h.service.saveAudioSettings({ translationAudioEnabled: true, rate: 1.25, translationVolume: 0.7 });
  const next = await h.service.syncAudioTranslationToLanguage('ur');
  assert.equal(next.translationEdition, 'ur.khan');
  assert.equal(next.translationName, 'Shamshad Ali Khan');
  assert.equal(next.translationAudioEnabled, true);
  assert.equal(next.translationAutoMuted, false);
  assert.equal(next.rate, 1.25);
  assert.equal(next.translationVolume, 0.7);
  assert.equal(JSON.parse(h.storage.get(AUDIO)).translationEdition, 'ur.khan');
});

for (const code of ['ps', 'ta', 'si', 'ms', 'de']) {
  test(`${code} text has no translation recording: select English, not the previous voice or a fake recording`, async () => {
    const h = createAudioHarness();
    await h.service.saveAudioSettings({ translationEdition: 'ur.khan', translationName: 'Shamshad Ali Khan', translationAudioEnabled: true });
    const next = await h.service.syncAudioTranslationToLanguage(code);
    assert.equal(next.translationEdition, 'en.walk');
    assert.equal(next.translationName, 'Ibrahim Walk');
    assert.equal(next.translationAudioEnabled, true);
    assert.equal(next.translationAutoMuted, false);
    assert.equal(next.translationSyncedLanguage, code);
  });
}

test('automatic selection does not turn translation audio on after the user switched it off', async () => {
  const h = createAudioHarness();
  await h.service.saveAudioSettings({ translationAudioEnabled: false });
  await h.service.syncAudioTranslationToLanguage('ur');
  assert.equal(h.service.getAudioSettings().translationAudioEnabled, false);
  await h.service.syncAudioTranslationToLanguage('ps');
  assert.equal(h.service.getAudioSettings().translationAudioEnabled, false);
  assert.equal(h.service.getAudioSettings().translationEdition, 'en.walk');
});

test('a mute applied by the previous no-audio policy is lifted for the English fallback', async () => {
  const h = createAudioHarness();
  await h.service.saveAudioSettings({ translationSyncedLanguage: 'ps', translationAudioEnabled: false, translationAutoMuted: true });
  const next = await h.service.syncAudioTranslationToLanguage('ps');
  assert.equal(next.translationEdition, 'en.walk');
  assert.equal(next.translationAudioEnabled, true);
  assert.equal(next.translationAutoMuted, false);
});

test('a deliberate voice override survives a reload until the text language changes', async () => {
  const h = createAudioHarness();
  await h.service.syncAudioTranslationToLanguage('ur');
  await h.service.saveAudioSettings({ translationEdition: 'fr.leclerc', translationName: 'Youssouf Leclerc' });
  const reopened = createAudioHarness({ storage: h.storage });
  await reopened.service.loadAudioSettings();
  await reopened.service.syncAudioTranslationToLanguage('ur');
  assert.equal(reopened.service.getAudioSettings().translationEdition, 'fr.leclerc');
  await reopened.service.syncAudioTranslationToLanguage('fa');
  assert.equal(reopened.service.getAudioSettings().translationEdition, 'fa.hedayatfarfooladvand');
});

test('audio sync hydrates stored settings first, preserving saved switches, reciter and volume', async () => {
  const h = createAudioHarness();
  h.storage.set(AUDIO, JSON.stringify({ ...h.service.DEFAULT_AUDIO_SETTINGS,
    translationAudioEnabled: true, reciter: 'ar.abdurrahmaansudais',
    reciterName: 'Abdur-Rahman As-Sudais', rate: 1.5, arabicVolume: 0.4, translationVolume: 0.6,
  }));
  const next = await h.service.syncAudioTranslationToLanguage('ur');
  assert.equal(next.translationEdition, 'ur.khan');
  assert.equal(next.translationAudioEnabled, true);
  assert.equal(next.reciter, 'ar.abdurrahmaansudais');
  assert.equal(next.rate, 1.5);
  assert.equal(next.arabicVolume, 0.4);
  assert.equal(next.translationVolume, 0.6);
});

test('the latest text language wins while audio settings are still loading', async () => {
  const gate = deferred();
  const started = deferred();
  const h = createAudioHarness({ getItem: async (key, storage) => {
    if (key === AUDIO) { started.resolve(); await gate.promise; }
    return storage.get(key) ?? null;
  } });
  const old = h.service.syncAudioTranslationToLanguage('ur');
  await started.promise;
  const latest = h.service.syncAudioTranslationToLanguage('ps');
  gate.resolve();
  await Promise.all([old, latest]);
  assert.equal(h.service.getAudioSettings().translationEdition, 'en.walk');
  assert.equal(h.service.getAudioSettings().translationSyncedLanguage, 'ps');
});

test('mounted audio screens receive automatically changed settings', async () => {
  const h = createAudioHarness();
  const seen = [];
  const unsubscribe = h.service.subscribeAudioSettings((settings) => seen.push(settings.translationEdition));
  await h.service.syncAudioTranslationToLanguage('ur');
  assert.equal(seen.at(-1), 'ur.khan');
  unsubscribe();
  await h.service.syncAudioTranslationToLanguage('ps');
  assert.equal(seen.at(-1), 'ur.khan');
});

test('loading saved Urdu never resets it to English, even without the old migration flag', async () => {
  const h = persistenceHarness();
  h.storage.set(PREFS, JSON.stringify({ ...URDU, fontSize: 34, showTransliteration: true }));
  h.storage.set('@deen/quran/notes/v1', '[{"verseKey":"55:5","note":"Keep"}]');
  const storedBefore = h.storage.get(PREFS);
  const loaded = await h.quran.loadQuranPreferences();
  assert.equal(loaded.translationEdition, URDU.translationEdition);
  assert.equal(loaded.translationLanguage, 'Urdu');
  assert.equal(loaded.fontSize, 34);
  assert.equal(loaded.showTransliteration, true);
  assert.equal(h.storage.get(PREFS), storedBefore, 'Loading is not a reset/migration write');
  assert.equal(h.storage.get('@deen/quran/notes/v1'), '[{"verseKey":"55:5","note":"Keep"}]');
});

test('preference writes are verified and retried if AsyncStorage silently drops a write', async () => {
  const h = persistenceHarness({ droppedWrites: 1 });
  await h.quran.saveQuranPreferences({ ...h.quran.DEFAULTS, ...URDU });
  assert.equal((await h.quran.loadQuranPreferences()).translationEdition, URDU.translationEdition);
  assert.ok(h.writes.filter((write) => write.key === PREFS).length >= 2);
});

test('slow older preference writes cannot land after newer selections', async () => {
  const gate = deferred();
  let calls = 0;
  const h = persistenceHarness({ beforeWrite: async () => { if (++calls === 1) await gate.promise; } });
  const old = h.quran.saveQuranPreferences({ ...h.quran.DEFAULTS, translationFontSize: 17 });
  await tick();
  const latest = h.quran.saveQuranPreferences({ ...h.quran.DEFAULTS, ...URDU, translationFontSize: 18 });
  await tick();
  gate.resolve();
  await Promise.all([old, latest]);
  assert.equal(JSON.parse(h.storage.get(PREFS)).translationEdition, URDU.translationEdition);
  assert.equal(JSON.parse(h.storage.get(PREFS)).translationFontSize, 18);
});

test('language identity is correct before the catalogue loads, including old ids and Malay', () => {
  const h = persistenceHarness();
  const { translationLanguageCode } = h.load('src/services/translationPreferences.ts');
  assert.equal(translationLanguageCode(URDU.translationEdition, 'English'), 'ur');
  assert.equal(translationLanguageCode('ur.jalandhry', ''), 'ur');
  assert.equal(translationLanguageCode('', 'Urdu'), 'ur');
  assert.equal(translationLanguageCode('tr_ms_basmeih', 'Malay'), 'ms');
  assert.equal(translationLanguageCode('', 'Malay'), 'ms');
  assert.equal(translationLanguageCode('arbitrary-id', '', [{ id: 'arbitrary-id', language: 'UR' }]), 'ur');
});

test('availability comes from real audio editions, preserving Urdu and English bitrates', () => {
  const h = persistenceHarness();
  const { translationAudioForLanguage } = h.load('src/services/translationPreferences.ts');
  assert.equal(translationAudioForLanguage('ur').identifier, 'ur.khan');
  assert.equal(translationAudioForLanguage('ur').bitrate, 64);
  assert.equal(translationAudioForLanguage('ps', false), null);
  assert.equal(translationAudioForLanguage('ta', false), null);
  assert.equal(translationAudioForLanguage('ps').identifier, 'en.walk');
  assert.equal(translationAudioForLanguage('ps').bitrate, 192);
});

test('rapid preference patches preserve both the Urdu edition and unrelated display choices', async () => {
  const h = persistenceHarness();
  const { createQuranPreferenceStore } = h.load('src/services/quranPreferenceStore.ts');
  const store = createQuranPreferenceStore();
  await store.hydrate();
  const update = store.update;
  await Promise.all([
    update({ ...URDU, translationAppLanguage: 'en' }),
    update({ fontSize: 36 }),
    update({ showTransliteration: true }),
  ]);
  assert.equal(store.getSnapshot().preferences.translationEdition, URDU.translationEdition);
  assert.equal(store.getSnapshot().preferences.fontSize, 36);
  assert.equal(store.getSnapshot().preferences.showTransliteration, true);
  const reopened = persistenceHarness({ storage: h.storage });
  const saved = await reopened.quran.loadQuranPreferences();
  assert.equal(saved.translationEdition, URDU.translationEdition);
  assert.equal(saved.translationAppLanguage, 'en');
  assert.equal(saved.fontSize, 36);
  assert.equal(saved.showTransliteration, true);
});

test('a selection during hydration merges with saved preferences instead of writing defaults over them', async () => {
  const gate = deferred();
  const started = deferred();
  const h = persistenceHarness({ getItem: async (key, storage) => {
    if (key === PREFS) { started.resolve(); await gate.promise; }
    return storage.get(key) ?? null;
  } });
  h.storage.set(PREFS, JSON.stringify({ ...h.quran.DEFAULTS, fontSize: 38, translationFontSize: 22 }));
  const { createQuranPreferenceStore } = h.load('src/services/quranPreferenceStore.ts');
  const store = createQuranPreferenceStore();
  const loading = store.hydrate();
  await started.promise;
  const selected = store.update(URDU);
  assert.equal(store.getSnapshot().preferences.translationEdition, URDU.translationEdition, 'Immediate visual state');
  assert.equal(h.writes.length, 0, 'Do not write a default-based snapshot while the saved data is unread');
  gate.resolve();
  await Promise.all([loading, selected]);
  const saved = JSON.parse(h.storage.get(PREFS));
  assert.equal(saved.translationEdition, URDU.translationEdition);
  assert.equal(saved.fontSize, 38);
  assert.equal(saved.translationFontSize, 22);
});

test('preference subscriptions reflect the selection and stop after unmount', async () => {
  const h = persistenceHarness();
  const { createQuranPreferenceStore } = h.load('src/services/quranPreferenceStore.ts');
  const store = createQuranPreferenceStore();
  await store.hydrate();
  const seen = [];
  const unsubscribe = store.subscribe((value) => seen.push(value.preferences.translationEdition));
  await store.update(URDU);
  assert.equal(seen.at(-1), URDU.translationEdition);
  unsubscribe();
  await store.update({ translationEdition: h.quran.DEFAULT_TRANSLATION_EDITION });
  assert.equal(seen.at(-1), URDU.translationEdition);
});

test('a manual audio choice wins over an older automatic selection waiting for storage', async () => {
  const gate = deferred();
  const started = deferred();
  const h = createAudioHarness({ getItem: async (key, storage) => {
    if (key === AUDIO) { started.resolve(); await gate.promise; }
    return storage.get(key) ?? null;
  } });
  const automatic = h.service.syncAudioTranslationToLanguage('ur');
  await started.promise;
  const manual = h.service.saveAudioSettings({ translationEdition: 'fr.leclerc', translationName: 'Youssouf Leclerc' });
  gate.resolve();
  await Promise.all([automatic, manual]);
  assert.equal(h.service.getAudioSettings().translationEdition, 'fr.leclerc');
});

test('an explicit off choice clears an older automatic-mute flag and stays off', async () => {
  const h = createAudioHarness();
  await h.service.saveAudioSettings({ translationAutoMuted: true, translationAudioEnabled: false });
  await h.service.saveAudioSettings({ translationAudioEnabled: false });
  const next = await h.service.syncAudioTranslationToLanguage('ur');
  assert.equal(next.translationEdition, 'ur.khan');
  assert.equal(next.translationAudioEnabled, false);
  assert.equal(next.translationAutoMuted, false);
});

for (const enabled of [false, true]) {
  test(`audio switch ${enabled ? 'on' : 'off'} during hydration does not cancel Urdu matching`, async () => {
    const gate = deferred();
    const started = deferred();
    const h = createAudioHarness({ getItem: async (key, storage) => {
      if (key === AUDIO) { started.resolve(); await gate.promise; }
      return storage.get(key) ?? null;
    } });
    h.storage.set(AUDIO, JSON.stringify({
      translationEdition: 'en.walk', translationAudioEnabled: !enabled,
      translationAutoMuted: false, translationVolume: 0.53,
    }));
    const automatic = h.service.syncAudioTranslationToLanguage('ur');
    await started.promise;
    const manual = h.service.saveAudioSettings({ translationAudioEnabled: enabled });
    gate.resolve();
    await Promise.all([automatic, manual]);
    const result = h.service.getAudioSettings();
    assert.equal(result.translationAudioEnabled, enabled);
    assert.equal(result.translationAutoMuted, false);
    assert.equal(result.translationEdition, 'ur.khan');
    assert.equal(result.translationSyncedLanguage, 'ur');
    assert.equal(result.translationVolume, 0.53);
  });
}
