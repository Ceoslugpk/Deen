/** Live Expo WEB check with real translation catalogues (no mocked responses).
 * TRANSLATION_URL=http://127.0.0.1:8102 node tests/verify-translation-selection-web.cjs
 * Isolated browser profiles only; report/screenshots are temporary QA artifacts.
 * Not proof of native AsyncStorage or Android/iOS device behaviour. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const url = process.env.TRANSLATION_URL || 'http://127.0.0.1:8102';
const output = process.env.TRANSLATION_ARTIFACTS_DIR || path.join(os.tmpdir(), 'islamic-r92-web-smoke');
const prefsKey = '@deen/quran/preferences/v1';
const audioKey = '@deen/audio-settings/v1';

async function active(locator) {
  await locator.first().waitFor({ state: 'attached' });
  const deadline = Date.now() + 15000;
  do {
    const index = await locator.evaluateAll((elements) => elements.findIndex((element) => {
      const box = element.getBoundingClientRect();
      if (box.width < 1 || box.height < 1 || box.top < 0 || box.bottom > innerHeight) return false;
      for (let parent = element; parent; parent = parent.parentElement) {
        if (Number(getComputedStyle(parent).opacity) < 0.05) return false;
      }
      const top = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return top && (element === top || element.contains(top));
    }));
    if (index >= 0) return locator.nth(index);
    await locator.page().waitForTimeout(100);
  } while (Date.now() < deadline);
  assert.fail('The requested control must be on the active screen');
}
async function scrollClick(locator) {
  await locator.last().evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await (await active(locator)).click();
}
const clickText = (page, text) => scrollClick(page.getByText(text, { exact: true }));
const back = (page) => scrollClick(page.getByRole('button', { name: 'Back', exact: true }));
const readSaved = (page) => page.evaluate(({ prefsKey, audioKey }) => ({
  preferences: JSON.parse(localStorage.getItem(prefsKey) || '{}'),
  audio: JSON.parse(localStorage.getItem(audioKey) || '{}'),
  app: localStorage.getItem('@deen/language/v1'),
}), { prefsKey, audioKey });

async function pickLanguage(page, name, current) {
  const button = page.getByRole('button', { name: `Language: ${current}`, exact: true }).last();
  await button.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await button.click();
  await page.getByRole('textbox', { name: 'Search a language', exact: true }).fill(name);
  await page.getByRole('button', { name: new RegExp(`, ${name}, \\d+ versions?$`) }).click();
  await page.getByRole('textbox', { name: 'Search a language', exact: true }).waitFor({ state: 'detached' });
  const changed = page.getByRole('button', { name: `Language: ${name}`, exact: true }).last();
  await changed.waitFor();
  assert.ok(await changed.isVisible(), 'The header follows the browsing language before choosing an edition');
}
function picker(page) {
  return page.getByPlaceholder('Search translator or edition', { exact: true }).last().locator('..').locator('..');
}
async function chooseEdition(page, language) {
  const rows = picker(page).locator('[role="button"]');
  await rows.first().waitFor();
  let row = rows.first();
  if (language === 'Urdu') {
    const texts = await rows.allTextContents();
    const native = texts.findIndex((text) => /[\u0600-\u06ff]/.test(text));
    if (native >= 0) row = rows.nth(native);
  }
  const label = await row.textContent();
  await row.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await row.click();
  return label;
}
async function expectSaved(page, code, audioEdition) {
  await page.waitForFunction(({ prefsKey, audioKey, code, audioEdition }) => {
    const prefs = JSON.parse(localStorage.getItem(prefsKey) || '{}');
    const audio = JSON.parse(localStorage.getItem(audioKey) || '{}');
    return prefs.translationEdition?.startsWith(`tr_${code}_`) && audio.translationEdition === audioEdition;
  }, { prefsKey, audioKey, code, audioEdition });
  const saved = await readSaved(page);
  assert.equal(saved.audio.translationAudioEnabled, false, 'Selecting a voice does not enable audio');
  assert.equal(saved.audio.translationVolume, 0.65, 'Saved volume is preserved');
  assert.equal(saved.app, 'en', 'The interface language remains independently English');
  return saved;
}
async function openTranslations(page) {
  await clickText(page, 'Translation');
  await page.getByText('Choose a translation', { exact: true }).waitFor();
  await page.getByPlaceholder('Search translator or edition', { exact: true }).waitFor();
}
async function selectedEdition(page, expectedName) {
  // react-native-web does not emit aria-selected for these button-role
  // accessibilityState props, so inspect the actual painted check mark.
  const selected = picker(page).locator('[role="button"]').filter({ hasText: '✓' });
  assert.equal(await selected.count(), 1);
  assert.ok((await selected.textContent()).includes(expectedName), 'The saved edition, not English, is visibly checked');
  await selected.evaluate((element) => element.scrollIntoView({ block: 'center' }));
}

async function scenario(browser, savedUrdu = false) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    locale: 'en-GB', timezoneId: 'Asia/Dubai', reducedMotion: 'reduce' });
  await context.addInitScript(({ prefsKey, audioKey, savedUrdu }) => {
    if (sessionStorage.getItem('translation-test-seeded')) return;
    sessionStorage.setItem('translation-test-seeded', '1');
    localStorage.setItem('@deen/location/v1', JSON.stringify({ latitude: 25.2048, longitude: 55.2708, label: 'Dubai', timezone: 'Asia/Dubai' }));
    localStorage.setItem('@deen/onboarding/v1', JSON.stringify({ completed: true, app: 'en', text: 'en', voice: 'en', locationAsked: true, notificationsAsked: true }));
    localStorage.setItem('@deen/language/v1', 'en');
    localStorage.setItem('deen-theme-v1', 'light');
    localStorage.setItem('deen-theme-name-v1', 'islamic');
    localStorage.setItem(audioKey, JSON.stringify({ translationAudioEnabled: false, translationVolume: 0.65 }));
    if (savedUrdu) localStorage.setItem(prefsKey, JSON.stringify({
      translationEdition: 'tr_ur_fateh_muhammad_jalandhry', translationLanguage: 'Urdu',
      translationName: 'جالندہری', fontSize: 34,
    }));
  }, { prefsKey, audioKey, savedUrdu });
  const page = await context.newPage();
  page.setDefaultTimeout(25000);
  const errors = { page: [], console: [], http: [], requests: [] };
  page.on('pageerror', (error) => errors.page.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.console.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.http.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', (request) => errors.requests.push(`${request.url()} ${request.failure()?.errorText}`));
  const name = savedUrdu ? 'existing-urdu' : 'new-selection';
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.getByText('Your Daily Companion', { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
    await page.locator('[role="button"][aria-label="Quran"]').last().click();
    await openTranslations(page);
    if (savedUrdu) {
      await page.getByRole('button', { name: 'Language: Urdu', exact: true }).waitFor();
      const saved = await expectSaved(page, 'ur', 'ur.khan');
      assert.equal(saved.preferences.fontSize, 34);
      await selectedEdition(page, saved.preferences.translationName);
      await page.screenshot({ path: path.join(output, 'existing-urdu-preserved.png'), animations: 'disabled' });
      return { name, saved, errors };
    }

    await pickLanguage(page, 'Urdu', 'English');
    const urduRow = await chooseEdition(page, 'Urdu');
    const urdu = await expectSaved(page, 'ur', 'ur.khan');
    await openTranslations(page);
    await page.getByRole('button', { name: 'Language: Urdu', exact: true }).waitFor();
    await selectedEdition(page, urdu.preferences.translationName);
    await page.screenshot({ path: path.join(output, 'urdu-selected.png'), animations: 'disabled' });
    await page.reload({ waitUntil: 'load' });
    await page.getByText('Your Daily Companion', { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
    await page.locator('[role="button"][aria-label="Quran"]').last().click();
    await openTranslations(page);
    await page.getByRole('button', { name: 'Language: Urdu', exact: true }).waitFor();
    await selectedEdition(page, urdu.preferences.translationName);
    const urduAfterReload = await expectSaved(page, 'ur', 'ur.khan');
    assert.equal(urduAfterReload.preferences.translationEdition, urdu.preferences.translationEdition);
    await back(page);

    // Minimal scrolling here: centering the text fights the hero's scroll-
    // driven height and can keep its bounds moving during an otherwise valid tap.
    await page.getByText('Start reading', { exact: true }).click();
    await page.getByText('55:1', { exact: true }).waitFor();
    await page.locator('[aria-label="Reader settings"]').last().click();
    await page.getByText('Reading settings', { exact: true }).waitFor();
    await pickLanguage(page, 'Tamil', 'Urdu');
    const tamilRow = await chooseEdition(page, 'Tamil');
    const tamil = await expectSaved(page, 'ta', 'en.walk');
    await selectedEdition(page, tamil.preferences.translationName);
    await page.screenshot({ path: path.join(output, 'tamil-english-audio-fallback.png'), animations: 'disabled' });

    await page.reload({ waitUntil: 'load' });
    await page.getByText('Your Daily Companion', { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
    await page.locator('[role="button"][aria-label="Quran"]').last().click();
    await openTranslations(page);
    await page.getByRole('button', { name: 'Language: Tamil', exact: true }).waitFor();
    await selectedEdition(page, tamil.preferences.translationName);
    const afterReload = await expectSaved(page, 'ta', 'en.walk');
    assert.equal(afterReload.preferences.translationEdition, tamil.preferences.translationEdition);
    return { name, urduRow, urdu, urduAfterReload, tamilRow, tamil, afterReload, errors };
  } catch (error) {
    await page.screenshot({ path: path.join(output, `${name}-failure.png`) }).catch(() => {});
    const dom = await page.evaluate(() => {
      const input = [...document.querySelectorAll('input')].find((element) => element.placeholder === 'Search translator or edition');
      const ancestors = [];
      for (let parent = input?.parentElement, index = 0; parent && index < 3; parent = parent.parentElement, index++) ancestors.push(parent.outerHTML.slice(0, 600));
      return { ancestors, buttons: [...document.querySelectorAll('[role="button"]')].slice(-30).map((element) => ({ text: element.textContent, attrs: [...element.attributes].filter((a) => a.name.startsWith('aria')).map((a) => [a.name, a.value]) })) };
    });
    fs.writeFileSync(path.join(output, `${name}-failure.json`), JSON.stringify({ message: error.message, errors, saved: await readSaved(page), dom }, null, 2));
    throw error;
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  try {
    const results = [];
    for (const existing of [false, true]) {
      const result = await scenario(browser, existing);
      assert.equal(result.errors.page.length, 0);
      assert.equal(result.errors.console.length, 0);
      assert.equal(result.errors.http.length, 0);
      assert.equal(result.errors.requests.length, 0);
      results.push(result);
      console.log(`${result.name}: text/audio selection, visible checked edition, saved preferences and independent English UI passed`);
    }
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({
      method: 'Live Expo WEB + Chromium; real catalogue, no mocked responses; browser storage is not native AsyncStorage', url, results,
    }, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
