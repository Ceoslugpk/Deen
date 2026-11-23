const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * Transliteration in the reader.
 *
 * The preference existed with nothing behind it: stored, defaulted, and drawn
 * in the settings preview, but never fetched and never rendered. These tests
 * hold the pieces that make the switch real, and the rules that keep a missing
 * transliteration from damaging the page.
 */

function harness(respond) {
  const disk = new Map();
  const asyncStorage = new Map();
  const requests = [];
  const contentCache = {
    getCachedJson: async (n, k) => { const raw = disk.get(`${n}:${k}`); return raw ? JSON.parse(raw) : null; },
    setCachedJson: async (n, k, v) => { disk.set(`${n}:${k}`, JSON.stringify(v)); },
    removeCachedJson: async (n, k) => { disk.delete(`${n}:${k}`); },
    listCachedKeys: async (n) => [...disk.keys()].filter((k) => k.startsWith(`${n}:`)).map((k) => k.slice(n.length + 1)),
    getCacheUsage: async () => ({ totalBytes: 0, entries: disk.size }),
    clearCacheNamespace: async (n) => { for (const k of [...disk.keys()]) if (k.startsWith(`${n}:`)) disk.delete(k); },
  };
  const load = createLoader({
    '@react-native-async-storage/async-storage': {
      getItem: async (k) => asyncStorage.get(k) ?? null,
      setItem: async (k, v) => { asyncStorage.set(k, v); },
      removeItem: async (k) => { asyncStorage.delete(k); },
    },
    './contentCache': contentCache,
    'expo-file-system/legacy': {
      documentDirectory: '/tmp/', cacheDirectory: '/tmp/',
      getInfoAsync: async () => ({ exists: false }), makeDirectoryAsync: async () => undefined,
      readAsStringAsync: async () => null, writeAsStringAsync: async () => undefined,
      deleteAsync: async () => undefined,
    },
    'react-native': { Platform: { OS: 'web' } },
  }, {
    fetch: async (url, init = {}) => {
      requests.push({ url, headers: init.headers || {} });
      const answer = await respond(url);
      return {
        status: answer.status,
        headers: { get: (name) => (answer.headers || {})[String(name).toLowerCase()] ?? null },
        text: async () => (answer.body === undefined ? '' : JSON.stringify(answer.body)),
        ok: answer.status >= 200 && answer.status < 300,
      };
    },
    process: { env: {} },
    AbortController,
    __DEV__: false,
  });
  return { load, disk, requests, asyncStorage };
}

const surahPayload = (category, edition, surah, count, text) => ({
  status: 200,
  headers: { 'x-data-version': 'v-test' },
  body: {
    schemaVersion: 1,
    category,
    edition: { id: edition, language: 'ar', displayName: edition },
    surah: { number: surah, ayahs: Array.from({ length: count }, (_, i) => ({ numberInSurah: i + 1, text: `${text} ${i + 1}` })) },
  },
});

test('a whole surah of transliteration comes back keyed by verse', async () => {
  const h = harness(async (url) => {
    assert.ok(url.includes('/transliteration/editions/'), 'asked on the transliteration route');
    return surahPayload('transliteration', 'translit_en_english_transliteration', 1, 7, 'bismi llahi');
  });
  const { getSurahTransliteration } = h.load('src/services/transliteration.ts');
  const map = await getSurahTransliteration(1);
  assert.equal(map.size, 7);
  assert.equal(map.get(1), 'bismi llahi 1');
});

test('a short transliteration is neither shown nor stored', async () => {
  const h = harness(async () => surahPayload('transliteration', 'translit_en_english_transliteration', 1, 6, 'x'));
  const { getSurahTransliteration } = h.load('src/services/transliteration.ts');
  const map = await getSurahTransliteration(1);
  assert.equal(map.size, 0, 'nothing to show under a whole surah');
  assert.ok(!h.disk.has('quran:transliteration:translit_en_english_transliteration:1'), 'and nothing kept under its own key');
});

test('a failed fetch leaves the reader alone instead of throwing', async () => {
  const h = harness(async () => ({ status: 503 }));
  const { getSurahTransliteration } = h.load('src/services/transliteration.ts');
  const map = await getSurahTransliteration(2);
  assert.equal(map.size, 0);
});

test('the transliteration is cached per edition, so a second read costs nothing', async () => {
  let calls = 0;
  const h = harness(async (url) => {
    if (!url.includes('/transliteration/editions/')) return { status: 404 };
    calls += 1;
    return surahPayload('transliteration', 'translit_en_english_transliteration', 112, 4, 'qul');
  });
  const { getSurahTransliteration } = h.load('src/services/transliteration.ts');
  await getSurahTransliteration(112);
  await getSurahTransliteration(112);
  assert.equal(calls, 1, 'the stored copy answered the second read');
});

test('a different edition does not read the previous edition’s copy', async () => {
  const h = harness(async (url) => {
    const id = url.split('/transliteration/editions/')[1].split('/')[0];
    return surahPayload('transliteration', decodeURIComponent(id), 114, 6, id.includes('russian') ? 'ru' : 'en');
  });
  const { getSurahTransliteration } = h.load('src/services/transliteration.ts');
  const en = await getSurahTransliteration(114, 'translit_en_english_transliteration');
  const ru = await getSurahTransliteration(114, 'translit_ru_russian_transliteration');
  assert.notEqual(en.get(1), ru.get(1));
});

