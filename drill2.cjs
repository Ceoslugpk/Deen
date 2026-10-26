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
      if (n) { const t = (n.textContent || '').trim().slice(0, 38); if (t) out.add(t); }
    }
    return Array.from(out).slice(0, 4).join(' | ');
  });
  const back = async () => { const l = page.locator('[aria-label="Go back"]').first(); if (await l.count()) { await l.evaluate((n) => n.click()); await page.waitForTimeout(1400); return true; } return false; };
  const rows = [];
  // Tools root header
  await page.locator('[role="button"][aria-label="Tools"]').first().click(); await page.waitForTimeout(1800);
  rows.push('Tools root: back=' + (await page.locator('[aria-label="Go back"]').count()) + ' :: ' + (await seen()));
  for (const l of ['Prayer times', 'Your fasts, missed days']) await (async () => {
    const el = page.getByText(l, { exact: false }).first();
    await el.evaluate((n) => n.click()); await page.waitForTimeout(2500);
    rows.push(`${l}: back=${await page.locator('[aria-label="Go back"]').count()} :: ${(await seen()).slice(0, 70)}`);
    await back();
  })();
  // Library drill
  await page.locator('[role="button"][aria-label="Library"]').first().click(); await page.waitForTimeout(1800);
  rows.push('Library root: back=' + (await page.locator('[aria-label="Go back"]').count()) + ' :: ' + (await seen()));
  for (const l of ['Daily remembrance', 'The Beautiful Names', 'Hadith collections', 'Learn with references']) await (async () => {
    const el = page.getByText(l, { exact: false }).first();
    if (!(await el.count())) { rows.push(l + ': NOT FOUND'); return; }
    await el.evaluate((n) => n.click()); await page.waitForTimeout(2500);
    rows.push(`${l}: back=${await page.locator('[aria-label="Go back"]').count()} :: ${(await seen()).slice(0, 60)}`);
    await back(); await page.locator('[role="button"][aria-label="Library"]').first().click(); await page.waitForTimeout(1200);
  })();
  console.log(JSON.stringify({ rows, errors: errors.slice(0, 5) }, null, 1));
  await b.close();
})();
