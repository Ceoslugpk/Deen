const { chromium } = require('playwright');
const URL = process.env.APP_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await context.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);
  const loaded = await page.evaluate(() => ({
    hafs: document.fonts.check('20px KFGQPCUthmanicHafs'),
    plex: document.fonts.check('16px IBMPlexSansArabic_400Regular'),
    naskh: document.fonts.check('20px NotoNaskhArabic_400Regular'),
    families: Array.from(document.fonts).map((f) => `${f.family}:${f.status}`).slice(0, 14),
  }));
  // open a Surah and measure the Arabic font in use
  await page.locator('[role="tab"]').nth(2).click();
  await page.waitForTimeout(2000);
  await page.getByText('Start reading', { exact: false }).last().evaluate((n) => n.click());
  await page.waitForTimeout(6000);
  const ayah = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const arabic = nodes.filter((n) => /[\u0600-\u06ff]/.test(n.textContent || '') && n.children.length === 0 && (n.textContent || '').length > 25);
    const node = arabic.sort((a, b) => b.textContent.length - a.textContent.length)[0];
    if (!node) return null;
    const cs = getComputedStyle(node);
    return { fontFamily: cs.fontFamily, fontSize: cs.fontSize, sample: node.textContent.slice(0, 34) };
  });
  // switch to Scheherazade in Reading settings
  await page.locator('[aria-label="Reader settings"]').click();
  await page.waitForTimeout(2500);
  await page.getByText('Scheherazade New', { exact: true }).last().evaluate((n) => n.click());
  await page.waitForTimeout(4000);
  const afterSwitch = await page.evaluate(() => ({
    scheherazade: document.fonts.check('20px ScheherazadeNew-Regular'),
    previewFont: (() => { const nodes = Array.from(document.querySelectorAll('div')).filter((n) => (n.textContent || '').includes('بِسْمِ')); const n = nodes[nodes.length - 1]; return n ? getComputedStyle(n).fontFamily : null; })(),
  }));
  await page.goBack();
  await page.waitForTimeout(3000);
  const ayah2 = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const arabic = nodes.filter((n) => /[\u0600-\u06ff]/.test(n.textContent || '') && n.children.length === 0 && (n.textContent || '').length > 25);
    const node = arabic.sort((a, b) => b.textContent.length - a.textContent.length)[0];
    return node ? { fontFamily: getComputedStyle(node).fontFamily } : null;
  });
  console.log(JSON.stringify({ loaded, ayah, afterSwitch, ayahAfterSwitch: ayah2, errors: errors.slice(0, 5) }, null, 1));
  await browser.close();
})().catch((e) => { console.error('FAILED', String(e).slice(0, 400)); process.exit(1); });
