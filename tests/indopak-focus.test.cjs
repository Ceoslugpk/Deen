const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader();
const model = load('src/services/indopakMushaf.ts');
const { clearIndopakFocusPopover, fitIndopakFocusPage, INDOPAK_FOCUS_UNLOCK: U } = load('src/services/indopakFocus.ts');
const { indopakAyahSegments, indopakPageOrigin, indopakPopoverLayout } = load('src/services/indopakSelection.ts');
const plain = x => JSON.parse(JSON.stringify(x));
const close = (a, b) => assert.ok(Math.abs(a - b) < .00001, `${a} != ${b}`);
const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const overlaps = (a, b) => a.x < b.x + b.width - .001 && a.x + a.width > b.x + .001 && a.y < b.y + b.height - .001 && a.y + a.height > b.y + .001;

test('focus fits the complete, unchanged paper in both safe dimensions, including short landscape', () => {
  let cases = 0;
  for (const width of [240, 280, 320, 390, 640, 844, 1280, 1440]) for (const height of [200, 240, 268, 320, 390, 480, 548, 640, 672, 844, 1104, 1280]) {
    const size = fitIndopakFocusPage(width, height);
    assert.ok(size.width > 0 && size.height > 0 && size.width <= width - 11.99 && size.height <= height - 11.99);
    close(size.height / size.width, 1.64);
    const origin = indopakPageOrigin({ width, height }, size), control = { x: width - U.inset - U.size, y: U.inset, width: U.size, height: U.size };
    const body = { x: origin.x + 48 * size.width / 1000, y: origin.y + 92 * size.height / 1640,
      width: 904 * size.width / 1000, height: 1452 * size.height / 1640 };
    assert.equal(overlaps(body, control), false, `Unlock cannot cover scripture: ${width}×${height}`);
    cases++;
  }
  assert.equal(cases, 96); assert.equal(U.size, 44);
});

test('focus uses the maximum whole-page fit whenever the corner is already clear', () => {
  for (const [width, height] of [[390, 844], [844, 390], [800, 1280], [1440, 900]]) {
    assert.deepEqual(plain(fitIndopakFocusPage(width, height)), plain(model.fitIndopakPage(width, height, 1)));
  }
});

test('near the printed aspect ratio the floating unlock gets only its needed clear space, not a new toolbar', () => {
  const viewport = { width: 390, height: 640 }, size = fitIndopakFocusPage(viewport.width, viewport.height);
  const before = model.fitIndopakPage(viewport.width, viewport.height, 1);
  assert.ok(size.height < before.height && size.height > before.height * .9);
  const origin = indopakPageOrigin(viewport, size);
  close(origin.y + 92 * size.height / 1640, U.inset + U.size + U.gap);
});

test('every original word on all 548 pages stays clear of the top-right unlock, without reflowing a source line', () => {
  for (const [width, height] of [[240, 400], [390, 640], [844, 390]]) {
    const viewport = { width, height }, size = fitIndopakFocusPage(width, height), origin = indopakPageOrigin(viewport, size);
    const control = { x: width - U.inset - U.size, y: U.inset, width: U.size, height: U.size };
    for (let n = 1; n <= 548; n++) {
      const page = model.indopakPage(n), lines = model.placeIndopakPage(page);
      assert.equal(lines.length, page.lines.length);
      for (const line of lines) for (const word of line.words) {
        const rect = { x: origin.x + word.boxX * size.width / 1000, y: origin.y + line.top * size.height / 1640,
          width: word.width * size.width / 1000, height: line.height * size.height / 1640 };
        assert.equal(overlaps(rect, control), false, `Page ${n}, word ${word.id}, ${width}×${height}`);
      }
    }
  }
});

test('every ayah popup on all 548 pages clears Unlock without covering its selected fragment', () => {
  let shifted = 0;
  for (const [width, height] of [[166, 400], [240, 400], [390, 640], [390, 844], [844, 390]]) {
    const viewport = { width, height }, size = fitIndopakFocusPage(width, height);
    const control = { x: width - U.inset - U.size, y: U.inset, width: U.size, height: U.size };
    for (let n = 1; n <= 548; n++) {
      const segments = indopakAyahSegments(model.placeIndopakPage(model.indopakPage(n)));
      for (const segment of segments) {
        const base = indopakPopoverLayout(viewport, size, { x: 0, y: 0 }, segments, { verse: segment.verse, wordId: segment.firstWord });
        const popup = clearIndopakFocusPopover(viewport, base); assert.ok(popup);
        assert.equal(overlaps(popup, control), false, `Page ${n}, ${segment.verse}, ${width}×${height}`);
        assert.ok(popup.x >= 6 && popup.x + popup.width <= width - 6 && popup.y >= 6 && popup.y + popup.height <= height - 6);
        assert.ok(popup.y + popup.height <= popup.target.y || popup.y >= popup.target.bottom);
        if (popup !== base) shifted++;
      }
    }
  }
  assert.ok(shifted > 0); assert.equal(clearIndopakFocusPopover({ width: 390, height: 844 }, null), null);
});

