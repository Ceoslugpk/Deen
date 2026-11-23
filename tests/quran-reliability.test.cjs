const assert = require('node:assert/strict');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * Regression tests for the Quran loading and caching repairs.
 *
 * Each one reconstructs a failure that was reproduced against the app's own
 * source before the fix - a 304 with no body, a truncated surah written to the
 * disk, an empty comparison kept for a year - and asserts the behaviour a
 * reader now gets instead. The helper runs the real TypeScript sources; the
 * only stand-ins are the storage engines and the network.
 */

/* ==================== A small storage and network harness ==================== */

function createHarness() {
  const asyncStorage = new Map();
  const disk = new Map();          // contentCache payloads: `${namespace}:${key}` -> JSON string
  const requests = [];             // every URL fetched, in order
  let etags = {};                  // the on-device validator map
  let respond = async () => ({ status: 404, body: '' });

  const contentCache = {
    getCachedJson: async (namespace, key) => {
      const raw = disk.get(`${namespace}:${key}`);
      return raw ? JSON.parse(raw) : null;
    },
    setCachedJson: async (namespace, key, value) => {
      disk.set(`${namespace}:${key}`, JSON.stringify(value));
    },
    removeCachedJson: async (namespace, key) => {
      disk.delete(`${namespace}:${key}`);
    },
    listCachedKeys: async (namespace) => [...disk.keys()]
      .filter((k) => k.startsWith(`${namespace}:`)).map((k) => k.slice(namespace.length + 1)),
    getCacheUsage: async () => ({ totalBytes: 0, entries: disk.size }),
    clearCacheNamespace: async (namespace) => {
      for (const k of [...disk.keys()]) if (k.startsWith(`${namespace}:`)) disk.delete(k);
    },
  };

  const load = createLoader(
    {
      '@react-native-async-storage/async-storage': {
        getItem: async (key) => (key === '@deen/islamic-data/etags/v1'
          ? JSON.stringify(etags)
          : asyncStorage.get(key) ?? null),
        setItem: async (key, value) => {
          if (key === '@deen/islamic-data/etags/v1') { etags = JSON.parse(value); return; }
          asyncStorage.set(key, value);
        },
        removeItem: async (key) => { asyncStorage.delete(key); },
      },
      './contentCache': contentCache,
      'expo-file-system/legacy': {
        documentDirectory: '/tmp/', cacheDirectory: '/tmp/',
        getInfoAsync: async () => ({ exists: false }), makeDirectoryAsync: async () => undefined,
        readAsStringAsync: async () => null, writeAsStringAsync: async () => undefined,
        deleteAsync: async () => undefined,
      },
      'react-native': { Platform: { OS: 'web' } },
    },
    {
      fetch: async (url, init = {}) => {
        requests.push({ url, headers: init.headers || {} });
        const answer = await respond(url, init);
        return {
          status: answer.status,
          headers: { get: (name) => (answer.headers || {})[String(name).toLowerCase()] ?? null },
          text: async () => answer.body ?? '',
          json: async () => JSON.parse(answer.body || 'null'),
          ok: answer.status >= 200 && answer.status < 300,
        };
      },
      indexedDB: undefined,
      AbortController,
      process: { env: {} },
      __DEV__: false,
    },
  );

  return {
    load, asyncStorage, disk, requests,
    etags: () => etags,
    seedEtag(url, value) { etags[url] = value; },
    respondWith(fn) { respond = fn; },
  };
}

/** A surah payload shaped exactly as the Worker sends it. */
function surahBody({ category = 'quran', edition = 'tr_en_saheeh_international', surah = 1, verses = 7, headers = {} } = {}) {
  return {
    status: 200,
    headers: { etag: '"etag-1"', 'x-data-version': 'v-test', ...headers },
    body: JSON.stringify({
      schemaVersion: 1,
      category,
      edition: { id: edition, language: 'en', displayName: edition },
      surah: {
        number: surah,
        ayahs: Array.from({ length: verses }, (_, i) => ({ numberInSurah: i + 1, text: `verse ${i + 1}` })),
      },
    }),
  };
}

/* ==================== Storage layer ==================== */

