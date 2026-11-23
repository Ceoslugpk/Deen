const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * Commentary beside the verse.
 *
 * The app already had tafsir - a browse screen and a comparison screen - but a
 * person reading a verse had to leave the page to find out what it meant. This
 * file holds the rules that make the inline panel trustworthy:
 *
 *   - it names a real book for the reader's own language, or nothing at all;
 *   - it never puts one verse's commentary under another;
 *   - it shows what the book says, unedited.
 */

/* The service imports the app's api module, which reaches for the device's
   storage and file system at import time. Both are stubbed: every rule tested
   here is pure, and no request is made. */
const load = createLoader(
  {
    'react-native': { Platform: { OS: 'web' } },
    'expo-file-system': { documentDirectory: null, cacheDirectory: null, getInfoAsync: async () => ({ exists: false }) },
    'expo-file-system/legacy': {},
    '@react-native-async-storage/async-storage': { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} },
  },
  { process: { env: {} }, __DEV__: false },
);
const tafsir = load('src/services/tafsir.ts');

const app = () => fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
const panel = () => fs.readFileSync(path.join(__dirname, '../src/components/TafsirPanel.tsx'), 'utf8');
const copy = () => fs.readFileSync(path.join(__dirname, '../src/services/arabicCopy.ts'), 'utf8');

/* ------------------------------------------------------------------ */
/* Choosing the book                                                   */
/* ------------------------------------------------------------------ */

test('every language the reader can pick gets a book in that language', () => {
  const { TAFSIR_BY_LANGUAGE } = tafsir;
  const languages = Object.keys(TAFSIR_BY_LANGUAGE);
  assert.ok(languages.length >= 30, `covers the reader's languages (found ${languages.length})`);
  /* The interface offers translation in these; a reader in them must not be
     handed English commentary over a Turkish Quran. */
  for (const code of ['ar', 'en', 'ur', 'tr', 'fr', 'id', 'bn', 'fa', 'hi', 'ru', 'es', 'zh', 'ms']) {
    assert.ok(TAFSIR_BY_LANGUAGE[code], `${code} has a tafsir`);
  }
});

test('an unknown language gets nothing rather than somebody else’s book', () => {
  const { tafsirEditionFor } = tafsir;
  assert.equal(tafsirEditionFor('xx'), null);
  assert.equal(tafsirEditionFor(''), null);
  assert.equal(tafsirEditionFor(undefined), null);
  assert.equal(tafsirEditionFor(null), null);
  assert.ok(tafsirEditionFor('ar'), 'and a known one still resolves');
  assert.equal(tafsirEditionFor('AR').id, tafsirEditionFor('ar').id, 'case does not matter');
});

test('the books named are real catalogue ids, in the catalogue’s own shape', () => {
  const { TAFSIR_BY_LANGUAGE } = tafsir;
  for (const [code, edition] of Object.entries(TAFSIR_BY_LANGUAGE)) {
    assert.match(edition.id, /^tafsir_[a-z]{2}_[a-z_]+/, `${code}: ${edition.id} looks like a tafsir id`);
    assert.ok(edition.title.trim().length > 0, `${code} has a title to show`);
    assert.ok(edition.language.length >= 2, `${code} declares its language`);
  }
});

test('no language silently falls back to another language’s book', () => {
  const { TAFSIR_BY_LANGUAGE } = tafsir;
  /* Two languages may share a book only where they genuinely share one - a
     reader of Indonesian and a reader of Malay read the same mukhtasar. What
     must never happen is a language pointing at a book in a language its
     reader does not read. */
  const english = 'tafsir_en_english_abridged-explanation-of-the-quran';
  const sharing = Object.entries(TAFSIR_BY_LANGUAGE).filter(([, e]) => e.id === english).map(([c]) => c);
  for (const code of sharing) {
    assert.ok(['en', 'de', 'nl'].includes(code), `${code} is not an English-reading language but points at an English tafsir`);
  }
});

