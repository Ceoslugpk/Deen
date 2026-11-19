const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader();
const model = load('src/services/indopakMushaf.ts');
const select = load('src/services/indopakSelection.ts');
const state = createLoader({ './storage': { readJson: async (_k, fallback) => fallback, writeJson: async () => true } })('src/services/indopakState.ts');
const plain = x => JSON.parse(JSON.stringify(x));
const close = (a, b) => assert.ok(Math.abs(a - b) < .001, `${a} != ${b}`);
const viewport = { width: 400, height: 600 }, size = { width: 1000, height: 1640 }, scroll = { x: 350, y: 500 };
const selection = { verse: '2:255', wordId: 20 };
const segment = { verse: '2:255', firstWord: 18, lastWord: 25, line: 7, x: 500, y: 700, width: 100, height: 60 };

test('all 548 pages have continuous, source-aligned ayah fragments, never headings or basmalah highlights', () => {
  for (let n = 1; n <= 548; n++) {
    const lines = model.placeIndopakPage(model.indopakPage(n)), fragments = select.indopakAyahSegments(lines);
    const covered = new Set();
    for (const f of fragments) {
      const line = lines.find(l => l.source.n === f.line); assert.equal(line.source.t, 'ayah');
      const words = line.words.filter(w => w.id >= f.firstWord && w.id <= f.lastWord);
      assert.ok(words.length); assert.ok(words.every(w => w.key === f.verse));
      close(f.x, Math.min(...words.map(w => w.boxX)) - 2);
      close(f.x + f.width, Math.max(...words.map(w => w.boxX + w.width)) + 2);
      assert.ok(f.y >= 94 && f.y + f.height <= 1542.001);
      for (const word of words) { assert.ok(!covered.has(word.id)); covered.add(word.id); }
    }
    assert.equal(covered.size, model.indopakPage(n).words.length);
  }
});

test('the popup tracks the actual tapped fragment and both zoom/scroll offsets', () => {
  const popup = select.indopakPopoverLayout(viewport, size, scroll, [segment], selection);
  assert.ok(popup); assert.equal(popup.side, 'above'); close(popup.x, 123); close(popup.y, 138);
  assert.deepEqual(plain(popup.target), { x: 150, y: 200, right: 250, bottom: 260 });
  assert.equal(popup.width, 154); assert.equal(popup.height, 54); close(popup.arrowX, 77);
});

test('centred paper uses its real origin rather than the viewport origin', () => {
  const popup = select.indopakPopoverLayout({ width: 800, height: 1000 }, { width: 400, height: 656 }, { x: 0, y: 0 }, [segment], selection);
  close(popup.target.x, 400); close(popup.target.y, 452); assert.equal(popup.side, 'above');
  close(popup.y + popup.height + 8, popup.target.y);
});

test('top-edge selections place the popup below the ayah and side edges clamp its three 44px targets safely', () => {
  for (const x of [350, 600, 749]) {
    const popup = select.indopakPopoverLayout(viewport, size, scroll, [{ ...segment, x, y: 505 }], selection);
    assert.equal(popup.side, 'below'); assert.ok(popup.x >= 6); assert.ok(popup.x + popup.width <= viewport.width - 6);
    assert.ok(popup.y >= popup.target.bottom + 7.99); assert.ok(popup.arrowX >= 14 && popup.arrowX <= 140);
  }
});

test('multi-line ayahs keep the menu outside the whole visible selection when there is room', () => {
  const fragments = [segment, { ...segment, firstWord: 26, lastWord: 30, line: 8, y: 850 }];
  const tapped = select.indopakPopoverLayout(viewport, size, scroll, fragments, { ...selection, wordId: 28 });
  close(tapped.target.y, 200); close(tapped.target.bottom, 410);
  assert.ok(tapped.y + tapped.height < 200, 'The menu does not cover the earlier highlighted line of the same ayah');
  const clipped = select.indopakPopoverLayout(viewport, size, { ...scroll, y: 800 }, fragments, selection);
  close(clipped.target.y, 50);
  assert.equal(select.indopakPopoverLayout(viewport, size, scroll, fragments, { ...selection, verse: '1:1' }), null);
});

test('unmeasured, non-finite, invisible or impossibly small popup geometry is rejected', () => {
  for (const value of [0, -1, NaN, Infinity]) for (const axis of ['width', 'height']) {
    assert.equal(select.indopakPopoverLayout({ ...viewport, [axis]: value }, size, scroll, [segment], selection), null);
    assert.equal(select.indopakPopoverLayout(viewport, { ...size, [axis]: value }, scroll, [segment], selection), null);
  }
  assert.equal(select.indopakPopoverLayout(viewport, size, { x: NaN, y: 0 }, [segment], selection), null);
  assert.equal(select.indopakPopoverLayout({ width: 100, height: 60 }, size, scroll, [segment], selection), null);
  assert.equal(select.indopakPopoverLayout(viewport, size, { x: 10000, y: 10000 }, [segment], selection), null);
});

