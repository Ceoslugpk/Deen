const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 320, height: 800 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click());
  await page.waitForTimeout(2800);
  const scan = () => page.evaluate(() => {
    const out = [];
    document.querySelectorAll('div').forEach((n) => {
      const cs = getComputedStyle(n);
      if (cs.whiteSpace !== 'nowrap' || cs.overflow === 'visible') return;
      const r = n.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (n.scrollWidth > n.clientWidth + 2) out.push({ text: (n.textContent || '').trim().slice(0, 30), w: Math.round(r.width), client: n.clientWidth, scroll: n.scrollWidth, font: cs.fontSize, display: cs.display, cls: (n.className || '').toString().slice(0, 22) });
    });
    return out;
  });
  for (const tab of ['Home', 'Quran', 'Library']) {
    await page.locator(`[role="button"][aria-label="${tab}"]`).first().click();
    await page.waitForTimeout(2000);
    console.log(tab, JSON.stringify(await scan()));
  }
  await b.close();
})();
