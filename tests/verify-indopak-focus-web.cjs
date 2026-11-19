/** Actual production WEB and original bundled pages. No mocked content/actions/state changes.
 * Insets are explicit browser fixtures, not Android/iOS device navigation-mode tests.
 * INDOPAK_URL=http://127.0.0.1:8108 node tests/verify-indopak-focus-web.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { makePage, box, pause, gotoPage, expectPage, touchSwipe, insets } = require('./verify-indopak-web.cjs');
const meta = require('../src/data/indopak16/meta.json');
const output = process.env.INDOPAK_FOCUS_ARTIFACTS_DIR || '/tmp/islamic-r101-focus';
const key = '@deen/quran/indopak-taj-16/state/v1';
const oldKeys = ['@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1'];
const rawState = page => page.evaluate(k => localStorage.getItem(k), key);
async function enter(page) { await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-unlock').waitFor(); await pause(page); }
async function unlock(page) { await page.getByTestId('indopak-unlock').click(); await page.getByTestId('indopak-top-controls').waitFor(); await pause(page); }
async function checkFocus(page, number) {
  await expectPage(page, number); await pause(page);
  for (const id of ['indopak-top-controls', 'indopak-zoom', 'indopak-page-select', 'indopak-tools', 'screen-header', 'mini-player', 'floating-navigation-bar']) {
    assert.equal(await page.getByTestId(id).count(), 0, `${id} is unmounted, not an invisible focus trap`);
  }
  const safe = await box(page.getByTestId('system-safe-content').first()), viewport = await box(page.getByTestId('indopak-page-viewport'));
  for (const edge of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(safe[edge] - viewport[edge]) < 1.1,
    `Focus reclaims the entire safe screen, without the old header, width cap or player reserve: ${JSON.stringify({ safe, viewport })}`);
  const control = await box(page.getByTestId('indopak-unlock')), paper = await box(page.getByTestId('indopak-page-svg'));
  assert.ok(control.width >= 44 && control.height >= 44);
  assert.ok(Math.abs(control.right - (safe.right - 8)) < 1.1 && Math.abs(control.y - (safe.y + 8)) < 1.1, 'Unlock stays at the PHYSICAL top right, including RTL');
  assert.ok(paper.x >= safe.x && paper.right <= safe.right + .1 && paper.y >= safe.y && paper.bottom <= safe.bottom + .1, 'The whole original page fits, including landscape');
  assert.ok(Math.abs(paper.height / paper.width - 1.64) < .001, 'No stretch or artificial line reflow');
  assert.equal(await page.getByTestId('indopak-page-svg').locator('[data-testid^="indopak-line-"]').count(), meta.shortPages[number] || 16);
  assert.equal(await page.getByTestId('indopak-reader').getByRole('button').count(), 1, 'Only the small unlock is visible at rest');
  const outline = await page.getByTestId('indopak-page-svg').evaluate((svg, control) => {
    const overlapping = [], outside = [];
    for (const node of svg.querySelectorAll('path')) {
      const b = node.getBBox(), matrix = node.getScreenCTM();
      const points = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
      const r = { x: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)), y: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) };
      const paper = svg.getBoundingClientRect();
      if (r.x < paper.x - .2 || r.right > paper.right + .2 || r.y < paper.y - .2 || r.bottom > paper.bottom + .2) outside.push(node.getAttribute('data-testid'));
      if (r.x < control.right - .5 && r.right > control.x + .5 && r.y < control.bottom - .5 && r.bottom > control.y + .5) overlapping.push(node.getAttribute('data-testid') || 'heading');
    }
    return { paths: svg.querySelectorAll('path').length, outside, overlapping };
  }, control);
  assert.deepEqual(outline.outside, []); assert.deepEqual(outline.overlapping, [], 'Unlock never covers scripture, even near the paper aspect ratio');
  return { safe, viewport, paper, control, outline, label: await page.getByTestId('indopak-unlock').getAttribute('aria-label') };
}
async function wordAtCentre(page) {
  const words = await page.getByTestId('indopak-page-svg').locator('rect[data-testid^="indopak-word-"]').all();
  return words[Math.floor(words.length / 2)];
}
async function sameInk(page) {
  assert.equal(await page.evaluate(() => window.__focusInk.every(({ node, d, transform }) => node.isConnected && node.getAttribute('d') === d && node.getAttribute('transform') === transform)), true,
    'Entering/exiting focus preserves the same memoized original-font path nodes');
}
(async () => {
  fs.mkdirSync(output, { recursive: true }); const browser = await chromium.launch();
  const report = { method: 'Running production WEB, real touch/keyboard/buttons and original bundled pages; simulated insets, not native-device QA', checks: {}, profiles: [], insets: [], localized: [], errors: [] };
  let active;
  try {
    const own = await makePage(browser), { page } = own; active = page; report.errors.push(own.errors);
    await gotoPage(page, 274); await page.waitForTimeout(400);
    const old = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys);
    assert.equal(await page.getByTestId('indopak-zoom').count(), 0, 'Zoom is removed in normal mode too');
    await (await wordAtCentre(page)).tap(); await page.getByTestId('indopak-ayah-mark').tap();
    await page.keyboard.press('Escape'); await page.getByTestId('indopak-save-page').click();
    const saved = await rawState(page);
    await page.evaluate(() => { window.__focusInk = [...document.querySelectorAll('[data-testid^="indopak-ink-"]')].map(node => ({ node, d: node.getAttribute('d'), transform: node.getAttribute('transform') })); });
    await enter(page); await checkFocus(page, 274); await sameInk(page); assert.equal(await rawState(page), saved);
    await (await wordAtCentre(page)).tap(); await page.getByTestId('indopak-ayah-popover').waitFor();
    await page.keyboard.press('Escape'); await page.getByTestId('indopak-ayah-popover').waitFor({ state: 'detached' });
    assert.equal(await page.getByTestId('indopak-unlock').count(), 1, 'First Escape dismisses ayah actions, not focus');
    await page.keyboard.press('Escape'); await page.getByTestId('indopak-focus').waitFor(); await sameInk(page);
    assert.equal(await page.getByTestId('indopak-focus').evaluate(e => e === document.activeElement), true, 'Keyboard focus returns to the Focus button');
    report.checks.ayahActionsAndEscape = true;
    await page.getByTestId('indopak-focus').focus(); await page.keyboard.press('Enter'); await checkFocus(page, 274);
    assert.equal(await page.getByTestId('indopak-unlock').evaluate(e => e === document.activeElement), true, 'Unlock receives keyboard focus');
    for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport); await checkFocus(page, 274); await sameInk(page);
    }
    await unlock(page); await sameInk(page); assert.equal(await rawState(page), saved);
    for (let i = 0; i < 6; i++) { await enter(page); await unlock(page); }
    await sameInk(page); assert.equal(await rawState(page), saved); report.checks.repeatedTogglesAndFocusedRotation = true;
    await page.getByTestId('indopak-focus').focus(); await page.keyboard.press('Space'); await checkFocus(page, 274);
    await touchSwipe(page, { dx: 150 }); await expectPage(page, 275); await touchSwipe(page, { dx: -150 }); await expectPage(page, 274);
    for (const options of [{ dx: 150, multi: true }, { dx: 150, multi: 'afterCapture' }, { dx: 150, cancel: true }, { dx: 25 }]) {
      await touchSwipe(page, options); await expectPage(page, 274);
    }
    const u = await box(page.getByTestId('indopak-unlock'));
    await page.mouse.move(u.x + 22, u.y + 22); await page.mouse.down(); await page.mouse.move(u.x - 100, u.y + 22, { steps: 8 }); await page.mouse.up();
    await expectPage(page, 274); assert.equal(await page.getByTestId('indopak-unlock').count(), 1, 'An unlock-button drag is not a page swipe or a button tap');
    assert.deepEqual(JSON.parse(await rawState(page)).readingPoint, JSON.parse(saved).readingPoint);
    report.checks.swipesAndCancellation = true; report.checks.keyboardEntryAndUnlock = true;
    await unlock(page);
    for (const [name, width, height] of [['compact', 240, 640], ['cover', 280, 720], ['small', 320, 568], ['phone', 390, 844],
      ['near-paper-ratio', 390, 640], ['landscape', 844, 390], ['tablet', 800, 1280], ['tablet-landscape', 1280, 800], ['desktop', 1440, 900]]) {
      await page.setViewportSize({ width, height }); await pause(page); const before = await rawState(page);
      await enter(page); report.profiles.push({ name, width, height, ...(await checkFocus(page, 274)) });
      await page.screenshot({ path: path.join(output, `${name}-focus.png`), animations: 'disabled' });
      await unlock(page); assert.equal(await rawState(page), before, 'Entering/exiting focus is not a stored reading action');
    }
    for (const [name, viewport, values] of [
      ['gestures', { width: 390, height: 844 }, { top: 24, bottom: 24 }], ['buttons', { width: 390, height: 844 }, { top: 24, bottom: 48 }],
      ['larger-keys', { width: 280, height: 720 }, { top: 30, bottom: 64 }], ['right-keys', { width: 844, height: 390 }, { top: 24, right: 48 }],
      ['left-keys', { width: 844, height: 390 }, { top: 24, left: 48 }],
    ]) {
      await page.setViewportSize(viewport); await insets(page, values); await enter(page);
      report.insets.push({ name, ...(await checkFocus(page, 274)) }); await unlock(page);
    }
    await insets(page, {});
    for (const viewport of [{ width: 240, height: 400 }, { width: 390, height: 640 }]) {
      await page.setViewportSize(viewport); await gotoPage(page, 3); await enter(page); await checkFocus(page, 3);
      // This ayah starts at the left edge, spans a full line, then finishes
      // in a short right-edge fragment. Only that last fragment exercises the corner shift.
      await page.getByTestId('indopak-page-svg').locator('rect[aria-label$=" 2:7"]').last().tap();
      await page.getByTestId('indopak-ayah-popover').waitFor(); await pause(page);
      const popup = await box(page.getByTestId('indopak-ayah-popover')), corner = await box(page.getByTestId('indopak-unlock'));
      assert.ok(popup.right <= corner.x - 5 || popup.y >= corner.bottom + 5, 'Ayah actions never collide with the top-right unlock');
      if (viewport.width === 390) assert.ok(Math.abs(popup.right - (corner.x - 6)) < 1, 'The right-anchored popup actually exercises the six-pixel corner-clearance shift');
      for (const id of ['indopak-ayah-play', 'indopak-ayah-translation', 'indopak-ayah-mark', 'indopak-unlock']) {
        assert.equal(await page.getByTestId(id).evaluate(e => { const r = e.getBoundingClientRect(); return e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); }), true, `${id} can be independently hit`);
      }
      await page.screenshot({ path: path.join(output, `${viewport.width}-focus-corner-popup.png`) });
      await unlock(page); await page.getByTestId('indopak-ayah-popover').waitFor({ state: 'detached' });
    }
    report.checks.topRowAyahActionsAndUnlockDoNotOverlap = true;
    await page.setViewportSize({ width: 390, height: 844 });
    for (const n of [1, 2, 548]) { await gotoPage(page, n); await enter(page); await checkFocus(page, n); await unlock(page); }
    await gotoPage(page, 274); await enter(page); await page.goBack();
    await page.getByTestId('floating-navigation-bar').waitFor(); await page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded(); await page.getByTestId('qtile-16-line Quran').click();
    await expectPage(page, 274); assert.equal(await page.getByTestId('indopak-unlock').count(), 0); await page.getByTestId('indopak-top-controls').waitFor();
    report.checks.leavingRestoresNormalMode = true;
    assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys), old);
    report.checks.existingReaderDataUntouched = true; await own.context.close();

    const legacy = { version: 1, edition: 'indopak-taj-16', page: 274, zoom: 2, savedPages: [1, 274], readingPoint: { page: 1, verse: '1:1', wordId: 1 } };
    const restored = await makePage(browser, 'en', false, 'reduce', {}, legacy); active = restored.page; report.errors.push(restored.errors);
    assert.equal(await rawState(restored.page), JSON.stringify(legacy), 'Loading an old 2× state performs no migration/write');
    const paper = await box(restored.page.getByTestId('indopak-page-svg')), viewport = await box(restored.page.getByTestId('indopak-page-viewport'));
    assert.ok(paper.width <= viewport.width && paper.height <= viewport.height);
    await enter(restored.page); await checkFocus(restored.page, 274); await unlock(restored.page);
    assert.equal(await rawState(restored.page), JSON.stringify(legacy));
    await touchSwipe(restored.page, { dx: 150 }); await expectPage(restored.page, 275);
    assert.equal(JSON.parse(await rawState(restored.page)).zoom, 2, 'Old stored zoom is preserved but cannot disable page swiping');
    report.checks.legacyZoomIgnoredWithoutDataDeletion = true; await restored.context.close();

    for (const language of ['en', 'ar', 'ur', 'fa', 'ps', 'fr', 'tr', 'ru', 'uz', 'kk', 'zh', 'vi', 'az', 'bs', 'bg', 'si', 'bn', 'hi', 'id', 'ms', 'ta', 'ml']) {
      const local = await makePage(browser, language, ['en', 'ur'].includes(language)); active = local.page; report.errors.push(local.errors);
      await gotoPage(local.page, 274);
      for (const width of [280, 390]) {
        await local.page.setViewportSize({ width, height: 720 }); await pause(local.page);
        const focusLabel = await local.page.getByTestId('indopak-focus').getAttribute('aria-label');
        if (language !== 'en') assert.notEqual(focusLabel, 'Focus mode');
        await enter(local.page); const result = await checkFocus(local.page, 274);
        if (language !== 'en') assert.ok(!result.label.includes('Unlock') && !result.label.includes('Focus mode'));
        report.localized.push({ language, width, focusLabel, ...result });
        if (width === 390 && ['en', 'ur', 'ar'].includes(language)) await local.page.screenshot({ path: path.join(output, `${language}-focus.png`) });
        await unlock(local.page);
      }
      await local.context.close();
    }
    for (const errors of report.errors) for (const [kind, values] of Object.entries(errors)) assert.deepEqual(values, [], `${kind} errors`);
    console.log(JSON.stringify({ checks: report.checks, profiles: report.profiles.length, insets: report.insets.length, localized: report.localized.length, errorFreeContexts: report.errors.length }, null, 2));
  } catch (error) {
    report.failure = error.stack || String(error); if (active && !active.isClosed()) await active.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {}); throw error;
  } finally { fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
