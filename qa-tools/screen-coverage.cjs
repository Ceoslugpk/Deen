// Arabic coverage for the screens the main walk does not reach.
//
// The main harness (arabic-coverage.cjs) walks the five tabs and the tools
// list. Everything behind a card — the Names, the duas, the hadith
// collections, the guides — has to be opened one by one. This script takes a
// list of steps, each one a piece of Arabic text to tap, and measures what it
// lands on: how much of the visible text is Arabic, whether anything
// overflows or is clipped, and what is still in English.
//
// Usage: node qa-tools/screen-coverage.cjs <group>
const { chromium } = require('playwright');

const HELPERS = `window.__act=(re)=>Array.from(document.querySelectorAll('div,span')).filter(n=>{if(n.children.length)return false;if(n.closest('[aria-hidden="true"]'))return false;const t=(n.textContent||'').trim().replace(/\\s+/g,' ');if(!t)return false;const r=n.getBoundingClientRect();return r.width>=1&&r.height>=1&&re.test(t);});
window.__texts=()=>window.__act(/./).map(n=>n.textContent.trim().replace(/\\s+/g,' '));
window.__box=(src)=>{const n=window.__act(new RegExp(src))[0];if(!n)return null;n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};};
window.__issues=()=>{const de=document.documentElement;const overflow=de.scrollWidth-de.clientWidth>1;const clipped=[];Array.from(document.querySelectorAll('div,span')).forEach(n=>{if(n.children.length)return;if(n.closest('[aria-hidden="true"]'))return;const t=(n.textContent||'').trim();if(!t)return;const cs=getComputedStyle(n);if(cs.whiteSpace==='nowrap'&&n.scrollWidth-n.clientWidth>1)clipped.push(t.slice(0,40));});return {overflow,clipped};};
window.__back=()=>{const list=Array.from(document.querySelectorAll('[aria-label="Go back"]')).filter((n)=>!n.closest('[aria-hidden="true"]')&&n.getBoundingClientRect().width>0);const t=list[list.length-1];if(t)t.click();return !!t;};
window.__tab=(i)=>{const l=Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x)=>{const r=x.getBoundingClientRect();return !x.closest('[aria-hidden="true"]')&&r.top>window.innerHeight-90&&r.width<110&&r.height<80;});if(l.length>=5)l[i].click();return l.length>=5;};`;

const TABS = { Home: 0, Quran: 1, Library: 2, Tools: 3, Settings: 4 };
const ARABIC = /[\u0600-\u06FF]/;
const LATIN = /[A-Za-z]{3,}/;

// Each group: which tab it lives under, and what to tap to get there.
const GROUPS = {
  library: {
    tab: 'Library',
    steps: [
      ['Duas', 'الأدعية'],
      ['Names', 'الأسماء الحسنى'],
      ['Prophets', 'أسماء الأنبياء'],
      ['Hadith', 'الحديث'],
      ['Audio', 'الصوت القرآني'],
    ],
  },
  quran: {
    tab: 'Quran',
    steps: [
      ['Search', 'ابحث عن سورة|ابحث في النص'],
      ['Bookmarks', 'المفضلة'],
      ['Notes', 'ملاحظات'],
      ['Topics', 'موضوعات'],
      ['Vocabulary', 'مفردات'],
      ['Tajweed', 'دراسة التجويد'],
      ['Juz', 'الجزء'],
      ['Hifz', 'الحفظ'],
      ['Plans', 'خطط القراءة'],
      ['Offline', 'القرآن دون اتصال'],
      ['Downloads', 'التنزيلات'],
    ],
  },
};

(async () => {
  const group = GROUPS[process.argv[2]];
  if (!group) { console.log('usage: node qa-tools/screen-coverage.cjs <' + Object.keys(GROUPS).join('|') + '>'); process.exit(1); }
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: Number(process.argv[3] || 390), height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
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

  await page.evaluate((i) => window.__tab(i), TABS.Settings);
  await page.waitForTimeout(2200);
  await page.evaluate(() => { const n = document.querySelector('[role="switch"][aria-label="Arabic interface"]'); if (n) n.click(); });
  await page.waitForTimeout(2600);
  await page.evaluate(HELPERS);

  for (const [name, pattern] of group.steps) {
    await page.evaluate((i) => window.__tab(i), TABS[group.tab]);
    await page.waitForTimeout(2200);
    await page.evaluate(HELPERS);
    let box = null;
    for (let i = 0; i < 5 && !box; i += 1) { box = await page.evaluate((p) => window.__box(p), pattern); if (!box) await page.waitForTimeout(600); }
    if (!box) { console.log(name.padEnd(12), 'unreachable'); continue; }
    const again = await page.evaluate((p) => window.__box(p), pattern);
    if (!again) { console.log(name.padEnd(12), 'unreachable (scrolled away)'); continue; }
    await page.mouse.click(again.x, again.y);
    await page.waitForTimeout(2600);
    await page.evaluate(HELPERS);
    const texts = await page.evaluate(() => window.__texts());
    const issues = await page.evaluate(() => window.__issues());
    const latin = texts.filter((t) => LATIN.test(t));
    const pct = texts.length ? Math.round((100 * (texts.length - latin.length)) / texts.length) : 0;
    require('fs').writeFileSync('/tmp/ar-' + process.argv[2] + '-' + name + '.json', JSON.stringify(texts, null, 1));
    console.log(
      name.padEnd(12),
      'text', String(texts.length).padStart(3),
      '→', String(pct).padStart(3) + '% arabic',
      issues.overflow ? ' OVERFLOW' : '',
      issues.clipped.length ? ' CLIPPED ' + JSON.stringify(issues.clipped.slice(0, 3)) : ''
    );
  }
  console.log('errors:', errors.length ? errors : 'none');
  await b.close();
})();