test('unmeasured and non-finite focus dimensions safely return finite zero-size paper', () => {
  for (const bad of [0, -1, NaN, Infinity]) {
    for (const size of [fitIndopakFocusPage(bad, 844), fitIndopakFocusPage(390, bad)]) assert.deepEqual(plain(size), { width: 0, height: 0 });
  }
});

test('Focus mode and Unlock use the existing translations in all 22 supported interface languages', async () => {
  const copy = load('src/services/arabicCopy.ts');
  for (const language of ['en', 'ar', 'ur', 'fa', 'ps', 'fr', 'tr', 'ru', 'uz', 'kk', 'zh', 'vi', 'az', 'bs', 'bg', 'si', 'bn', 'hi', 'id', 'ms', 'ta', 'ml']) {
    await copy.loadCopy(language);
    for (const text of ['Focus mode', 'Unlock']) {
      const label = copy.tx(language, text); assert.ok(label.trim());
      if (language !== 'en') assert.notEqual(label, text, `${language}/${text}`);
    }
  }
});

test('focus hides only this reader chrome/player reserve, keeps an accessible unlock outside page gestures and cleans up on blur', () => {
  const app = source('App.tsx'), reader = source('src/components/IndopakMushafReader.tsx'), icons = source('src/components/CustomIcon.tsx');
  const screen = app.slice(app.indexOf('function IndopakQuranScreen('), app.indexOf('function ReaderScreen('));
  assert.ok(screen.includes('hidePlayerInset={focusMode} fullWidth={focusMode}'));
  assert.ok(screen.includes('!focusMode&&<ToolBar')); assert.ok(screen.includes('paddingBottom:focusMode?0:12'));
  assert.ok(screen.includes('useFocusEffect(useCallback(()=>()=>setFocusMode(false)'));
  assert.ok(!screen.includes('setChromeHidden')); assert.ok(!screen.includes('writeJson'));
  assert.ok(app.includes('focusMode: indopakActive && indopakFocusMode'));
  assert.ok(app.includes('if (!audio.track || focusMode) return null;'));
  assert.ok(app.includes('audio.track && !hidePlayerInset')); assert.ok(app.includes('width > 700 && !fullWidth && s.pageWide'));
  assert.ok(reader.includes('!focusMode && <View testID="indopak-top-controls"'));
  assert.ok(reader.includes("testID: 'indopak-focus'")); assert.ok(reader.includes('focusMode && <Pressable ref={unlockButton} testID="indopak-unlock"'));
  assert.ok(!reader.includes('indopak-zoom')); assert.ok(!reader.includes('state.zoom')); assert.ok(!reader.includes('latest.current.zoom'));
  assert.ok(reader.includes('fitIndopakFocusPage(viewport.width, viewport.height)'));
  assert.ok(reader.includes('fitIndopakPage(viewport.width, viewport.height, 1, true)'));
  assert.ok(reader.includes('captureIndopakSwipe(1, gesture)')); assert.ok(reader.includes('indopakSwipePage(from!, 1,'));
  assert.ok(reader.includes('right: INDOPAK_FOCUS_UNLOCK.inset')); assert.ok(reader.includes("focusRoot: { direction: 'ltr' }"));
  assert.ok(reader.indexOf('testID="indopak-unlock"') > reader.indexOf('</SystemModal>}'), 'Unlock is outside the page viewport responder and modal branches');
  assert.ok(reader.includes("event.key === 'Escape'")); assert.ok(reader.includes("BackHandler.addEventListener('hardwareBackPress', unlock)"));
  assert.ok(reader.includes('if (selection || picker) return false')); assert.ok(reader.includes('onAccessibilityEscape={focusMode ? exitFocus : undefined}'));
  assert.ok(reader.includes('turn.focusMode !== focusMode')); assert.ok(reader.includes('h.focusMode !== focusMode'));
  assert.ok(icons.includes("case'fullscreen':")); assert.ok(icons.includes("case'lock-open':"));
});

test('legacy saved zoom/bookmarks/reading markers still load read-only and are never migrated into a focus preference', async () => {
  const old = { version: 1, edition: 'indopak-taj-16', page: 274, zoom: 2, savedPages: [1, 274],
    readingPoint: { page: 1, verse: '1:1', wordId: 1 } };
  const calls = [];
  const state = createLoader({ './storage': {
    readJson: async key => { calls.push(['read', key]); return old; },
    writeJson: async (key, value) => { calls.push(['write', key, value]); return true; },
  } })('src/services/indopakState.ts');
  const restored = await state.loadIndopakState(); assert.deepEqual(plain(restored), old); assert.equal(calls.length, 1);
  assert.ok(!Object.hasOwn(restored, 'focusMode'));
  await state.saveIndopakState(restored); assert.deepEqual(plain(calls[1][2]), old);
  assert.ok(calls.every(call => call[1] === state.INDOPAK_STATE_KEY));
});
