// Arabic pass over the women's area and the Zakat screen.
//
// Walks every state of those screens with the interface in Arabic and reports
// two things: any leaf text still carrying Latin letters (an untranslated
// string the dictionary missed), and any horizontal overflow or clipped text.
//
// The floating menu labels are Arabic in Arabic mode, so it is driven by
// ordinal position, not by label. The rows inside the women's hub keep English
// accessibility labels on purpose, so those are still driven by label.
//
// Usage: node qa-tools/phase4-arabic.cjs
const { chromium } = require('playwright');
const fs = require('fs');

const HELPERS = `window.__act=(re)=>Array.from(document.querySelectorAll('div,span')).filter(n=>{if(n.children.length)return false;if(n.closest('[aria-hidden="true"]'))return false;const t=(n.textContent||'').trim().replace(/\\s+/g,' ');if(!t)return false;const r=n.getBoundingClientRect();return r.width>=1&&r.height>=1&&re.test(t);});
window.__texts=()=>window.__act(/./).map(n=>n.textContent.trim().replace(/\\s+/g,' '));
window.__box=(src)=>{const n=window.__act(new RegExp(src))[0];if(!n)return null;n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};};
window.__press=(l)=>{const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&x.getAttribute('aria-label')===l)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};
window.__issues=()=>{const de=document.documentElement;const overflow=de.scrollWidth-de.clientWidth>1;const clipped=[];Array.from(document.querySelectorAll('div,span')).forEach(n=>{if(n.children.length)return;if(n.closest('[aria-hidden="true"]'))return;const t=(n.textContent||'').trim();if(!t)return;const cs=getComputedStyle(n);if(cs.whiteSpace==='nowrap'&&n.scrollWidth-n.clientWidth>1)clipped.push(t.slice(0,40));});return {overflow,clipped:clipped.slice(0,6)};};`;

