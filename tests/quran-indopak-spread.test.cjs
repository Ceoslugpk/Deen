const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * The opened mushaf, drawn turned inside an upright window.
 *
 * The first attempt turned the device: it asked the native binary to permit
 * every orientation and held portrait in code everywhere else. One failure in
 * that lock would have left the whole app rotating. So the page turns instead
 * of the phone.
 *
 * These tests hold what makes that safe, and what the app gave up to get it:
 *   - the app declares portrait again, and nothing asks the device to turn;
 *   - a spread is only opened when the window is taller than wide;
 *   - page 1 opens on the right, alone, as a printed mushaf does;
 *   - a turn moves two leaves, in the direction asked for.
 */

const load = createLoader(
  { 'react-native': { Platform: { OS: 'web' } } },
  { process: { env: {} }, __DEV__: false },
);
const orientation = load('src/services/readerOrientation.ts');

const app = () => fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
const reader = () => fs.readFileSync(path.join(__dirname, '../src/components/IndopakMushafReader.tsx'), 'utf8');
const config = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../app.json'), 'utf8'));
const service = () => fs.readFileSync(path.join(__dirname, '../src/services/readerOrientation.ts'), 'utf8');
/** The landscape control's JSX, from its opening tag to the end of the block. */
const controlSource = () => {
  const source = reader();
  const at = source.indexOf('{focusMode && <Pressable testID="indopak-landscape"');
  assert.ok(at > 0, 'the landscape control is present');
  return source.slice(at, source.indexOf('</Pressable>}', at) + '</Pressable>}'.length);
};

/* ------------------------------------------------------------------ */
/* The app never turns                                                 */
/* ------------------------------------------------------------------ */

test('the app is portrait again, declared in the binary', () => {
  /* Holding the lock in code was the price of turning the device. Since the
     device no longer turns, the strongest declaration is available again: the
     binary refuses landscape outright, so no code path can leave the app
     sideways. */
  assert.equal(config().expo.orientation, 'portrait');
});

test('nothing asks the device to rotate', () => {
  const plugins = config().expo.plugins.map((p) => (typeof p === 'string' ? p : p[0]));
  assert.ok(!plugins.includes('expo-screen-orientation'), 'the orientation module is not configured');
  for (const [name, text] of [['App.tsx', app()], ['the reader', reader()], ['the service', service()]]) {
    assert.ok(!text.includes('expo-screen-orientation'), `${name} does not import it`);
    assert.ok(!text.includes('lockAsync'), `${name} does not lock the device`);
    assert.ok(!text.includes('usePortraitOnly'), `${name} does not need a runtime portrait lock`);
  }
});

test('rotating the content is a transform, not a permission', () => {
  assert.ok(reader().includes("transform: [{ rotate: '-90deg' }]"), 'the leaves are turned by a quarter circle');
  /* The rotation wraps both leaves together, so they remain one object: a
     shared gutter, no drift, and gestures transformed with them. */
  const block = reader().slice(reader().indexOf("transform: [{ rotate: '-90deg' }]") - 700);
  assert.ok(block.includes('flexDirection: \'row\''), 'the block is laid out as a landscape row');
});

/* ------------------------------------------------------------------ */
/* Two pages, or one                                                   */
/* ------------------------------------------------------------------ */

test('a spread only opens when the window is taller than it is wide', () => {
  const { canOpenSpread } = orientation;
  assert.equal(canOpenSpread(400, 800), true, 'a portrait phone can hold a turned spread');
  assert.equal(canOpenSpread(800, 400), false, 'a wide window would make the pages smaller, not bigger');
  assert.equal(canOpenSpread(500, 500), false, 'a square window gains nothing from turning');
  assert.equal(canOpenSpread(0, 0), false, 'and nonsense is refused rather than divided by');
});

test('the turned block fits the window without distorting either page', () => {
  const { spreadBlock, SPREAD_GUTTER } = orientation;
  const aspect = 1000 / 1640;               // the page's own aspect, from the viewBox
  const window = { width: 400, height: 800 };
  const block = spreadBlock(window.width, window.height, aspect);
  /* Turned, the block occupies `height` across and `width` down, so it has to
     fit inside the window once rotated. */
  assert.ok(block.width <= window.height + 0.001, 'fits across the turned window');
  assert.ok(block.height <= window.width + 0.001, 'and down it');
  /* Two leaves plus the gutter: the block is twice a leaf wide. */
  const leaf = (block.width - SPREAD_GUTTER) / 2;
  assert.ok(Math.abs(leaf / block.height - aspect) < 0.01, 'each leaf keeps the page aspect exactly');
});

