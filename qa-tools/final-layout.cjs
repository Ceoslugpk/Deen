const { chromium } = require('playwright');
const issues = (page) => page.evaluate(() => {
  const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
  const clipped = [];
  document.querySelectorAll('div').forEach((n) => {
    const cs = getComputedStyle(n);
    if (cs.whiteSpace !== 'nowrap' || cs.overflow === 'visible') return;
    const r = n.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (n.scrollWidth > n.clientWidth + 2) clipped.push((n.textContent || '').trim().slice(0, 26));
  });
  return { overflow, clipped: clipped.slice(0, 3) };
});
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3200);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click());
  await page.waitForTimeout(2800);
  const out = {};
  // title -> intro rhythm on a data screen
  await page.locator('[role="button"][aria-label="Tools"]').first().click(); await page.waitForTimeout(1500);
  await page.getByText('Rite-by-rite journeys', { exact: false }).first().evaluate((n) => n.click());
  await page.waitForTimeout(2400);
  out.titleToIntro = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div')).filter((n) => n.children.length === 0 && (n.textContent || '').trim());
    const title = nodes.filter((n) => /^Umrah and Hajj$/.test((n.textContent || '').trim())).sort((a, b) => parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))[0];
    const intro = nodes.find((n) => /A private checklist/.test(n.textContent || ''));
    if (!title || !intro) return null;
    return { gap: Math.round(intro.getBoundingClientRect().top - title.getBoundingClientRect().bottom), titleSize: getComputedStyle(title).fontSize, introSize: getComputedStyle(intro).fontSize };
  });
  // all widths, LTR
  out.ltr = {};
  for (const w of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 900 });
    const per = [];
    for (const tab of ['Home', 'Quran', 'Library', 'Tools', 'Settings']) {
      await page.locator(`[role="button"][aria-label="${tab}"]`).first().click();
      await page.waitForTimeout(1400);
      per.push(`${tab}:${JSON.stringify(await issues(page))}`);
    }
    out.ltr[w] = per;
  }
  // RTL over the same tabs
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[role="button"][aria-label="Settings"]').first().click(); await page.waitForTimeout(1600);
  await page.locator('[role="switch"]').last().evaluate((n) => n.click()); await page.waitForTimeout(2600);
  out.rtl = {};
  for (const w of [320, 768]) {
    await page.setViewportSize({ width: w, height: 900 });
    const per = [];
    for (let i = 0; i < 5; i++) {
      await page.evaluate((k) => { const list = Array.from(document.querySelectorAll('[role="button"]')).filter((n) => n.getBoundingClientRect().top > window.innerHeight - 140); list[list.length - 5 + k].click(); }, i);
      await page.waitForTimeout(1500);
      per.push(`${['Home', 'Quran', 'Library', 'Tools', 'Settings'][i]}:${JSON.stringify(await issues(page))}`);
    }
    out.rtl[w] = per;
  }
  console.log(JSON.stringify({ ...out, errors: errors.slice(0, 5) }, null, 1));
  await b.close();
})().catch((e) => { console.error('FAILED', String(e).slice(0, 300)); process.exit(1); });
