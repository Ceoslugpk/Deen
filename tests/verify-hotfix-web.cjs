/**
 * Live WEB smoke test against a fresh Expo export, with real content and audio.
 * This observes HTMLMediaElement.play without replacing its implementation or
 * faking network responses. It is not Android/iOS device validation.
 *
 * HOTFIX_URL=http://127.0.0.1:8101 node tests/verify-hotfix-web.cjs
 * Output (report/screenshots) goes to /tmp/islamic-r91-web-smoke by default.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');
const { createLoader } = require('./helpers/load-typescript.cjs');
// Only the bundled verse-count arithmetic runs in Node. Its unused URL
// constant is isolated so importing it does not load React Native into Node.
const { globalAyahNumber } = createLoader({
  './islamicDataApi': { ISLAMIC_DATA_BASE_URL: '' },
})('src/services/quranMeta.ts');

const url = process.env.HOTFIX_URL || 'http://127.0.0.1:8101';
const output = process.env.HOTFIX_ARTIFACTS_DIR || path.join(os.tmpdir(), 'islamic-r91-web-smoke');

async function runProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport, isMobile: true, hasTouch: true,
    locale: 'en-GB', timezoneId: 'Asia/Dubai', reducedMotion: 'reduce',
  });
  await context.addInitScript(() => {
    localStorage.setItem('@deen/location/v1', JSON.stringify({
      latitude: 25.2048, longitude: 55.2708, label: 'Dubai', timezone: 'Asia/Dubai',
    }));
    localStorage.setItem('@deen/onboarding/v1', JSON.stringify({
      completed: true, app: 'en', text: 'en', voice: 'en',
      locationAsked: true, notificationsAsked: true,
    }));
    localStorage.setItem('@deen/language/v1', 'en');
    localStorage.setItem('deen-theme-v1', 'light');
    localStorage.setItem('deen-theme-name-v1', 'islamic');
    window.__hotfixPlays = [];
    window.__hotfixMedia = [];
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      window.__hotfixPlays.push({ uri: this.src || this.currentSrc, at: performance.now() });
      if (!window.__hotfixMedia.includes(this)) window.__hotfixMedia.push(this);
      return Reflect.apply(originalPlay, this, args);
    };
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = { page: [], console: [], http: [], requests: [] };
  page.on('pageerror', (error) => errors.page.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.console.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.http.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', (request) => errors.requests.push(`${request.url()} ${request.failure()?.errorText}`));
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.getByText('Your Daily Companion', { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
    await page.locator('[role="button"][aria-label="Quran"]').last().click();
    await page.getByText('Start reading', { exact: true }).click();
    await page.getByText('55:1', { exact: true }).waitFor();
    // This is a cold player: no Surah play and no earlier verse tap.
    assert.equal(await page.evaluate(() => window.__hotfixPlays.length), 0);

    const tapVerse = async (verse) => {
      const label = `Play verse 55:${verse}`;
      const control = page.locator(`[role="button"][aria-label=${JSON.stringify(label)}]`);
      await control.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await control.click();
    };
    const expectedUrl = (verse) => `/ar.alafasy/${globalAyahNumber(55, verse)}.mp3`;
    const firstPlay = page.waitForFunction(() => window.__hotfixPlays.length > 0);
    await tapVerse(5);
    await firstPlay;
    const first = await page.evaluate(() => window.__hotfixPlays[0]);
    assert.ok(first.uri.endsWith(expectedUrl(5)), `First tap requested ayah 5, got ${first.uri}`);
    await page.waitForFunction((suffix) => window.__hotfixMedia.some((audio) =>
      (audio.currentSrc || audio.src).endsWith(suffix) && !audio.paused && audio.currentTime > 0.2
    ), expectedUrl(5), { timeout: 25000 });
    const media = await page.evaluate(() => window.__hotfixMedia.map((audio) => ({
      uri: audio.currentSrc || audio.src, position: audio.currentTime, duration: audio.duration, paused: audio.paused,
    })));
    await page.getByRole('button', { name: 'Pause recitation', exact: true }).click();

    const beforeRepeat = await page.evaluate(() => window.__hotfixPlays.length);
    await tapVerse(5);
    await page.waitForFunction((count) => window.__hotfixPlays.length > count, beforeRepeat);
    assert.ok((await page.evaluate(() => window.__hotfixPlays.at(-1).uri)).endsWith(expectedUrl(5)));
    await page.getByRole('button', { name: 'Pause recitation', exact: true }).click();

    const beforeNewVerse = await page.evaluate(() => window.__hotfixPlays.length);
    await tapVerse(7);
    await page.waitForFunction((count) => window.__hotfixPlays.length > count, beforeNewVerse);
    assert.ok((await page.evaluate(() => window.__hotfixPlays.at(-1).uri)).endsWith(expectedUrl(7)));
    await page.getByRole('button', { name: 'Pause recitation', exact: true }).click();
    const controls = await page.evaluate(() => {
      const rect = (element) => {
        const box = element.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom, left: box.left, right: box.right };
      };
      const player = document.querySelector('[aria-label="Open the audio player"]');
      const tabs = [...document.querySelectorAll('[aria-label="Home"]')];
      return { player: rect(player), homeTab: rect(tabs.at(-1)), height: innerHeight };
    });
    assert.ok(controls.player.bottom <= controls.homeTab.top, 'The player stays above the floating menu');
    assert.ok(controls.homeTab.bottom <= controls.height, 'The menu remains in the web viewport');
    await page.screenshot({ path: path.join(output, `${profile.name}-reader-player.png`), animations: 'disabled' });
    const plays = await page.evaluate(() => window.__hotfixPlays);
    await page.getByRole('button', { name: 'Close the player', exact: true }).click();
    await page.getByRole('button', { name: 'Open the audio player', exact: true }).waitFor({ state: 'detached' });
    assert.equal(errors.page.length, 0, 'No runtime errors');
    assert.equal(errors.console.length, 0, 'No console errors');
    assert.equal(errors.http.length, 0, 'No failed HTTP responses');
    return { ...profile, firstTap: '55:5', repeatedTap: '55:5', nextTap: '55:7', plays, media, controls, errors };
  } catch (error) {
    await page.screenshot({ path: path.join(output, `${profile.name}-failure.png`) }).catch(() => {});
    fs.writeFileSync(path.join(output, `${profile.name}-failure.json`), JSON.stringify({ errors, message: error.message }, null, 2));
    throw error;
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    const results = [];
    for (const profile of [
      { name: 'phone', viewport: { width: 390, height: 844 } },
      { name: 'tablet', viewport: { width: 900, height: 1600 } },
    ]) {
      const result = await runProfile(browser, profile);
      results.push(result);
      console.log(`${profile.name}: first tap 55:5, repeated tap 55:5, new tap 55:7, real audio progress and control bounds passed`);
    }
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({
      method: 'Live Expo WEB export + Chromium; no native device and no mocked content/audio responses',
      url, results,
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
