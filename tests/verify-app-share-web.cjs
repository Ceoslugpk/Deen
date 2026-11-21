/** Running production Expo WEB. Web Share bridge success/cancel/failure are
 * explicit test doubles because Chromium/Linux has no OS sharing sheet. The
 * clipboard fallback is checked against the actual browser clipboard. QR PNGs
 * are screenshots of the rendered UI, independently decoded with OpenCV.
 * INDOPAK_URL=http://127.0.0.1:8112 node tests/verify-app-share-web.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { makePage, box, pause } = require('./verify-indopak-web.cjs');
const load = createLoader(); const { tx, loadCopy } = load('src/services/arabicCopy.ts'); const { appShareText: copy } = load('src/services/appShareCopy.ts');
const { settingsDedicationText: dedication } = load('src/services/settingsDedication.ts');
const { LANGUAGES, isRtl } = load('src/services/languages.ts');
const output = process.env.APP_SHARE_ARTIFACTS_DIR || '/tmp/islamic-r105-share';
const target = 'https://play.google.com/store/apps/details?id=com.qashi.islamic';
const oldKeys = ['@deen/quran/indopak-taj-16/state/v1', '@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1', '@deen/audio-settings/v1'];
async function settings(page, language) {
  await loadCopy(language);
  await page.getByTestId('screen-header').last().getByRole('button').first().click();
  await page.getByRole('button', { name: tx(language, 'Settings'), exact: true }).click();
  await page.getByTestId('settings-share-app').scrollIntoViewIfNeeded(); await pause(page);
}
async function open(page) { await page.getByTestId('settings-share-app').click(); await page.getByTestId('app-share-qr').waitFor(); await pause(page); }
async function fullLabel(locator) {
  const clipped = await locator.evaluate(root => {
    const bounds = root.getBoundingClientRect(), walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), clipped = [];
    let node;
    while (node = walker.nextNode()) {
      if (!node.textContent.trim() || node.parentElement.closest('svg')) continue;
      const parent = node.parentElement, p = parent.getBoundingClientRect();
      if (parent.scrollWidth > parent.clientWidth + 1 || parent.scrollHeight > parent.clientHeight + 1) clipped.push({ text: node.textContent, overflow: true });
      // Chromium reports an extra end-of-line Range box for a soft-wrapped
      // space, beyond its text container even though no glyph is there. Check
      // each actual non-whitespace glyph, not that invisible line-break box.
      for (let i = 0; i < node.textContent.length; i++) {
        if (/\s|[\u200c\u200d]/u.test(node.textContent[i])) continue;
        const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + 1);
        for (const r of range.getClientRects()) if (r.width && r.height && (r.x < bounds.x - 1 || r.right > bounds.right + 1 || r.y < bounds.y - 1 || r.bottom > bounds.bottom + 1
          || r.x < p.x - 1 || r.right > p.right + 1 || r.y < p.y - 1 || r.bottom > p.bottom + 1)) clipped.push({ text: node.textContent, index: i, glyph: node.textContent[i] });
      }
    }
    return clipped;
  });
  assert.deepEqual(clipped, [], 'Every visible label glyph fits its container and reachable button, without ellipses or clipping');
}
async function noPrintedUrl(page) {
  assert.equal(await page.getByTestId('app-share-url').count(), 0, 'The printed URL is removed, not hidden with styling');
  assert.doesNotMatch(await page.getByTestId('app-share-page').innerText(), /https?:\/\/|play\.google\.com\/store|com\.qashi\.islamic/);
}
async function dedicationLayout(page, language, name) {
  const footer = page.getByTestId('settings-dedication'); await footer.scrollIntoViewIfNeeded(); await pause(page);
  assert.equal(await footer.innerText(), dedication(language), 'The complete dedication follows the actual interface language');
  assert.equal(await footer.evaluate(e => e === e.parentElement.lastElementChild), true, 'Dedication is the last Settings content, below the old Made with footer');
  const safe = await box(page.getByTestId('system-safe-content').first()), rect = await box(footer);
  assert.ok(rect.x >= safe.x && rect.right <= safe.right && rect.y >= safe.y && rect.bottom <= safe.bottom, `Full dedication is reachable: ${JSON.stringify({ language, rect, safe })}`);
  await fullLabel(footer);
  const direction = await footer.evaluate(e => getComputedStyle(e).direction);
  assert.equal(direction, isRtl(language) ? 'rtl' : 'ltr');
  await page.screenshot({ path: path.join(output, `settings-dedication-${name}.png`), animations: 'disabled' });
  return { language, name, direction, safe, rect, text: dedication(language) };
}
async function layout(page, language, name) {
  const safe = await box(page.getByTestId('system-safe-content').first()), qr = await box(page.getByTestId('app-share-qr'));
  assert.ok(qr.width >= 147 && qr.width === qr.height && qr.x >= safe.x && qr.right <= safe.right, 'QR keeps a square scan-sized target inside the safe width');
  assert.ok(Math.abs(qr.width / 49 - Math.round(qr.width / 49)) < .001, 'Integer modules avoid blurred module edges');
  assert.equal(await page.getByTestId('app-share-button').innerText(), copy(language, 'button'));
  assert.equal(await page.getByTestId('app-share-button').getAttribute('aria-label'), copy(language, 'button'));
  assert.equal(await page.getByTestId('app-share-open').getAttribute('aria-label'), copy(language, 'open'));
  const title = page.getByTestId('screen-header').last().getByText(copy(language, 'title'), { exact: true });
  await title.waitFor(); await fullLabel(title);
  assert.equal(await page.getByTestId('screen-header').last().getByRole('button').first().getAttribute('aria-label'), tx(language, 'Back'));
  assert.equal(await page.getByTestId('app-share-qr').getAttribute('aria-label'), copy(language, 'scan'));
  const explanation = page.getByTestId('app-share-page').getByText(copy(language, 'scan'), { exact: true });
  await explanation.waitFor(); await fullLabel(explanation);
  const result = { name, language, safe, qr, actions: [] };
  for (const id of ['app-share-button', 'app-share-open']) {
    const action = page.getByTestId(id); await action.scrollIntoViewIfNeeded(); const r = await box(action);
    assert.ok(r.height >= 44 && r.x >= safe.x && r.right <= safe.right && r.y >= safe.y && r.bottom <= safe.bottom, `${id} is reachable inside the safe window`);
    await fullLabel(action); result.actions.push({ id, ...r });
  }
  await noPrintedUrl(page);
  await page.getByTestId('app-share-qr').screenshot({ path: path.join(output, `qr-${name}.png`) }); return result;
}
(async () => {
  fs.mkdirSync(output, { recursive: true }); const browser = await chromium.launch();
  const report = { method: 'Actual production WEB, real navigation/layout/rendered QR and one actual browser clipboard success/denial path. Web Share returns and all-language repeated clipboard-status outcomes use explicit bridge doubles, not real OS sheets. Language persistence is a real Settings choice and same-profile reload, with one-time initial fixture storage. Outbound Play Store navigation is intercepted only in the test; no listing availability claim.', checks: {}, localized: [], dedications: [], localizedStatuses: [], errors: [], qrDecode: null };
  let active;
  try {
    const own = await makePage(browser), { page } = own; active = page; report.errors.push(own.errors);
    await own.context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const before = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys);
    await settings(page, 'en');
    report.dedications.push(await dedicationLayout(page, 'en', 'en-phone-light'));
    const order = await page.getByRole('button').evaluateAll(nodes => nodes.filter(e => ['Privacy Policy','Terms of Use','Data Safety','Share app'].includes(e.textContent.trim())).map(e => ({ text: e.textContent.trim(), y: e.getBoundingClientRect().y })));
    assert.deepEqual(order.map(e => e.text), ['Privacy Policy','Terms of Use','Data Safety','Share app']); assert.ok(order.every((e, i) => i === 0 || e.y > order[i - 1].y));
    await page.screenshot({ path: path.join(output, 'settings-share-location.png'), animations: 'disabled' }); await open(page);
    report.checks.placementAndDefaultLayout = await layout(page, 'en', 'en-phone');
    await page.getByTestId('app-share-page').evaluate(e => { e.scrollTop = 0; }); await pause(page);
    await page.screenshot({ path: path.join(output, 'share-app-en.png'), animations: 'disabled' });
    // Exercise the actual RN Web -> navigator.share argument mapping. Keep the
    // promise unresolved briefly to verify rapid repeat taps cannot open twice.
    await page.evaluate(() => {
      window.__sharePayloads = [];
      Object.defineProperty(navigator, 'share', { configurable: true, value: async payload => { window.__sharePayloads.push(payload); return new Promise(resolve => { window.__shareResolve = resolve; }); } });
    });
    await page.getByTestId('app-share-button').click({ clickCount: 2 });
    assert.equal(await page.evaluate(() => window.__sharePayloads.length), 1);
    const payload = await page.evaluate(() => window.__sharePayloads[0]);
    assert.equal(payload.title, 'Share app'); assert.equal(payload.text, `Islamic Companion\n${target}`); assert.ok(!payload.url, 'The link is included exactly once in the shared message');
    assert.equal(await page.getByTestId('app-share-button').getAttribute('aria-busy'), 'true');
    await page.evaluate(() => window.__shareResolve()); await page.waitForFunction(() => document.querySelector('[data-testid="app-share-button"]').getAttribute('aria-busy') !== 'true');
    assert.equal(await page.getByTestId('app-share-status').count(), 0); report.checks.shareBridgeAndRepeatedTapGuard = payload;
    await page.evaluate(async () => {
      await navigator.clipboard.writeText('share-cancel-sentinel');
      Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Cancelled', 'AbortError'); } });
    });
    await page.getByTestId('app-share-button').click(); await page.waitForTimeout(120);
    assert.equal(await page.getByTestId('app-share-status').count(), 0); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'share-cancel-sentinel');
    report.checks.cancelDoesNotCopyOrClaimSuccess = true;
    await page.evaluate(() => Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Denied', 'NotAllowedError'); } }));
    await page.getByTestId('app-share-button').click(); await page.getByTestId('app-share-status').waitFor();
    assert.equal(await page.getByTestId('app-share-status').innerText(), copy('en', 'error'));
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'share-cancel-sentinel'); report.checks.shareErrorIsHonest = true;
    await page.evaluate(() => Object.defineProperty(navigator, 'share', { configurable: true, value: undefined }));
    await page.getByTestId('app-share-button').click(); await page.waitForFunction(text => document.querySelector('[data-testid="app-share-status"]')?.textContent === text, copy('en', 'copied'));
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), `Islamic Companion\n${target}`); report.checks.realClipboardFallback = true;
    // The external navigation really opens a browser page; its HTTP response is
    // intercepted so this test is not an assertion that a store listing exists.
    await own.context.route(target, route => route.fulfill({ status: 200, contentType: 'text/plain', body: 'External navigation intercepted by QA' }));
    const [popup] = await Promise.all([own.context.waitForEvent('page'), page.getByTestId('app-share-open').click()]);
    await popup.waitForLoadState(); assert.equal(popup.url(), target); await popup.close(); report.checks.openStoreTarget = target;
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('QA denied'); } } });
      document.execCommand = () => false;
    });
    await page.getByTestId('app-share-button').click(); await page.waitForFunction(text => document.querySelector('[data-testid="app-share-status"]')?.textContent === text, copy('en', 'error'));
    report.checks.clipboardFailureIsNotReportedAsCopied = true;
    await own.context.setOffline(true);
    await page.getByTestId('screen-header').last().getByRole('button').first().click(); await page.getByTestId('settings-share-app').waitFor();
    report.dedications.push(await dedicationLayout(page, 'en', 'en-offline')); await open(page);
    await page.getByTestId('app-share-qr').screenshot({ path: path.join(output, 'qr-offline.png') }); report.checks.qrRendersOfflineWithoutQrService = true;
    assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys), before);
    await own.context.setOffline(false); await page.getByTestId('screen-header').last().getByRole('button').first().click(); await page.getByTestId('settings-share-app').waitFor();
    report.checks.backReturnsToSettingsAndReaderDataIsUntouched = true;
    // One-time test-fixture storage, not an on-every-load init script: the
    // actual Settings choice must survive a normal same-profile page reload.
    // Do not transfer application ETags into a fresh empty HTTP cache, which
    // is not the browser lifecycle this persistence check intends to model.
    const seedKeys = [...oldKeys, '@deen/onboarding/v1', '@deen/language/v1', '@deen/location/v1', 'deen-theme-v1', 'deen-theme-name-v1'];
    const localStorage = await page.evaluate(keys => keys.map(name => ({ name, value: window.localStorage.getItem(name) })).filter(row => row.value !== null), seedKeys);
    await own.context.close();
    const baseUrl = process.env.INDOPAK_URL || 'http://127.0.0.1:8106';
    const persistent = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', storageState: {
      cookies: [], origins: [{ origin: new URL(baseUrl).origin, localStorage }],
    } });
    const persistentPage = await persistent.newPage(); active = persistentPage; persistentPage.setDefaultTimeout(25000);
    const persistentErrors = { page: [], console: [], http: [], requests: [] }; report.errors.push(persistentErrors);
    persistentPage.on('pageerror', e => persistentErrors.page.push(e.message));
    persistentPage.on('console', m => { if (m.type() === 'error') persistentErrors.console.push(m.text()); });
    persistentPage.on('response', r => { if (r.status() >= 400) persistentErrors.http.push(`${r.status()} ${r.url()}`); });
    persistentPage.on('requestfailed', r => persistentErrors.requests.push(`${r.url()} ${r.failure()?.errorText}`));
    await persistentPage.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
    await persistentPage.getByRole('button', { name: 'Settings', exact: true }).click();
    const appLanguage = persistentPage.getByRole('button', { name: 'Language: English', exact: true });
    await appLanguage.scrollIntoViewIfNeeded(); await appLanguage.click();
    await persistentPage.getByRole('textbox', { name: 'Search a language', exact: true }).fill('Arabic');
    await persistentPage.getByRole('button', { name: /^العربية, Arabic,/ }).click();
    await persistentPage.waitForFunction(text => document.querySelector('[data-testid="settings-dedication"]')?.textContent === text, dedication('ar'));
    await persistentPage.waitForFunction(() => window.localStorage.getItem('@deen/language/v1') === 'ar');
    report.dedications.push(await dedicationLayout(persistentPage, 'ar', 'ar-live-switch'));
    await loadCopy('ar'); await open(persistentPage); const liveShare = await layout(persistentPage, 'ar', 'ar-live-switch');
    await persistentPage.waitForLoadState('networkidle', { timeout: 25000 });
    await persistentPage.reload({ waitUntil: 'load', timeout: 60000 });
    await persistentPage.getByRole('button', { name: tx('ar', 'Settings'), exact: true }).click();
    report.dedications.push(await dedicationLayout(persistentPage, 'ar', 'ar-restored'));
    await open(persistentPage); const restoredShare = await layout(persistentPage, 'ar', 'ar-restored');
    await persistentPage.waitForLoadState('networkidle', { timeout: 25000 });
    assert.equal(await persistentPage.evaluate(() => window.localStorage.getItem('@deen/language/v1')), 'ar');
    report.checks.liveLanguageSwitchAndPersistentLocalizedCopy = { liveShare, restoredShare }; await persistent.close();

    for (const { code: language } of LANGUAGES.filter(row => row.uiReady || row.uiPartial)) {
      const dark = ['ar','ur','fa','en'].includes(language), h = await makePage(browser, language, dark); active = h.page; report.errors.push(h.errors);
      await settings(h.page, language); assert.equal(await h.page.getByTestId('settings-share-app').getAttribute('aria-label'), copy(language, 'title'));
      for (const [width, height] of [[280,720],[390,844]]) {
        await h.page.setViewportSize({ width, height }); await pause(h.page);
        report.dedications.push(await dedicationLayout(h.page, language, `${language}-${width}`)); await open(h.page);
        report.localized.push({ dark, width, height, ...(await layout(h.page, language, `${language}-${width}`)) });
        if (width === 390 && ['ar','ur'].includes(language)) { await h.page.getByTestId('app-share-page').evaluate(e => { e.scrollTop = 0; }); await pause(h.page); await h.page.screenshot({ path: path.join(output, `share-app-${language}-dark.png`), animations: 'disabled' }); }
        // Explicit clipboard bridge doubles exercise both visible statuses in
        // every locale at both widths. The separate EN case above uses the
        // real browser clipboard, including its actual saved value.
        await h.page.evaluate(() => {
          Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
          Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__localizedShareCopy = text; } } });
        });
        await h.page.getByTestId('app-share-button').click();
        await h.page.waitForFunction(text => document.querySelector('[data-testid="app-share-status"]')?.textContent === text, copy(language, 'copied'));
        await h.page.getByTestId('app-share-status').scrollIntoViewIfNeeded(); await fullLabel(h.page.getByTestId('app-share-status'));
        assert.equal(await h.page.evaluate(() => window.__localizedShareCopy), `Islamic Companion\n${target}`);
        assert.equal(await h.page.getByTestId('app-share-status').getAttribute('aria-live'), 'polite');
        await h.page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new DOMException('Denied', 'NotAllowedError'); }; });
        await h.page.getByTestId('app-share-button').click();
        await h.page.waitForFunction(text => document.querySelector('[data-testid="app-share-status"]')?.textContent === text, copy(language, 'error'));
        await h.page.getByTestId('app-share-status').scrollIntoViewIfNeeded(); await fullLabel(h.page.getByTestId('app-share-status')); await noPrintedUrl(h.page);
        report.localizedStatuses.push({ language, width, copied: copy(language, 'copied'), error: copy(language, 'error') });
        await h.page.getByTestId('screen-header').last().getByRole('button').first().click(); await h.page.getByTestId('settings-share-app').waitFor();
      }
      if (language === 'en') {
        for (const [name, width, height] of [['compact',240,640],['landscape',844,390],['tablet',800,1280]]) {
          await h.page.setViewportSize({ width, height }); await pause(h.page);
          report.dedications.push(await dedicationLayout(h.page, language, name)); await open(h.page);
          report.localized.push({ dark, width, height, ...(await layout(h.page, language, name)) });
          await h.page.getByTestId('screen-header').last().getByRole('button').first().click(); await h.page.getByTestId('settings-share-app').waitFor();
        }
      }
      await h.context.close();
    }
    const decoded = spawnSync('python3', [path.join(__dirname, 'verify-app-share-qr.py'), output], { encoding: 'utf8', timeout: 120000 });
    if (decoded.status !== 0) throw new Error(`Independent rendered QR decode failed: ${decoded.stderr || decoded.stdout}`);
    report.qrDecode = JSON.parse(decoded.stdout); assert.equal(report.qrDecode.count, report.localized.length + 4);
    assert.equal(report.localizedStatuses.length, 44);
    assert.equal(new Set(report.localizedStatuses.map(row => row.language)).size, 22);
    for (const errors of report.errors) for (const [kind, values] of Object.entries(errors)) assert.deepEqual(values, [], `${kind} errors`);
    console.log(JSON.stringify({ checks: Object.keys(report.checks), shareLayouts: report.localized.length + 3, dedicationLayouts: report.dedications.length, localizedStatusPairs: report.localizedStatuses.length, contexts: report.errors.length, independentlyDecodedQrScreenshots: report.qrDecode.count }, null, 2));
  } catch (error) { report.failure = error.stack || String(error); if (active && !active.isClosed()) await active.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {}); throw error; }
  finally { fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
