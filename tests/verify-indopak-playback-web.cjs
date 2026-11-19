/** Production Expo WEB with real bundled pages and actual audio requests/playback.
 * No fake ended events, source responses, callback calls or synthetic audio state.
 * Some checks seek a real media element near its real end to keep QA bounded.
 * INDOPAK_URL=http://127.0.0.1:8106 node tests/verify-indopak-playback-web.cjs
 * Browser evidence is not installed Android/iOS device QA. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { makePage, box, pause, gotoPage, expectPage, openDirectory } = require('./verify-indopak-web.cjs');
const load = createLoader();
const model = load('src/services/indopakMushaf.ts');
const { indopakAyahSegments } = load('src/services/indopakSelection.ts');
const output = process.env.INDOPAK_PLAYBACK_ARTIFACTS_DIR || '/tmp/islamic-r99-playback-web';
const stateKey = '@deen/quran/indopak-taj-16/state/v1';
const oldKeys = ['@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1'];
const read = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), stateKey);
const suffix = verse => {
  const [chapter, ayah] = verse.split(':').map(Number);
  const number = model.indopakMeta().chapters.slice(0, chapter - 1).reduce((total, item) => total + item.verses, ayah);
  return `/ar.alafasy/${number}.mp3`;
};
async function chooseVerse(page, verse) {
  await openDirectory(page,'verse');
  await page.getByTestId('indopak-navigator').locator('input').fill(verse);
  await page.getByTestId(`indopak-jump-verse-${verse}`).click();
  await page.getByTestId('indopak-ayah-popover').waitFor(); await pause(page);
}
async function reciting(page, verse, number) {
  await page.waitForFunction(verse => !!document.querySelector(`[data-testid^="indopak-reciting-${verse}-"]`), verse);
  await expectPage(page, number); await pause(page);
  const expected = indopakAyahSegments(model.placeIndopakPage(model.indopakPage(number))).filter(s => s.verse === verse).length;
  assert.ok(expected > 0); assert.equal(await page.locator(`[data-testid^="indopak-reciting-${verse}-"]`).count(), expected,
    'Highlight every printed fragment of the actual current ayah, not only its first word');
  const active = await page.locator('[data-testid^="indopak-reciting-"]').evaluateAll(items => [...new Set(items.map(e => e.getAttribute('data-testid').split('-')[2]))]);
  assert.deepEqual(active, [verse], 'Only one current-recitation key, independent of selection/reading mark');
  return expected;
}
async function media(page, verse, ending = suffix(verse)) {
  await page.waitForFunction(ending => window.__indopakMedia.some(a => (a.currentSrc || a.src).endsWith(ending)
    && !a.paused && a.currentTime > .05 && Number.isFinite(a.duration) && a.duration > .1), ending, { timeout: 45000 });
  return page.evaluate(ending => {
    const a = window.__indopakMedia.find(a => (a.currentSrc || a.src).endsWith(ending) && !a.paused && a.currentTime > .05 && Number.isFinite(a.duration) && a.duration > .1);
    return { uri: a.currentSrc || a.src, position: a.currentTime, duration: a.duration, paused: a.paused };
  }, ending);
}
async function start(page, verse, number) {
  await chooseVerse(page, verse); await page.getByTestId('indopak-ayah-play').tap();
  await page.getByTestId('indopak-ayah-popover').waitFor({ state: 'detached' });
  await reciting(page, verse, number); return media(page, verse);
}
const stop = page => page.getByRole('button', { name: 'Pause recitation', exact: true }).click();
const resume = page => page.getByRole('button', { name: 'Play recitation', exact: true }).click();
async function finishRealTrack(page, verse, ending = suffix(verse)) {
  const playing = await media(page, verse, ending);
  await page.evaluate(ending => {
    const a = window.__indopakMedia.find(a => (a.currentSrc || a.src).endsWith(ending) && !a.paused && Number.isFinite(a.duration) && a.duration > .1);
    a.currentTime = Math.max(0, a.duration - .45);
  }, ending);
  return { ...playing, realNearEndSeek: true };
}
const openPlayer = page => page.getByTestId('mini-player').getByRole('button').first().click();
const back = page => page.getByTestId('screen-header').last().getByRole('button').first().click();
async function visibleAnchor(page, verse) {
  const word = page.getByTestId('indopak-page-svg').locator(`rect[aria-label$=" ${verse}"]`).first();
  const bounds = await box(word), viewport = await box(page.getByTestId('indopak-page-viewport'));
  assert.ok(bounds.right > viewport.x && bounds.x < viewport.right && bounds.bottom > viewport.y && bounds.y < viewport.bottom,
    `Current recitation anchor is visible: ${JSON.stringify({ verse, bounds, viewport })}`);
  return { bounds, viewport };
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const report = { method: 'Real production Expo WEB, original-font pages and actual streamed recitation. First advance runs naturally; later bounded checks use real near-end media seeks, not fake completion events. Native transport-contract tests are separate, not device QA.', checks: {}, media: [], playedUris: [], expectedMediaCancellations: [], errors: [] };
  let active;
  try {
    const own = await makePage(browser, 'en', false, 'no-preference'), { page } = own;
    active = page; report.errors.push(own.errors);
    const old = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys);
    await gotoPage(page, 478); await page.waitForTimeout(450);
    await chooseVerse(page, '55:5'); await page.getByTestId('indopak-ayah-mark').tap();
    await page.waitForFunction(k => !!JSON.parse(localStorage.getItem(k) || '{}').readingPoint, stateKey);
    const point = (await read(page)).readingPoint;
    assert.equal(point.verse, '55:5');
    await page.getByTestId('indopak-ayah-play').tap(); await reciting(page, '55:5', 478);
    report.media.push(await media(page, '55:5'));
    await page.getByTestId('indopak-ayah-popover').waitFor({ state: 'detached' });
    const beforeFocus = await media(page, '55:5'), playsBeforeFocus = await page.evaluate(() => window.__indopakPlays.length);
    await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-unlock').waitFor(); await pause(page);
    assert.equal(await page.getByTestId('mini-player').count(), 0);
    const safeFocus = await box(page.getByTestId('system-safe-content').first()), focusedViewport = await box(page.getByTestId('indopak-page-viewport'));
    for (const edge of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(safeFocus[edge] - focusedViewport[edge]) < 1.1, 'Hiding a playing mini-player also reclaims its reserved space');
    await page.waitForTimeout(300); const duringFocus = await media(page, '55:5'); report.media.push(duringFocus);
    assert.ok(duringFocus.position > beforeFocus.position + .15, 'Audio progresses continuously while its UI is hidden');
    assert.equal(await page.evaluate(() => window.__indopakPlays.length), playsBeforeFocus, 'Focus does not restart playback');
    report.checks.focusKeepsAudioPlayingWithoutRestart = { beforeFocus, duringFocus };
    // The whole first ayah plays, in Focus; there is no seek or fabricated status here.
    await reciting(page, '55:6', 478); report.media.push(await media(page, '55:6'));
    assert.equal(await page.getByTestId('mini-player').count(), 0, 'Natural queue advancement does not reveal hidden chrome');
    await page.getByTestId('indopak-unlock').click(); await page.getByTestId('mini-player').waitFor(); await stop(page);
    assert.equal(await page.locator('[data-testid^="indopak-reciting-55:5-"]').count(), 0);
    assert.ok(await page.locator('[data-testid^="indopak-highlight-55:5-"]').count() > 0, 'The separate explicit marker stays visible');
    assert.deepEqual((await read(page)).readingPoint, point); report.checks.naturalNextAyah = true;
    await page.screenshot({ path: path.join(output, 'current-ayah-after-natural-advance.png') });
    const plays = await page.evaluate(() => window.__indopakPlays.length);
    await page.waitForTimeout(700); await reciting(page, '55:6', 478);
    assert.equal(await page.evaluate(() => window.__indopakPlays.length), plays);
    await resume(page); await media(page, '55:6'); await stop(page); await reciting(page, '55:6', 478);
    report.checks.pauseResume = true;
    await chooseVerse(page, '55:7'); assert.ok((await page.getByTestId('indopak-ayah-popover').getAttribute('aria-label')).endsWith('55:7'));
    await reciting(page, '55:6', 478); await page.keyboard.press('Escape'); report.checks.selectionIsSeparate = true;

    await openPlayer(page);
    const repeat = page.locator('[aria-label^="Repeat mode:"]');
    assert.ok((await repeat.getAttribute('aria-label')).endsWith('Repeat all')); await repeat.click();
    assert.ok((await repeat.getAttribute('aria-label')).endsWith('Repeat one')); await back(page);
    await resume(page); await media(page, '55:6');
    const beforeRepeat = await page.evaluate(() => window.__indopakPlays.length);
    report.media.push(await finishRealTrack(page, '55:6'));
    await page.waitForFunction(count => window.__indopakPlays.length > count, beforeRepeat);
    await media(page, '55:6'); await stop(page); await reciting(page, '55:6', 478);
    assert.equal(await page.locator('[data-testid^="indopak-reciting-55:7-"]').count(), 0); report.checks.repeatOne = true;
    await openPlayer(page); await page.locator('[aria-label^="Repeat mode:"]').click(); await back(page);

    await gotoPage(page, 2); report.media.push(await start(page, '2:4', 2));
    await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-unlock').waitFor(); await pause(page);
    const client = await own.context.newCDPSession(page), stage = await box(page.getByTestId('indopak-page-viewport'));
    try {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: stage.x + 3, y: stage.y + 10, id: 1 }] });
      report.media.push(await finishRealTrack(page, '2:4')); await media(page, '2:5');
      assert.equal((await read(page)).page, 2, 'Do not move the printed page beneath an active touch');
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally { await client.detach(); }
    report.checks.activeGestureDefersPageFollow = true;
    await reciting(page, '2:5', 3); report.media.push(await media(page, '2:5'));
    assert.equal(await page.getByTestId('mini-player').count(), 0); report.checks.focusCrossPageFollow = true;
    await page.getByTestId('indopak-unlock').click(); await page.getByTestId('mini-player').waitFor(); await stop(page);
    assert.ok((await page.getByTestId('mini-player').innerText()).includes('Verse 5'), 'Restored mini-player metadata advances with the same queue track');
    assert.deepEqual((await read(page)).readingPoint, point); report.checks.crossPageFollow = true;
    await page.screenshot({ path: path.join(output, 'next-ayah-next-printed-page.png') });

    await gotoPage(page, 274); await page.waitForTimeout(450);
    await resume(page); report.media.push(await finishRealTrack(page, '2:5'));
    await media(page, '2:6'); await stop(page); await expectPage(page, 274);
    assert.equal(await page.locator('[data-testid^="indopak-reciting-"]').count(), 0);
    report.checks.manualBrowseDoesNotSnapBack = true;

    await page.setViewportSize({ width: 844, height: 430 }); await pause(page);
    report.media.push(await start(page, '18:109', 274));
    report.media.push(await finishRealTrack(page, '18:109'));
    await reciting(page, '18:110', 274); await media(page, '18:110'); await stop(page);
    report.checks.landscapeReveal = await visibleAnchor(page, '18:110');
    await page.screenshot({ path: path.join(output, 'landscape-reciting-line.png') });
    await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-unlock').waitFor(); await pause(page);
    await page.getByTestId('indopak-page-svg').locator('rect[aria-label$=" 18:110"]').first().tap();
    await page.getByTestId('indopak-ayah-play').tap(); await reciting(page, '18:110', 274); report.media.push(await media(page, '18:110'));
    assert.equal(await page.getByTestId('mini-player').count(), 0, 'Ayah actions can start audio without leaving Focus');
    report.checks.focusLandscapePlayback = await visibleAnchor(page, '18:110');
    await page.screenshot({ path: path.join(output, 'focus-landscape-reciting-line.png') });
    await page.getByTestId('indopak-unlock').click(); await page.getByTestId('mini-player').waitFor(); await stop(page);
    assert.deepEqual((await read(page)).readingPoint, point);
    await page.setViewportSize({ width: 390, height: 844 });

    await gotoPage(page, 5); report.media.push(await start(page, '2:25', 5)); await stop(page);
    await expectPage(page, 5); assert.ok(model.indopakPageForVerse('2:25') < 5);
    await reciting(page, '2:25', 5); report.checks.splitVerseStaysOnLaterPage = true;

    await gotoPage(page, 2); report.media.push(await start(page, '2:4', 2)); await openPlayer(page);
    await page.getByTestId('floating-navigation-bar').waitFor();
    report.media.push(await finishRealTrack(page, '2:4')); await media(page, '2:5'); await stop(page);
    assert.equal((await read(page)).page, 2, 'A blurred 16-line screen never turns/persists a page behind another screen');
    await back(page); await reciting(page, '2:5', 3); report.checks.focusGatedFollow = true;
    assert.deepEqual((await read(page)).readingPoint, point); assert.deepEqual((await read(page)).savedPages, []);
    assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys), old);
    report.checks.readingMarkBookmarksAndOriginalReaderUntouched = true;
    await page.getByRole('button', { name: 'Close the player', exact: true }).click();
    await page.getByTestId('mini-player').waitFor({ state: 'detached' });
    assert.equal(await page.locator('[data-testid^="indopak-reciting-"]').count(), 0); report.checks.closeClearsOnlyAudioHighlight = true;
    report.playedUris.push(...await page.evaluate(() => window.__indopakPlays));
    await own.context.close();

    const rtl = await makePage(browser, 'ur', true, 'reduce'); active = rtl.page; report.errors.push(rtl.errors);
    await gotoPage(rtl.page, 548); report.media.push(await start(rtl.page, '113:1', 548));
    report.media.push(await finishRealTrack(rtl.page, '113:1')); await reciting(rtl.page, '113:2', 548);
    await media(rtl.page, '113:2'); await stop(rtl.page);
    assert.equal(await rtl.page.getByTestId('indopak-ayah-popover').count(), 0);
    report.checks.urduDarkFollow = true;
    await rtl.page.screenshot({ path: path.join(output, 'urdu-dark-current-recitation.png') });
    report.playedUris.push(...await rtl.page.evaluate(() => window.__indopakPlays));
    await rtl.context.close();

    const translated = await makePage(browser, 'en', false, 'reduce', { translationAudioEnabled: true, sequential: true, translationEdition: 'en.walk', repeat: 'none' });
    active = translated.page; report.errors.push(translated.errors);
    await gotoPage(translated.page, 1); report.media.push(await start(translated.page, '1:1', 1));
    report.media.push(await finishRealTrack(translated.page, '1:1'));
    const spokenSuffix = '/192/en.walk/1.mp3';
    report.media.push(await media(translated.page, '1:1', spokenSuffix)); await reciting(translated.page, '1:1', 1);
    assert.ok((await translated.page.getByTestId('mini-player').innerText()).includes('Translation 1'));
    assert.equal(await translated.page.locator('[data-testid^="indopak-reciting-1:2-"]').count(), 0);
    report.media.push(await finishRealTrack(translated.page, '1:1', spokenSuffix));
    await reciting(translated.page, '1:2', 1); report.media.push(await media(translated.page, '1:2')); await stop(translated.page);
    report.checks.realSequentialTranslationStaysOnSameAyah = true;
    report.playedUris.push(...await translated.page.evaluate(() => window.__indopakPlays));
    await translated.context.close();
    // Source changes/clear cancel old HTTP media range reads intentionally. Keep
    // them visible in the report; do not hide any other request or HTTP failure.
    for (const errors of report.errors) errors.requests = errors.requests.filter(message => {
      const uri = message.replace(/ net::ERR_ABORTED$/, '');
      if (uri !== message && report.playedUris.includes(uri) && /^https:\/\/cdn\.islamic\.network\/quran\/audio\//.test(uri)) {
        report.expectedMediaCancellations.push(message); return false;
      }
      return true;
    });
    for (const errors of report.errors) for (const [kind, values] of Object.entries(errors)) assert.deepEqual(values, [], `${kind} errors`);
    console.log(JSON.stringify({ checks: report.checks, realMediaObservations: report.media.length, errorFreeContexts: report.errors.length }, null, 2));
  } catch (error) {
    report.failure = error.stack || String(error);
    if (active && !active.isClosed()) await active.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    throw error;
  } finally { fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
