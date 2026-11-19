/** Actual production WEB, preset buttons/touch panning and original bundled outlines.
 * No mocked scripture/audio responses or direct test writes to reader state/storage. Not native-device frame-rate QA.
 * INDOPAK_URL=http://127.0.0.1:8107 node tests/verify-indopak-zoom-web.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { makePage, gotoPage, pause, touchSwipe, expectPage, box } = require('./verify-indopak-web.cjs');
const output = process.env.INDOPAK_ZOOM_ARTIFACTS_DIR || '/tmp/islamic-r100-zoom';
const key = '@deen/quran/indopak-taj-16/state/v1';
const oldKeys = ['@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1'];
const read = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), key);
async function geometry(page) {
  await pause(page);
  return page.evaluate(() => {
    const find = id => document.querySelector(`[data-testid="indopak-${id}"]`);
    const viewport = find('page-viewport').getBoundingClientRect(), svg = find('page-svg');
    return { viewport: { width: viewport.width, height: viewport.height },
      size: { width: Number(svg.getAttribute('width')), height: Number(svg.getAttribute('height')) },
      scroll: { x: find('horizontal-scroll').scrollLeft, y: find('vertical-scroll').scrollTop },
      label: find('zoom').getAttribute('aria-label'), lines: svg.querySelectorAll('[data-testid^="indopak-line-"]').length };
  });
}
function expected(before, after) {
  const axis = (name, extent) => {
    const oldOrigin = Math.max(0, (before.viewport[extent] - before.size[extent]) / 2);
    const anchor = (before.scroll[name] + before.viewport[extent] / 2 - oldOrigin) / before.size[extent];
    const newOrigin = Math.max(0, (after.viewport[extent] - after.size[extent]) / 2);
    return Math.max(0, Math.min(Math.max(0, after.size[extent] - after.viewport[extent]), newOrigin + anchor * after.size[extent] - after.viewport[extent] / 2));
  };
  return { x: axis('x', 'width'), y: axis('y', 'height') };
}
function checkAnchor(before, after, label) {
  const offset = expected(before, after);
  for (const axis of ['x', 'y']) assert.ok(Math.abs(after.scroll[axis] - offset[axis]) < 2.1,
    `${label} preserves the ${axis} page point, except at paper edges: ${JSON.stringify({ before, after, offset })}`);
  assert.ok(Math.abs(after.size.height / after.size.width - 1.64) < .00001, 'Original page aspect ratio is unchanged');
  assert.equal(after.lines, 16);
  return { label, before, after, expected: offset };
}
async function zoom(page, action = button => button.click()) {
  const before = await geometry(page);
  await action(page.getByTestId('indopak-zoom'));
  await page.waitForFunction(width => Number(document.querySelector('[data-testid="indopak-page-svg"]').getAttribute('width')) !== width, before.size.width);
  await page.waitForTimeout(80);
  const after = await geometry(page);
  return checkAnchor(before, after, 'Preset zoom');
}
async function visibleWord(page) {
  return page.getByTestId('indopak-page-viewport').evaluate(stage => {
    const bounds = stage.getBoundingClientRect();
    const words = [...stage.querySelectorAll('rect[data-testid^="indopak-word-"]')].map(e => {
      const r = e.getBoundingClientRect();
      return { id: Number(e.getAttribute('data-testid').split('-').at(-1)), verse: e.getAttribute('aria-label').match(/\d+:\d+/)[0],
        x: r.x, y: r.y, right: r.right, bottom: r.bottom };
    }).filter(r => r.x > bounds.x + 4 && r.right < bounds.right - 4 && r.y > bounds.y + 4 && r.bottom < bounds.bottom - 4);
    return words[Math.floor(words.length / 2)];
  });
}
async function rememberInk(page) {
  await page.evaluate(() => {
    window.__zoomInk = [...document.querySelectorAll('[data-testid^="indopak-ink-"]')].map(node => ({ node, d: node.getAttribute('d'), transform: node.getAttribute('transform') }));
  });
}
async function sameInk(page) {
  assert.equal(await page.evaluate(() => window.__zoomInk.every(({ node, d, transform }) => node.isConnected
    && node.getAttribute('d') === d && node.getAttribute('transform') === transform)), true,
  'Zoom/selection preserve the same original-font paths and placement instead of replacing scripture nodes');
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  const report = { method: 'Running production WEB, real preset presses and Chromium touch input; not installed Android/iOS/device performance', profiles: [], errors: [] };
  let active;
  try {
    for (const [name, width, height, language, dark] of [
      ['phone', 390, 844, 'en', false], ['cover', 280, 720, 'en', false],
      ['landscape', 844, 390, 'en', false], ['tall-cover', 280, 1440, 'en', false],
      ['tablet', 800, 1280, 'en', false], ['urdu-dark', 390, 844, 'ur', true],
    ]) {
      const own = await makePage(browser, language, dark); active = own.page;
      const { page } = own; report.errors.push(own.errors);
      await page.setViewportSize({ width, height }); await gotoPage(page, 274); await page.waitForTimeout(400);
      const old = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys);
      await page.getByTestId('indopak-save-page').click();
      await rememberInk(page);
      const result = { name, viewport: { width, height }, zooms: [], rotations: [] }; report.profiles.push(result);
      result.zooms.push(await zoom(page));
      assert.match((await geometry(page)).label, /1\.5×/);
      const first = await geometry(page);
      if (first.size.width > first.viewport.width + 15) {
        await touchSwipe(page, { dx: 60 }); await page.waitForTimeout(150);
        const panned = await geometry(page);
        assert.ok(Math.abs(panned.scroll.x - first.scroll.x) > 8, 'A real horizontal drag pans the magnified page, not a page turn');
        result.horizontalPan = true;
      }
      const beforeVertical = await geometry(page);
      if (beforeVertical.size.height > beforeVertical.viewport.height + 30) {
        await touchSwipe(page, { dx: 0, dy: -90 }); await page.waitForTimeout(150);
        assert.ok(Math.abs((await geometry(page)).scroll.y - beforeVertical.scroll.y) > 8, 'Real vertical panning remains responsive');
        result.verticalPan = true;
      }
      await expectPage(page, 274); await sameInk(page);
      result.zooms.push(await zoom(page)); assert.match((await geometry(page)).label, /2×/);
      await sameInk(page);
      await page.screenshot({ path: path.join(output, `${name}-2x.png`) });
      // A new selection/reading marker must not reset either panned scroll offset.
      const word = await visibleWord(page); assert.ok(word);
      const beforeSelection = await geometry(page);
      await page.touchscreen.tap((word.x + word.right) / 2, (word.y + word.bottom) / 2);
      await page.getByTestId('indopak-ayah-popover').waitFor();
      await page.getByTestId('indopak-ayah-mark').tap(); await page.keyboard.press('Escape');
      const marked = await read(page);
      assert.deepEqual(marked.readingPoint, { page: 274, verse: word.verse, wordId: word.id });
      const afterSelection = await geometry(page);
      for (const axis of ['x', 'y']) assert.ok(Math.abs(beforeSelection.scroll[axis] - afterSelection.scroll[axis]) < 1.1, 'Selection/marking never snaps the panned page to an edge');
      await sameInk(page); result.markerAtZoom = true;
      result.zooms.push(await zoom(page)); assert.match((await geometry(page)).label, /\s1×/);
      await sameInk(page);
      // Both keyboard activation paths operate the same saved presets.
      result.zooms.push(await zoom(page, async button => { await button.focus(); await page.keyboard.press('Enter'); }));
      assert.match((await geometry(page)).label, /1\.5×/);
      result.zooms.push(await zoom(page, async button => { await button.focus(); await page.keyboard.press('Space'); }));
      assert.match((await geometry(page)).label, /2×/);
      await sameInk(page);
      for (const target of [{ width: 844, height: 390 }, { width, height }]) {
        const before = await geometry(page);
        await page.setViewportSize(target); await page.waitForTimeout(150);
        result.rotations.push(checkAnchor(before, await geometry(page), 'Viewport resize'));
        await sameInk(page);
      }
      // No artificial delay between actual presses; the latest requested zoom wins and persists.
      for (let i = 0; i < 7; i++) await page.getByTestId('indopak-zoom').click();
      await page.waitForFunction(k => JSON.parse(localStorage.getItem(k) || '{}').zoom === 1, key);
      assert.match((await geometry(page)).label, /\s1×/); await sameInk(page); result.rapidPresses = 7;
      const saved = await read(page);
      assert.equal(saved.page, 274); assert.deepEqual(saved.savedPages, [274]); assert.deepEqual(saved.readingPoint, marked.readingPoint);
      const after = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys);
      assert.deepEqual(after, old, 'Zoom does not alter any original Reader data');
      result.savedStatePreserved = true;
      if (name === 'phone') {
        // Exact resume is stronger than the default resize anchor and survives late content-size callbacks.
        await zoom(page); await gotoPage(page, 400);
        const reset = await geometry(page);
        assert.ok(Math.abs(reset.scroll.x - Math.max(0, reset.size.width - reset.viewport.width)) < 1.1);
        assert.equal(reset.scroll.y, 0, 'A different printed page still starts at the top/right');
        await page.getByTestId('indopak-page-select').click();
        await page.getByTestId('indopak-navigator').getByRole('button', { name: 'Bookmarks', exact: true }).click();
        await page.getByTestId('indopak-resume').click(); await expectPage(page, 274); await page.waitForTimeout(100);
        const restored = await box(page.getByTestId(`indopak-word-${word.id}`)), stage = await box(page.getByTestId('indopak-page-viewport'));
        assert.ok(restored.x < stage.right && restored.right > stage.x && restored.y >= stage.y && restored.bottom <= stage.bottom);
        const position = await geometry(page); await page.waitForTimeout(120);
        assert.deepEqual((await geometry(page)).scroll, position.scroll, 'No delayed resize callback overrides the exact-word reveal');
        result.exactResumeOverridesZoomAnchor = true;
      }
      await own.context.close();
    }
    for (const errors of report.errors) for (const [kind, values] of Object.entries(errors)) assert.deepEqual(values, [], `${kind} errors`);
    console.log(JSON.stringify({ profiles: report.profiles.map(p => ({ name: p.name, zooms: p.zooms.length, rotations: p.rotations.length, horizontalPan: p.horizontalPan || false,
      verticalPan: p.verticalPan || false, markerAtZoom: p.markerAtZoom, rapidPresses: p.rapidPresses, savedStatePreserved: p.savedStatePreserved })), errorFreeContexts: report.errors.length }, null, 2));
  } catch (error) {
    report.failure = error.stack || String(error);
    if (active && !active.isClosed()) await active.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    throw error;
  } finally {
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
