const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * Roots and lemmas under the words of a verse.
 *
 * These hang on the word cells the reader already draws, at the same
 * `surah:ayah:word` position the meaning took. The rule that matters: a word
 * gets its *own* root or none at all. A root on the wrong word teaches the
 * wrong thing, and looks perfectly plausible while doing it.
 */

const load = () => createLoader({ 'react-native': { Platform: { OS: 'web' } } }, { process: { env: {} }, __DEV__: false });
const plain = (value) => JSON.parse(JSON.stringify(value));

test('the bundled table carries the whole catalogue', () => {
  const { morphologyTotals } = load()('src/services/morphology.ts');
  const totals = plain(morphologyTotals());
  assert.equal(totals.roots, 1642, 'every root in the source');
  assert.equal(totals.lemmas, 4817, 'every lemma in the source');
});

test('a word knows its root, and the root its size', () => {
  const { wordMorphology } = load()('src/services/morphology.ts');
  const basmala = plain(wordMorphology('1:1:1'));
  assert.equal(basmala.root, 'س م و', 'بِسْمِ is built from س م و');
  assert.equal(basmala.rootLatin, 'smw');
  assert.equal(basmala.rootWords, 381, 'and that root is used 381 times');
  assert.equal(basmala.lemma, 'اسْم');
});

test('two words of one root are recognised as the same root', () => {
  const { wordMorphology } = load()('src/services/morphology.ts');
  /* ٱلرَّحْمَـٰنِ and ٱلرَّحِيمِ in the same verse are both ر ح م. */
  assert.equal(plain(wordMorphology('1:1:3')).root, 'ر ح م');
  assert.equal(plain(wordMorphology('1:1:4')).root, 'ر ح م');
});

test('a particle has a lemma but no root, and is not given one', () => {
  const { wordMorphology } = load()('src/services/morphology.ts');
  const la = plain(wordMorphology('2:255:2'));
  assert.equal(la.root, undefined, 'لَا is not built from a root');
  assert.equal(la.lemma, 'لَا', 'but it is still a dictionary word');
});

test('a word the catalogue does not cover answers nothing at all', () => {
  const { wordMorphology } = load()('src/services/morphology.ts');
  assert.deepEqual(plain(wordMorphology('1:1:5')), {}, 'the ayah number is not a word');
  assert.deepEqual(plain(wordMorphology('1:1:99')), {});
  assert.deepEqual(plain(wordMorphology('not-a-key')), {});
  assert.deepEqual(plain(wordMorphology('999:1:1')), {}, 'an impossible surah is not looked up');
});

test('roots are spaced one letter at a time, so they read as a root', () => {
  const { wordMorphology } = load()('src/services/morphology.ts');
  for (const location of ['1:1:1', '1:1:2', '1:1:3', '2:255:1', '112:1:1']) {
    const root = plain(wordMorphology(location)).root;
    assert.ok(!/\s{2,}/.test(root), `${location} has even spacing: ${JSON.stringify(root)}`);
  }
});

test('the other places a root appears are found inside the surah', () => {
  const { wordsWithRootInSurah, rootIdAt } = load()('src/services/morphology.ts');
  const id = rootIdAt('1:1:3');
  assert.ok(id > 0);
  const places = plain(wordsWithRootInSurah(1, id));
  /* ر ح م in al-Fatihah: 1:1:3, 1:1:4, 1:3:1, 1:3:2 - in reading order. */
  assert.deepEqual(places, ['1:1:3', '1:1:4', '1:3:1', '1:3:2']);
  assert.equal(rootIdAt('1:1:5'), 0, 'a word with no root has no siblings');
});

test('roots do not replace or reorder the meanings they sit under', () => {
  /* The pairing was measured against all 6,236 ayahs before roots existed.
     Attaching a root must not move a single meaning from its word. */
  const api = fs.readFileSync(path.join(__dirname, '../src/services/api.ts'), 'utf8');
  const block = api.slice(api.indexOf('async function withWordByWord('), api.indexOf('function requireWholeList('));
  assert.ok(block.includes('pairWords(wordsForAyah('), 'the pairing is still what decides positions');
  assert.ok(/const withRoots = paired\.map\(\(entry, index\) =>/.test(block), 'roots are added onto the paired entries');
  assert.ok(block.includes('wordMorphology(`${verse.verse_key}:${index + 1}`)'), 'by the same position the meaning took');
  assert.ok(!block.includes('sort('), 'nothing re-sorts the words');
});

test('the root is drawn under the meaning, and a tap moves to its next occurrence', () => {
  const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const reader = app.slice(app.indexOf('function ReaderScreen('), app.indexOf('function VerseActionButton('));
  assert.ok(reader.includes('s.wbwRoot'), 'the root line is rendered');
  assert.ok(reader.includes('entry.root'), 'from the entry it belongs to');
  assert.ok(reader.includes('rootIdAt(') && reader.includes('wordsWithRootInSurah('), 'a tap finds the same root');
  assert.ok(reader.includes('setTarget(next)'), 'and moves the reading position to it');
});

test('the shipped slices cover the words the reader can show', () => {
  const dir = path.join(__dirname, '../src/data/morphology/surahs');
  const files = fs.readdirSync(dir).filter((name) => name.endsWith('.json'));
  assert.equal(files.length, 114, 'one slice per surah');
  const first = JSON.parse(fs.readFileSync(path.join(dir, '1.json'), 'utf8'));
  assert.equal(first.surah, 1);
  /* The index alone means nothing; what matters is that it resolves, through
     the shared table, to the root of the word it sits on. */
  const id = first.wordRoot['1:1:1'];
  const table = JSON.parse(fs.readFileSync(path.join(dir, '../roots.json'), 'utf8'));
  const row = table.roots.find((entry) => entry[0] === id);
  assert.ok(row, 'the surah slice points into the shared root table');
  assert.equal(row[1].trim().split(/\s+/).join(' '), 'س م و', 'بِسْمِ resolves to س م و');
  assert.ok(Object.keys(first.wordRoot).length > 0);
});
