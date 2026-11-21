const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader();
const zoom = load('src/services/indopakZoom.ts');
const { fitIndopakFocusPage } = load('src/services/indopakFocus.ts');
const { indopakPageOrigin } = load('src/services/indopakSelection.ts');
const { captureIndopakSwipe, indopakSwipePage } = load('src/services/indopakInteraction.ts');
const plain = value => JSON.parse(JSON.stringify(value));
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const viewport = { width: 390, height: 844 };
const base = fitIndopakFocusPage(viewport.width, viewport.height);
const points = (distance, x = 195, y = 422) => [{ x: x - distance / 2, y }, { x: x + distance / 2, y }];

test('Focus magnification is finite and bounded from whole-page fit to three times that fit', () => {
  assert.equal(zoom.INDOPAK_FOCUS_MIN_ZOOM, 1); assert.equal(zoom.INDOPAK_FOCUS_MAX_ZOOM, 3);
  for (const [input, expected] of [[0,1],[-2,1],[1,1],[1.75,1.75],[3,3],[20,3],[NaN,1],[Infinity,1]]) assert.equal(zoom.boundIndopakFocusZoom(input), expected);
});

test('a two-finger spread doubles both SVG viewport dimensions without changing the original aspect ratio', () => {
  const start = zoom.beginIndopakPinch(viewport, base, { x: 0, y: 0 }, 1, points(80)); assert.ok(start);
  const result = zoom.moveIndopakPinch(start, viewport, points(160));
  close(result.zoom, 2); close(result.size.width, base.width * 2); close(result.size.height, base.height * 2);
  close(result.size.height / result.size.width, 1.64);
  close(result.offset.x, (result.size.width - viewport.width) / 2);
  close(result.offset.y, (result.size.height - viewport.height) / 2);
});

test('the same physical paper point stays under the pinch centre, including two-finger translation while scaling', () => {
  const size = { width: base.width * 2, height: base.height * 2 }, offset = { x: 100, y: 200 };
  const start = zoom.beginIndopakPinch(viewport, size, offset, 2, points(80, 220, 380));
  const result = zoom.moveIndopakPinch(start, viewport, points(100, 240, 420));
  assert.equal(result.zoom, 2.5);
  const origin = indopakPageOrigin(viewport, result.size);
  close((result.offset.x + 240 - origin.x) / result.size.width, start.anchor.x);
  close((result.offset.y + 420 - origin.y) / result.size.height, start.anchor.y);
});

test('moving both fingers the same distance pans without changing zoom', () => {
  const size = { width: base.width * 2, height: base.height * 2 }, offset = { x: 160, y: 300 };
  const start = zoom.beginIndopakPinch(viewport, size, offset, 2, points(80));
  const result = zoom.moveIndopakPinch(start, viewport, points(80, 225, 402));
  assert.equal(result.zoom, 2); close(result.offset.x, 130); close(result.offset.y, 320);
});

test('pinch-in stops exactly at fit and clears overflow offsets, enabling fit-page swipes again', () => {
  const size = { width: base.width * 3, height: base.height * 3 };
  const start = zoom.beginIndopakPinch(viewport, size, { x: 400, y: 700 }, 3, points(200));
  const result = zoom.moveIndopakPinch(start, viewport, points(20));
  assert.equal(result.zoom, 1); close(result.size.width, base.width); close(result.size.height, base.height);
  assert.deepEqual(plain(result.offset), { x: 0, y: 0 });
  assert.equal(captureIndopakSwipe(result.zoom, { dx: 140, dy: 0, numberActiveTouches: 1 }), true);
});

test('large spreads stop at three times fit and clamp only to real paper edges', () => {
  const start = zoom.beginIndopakPinch(viewport, base, { x: 0, y: 0 }, 1, points(20));
  const result = zoom.moveIndopakPinch(start, viewport, points(300, -200, -500));
  assert.equal(result.zoom, 3); close(result.size.width, base.width * 3); close(result.size.height, base.height * 3);
  close(result.offset.x, result.size.width - viewport.width); close(result.offset.y, result.size.height - viewport.height);
});

test('one-finger magnified panning owns both axes, including paper edges, and cannot turn a page', () => {
  for (const scale of [1.01, 1.5, 2, 3]) for (const [dx, dy] of [[140,0],[-140,0],[0,140],[15,100]]) {
    const gesture = { dx, dy, numberActiveTouches: 1 };
    assert.equal(zoom.captureIndopakFocusPan(scale, gesture), true);
    assert.equal(captureIndopakSwipe(scale, gesture), false);
    assert.equal(indopakSwipePage(274, scale, 390, gesture), null);
  }
  for (const gesture of [{ dx: 4, dy: 4, numberActiveTouches: 1 }, { dx: 140, dy: 0, numberActiveTouches: 2 }, { dx: NaN, dy: 0, numberActiveTouches: 1 }]) {
    assert.equal(zoom.captureIndopakFocusPan(2, gesture), false);
  }
  assert.equal(zoom.captureIndopakFocusPan(1, { dx: 140, dy: 0, numberActiveTouches: 1 }), false);
});

