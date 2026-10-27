// Are the illustrated icons still readable on the dark surfaces? Measures the
// average brightness of each icon's own pixels against what sits behind it.
// Usage: node qa-tools/icon-luminance.cjs <dark|light> [ar|en]
const { chromium } = require('playwright');

const HELPERS = `window.__tab=(i)=>{const l=Array.from(document.querySelectorAll('[role="button"][aria-label]')).filter((x)=>{const r=x.getBoundingClientRect();return !x.closest('[aria-hidden="true"]')&&r.top>window.innerHeight-90&&r.width<110&&r.height<80;});if(l.length>=5)l[i].click();return l.length>=5;};`;

const SCAN = `window.__icons=()=>{
  const parse=(c)=>{const m=/rgba?\\(([^)]+)\\)/.exec(c);if(!m)return null;const p=m[1].split(',').map(Number);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};};
  const lum=(c)=>{const f=(v)=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);};
  const bgOf=(n)=>{let e=n;while(e&&e!==document.documentElement){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c.a>0.55)return c;const bi=getComputedStyle(e).backgroundImage;if(bi&&bi!=='none')return 'image';e=e.parentElement;}return {r:18,g:17,b:26,a:1};};
  const out=[];
  const seen=new Set();
  Array.from(document.images||[]).forEach((img)=>{
    const r=img.getBoundingClientRect();
    if(r.width<8||r.height<8||r.top>window.innerHeight)return;
    const src=(img.currentSrc||img.src||'');
    const name=src.split('/').pop().split('?')[0];
    if(seen.has(name))return; seen.add(name);
    const cv=document.createElement('canvas');
    const w=Math.min(64,Math.round(r.width)), h=Math.min(64,Math.round(r.height));
    cv.width=w; cv.height=h;
    const cx=cv.getContext('2d');
    try{cx.drawImage(img,0,0,w,h);}catch(e){return;}
    let data; try{data=cx.getImageData(0,0,w,h).data;}catch(e){return;}
    let sum=0,count=0,minL=1,maxL=0;
    for(let i=0;i<data.length;i+=4){
      const a=data[i+3]/255; if(a<0.35)continue;
      const L=lum({r:data[i],g:data[i+1],b:data[i+2]});
      sum+=L; count++; if(L<minL)minL=L; if(L>maxL)maxL=L;
    }
    if(!count)return;
    const bg=bgOf(img);
    out.push({name,mean:Math.round((sum/count)*1000)/1000,darkest:Math.round(minL*1000)/1000,lightest:Math.round(maxL*1000)/1000,bg:bg==='image'?'image':Math.round(lum(bg)*1000)/1000});
  });
  return out;
};`;

(async () => {
  const mode = process.argv[2] || 'dark';
  const lang = process.argv[3] || 'ar';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, colorScheme: mode === 'dark' ? 'dark' : 'light',
    geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.addInitScript((value) => { try { localStorage.setItem('deen-theme-v1', value); } catch (e) {} }, mode);
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);
  await page.evaluate(HELPERS);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2500);
  if (lang === 'ar') {
    await page.evaluate(() => window.__tab(4));
    await page.waitForTimeout(1600);
    await page.evaluate(() => { const n = document.querySelector('[role="switch"][aria-label="Arabic interface"]'); if (n) n.click(); });
    await page.waitForTimeout(2600);
  }
  console.log('=== ' + mode + ' ===');
  for (let tab = 0; tab < 5; tab += 1) {
    await page.evaluate((k) => window.__tab(k), tab);
    await page.waitForTimeout(1800);
    await page.evaluate(SCAN);
    const icons = await page.evaluate(() => window.__icons());
    const risky = icons.filter((i) => i.bg !== 'image' && i.bg < 0.2 && i.mean < 0.3);
    console.log('tab ' + tab + ': ' + icons.length + ' icons, ' + risky.length + ' dark-on-dark');
    risky.forEach((i) => console.log('    ' + i.name.padEnd(26) + ' mean ' + i.mean + ' on bg ' + i.bg));
  }
  await b.close();
})();
