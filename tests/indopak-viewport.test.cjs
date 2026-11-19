const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader();
const { fitIndopakPage } = load('src/services/indopakMushaf.ts');
const { indopakResizeOffset, indopakPageOrigin } = load('src/services/indopakSelection.ts');
const plain = x => JSON.parse(JSON.stringify(x));
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < .00001, `${actual} != ${expected}`);
const clamp = (n, maximum) => Math.max(0, Math.min(Math.max(0, maximum), n));
const centre = (viewport, size, scroll) => {
  const origin = indopakPageOrigin(viewport, size);
  return { x: (scroll.x + viewport.width / 2 - origin.x) / size.width,
    y: (scroll.y + viewport.height / 2 - origin.y) / size.height };
};

test('centred viewport resizing preserves the page centre, not its right edge or first line', () => {
  const viewport = { width: 390, height: 672 };
  const from = fitIndopakPage(viewport.width, viewport.height, 1, true);
  for (const zoom of [1.5, 2]) {
    const to = fitIndopakPage(viewport.width, viewport.height, zoom, true);
    const offset = indopakResizeOffset(viewport, from, { x: 0, y: 0 }, viewport, to);
    close(offset.x, (to.width - viewport.width) / 2);
    close(offset.y, (to.height - viewport.height) / 2);
    const anchor = centre(viewport, to, offset); close(anchor.x, .5); close(anchor.y, .5);
    assert.ok(offset.x < to.width - viewport.width, 'The old unconditional right-edge snap is not reproduced');
  }
});

test('panned viewport resizing preserves the same page point, with only unavoidable edge clamping', () => {
  const viewport = { width: 390, height: 672 };
  const from = { width: 567, height: 929.88 }, to = { width: 756, height: 1239.84 };
  const scroll = { x: 30, y: 180 };
  const offset = indopakResizeOffset(viewport, from, scroll, viewport, to);
  close(offset.x, 105); close(offset.y, 352);
  const old = centre(viewport, from, scroll), next = centre(viewport, to, offset);
  close(old.x, next.x); close(old.y, next.y);
  const back = indopakResizeOffset(viewport, to, offset, viewport, from);
  close(back.x, scroll.x); close(back.y, scroll.y);
});

test('all preset pairs and portrait/landscape/cover/tablet resizes use physical, bounded centre coordinates', () => {
  const viewports = [{ width: 240, height: 468 }, { width: 280, height: 548 }, { width: 390, height: 672 },
    { width: 844, height: 268 }, { width: 800, height: 1108 }, { width: 1280, height: 678 }];
  let cases = 0;
  for (const viewport of viewports) for (const nextViewport of viewports) for (const zoom of [1, 1.5, 2]) for (const nextZoom of [1, 1.5, 2]) {
    const size = fitIndopakPage(viewport.width, viewport.height, zoom, true);
    const nextSize = fitIndopakPage(nextViewport.width, nextViewport.height, nextZoom, true);
    for (const fraction of [0, .35, 1]) {
      const scroll = { x: Math.max(0, size.width - viewport.width) * fraction,
        y: Math.max(0, size.height - viewport.height) * fraction };
      const before = centre(viewport, size, scroll), origin = indopakPageOrigin(nextViewport, nextSize);
      const result = indopakResizeOffset(viewport, size, scroll, nextViewport, nextSize);
      close(result.x, clamp(origin.x + before.x * nextSize.width - nextViewport.width / 2, nextSize.width - nextViewport.width));
      close(result.y, clamp(origin.y + before.y * nextSize.height - nextViewport.height / 2, nextSize.height - nextViewport.height));
      for (const axis of ['x', 'y']) assert.ok(Number.isFinite(result[axis]) && result[axis] >= 0);
      cases++;
    }
  }
  assert.equal(cases, 972);
});

test('resizing to a fully fitted page clears both overflow offsets and never leaves blank scroll space', () => {
  const viewport = { width: 390, height: 672 };
  const full = fitIndopakPage(viewport.width, viewport.height, 1, true);
  const zoomed = fitIndopakPage(viewport.width, viewport.height, 2, true);
  for (const scroll of [{ x: 0, y: 0 }, { x: 300, y: 500 }, { x: 366, y: 567.84 }, { x: -3, y: -4 }]) {
    assert.deepEqual(plain(indopakResizeOffset(viewport, zoomed, scroll, viewport, full)), { x: 0, y: 0 });
  }
});

test('unmeasured/non-finite zoom geometry is safe and does not change any source/state object', () => {
  const viewport = { width: 390, height: 672 }, size = { width: 756, height: 1239.84 }, scroll = { x: 100, y: 400 };
  const before = JSON.stringify({ viewport, size, scroll });
  for (const invalid of [0, -1, NaN, Infinity]) for (const axis of ['width', 'height']) {
    for (const index of [0, 1, 3, 4]) {
      const args = [viewport, size, scroll, viewport, size]; args[index] = { ...args[index], [axis]: invalid };
      assert.deepEqual(plain(indopakResizeOffset(...args)), { x: 0, y: 0 });
    }
  }
  for (const axis of ['x', 'y']) assert.deepEqual(plain(indopakResizeOffset(viewport, size, { ...scroll, [axis]: NaN }, viewport, size)), { x: 0, y: 0 });
  indopakResizeOffset(viewport, size, scroll, viewport, size);
  assert.equal(JSON.stringify({ viewport, size, scroll }), before);
});

test('fixed scripture paths/hit handlers are memoized independently of viewport and live highlights, with fresh committed callbacks', () => {
  const canvas = fs.readFileSync(path.resolve(__dirname, '../src/components/IndopakPageCanvas.tsx'), 'utf8');
  assert.ok(canvas.includes('const IndopakInkWords = memo('));
  assert.ok(canvas.includes('const IndopakHighlights = memo('));
  assert.ok(canvas.includes('const IndopakHeading = memo('));
  assert.ok(canvas.includes('const actions = useMemo<WordActions>'));
  assert.ok(canvas.includes('useLayoutEffect(() => { callbacks.current ='));
  const ink = canvas.slice(canvas.indexOf('const IndopakInkWords = memo('), canvas.indexOf('/** Word paths are'));
  for (const changing of ['recitingVerse', 'readingPoint', 'width={width}', 'height={height}', 'verse={verse}']) assert.ok(!ink.includes(changing));
  assert.ok(ink.includes('indopakShapePath(word.shape)')); assert.ok(ink.includes('delayLongPress={INDOPAK_HOLD_MS}'));
  const reader = fs.readFileSync(path.resolve(__dirname, '../src/components/IndopakMushafReader.tsx'), 'utf8');
  assert.ok(reader.includes('indopakResizeOffset(before.viewport'));
  assert.equal((reader.match(/onContentSizeChange=\{applyScrollCorrection\}/g) || []).length, 2);
  assert.ok(reader.includes('onScrollBeginDrag={userPanning}')); assert.ok(reader.includes('scrollCorrection.current = null'));
  assert.ok(!reader.includes('scrollToEnd('));
  assert.ok(!reader.includes('state.zoom')); assert.ok(reader.includes('focusMode ? fitIndopakFocusPage'));
});