test('page one opens alone, on the right', () => {
  const { spreadPages } = orientation;
  const first = spreadPages(1);
  assert.equal(first.right, 1, 'page 1 is the right-hand leaf');
  assert.equal(first.left, 0, 'and there is nothing to its left');
  assert.equal(first.first, 1);
});

test('every other leaf carries an odd page on the right', () => {
  const { spreadPages } = orientation;
  for (const page of [2, 3, 4, 5, 10, 11, 546, 547]) {
    const { left, right } = spreadPages(page);
    assert.equal(right % 2, 1, `page ${page} resolves to an odd right leaf`);
    assert.equal(left, right - 1, 'and the even page to its left');
  }
  /* 548 is even, so it is the left leaf of a spread whose right does not
     exist. An even page on a right leaf would renumber the mushaf. */
  assert.equal(spreadPages(548).right, null, 'the last spread has nothing on its right');
  assert.equal(spreadPages(4).right, 5);
  assert.equal(spreadPages(4).left, 4);
});

test('the book does not open past its own last page', () => {
  const { spreadPages, turnSpread } = orientation;
  /* 548 is the last page and it is even, so it sits on the left of a spread
     whose right leaf does not exist. The right leaf is clamped rather than
     inventing page 549. */
  const last = spreadPages(548);
  assert.equal(last.left, 548, 'the last page is the left leaf of the final spread');
  assert.equal(last.right, null, 'with no page invented beside it');
  assert.equal(turnSpread(548, true), 548, 'and a forward turn at the end stays put');
  assert.equal(turnSpread(1, false), 1, 'as does a backward turn at the beginning');
});

/* ------------------------------------------------------------------ */
/* Turning the leaf                                                    */
/* ------------------------------------------------------------------ */

test('a turn moves two pages in the direction asked for', () => {
  const { turnSpread, spreadPages } = orientation;
  /* From the spread showing 4|5: forward lands on the spread 6|7, stored as 6;
     backward on the spread 2|3, stored as 2. (Stored by the left leaf, so the
     previous spread is 2, not 3.) */
  assert.equal(spreadPages(4).right, 5);
  assert.equal(turnSpread(4, true), 6, 'forward moves to the next spread');
  assert.equal(spreadPages(4).left, 4);
  assert.equal(turnSpread(4, false), 2, 'backward moves to the previous spread');
  assert.deepEqual([spreadPages(turnSpread(4, false)).left, spreadPages(turnSpread(4, false)).right], [2, 3],
    'and that spread really is 2|3');
  /* And it does not oscillate: turning forward twice is two spreads on. */
  assert.equal(turnSpread(turnSpread(4, true), true), 8);
});

test('the single-page reader is untouched by any of this', () => {
  const source = reader();
  const turn = source.slice(source.indexOf('if (spread) number = turnSpread'), source.indexOf('if (from !== number)'));
  /* Outside a spread, `number` is exactly what the caller asked for. */
  assert.ok(turn.includes('if (spread)'), 'the two-page step is conditional on two pages being open');
  const guard = source.slice(source.indexOf('const goPage ='), source.indexOf('if (spread) number'));
  assert.ok(!guard.includes('turnSpread'), 'nothing before it changes the target');
});

/* ------------------------------------------------------------------ */
/* The control                                                         */
/* ------------------------------------------------------------------ */

test('the control sits beside the lock, only in focus mode', () => {
  const source = reader();
  const at = source.indexOf('testID="indopak-landscape"');
  assert.ok(at > 0, 'the control exists');
  const before = source.slice(Math.max(0, at - 400), at);
  assert.ok(before.includes('{focusMode && <Pressable'), 'drawn only in focus mode');
  assert.ok(at > source.indexOf('testID="indopak-unlock"'), 'and after the lock, so the two sit together');
  const control = controlSource();
  assert.ok(control.includes("'rotate'"), 'it offers the turn');
  assert.ok(control.includes("'rotate-back'"), 'and the way back');
  assert.ok(control.includes('accessibilityState={{ selected: sideBySide }}'), 'it says which state it is in');
});

test('the two controls do not overlap', () => {
  const source = reader();
  const style = source.slice(source.indexOf('landscape: {'), source.indexOf('unlock: {'));
  assert.ok(style.includes('INDOPAK_FOCUS_UNLOCK.size + INDOPAK_FOCUS_UNLOCK.gap'),
    'the offset is derived from the lock’s own geometry');
});

test('leaving focus mode closes the book', () => {
  const source = reader();
  const effect = source.slice(source.indexOf('if (!focusMode && sideBySide)'), source.indexOf('}, [focusMode, sideBySide]);'));
  assert.ok(effect.includes('setSideBySide(false)'), 'the spread is closed with focus mode');
  /* Nothing else has to be undone, because nothing outside this screen moved. */
  assert.ok(!source.includes('applyReaderOrientation'), 'there is no device state to restore');
});