test('a stored validator with no stored body is dropped, and the surah is fetched once more', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  const url = 'https://api.islamicdata.uz/v1/quran/editions/tr_en_saheeh_international/surahs/1';
  h.seedEtag(url, '"etag-1"');

  let calls = 0;
  h.respondWith(async () => {
    calls += 1;
    // The server holds a copy whose validator we still have, while the body
    // was evicted from the device. Before the fix this answered 304 forever.
    if (h.requests[h.requests.length - 1].headers['If-None-Match']) return { status: 304 };
    return surahBody();
  });

  const api = h.load('src/services/islamicDataApi.ts');
  const result = await api.getSurah('quran', 'tr_en_saheeh_international', 1);

  assert.equal(result.rows.length, 7);
  assert.equal(calls, 2, 'one conditional request, one unconditional retry');
  assert.equal(h.requests[1].headers['If-None-Match'], undefined, 'the retry does not send the stale validator');
});

test('a 304 with no body available fails honestly instead of recursing', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  const url = 'https://api.islamicdata.uz/v1/quran/editions/tr_en_saheeh_international/surahs/1';
  h.seedEtag(url, '"etag-1"');
  h.respondWith(async () => ({ status: 304 }));

  const api = h.load('src/services/islamicDataApi.ts');
  await assert.rejects(() => api.getSurah('quran', 'tr_en_saheeh_international', 1), (error) => {
    assert.equal(error.status, 304);
    return true;
  });
  assert.equal(h.requests.length, 2, 'it stops after the unconditional retry');
});

test('a short surah is never stored, and a stored one is dropped on the next read', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  h.respondWith(async () => surahBody({ verses: 6 }));

  const api = h.load('src/services/islamicDataApi.ts');
  const short = await api.getSurah('quran', 'tr_en_saheeh_international', 1);
  assert.equal(short.rows.length, 6);
  assert.equal(short.complete, false, 'the caller is told it is not the whole chapter');
  assert.ok(
    ![...h.disk.keys()].some((k) => k.includes('surahs') && k.includes(':v-test')),
    'a truncated payload is not written as a good copy',
  );

  // A device that already holds one: the stored copy is refused and replaced.
  const key = 'surah:quran:tr_en_saheeh_international:1:v-test';
  h.disk.set(`quran:${key}`, JSON.stringify({
    dataVersion: 'v-test', fetchedAt: Date.now(), edition: { id: 'tr_en_saheeh_international' },
    rows: [{ verseKey: '1:1', numberInSurah: 1, text: 'verse 1' }],
  }));
  h.respondWith(async () => surahBody());
  const healed = await api.getSurah('quran', 'tr_en_saheeh_international', 1);
  assert.equal(healed.rows.length, 7);
});

test('a body that arrives under a newer snapshot is stored under that snapshot', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-old');
  h.respondWith(async () => surahBody({ headers: { 'x-data-version': 'v-new' } }));

  const api = h.load('src/services/islamicDataApi.ts');
  await api.getSurah('quran', 'tr_en_saheeh_international', 1);

  assert.ok([...h.disk.keys()].some((k) => k.endsWith(':v-new')), 'written at the new version');
  assert.ok(![...h.disk.keys()].some((k) => k.endsWith(':v-old')), 'not left at the old one');
});

/* ==================== Composition ==================== */

test('a failed surah read is reported, not cached as an empty chapter', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  h.respondWith(async () => ({ status: 503 }));

  const api = h.load('src/services/api.ts');
  await assert.rejects(() => api.getVerses(1, {}), /could not be reached/i);
});

test('a good surah still composes exactly as before', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  h.respondWith(async (url) => {
    if (url.includes('/scripts/')) {
      return {
        status: 200, headers: { 'x-data-version': 'v-test' },
        body: JSON.stringify({
          schemaVersion: 1, category: 'scripts', edition: { id: 'uthmani_1', language: 'ar', displayName: 'Uthmani' },
          surah: { number: 1, ayahs: Array.from({ length: 7 }, (_, i) => ({ numberInSurah: i + 1, text: `arabic ${i + 1}` })) },
        }),
      };
    }
    return surahBody();
  });

  const api = h.load('src/services/api.ts');
  const verses = await api.getVerses(1, {});
  assert.equal(verses.length, 7);
  assert.equal(verses[0].verse_key, '1:1');
  assert.equal(verses[0].text_uthmani, 'arabic 1');
  assert.equal(verses[0].translation, 'verse 1');
  assert.equal(verses[0].page, 1);
});

