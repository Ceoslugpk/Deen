// Women's area + Zakat functional check.
// Usage: node qa-tools/women-zakat-check.cjs
const { chromium } = require('playwright');

const HELPERS = `window.__act = (re) => Array.from(document.querySelectorAll('div,span')).filter(n=>{
  if (n.children.length) return false;
  if (n.closest('[aria-hidden="true"]')) return false;
  const t=(n.textContent||'').trim().replace(/\\s+/g,' ');
  if (!t) return false;
  const r=n.getBoundingClientRect();
  return r.width>=1 && r.height>=1 && re.test(t);
});
window.__box = (src) => { const n=window.__act(new RegExp(src))[0]; if(!n) return null;
  n.scrollIntoView({block:'center'}); const r=n.getBoundingClientRect();
  return {x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2), t:(n.textContent||'').trim().replace(/\\s+/g,' ').slice(0,40)}; };
window.__text = () => Array.from(document.querySelectorAll('div,span')).filter(n=>!n.children.length && !n.closest('[aria-hidden="true"]') && (n.textContent||'').trim()).map(n=>(n.textContent||'').trim().replace(/\\s+/g,' '));
window.__press = (label) => { const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&x.getAttribute('aria-label')===label)[0];
  if(!n) return false; n.scrollIntoView({block:'center'}); n.click(); return true; };
window.__pressAny = (label) => { const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&(x.getAttribute('aria-label')||'').toLowerCase().includes(label.toLowerCase()))[0];
  if(!n) return false; n.scrollIntoView({block:'center'}); n.click(); return true; };
window.__setInput = (label, value) => {
  const n = Array.from(document.querySelectorAll('input,textarea')).filter(x=>!x.closest('[aria-hidden="true"]'))[0];
  return false;
};`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 140)); });
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3000);
  await page.evaluate(HELPERS);
  const out = {};
  const tap = async (src) => { const box = await page.evaluate((s) => window.__box(s), src); if (!box) { console.log('  miss:', src); return false; } await page.waitForTimeout(150); const again = await page.evaluate((s) => window.__box(s), src); await page.mouse.click(again.x, again.y); await page.waitForTimeout(1800); return true; };
  const press = async (label) => { const ok = await page.evaluate((l) => window.__press(l), label); await page.waitForTimeout(1800); return ok; };
  const has = async (re) => (await page.evaluate((r) => window.__act(new RegExp(r)).length, re.source || re)) > 0;
  const back = async () => { const ok = await page.evaluate(() => {
      const list = Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n) => !n.closest('[aria-hidden="true"]') && n.getBoundingClientRect().width > 0);
      const target = list[list.length - 1]; if (!target) return false; target.click(); return true; });
    await page.waitForTimeout(1700); await page.evaluate(HELPERS); return ok; };
  const tab = async (name) => { const ok = await page.locator(`[role="button"][aria-label="${name}"]`).first().click({ timeout: 6000 }).then(() => true).catch(() => false); await page.waitForTimeout(1600); await page.evaluate(HELPERS); return ok; };


  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  // 1 — the row is hidden until the area is switched on
  await tab('Tools');
  await page.evaluate(HELPERS);
  out.rowHiddenBeforeOptIn = !(await has('Women’s worship'));

  // 2 — switch it on in Settings
  await tab('Settings');
  await page.evaluate(HELPERS);
  const switches = await page.locator('[role="switch"]').count();
  out.settingSwitches = switches;
  await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('[role="switch"]'));
    const target = list.find((n) => (n.getAttribute('aria-label') || '') === 'Women’s worship') || list[list.length - 2];
    if (target) target.click();
  });
  await page.waitForTimeout(1800);
  await page.evaluate(HELPERS);
  out.lockRowAppears = await has('Lock and PIN');

  // 3 — the row is now on Tools
  await tab('Tools');
  await page.evaluate(HELPERS);
  out.rowVisibleAfterOptIn = await has('Women’s worship');
  await tap('^Women’s worship$');
  await page.evaluate(HELPERS);
  out.hubTitle = (await page.evaluate(() => window.__act(/^Women’s worship$/).map((n) => n.textContent.trim())))[0] || null;
  out.hubHasStats = await has('AVERAGE CYCLE');
  out.hubHasLockRow = await has('Add a PIN');

  // 4 — set a PIN
  await tap('^Add a PIN$');
  await page.evaluate(HELPERS);
  out.pinScreen = await has('^Set a PIN$');
  await press('Set a PIN');
  await page.waitForTimeout(900);
  await page.evaluate(HELPERS);
  out.createStage = await has('Choose a PIN');
  await press('Digit 1'); await press('Digit 2'); await press('Digit 3'); await press('Digit 4');
  await page.waitForTimeout(700);
  await page.evaluate(HELPERS);
  out.confirmStage = await has('Confirm it');
  await press('Digit 1'); await press('Digit 2'); await press('Digit 3'); await press('Digit 4');
  await page.waitForTimeout(900);
  await page.evaluate(HELPERS);
  out.pinSaved = await has('YOUR PIN IS SAVED ON THIS DEVICE');
  out.biometricRow = await has('This device cannot use face or fingerprint unlock|Use Face ID|Use Fingerprint|Biometric unlock');
  out.relockRow = await has('WHEN THE APP IS PUT AWAY');

  // 5 — the gate closes (relock immediately + back out and re-open)
  await back();
  await back();
  await page.evaluate(() => { try { window.dispatchEvent(new Event('blur')); } catch (e) {} });
  // relock by toggling the app state through a visibility change
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(1200);
  await tab('Tools');
  await page.evaluate(HELPERS);
  await tap('^Women’s worship$');
  await page.waitForTimeout(1500);
  await page.evaluate(HELPERS);
  out.lockedOnEntry = await has('^Locked$');
  out.keypadShown = (await page.locator('[aria-label="Digit 1"]').count()) > 0;

  // 6 — wrong PIN, then the right one
  for (const d of ['Digit 9', 'Digit 9', 'Digit 9', 'Digit 9']) await press(d);
  await page.waitForTimeout(900);
  await page.evaluate(HELPERS);
  out.wrongPinMessage = await has('That is not the PIN saved on this device');
  for (const d of ['Digit 1', 'Digit 2', 'Digit 3', 'Digit 4']) await press(d);
  await page.waitForTimeout(1400);
  await page.evaluate(HELPERS);
  out.unlocked = await has('AVERAGE CYCLE');

  // 7 — cycle: start, then mark purity
  await tap('^Cycle$'); await page.evaluate(HELPERS);
  out.cycleTitle = await has('^Your cycle$');
  await press('Start a cycle today'); await page.waitForTimeout(1200);
  await page.evaluate(HELPERS);
  out.cycleStarted = await has('IN PROGRESS · DAY 1');
  await press('I am pure now'); await page.waitForTimeout(1400);
  await page.evaluate(HELPERS);
  out.cycleEnded = await has('NO CYCLE IN PROGRESS|History');
  out.historyRow = await has('days');
  await back();

  // 8 — qada ledger
  await page.evaluate(HELPERS);
  await tap('^Qada fasts$'); await page.evaluate(HELPERS);
  out.qadaTitle = await has('^Days owed$');
  await press('Add this day to the ledger'); await page.waitForTimeout(1400);
  await page.evaluate(HELPERS);
  out.qadaAdded = (await page.evaluate(() => window.__act(/^1$/).length)) > 0;
  out.qadaOwed1 = (await page.evaluate(() => window.__act(/^1$/).length)) > 0;
  await page.evaluate(() => window.__pressAny('Mark '));
  await page.waitForTimeout(1200);
  await page.evaluate(HELPERS);
  out.qadaSettled = await has('SETTLED|Nothing outstanding');
  await back();

  // 9 — purity screen + live verse
  await page.evaluate(HELPERS);
  await tap('^Purity and ghusl$'); await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);
  out.purityTitle = await has('^Purity and ghusl$');
  out.verseLoaded = await has('Quran 2:222');
  out.ghuslSteps = await has('Pour water over the head three times');
  out.tuhrSigns = await has('Al-qassah al-bayda');
  await press('Record a birth'); await page.waitForTimeout(1200);
  await page.evaluate(HELPERS);
  out.nifasActive = await has('Day 1');
  await press('I am pure now'); await page.waitForTimeout(1200);
  await page.evaluate(HELPERS);
  out.nifasEnded = await has('Record a birth today');
  await back();
  await back();

  // 10 — zakat
  await page.evaluate(HELPERS);
  await tap('^Zakat$'); await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);
  out.zakatTitle = await has('Work out what is due');
  out.zakatCurrencyRow = await has('USD');
  out.zakatNisabBox = await has('GOLD NISAB');
  // type an amount into the first asset input (cash at home)
  const inputs = page.locator('input');
  out.inputCount = await inputs.count();
  if (await inputs.count()) {
    await inputs.nth(0).fill('10000');
    await page.waitForTimeout(1200);
  }
  await page.evaluate(HELPERS);
  out.zakatResultShown = await has('ZAKAT DUE');
  const money = await page.evaluate(() => window.__act(/ZAKAT DUE|NET WEALTH/).map((n) => n.textContent.trim()));
  out.zakatLabels = money.slice(0, 3);
  await page.evaluate(HELPERS);
  const netText = await page.evaluate(() => {
    const nodes = window.__act(/./);
    const idx = nodes.findIndex((n) => n.textContent.trim() === 'NET WEALTH');
    return idx >= 0 ? nodes[idx + 1]?.textContent.trim() : null;
  });
  out.netWealth = netText;
  await press('Save this calculation'); await page.waitForTimeout(1200);
  await page.evaluate(HELPERS);
  out.historySaved = await has('Saved on this device|above the gold nisab|below the gold nisab|above the Gold nisab|below the Gold nisab');

  // 11 — widths + RTL on the two heaviest screens
  const sweep = {};
  for (const w of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(900);
    sweep[w] = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      clipped: (() => {
        const out = [];
        document.querySelectorAll('div').forEach((n) => {
          const cs = getComputedStyle(n);
          if (cs.whiteSpace !== 'nowrap' || cs.overflow === 'visible') return;
          const r = n.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return;
          if (n.scrollWidth > n.clientWidth + 2) out.push((n.textContent || '').trim().slice(0, 24));
        });
        return out.slice(0, 3);
      })(),
    }));
  }
  out.zakatSweep = sweep;
  await page.setViewportSize({ width: 390, height: 900 });

  out.errors = [...new Set(errors)].slice(0, 6);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