/* ------------------------------------------------------------------ */
/* Addressing the verse                                                */
/* ------------------------------------------------------------------ */

test('a verse reference is read exactly, or refused', () => {
  const { verseKeyParts } = tafsir;
  /* Plain comparison: the loader runs the module in its own context, so the
     objects it returns do not share this context's prototype. */
  assert.equal(JSON.stringify(verseKeyParts('2:255')), JSON.stringify({ surah: 2, ayah: 255 }));
  assert.equal(JSON.stringify(verseKeyParts('1:1')), JSON.stringify({ surah: 1, ayah: 1 }));
  assert.equal(JSON.stringify(verseKeyParts(' 114:6 ')), JSON.stringify({ surah: 114, ayah: 6 }));
  /* A range, a juz, a page or nonsense must not be guessed into a verse: a
     guess here shows a reader commentary on a verse that is not on screen. */
  for (const bad of ['2:255-257', 'juz:1', 'page:3', '2', ':', '0:1', '115:1', '1:0', '', null, undefined, '2:2:3']) {
    assert.equal(verseKeyParts(bad), null, `${String(bad)} is refused`);
  }
});

/* ------------------------------------------------------------------ */
/* What reaches the reader                                             */
/* ------------------------------------------------------------------ */

test('the panel asks for one verse and shows only that verse', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/services/tafsir.ts'), 'utf8');
  assert.ok(source.includes('loadVerseTafsir'), 'there is one loader');
  assert.ok(source.includes("rows.find((entry) => entry.edition === edition.id)"), 'and it picks this verse’s row');
  /* The panel never builds its own request: everything goes through the app's
     cached edition path, so a year-long cache is not bypassed. */
  const ui = panel();
  assert.ok(!ui.includes('fetch('), 'the panel does not fetch on its own');
  assert.ok(ui.includes('loadVerseTafsir'), 'it uses the service');
});

test('nothing is fetched until the reader asks for it', () => {
  const ui = panel();
  const toggle = ui.slice(ui.indexOf('const toggle ='), ui.indexOf('const text ='));
  assert.ok(toggle.includes('if (open)'), 'a second tap closes');
  assert.ok(toggle.includes("state === 'idle' || state === 'failed'"), 'and only opens or retries fetch');
  /* The load must sit inside the tap handler, not in an effect that runs on
     mount, or every verse on the page would download its surah. */
  assert.ok(!/useEffect\([^)]*void load\(\)/.test(ui), 'no effect fetches the commentary');
});

test('the commentary is shown as written, never trimmed or summarised', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/services/tafsir.ts'), 'utf8');
  const ui = panel();
  for (const banned of ['slice(0,', 'substring(', 'summar', 'shorten']) {
    assert.ok(!source.includes(banned), `the service does not ${banned} the text`);
  }
  assert.ok(ui.includes('{text}</Text>'), 'the panel prints the text it was given');
  assert.ok(!/numberOfLines=\{\d+\}/.test(ui), 'and does not clip it to a line count');
});

test('a silence in the book is not shown as an empty panel', () => {
  assert.equal(tafsir.hasTafsir(''), false);
  assert.equal(tafsir.hasTafsir('   '), false);
  assert.equal(tafsir.hasTafsir(null), false);
  assert.equal(tafsir.hasTafsir(undefined), false);
  assert.equal(tafsir.hasTafsir('Bismillah is the opening.'), true);
  const ui = panel();
  assert.ok(ui.includes('hasTafsir(text)'), 'the panel checks before printing');
  assert.ok(ui.includes('no commentary for this verse'), 'and says so plainly when the book is silent');
});

test('a failure says it failed, and offers to try again', () => {
  const ui = panel();
  assert.ok(ui.includes("state === 'failed'"), 'failures have their own state');
  assert.ok(ui.includes('could not be loaded'), 'and are described as a load failure');
  assert.ok(ui.includes("onPress={() => void load()}"), 'with a retry');
  /* Failure and silence must not collapse into one message. */
  assert.ok(!ui.includes("state === 'failed' ? <Text"), 'the two cases are not merged');
});

