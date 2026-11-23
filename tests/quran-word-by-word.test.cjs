const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * The Quran word by word.
 *
 * Two things are worth holding here, and one of them is the reason this file
 * exists at all:
 *
 *   1. The Arabic under the reader must stay the reader's Arabic. The
 *      word-level script on the server is a different transcription pass from
 *      the ayah-level text the app shows, so using it would have quietly
 *      replaced what a person is reading. The words come from the verse's own
 *      text instead; nothing here may reintroduce the other copy.
 *
 *   2. A word must never take its neighbour's meaning. The files count waqf
 *      marks and the ayah number as word slots, so the two lists are never the
 *      same length. Everything that does not pair exactly is shown unlabelled.
 */

/* The loader hands back proxied values from the TypeScript module; comparing
   them structurally needs plain ones. */
const plain = (value) => JSON.parse(JSON.stringify(value));

function harness(respond) {
  const disk = new Map();
  const requests = [];
  const cache = {
    getCachedJson: async (n, k) => { const raw = disk.get(`${n}:${k}`); return raw ? JSON.parse(raw) : null; },
    setCachedJson: async (n, k, v) => { disk.set(`${n}:${k}`, JSON.stringify(v)); },
    removeCachedJson: async (n, k) => { disk.delete(`${n}:${k}`); },
    listCachedKeys: async () => [], getCacheUsage: async () => ({}), clearCacheNamespace: async () => {},
  };
  const load = createLoader({
    './contentCache': cache,
    'react-native': { Platform: { OS: 'web' } },
  }, {
    fetch: async (url) => {
      requests.push(url);
      const answer = await respond(url);
      return {
        ok: answer.status >= 200 && answer.status < 300,
        status: answer.status,
        headers: { get: () => null },
        json: async () => answer.body,
        text: async () => (answer.body === undefined ? '' : JSON.stringify(answer.body)),
      };
    },
    process: { env: {} },
    AbortController,
    __DEV__: false,
  });
  return { load, disk, requests };
}

/* ------------------------------------------------------------------ */
/* Splitting the verse the reader already has                          */
/* ------------------------------------------------------------------ */

test('a verse is split on spaces, in the order it is written', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { wordsForAyah } = h.load('src/services/wordByWord.ts');
  assert.deepEqual(
    plain(wordsForAyah('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ')),
    ['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَـٰنِ', 'ٱلرَّحِيمِ'],
  );
});

test('a standalone waqf mark is not a word anyone reads', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { wordsForAyah } = h.load('src/services/wordByWord.ts');
  /* '۟' on its own carries no meaning and has nothing to label. */
  assert.deepEqual(plain(wordsForAyah('كِتَـٰبٌ ۟ فِيهِ')), ['كِتَـٰبٌ', 'فِيهِ']);
  assert.deepEqual(plain(wordsForAyah('ۛ ۛ')), []);
});

/* ------------------------------------------------------------------ */
/* Pairing - the part that can go silently wrong                       */
/* ------------------------------------------------------------------ */

test('every word takes its own meaning, in order', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { pairWords } = h.load('src/services/wordByWord.ts');
  const out = plain(pairWords(['أ', 'ب', 'ج'], ['one', 'two', 'three']));
  assert.deepEqual(out, [
    { word: 'أ', meaning: 'one' },
    { word: 'ب', meaning: 'two' },
    { word: 'ج', meaning: 'three' },
  ]);
});

test('a trailing ayah-number slot does not shift the words', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { pairWords } = h.load('src/services/wordByWord.ts');
  /* The real shape: four words in the verse, five slots in the file, the last
     of which is the ayah number. Pairing by index alone would put the number
     under the last word - or drop it and shift everything. */
  const out = pairWords(['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَـٰنِ', 'ٱلرَّحِيمِ'], [
    'In (the) name', '(of) Allah', 'the Most Gracious', 'the Most Merciful', '(1)',
  ]);
  assert.deepEqual(plain(out).map((entry) => entry.meaning), [
    'In (the) name', '(of) Allah', 'the Most Gracious', 'the Most Merciful',
  ]);
  assert.equal(out.length, 4);
});

