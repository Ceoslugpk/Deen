/** Production Expo WEB + actual Chromium multitouch/trackpad input and bundled
 * original-font paths. This is not installed Android/iOS gesture/device QA.
 * INDOPAK_URL=http://127.0.0.1:8112 node tests/verify-indopak-zoom-web.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { makePage, box, pause, expectPage, touchSwipe, gotoPage, openDirectory, insets } = require('./verify-indopak-web.cjs');
const output = process.env.INDOPAK_ZOOM_ARTIFACTS_DIR || '/tmp/islamic-r104-zoom';
const key = '@deen/quran/indopak-taj-16/state/v1';
const oldKeys = ['@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1'];
const legacy = { version: 1, edition: 'indopak-taj-16', page: 274, zoom: 2, savedPages: [1, 274], readingPoint: { page: 1, verse: '1:1', wordId: 1 } };
const raw = page => page.evaluate(k => localStorage.getItem(k), key);
const enter = async page => { await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-unlock').waitFor(); await pause(page); };
const unlock = async page => { await page.getByTestId('indopak-unlock').click(); await page.getByTestId('indopak-top-controls').waitFor(); await pause(page); };
const near = (a, b, tolerance = 1.2) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b} ±${tolerance}`);
async function metrics(page) {
  return page.evaluate(() => {
    const find = id => document.querySelector(`[data-testid="${id}"]`);
    const rect = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
    const svg = find('indopak-page-svg'), stage = find('indopak-page-viewport');
    return { paper: rect(svg), viewport: rect(stage), offset: { x: find('indopak-horizontal-scroll').scrollLeft, y: find('indopak-vertical-scroll').scrollTop },
      browserScale: visualViewport.scale, touchAction: getComputedStyle(stage).touchAction,
      lines: svg.querySelectorAll('[data-testid^="indopak-line-"]').length, paths: svg.querySelectorAll('path').length };
  });
}
async function pinch(page, { from = 70, to = 168, centre, cancel = false, splitEnd = false, beforeSecond = 0, afterSecond = 0, third = false } = {}) {
  const v = await box(page.getByTestId('indopak-page-viewport'));
  const c = centre || { x: v.x + v.width / 2, y: v.y + v.height / 2 };
  const client = await page.context().newCDPSession(page);
  const points = d => [{ x: c.x - d / 2, y: c.y, id: 1, radiusX: 3, radiusY: 3 }, { x: c.x + d / 2, y: c.y, id: 2, radiusX: 3, radiusY: 3 }];
  let atThird = null;
  try {
    if (beforeSecond) { await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [points(from)[0]] }); await page.waitForTimeout(beforeSecond); }
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(from) });
    if (afterSecond) await page.waitForTimeout(afterSecond);
    for (let i = 1; i <= 12; i++) {
      const d = from + (to - from) * i / 12;
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(d) });
      await page.waitForTimeout(22);
      if (third && i === 4) {
        atThird = await metrics(page);
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [...points(d), { x: c.x, y: c.y + 40, id: 3 }] });
        await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: points(d) });
      }
    }
    if (splitEnd) {
      const remaining = points(to)[0];
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [remaining] });
      for (let i = 1; i <= 8; i++) { await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...remaining, x: remaining.x + i * 12 }] }); await page.waitForTimeout(15); }
    }
    await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(400); await pause(page);
    return { ...(await metrics(page)), atThird };
  } finally { await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] }).catch(() => {}); await client.detach(); }
}
async function pan(page, dx, dy) {
  const v = await box(page.getByTestId('indopak-page-viewport')), client = await page.context().newCDPSession(page);
  const x = v.x + (dx > 0 ? .3 : .7) * v.width, y = v.y + (dy > 0 ? .3 : .7) * v.height;
  try {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    for (let i = 1; i <= 12; i++) { await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 12, y: y + dy * i / 12, id: 1 }] }); await page.waitForTimeout(18); }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pause(page);
  } finally { await client.detach(); }
}
async function visibleWord(page, reserveRight = 0) {
  const v = await box(page.getByTestId('indopak-page-viewport'));
  const words = await page.getByTestId('indopak-page-svg').locator('rect[data-testid^="indopak-word-"]').evaluateAll((nodes, { v, reserveRight }) => nodes.map(e => {
    const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-testid'), label: e.getAttribute('aria-label'), x: r.x, y: r.y, right: r.right, bottom: r.bottom, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  }).filter(r => r.x >= v.x + 4 && r.right <= v.right - 4 - reserveRight && r.y >= v.y + 70 && r.bottom <= v.bottom - 4), { v, reserveRight });
  assert.ok(words.length, 'A complete printed word can be physically touched'); return words[Math.floor(words.length / 2)];
}
async function sameInk(page) {
  assert.equal(await page.evaluate(() => window.__zoomInk.every(({ node, d, transform }) => node.isConnected && node.getAttribute('d') === d && node.getAttribute('transform') === transform)), true,
    'Only SVG viewport dimensions change; the same original-font paths/shape transforms survive');
}
async function fixedUnlock(page, before) {
  const current = await box(page.getByTestId('indopak-unlock'));
  for (const edge of ['x', 'y', 'width', 'height']) near(current[edge], before[edge], .1);
  assert.equal(await page.getByTestId('indopak-unlock').evaluate(e => { const r = e.getBoundingClientRect(); return e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); }), true);
  for (const id of ['indopak-top-controls', 'screen-header', 'floating-navigation-bar', 'mini-player', 'indopak-zoom']) assert.equal(await page.getByTestId(id).count(), 0);
}
async function currentMedia(page, suffix) {
  await page.waitForFunction(suffix => window.__indopakMedia.some(a => !a.paused && a.currentTime > .1 && Number.isFinite(a.duration) && (!suffix || (a.currentSrc || a.src).endsWith(suffix))), suffix, { timeout: 45000 });
  return page.evaluate(suffix => {
    const a = window.__indopakMedia.find(a => !a.paused && a.currentTime > .1 && Number.isFinite(a.duration) && (!suffix || (a.currentSrc || a.src).endsWith(suffix)));
    return { source: a.currentSrc || a.src, time: a.currentTime, duration: a.duration, paused: a.paused, playCalls: window.__indopakPlays.length };
  }, suffix);
}
async function playVerse(page, verse) {
  await openDirectory(page, 'verse'); await page.getByTestId('indopak-navigator').locator('input').fill(verse);
  await page.getByTestId(`indopak-jump-verse-${verse}`).click(); await page.getByTestId('indopak-ayah-play').tap();
  await page.locator(`[data-testid^="indopak-reciting-${verse}-"]`).first().waitFor(); return currentMedia(page);
}

module.exports = { pinch, pan, metrics };
if (require.main === module) (async () => {
  fs.mkdirSync(output, { recursive: true }); const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const report = { method: 'Production WEB with real CDP multitouch, actual ctrl+wheel input and original bundled pages. Browser insets are fixtures, not native QA. Audio uses real media; one cross-page test seeks a real track near its end.', checks: {}, profiles: [], media: [], errors: [] };
  let active;
  try {
    const own = await makePage(browser, 'en', false, 'reduce', {}, legacy), { page } = own; active = page; report.errors.push(own.errors);
    const old = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys);
    const normal = await metrics(page); await pinch(page); const afterNormal = await metrics(page);
    near(afterNormal.paper.width, normal.paper.width, .1); near(afterNormal.paper.height, normal.paper.height, .1);
    assert.equal(afterNormal.touchAction, 'pan-y'); assert.equal(await raw(page), JSON.stringify(legacy));
    await page.evaluate(() => { window.__zoomInk = [...document.querySelectorAll('[data-testid^="indopak-ink-"]')].map(node => ({ node, d: node.getAttribute('d'), transform: node.getAttribute('transform') })); });
    await enter(page); const fit = await metrics(page), control = await box(page.getByTestId('indopak-unlock'));
    const spread = await pinch(page); near(spread.paper.width / fit.paper.width, 2.4, .002);
    near(spread.offset.x, Math.max(0, (spread.paper.width - spread.viewport.width) / 2));
    near(spread.offset.y, Math.max(0, (spread.paper.height - spread.viewport.height) / 2));
    assert.equal(spread.browserScale, 1); assert.equal(spread.touchAction, 'none'); assert.equal(spread.lines, fit.lines); assert.equal(spread.paths, fit.paths);
    await sameInk(page); await fixedUnlock(page, control); assert.equal(await raw(page), JSON.stringify(legacy));
    const beforePan = await metrics(page); await pan(page, -65, -100); const panned = await metrics(page);
    assert.ok(panned.offset.x > beforePan.offset.x + 30 && panned.offset.y > beforePan.offset.y + 60, 'Magnified horizontal/vertical drag pans paper');
    await expectPage(page, 274); assert.equal(await page.getByTestId('indopak-ayah-popover').count(), 0);
    const max = await pinch(page, { from: 35, to: 210 }); near(max.paper.width / fit.paper.width, 3, .002);
    const min = await pinch(page, { from: 210, to: 25 }); near(min.paper.width, fit.paper.width, .1); assert.deepEqual(min.offset, { x: 0, y: 0 });
    await touchSwipe(page, { dx: 150 }); await expectPage(page, 275); await touchSwipe(page, { dx: -150 }); await expectPage(page, 274);
    assert.equal(JSON.parse(await raw(page)).zoom, 2); report.checks.normalUnchangedFocalAnchorBoundedZoomAndPan = { normal, fit, spread, panned, max, min };
    // Turning to a genuinely different printed page intentionally mounts its
    // own paths. Restart the identity snapshot after returning to page 274.
    await page.evaluate(() => { window.__zoomInk = [...document.querySelectorAll('[data-testid^="indopak-ink-"]')].map(node => ({ node, d: node.getAttribute('d'), transform: node.getAttribute('transform') })); });
    // A second finger arrives before the existing 500ms word hold, then stays
    // beyond it. No reading mark/popover may leak from that interrupted hold.
    const beforeHold = await raw(page), w = await visibleWord(page, 80);
    await pinch(page, { from: 50, to: 100, centre: { x: w.cx + 25, y: w.cy }, beforeSecond: 200, afterSecond: 650 });
    assert.equal(await raw(page), beforeHold); assert.equal(await page.getByTestId('indopak-ayah-popover').count(), 0);
    await expectPage(page, 274); await unlock(page); await enter(page);
    await pinch(page, { from: 70, to: 140, splitEnd: true }); await expectPage(page, 274); assert.equal(await raw(page), beforeHold);
    await unlock(page); await enter(page);
    const cancelled = await pinch(page, { cancel: true }); await expectPage(page, 274); assert.equal(await raw(page), beforeHold);
    near(cancelled.paper.height / cancelled.paper.width, 1.64, .001);
    await unlock(page); await enter(page);
    const third = await pinch(page, { third: true }); await expectPage(page, 274); assert.equal(await raw(page), beforeHold);
    near(third.paper.width, third.atThird.paper.width, .1); assert.equal(await page.getByTestId('indopak-ayah-popover').count(), 0);
    // Recover after cancellation/third finger: a fresh gesture works normally.
    await unlock(page); await enter(page); await pinch(page, { from: 70, to: 140 });
    const word = await visibleWord(page); await page.getByTestId(word.id).tap(); await page.getByTestId('indopak-ayah-popover').waitFor();
    const popup = await box(page.getByTestId('indopak-ayah-popover')), unlockRect = await box(page.getByTestId('indopak-unlock'));
    assert.ok(popup.right <= unlockRect.x - 5 || popup.y >= unlockRect.bottom + 5, 'Zoomed word actions keep Unlock reachable');
    await page.keyboard.press('Escape');
    const heldWord = await visibleWord(page), client = await own.context.newCDPSession(page);
    try {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: heldWord.cx, y: heldWord.cy, id: 1 }] });
      await page.waitForTimeout(650); await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally { await client.detach(); }
    await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key)).readingPoint.wordId === id, { key, id: Number(heldWord.id.split('-').at(-1)) });
    const point = JSON.parse(await raw(page)).readingPoint;
    assert.equal(point.page, 274); assert.equal(point.verse, heldWord.label.split(' ').at(-1));
    assert.equal(point.wordId, Number(heldWord.id.split('-').at(-1))); await page.keyboard.press('Escape');
    await sameInk(page); await fixedUnlock(page, control);
    await page.screenshot({ path: path.join(output, 'focus-pinched-phone.png'), animations: 'disabled' });
    report.checks.holdCancellationSplitLiftThirdFingerAndExactWordAtZoom = { cancelled, third, point, popup };
    const saved = await raw(page);
    await unlock(page); near((await metrics(page)).paper.width, normal.paper.width, .1);
    for (let i = 0; i < 3; i++) { await enter(page); near((await metrics(page)).paper.width, fit.paper.width, .1); await pinch(page, { from: 70, to: 140 }); await unlock(page); }
    await enter(page); await pinch(page);
    await page.setViewportSize({ width: 844, height: 390 }); await pause(page);
    const rotated = await metrics(page); assert.ok(rotated.paper.width <= rotated.viewport.width && rotated.paper.height <= rotated.viewport.height);
    assert.deepEqual(rotated.offset, { x: 0, y: 0 }); await sameInk(page); await page.keyboard.press('Escape'); await page.getByTestId('indopak-top-controls').waitFor();
    await page.setViewportSize({ width: 390, height: 844 }); await enter(page); await pinch(page);
    await page.goBack(); await page.getByTestId('floating-navigation-bar').waitFor();
    await page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded(); await page.getByTestId('qtile-16-line Quran').click(); await expectPage(page, 274);
    assert.equal(await page.getByTestId('indopak-unlock').count(), 0); await enter(page); near((await metrics(page)).paper.width, fit.paper.width, .1);
    await unlock(page); assert.equal(await raw(page), saved); report.checks.unlockReentryRotationEscapeAndBlurReset = true;
    // Genuine ctrl+wheel dispatch exercises the trackpad path; browser page zoom
    // must stay 1 while only the Quran viewport magnifies.
    await enter(page); const wheelStage = await box(page.getByTestId('indopak-page-viewport'));
    await page.mouse.move(wheelStage.x + wheelStage.width / 2, wheelStage.y + wheelStage.height / 2);
    await page.keyboard.down('Control'); await page.mouse.wheel(0, -69.3147); await page.keyboard.up('Control'); await page.waitForTimeout(250);
    const trackpad = await metrics(page); near(trackpad.paper.width / fit.paper.width, 2, .03); assert.equal(trackpad.browserScale, 1);
    await page.mouse.wheel(30, 70); await page.waitForTimeout(250); const wheelPan = await metrics(page); assert.ok(wheelPan.offset.y > trackpad.offset.y + 30);
    await fixedUnlock(page, control); await unlock(page); assert.equal(await raw(page), saved); report.checks.trackpadPinch = { trackpad, wheelPan };
    assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys), old);
    report.checks.existingReaderSettingsAndLegacyZoomUntouched = true; await own.context.close();

    for (const [name, width, height, language, dark, safe] of [
      ['compact',240,640,'en',false,{}],['cover-ur-dark',280,720,'ur',true,{top:24,bottom:48}],['ar-dark-keys',390,844,'ar',true,{top:24,bottom:48}],
      ['landscape-side-keys',844,390,'en',false,{top:24,right:48}],['tablet',800,1280,'en',false,{}],['tablet-landscape',1280,800,'ar',false,{}],
    ]) {
      const h = await makePage(browser, language, dark, 'reduce', {}, legacy); active = h.page; report.errors.push(h.errors);
      await h.page.setViewportSize({ width, height }); await insets(h.page, safe); await enter(h.page);
      const before = await metrics(h.page), u = await box(h.page.getByTestId('indopak-unlock'));
      const after = await pinch(h.page, { from: 50, to: 120 }); near(after.paper.width / before.paper.width, 2.4, .003);
      assert.equal(after.browserScale, 1); await pan(h.page, -50, -60); await expectPage(h.page, 274); await fixedUnlock(h.page, u);
      assert.equal(await raw(h.page), JSON.stringify(legacy)); assert.equal(await h.page.getByTestId('indopak-ayah-popover').count(), 0);
      await h.page.screenshot({ path: path.join(output, `${name}-pinched.png`), animations: 'disabled' });
      const reset = await pinch(h.page, { from: 180, to: 25 }); near(reset.paper.width, before.paper.width, .1); assert.deepEqual(reset.offset, { x: 0, y: 0 });
      await unlock(h.page); assert.equal(await raw(h.page), JSON.stringify(legacy)); report.profiles.push({ name, language, dark, width, height, safe, before, after, reset }); await h.context.close();
    }

    const audio = await makePage(browser, 'en', false, 'reduce', {}, legacy); active = audio.page; report.errors.push(audio.errors);
    await audio.page.evaluate(() => {
      window.__zoomPlayEvents = [];
      const original = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (...args) {
        window.__zoomPlayEvents.push({ at: performance.now(), source: this.currentSrc || this.src, time: this.currentTime, paused: this.paused, stack: new Error().stack });
        return Reflect.apply(original, this, args);
      };
    });
    report.media.push(await playVerse(audio.page, '18:110')); await enter(audio.page);
    const beforeAudio = await currentMedia(audio.page); report.media.push(beforeAudio);
    await pinch(audio.page, { from: 70, to: 140 }); await pan(audio.page, -40, -60);
    const duringAudio = await currentMedia(audio.page); report.media.push(duringAudio);
    report.audioPlayEvents = await audio.page.evaluate(() => window.__zoomPlayEvents);
    assert.equal(duringAudio.source, beforeAudio.source); assert.equal(duringAudio.playCalls, beforeAudio.playCalls); assert.ok(duringAudio.time > beforeAudio.time + .3);
    await unlock(audio.page); const afterAudio = await currentMedia(audio.page); assert.equal(afterAudio.source, beforeAudio.source); assert.equal(afterAudio.playCalls, beforeAudio.playCalls);
    await audio.page.getByRole('button', { name: 'Pause recitation', exact: true }).click();
    await audio.page.waitForFunction(() => window.__indopakMedia.every(a => a.paused));
    const pausedPlays = await audio.page.evaluate(() => window.__indopakPlays.length); await enter(audio.page); await pinch(audio.page); await unlock(audio.page);
    assert.equal(await audio.page.evaluate(() => window.__indopakPlays.length), pausedPlays); assert.equal(await audio.page.evaluate(() => window.__indopakMedia.every(a => a.paused)), true);
    report.checks.playingAndPausedIntentPreserved = { beforeAudio, duringAudio, afterAudio }; report.media.push(beforeAudio, duringAudio, afterAudio);
    await gotoPage(audio.page, 2); await playVerse(audio.page, '2:4'); await enter(audio.page);
    const ac = await audio.context.newCDPSession(audio.page), av = await box(audio.page.getByTestId('indopak-page-viewport'));
    const ap = d => [{ x: av.x + av.width / 2 - d / 2, y: av.y + av.height / 2, id: 1 }, { x: av.x + av.width / 2 + d / 2, y: av.y + av.height / 2, id: 2 }];
    try {
      await ac.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: ap(70) });
      for (let i = 1; i <= 10; i++) { await ac.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: ap(70 + i * 7) }); await audio.page.waitForTimeout(22); }
      report.media.push(await currentMedia(audio.page, '/ar.alafasy/11.mp3'));
      await audio.page.evaluate(() => { const a = window.__indopakMedia.find(a => !a.paused && (a.currentSrc || a.src).endsWith('/ar.alafasy/11.mp3')); a.currentTime = a.duration - .3; });
      report.media.push(await currentMedia(audio.page, '/ar.alafasy/12.mp3')); await expectPage(audio.page, 2);
      await ac.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally { await ac.detach(); }
    await expectPage(audio.page, 3); const followed = await metrics(audio.page);
    assert.ok(followed.paper.width <= followed.viewport.width && followed.paper.height <= followed.viewport.height, 'Following a new printed page resets transient magnification to fit');
    assert.equal(await audio.page.getByTestId('mini-player').count(), 0); await unlock(audio.page); await audio.page.getByRole('button', { name: 'Pause recitation', exact: true }).click();
    report.checks.activePinchDefersCrossPageAudioFollowThenResetsToFit = followed;
    // Intentional actual-media source replacements can cancel a range request.
    report.expectedMediaCancellations = audio.errors.requests.filter(r => /ERR_ABORTED/.test(r) && /cdn\.islamic\.network|everyayah\.com/.test(r));
    audio.errors.requests = audio.errors.requests.filter(r => !report.expectedMediaCancellations.includes(r)); await audio.context.close();
    for (const errors of report.errors) for (const [kind, values] of Object.entries(errors)) assert.deepEqual(values, [], `${kind} errors`);
    console.log(JSON.stringify({ checks: Object.keys(report.checks), profiles: report.profiles.length, contexts: report.errors.length, expectedMediaCancellations: report.expectedMediaCancellations }, null, 2));
  } catch (error) { report.failure = error.stack || String(error); if (active && !active.isClosed()) await active.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {}); throw error; }
  finally { fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