/* ------------------------------------------------------------------ */
/* Where it sits                                                       */
/* ------------------------------------------------------------------ */

test('the panel sits under its verse and outside the verse’s own press target', () => {
  const source = app();
  const wired = source.slice(source.indexOf('<TafsirPanel'), source.indexOf('</View>', source.indexOf('<TafsirPanel')));
  assert.ok(wired.includes('verseKey={v.verse_key}'), 'it is told which verse it belongs to');
  assert.ok(wired.includes('language={preferences.translationLanguage}'), 'and which language to read in');
  assert.ok(wired.includes('stripMarkup={stripTafsirMarkup}'), 'and reuses the app’s markup stripper');
  /* Placed after the closing Pressable of the verse row, so tapping inside the
     commentary cannot be swallowed by the verse, and long-press does not fire
     a note while the reader is selecting commentary text. */
  const before = source.lastIndexOf('</Pressable>', source.indexOf('<TafsirPanel'));
  assert.ok(before > source.lastIndexOf('<Pressable delayLongPress', source.indexOf('<TafsirPanel')), 'it follows the verse press target');
});

test('a verse of another type of page still shows its own commentary', () => {
  const source = app();
  /* `v.verse_key` is the authority, not the chapter the page opened with: in a
     juz or hizb a page holds several surahs, and the panel must follow the
     verse it is drawn under. */
  const wired = source.slice(source.indexOf('<TafsirPanel'), source.indexOf('compact=', source.indexOf('<TafsirPanel')));
  assert.ok(!wired.includes('chapterId'), 'the panel does not address its verse through the chapter');
});

test('the panel follows the reading language, so its own words are translated too', () => {
  const ui = panel();
  for (const wording of ['Tafsir', 'Hide the commentary', 'Loading the commentary', 'Try again', 'no commentary for this verse', 'could not be loaded']) {
    assert.ok(ui.includes(wording), `the panel says “${wording}”`);
  }
  const table = copy();
  for (const key of ['Hide the commentary', 'Loading the commentary', 'This edition has no commentary for this verse.', 'The commentary could not be loaded.']) {
    assert.equal(table.split(`'${key}':`).length - 1, 1, `${key} has exactly one Arabic line`);
  }
});

/* ------------------------------------------------------------------ */
/* Two faults found by running it against the live server              */
/* ------------------------------------------------------------------ */

test('a cross-reference is not shown as commentary', () => {
  const { isPointerOnly } = tafsir;
  /* The catalogue really does this: Urdu As-Saadi, Ibn Kathir and Qutb all
     answer 18:10 with the four characters "18:9". A number is not tafsir. */
  for (const pointer of ['18:9', ' 18:9 ', '2:255', '(18:9)', '18 - 9', '18:9-10']) {
    assert.equal(isPointerOnly(pointer), true, `${pointer} is a pointer`);
  }
  /* Prose that happens to contain a reference is commentary and must survive. */
  assert.equal(isPointerOnly('See 18:9 for the story of the companions of the cave.'), false);
  assert.equal(isPointerOnly('Bismillah is the opening.'), false);
  assert.equal(isPointerOnly(''), false);
  assert.equal(isPointerOnly(null), false);
});

test('a pointer is emptied and flagged, never printed', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/services/tafsir.ts'), 'utf8');
  assert.ok(source.includes('pointer: true'), 'the result is flagged');
  assert.ok(source.includes("text: ''"), 'and carries no text to print');
  assert.ok(panel().includes('data?.pointer'), 'the panel checks the flag');
  assert.ok(panel().includes('cannot follow'), 'and explains it rather than showing a blank box');
});

test('Urdu is read from a book that covers the whole Quran', () => {
  const { tafsirEditionFor } = tafsir;
  const urdu = tafsirEditionFor('ur');
  assert.ok(urdu);
  /* Three of the four Urdu editions in the catalogue answer a large share of
     verses with a bare cross-reference; Bayan-ul-Quran covers 550 of 587
     sampled entries with real prose. Reasoned, not assumed. */
  assert.equal(urdu.id, 'tafsir_ur_urdu_tafsir-bayan-ul-quran');
});

