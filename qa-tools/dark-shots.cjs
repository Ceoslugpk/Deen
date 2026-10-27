// Captures the app in its dark palette so it can be looked at, not assumed.
// Usage: node qa-tools/dark-shots.cjs <dark|light> [ar|en] [prefix]
const { chromium } = require('playwright');
const path = require('path');

const HELPERS = `window.__press=(l)=>{const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&x.getAttribute('aria-label')===l)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};
window.__back=()=>{const list=Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n)=>!n.closest('[aria-hidden="true"]')&&n.getBoundingClientRect().width>0);const t=list[list.length-1];if(t)t.click();return !!t;};
window.__tab=(i)=>{const l=Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x)=>{const r=x.getBoundingClientRect();return !x.closest('[aria-hidden="true"]')&&r.top>window.innerHeight-90&&r.width<110&&r.height<80;});if(l.length>=5)l[i].click();return l.length>=5;};
window.__text=(t)=>{const n=Array.from(document.querySelectorAll('div,span')).filter(x=>!x.children.length&&(x.textContent||'').trim()===t)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};`;

(async () => {
  const mode = process.argv[2] || 'dark';
  const lang = process.argv[3] || 'ar';
  const prefix = process.argv[4] || (mode === 'dark' ? 'dark' : 'light');
  const dir = path.join(__dirname, '..', 'screenshots');
  const scheme = mode === 'dark' ? 'dark' : 'light';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, colorScheme: scheme,
    geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);
  await page.evaluate(HELPERS);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);
  if (lang === 'ar') {
    await page.evaluate(() => window.__tab(4));
    await page.waitForTimeout(1800);
    await page.evaluate(() => { const n = document.querySelector('[role="switch"][aria-label="Arabic interface"]'); if (n) n.click(); });
    await page.waitForTimeout(2600);
    await page.evaluate(HELPERS);
  }

  let n = 0;
  const shot = async (name) => {
    n += 1;
    const file = path.join(dir, `${prefix}-${String(n).padStart(2, '0')}-${name}.png`);
    await page.screenshot({ path: file });
    console.log('  ' + path.basename(file));
  };
  const tab = async (i) => { await page.evaluate((k) => window.__tab(k), i); await page.waitForTimeout(2000); await page.evaluate(HELPERS); };

  await tab(0); await shot('home');
  await tab(1); await shot('quran');
  await tab(2); await shot('library');
  await tab(3); await shot('tools');
  await tab(4); await shot('settings');
  // one deep screen and one reader
  await tab(3);
  await page.evaluate(() => window.__text('Prayer') || window.__press('Prayer'));
  await page.waitForTimeout(2400);
  await page.evaluate(HELPERS);
  await shot('prayer');
  await tab(1);
  await page.evaluate(() => window.__text('Al-Faatiha') || window.__text('الفاتحة'));
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);
  await shot('reader');
  console.log('errors: ' + (errors.length ? JSON.stringify(errors.slice(0, 4)) : 'none'));
  await b.close();
})();