test('a page that crosses two surahs takes each line from the right chapter', () => {
  const h = harness(async () => ({ status: 404 }));
  const { attachTransliteration } = h.load('src/services/transliteration.ts');
  /* The end of one surah and the start of the next, as a page holds them. */
  const verses = [
    { verse_key: '2:285', text_uthmani: 'a' },
    { verse_key: '2:286', text_uthmani: 'b' },
    { verse_key: '3:1', text_uthmani: 'c' },
    { verse_key: '3:2', text_uthmani: 'd' },
  ];
  const maps = new Map([
    [2, new Map([[285, 'amana rrasulu'], [286, 'la yukallifu']])],
    [3, new Map([[1, 'alif lam meem'], [2, 'allahu la ilaha']])],
  ]);
  const out = attachTransliteration(verses, (v) => Number(v.verse_key.split(':')[0]), maps);
  assert.deepEqual(out.map((v) => v.transliteration), [
    'amana rrasulu', 'la yukallifu', 'alif lam meem', 'allahu la ilaha',
  ]);
  /* Verse 1 of the second surah must not be given verse 1 of the first. */
  assert.notEqual(out[2].transliteration, out[0].transliteration);
});

test('a verse with no line keeps no field at all', () => {
  const h = harness(async () => ({ status: 404 }));
  const { attachTransliteration } = h.load('src/services/transliteration.ts');
  const out = attachTransliteration(
    [{ verse_key: '36:1', text_uthmani: 'x' }, { verse_key: '36:2', text_uthmani: 'y' }],
    () => 36,
    new Map([[36, new Map([[1, 'yaa seen']])]]),
  );
  assert.equal(out[0].transliteration, 'yaa seen');
  assert.ok(!('transliteration' in out[1]), 'no empty string is invented');
  assert.equal(out[1].text_uthmani, 'y', 'and the verse itself is untouched');
});

test('the reader asks for the transliteration only while the switch is on', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const reader = app.slice(app.indexOf('function ReaderScreen('), app.indexOf('function VerseActionButton('));
  assert.ok(reader.includes('preferences.showTransliteration'), 'the preference the switch stores is read here');
  assert.ok(/transliterationEdition\s*=\s*preferences\.showTransliteration/.test(reader.replace(/\s+/g, ' ').replace(/const /, 'const ')) || reader.includes('? (preferences.transliterationEdition'), 'guarded by the switch');
  assert.ok(reader.includes('v.transliteration'), 'and the line is actually drawn');
});

test('flipping the switch reloads the page it is written on', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const reader = app.slice(app.indexOf('function ReaderScreen('), app.indexOf('function VerseActionButton('));
  /* The reading effect: the one that calls load() and closes with its deps. */
  const effect = reader.match(/useEffect\(\(\)=>\{load\(\);.*?\]/);
  assert.ok(effect, 'the reading effect is where expected');
  assert.ok(
    effect[0].includes('preferences.showTransliteration') && effect[0].includes('preferences.transliterationEdition'),
    'the switch is in the dependency list, or the reader does not redraw until it is left',
  );
});

test('the settings screen offers the switch and only editions that can serve a surah', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const scope = app.slice(app.indexOf('function ReaderSettingsScreen('), app.indexOf('function ReaderSettingsScreen(') + 16000);
  assert.ok(scope.includes('Show the transliteration'), 'the switch is on the screen, not only in the preview');
  assert.ok(scope.includes("getEditions('transliteration')"), 'and the catalogue is loaded');
  assert.ok(scope.includes("servableEditions(all,'transliteration')"), 'filtered to the servable three');
});

test('the new settings copy is written in Arabic too', () => {
  const copy = fs.readFileSync(path.join(__dirname, '../src/services/arabicCopy.ts'), 'utf8');
  for (const key of [
    'THE SOUND',
    'Show the transliteration',
    'The Arabic in Latin letters, under each verse, above the meaning. For reading along while you learn to recite.',
    'Search transliteration',
    'Three transliterations cover the whole Quran. The rest of the catalogue is partial or word-level and is not offered.',
    'Could not load the transliterations',
  ]) {
    assert.ok(copy.includes(`'${key}':`), `${key} has an Arabic line`);
  }
});

test('one function builds the reader key, so the preload and the reader cannot drift', () => {
  const state = fs.readFileSync(path.join(__dirname, '../src/services/quranState.ts'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '../src/services/quranPreload.ts'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  assert.ok(state.includes('export function readerTranslationKey('));
  assert.ok(preload.includes('readerTranslationKey(options.translation'), 'preload saves under the same key');
  assert.ok(app.includes('readerTranslationKey(preferences.translationEdition'), 'reader looks up the same key');
  /* The old string interpolation must be gone, or the two sides disagree. */
  assert.ok(!app.includes('|tl:${transliterationEdition}'), 'no second copy of the key format');
  assert.ok(!preload.includes('|tl:'), 'no second copy of the key format');
});

test('a saved copy without the line is not painted when the switch is on', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  assert.ok(app.includes('cacheUsesTransliteration'), 'the reader asks whether the stored page matches the choice');
  assert.ok(/some\(v=>!!v\.transliteration\)===cacheUsesTransliteration/.test(app.replace(/\s+/g, '')), 'and compares it with what it is about to show');
});

test('preparing an offline copy while the switch is on includes the line', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  assert.ok(app.includes('...(preferences.showTransliteration?{transliteration:'), 'the preload is told about it');
});