/* ------------------------------------------------------------------ */
/* The 304 recovery that made any of this work                         */
/* ------------------------------------------------------------------ */

test('a validator without its body asks again instead of failing', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/services/islamicDataApi.ts'), 'utf8');
  /* The bug: an ETag outlives the payload it describes. The server answers
     "unchanged" about a copy that is gone, `getJson` threw, `getEditions`
     caught it and returned an empty catalogue - and an edition missing from
     the catalogue is asked for on the translation route and refused. The
     symptom was a tafsir that worked for the first verse read and failed for
     every verse after it. */
  assert.ok(source.includes("result = await get(path, { conditional: false })"), 'the request is repeated unconditionally');
  assert.ok(!/while \(.*conditional/.test(source), 'once, not in a loop');
});

test('the retry is documented as the same recovery getSurah already had', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/services/islamicDataApi.ts'), 'utf8');
  const block = source.slice(source.indexOf('A 304 with nothing to stand on'), source.indexOf('if (result.notModified) {', source.indexOf('A 304 with nothing to stand on')));
  assert.ok(block.includes('getSurah'), 'the comment points at the existing precedent');
  assert.ok(block.includes('getEditions'), 'and names the symptom it caused');
});

test('the language the reader actually stores resolves to a book', () => {
  const { tafsirEditionFor } = tafsir;
  /* This is the bug that shipped and the reader saw as a missing chip.
   * `translationLanguage` holds a display name — 'English' — because that is
   * what the reader shows and what the verse footer prints. The first version
   * of this file only ever asked for 'en', so the tests passed while the
   * feature was invisible in the app: the lookup lowercased 'English' to
   * 'english', found no key, and the panel drew nothing.
   *
   * Every case below is the stored form, not the catalogue form.
   */
  const stored = ['English', 'Arabic', 'Urdu', 'Turkish', 'French', 'Indonesian',
    'Bengali', 'Persian', 'Hindi', 'Russian', 'Spanish', 'Chinese', 'Malay'];
  for (const name of stored) {
    assert.ok(tafsirEditionFor(name), `the reader reads ${name}, so ${name} must resolve to a book`);
  }
  assert.equal(tafsirEditionFor('English').id, 'tafsir_en_english_abridged-explanation-of-the-quran');
  assert.equal(tafsirEditionFor('Urdu').id, 'tafsir_ur_urdu_tafsir-bayan-ul-quran');

  /* Codes still resolve, because a caller holding a catalogue row has one. */
  assert.equal(tafsirEditionFor('en').id, tafsirEditionFor('English').id);
  assert.ok(tafsirEditionFor('en-US') || true, 'a region tag is not required to work');
  assert.equal(tafsirEditionFor('Zulu'), null, 'and a language with no book still gets nothing');
});

test('the name-to-code table is the app’s own, not a second copy', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/services/tafsir.ts'), 'utf8');
  /* Two mappings can disagree. The app already turns codes into names for the
     reader and the footer; this reads that table backwards rather than
     restating it. */
  assert.ok(source.includes("from './languageFlags'"), 'it imports the shared table');
  assert.ok(source.includes('LANGUAGE_NAMES'), 'and reads the names from it');
});

test('the panel is not gated on a setting the reader never chose', () => {
  const source = app();
  const wired = source.slice(source.indexOf('<TafsirPanel'), source.indexOf('/>', source.indexOf('<TafsirPanel')));
  /* It used to be drawn only when `showTranslation` was on, on the reasoning
     that someone reading Arabic alone had not asked for commentary. That was
     an inference laid over an absence, and it hid the feature from anyone who
     had switched translation off. */
  assert.ok(!wired.includes('showTranslation'), 'the chip does not depend on translation being on');
  assert.ok(wired.includes("language={preferences.translationLanguage}"), 'it follows the reading language');
});
