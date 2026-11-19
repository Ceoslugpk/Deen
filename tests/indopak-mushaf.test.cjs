const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const root = path.resolve(__dirname, '..');
const model = createLoader()('src/services/indopakMushaf.ts');
const copy = createLoader()('src/services/indopakCopy.ts');
const meta = model.indopakMeta();
const pages = Array.from({ length: 548 }, (_, i) => model.indopakPage(i + 1));
const words = pages.flatMap(p => p.words);
const hash = filename => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, filename))).digest('hex');

test('the uploaded font and original SQLite layout remain byte-for-byte unchanged', () => {
  assert.equal(hash('assets/fonts/IndopakNastaleeq.ttf'), meta.source.fontSha256);
  assert.equal(hash('resources/quran/indopak-taj-16/taj-indopak-16-lines.db'), meta.source.layoutSha256);
  assert.equal(hash('resources/quran/indopak-taj-16/structure.json'), meta.source.chaptersSha256);
  assert.match(fs.readFileSync(path.join(root, 'resources/quran/indopak-taj-16/FONT-LICENSE.txt'), 'utf8'), /WRITTEN NOTICE BY QURANWBW/);
});

test('this is an independent 548-page 16-line edition, not the 604-page Madani map', () => {
  assert.equal(meta.edition, 'indopak-taj-16');
  assert.equal(meta.pageCount, 548); assert.equal(meta.linesPerPage, 16);
  assert.equal(pages.length, 548); assert.equal(meta.chapters.length, 114); assert.equal(meta.juz.length, 30);
  assert.equal(pages.reduce((n, p) => n + p.lines.length, 0), 8742);
});

test('all 83,668 word/marker IDs occur exactly once, in canonical order across all pages', () => {
  let next = 1, previous = [0, 0, 0], seen = new Set();
  for (const page of pages) {
    assert.equal(page.firstWord, next);
    const ayahs = page.lines.filter(l => l.t === 'ayah');
    for (const line of ayahs) {
      assert.equal(line.f, next);
      assert.ok(line.l >= line.f);
      next = line.l + 1;
    }
    assert.equal(page.words.length, next - page.firstWord);
    for (const word of page.words) {
      const [surah, ayah, position, text] = word;
      assert.ok(text.length > 0);
      assert.ok(surah > previous[0] || (surah === previous[0] && (ayah > previous[1] || ayah === previous[1] && position === previous[2] + 1)));
      if (surah !== previous[0] || ayah !== previous[1]) assert.equal(position, 1);
      seen.add(`${surah}:${ayah}`); previous = [surah, ayah, position];
    }
  }
  assert.equal(next, 83669); assert.equal(words.length, 83668); assert.equal(seen.size, 6236);
  assert.equal(model.indopakVerseKey(words[0]), '1:1');
  assert.equal(model.indopakVerseKey(words.at(-1)), '114:6');
});

test('every printed Surah heading points at the corresponding first word', () => {
  const found = [];
  for (const page of pages) for (const [index, line] of page.lines.entries()) {
    if (line.t !== 'surah_name') continue;
    const next = page.lines.slice(index + 1).find(l => l.t === 'ayah');
    assert.ok(next, `Surah ${line.s} heading has a following text line`);
    const word = page.words[next.f - page.firstWord];
    assert.deepEqual([...word.slice(0, 3)], [line.s, 1, 1]);
    assert.equal(meta.chapters[line.s - 1].page, page.n); found.push(line.s);
  }
  assert.deepEqual(found, Array.from({ length: 114 }, (_, i) => i + 1));
});

test('all source line numbers/types/centering and shorter pages are preserved without invented rows', () => {
  const short = {};
  for (const page of pages) {
    if (page.lines.length !== 16) short[page.n] = page.lines.length;
    assert.deepEqual([...page.lines.map(l => l.n)], Array.from({ length: page.lines.length }, (_, i) => i + 1));
    assert.ok(page.lines.every(l => ['ayah', 'surah_name', 'basmallah'].includes(l.t) && typeof l.c === 'boolean'));
    assert.equal(model.placeIndopakPage(page).length, page.lines.length);
  }
  assert.deepEqual(short, { 1: 7, 2: 7, 529: 15, 530: 15, 548: 10 });
  assert.deepEqual(JSON.parse(JSON.stringify(meta.shortPages)), short);
});

