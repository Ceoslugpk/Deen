/**
 * Capture real screens from the running web build at large-screen viewports.
 * No resized phone captures, mockups, CSS overrides or mocked API responses.
 *
 * SCREENSHOT_URL=http://127.0.0.1:8100 \
 * SCREENSHOT_TIME=2026-10-26T10:10:00+04:00 \
 * node scripts/capture-store-screenshots.cjs
 *
 * Output defaults to the OS temporary directory. The packaging script encodes
 * high-quality RGB JPEGs at the original dimensions and creates the ZIP.
 */
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const URL = process.env.SCREENSHOT_URL || 'http://127.0.0.1:8100';
const OUT = path.resolve(process.env.SCREENSHOTS_DIR || path.join(os.tmpdir(), 'islamic-store-screenshots'));
const TIME = process.env.SCREENSHOT_TIME || new Date().toISOString();
const PROFILES = [
  { folder: 'tablet-7-inch', viewport: { width: 720, height: 1280 }, deviceScaleFactor: 2 },
  { folder: 'tablet-10-inch', viewport: { width: 900, height: 1600 }, deviceScaleFactor: 2 },
  { folder: 'foldable-unfolded', viewport: { width: 920, height: 1104 }, deviceScaleFactor: 2 },
];
const requested = process.env.SCREENSHOT_PROFILES?.split(',');
const profiles = requested ? PROFILES.filter((p) => requested.includes(p.folder)) : PROFILES;
assert.ok(profiles.length, 'At least one screenshot profile must be selected');

/** Ignore mounted screens behind the active navigator screen, not just offscreen DOM. */
async function paintedText(page) {
  return page.evaluate(() => {
    const texts = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.textContent.replace(/\s+/g, ' ').trim();
      if (value.length < 2 || !node.parentElement) continue;
      const element = node.parentElement;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = range.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || rect.bottom <= 0 || rect.top >= innerHeight || rect.right <= 0 || rect.left >= innerWidth) continue;
      const x = Math.min(innerWidth - 1, Math.max(0, rect.x + rect.width / 2));
      const y = Math.min(innerHeight - 1, Math.max(0, rect.y + rect.height / 2));
      const top = document.elementFromPoint(x, y);
      if (!top || !(top === element || element.contains(top))) continue;
      let opaque = true;
      for (let parent = element; parent; parent = parent.parentElement) {
        if (Number(getComputedStyle(parent).opacity) < 0.05) { opaque = false; break; }
      }
      if (opaque) texts.push(value);
    }
    return [...new Set(texts)].join('\n');
  });
}

async function clickLabel(page, label, last = false) {
  // Exact attribute matching avoids labels whose names happen to contain this one.
  const target = page.locator(`[role="button"][aria-label=${JSON.stringify(label)}]`);
  if (last) {
    await target.last().click();
    return;
  }
  const index = await target.evaluateAll((elements) => elements.findIndex((element) => {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.top < 0 || rect.bottom > innerHeight) return false;
    const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return top && (top === element || element.contains(top));
  }));
  assert.notEqual(index, -1, `The ${label} control must be on the active screen`);
  await target.nth(index).click();
}

async function captureProfile(browser, profile) {
  const destination = path.join(OUT, profile.folder);
  fs.mkdirSync(destination, { recursive: true });
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    locale: 'en-GB',
    timezoneId: 'Asia/Dubai',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  // This is an isolated, disposable browser profile, never a person's app data.
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
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = { page: [], console: [], http: [], requests: [] };
  page.on('pageerror', (error) => errors.page.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.console.push(message.text()); });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.http.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => errors.requests.push(`${request.url()} ${request.failure()?.errorText}`));
  const screenshots = [];
  try {
    // Keep the demonstration date reproducible while timers and animations run.
    // A fixed Date.now() would prevent React Native's splash fade from finishing.
    await page.clock.install({ time: new Date(TIME) });
    await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
    await page.getByText('Your Daily Companion', { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
    await page.locator('[role="button"][aria-label="Home"]').last().waitFor();

    const settle = async () => {
      await page.waitForTimeout(1200);
      await page.evaluate(() => document.fonts.ready);
    };
    const tab = async (label) => {
      await clickLabel(page, label, true);
      await settle();
    };
    const shot = async (filename, required) => {
      await settle();
      let text = '';
      const deadline = Date.now() + 20000;
      do {
        text = await paintedText(page);
        if (required.every((phrase) => text.includes(phrase))) break;
        await page.waitForTimeout(250);
      } while (Date.now() < deadline);
      if (!required.every((phrase) => text.includes(phrase))) {
        await page.screenshot({ path: path.join(destination, `debug-${filename}`) });
        fs.writeFileSync(path.join(destination, 'debug-errors.json'), JSON.stringify(errors, null, 2));
      }
      for (const phrase of required) {
        assert.ok(text.includes(phrase), `${profile.folder}/${filename}: active screen must show ${JSON.stringify(phrase)}\n${text}`);
      }
      assert.ok(!text.includes('Something went wrong'), `${filename}: no error screen`);
      // Text can become hit-testable before a theme or entrance fade finishes.
      await page.waitForTimeout(600);
      const file = path.join(destination, filename);
      await page.screenshot({ path: file, fullPage: false, animations: 'disabled', omitBackground: false });
      screenshots.push({ file: `${profile.folder}/${filename}`, requiredText: required, paintedText: text });
      console.log(`${profile.folder}/${filename}: captured and screen content verified`);
    };

    await shot('01-home-light.png', ['A purposeful morning', 'Dubai']);
    await tab('Prayer');
    await shot('02-prayer-times.png', ['Prayer times', 'Dhuhr']);
    await tab('Quran');
    await shot('03-quran-home.png', ['Read. Listen. Reflect.', 'Your Quran']);
    await page.getByText('Start reading', { exact: true }).click();
    await page.getByText('55:1', { exact: true }).waitFor({ timeout: 30000 });
    await shot('04-quran-reader.png', ['Ar-Rahman', '55:1', 'The Most Merciful']);
    await tab('Library');
    await shot('05-library.png', ['What you read', 'Hadith']);
    await tab('Tools');
    await shot('06-tools.png', ['Trackers and calculators', 'Zakat']);
    await page.getByText('A quiet, tactile dhikr counter', { exact: true }).click();
    await shot('07-tasbih.png', ['Dhikr counter', 'Subhan Allah']);
    await tab('Home');
    await clickLabel(page, 'Show the dark theme');
    await shot('08-home-dark.png', ['A purposeful morning', 'Dubai']);

    assert.equal(errors.page.length, 0, 'No uncaught JavaScript errors during capture');
    assert.equal(errors.console.length, 0, 'No console errors during capture');
    assert.equal(errors.http.length, 0, 'No failed HTTP responses during capture');
    return { ...profile, pixelSize: {
      width: profile.viewport.width * profile.deviceScaleFactor,
      height: profile.viewport.height * profile.deviceScaleFactor,
    }, screenshots, errors };
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    const results = await Promise.all(profiles.map((profile) => captureProfile(browser, profile)));
    const report = {
      sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      captureMethod: 'Playwright Chromium, live Expo web export; no native Android emulator',
      language: 'en', location: 'Dubai', timezone: 'Asia/Dubai', demonstrationClockStart: TIME,
      noUiOverrides: true, noMockedContentResponses: true, profiles: results,
    };
    fs.writeFileSync(path.join(OUT, 'capture-report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Captured ${results.reduce((n, p) => n + p.screenshots.length, 0)} screenshots in ${OUT}`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