test('word anchors preserve the exact saved word, including later fragments of a long ayah', () => {
  const page = model.indopakPage(42), lines = model.placeIndopakPage(page), last = page.words.length - 1;
  const key = model.indopakVerseKey(page.words[last]), id = page.firstWord + last;
  const exact = select.indopakWordAnchor(lines, key, id); assert.equal(exact.wordId, id);
  const first = select.indopakWordAnchor(lines, key); assert.ok(first.wordId <= id);
  assert.equal(select.indopakWordAnchor(lines, '114:6'), null);
});

test('resume offsets reveal the actual word and clamp both axes at all zoom levels', () => {
  const rect = { x: 700, y: 1400, width: 100, height: 80 };
  const offset = select.indopakRevealOffset(viewport, size, rect);
  assert.deepEqual(plain(offset), { x: 550, y: 1040 });
  assert.deepEqual(plain(select.indopakRevealOffset(viewport, { width: 350, height: 574 }, rect)), { x: 0, y: 0 });
});

test('the half-second hold rejects movement, added fingers, cancellation inputs and non-finite deltas', () => {
  assert.equal(select.INDOPAK_HOLD_MS, 500);
  for (const [touches, x, y] of [[1, 0, 0], [1, 4, 4], [1, 8, 0]]) assert.equal(select.indopakStationaryPress(touches, x, y), true);
  for (const [touches, x, y] of [[0, 0, 0], [2, 0, 0], [3, 0, 0], [1, 9, 0], [1, 6, 6], [1, NaN, 0], [1, 0, Infinity]]) assert.equal(select.indopakStationaryPress(touches, x, y), false);
});

test('reading points validate against exact page/word/ayah joins, including a split verse on its later page', () => {
  let split;
  for (let n = 2; n <= 548 && !split; n++) {
    const previous = model.indopakPage(n - 1), page = model.indopakPage(n);
    if (model.indopakVerseKey(previous.words.at(-1)) === model.indopakVerseKey(page.words[0])) split = { page: n, verse: model.indopakVerseKey(page.words[0]), wordId: page.firstWord };
  }
  assert.ok(split); assert.deepEqual(plain(state.normalizeIndopakReadingPoint(split)), split);
  for (const bad of [null, {}, { ...split, page: 604 }, { ...split, wordId: -1 }, { ...split, wordId: split.wordId + .5 }, { ...split, wordId: '1' }, { ...split, verse: '114:6' }, { ...split, verse: '01:01' }, { ...split, wordId: Infinity }]) assert.equal(state.normalizeIndopakReadingPoint(bad), null);
});

test('adding or rejecting a reading marker never migrates or drops old edition bookmarks/position/zoom', async () => {
  const raw = { version: 1, edition: 'indopak-taj-16', page: 274, zoom: 1.5, savedPages: [1, 42, 548] };
  const calls = [];
  const own = createLoader({ './storage': { readJson: async key => { calls.push(['read', key]); return raw; }, writeJson: async (key, value) => { calls.push(['write', key, value]); return true; } } })('src/services/indopakState.ts');
  const restored = await own.loadIndopakState(); assert.equal(calls.length, 1); assert.equal(restored.readingPoint, null);
  for (const key of ['page', 'zoom', 'savedPages']) assert.deepEqual(plain(restored[key]), raw[key]);
  const point = { page: 1, verse: '1:1', wordId: 1 };
  await own.saveIndopakState({ ...restored, readingPoint: point }); assert.deepEqual(plain(calls[1][2].readingPoint), point);
  assert.ok(calls.every(c => c[1] === own.INDOPAK_STATE_KEY));
  const invalid = own.normalizeIndopakState({ ...raw, readingPoint: { ...point, wordId: 999999 } });
  assert.equal(invalid.readingPoint, null); assert.deepEqual(plain(invalid.savedPages), raw.savedPages); assert.equal(invalid.page, raw.page);
});

test('the icon-only popover and 500ms touch hooks are isolated from the original Reader and keep cancellation/a11y paths', () => {
  const root = path.resolve(__dirname, '..');
  const popup = fs.readFileSync(path.join(root, 'src/components/IndopakAyahPopover.tsx'), 'utf8');
  const canvas = fs.readFileSync(path.join(root, 'src/components/IndopakPageCanvas.tsx'), 'utf8');
  const reader = fs.readFileSync(path.join(root, 'src/components/IndopakMushafReader.tsx'), 'utf8');
  assert.ok(!popup.includes('<Text')); assert.ok(!reader.includes('IndopakVersePanel'));
  for (const id of ['play', 'translation', 'mark']) assert.ok(popup.includes(`id: '${id}'`));
  assert.ok(popup.includes('accessibilityLabel=')); assert.ok(popup.includes('hardwareBackPress')); assert.ok(popup.includes("event.key === 'Escape'"));
  assert.ok(canvas.includes('delayLongPress={INDOPAK_HOLD_MS}')); assert.ok(canvas.includes('onLongPress='));
  assert.ok(reader.includes('clearTimeout(holdTimer.current)')); assert.ok(reader.includes('onTouchCancel='));
  assert.ok(reader.includes('onWordLongPress={holdWord}')); assert.ok(reader.includes('indopak-resume'));
});