test('all tested viewport, scale and extreme pan combinations stay within real content bounds without mutating inputs', () => {
  let cases = 0;
  for (const v of [{ width: 240, height: 400 }, { width: 280, height: 720 }, viewport, { width: 844, height: 390 }, { width: 800, height: 1280 }]) {
    const fit = fitIndopakFocusPage(v.width, v.height);
    for (const scale of [1,1.01,1.5,2,3]) for (const x of [-1000,0,100,10000]) for (const y of [-1000,0,100,10000]) {
      const size = { width: fit.width * scale, height: fit.height * scale }, offset = { x, y }, before = JSON.stringify({ v, size, offset });
      const result = zoom.clampIndopakFocusOffset(v, size, offset);
      assert.ok(result.x >= 0 && result.x <= Math.max(0, size.width - v.width));
      assert.ok(result.y >= 0 && result.y <= Math.max(0, size.height - v.height));
      assert.equal(JSON.stringify({ v, size, offset }), before); cases++;
    }
  }
  assert.equal(cases, 400);
});

test('zero/one/three fingers, coincident points and invalid geometry never start a pinch', () => {
  for (const pair of [[], [{ x: 100, y: 200 }], [...points(80), { x: 40, y: 40 }], points(0), points(5), [{ x: NaN, y: 0 }, { x: 100, y: 100 }]]) {
    assert.equal(zoom.beginIndopakPinch(viewport, base, { x: 0, y: 0 }, 1, pair), null);
  }
  for (const value of [0, -1, NaN, Infinity]) for (const field of ['width', 'height']) {
    assert.equal(zoom.beginIndopakPinch({ ...viewport, [field]: value }, base, { x: 0, y: 0 }, 1, points(80)), null);
    assert.equal(zoom.beginIndopakPinch(viewport, { ...base, [field]: value }, { x: 0, y: 0 }, 1, points(80)), null);
    assert.deepEqual(plain(zoom.clampIndopakFocusOffset({ ...viewport, [field]: value }, base, { x: 100, y: 200 })), { x: 0, y: 0 });
  }
  for (const value of [0, -1, NaN, Infinity, 3.01]) assert.equal(zoom.beginIndopakPinch(viewport, base, { x: 0, y: 0 }, value, points(80)), null);
});

test('invalid ongoing frames are rejected, and finite events cannot accumulate anchor drift or mutate a snapshot', () => {
  const start = zoom.beginIndopakPinch(viewport, base, { x: 0, y: 0 }, 1, points(80)), before = JSON.stringify(start);
  for (const pair of [[], points(0), [...points(80), { x: 0, y: 0 }], [{ x: Infinity, y: 0 }, { x: 20, y: 0 }]]) assert.equal(zoom.moveIndopakPinch(start, viewport, pair), null);
  for (const value of [0, -1, NaN, Infinity, 4]) assert.equal(zoom.moveIndopakPinch({ ...start, zoom: value }, viewport, points(80)), null);
  for (let i = 0; i < 300; i++) zoom.moveIndopakPinch(start, viewport, points(80 + i / 2));
  assert.equal(JSON.stringify(start), before);
  const final = zoom.moveIndopakPinch(start, viewport, points(80)); assert.equal(final.zoom, 1); assert.deepEqual(plain(final.offset), { x: 0, y: 0 });
});

test('magnification is transient, context-reset and Focus-only; the stable recognizer cancels holds/swipes and leaves Unlock outside its viewport', () => {
  const reader = fs.readFileSync(path.join(__dirname, '../src/components/IndopakMushafReader.tsx'), 'utf8');
  assert.ok(reader.includes('focusMode && focused && magnification.context === zoomContext ? magnification.zoom : 1'));
  assert.ok(reader.includes("${state.page}:${viewport.width}:${viewport.height}"));
  assert.ok(reader.includes('gestureSession.current = null; pendingMagnification.current = null;'));
  assert.ok(reader.includes('setMagnification(current => current.context === zoomContext && current.zoom === 1'));
  assert.ok(reader.includes('setMagnification({ context: zoomContext, zoom: next.zoom })'));
  for (const forbidden of ['update({ zoom', 'state.zoom', 'latest.current.zoom', 'indopak-zoom']) assert.ok(!reader.includes(forbidden));
  assert.equal((reader.match(/PanResponder.create\(/g) || []).length, 1);
  assert.ok(reader.includes('useLayoutEffect(() => { gestureHandlers.current = handlers; })'));
  assert.ok(reader.includes("touchAction: focusMode ? 'none' : 'pan-y'"));
  assert.ok(reader.includes("if (!focusMode || event.nativeEvent.touches?.length !== 2)"));
  assert.ok(reader.includes("gestureSession.current?.kind === 'pinch' && event.nativeEvent.touches?.length !== 2"));
  assert.ok(reader.includes('hold.current.blocked = true; endWord(); closeSelection();'));
  assert.ok(reader.includes('onTouchCancel={cancelGesture}'));
  assert.ok(reader.includes("node?.addEventListener('wheel', wheel, { passive: false })"));
  const unlock = reader.indexOf('focusMode && <Pressable ref={unlockButton}');
  assert.ok(unlock > reader.indexOf('</SystemModal>}')); assert.ok(reader.slice(unlock).includes('onPress={exitFocus}'));
});