test('every rendered word fits its fixed line, respects glyph bearings and never overlaps adjacent words', () => {
  for (const page of pages) for (const line of model.placeIndopakPage(page)) {
    assert.ok(line.fontSize > 0 && line.fontSize <= 60);
    assert.ok(line.top >= 92 && line.top + line.height <= 1544.001);
    let right = 952.01;
    for (const word of line.words) {
      assert.ok(word.boxX >= 47.99, `page ${page.n} line ${line.source.n} left`);
      assert.ok(word.boxX + word.width <= right + .01, `page ${page.n} line ${line.source.n} overlap`);
      assert.ok(word.width > 0 && Number.isFinite(word.x));
      right = word.boxX;
    }
  }
});

test('all Quran words/PUA markers and Arabic headings use unchanged-font outlines with explicit RTL shaping', () => {
  const packed = require('../src/data/indopak16/shapes.json');
  assert.equal(packed.encoding, 'utf8-json-v1');
  const shapes = JSON.parse(packed.json);
  const glyphs = require('../src/data/indopak16/glyphs.json');
  assert.equal(meta.schemaVersion, 3); assert.equal(meta.storage, 'utf8-json-v1');
  assert.equal(shapes.length, meta.shapeCount); assert.equal(Object.keys(glyphs).length, meta.glyphCount);
  assert.equal(meta.renderer, 'original-font-outlines-harfbuzz-0.57.0');
  const outline = /^(?:[mlqc][\d. -]+|z)+$/;
  for (const [id, path] of Object.entries(glyphs)) {
    assert.ok(Number(id) > 0); assert.ok(path === '' || outline.test(path), `unmodified relative glyph ${id}`);
  }
  for (const shape of shapes) {
    assert.ok(shape.length > 0 && shape.length % 3 === 0);
    for (let i = 0; i < shape.length; i += 3) {
      assert.ok(Object.hasOwn(glyphs, shape[i])); assert.ok(shape.slice(i + 1, i + 3).every(Number.isFinite));
    }
  }
  for (const word of [...words, ...meta.chapters.map(c => c.heading)]) {
    assert.ok(shapes[word[9]], `source text has a shape: ${word[3]}`);
  }
  const marker = pages[0].words.at(-1);
  assert.match(marker[3], /[\uE000-\uF8FF]/);
  assert.ok(model.indopakShapePath(marker[9]).startsWith('M'));
  assert.throws(() => model.indopakShapePath(-1));
  for (const chapter of meta.chapters) {
    assert.equal(chapter.heading[3], chapter.arabic);
    const centered = model.centeredIndopakWord(chapter.heading, 500, 54, 27);
    assert.ok(Number.isFinite(centered.x) && Number.isFinite(centered.baseline) && centered.scale > 0);
  }
});

test('verse lookup agrees with every source verse, including page-spanning verses', () => {
  const firstPages = new Map();
  for (const page of pages) for (const word of page.words) if (!firstPages.has(model.indopakVerseKey(word))) firstPages.set(model.indopakVerseKey(word), page.n);
  for (const [key, page] of firstPages) assert.equal(model.indopakPageForVerse(key), page, key);
  for (const key of ['1:1', '2:255', '2:282', '9:1', '114:6']) {
    const expected = words.filter(w => model.indopakVerseKey(w) === key);
    const actual = model.indopakVerseWords(key);
    assert.equal(actual.length, expected.length, key);
    assert.equal(actual.map(w => w[3]).join(' '), expected.map(w => w[3]).join(' '), key);
  }
  for (const key of ['0:1', '115:1', '2:287', '2:0', 'x', '2:255x', 'NaN:1']) assert.equal(model.indopakPageForVerse(key), null);
});

test('all 30 Juz entries open the page containing their canonical verse boundary', () => {
  for (const juz of meta.juz) assert.equal(juz.page, model.indopakPageForVerse(juz.verse));
  assert.equal(meta.juz[0].page, 1);
});

test('invalid page numbers never leak to a chunk or silently become a different edition', () => {
  for (const page of [0, -1, 549, 604, 1.5, NaN, Infinity, '1', null]) assert.throws(() => model.indopakPage(page));
  for (const [text, expected] of [['1', 1], ['548', 548], [' 274 ', 274], ['٠١٢', 12], ['۵۲۹', 529]]) assert.equal(model.parseIndopakPage(text), expected);
  for (const text of ['0', '549', '604', '-1', '1.5', '12x', '2:255', '', '1e2']) assert.equal(model.parseIndopakPage(text), null);
});

