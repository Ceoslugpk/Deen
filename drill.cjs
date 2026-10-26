const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click());
  await page.waitForTimeout(3000);
  const seen = async () => page.evaluate(() => {
    const out = new Set();
    for (let y = 90; y < window.innerHeight - 130; y += 24) for (let x = 10; x < window.innerWidth - 10; x += 24) {
      const el = document.elementFromPoint(x, y); if (!el) continue;
      let n = el; while (n && !n.textContent) n = n.parentElement;
      if (n) { const t = (n.textContent || '').trim().slice(0, 40); if (t) out.add(t); }
    }
    return Array.from(out).slice(0, 6).join(' | ');
  });
  const back = async () => { const l = page.locator('[aria-label="Go back"]').first(); if (await l.count()) { await l.evaluate((n) => n.click()); await page.waitForTimeout(1400); return true; } return false; };
  const rows = [];
  const open = async (label) => {
    const el = page.getByText(label, { exact: false }).first();
    if (!(await el.count())) { rows.push(`${label}: NOT FOUND`); return; }
    await el.evaluate((n) => n.click());
    await page.waitForTimeout(2600);
    const backCount = await page.locator('[aria-label="Go back"]').count();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    rows.push(`${label}: back=${backCount} overflow=${overflow} :: ${(await seen()).slice(0, 90)}`);
    await back();
  };
  // Tools sub-screens
  await page.locator('[role="button"][aria-label="Tools"]').first().click(); await page.waitForTimeout(1600);
  for (const l of ['Prayer times', 'Face the Kaaba', 'Which call plays', 'Reminders for each prayer', 'Choose a city', 'Dates, months', 'Suhoor and Iftar', 'Your fasts, missed days', 'Seven days of worship', 'A quiet counter', 'Work out what is due', 'Prayer spaces around you', 'Step-by-step references']) await open(l);
  // Library
  await page.locator('[role="button"][aria-label="Library"]').first().click(); await page.waitForTimeout(1600);
  for (const l of ['Daily remembrance', 'The Beautiful Names', 'Hadith']) await open(l);
  console.log(JSON.stringify({ rows, errors: errors.slice(0, 6) }, null, 1));
  await b.close();
})();