test('an empty meaning is kept as a gap, not filled with a neighbour’s', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { pairWords } = h.load('src/services/wordByWord.ts');
  /* 280 Urdu entries are blank upstream - the same blanks quran.com serves.
     The word must stay unlabelled; borrowing the next meaning would read as
     though it had been translated. */
  const out = plain(pairWords(['مِن', 'بَعْدُ'], ['', 'after']));
  assert.deepEqual(out, [{ word: 'مِن', meaning: '' }, { word: 'بَعْدُ', meaning: 'after' }]);
});

test('a verse that cannot be paired is refused rather than guessed', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { pairWords } = h.load('src/services/wordByWord.ts');
  /* Two words, five meanings, no way to know which three are missing: every
     possible pairing would mislabel something. */
  assert.equal(pairWords(['أ', 'ب'], ['one', 'two', 'three', 'four', 'five']), null);
  assert.equal(pairWords([], ['one']), null);
  assert.equal(pairWords(['أ'], []), null);
});

test('the mark pattern is taken from the tail, so words keep their order', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { markSlots } = h.load('src/services/wordByWord.ts');
  assert.deepEqual(plain(markSlots(5, 4)), [false, false, false, false, true]);
  assert.deepEqual(plain(markSlots(3, 3)), [false, false, false]);
  assert.deepEqual(plain(markSlots(0, 0)), []);
});

/* ------------------------------------------------------------------ */
/* Fetching one surah                                                  */
/* ------------------------------------------------------------------ */

const file = (surah, entries) => {
  const out = {};
  for (const [ayah, words] of Object.entries(entries)) {
    words.forEach((text, i) => { out[`${surah}:${ayah}:${i + 1}`] = text; });
  }
  return out;
};

test('only the requested surah comes back, keyed by ayah', async () => {
  const h = harness(async () => ({
    status: 200,
    body: { ...file(1, { 1: ['In (the) name', '(of) Allah'], 2: ['All praise'] }), ...file(2, { 1: ['Alif', 'Lam', 'Meem'] }) },
  }));
  const { getSurahWordByWord } = h.load('src/services/wordByWord.ts');
  const map = await getSurahWordByWord(1);
  assert.deepEqual(plain(map.get(1)), ['In (the) name', '(of) Allah']);
  assert.deepEqual(plain(map.get(2)), ['All praise']);
  assert.equal(map.size, 2, 'surah 2 was not mixed in');
});

test('the whole file is downloaded once, then the surah comes off the disk', async () => {
  let downloads = 0;
  const h = harness(async () => { downloads += 1; return { status: 200, body: file(112, { 1: ['Say', 'He is Allah'] }) }; });
  const { getSurahWordByWord } = h.load('src/services/wordByWord.ts');
  await getSurahWordByWord(112);
  await getSurahWordByWord(112);
  assert.equal(downloads, 1, 'the stored copy answered the second read');
});

test('two editions are stored apart', async () => {
  const h = harness(async (url) => ({
    status: 200,
    body: url.includes('urud') ? file(1, { 1: ['نام کے ساتھ'] }) : file(1, { 1: ['In (the) name'] }),
  }));
  const { getSurahWordByWord } = h.load('src/services/wordByWord.ts');
  const en = await getSurahWordByWord(1, 'wbw_en');
  const ur = await getSurahWordByWord(1, 'wbw_ur');
  assert.notDeepEqual(plain(en.get(1)), plain(ur.get(1)));
});

test('the file path keeps its separators when it is encoded', async () => {
  /* An encoded slash (%2F) is a malformed path to the file route: it answers
     400 and every verse silently loses its words. */
  const h = harness(async () => ({ status: 200, body: file(1, { 1: ['x'] }) }));
  const { getSurahWordByWord } = h.load('src/services/wordByWord.ts');
  await getSurahWordByWord(1);
  assert.equal(h.requests.length, 1);
  assert.ok(h.requests[0].includes('/Quran/word-by-word/en_english/'), h.requests[0]);
  assert.ok(!h.requests[0].includes('%2F'), 'the separators are not encoded');
});

test('a missing list is refused, not thrown over', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { pairWords } = h.load('src/services/wordByWord.ts');
  assert.equal(pairWords(['أ'], undefined), null);
  assert.equal(pairWords(undefined, ['one']), null);
});