/* ------------------------------------------------------------------ */
/* The icon, and the turn animation                                    */
/* ------------------------------------------------------------------ */

test('the control uses a glyph that exists', () => {
  const icons = fs.readFileSync(path.join(__dirname, '../src/components/CustomIcon.tsx'), 'utf8');
  const control = controlSource();
  /* The first version asked for `phone-landscape-outline` and
     `phone-portrait-outline`, which are not in this icon set - they fell
     through to the generic circle-and-sun default, so the button showed a sun.
     A control whose glyph does not exist is worse than one with no glyph: it
     says the wrong thing quietly. */
  const used = [...control.matchAll(/'([a-z][a-z0-9-]*)'/g)].map((m) => m[1])
    .filter((name) => !['button', 'selected', 'card', 'line', 'green', 'ink'].includes(name));
  assert.ok(used.length >= 1, 'the control names an icon');
  for (const name of used) {
    const base = name.replace(/-outline$/, '');
    assert.ok(icons.includes(`case'${base}':`), `"${name}" is a real glyph in CustomIcon`);
  }
  assert.ok(!used.includes('phone-landscape-outline'), 'the invented name is gone');
  assert.ok(!used.includes('phone-portrait-outline'), 'and so is the other');
});

test('the rotation glyph shows a turning leaf, not a phone', () => {
  const icons = fs.readFileSync(path.join(__dirname, '../src/components/CustomIcon.tsx'), 'utf8');
  const rotate = icons.slice(icons.indexOf("case'rotate':"), icons.indexOf("case'rotate-back':"));
  assert.ok(rotate.includes('<Rect'), 'a page');
  assert.ok(rotate.includes('<Path'), 'and an arrow showing the turn');
  const back = icons.slice(icons.indexOf("case'rotate-back':"), icons.indexOf("case'rotate-back':") + 400);
  assert.ok(back.includes('<Rect'), 'the way back has its own glyph, mirrored');
});

test('a spread turns with the same fold the portrait page uses', () => {
  const source = reader();
  /* Not a new animation: the existing paper fold, given the block to turn. */
  const overlay = source.slice(source.indexOf('{turn && turn.spread && <IndopakPageFold'));
  assert.ok(overlay.includes('progress={turnProgress}'), 'driven by the same progress value');
  assert.ok(overlay.includes('direction={turn.plan.direction}'), 'and the same turn plan');
  assert.ok(overlay.includes('colors={C} dark={dark}'), 'and the same paper colours');
});

test('the spread fold is measured against the block, not the window', () => {
  const { spreadFoldFrame } = orientation;
  const frame = spreadFoldFrame(600, 400);
  /* The block is two leaves wide; a fold measured against the upright window
     would put its crease in the wrong place and its paper at the wrong size. */
  assert.equal(frame.viewport.width, 600);
  assert.equal(frame.viewport.height, 400);
  assert.equal(JSON.stringify(frame.scroll), JSON.stringify({ x: 0, y: 0 }), 'the block never scrolls, so nothing is compensated for');
  assert.equal(frame.size.width, 600, 'the folded surface spans the whole block');
});

test('the fold rides inside the rotated container', () => {
  const source = reader();
  const block = source.indexOf("transform: [{ rotate: '-90deg' }]");
  const overlay = source.indexOf('{turn && turn.spread && <IndopakPageFold');
  const leaves = source.lastIndexOf('</View>', overlay);
  /* It must be a child of the turned block so it inherits the quarter turn;
     drawing it outside would need a second rotation kept in sync by hand. */
  assert.ok(overlay > block, 'the overlay is after the turned block begins');
  assert.ok(leaves > block, 'and inside it');
});

test('only one fold runs at a time', () => {
  const source = reader();
  /* The portrait overlay and the spread overlay are mutually exclusive, or two
     papers would peel at once over the same page. */
  assert.ok(source.includes('{turn && turn.spread && <IndopakPageFold'), 'the spread overlay');
  assert.ok(source.includes('{turn && !turn.spread && <IndopakPageFold'), 'the portrait overlay excluded during a spread turn');
});

test('a turn that closes the book still animates', () => {
  const source = reader();
  const control = controlSource();
  /* Opening and closing the spread is not a page turn, so it must not steal the
     turning lock or suppress the verse popover: it only changes how the same
     page is drawn. */
  assert.ok(!control.includes('turning.current'), 'closing the book does not fake a page turn');
  assert.ok(!control.includes('setTurn('), 'and does not drive the fold');
});
