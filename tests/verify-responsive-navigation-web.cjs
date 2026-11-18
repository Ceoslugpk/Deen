/** Running-app layout checks. Real Expo WEB, real content, no mocked responses.
 * Insets below are explicit layout fixtures applied to the outer boundary;
 * Chromium cannot switch a real Android device's navigation mode.
 * RESPONSIVE_URL=http://127.0.0.1:8103 node tests/verify-responsive-navigation-web.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const url = process.env.RESPONSIVE_URL || 'http://127.0.0.1:8103';
const output = process.env.RESPONSIVE_ARTIFACTS_DIR || path.join(os.tmpdir(), 'islamic-r93-web-smoke');
const tabs = ['home', 'prayer', 'quran', 'library', 'tools'];
const profiles = [
  ['compact-phone', 240, 640], ['foldable-cover', 280, 720], ['small-phone', 320, 568],
  ['phone', 360, 800], ['large-phone', 390, 844], ['phone-landscape', 844, 390],
  ['tablet-portrait', 800, 1280], ['tablet-landscape', 1280, 800],
  ['foldable-inner', 884, 1104], ['large-tablet', 1200, 1920], ['desktop', 1440, 900],
];
const zero = { top: 0, right: 0, bottom: 0, left: 0 };
const fixtures = [
  ['gestures', { ...zero, top: 24, bottom: 24 }],
  ['three-buttons', { ...zero, top: 24, bottom: 48 }],
  ['larger-navigation-keys', { ...zero, top: 30, bottom: 64 }],
  ['right-navigation', { ...zero, top: 24, right: 48 }],
  ['left-navigation', { ...zero, top: 24, left: 48 }],
  ['cutout-and-side-keys', { ...zero, top: 24, left: 32, right: 48 }],
  ['hidden-system-bars', zero],
];

const box = (locator) => locator.evaluate((element) => {
  const { x, y, width, height, right, bottom } = element.getBoundingClientRect();
  return { x, y, width, height, right, bottom };
});
function within(inner, outer, label) {
  assert.ok(inner.width > 0 && inner.height > 0, `${label} has a usable size`);
  assert.ok(inner.x >= outer.x - 1 && inner.right <= outer.right + 1 && inner.y >= outer.y - 1 && inner.bottom <= outer.bottom + 1,
    `${label} is inside its safe parent: ${JSON.stringify({ inner, outer })}`);
}
async function settle(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function active(locator) {
  await locator.first().waitFor({ state: 'attached' });
  const deadline = Date.now() + 15000;
  do {
    const index = await locator.evaluateAll((elements) => elements.findIndex((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || rect.top < 0 || rect.bottom > innerHeight) return false;
      for (let parent = element; parent; parent = parent.parentElement) {
        if (Number(getComputedStyle(parent).opacity) < 0.95) return false;
      }
      const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return top && (top === element || element.contains(top));
    }));
    if (index >= 0) return locator.nth(index);
    await locator.page().waitForTimeout(100);
  } while (Date.now() < deadline);
  assert.fail('Requested control must be visible on the active screen');
}
async function applyInsets(page, insets) {
  await page.getByTestId('system-window-boundary').first().evaluate((element, values) => {
    for (const edge of ['top', 'right', 'bottom', 'left']) element.style.setProperty(`padding-${edge}`, `${values[edge]}px`, 'important');
  }, insets);
  await settle(page);
  const safe = await box(page.getByTestId('system-safe-content').first());
  assert.ok(Math.abs(safe.x - insets.left) <= 1);
  assert.ok(Math.abs(safe.y - insets.top) <= 1);
  return safe;
}
async function checkChrome(page, headerId = 'app-header') {
  await settle(page);
  const safe = await box(page.getByTestId('system-safe-content').first());
  const bar = await box(page.getByTestId('floating-navigation-bar'));
  within(bar, safe, 'Bottom navigation capsule');
  assert.ok(Math.abs(safe.bottom - bar.bottom - 16) <= 1, 'The original gap is applied once, inside the system-safe box');
  const controls = [];
  for (const tab of tabs) {
    const rect = await box(page.getByTestId(`navigation-${tab}`));
    within(rect, bar, `${tab} navigation target`);
    if (safe.width >= 238) assert.ok(rect.width >= 43.9, `${tab} keeps a 44px target`);
    controls.push({ tab, ...rect });
  }
  for (let i = 1; i < controls.length; i++) {
    const before = controls[i - 1];
    const after = controls[i];
    assert.ok(before.right <= after.x + 1 || after.right <= before.x + 1, 'Tab targets do not overlap in either direction');
  }
  const header = await active(page.getByTestId(headerId));
  const headerBox = await box(header);
  within(headerBox, safe, 'Header');
  for (const button of await header.locator('[role="button"], [role="switch"]').all()) {
    within(await box(button), headerBox, 'Header control');
  }
  return { safe, bar, header: headerBox, controls };
}
async function makePage(browser, language = 'en', completed = true) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    locale: 'en-GB', timezoneId: 'Asia/Dubai', reducedMotion: 'reduce' });
  await context.addInitScript(({ lang, completed }) => {
    localStorage.setItem('@deen/onboarding/v1', JSON.stringify({ completed, app: lang, text: 'en', voice: 'en', locationAsked: true, notificationsAsked: true }));
    localStorage.setItem('@deen/language/v1', lang);
    localStorage.setItem('@deen/location/v1', JSON.stringify({ latitude: 25.2048, longitude: 55.2708, label: 'Dubai', timezone: 'Asia/Dubai' }));
    localStorage.setItem('deen-theme-v1', 'light');
    localStorage.setItem('deen-theme-name-v1', 'islamic');
    localStorage.setItem('@deen/audio-settings/v1', JSON.stringify({ translationAudioEnabled: false }));
  }, { lang: language, completed });
  const page = await context.newPage();
  page.setDefaultTimeout(25000);
  const errors = { page: [], console: [], http: [], requests: [] };
  page.on('pageerror', (error) => errors.page.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.console.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.http.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', (request) => errors.requests.push(`${request.url()} ${request.failure()?.errorText}`));
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.getByText('Your Daily Companion', { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
  await page.getByTestId('navigation-home').waitFor();
  return { context, page, errors };
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  const report = { method: 'Live Expo WEB with real content; explicit simulated inset layouts, not native Android navigation-mode/device verification', url, profiles: [], insets: [], player: [], sheets: [], onboarding: [] };
  let currentPage;
  try {
    const { context, page, errors } = await makePage(browser);
    currentPage = page;
    for (const [name, width, height] of profiles) {
      await page.setViewportSize({ width, height });
      await applyInsets(page, zero);
      const checks = [];
      for (const tab of tabs) {
        await page.getByTestId(`navigation-${tab}`).click();
        checks.push({ tab, ...(await checkChrome(page)) });
      }
      await page.screenshot({ path: path.join(output, `${name}.png`), animations: 'disabled' });
      report.profiles.push({ name, width, height, checks });
      console.log(`${name} ${width}x${height}: all five tabs, headers and footer bounds passed`);
    }
    await page.getByTestId('navigation-home').click();
    for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      for (const [name, insets] of fixtures) {
        await applyInsets(page, insets);
        report.insets.push({ name, viewport, insets, ...(await checkChrome(page)) });
      }
    }
    console.log('Live gesture/button/side-bar layout changes: header/footer safe bounds passed without reload');

    await page.setViewportSize({ width: 390, height: 844 });
    await applyInsets(page, zero);
    await page.getByTestId('navigation-quran').click();
    await (await active(page.getByText('Start reading', { exact: true }))).click();
    await page.getByText('55:1', { exact: true }).waitFor();
    const play = page.getByRole('button', { name: 'Play verse 55:1', exact: true });
    await play.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await play.click();
    await page.getByTestId('mini-player').waitFor();
    await page.getByRole('button', { name: 'Pause recitation', exact: true }).click();
    for (const viewport of [{ width: 240, height: 640 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1280, height: 800 }]) {
      await page.setViewportSize(viewport);
      await applyInsets(page, { ...zero, top: 24, bottom: viewport.width > viewport.height ? 0 : 48, right: viewport.width > viewport.height ? 48 : 0 });
      const chrome = await checkChrome(page, 'reader-header');
      const player = await box(page.getByTestId('mini-player'));
      within(player, chrome.safe, 'Mini-player');
      assert.ok(player.bottom <= chrome.bar.y, 'Mini-player stays above the footer');
      for (const control of await page.getByTestId('mini-player').locator('[role="button"]').all()) within(await box(control), player, 'Mini-player control');
      report.player.push({ viewport, player, ...chrome });
    }
    console.log('Reader header and mini-player: compact phone, side navigation, landscape and tablet bounds passed');
    for (const viewport of [{ width: 240, height: 640 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      const insets = { ...zero, top: 24, bottom: viewport.width > viewport.height ? 0 : 48, right: viewport.width > viewport.height ? 48 : 0 };
      const safe = await applyInsets(page, insets);
      const more = page.getByRole('button', { name: 'More actions for verse 55:1', exact: true });
      await more.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await more.click();
      const title = await active(page.getByText('Verse 55:1', { exact: true }));
      const panel = title.locator('..');
      // An entering sheet starts below the safe box. Inspect its controls
      // once it has arrived, not while the opening transition is in flight.
      await page.waitForFunction(({ panel, safe }) => {
        const rect = panel.getBoundingClientRect();
        return rect.top >= safe.y - 1 && Math.abs(rect.bottom - safe.bottom) <= 1;
      }, { panel: await panel.elementHandle(), safe });
      const sheet = await box(panel);
      within(sheet, safe, 'Verse actions sheet');
      const close = panel.getByRole('button', { name: 'Close', exact: true });
      within(await box(close), sheet, 'Sheet footer button');
      report.sheets.push({ viewport, insets, safe, sheet });
      await close.click();
    }
    console.log('Bottom-sheet footer buttons: compact, portrait and side-key landscape bounds passed');
    report.errors = errors;
    for (const [kind, list] of Object.entries(errors)) assert.deepEqual(list, [], `${kind} errors`);
    await context.close();

    const rtl = await makePage(browser, 'ur');
    currentPage = rtl.page;
    await applyInsets(rtl.page, { ...zero, top: 24, bottom: 48 });
    report.rtl = await checkChrome(rtl.page);
    report.rtlErrors = rtl.errors;
    for (const [kind, list] of Object.entries(rtl.errors)) assert.deepEqual(list, [], `RTL ${kind} errors`);
    await rtl.context.close();

    const firstRun = await makePage(browser, 'en', false);
    currentPage = firstRun.page;
    for (const viewport of [{ width: 240, height: 640 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await firstRun.page.setViewportSize(viewport);
      const safe = await applyInsets(firstRun.page, { ...zero, top: 24, bottom: viewport.width > viewport.height ? 0 : 48, right: viewport.width > viewport.height ? 48 : 0 });
      const header = await box(firstRun.page.getByTestId('onboarding-header'));
      const footer = await box(firstRun.page.getByTestId('onboarding-footer'));
      within(header, safe, 'First-run header');
      within(footer, safe, 'First-run footer');
      for (const control of await firstRun.page.getByTestId('onboarding-footer').locator('[tabindex="0"]').all()) within(await box(control), footer, 'First-run footer control');
      report.onboarding.push({ viewport, safe, header, footer });
    }
    report.onboardingErrors = firstRun.errors;
    for (const [kind, list] of Object.entries(firstRun.errors)) assert.deepEqual(list, [], `First-run ${kind} errors`);
    await firstRun.context.close();
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log('Urdu RTL and first-run header/footer bounds passed; page/console/HTTP/request errors empty');
  } catch (error) {
    if (currentPage && !currentPage.isClosed()) await currentPage.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    fs.writeFileSync(path.join(output, 'failure.json'), JSON.stringify({ message: error.message, report }, null, 2));
    throw error;
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