/* ==================== Edition routing ==================== */

test('a legacy translation id reaches the right translation, not the script route', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  const asked = [];
  h.respondWith(async (url) => {
    asked.push(url);
    if (url.endsWith('/quran/editions')) {
      return {
        status: 200, headers: {},
        body: JSON.stringify({
          schemaVersion: 1, category: 'quran',
          editions: [
            { id: 'tr_en_saheeh_international', language: 'en', displayName: 'Saheeh International' },
            { id: 'tr_en_mohammed_marmaduke_william_pickt', language: 'en', displayName: 'Pickthall' },
            { id: 'tr_ur_fateh_muhammad_jalandhry', language: 'ur', displayName: 'Jalandhry' },
          ],
        }),
      };
    }
    if (url.includes('tr_en_mohammed_marmaduke_william_pickt')) return surahBody({ edition: 'tr_en_mohammed_marmaduke_william_pickt' });
    if (url.includes('tr_ur_fateh_muhammad_jalandhry')) {
      return surahBody({ edition: 'tr_ur_fateh_muhammad_jalandhry', headers: {} });
    }
    return { status: 404 };
  });

  const api = h.load('src/services/api.ts');
  const rows = await api.getAyahEditions('1:1', ['en.pickthall', 'ur.jalandhry']);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].edition, 'en.pickthall', 'reported under the id that was asked for');
  assert.equal(rows[0].text, 'verse 1');
  assert.ok(!asked.some((u) => u.includes('/scripts/en.pickthall')), 'never sent to the script route');
});

test('a tafsir id is read from the tafsir catalogue', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  h.respondWith(async (url) => {
    if (url.endsWith('/quran/editions')) {
      return { status: 200, headers: {}, body: JSON.stringify({ schemaVersion: 1, category: 'quran', editions: [{ id: 'tr_en_saheeh_international', language: 'en', displayName: 'Saheeh' }] }) };
    }
    if (url.endsWith('/tafsir/editions')) {
      return {
        status: 200, headers: {},
        body: JSON.stringify({
          schemaVersion: 1, category: 'tafsir',
          editions: [{ id: 'tafsir_ar_jalal_ad_din_al_mahalli_and_jala', language: 'ar', displayName: 'Jalalayn' }],
        }),
      };
    }
    if (url.includes('/tafsir/editions/tafsir_ar_jalal_ad_din_al_mahalli_and_jala/surahs/1')) {
      return {
        status: 200, headers: { 'x-data-version': 'v-test' },
        body: JSON.stringify({
          schemaVersion: 1, category: 'tafsir',
          edition: { id: 'tafsir_ar_jalal_ad_din_al_mahalli_and_jala', language: 'ar', displayName: 'Jalalayn' },
          surah: { number: 1, ayahs: Array.from({ length: 7 }, (_, i) => ({ numberInSurah: i + 1, text: `tafsir ${i + 1}` })) },
        }),
      };
    }
    return { status: 404 };
  });

  const api = h.load('src/services/api.ts');
  const rows = await api.getAyahEditions('1:1', ['ar.jalalayn']);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].text, 'tafsir 1');
  assert.equal(rows[0].language, 'ar');
});

/* ==================== Comparison persistence ==================== */

test('an empty comparison is never stored, and a stored empty one is not used', async () => {
  const h = createHarness();
  h.respondWith(async () => ({ status: 503 }));
  const api = h.load('src/services/api.ts');

  await assert.rejects(() => api.getAyahEditions('1:1', ['tr_en_saheeh_international']));
  assert.equal(h.disk.size, 0, 'nothing was written');
});

/* ==================== Search ==================== */

test('an outage during search is reported, not answered as no matches', async () => {
  const h = createHarness();
  h.respondWith(async () => ({ status: 503 }));
  const api = h.load('src/services/api.ts');
  await assert.rejects(() => api.searchQuran('mercy', 'tr_en_saheeh_international'));
});

