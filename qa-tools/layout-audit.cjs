const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:4175';
const issues = (page) => page.evaluate(() => {
  const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
  const clipped = [];
  document.querySelectorAll('div').forEach((n) => {
    const cs = getComputedStyle(n);
    if (cs.whiteSpace !== 'nowrap' || cs.overflow === 'visible') return;
    const r = n.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (n.scrollWidth > n.clientWidth + 2) clipped.push((n.textContent || '').trim().slice(0, 28));
  });
  return { overflow, clipped: clipped.slice(0, 4) };
});
const smallTargets = (page) => page.evaluate(() => {
  const out = [];
  document.querySelectorAll('[role="button"],[role="checkbox"],[role="tab"],[role="switch"]').forEach((n) => {
    const r = n.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (r.height < 44 || r.width < 44) out.push({ l: (n.getAttribute('aria-label') || '').slice(0, 26) || (n.textContent || '').trim().slice(0, 22), w: Math.round(r.width), h: Math.round(r.height) });
  });
  return out.slice(0, 10);
});
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3200);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click());
  await page.waitForTimeout(3000);
  const out = { tabs: {}, targets: {} };
  for (const tab of ['Home', 'Quran', 'Library', 'Tools', 'Settings']) {
    await page.locator(`[role="button"][aria-label="${tab}"]`).first().click();
    await page.waitForTimeout(1700);
    out.tabs[tab] = await issues(page);
    out.targets[tab] = await smallTargets(page);
  }
  out.widths = {};
  for (const w of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 900 });
    const per = [];
    for (const tab of ['Home', 'Quran', 'Library', 'Tools', 'Settings']) {
      await page.locator(`[role="button"][aria-label="${tab}"]`).first().click();
      await page.waitForTimeout(1400);
      per.push(`${tab}:${JSON.stringify(await issues(page))}`);
    }
    out.widths[w] = per;
  }
  // title -> intro spacing on a data screen
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[role="button"][aria-label="Tools"]').first().click(); await page.waitForTimeout(1600);
  await page.getByText('Rite-by-rite journeys', { exact: false }).first().evaluate((n) => n.click());
  await page.waitForTimeout(2200);
  out.titleGap = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div')).filter((n) => n.children.length === 0 && (n.textContent || '').trim());
    const title = nodes.find((n) => (n.textContent || '').trim() === 'Umrah and Hajj' || /Umrah and Hajj/.test(n.textContent || ''));
    const intro = nodes.find((n) => /A private checklist/.test(n.textContent || ''));
    if (!title || !intro) return null;
    return Math.round(intro.getBoundingClientRect().top - title.getBoundingClientRect().bottom);
  });
  console.log(JSON.stringify({ ...out, errors: errors.slice(0, 5) }, null, 1));
  await b.close();
})().catch((e) => { console.error('FAILED', String(e).slice(0, 300)); process.exit(1); });
