// Does every screen hold at every width?
//
// Walks the five tabs and the tools at one width and reports, per screen,
// horizontal overflow and text clipped by a container. Run it at 320, 390,
// 768 and 1024 — the four widths the app claims to support — in each
// language; Arabic is the stricter test, because the layout is mirrored.
//
// Usage: node qa-tools/responsive.cjs <width> [ar|en]
const { chromium } = require('playwright');

const HELPERS = `window.__act=(re)=>Array.from(document.querySelectorAll('div,span')).filter(n=>{if(n.children.length)return false;if(n.closest('[aria-hidden="true"]'))return false;const t=(n.textContent||'').trim().replace(/\\s+/g,' ');if(!t)return false;const r=n.getBoundingClientRect();return r.width>=1&&r.height>=1&&re.test(t);});
window.__issues=()=>{const de=document.documentElement;const overflow=de.scrollWidth-de.clientWidth>1;const clipped=[];const small=[];Array.from(document.querySelectorAll('div,span')).forEach(n=>{if(n.children.length)return;if(n.closest('[aria-hidden="true"]'))return;const t=(n.textContent||'').trim();if(!t)return;const cs=getComputedStyle(n);if(cs.whiteSpace==='nowrap'&&n.scrollWidth-n.clientWidth>1)clipped.push(t.slice(0,36));});return {overflow,clipped:clipped.slice(0,4),wide:de.scrollWidth};};
window.__press=(l)=>{const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&x.getAttribute('aria-label')===l)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};
window.__back=()=>{const list=Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n)=>!n.closest('[aria-hidden="true"]')&&n.getBoundingClientRect().width>0);const t=list[list.length-1];if(t)t.click();return !!t;};
window.__tab=(i)=>{const l=Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x)=>{const r=x.getBoundingClientRect();return !x.closest('[aria-hidden="true"]')&&r.top>window.innerHeight-90&&r.width<110&&r.height<80;});if(l.length>=5)l[i].click();return l.length>=5;};`;

const TABS = { Home: 0, Quran: 1, Library: 2, Tools: 3, Settings: 4 };
const TOOLS = ['Prayer', 'Qibla', 'Adhan', 'Notifications', 'Location', 'Hijri Calendar', 'Ramadan',
  'Fasting', 'Weekly Summary', 'Umrah and Hajj', 'Tasbih', 'Zakat', 'Mosques', 'Worship guides'];

(async () => {
  const width = Number(process.argv[2] || 390);
  const lang = process.argv[3] || 'ar';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width, height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
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
  if (lang === 'ar') {
    await page.evaluate((i) => window.__tab(i), TABS.Settings);
    await page.waitForTimeout(2000);
    await page.evaluate(() => { const n = document.querySelector('[role="switch"][aria-label="Arabic interface"]'); if (n) n.click(); });
    await page.waitForTimeout(2600);
    await page.evaluate(HELPERS);
  }

  const rows = [];
  const measure = async (name) => {
    const issues = await page.evaluate(() => window.__issues());
    rows.push({ name, overflow: issues.overflow, clipped: issues.clipped, wide: issues.wide });
    console.log(
      '  ' + name.padEnd(18),
      issues.overflow ? 'OVERFLOW ' + issues.wide + 'px' : 'fits',
      issues.clipped.length ? ' CLIPPED ' + JSON.stringify(issues.clipped) : ''
    );
  };
  const tab = async (i) => { await page.evaluate((k) => window.__tab(k), i); await page.waitForTimeout(2000); await page.evaluate(HELPERS); };

  console.log('width ' + width + ' · ' + lang);
  await tab(TABS.Home); await measure('Home');
  await tab(TABS.Quran); await measure('Quran home');
  await tab(TABS.Library); await measure('Library home');
  await tab(TABS.Settings); await measure('Settings');
  await tab(TABS.Tools); await measure('Tools list');
  for (const tool of TOOLS) {
    await tab(TABS.Tools);
    const ok = await page.evaluate((l) => window.__press(l), tool);
    if (!ok) { console.log('  ' + tool.padEnd(18) + 'unreachable'); continue; }
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
    await measure(tool);
    await page.evaluate(() => window.__back());
    await page.waitForTimeout(1600);
    await page.evaluate(HELPERS);
  }
  const bad = rows.filter((r) => r.overflow || r.clipped.length);
  console.log('  → ' + (rows.length - bad.length) + '/' + rows.length + ' screens clean' + (errors.length ? ' · errors ' + JSON.stringify(errors) : ''));
  await b.close();
})();