test('a bare Arabic query matches fully vocalised Uthmani text', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  h.respondWith(async (url) => {
    if (!url.includes('/scripts/editions/uthmani_1/surahs/')) return { status: 404 };
    const surah = Number(url.split('/').pop());
    return {
      status: 200, headers: { 'x-data-version': 'v-test' },
      body: JSON.stringify({
        schemaVersion: 1, category: 'scripts', edition: { id: 'uthmani_1', language: 'ar', displayName: 'Uthmani' },
        surah: {
          number: surah,
          ayahs: Array.from({ length: surah === 1 ? 7 : 1 }, (_, i) => ({
            numberInSurah: i + 1,
            text: i === 0 ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' : `x${i}`,
          })),
        },
      }),
    };
  });
  const api = h.load('src/services/api.ts');
  const results = await api.searchQuran('الرحمن', 'quran-uthmani');
  assert.ok(results.length >= 1, 'the typed word is found');
  assert.ok(results[0].text.includes('ٱلرَّحْمَـٰنِ'), 'and the verse is shown exactly as the source writes it');
});

test('an Arabic search reads the Arabic script route rather than the translation one', async () => {
  const h = createHarness();
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');
  const asked = [];
  h.respondWith(async (url) => {
    asked.push(url);
    if (!url.includes('/scripts/editions/uthmani_1/surahs/')) return { status: 404 };
    const surah = Number(url.split('/').pop());
    return {
      status: 200, headers: { 'x-data-version': 'v-test' },
      body: JSON.stringify({
        schemaVersion: 1, category: 'scripts', edition: { id: 'uthmani_1', language: 'ar', displayName: 'Uthmani' },
        surah: { number: surah, ayahs: Array.from({ length: surah === 1 ? 7 : 3 }, (_, i) => ({ numberInSurah: i + 1, text: i === 0 ? 'بسم الله' : `x${i}` })) },
      }),
    };
  });

  const api = h.load('src/services/api.ts');
  const results = await api.searchQuran('بسم', 'quran-uthmani');
  assert.ok(results.length >= 1);
  assert.equal(results[0].surahId, 1);
  assert.ok(asked.every((u) => u.includes('/scripts/editions/uthmani_1/')), 'every request went to the script route');
});

/* ==================== Directions ==================== */

test('edition direction follows the script, not just Arabic', async () => {
  const h = createHarness();
  h.respondWith(async (url) => {
    if (!url.endsWith('/quran/editions')) return { status: 404 };
    return {
      status: 200, headers: {},
      body: JSON.stringify({
        schemaVersion: 1, category: 'quran',
        editions: [
          { id: 'tr_ur_x', language: 'ur', displayName: 'Urdu' },
          { id: 'tr_fa_x', language: 'fa', displayName: 'Persian' },
          { id: 'tr_en_x', language: 'en', displayName: 'English' },
        ],
      }),
    };
  });
  const api = h.load('src/services/api.ts');
  const editions = await api.getQuranEditions('translation');
  const byId = Object.fromEntries(editions.map((e) => [e.identifier, e.direction]));
  assert.equal(byId.tr_ur_x, 'rtl');
  assert.equal(byId.tr_fa_x, 'rtl');
  assert.equal(byId.tr_en_x, 'ltr');
});

/* ==================== Background refresh ==================== */

