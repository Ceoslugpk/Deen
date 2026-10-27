// How much of the app is actually in Arabic?
//
// Walks the main destinations with the interface switched to Arabic and, on
// each screen, counts the visible text: how much is Arabic script, how much is
// still Latin. It reports horizontal overflow and clipped text at the same
// time, so the same pass tells you whether the right-to-left layout holds.
//
// Navigation is by position on the floating menu (its labels are Arabic in
// Arabic mode) and by the English text of the Tools list, which is one of the
// parts not translated yet.
//
// Usage: node qa-tools/arabic-coverage.cjs
const { chromium } = require('playwright');

const HELPERS = `window.__act=(re)=>Array.from(document.querySelectorAll('div,span')).filter(n=>{if(n.children.length)return false;if(n.closest('[aria-hidden="true"]'))return false;const t=(n.textContent||'').trim().replace(/\\s+/g,' ');if(!t)return false;const r=n.getBoundingClientRect();return r.width>=1&&r.height>=1&&re.test(t);});
window.__texts=()=>window.__act(/./).map(n=>n.textContent.trim().replace(/\\s+/g,' '));
window.__box=(src)=>{const n=window.__act(new RegExp(src))[0];if(!n)return null;n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};};
window.__issues=()=>{const de=document.documentElement;const overflow=de.scrollWidth-de.clientWidth>1;const clipped=[];Array.from(document.querySelectorAll('div,span')).forEach(n=>{if(n.children.length)return;if(n.closest('[aria-hidden="true"]'))return;const t=(n.textContent||'').trim();if(!t)return;const cs=getComputedStyle(n);if(cs.whiteSpace==='nowrap'&&n.scrollWidth-n.clientWidth>1)clipped.push(t.slice(0,40));});return {overflow,clipped:clipped.slice(0,4)};};
window.__press=(l)=>{const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&x.getAttribute('aria-label')===l)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};
window.__dirs=()=>Array.from(document.querySelectorAll('div')).filter(n=>!n.closest('[aria-hidden="true"]')&&n.getBoundingClientRect().width>300).map(n=>getComputedStyle(n).direction).slice(0,3);`;

const TAB_ORDER = { Home: 0, Quran: 1, Library: 2, Tools: 3, Settings: 4 };
const ARABIC = /[\u0600-\u06FF]/;
const LATIN = /[A-Za-z]{3,}/;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);
  await page.evaluate(HELPERS);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  const tab = async (name) => {
    await page.evaluate((i) => {
      const list = Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x) => {
        const r = x.getBoundingClientRect();
        return !x.closest('[aria-hidden="true"]') && r.top > window.innerHeight - 90 && r.width < 110 && r.height < 80;
      });
      if (list.length >= 5) list[i].click();
    }, TAB_ORDER[name]);
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
  };
  const tap = async (src) => {
    let box = null;
    for (let i = 0; i < 4 && !box; i += 1) { box = await page.evaluate((s) => window.__box(s), src); if (!box) await page.waitForTimeout(500); }
    if (!box) { console.log('  unreachable:', src); return false; }
    await page.waitForTimeout(400);
    const again = await page.evaluate((s) => window.__box(s), src);
    if (!again) return false;
    await page.mouse.click(again.x, again.y);
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
    return true;
  };
  const press = async (label) => {
    const ok = await page.evaluate((l) => window.__press(l), label);
    return ok;
  };
  const back = async () => {
    await page.evaluate(() => {
      const list = Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n) => !n.closest('[aria-hidden="true"]') && n.getBoundingClientRect().width > 0);
      const target = list[list.length - 1];
      if (target) target.click();
    });
    await page.waitForTimeout(2100);
    await page.evaluate(HELPERS);
  };

  const rows = [];
  const measure = async (name) => {
    const texts = await page.evaluate(() => window.__texts());
    const issues = await page.evaluate(() => window.__issues());
    const dirs = await page.evaluate(() => window.__dirs());
    const arabic = texts.filter((t) => ARABIC.test(t));
    const latin = texts.filter((t) => LATIN.test(t));
    const pct = texts.length ? Math.round((100 * (texts.length - latin.length)) / texts.length) : 0;
    require('fs').writeFileSync('/tmp/ar-cov-' + name.replace(/\s+/g, '-') + '.json', JSON.stringify(texts, null, 1));
    rows.push({ screen: name, texts: texts.length, arabic: arabic.length, latin: latin.length, pct, overflow: issues.overflow, clipped: issues.clipped.length, dir: dirs[0] || '-' });
    console.log(
      String(name).padEnd(22),
      'text', String(texts.length).padStart(3),
      'arabic', String(arabic.length).padStart(3),
      'latin', String(latin.length).padStart(3),
      '→', String(pct).padStart(3) + '% arabic',
      issues.overflow ? ' OVERFLOW' : '',
      issues.clipped.length ? ' CLIPPED' : ''
    );
  };

  // switch to Arabic
  await tab('Settings');
  await page.evaluate(() => { const n = document.querySelector('[role="switch"][aria-label="Arabic interface"]'); if (n) n.click(); });
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  await tab('Home'); await measure('Home');
  await tab('Quran'); await measure('Quran home');
  await tab('Library'); await measure('Library home');
  await tab('Settings'); await measure('Settings');
  await press('Data sources'); await page.waitForTimeout(2400); await page.evaluate(HELPERS);
  await measure('Data sources'); await back();

  await tab('Tools'); await measure('Tools list');
  for (const tool of ['Prayer', 'Qibla', 'Adhan', 'Notifications', 'Location', 'Hijri Calendar', 'Ramadan', 'Fasting', 'Weekly Summary', 'Umrah and Hajj', 'Tasbih', 'Zakat', 'Mosques', 'Worship guides']) {
    await tab('Tools');
    const ok = await press(tool);
    if (!ok) { console.log('  unreachable:', tool); continue; }
    await page.waitForTimeout(2400);
    await page.evaluate(HELPERS);
    await measure(tool);
    await back();
  }

  console.log('\ncoverage by tab:');
  const byArea = {};
  rows.forEach((r) => { byArea[r.screen] = r.pct; });
  const sorted = rows.slice().sort((a, b) => a.pct - b.pct);
  console.log('  least Arabic:', sorted.slice(0, 8).map((r) => `${r.screen} ${r.pct}%`).join(', '));
  console.log('  most Arabic: ', sorted.slice(-6).map((r) => `${r.screen} ${r.pct}%`).join(', '));
  console.log('  errors:', errors.length ? errors.slice(0, 4) : 'none');
  await b.close();
})();
