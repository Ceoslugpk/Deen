/** Running production WEB, real consolidated controls and original bundled pages.
 * Browser text enlargement/insets are explicit fixtures, not native OS font-scale/navigation-mode QA.
 * INDOPAK_URL=http://127.0.0.1:8109 node tests/verify-indopak-navigation-web.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { makePage, box, pause, gotoPage, expectPage, openDirectory, fullLabel, insets } = require('./verify-indopak-web.cjs');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader(), meta = require('../src/data/indopak16/meta.json'), model = load('src/services/indopakMushaf.ts');
const copy = load('src/services/indopakCopy.ts');
const output = process.env.INDOPAK_NAV_ARTIFACTS_DIR || '/tmp/islamic-r102-navigation';
const key = '@deen/quran/indopak-taj-16/state/v1';
const oldKeys = ['@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1'];
const raw = page => page.evaluate(k => localStorage.getItem(k), key);
const inside = (a, b, label) => assert.ok(a.x >= b.x - 1 && a.right <= b.right + 1 && a.y >= b.y - 1 && a.bottom <= b.bottom + 1, `${label}: ${JSON.stringify({ a, b })}`);
async function top(page) {
  const parent = await box(page.getByTestId('indopak-top-controls')), safe = await box(page.getByTestId('system-safe-content').first()); inside(parent, safe, 'top controls');
  for (const old of ['indopak-surah', 'indopak-juz', 'indopak-verse-list']) assert.equal(await page.getByTestId(old).count(), 0);
  const buttons = [];
  for (const id of ['indopak-page-select', 'indopak-go-to', 'indopak-save-page', 'indopak-focus', 'indopak-sources']) {
    const control = page.getByTestId(id), r = await box(control); inside(r, parent, id); assert.ok(r.width >= 43.9 && r.height >= 43.9);
    for (const before of buttons) assert.ok(r.x >= before.right - 1 || r.right <= before.x + 1 || r.y >= before.bottom - 1 || r.bottom <= before.y + 1, 'Top controls do not overlap');
    const text = await fullLabel(control); if (id === 'indopak-go-to') assert.equal(text.length, 1, 'Go to remains visibly labelled even at 240px');
    buttons.push({ id, ...r, text });
  }
  return { parent, safe, buttons };
}
async function picker(page, kind, language = 'en') {
  const panel = page.getByTestId('indopak-navigator'); await panel.waitFor(); await pause(page);
  const rect = await box(panel), viewport = page.viewportSize(); inside(rect, { x: 0, y: 0, right: viewport.width, bottom: viewport.height }, 'picker');
  const close = await box(page.getByTestId('indopak-navigator-close')); inside(close, rect, 'Close stays independently visible'); assert.ok(close.height >= 44);
  assert.equal(await page.getByTestId('indopak-navigator-title').textContent(), copy.indopakText(language, 'goTo'));
  assert.equal(await panel.getByRole('tab').count(), 3); assert.equal(await panel.getByRole('tab', { selected: true }).count(), 1);
  assert.equal(await page.getByTestId(`indopak-tab-${kind}`).getAttribute('aria-selected'), 'true');
  const tabs = [];
  for (const value of ['surah', 'juz', 'verse']) {
    const tab = page.getByTestId(`indopak-tab-${value}`); await tab.scrollIntoViewIfNeeded();
    const r = await box(tab); inside(r, rect, `${value} tab`); assert.ok(r.width >= 43.9 && r.height >= 43.9);
    tabs.push({ value, ...r, text: await fullLabel(tab) });
  }
  if (kind === 'verse') assert.ok((await page.getByTestId('indopak-verse-page').textContent()).includes('274 / 548'), 'Verse remains the current-page list, clearly identified');
  return { rect, close, tabs };
}
async function selectTab(page, kind) { await page.getByTestId(`indopak-tab-${kind}`).click(); await pause(page); }
(async () => {
  fs.mkdirSync(output, { recursive: true }); const browser = await chromium.launch();
  const report = { method: 'Production WEB, real buttons/tabs/searches/storage and original Quran paths. Explicit browser inset/text-size fixtures; not native-device QA.', checks: {}, profiles: [], localized: [], insets: [], enlargedText: [], errors: [] }; let active;
  try {
    const own = await makePage(browser), { page } = own; active = page; report.errors.push(own.errors);
    await gotoPage(page, 274); const original = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys), before = await raw(page);
    await page.evaluate(() => { window.__directoryInk = [...document.querySelectorAll('[data-testid^="indopak-ink-"]')]; });
    await top(page); await openDirectory(page, 'surah'); await picker(page, 'surah');
    await page.getByTestId('indopak-directory-search').fill('55'); await page.getByTestId('indopak-jump-surah-55').waitFor();
    await selectTab(page, 'juz'); assert.equal(await page.getByTestId('indopak-directory-search').inputValue(), '', 'Search text does not leak into a different directory');
    await page.getByTestId('indopak-directory-search').fill('30'); await page.getByTestId('indopak-jump-juz-30').waitFor();
    await selectTab(page, 'verse'); assert.equal(await page.getByTestId('indopak-directory-search').inputValue(), ''); await picker(page, 'verse');
    await page.getByTestId('indopak-navigator-close').click(); await page.getByTestId('indopak-go-to').click();
    assert.equal(await page.getByTestId('indopak-tab-verse').getAttribute('aria-selected'), 'true', 'Go to remembers its last tab for this screen session only');
    await page.keyboard.press('Escape'); await page.getByTestId('indopak-navigator').waitFor({ state: 'detached' });
    assert.equal(await raw(page), before, 'Opening/switching/searching/cancelling is not a stored reading action');
    assert.equal(await page.evaluate(() => window.__directoryInk.every(n => n.isConnected)), true, 'Modal navigation leaves original scripture nodes alone');
    report.checks.oneEntryThreeTabsSearchResetAndTemporaryMemory = true;
    await page.getByTestId('indopak-go-to').focus(); await page.keyboard.press('Enter');
    await page.getByTestId('indopak-tab-verse').waitFor(); await pause(page);
    assert.equal(await page.getByTestId('indopak-tab-verse').evaluate(e => e === document.activeElement), true);
    for (const [key, kind] of [['Home', 'surah'], ['ArrowRight', 'juz'], ['ArrowRight', 'verse'], ['ArrowRight', 'surah'], ['End', 'verse'], ['ArrowUp', 'juz'], ['ArrowDown', 'verse']]) {
      await page.keyboard.press(key); await pause(page); assert.equal(await page.getByTestId(`indopak-tab-${kind}`).getAttribute('aria-selected'), 'true');
      assert.equal(await page.getByTestId(`indopak-tab-${kind}`).evaluate(e => e === document.activeElement), true);
    }
    await page.keyboard.press('Escape'); await page.getByTestId('indopak-navigator').waitFor({ state: 'detached' }); report.checks.keyboardTabsAndEscape = true;
    await openDirectory(page, 'surah'); await page.getByTestId('indopak-directory-search').fill('55'); await page.getByTestId('indopak-jump-surah-55').click(); await expectPage(page, meta.chapters[54].page);
    await openDirectory(page, 'juz'); await page.getByTestId('indopak-directory-search').fill('30'); await page.getByTestId('indopak-jump-juz-30').click(); await expectPage(page, meta.juz[29].page);
    await gotoPage(page, 274); await openDirectory(page, 'verse');
    const verses = [...new Set(model.indopakPage(274).words.map(model.indopakVerseKey))];
    assert.deepEqual(await page.locator('[data-testid^="indopak-jump-verse-"]').evaluateAll(items => items.map(e => e.getAttribute('data-testid').replace('indopak-jump-verse-', ''))), verses);
    const verse = verses.at(-1); await page.getByTestId(`indopak-jump-verse-${verse}`).click(); await page.getByTestId('indopak-ayah-popover').waitFor();
    assert.ok((await page.getByTestId('indopak-ayah-popover').getAttribute('aria-label')).endsWith(verse)); await page.keyboard.press('Escape'); report.checks.canonicalSurahJuzAndCurrentPageVerseActions = true;
    await page.getByTestId('indopak-save-page').click(); await page.getByTestId('indopak-page-select').click();
    assert.equal(await page.getByTestId('indopak-navigator').getByRole('tab').count(), 2);
    await page.getByTestId('indopak-tab-bookmarks').click(); await page.getByTestId('indopak-jump-bookmarks-274').click(); await expectPage(page, 274);
    report.checks.pageCounterAndBookmarksStillSeparate = true;
    for (const [name, width, height] of [['compact', 240, 640], ['cover', 280, 720], ['small', 320, 568], ['breakpoint', 330, 568], ['phone', 390, 844],
      ['landscape', 844, 390], ['short-landscape', 844, 268], ['keyboard-height-fixture', 390, 320], ['tablet', 800, 1280], ['tablet-landscape', 1280, 800], ['desktop', 1440, 900]]) {
      await page.setViewportSize({ width, height }); await pause(page); const normal = await top(page); await openDirectory(page, 'surah');
      const directory = await picker(page, 'surah'); report.profiles.push({ name, width, height, normal, directory });
      await page.screenshot({ path: path.join(output, `${name}-go-to.png`) });
      if (height <= 320) {
        const first = page.getByTestId('indopak-jump-surah-1'); await first.scrollIntoViewIfNeeded();
        inside(await box(first), await box(page.getByTestId('indopak-directory-list')), 'A directory row remains fully reachable by scrolling a short/keyboard-height pane');
        await first.click(); await expectPage(page, 1); await gotoPage(page, 274); report.checks.shortViewportListsAndPageEntry = true;
      } else await page.getByTestId('indopak-navigator-close').click();
      await page.screenshot({ path: path.join(output, `${name}-controls.png`) });
    }
    for (const [name, viewport, values] of [['gestures', { width: 390, height: 844 }, { top: 24, bottom: 24 }], ['three-buttons', { width: 390, height: 844 }, { top: 24, bottom: 48 }],
      ['large-keys', { width: 280, height: 720 }, { top: 30, bottom: 64 }], ['right-keys', { width: 844, height: 390 }, { top: 24, right: 48 }], ['left-keys', { width: 844, height: 390 }, { top: 24, left: 48 }]]) {
      await page.setViewportSize(viewport); await insets(page, values); const normal = await top(page); await openDirectory(page, 'juz');
      report.insets.push({ name, normal, directory: await picker(page, 'juz') }); await page.getByTestId('indopak-navigator-close').click();
    }
    await insets(page, {}); await page.setViewportSize({ width: 390, height: 844 });
    const enlarged = await page.addStyleTag({ content: '[data-testid="indopak-go-to"] [dir], [data-testid="indopak-focus"] [dir], [data-testid^="indopak-tab-"] [dir] { font-size:24px!important;line-height:34px!important; }' });
    for (const viewport of [{ width: 240, height: 640 }, { width: 390, height: 320 }]) {
      await page.setViewportSize(viewport); const normal = await top(page); await openDirectory(page, 'verse'); report.enlargedText.push({ viewport, normal, directory: await picker(page, 'verse') });
      await page.getByTestId('indopak-navigator-close').click();
    }
    await enlarged.evaluate(e => e.remove()); assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), oldKeys), original);
    report.checks.existingReaderDataUnchanged = true; await own.context.close();
    for (const language of ['en', 'ar', 'ur', 'fa', 'ps', 'fr', 'tr', 'ru', 'uz', 'kk', 'zh', 'vi', 'az', 'bs', 'bg', 'si', 'bn', 'hi', 'id', 'ms', 'ta', 'ml']) {
      const local = await makePage(browser, language, ['en', 'ur'].includes(language)); active = local.page; report.errors.push(local.errors); await gotoPage(local.page, 274);
      const untouched = await raw(local.page);
      for (const width of [240, 280, 390]) {
        await local.page.setViewportSize({ width, height: 720 }); const normal = await top(local.page); assert.equal(await local.page.getByTestId('indopak-go-to').textContent(), copy.indopakText(language, 'goTo'));
        await openDirectory(local.page, 'surah'); const directory = await picker(local.page, 'surah', language);
        await selectTab(local.page, 'juz'); await fullLabel(local.page.getByTestId('indopak-tab-juz'));
        await selectTab(local.page, 'verse'); await fullLabel(local.page.getByTestId('indopak-tab-verse'));
        report.localized.push({ language, width, normal, directory });
        if (width === 390 && ['en', 'ur', 'ta', 'ml', 'si'].includes(language)) await local.page.screenshot({ path: path.join(output, `${language}-go-to.png`) });
        await local.page.getByTestId('indopak-navigator-close').click();
      }
      assert.equal(await raw(local.page), untouched);
      if (language === 'ur') {
        await openDirectory(local.page, 'surah'); await pause(local.page); await local.page.keyboard.press('ArrowLeft'); await pause(local.page);
        assert.equal(await local.page.getByTestId('indopak-tab-juz').getAttribute('aria-selected'), 'true', 'RTL physical arrows match tab placement');
        await local.page.keyboard.press('Home'); await pause(local.page); assert.equal(await local.page.getByTestId('indopak-tab-surah').getAttribute('aria-selected'), 'true'); report.checks.rtlKeyboardOrder = true;
      }
      await local.context.close();
    }
    for (const errors of report.errors) for (const [kind, values] of Object.entries(errors)) assert.deepEqual(values, [], `${kind} errors`);
    console.log(JSON.stringify({ checks: report.checks, profiles: report.profiles.length, localized: report.localized.length, insets: report.insets.length, enlargedText: report.enlargedText.length, errorFreeContexts: report.errors.length }, null, 2));
  } catch (error) { report.failure = error.stack || String(error); if (active && !active.isClosed()) await active.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {}); throw error; }
  finally { fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