test('a failed download leaves the reader alone instead of throwing', async () => {
  const h = harness(async () => ({ status: 503 }));
  const { getSurahWordByWord } = h.load('src/services/wordByWord.ts');
  const map = await getSurahWordByWord(2);
  assert.equal(map.size, 0);
});

test('an unknown edition asks for nothing', async () => {
  const h = harness(async () => ({ status: 200, body: {} }));
  const { getSurahWordByWord } = h.load('src/services/wordByWord.ts');
  const map = await getSurahWordByWord(1, 'wbw_tr_phrase_level');
  assert.equal(map.size, 0);
  assert.equal(h.requests.length, 0, 'no request was made for an edition we cannot pair');
});

test('every offered edition is one that was measured as aligned', async () => {
  const h = harness(async () => ({ status: 404 }));
  const { WORD_BY_WORD_EDITIONS } = h.load('src/services/wordByWord.ts');
  assert.ok(WORD_BY_WORD_EDITIONS.length >= 1);
  for (const edition of WORD_BY_WORD_EDITIONS) {
    assert.equal(edition.aligned, true, `${edition.id} is offered only because it pairs`);
    assert.ok(edition.path.startsWith('Quran/') || edition.path.startsWith('Transliteration/'));
  }
  /* Measured at 41.9%, 41.2%, 16.9% and 25.6% word-aligned: phrase-level
     renderings that cannot be placed under the right word. */
  for (const banned of ['tr_turkish', 'hi_hindi', 'ta_tamil', 'inh_ingush']) {
    assert.ok(!WORD_BY_WORD_EDITIONS.some((edition) => edition.path.includes(banned)), `${banned} is not offered`);
  }
});

/* ------------------------------------------------------------------ */
/* The reader                                                          */
/* ------------------------------------------------------------------ */

test('the reader draws the words from the verse it was given', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const reader = app.slice(app.indexOf('function ReaderScreen('), app.indexOf('function VerseActionButton('));
  assert.ok(reader.includes('v.wordByWord'), 'the paired words are what is drawn');
  assert.ok(reader.includes('entry.word'), 'each cell shows the word from the verse');
  /* The Arabic must not be re-sourced from the word-level file. */
  assert.ok(!reader.includes('wordScript'), 'no second Arabic source in the reader');
  assert.ok(reader.includes('v.text_uthmani'), 'the plain line still falls back to the verse text');
});

test('the switch feeds the request and reloads the page', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const reader = app.slice(app.indexOf('function ReaderScreen('), app.indexOf('function VerseActionButton('));
  assert.ok(/const wbwEdition=\(preferences\.showWordByWord/.test(reader), 'asked for only while it is on');
  assert.ok(reader.includes('...(wbwEdition?{wordByWord:wbwEdition}:{})'), 'and passed to the fetch');
  const effect = reader.match(/useEffect\(\(\)=>\{load\(\);.*?\]/);
  assert.ok(effect && effect[0].includes('preferences.showWordByWord'), 'the switch is in the dependency list');
  assert.ok(reader.includes('cacheUsesWordByWord'), 'a saved page is only painted for the choice it was saved under');
});

test('the settings offer the switch and the seven languages', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const scope = app.slice(app.indexOf('function ReaderSettingsScreen('), app.indexOf('function ReaderSettingsScreen(') + 18000);
  assert.ok(scope.includes("T('WORD BY WORD')"), 'its own group');
  assert.ok(scope.includes('WORD_BY_WORD_EDITIONS.map'), 'the languages are listed');
  assert.ok(scope.includes('showWordByWord:!preferences.showWordByWord'), 'the switch toggles');
});

test('the new copy is written in Arabic too', () => {
  const copy = fs.readFileSync(path.join(__dirname, '../src/services/arabicCopy.ts'), 'utf8');
  for (const key of [
    'WORD BY WORD',
    'Word by word',
    'Each word of the verse with its own meaning underneath. A word that has no meaning in this language is left unlabelled rather than filled in.',
    'Seven languages pair with the Arabic word for word. Ottoman Turkish, Hindi, Tamil and Ingush are word-for-word renderings of whole phrases, so their entries cannot be placed under the right word and are not offered.',
  ]) {
    assert.ok(copy.includes(`'${key}':`), `${key.slice(0, 40)} has an Arabic line`);
  }
});