const TAB_ORDER = { Home: 0, Quran: 1, Library: 2, Tools: 3, Settings: 4 };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 140)); });
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);
  await page.evaluate(HELPERS);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  const tab = async (name) => {
    const ok = await page.evaluate((i) => {
      const list = Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x) => {
        const r = x.getBoundingClientRect();
        return !x.closest('[aria-hidden="true"]') && r.top > window.innerHeight - 90 && r.width < 110 && r.height < 80;
      });
      if (list.length < 5) return false;
      list[i].click();
      return true;
    }, TAB_ORDER[name]).catch(() => false);
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
    return ok;
  };
  const tap = async (src) => {
    let box = null;
    for (let i = 0; i < 4 && !box; i += 1) { box = await page.evaluate((s) => window.__box(s), src); if (!box) await page.waitForTimeout(600); }
    if (!box) { console.log('  miss:', src); return false; }
    await page.waitForTimeout(400);
    const again = await page.evaluate((s) => window.__box(s), src);
    if (!again) return false;
    await page.mouse.click(again.x, again.y);
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
    return true;
  };
  const press = async (label) => {
    let ok = false;
    for (let i = 0; i < 3 && !ok; i += 1) { ok = await page.evaluate((l) => window.__press(l), label); if (!ok) await page.waitForTimeout(700); }
    await page.waitForTimeout(1400);
    await page.evaluate(HELPERS);
    if (!ok) console.log('  miss press:', label);
    return ok;
  };
  const back = async () => {
    await page.evaluate(() => {
      const list = Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n) => !n.closest('[aria-hidden="true"]') && n.getBoundingClientRect().width > 0);
      const target = list[list.length - 1];
      if (target) target.click();
    });
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
  };

  const out = {};
  const check = async (name) => {
    const texts = await page.evaluate(() => window.__texts());
    const issues = await page.evaluate(() => window.__issues());
    const latin = texts.filter((s) => /[A-Za-z]{3,}/.test(s) && !/^\d/.test(s));
    out[name] = { nodes: texts.length, overflow: issues.overflow, clipped: issues.clipped, latin };
    fs.writeFileSync('/tmp/ar-' + name + '.json', JSON.stringify(texts, null, 1));
    console.log(name.padEnd(15), 'nodes', String(texts.length).padStart(3),
      'overflow', issues.overflow, 'clipped', issues.clipped.length,
      'latin', latin.length ? JSON.stringify(latin) : 'none');
  };

  // Arabic on, then the area switched on
  await tab('Settings');
  await page.evaluate(() => { const n = document.querySelector('[role="switch"][aria-label="Arabic interface"]'); if (n) n.click(); });
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);
  await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('[role="switch"]'));
    const target = list.find((n) => (n.getAttribute('aria-label') || '') === 'Women’s worship');
    if (target) target.click();
  });
  await page.waitForTimeout(2400);
  await page.evaluate(HELPERS);

  await tab('Tools');
  await tap('^Women’s worship$');
  await check('hub');
  await press('Add a PIN'); await page.waitForTimeout(600);
  await check('lock-empty');
  await press('Set a PIN');
  await page.waitForTimeout(800);
  for (const d of ['Digit 1', 'Digit 2', 'Digit 3', 'Digit 4']) await press(d);
  await check('keypad-create');
  for (const d of ['Digit 1', 'Digit 2', 'Digit 3', 'Digit 4']) await press(d);
  await page.waitForTimeout(1600);
  await page.evaluate(HELPERS);
  await check('lock-set');
  await back();
  await press('Cycle'); await page.waitForTimeout(600);
  await check('cycle-empty');
  await press('Start a cycle today');
  await page.waitForTimeout(1400);
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('[aria-label]')).filter((n) => (n.getAttribute('aria-label') || '').includes(': not recorded')).slice(-4);
    chips.forEach((n) => n.click());
  });
  await page.waitForTimeout(1400);
  await page.evaluate(HELPERS);
  await check('cycle-active');
  await back();
  await press('Qada fasts'); await page.waitForTimeout(600);
  await check('qada-empty');
  await press('Add this day to the ledger');
  await page.waitForTimeout(1200);
  await press('One day earlier');
  await page.waitForTimeout(900);
  await press('Add this day to the ledger');
  await page.waitForTimeout(1400);
  await page.evaluate(HELPERS);
  await check('qada-filled');
  await back();
  await press('Purity and ghusl'); await page.waitForTimeout(600);
  await page.waitForTimeout(3000);
  await page.evaluate(HELPERS);
  await check('purity');
  await press('Record a birth');
  await page.waitForTimeout(1800);
  await page.evaluate(HELPERS);
  await check('purity-nifas');
  await back();
  await press('Worship guidance'); await page.waitForTimeout(600);
  await page.waitForTimeout(2400);
  await page.evaluate(HELPERS);
  await check('guides');
  await back();
  await check('hub-filled');
  await back();
  await back();
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(1600);
  await tab('Tools');
  await tap('^Women’s worship$');
  await page.waitForTimeout(1600);
  await page.evaluate(HELPERS);
  await check('gate');
  // unlock again so the width sweep below walks the screens themselves
  for (const digit of ['Digit 1', 'Digit 2', 'Digit 3', 'Digit 4']) await press(digit);
  await page.waitForTimeout(1800);
  await page.evaluate(HELPERS);
  await back();
  await back();
  await tab('Tools');
  await tap('^Zakat$');
  await page.waitForTimeout(3000);
  await page.evaluate(HELPERS);
  await check('zakat');

  // the same screens again, narrow and then wide, for overflow and clipping
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(HELPERS);
    await tab('Tools');
    await tap('^Women’s worship$');
    await check('hub-' + width);
    await press('Cycle');
    await page.waitForTimeout(600);
    await check('cycle-' + width);
    await back();
    await press('Qada fasts');
    await page.waitForTimeout(600);
    await check('qada-' + width);
    await back();
    await press('Purity and ghusl');
    await page.waitForTimeout(2600);
    await page.evaluate(HELPERS);
    await check('purity-' + width);
    await back();
    await back();
    await tab('Tools');
    await tap('^Zakat$');
    await page.waitForTimeout(2600);
    await page.evaluate(HELPERS);
    await check('zakat-' + width);
    await back();
  }

  out.errors = errors;
  console.log('\nJSON ' + JSON.stringify(out, null, 1));
  await b.close();
})();