test('a failing background refresh is contained, and the stale copy is still served', async () => {
  const h = createHarness();
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on('unhandledRejection', onUnhandled);
  try {
    const { cached } = h.load('src/services/requestCache.ts');
    await cached('quran', 'probe', async () => 'first', { ttlMs: 0, staleMs: 60000, memoryOnly: false });
    // A second loader instance starts with an empty memory, so the stored copy
    // is stale and its refresh runs behind the answer.
    h.respondWith(async () => ({ status: 503 }));
    const load2 = h.load('src/services/requestCache.ts');
    let calls = 0;
    const value = await load2.cached('quran', 'probe', async () => { calls += 1; throw new Error('offline'); }, { ttlMs: 0, staleMs: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(value, 'first');
    assert.equal(calls, 1, 'the refresh did run');
    assert.deepEqual(unhandled, [], 'and its failure was handled');
  } finally {
    process.off('unhandledRejection', onUnhandled);
  }
});

/* ==================== Preservation of what is already on the device ==================== */

test('repairing one damaged entry leaves bookmarks, notes, preferences and good downloads untouched', async () => {
  const h = createHarness();

  /* A device as it might really be: someone mid-way through a Quran reading. */
  const preferences = { translationEdition: 'tr_ur_fateh_muhammad_jalandhry', translationName: 'فتح محمد جالندھری', translationLanguage: 'Urdu', scriptEdition: 'quran-uthmani', fontSize: 22 };
  const bookmarks = [{ verseKey: '2:255', chapterId: 2, ayah: 255, createdAt: 1 }];
  const notes = [{ verseKey: '18:10', text: 'mine', updatedAt: 2 }];
  h.asyncStorage.set('@deen/quran/preferences/v1', JSON.stringify(preferences));
  h.asyncStorage.set('@deen/quran/bookmarks/v1', JSON.stringify(bookmarks));
  h.asyncStorage.set('@deen/quran/notes/v1', JSON.stringify(notes));
  h.asyncStorage.set('@deen/islamic-data/data-version/v1', 'v-test');

  const goodSurah1 = Array.from({ length: 7 }, (_, i) => ({ verse_key: `1:${i + 1}`, text_uthmani: `a${i + 1}`, translation: `t${i + 1}` }));
  const goodSurah2 = Array.from({ length: 286 }, (_, i) => ({ verse_key: `2:${i + 1}`, text_uthmani: `b${i + 1}`, translation: '' }));
  const damaged = goodSurah1.slice(0, 3);

  const quranState = h.load('src/services/quranState.ts');
  /* The keys are built by the app's own function, so the test cannot drift
     from what the reader actually stores and looks up. */
  const cacheKey = (chapterId) => quranState.readerCacheKey({
    section: 'surah', chapterId, script: 'quran-uthmani', translation: 'tr_ur_fateh_muhammad_jalandhry',
  });
  const keyGood1 = cacheKey(1);
  const keyGood2 = cacheKey(2);
  const keyBad = cacheKey(3);
  h.disk.set(`quran:${keyGood1}`, JSON.stringify(goodSurah1));
  h.disk.set(`quran:${keyGood2}`, JSON.stringify(goodSurah2));
  h.disk.set(`quran:${keyBad}`, JSON.stringify(damaged));

  assert.equal((await quranState.loadSurahCache(keyGood1, 7)).length, 7, 'the good surah still reads');
  assert.equal((await quranState.loadSurahCache(keyGood2, 286)).length, 286, 'so does the long one');
  assert.equal(await quranState.loadSurahCache(keyBad, 200), null, 'the short one is refused');

  /* Compared as JSON: the records are identical data, and they are read back
     through a separate module instance, so identity is not the question. */
  assert.equal(JSON.stringify(await quranState.loadBookmarks()), JSON.stringify(bookmarks));
  assert.equal(JSON.stringify(await quranState.loadNotes()), JSON.stringify(notes));
  assert.equal(JSON.stringify(await quranState.loadQuranPreferences()), JSON.stringify({ ...quranState.DEFAULTS, ...preferences }));

  /* Refused, but not deleted: the next good read has somewhere to replace it,
     and nothing else in the library was touched. */
  assert.ok(h.disk.has(`quran:${keyBad}`), 'the damaged entry is left for its next good read');
  assert.ok(h.disk.has(`quran:${keyGood1}`) && h.disk.has(`quran:${keyGood2}`));
  assert.equal(h.disk.size, 3, 'no other stored payload was written or removed');
});

/* ==================== Payload validation ==================== */

test('a stored reader payload is judged against the chapter, not against itself', async () => {
  const h = createHarness();
  const payloads = h.load('src/services/quranPayloads.ts');
  const seven = Array.from({ length: 7 }, (_, i) => ({ verse_key: `1:${i + 1}`, text_uthmani: `a${i + 1}`, translation: '' }));
  assert.equal(payloads.quranPayloadProblem(seven, 7), null);
  assert.match(payloads.quranPayloadProblem(seven.slice(0, 6), 7), /6 of 7/);
  assert.match(payloads.quranPayloadProblem([{ verse_key: '1:1', text_uthmani: '' }], 1), /no Arabic/);
  assert.equal(payloads.quranPayloadProblem([], 0) !== null, true);
});
