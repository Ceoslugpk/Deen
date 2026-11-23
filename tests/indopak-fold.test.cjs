const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { indopakFoldGeometry, indopakFoldRange } = createLoader()('src/services/indopakFold.ts');
const viewport = { width: 390, height: 640 }, size = { width: 360, height: 590 }, origin = { x: 0, y: 0 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < .0001, `${actual} != ${expected}`);

test('fold geometry follows a centred paper, not the full viewport', () => {
  const g = indopakFoldGeometry(viewport, size, origin);
  assert.ok(g); assert.equal(g.left, 15); assert.equal(g.right, 375);
  assert.equal(g.paperTop, 25); assert.equal(g.paperHeight, 590);
  close(g.foldWidth, 54); close(g.shadowWidth, 27); close(g.bandWidth, 81);
  for (const p of [g.backPath, g.shadowPath]) {
    assert.match(p, /^M [\d.]+ 0 C /); assert.ok(p.endsWith(' Z')); assert.ok(!/NaN|Infinity/.test(p));
    assert.ok(p.includes(' C '), 'Decorative paper/shadow is curved, not another square sliding panel');
  }
});

test('zoomed snapshots retain both actual scroll offsets', () => {
  const g = indopakFoldGeometry(viewport, { width: 585, height: 960 }, { x: 130, y: 210 });
  assert.equal(g.left, 0); assert.equal(g.right, 390); assert.equal(g.paperTop, -210); assert.equal(g.paperHeight, 960);
});

test('wide landscape centres the paper and retains vertical scroll without scaling to a thumbnail', () => {
  const g = indopakFoldGeometry({ width: 844, height: 250 }, { width: 560, height: 918.4 }, { x: 0, y: 333 });
  assert.equal(g.left, 142); assert.equal(g.right, 702); assert.equal(g.paperTop, -333); assert.equal(g.paperHeight, 918.4);
  assert.equal(g.foldWidth, 84);
});

test('moving clip and opposite face transforms leave every scripture coordinate anchored in both directions', () => {
  for (const [v, s, scroll] of [[viewport, size, origin], [viewport, { width: 585, height: 960 }, { x: 130, y: 210 }]]) {
    const g = indopakFoldGeometry(v, s, scroll);
    for (const direction of [1, -1]) {
      const range = indopakFoldRange(g, v.width, direction);
      assert.deepEqual(Array.from(range.edge), direction === 1 ? [g.left, g.right] : [g.right, g.left]);
      for (let i = 0; i <= 100; i++) {
        const p = i / 100, at = numbers => numbers[0] + (numbers[1] - numbers[0]) * p;
        close(at(range.mask) + at(range.face), 0);
        close(direction === 1 ? at(range.mask) : at(range.mask) + v.width, at(range.edge));
        const remaining = direction === 1 ? g.right - at(range.edge) : at(range.edge) - g.left;
        close(remaining, (g.right - g.left) * (1 - p));
      }
    }
  }
});

test('fold and shadow dimensions stay finite and bounded from narrow covers to large tablets', () => {
  for (const width of [1, 120, 240, 280, 390, 844, 1440, 2400]) {
    const g = indopakFoldGeometry({ width, height: 640 }, { width, height: width * 1.64 }, origin);
    assert.ok(g.foldWidth > 0 && g.foldWidth <= 84 && g.foldWidth <= width * .38);
    assert.ok(g.shadowWidth >= 8); close(g.bandWidth, g.foldWidth + g.shadowWidth);
    assert.ok(Object.values(g).every(n => typeof n !== 'number' || Number.isFinite(n)));
  }
});

test('unmeasured/non-finite geometry and a fully offscreen horizontal snapshot never create a fold', () => {
  for (const value of [0, -1, NaN, Infinity, -Infinity]) {
    for (const key of ['width', 'height']) {
      assert.equal(indopakFoldGeometry({ ...viewport, [key]: value }, size, origin), null);
      assert.equal(indopakFoldGeometry(viewport, { ...size, [key]: value }, origin), null);
    }
  }
  for (const value of [NaN, Infinity, -Infinity]) for (const key of ['x', 'y']) {
    assert.equal(indopakFoldGeometry(viewport, size, { ...origin, [key]: value }), null);
  }
  assert.equal(indopakFoldGeometry(viewport, size, { x: 1000, y: 0 }), null);
  assert.equal(indopakFoldGeometry(viewport, size, { x: -1000, y: 0 }), null);
});

test('only the blank paper back can mirror/scale; the live Quran has no animated transform', () => {
  const fold = fs.readFileSync(path.join(__dirname, '../src/components/IndopakPageFold.tsx'), 'utf8');
  const reader = fs.readFileSync(path.join(__dirname, '../src/components/IndopakMushafReader.tsx'), 'utf8');
  const live = reader.slice(reader.indexOf('<View testID="indopak-page-current"'), reader.indexOf('{turn && <IndopakPageFold'));
  assert.ok(live.includes('<IndopakPageCanvas'));
  assert.ok(!live.includes('Animated.View'), 'the live Quran is never animated');
  /* The rule this protects is that the Quran ink is never flipped, scaled or
     sheared by a transform. A rigid quarter-circle turn is a different thing:
     it moves the page from portrait to landscape without mirroring or
     distorting a single letter, which is what lets two leaves lie open in an
     upright window. Mirroring and scaling stay confined to the animation. */
  /* Only the pages themselves: the fold overlay that peels away during a turn
     lives in the same block and legitimately translates, so it is cut out
     before the check rather than being mistaken for the Quran moving. */
  const overlayAt = live.indexOf('{turn && turn.spread && <IndopakPageFold');
  const pagesOnly = overlayAt < 0 ? live : live.slice(0, overlayAt);
  const transforms = pagesOnly.match(/transform:\s*\[[^\]]*\]/g) || [];
  for (const transform of transforms) {
    assert.ok(/rotate:\s*'-?90deg'/.test(transform), `a live transform must be a rigid turn, found: ${transform}`);
    assert.ok(!/scaleX|scaleY|scale:|rotateX|rotateY|skew/i.test(transform), 'never a mirror, a scale or a skew');
  }
  /* The fold overlay is animated; the pages are not. */
  const withoutOverlay = pagesOnly;
  assert.ok(!/Animated\.[A-Z]/.test(withoutOverlay), 'and nothing drawn as a page is animated');
  const face = fold.slice(fold.indexOf('testID="indopak-fold-face"'), fold.indexOf('testID="indopak-fold-edge"'));
  assert.ok(face.includes('{children}')); assert.ok(!face.includes('scaleX')); assert.ok(!face.includes('opacity:'));
  for (const id of ['indopak-fold-mask', 'indopak-fold-face', 'indopak-fold-edge', 'indopak-fold-paper', 'indopak-fold-shadow', 'indopak-fold-back']) assert.ok(fold.includes(id));
  assert.ok(fold.includes('overflow: \'hidden\'')); assert.ok(fold.includes('range.mask')); assert.ok(fold.includes('range.face'));
  assert.ok(fold.includes('<LinearGradient')); assert.ok(fold.includes('scaleX: direction'));
  assert.ok(fold.includes("coordinates: { direction: 'ltr' }"), 'Quran fold coordinates do not inherit the interface language direction');
  assert.ok(!fold.includes('rotateY')); assert.ok(!fold.includes('perspective'));
  assert.ok(!fold.includes('setInterval')); assert.ok(!fold.includes('addListener'));
});
