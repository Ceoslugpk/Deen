/** Real production Expo WEB + Chromium. No mocked catalogues, MP3 responses,
 * completion callbacks, media state or speech. Network-failure QA explicitly
 * uses browser offline mode and is recorded separately. Not native device QA.
 * AUDIO_TRANSLATION_URL=http://127.0.0.1:8111 node tests/verify-audio-translation-web.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { fullLabel } = require('./verify-indopak-web.cjs');
const load = createLoader(), { tx, loadCopy } = load('src/services/arabicCopy.ts');
const { audioPlayerLanguage, audioPlayerText } = load('src/services/audioPlayerCopy.ts');
const { ayahNumberToKey } = createLoader({ './islamicDataApi': { ISLAMIC_DATA_BASE_URL: '' } })('src/services/quranMeta.ts');
const editions = require('../src/data/audio-editions.json').editions.filter(e => e.language !== 'ar');
const base = process.env.AUDIO_TRANSLATION_URL || 'http://127.0.0.1:8111';
const output = process.env.AUDIO_TRANSLATION_ARTIFACTS_DIR || '/tmp/islamic-r103-audio-translation';
const settingsKey = '@deen/audio-settings/v1', prefsKey = '@deen/quran/preferences/v1';
const languages = ['en','ar','ur','fa','ps','fr','tr','ru','uz','kk','zh','vi','az','bs','bg','si','bn','hi','id','ms','ta','ml'];
const suffix = (edition, global = 262) => {
  const entry = editions.find(e => e.identifier === edition);
  if (!entry?.audioBase) return `/${edition}/${global}.mp3`;
  const { surah, verse } = ayahNumberToKey(global), pad = n => String(n).padStart(3, '0');
  return `${entry.audioBase}/${pad(surah)}${pad(verse)}.mp3`;
};
const saved = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), settingsKey);
async function click(locator) { await locator.evaluate(e => e.scrollIntoView({ block: 'center' })); await locator.click(); }
async function pausePlayer(page) {
  // A new real source can advance before Expo's next periodic UI status. Tap
  // the actual Pause action, not a still-painted Play button during buffering.
  await click(page.getByTestId('audio-player-play-pause').and(page.getByRole('button', { name: 'Pause', exact: true })));
  await page.waitForFunction(() => window.__translationMedia.every(a => a.paused)
    && document.querySelector('[data-testid="audio-player-play-pause"]')?.getAttribute('aria-label') === 'Play');
}
async function stateOfMedia(page) {
  return page.evaluate(() => ({ plays: window.__translationPlays, media: window.__translationMedia.map(a => ({
    uri: a.currentSrc || a.src, position: a.currentTime, duration: Number.isFinite(a.duration) ? a.duration : null, paused: a.paused,
  })) }));
}
async function playing(page, edition, global = 262) {
  await page.waitForFunction(ending => window.__translationMedia.some(a => (a.currentSrc || a.src).endsWith(ending)
    && !a.paused && a.currentTime > .1 && Number.isFinite(a.duration) && a.duration > .1), suffix(edition, global), { timeout: 45000 });
  return page.evaluate(ending => {
    const a = window.__translationMedia.find(a => (a.currentSrc || a.src).endsWith(ending) && !a.paused);
    return { uri: a.currentSrc || a.src, position: a.currentTime, duration: a.duration, paused: a.paused };
  }, suffix(edition, global));
}
async function pick(page, edition) {
  await click(page.getByTestId('audio-translation-picker'));
  await page.getByTestId('audio-translation-options').waitFor();
  const at = await page.evaluate(() => performance.now());
  await click(page.getByTestId(`audio-translation-${edition}`));
  await page.getByTestId('audio-translation-options').waitFor({ state: 'detached' });
  await page.waitForFunction(({ key, edition }) => JSON.parse(localStorage.getItem(key) || '{}').translationEdition === edition,
    { key: settingsKey, edition });
  return at;
}
async function make(browser, { language = 'en', width = 390, height = 844, dark = false, enabled = false, kind = 'arabic', tiny = false } = {}) {
  await loadCopy(language);
  const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true,
    reducedMotion: 'reduce', locale: 'en-GB', timezoneId: 'Asia/Dubai' });
  await context.addInitScript(({ language, dark, enabled, kind, tiny }) => {
    if (!sessionStorage.getItem('audio-translation-seeded')) {
      sessionStorage.setItem('audio-translation-seeded', '1');
      localStorage.setItem('@deen/language/v1', language);
      localStorage.setItem('@deen/onboarding/v1', JSON.stringify({ completed: true, app: language, text: 'en', voice: 'en', locationAsked: true, notificationsAsked: true }));
      localStorage.setItem('@deen/location/v1', JSON.stringify({ latitude: 25.2048, longitude: 55.2708, label: 'Dubai', timezone: 'Asia/Dubai' }));
      localStorage.setItem('deen-theme-v1', dark ? 'dark' : 'light');
      localStorage.setItem('deen-theme-name-v1', 'islamic');
      localStorage.setItem('@deen/audio-settings/v1', JSON.stringify({ translationAudioEnabled: enabled, translationEdition: 'en.walk', translationName: 'Ibrahim Walk',
        translationSyncedLanguage: 'en', sequential: true, repeat: 'none', resumeOnStart: true, arabicVolume: .72, translationVolume: .61, rate: 1 }));
      localStorage.setItem('@deen/audio-session/v1', JSON.stringify({ chapterId: tiny ? 1 : 2, chapterName: tiny ? 'Al-Fatihah' : 'Al-Baqarah', reciterMode: 'verse',
        edition: 'ar.alafasy', translationEdition: 'en.walk', translationAudioEnabled: enabled, sequential: true,
        trackKind: kind, ayahNumber: tiny ? 2 : 255, index: tiny ? 1 : 254, position: 0, savedAt: Date.now() }));
      localStorage.setItem('@deen/quran/preferences/v1', JSON.stringify({ scriptEdition: 'quran-uthmani', scriptName: 'Uthmani', arabicFont: 'hafs', fontSize: 34,
        translationEdition: 'tr_en_saheeh_international', translationName: 'Saheeh International', translationLanguage: 'English', translationAppLanguage: language, readingMode: 'cards' }));
      localStorage.setItem('@deen/quran/notes/v1', '[{"verseKey":"55:5","note":"Keep this note"}]');
      localStorage.setItem('@deen/quran/indopak-taj-16/state/v1', '{"version":1,"edition":"indopak-taj-16","page":478,"zoom":2,"savedPages":[478],"readingPoint":{"page":478,"verse":"55:5","wordId":75000}}');
    }
    window.__translationMedia = []; window.__translationPlays = []; window.__translationPauses = [];
    for (const method of ['play', 'pause']) {
      const original = HTMLMediaElement.prototype[method];
      HTMLMediaElement.prototype[method] = function (...args) {
        if (!window.__translationMedia.includes(this)) window.__translationMedia.push(this);
        window[method === 'play' ? '__translationPlays' : '__translationPauses'].push({ uri: this.src || this.currentSrc, at: performance.now() });
        return Reflect.apply(original, this, args);
      };
    }
  }, { language, dark, enabled, kind, tiny });
  const page = await context.newPage(); page.setDefaultTimeout(25000);
  const errors = { page: [], console: [], http: [], requests: [], expectedCancellations: [], expectedOffline: [] };
  page.on('pageerror', e => errors.page.push(e.message));
  page.on('console', e => { if (e.type() === 'error') errors.console.push(e.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.http.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => {
    const message = `${request.url()} ${request.failure()?.errorText}`;
    if (/\.mp3(?:\?|$)/.test(request.url()) && /ERR_ABORTED/.test(message)) errors.expectedCancellations.push(message);
    else if (/ERR_INTERNET_DISCONNECTED/.test(message)) errors.expectedOffline.push(message);
    else errors.requests.push(message);
  });
  await page.goto(base, { waitUntil: 'load', timeout: 60000 });
  await page.getByText(tx(language, 'Your Daily Companion'), { exact: true }).waitFor({ state: 'detached', timeout: 35000 });
  await page.getByTestId('mini-player').waitFor({ timeout: 45000 });
  await page.getByTestId('mini-player').getByRole('button').first().click();
  await page.getByTestId('audio-translation-toggle').waitFor();
  return { context, page, errors };
}
const clean = own => {
  assert.deepEqual(own.errors.page, [], 'No runtime errors');
  assert.deepEqual(own.errors.console, [], 'No console errors');
  assert.deepEqual(own.errors.http, [], 'No failed HTTP responses');
  assert.deepEqual(own.errors.requests, [], 'No unexpected failed requests');
};
async function mainScenario(browser) {
  const own = await make(browser), { page, context } = own;
  const result = { name: 'live-player', media: [], sourceChangeDelaysMs: [], errors: own.errors };
  try {
    assert.equal(await page.getByTestId('audio-translation-toggle').getAttribute('aria-checked'), 'false');
    const protectedKeys = [prefsKey, '@deen/quran/notes/v1', '@deen/quran/indopak-taj-16/state/v1'];
    const beforeSaved = await page.evaluate(keys => keys.map(k => localStorage.getItem(k)), protectedKeys);
    await click(page.getByTestId('audio-player-play-pause'));
    const arabic = await playing(page, 'ar.alafasy'); result.media.push(arabic);
    const plays = (await stateOfMedia(page)).plays.length;
    await click(page.getByTestId('audio-translation-toggle'));
    await page.waitForFunction(k => JSON.parse(localStorage.getItem(k)).translationAudioEnabled, settingsKey);
    await pick(page, 'ur.khan');
    const heldArabic = await playing(page, 'ar.alafasy'); result.media.push(heldArabic);
    assert.ok(heldArabic.position >= arabic.position, 'Arabic is not rewound by enabling/changing translation');
    assert.equal((await stateOfMedia(page)).plays.length, plays, 'Changing only future translations does not re-play Arabic');
    await click(page.getByRole('button', { name: 'Next verse', exact: true }).last());
    result.media.push(await playing(page, 'ur.khan'));
    const at = await pick(page, 'fr.leclerc');
    result.media.push(await playing(page, 'fr.leclerc'));
    const log = (await stateOfMedia(page)).plays.filter(p => p.uri.endsWith(suffix('fr.leclerc'))).at(-1);
    result.sourceChangeDelaysMs.push(log.at - at);
    assert.ok(log.at - at < 2500, 'Switch the source on selection, not at the end of the old translated ayah');
    assert.ok((await page.getByTestId('audio-player-track-title').textContent()).includes('255'));
    assert.ok(!(await stateOfMedia(page)).media.some(a => /\/(en\.walk|ur\.khan)\//.test(a.uri) && !a.paused), 'No overlapping old voices');
    await page.waitForFunction(() => document.querySelector('[data-testid="audio-player-play-pause"]')?.getAttribute('aria-label') === 'Pause');
    await page.getByTestId('audio-player-track-title').evaluate(e => e.scrollIntoView({ block: 'center' }));
    await page.screenshot({ path: path.join(output, 'player-translation-on.png'), animations: 'disabled' });
    for (const edition of ['en.walk', 'ur.khan', 'fr.leclerc']) await pick(page, edition);
    result.media.push(await playing(page, 'fr.leclerc'));
    assert.equal((await saved(page)).translationEdition, 'fr.leclerc');

    await pausePlayer(page);
    const count = (await stateOfMedia(page)).plays.length;
    await pick(page, 'ur.khan');
    await page.waitForTimeout(250);
    const paused = await stateOfMedia(page);
    assert.equal(paused.plays.length, count, 'Selecting a voice while paused must not autoplay');
    assert.ok(paused.media.filter(a => a.uri.endsWith(suffix('ur.khan'))).every(a => a.paused));
    await click(page.getByTestId('audio-player-play-pause'));
    result.media.push(await playing(page, 'ur.khan'));
    await click(page.getByTestId('audio-translation-toggle'));
    result.media.push(await playing(page, 'ar.alafasy', 263));
    assert.equal((await saved(page)).translationAudioEnabled, false);
    const afterOffPlays = (await stateOfMedia(page)).plays.length;
    await pick(page, 'en.walk');
    assert.equal((await saved(page)).translationAudioEnabled, false, 'Choosing a future language respects Off');
    assert.equal((await stateOfMedia(page)).plays.length, afterOffPlays);
    assert.equal(await page.getByTestId('audio-queue-286').count(), 0, 'Disabled queue has only 286 Arabic ayahs');
    await page.getByTestId('audio-translation-toggle').evaluate(e => e.scrollIntoView({ block: 'center' }));
    await page.screenshot({ path: path.join(output, 'player-translation-off.png'), animations: 'disabled' });
    await pausePlayer(page);
    await page.reload({ waitUntil: 'load' });
    await page.getByTestId('mini-player').waitFor({ timeout: 45000 });
    await page.getByTestId('mini-player').getByRole('button').first().click();
    await page.getByTestId('audio-translation-toggle').waitFor();
    assert.equal(await page.getByTestId('audio-translation-toggle').getAttribute('aria-checked'), 'false');
    assert.ok((await page.getByTestId('audio-player-track-title').textContent()).includes('256'));
    assert.equal((await stateOfMedia(page)).plays.length, 0, 'Reload restores paused, with no unasked autoplay');
    const afterSaved = await page.evaluate(keys => keys.map(k => localStorage.getItem(k)), protectedKeys);
    assert.deepEqual(afterSaved, beforeSaved, 'Text translation, notes and independent IndoPak state remain unchanged');
    clean(own); return result;
  } catch (error) {
    await page.screenshot({ path: path.join(output, 'live-player-failure.png') }).catch(() => {});
    fs.writeFileSync(path.join(output, 'live-player-failure.json'), JSON.stringify({ message: error.message, result, media: await stateOfMedia(page), settings: await saved(page) }, null, 2)); throw error;
  } finally { await context.close(); }
}
async function centerScenario(browser) {
  const own = await make(browser, { enabled: true, kind: 'translation' }), { page, context } = own;
  try {
    await click(page.getByTestId('audio-player-play-pause'));
    const first = await playing(page, 'en.walk');
    await click(page.getByTestId('audio-translation-picker'));
    await click(page.getByRole('button', { name: 'All translations', exact: true }));
    await click(page.getByText('Translation', { exact: true }).last());
    await page.getByTestId('audio-center-translation-ur.khan').waitFor();
    await click(page.getByTestId('audio-center-translation-ur.khan'));
    const switched = await playing(page, 'ur.khan');
    await click(page.getByTestId('audio-center-translation-toggle'));
    const arabic = await playing(page, 'ar.alafasy', 263);
    assert.equal((await saved(page)).translationAudioEnabled, false);
    clean(own); return { name: 'shared-audio-center-controls', first, switched, arabic, errors: own.errors };
  } finally { await context.close(); }
}
async function catalogueScenario(browser) {
  const own = await make(browser, { enabled: true, kind: 'translation' }), { page, context } = own;
  const observations = [];
  try {
    await click(page.getByTestId('audio-player-play-pause'));
    await playing(page, 'en.walk');
    for (const edition of editions) {
      await pick(page, edition.identifier);
      const heard = await playing(page, edition.identifier);
      assert.ok(heard.position < 5, 'A different-language recording starts over, not at the old voice\'s second offset');
      assert.ok((await page.getByTestId('audio-player-track-title').textContent()).includes('255'));
      assert.equal(await page.getByTestId('audio-player-source').textContent(), edition.englishName);
      assert.equal((await stateOfMedia(page)).media.filter(a => a.uri && !a.paused).length, 1, 'Only the selected voice can be playing');
      observations.push({ edition: edition.identifier, ...heard });
    }
    clean(own); return { name: 'all-eleven-real-recordings', observations, errors: own.errors };
  } finally { await context.close(); }
}
async function offlineScenario(browser) {
  const own = await make(browser, { enabled: true, kind: 'translation' }), { page, context } = own;
  try {
    await click(page.getByTestId('audio-player-play-pause'));
    await playing(page, 'en.walk');
    await context.setOffline(true);
    await pick(page, 'ur.khan');
    await page.getByTestId('audio-player-error').waitFor({ timeout: 20000 });
    assert.equal(await page.getByTestId('audio-player-error').textContent(), audioPlayerText('en', 'unavailable'));
    const plays = (await stateOfMedia(page)).plays.length;
    await page.waitForTimeout(1800);
    assert.equal((await stateOfMedia(page)).plays.length, plays, 'A failed recording does not enter the interruption-resume loop');
    assert.ok(!(await stateOfMedia(page)).media.some(a => a.uri.endsWith(suffix('en.walk')) && !a.paused), 'The old language does not keep playing on failure');
    await context.setOffline(false);
    await click(page.getByTestId('audio-player-play-pause'));
    const retried = await playing(page, 'ur.khan');
    await page.getByTestId('audio-player-error').waitFor({ state: 'detached' });
    assert.deepEqual(own.errors.page, []);
    assert.deepEqual(own.errors.http, []);
    assert.deepEqual(own.errors.requests, []);
    assert.ok(own.errors.expectedOffline.length > 0);
    // Chromium logs the intentionally denied MP3 as a resource failure.
    assert.ok(own.errors.console.every(e => /ERR_INTERNET_DISCONNECTED/.test(e)), own.errors.console.join('\n'));
    return { name: 'explicit-offline-failure-and-user-retry', retried, errors: own.errors };
  } finally { await context.close(); }
}
async function localizedScenario(browser, language, width = 280, height = 660, dark = false) {
  const own = await make(browser, { language, width, height, dark, tiny: true }), { page, context } = own;
  try {
    const toggle = page.getByTestId('audio-translation-toggle');
    assert.equal(await toggle.getAttribute('aria-label'), tx(language, 'Translation audio'));
    assert.equal(await page.getByTestId('audio-translation-status').textContent(), tx(language, 'Off'));
    const labels = [await fullLabel(toggle), await fullLabel(page.getByTestId('audio-translation-picker'))];
    await click(page.getByTestId('audio-translation-picker'));
    await page.getByTestId(`audio-translation-${editions.at(-1).identifier}`).waitFor();
    for (const edition of editions) {
      const row = page.getByTestId(`audio-translation-${edition.identifier}`);
      const text = await fullLabel(row);
      assert.equal(text[0].text, audioPlayerLanguage(language, edition.language), 'The language name is localized separately from its performer');
      labels.push(text);
      const r = await row.boundingBox(); assert.ok(r.height >= 44, 'Each full-label voice choice is touch-sized');
    }
    assert.equal(await page.getByTestId('audio-translation-options').getByRole('radio').count(), editions.length, 'All real voices, including Urdu, not only the first eight');
    await click(page.getByTestId('audio-translation-ur.khan'));
    assert.equal((await saved(page)).translationAudioEnabled, false);
    assert.equal((await saved(page)).translationEdition, 'ur.khan');
    await page.getByTestId('audio-translation-picker').evaluate(e => e.scrollIntoView({ block: 'center' }));
    if (['en','ar','ur','ml','si'].includes(language) || width < 280) await page.screenshot({ path: path.join(output, `player-${language}-${width}x${height}${dark ? '-dark' : ''}.png`), animations: 'disabled' });
    clean(own); return { language, width, height, dark, choices: editions.length, labels, errors: own.errors };
  } finally { await context.close(); }
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const report = { method: 'Real Expo production WEB, actual streamed MP3 playback and advancing media clocks. Native engine-contract tests are separate, not installed-device QA. Offline mode is an explicitly simulated network failure, not mocked successful audio.', url: base, results: [] };
  try {
    const only = process.env.AUDIO_TRANSLATION_ONLY;
    if (!only || only === 'live') { report.results.push(await mainScenario(browser)); console.log('Live player: immediate same-ayah voice change, Arabic continuity, rapid selections, pause, on/off and paused reload passed'); }
    if (!only || only === 'center') { report.results.push(await centerScenario(browser)); console.log('Audio center: its shared language/on-off controls also update the live transport'); }
    if (!only || only === 'catalogue') { report.results.push(await catalogueScenario(browser)); console.log('All eleven real recording URLs play and advance after live voice changes'); }
    if (!only || only === 'offline') { report.results.push(await offlineScenario(browser)); console.log('Explicit offline test: old voice stops, failure shown, no auto-resume loop, user retry works'); }
    if (!only || only === 'layout') {
      for (const language of languages) { report.results.push(await localizedScenario(browser, language)); console.log(`Full-label player controls and ${editions.length} real voices: ${language}/280px passed`); }
      for (const profile of [['en',240,600,false],['ar',330,700,true],['en',844,280,false],['ml',600,320,true]]) report.results.push(await localizedScenario(browser, ...profile));
    }
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