test('page fitting uses both safe dimensions and zoom never changes the printed line map', () => {
  for (const [width, height] of [[240, 320], [280, 400], [390, 600], [844, 164], [800, 1000], [1280, 560], [1440, 800], [0, 0]]) {
    const fit = model.fitIndopakPage(width, height);
    assert.ok(fit.width >= 0 && fit.width <= width); assert.ok(fit.height >= 0 && fit.height <= height);
    for (const zoom of [1, 1.5, 2]) {
      const larger = model.fitIndopakPage(width, height, zoom);
      assert.equal(larger.width, fit.width * zoom); assert.equal(larger.height, fit.height * zoom);
    }
  }
  assert.equal(model.fitIndopakPage(390, 600, NaN).width, model.fitIndopakPage(390, 600).width);
  const landscape = model.fitIndopakPage(844, 164, 1, true);
  assert.equal(landscape.width, 832); assert.ok(landscape.height > 164, 'Short panes scroll vertically instead of shrinking scripture to a stamp');
});

test('all supported interface languages have the new screen copy, with Cyrillic Uzbek/Kazakh', () => {
  for (const language of ['ar','ur','fa','ps','fr','tr','ru','uz','kk','zh','vi','az','bs','bg','si','bn','hi','id','ms','ta','ml']) {
    for (const key of ['title','hint','pageError','zoom','openVerse','empty','fontError','dataError','saveError','swipeHint']) {
      const value = copy.indopakText(language, key, { total: 548 });
      // “Zoom” is also the correct French word, not an English fallback.
      assert.ok(value && ((language === 'fr' && key === 'zoom') || value !== copy.indopakText('en', key, { total: 548 })), `${language}/${key}`);
      assert.ok(!value.includes('{total}'));
    }
  }
  assert.match(copy.indopakText('uz', 'title'), /[А-Яа-я]/); assert.match(copy.indopakText('kk', 'title'), /[А-Яа-я]/);
  assert.notEqual(copy.indopakText('ms', 'hint'), copy.indopakText('id', 'hint'));
});

test('edition state is independent, read-only on load, and never removes existing saved data', async () => {
  const calls = [];
  const storage = {
    readJson: async (key, fallback) => { calls.push(['read', key]); return fallback; },
    writeJson: async (key, value) => { calls.push(['write', key, value]); return true; },
  };
  const state = createLoader({ './storage': storage })('src/services/indopakState.ts');
  const defaults = await state.loadIndopakState();
  assert.equal(calls.length, 1); assert.equal(defaults.page, 1);
  assert.equal(state.INDOPAK_STATE_KEY, '@deen/quran/indopak-taj-16/state/v1');
  assert.equal(await state.saveIndopakState({ ...defaults, page: 548, savedPages: [548, 1, 548] }), true);
  assert.deepEqual([...calls[1][2].savedPages], [1, 548]);
  assert.ok(calls.every(c => c[1] === state.INDOPAK_STATE_KEY));
  for (const raw of [null, { version: 2 }, { version: 1, edition: 'madani', page: 604 }]) assert.equal(state.normalizeIndopakState(raw).page, 1);
  const dirty = state.normalizeIndopakState({ ...defaults, page: 604, zoom: 8, savedPages: [1, 2, 548, 604, 2, -1, '3'] });
  assert.equal(dirty.page, 1); assert.equal(dirty.zoom, 1); assert.deepEqual([...dirty.savedPages], [1, 2, 548]);
});

test('Explore opens a separate screen and the withdrawn Mushaf stays disabled', () => {
  const app = fs.readFileSync(path.join(root, 'App.tsx'), 'utf8');
  assert.ok(app.includes("title:indopakText(language,'title'),screen:'16-line Quran',tool:'Mushaf Pages'"));
  assert.ok(app.includes('<Stack.Screen name="16-line Quran" component={IndopakQuranScreen}/>'));
  assert.ok(app.includes('const MUSHAF_ENABLED = false;'));
  const component = fs.readFileSync(path.join(root, 'src/components/IndopakMushafReader.tsx'), 'utf8');
  assert.ok(component.includes('SystemModal')); assert.ok(!component.includes('fetch('));
  assert.ok(!component.includes('update({scriptEdition')); assert.ok(!component.includes('clearSurahCache'));
});
