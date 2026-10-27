// Reads the app in its dark palette and reports text that the eye would struggle
// with: low contrast against whatever is behind it, or invisible text.
// Usage: node qa-tools/theme-contrast.cjs <dark|light> [ar|en]
const { chromium } = require('playwright');

const HELPERS = `window.__press=(l)=>{const n=Array.from(document.querySelectorAll('[aria-label]')).filter(x=>!x.closest('[aria-hidden="true"]')&&x.getAttribute('aria-label')===l)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};
window.__tab=(i)=>{const l=Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x)=>{const r=x.getBoundingClientRect();return !x.closest('[aria-hidden="true"]')&&r.top>window.innerHeight-90&&r.width<110&&r.height<80;});if(l.length>=5)l[i].click();return l.length>=5;};
window.__text=(t)=>{const n=Array.from(document.querySelectorAll('div,span')).filter(x=>!x.children.length&&(x.textContent||'').trim()===t)[0];if(!n)return false;n.scrollIntoView({block:'center'});n.click();return true;};`;

const CONTRAST = `window.__contrast=()=>{
  const parse=(c)=>{const m=/rgba?\\(([^)]+)\\)/.exec(c);if(!m)return null;const p=m[1].split(',').map(Number);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};};
  const lum=(c)=>{const f=(v)=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);};
  const ratio=(a,b)=>{const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);};
  const bgOf=(n)=>{let e=n;while(e&&e!==document.documentElement){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c.a>0.55)return c;e=e.parentElement;}return {r:18,g:17,b:26,a:1};};
  const out=[];
  Array.from(document.querySelectorAll('div,span')).forEach((n)=>{
    if(n.children.length)return;
    if(n.closest('[aria-hidden="true"]'))return;
    const t=(n.textContent||'').trim(); if(!t)return;
    const r=n.getBoundingClientRect(); if(r.width<2||r.height<2||r.top>window.innerHeight+40)return;
    const cs=getComputedStyle(n);
    const fg=parse(cs.color); if(!fg||fg.a<0.3)return;
    const bg=bgOf(n);
    const cr=ratio(fg,bg);
    const size=parseFloat(cs.fontSize)||14; const bold=(parseInt(cs.fontWeight)||400)>=600;
    const need=(size>=24||(size>=18.66&&bold))?3:4.5;
    if(cr<need)out.push({text:t.slice(0,34),cr:Math.round(cr*100)/100,need,size:Math.round(size),fg:cs.color,bg:'rgb('+bg.r+','+bg.g+','+bg.b+')'});
  });
  const seen=new Set();
  return out.filter((o)=>{const k=o.text+o.cr;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,14);
};
window.__sample=()=>{const de=document.documentElement;const body=document.body;return {page:getComputedStyle(de).backgroundColor,body:getComputedStyle(body).backgroundColor};};`;

(async () => {
  const mode = process.argv[2] || 'dark';
  const lang = process.argv[3] || 'ar';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, colorScheme: mode === 'dark' ? 'dark' : 'light',
    geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
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
  await page.evaluate(CONTRAST);
  const tab = async (i, name) => {
    await page.evaluate((k) => window.__tab(k), i);
    await page.waitForTimeout(2000);
    await page.evaluate(HELPERS); await page.evaluate(CONTRAST);
    const sample = await page.evaluate(() => window.__sample());
    const issues = await page.evaluate(() => window.__contrast());
    console.log(name.padEnd(10), 'page', sample.page);
    issues.forEach((o) => console.log('    low contrast', String(o.cr).padEnd(5), 'need', o.need, '|', o.text, '|', o.fg, 'on', o.bg));
    if (!issues.length) console.log('    all text meets its contrast target');
  };
  console.log('=== ' + mode + ' · ' + lang + ' ===');
  await tab(0, 'Home');
  await tab(1, 'Quran');
  await tab(2, 'Library');
  await tab(3, 'Tools');
  await tab(4, 'Settings');
  await b.close();
})();
