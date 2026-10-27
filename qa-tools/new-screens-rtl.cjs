// Arabic (RTL) sweep over the Phase-4 women's and Zakat screens.
// Usage: node qa-tools/new-screens-rtl.cjs
const { chromium } = require('playwright');

const HELPERS = `window.__act = (re) => Array.from(document.querySelectorAll('div,span')).filter(n=>{
  if (n.children.length) return false; if (n.closest('[aria-hidden="true"]')) return false;
  const t=(n.textContent||'').trim().replace(/\\s+/g,' '); if(!t) return false;
  const r=n.getBoundingClientRect(); return r.width>=1&&r.height>=1&&re.test(t); });
window.__box=(src)=>{const n=window.__act(new RegExp(src))[0]; if(!n) return null; n.scrollIntoView({block:'center'}); const r=n.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};};
window.__issues = () => {
  const clipped = [];
  document.querySelectorAll('div').forEach((n) => {
    const cs = getComputedStyle(n);
    if (cs.whiteSpace !== 'nowrap' || cs.overflow === 'visible') return;
    const r = n.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (n.querySelector('input')) return;
    if (n.scrollWidth > n.clientWidth + 2) clipped.push((n.textContent || '').trim().slice(0, 26));
  });
  const small = [];
  Array.from(document.querySelectorAll('div')).forEach((n) => {
    if (n.closest('[aria-hidden="true"]')) return;
    if (getComputedStyle(n).cursor !== 'pointer') return;
    if (n.parentElement && getComputedStyle(n.parentElement).cursor === 'pointer') return;
    const r = n.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    if (r.width < 44 || r.height < 44) small.push({ t: (n.textContent || '').trim().slice(0, 18), w: Math.round(r.width), h: Math.round(r.height) });
  });
  return { overflow: document.documentElement.scrollWidth > window.innerWidth + 1, clipped: clipped.slice(0, 3), small: small.slice(0, 3), dir: document.documentElement.dir };
};`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 120)); });
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3000);
  await page.evaluate(HELPERS);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  // opt in and switch the interface to Arabic
  await page.locator('[role="button"][aria-label="Settings"]').first().click();
  await page.waitForTimeout(1600);
  await page.evaluate(() => {
    const women = Array.from(document.querySelectorAll('[role="switch"]')).find((n) => n.getAttribute('aria-label') === 'Women’s worship');
    if (women) women.click();
  });
  await page.waitForTimeout(1200);
  await page.locator('[role="switch"][aria-label="Arabic interface"]').first().evaluate((n) => n.click());
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  const out = {};
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(800);
    const rows = {};
    // in Arabic the floating menu labels are Arabic too, so click the bar by position
    const tab = async (name) => {
      const index = { Home: 0, Quran: 1, Library: 2, Tools: 3, Settings: 4 }[name];
      await page.evaluate((k) => {
        const list = Array.from(document.querySelectorAll('[role="button"]')).filter((n) => n.getBoundingClientRect().top > window.innerHeight - 140);
        const target = list[list.length - 5 + k];
        if (target) target.click();
      }, index);
      await page.waitForTimeout(1600);
      await page.evaluate(HELPERS);
    };
    const tap = async (src) => { const box = await page.evaluate((s) => window.__box(s), src); if (!box) return false; await page.waitForTimeout(150); const again = await page.evaluate((s) => window.__box(s), src); if (!again) return false; await page.mouse.click(again.x, again.y); await page.waitForTimeout(1800); await page.evaluate(HELPERS); return true; };
    const back = async () => { await page.evaluate(() => { const list = Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n) => !n.closest('[aria-hidden="true"]') && n.getBoundingClientRect().width > 0); const t = list[list.length - 1]; if (t) t.click(); }); await page.waitForTimeout(1600); await page.evaluate(HELPERS); };

    await tab('Tools');
    if (await tap('^Women’s worship$')) {
      rows.hub = await page.evaluate(() => window.__issues());
      if (await tap('^Cycle$')) { rows.cycle = await page.evaluate(() => window.__issues()); await back(); }
      await page.evaluate(HELPERS);
      if (await tap('^Purity and ghusl$')) { await page.waitForTimeout(1800); await page.evaluate(HELPERS); rows.purity = await page.evaluate(() => window.__issues()); await back(); }
      await page.evaluate(HELPERS);
      if (await tap('^Qada fasts$')) { rows.qada = await page.evaluate(() => window.__issues()); await back(); }
      await page.evaluate(HELPERS);
      if (await tap('^Add a PIN$|^Lock and PIN$')) { rows.lock = await page.evaluate(() => window.__issues()); await back(); }
      await back();
    }
    await tab('Tools');
    if (await tap('^Zakat$')) { await page.waitForTimeout(2000); await page.evaluate(HELPERS); rows.zakat = await page.evaluate(() => window.__issues()); }
    out[width] = rows;
  }
  out.errors = [...new Set(errors)].slice(0, 5);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
