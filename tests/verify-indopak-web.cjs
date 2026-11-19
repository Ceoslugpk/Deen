/** Real Expo WEB, real bundled Quran assets. Native rendering/device testing remains separate.
 * INDOPAK_URL=http://127.0.0.1:8106 node tests/verify-indopak-web.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const meta = require('../src/data/indopak16/meta.json');
const url = process.env.INDOPAK_URL || 'http://127.0.0.1:8106';
const output = process.env.INDOPAK_ARTIFACTS_DIR || '/tmp/islamic-r98-web-smoke';
const key = '@deen/quran/indopak-taj-16/state/v1';
const originalKeys = ['@deen/quran/preferences/v1', '@deen/quran/position/v1', '@deen/quran/bookmarks/v1', '@deen/quran/notes/v1'];
const pause = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const box = item => item.evaluate(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; });
function inside(a, b, label) { assert.ok(a.x >= b.x - 1 && a.y >= b.y - 1 && a.right <= b.right + 1 && a.bottom <= b.bottom + 1, `${label}: ${JSON.stringify({ a, b })}`); }
async function makePage(browser, language = 'en', dark = false, reducedMotion = 'reduce', audioSettings = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion });
  await context.addInitScript(({ lang, dark, audioSettings }) => {
    localStorage.setItem('@deen/onboarding/v1', JSON.stringify({ completed: true, app: lang, text: 'en', voice: 'en', locationAsked: true, notificationsAsked: true }));
    localStorage.setItem('@deen/language/v1', lang);
    localStorage.setItem('@deen/location/v1', JSON.stringify({ latitude: 25.2048, longitude: 55.2708, label: 'Dubai', timezone: 'Asia/Dubai' }));
    localStorage.setItem('deen-theme-v1', dark === 'system' ? 'system' : dark ? 'dark' : 'light');
    localStorage.setItem('deen-theme-name-v1', 'islamic');
    localStorage.setItem('@deen/audio-settings/v1', JSON.stringify({ translationAudioEnabled: false, ...audioSettings }));
    localStorage.setItem('@deen/quran/preferences/v1', JSON.stringify({ scriptEdition: 'quran-uthmani', scriptName: 'Uthmani', arabicFont: 'hafs', fontSize: 30,
      translationEdition: 'tr_en_saheeh_international', translationName: 'Saheeh International', translationLanguage: 'English', translationAppLanguage: lang, readingMode: 'cards' }));
    localStorage.setItem('@deen/quran/position/v1', JSON.stringify({ surahId: 55, surahName: 'Ar-Rahman', verseKey: '55:5', ayah: 5, page: 531, updatedAt: 123 }));
    localStorage.setItem('@deen/quran/bookmarks/v1', JSON.stringify([{ verseKey: '55:5', surahId: 55, surahName: 'Ar-Rahman', arabic: 'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ', savedAt: 123 }]));
    localStorage.setItem('@deen/quran/notes/v1', JSON.stringify([{ verseKey: '55:5', surahId: 55, surahName: 'Ar-Rahman', arabic: '', savedAt: 123, note: 'preserve this note', updatedAt: 123 }]));
    window.__indopakMedia = []; window.__indopakPlays = [];
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (!window.__indopakMedia.includes(this)) window.__indopakMedia.push(this);
      window.__indopakPlays.push(this.src || this.currentSrc);
      return Reflect.apply(originalPlay, this, args);
    };
  }, { lang: language, dark, audioSettings });
  const page = await context.newPage(); page.setDefaultTimeout(25000);
  const errors = { page: [], console: [], http: [], requests: [] };
  page.on('pageerror', e => errors.page.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.console.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.http.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed', r => errors.requests.push(`${r.url()} ${r.failure()?.errorText}`));
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.getByTestId('navigation-quran').click();
  await page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded();
  await page.getByTestId('qtile-16-line Quran').click();
  await page.getByTestId('indopak-page-svg').waitFor();
  await page.getByTestId('floating-navigation-bar').waitFor({state:'detached'}); await pause(page);
  return { context, page, errors };
}
async function gotoPage(page, number) {
  await page.getByTestId('indopak-page-select').click();
  await page.getByTestId('indopak-page-input').fill(String(number));
  await page.getByTestId('indopak-page-go').click();
  await expectPage(page,number);
}
async function layout(page, expectedPage) {
  await pause(page);
  const safe = await box(page.getByTestId('system-safe-content').first());
  assert.equal(await page.getByTestId('floating-navigation-bar').count(),0,'Only this reader removes the bottom menu');
  const player = await page.getByTestId('mini-player').count() ? await box(page.getByTestId('mini-player')) : null;
  const viewport = await box(page.getByTestId('indopak-page-viewport'));
  for (const id of ['indopak-page-navigation','indopak-next','indopak-previous']) assert.equal(await page.getByTestId(id).count(),0,'No bottom page section remains');
  const top = await box(page.getByTestId('indopak-top-controls'));
  const counter = await box(page.getByTestId('indopak-page-select'));
  const tools = await box(page.getByTestId('indopak-tools'));
  const header = await box(page.getByTestId('screen-header').last());
  for (const [label, rect] of Object.entries({ viewport, top, tools, header })) inside(rect, safe, label);
  if (player) {
    inside(player,safe,'mini-player'); assert.ok(viewport.bottom <= player.y - 8,'The full page viewport clears the lowered mini-player');
    assert.ok(Math.abs(safe.bottom - player.bottom - 16) < 2,'Mini-player uses the freed bottom space on web/Android');
  } else assert.ok(safe.bottom - viewport.bottom >= 8 && safe.bottom - viewport.bottom <= 16,'No empty bottom pager/tab reserve remains');
  inside(counter,top,'Top page selector'); assert.ok(top.bottom <= viewport.y+1,'All controls stay above the page');
  assert.equal(await page.getByTestId('indopak-page-svg').locator('text').count(),0,'No duplicate bottom page number inside the page');
  const controls=[];
  for (const id of ['indopak-page-select','indopak-surah','indopak-juz','indopak-save-page','indopak-zoom','indopak-verse-list','indopak-sources']) {
    const rect=await box(page.getByTestId(id)); inside(rect,top,id);
    assert.ok(rect.width>=43.9 && rect.height>=43.9,`${id} keeps a 44px target`);
    for (const before of controls) assert.ok(rect.x>=before.right-1 || rect.right<=before.x+1 || rect.y>=before.bottom-1 || rect.bottom<=before.y+1,'Top targets do not overlap');
    controls.push(rect);
  }
  const text = await page.getByTestId('indopak-page-svg').evaluate(svg => {
    const words = Array.from(svg.querySelectorAll('path[data-testid^="indopak-ink-"]'));
    const outside = [];
    for (const n of words) {
      const b = n.getBBox(), matrix = svg.getCTM().inverse().multiply(n.getCTM());
      const points = [[b.x,b.y],[b.x+b.width,b.y+b.height]].map(([x,y]) => new DOMPoint(x,y).matrixTransform(matrix));
      const left = Math.min(...points.map(p=>p.x)), right = Math.max(...points.map(p=>p.x));
      const top = Math.min(...points.map(p=>p.y)), bottom = Math.max(...points.map(p=>p.y));
      if (left < 25 || right > 975 || top < 92 || bottom > 1544) outside.push({ word: n.getAttribute('data-testid'), left, right, top, bottom });
    }
    return { textCount: words.length, fontReady: document.fonts.check('48px IndopakNastaleeq'), lines: svg.querySelectorAll('[data-testid^="indopak-line-"]').length, outside };
  });
  assert.equal(text.fontReady, true); assert.ok(text.textCount > 0); assert.deepEqual(text.outside, []);
  if (expectedPage) assert.equal(text.lines, meta.shortPages[expectedPage] || 16);
  if ((await box(page.getByTestId('indopak-page-svg'))).height > viewport.height + 1) {
    const scroll = await page.getByTestId('indopak-vertical-scroll').evaluate(e => ({ height:e.clientHeight, content:e.scrollHeight }));
    assert.ok(scroll.content > scroll.height, 'Oversized/landscape pages remain vertically scrollable');
  }
  return { safe, footerHidden:true, bottomPagerRemoved:true, player, viewport, top, counter, tools, header, text };
}
/** Real Chromium touch input, not a direct call to a responder or page setter. */
async function touchSwipe(page, { dx, dy = 0, word = false, multi = false, cancel = false }) {
  const stage = await box(page.getByTestId('indopak-page-viewport'));
  let x = stage.x + stage.width * (dx >= 0 ? .25 : .75), y = stage.y + Math.min(stage.height * .45,220);
  if (word) {
    const target = await box(page.getByTestId('indopak-word-1')); x = target.x + target.width / 2; y = target.y + target.height / 2;
    dx = Math.min(dx,stage.right - x - 8);
  }
  const client = await page.context().newCDPSession(page);
  const points = (px,py,second = multi === true) => [{x:px,y:py,id:1,radiusX:3,radiusY:3},...(second ? [{x:px+20,y:py+20,id:2,radiusX:3,radiusY:3}] : [])];
  try {
    await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(x,y)});
    for (let i=1;i<=8;i++) {
      if (multi === 'afterCapture' && i === 4) await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(x+dx*(i-1)/8,y+dy*(i-1)/8,true)});
      await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points(x+dx*i/8,y+dy*i/8,multi === true || (multi === 'afterCapture' && i >= 4))});
      await page.waitForTimeout(15);
    }
    await client.send('Input.dispatchTouchEvent',{type:cancel ? 'touchCancel' : 'touchEnd',touchPoints:[]});
    await pause(page);
  } finally { await client.detach(); }
}
async function expectPage(page, n) {
  await page.waitForFunction(n => document.querySelector('[data-testid="indopak-page-select"]')?.textContent.includes(`${n} / 548`),n);
  await page.getByTestId('indopak-page-outgoing').waitFor({state:'detached'}); await pause(page);
}
async function zoomIcon(page, plus) {
  const icon=page.getByTestId('indopak-zoom').locator('svg');
  assert.equal(await icon.locator('circle[cx="10.7"][r="6.7"]').count(),1,'A real magnifying-glass lens is drawn');
  assert.equal(await icon.locator('line[x1="15.5"][x2="21"]').count(),1,'The magnifier has a diagonal handle');
  assert.equal(await icon.locator('line[x1="10.7"][y1="7.7"]').count(),plus ? 1 : 0,'Plus/minus follows the next zoom action');
}
async function sampleMotion(page, action, expectedPage, direction, screenshot) {
  const before=await box(page.getByTestId('indopak-page-svg'));
  const stage=await box(page.getByTestId('indopak-page-viewport'));
  const left=Math.max(0,before.x-stage.x), right=Math.min(stage.width,before.right-stage.x);
  await page.evaluate(() => {
    window.__indopakSampling=true; window.__indopakFrames=[];
    const frame=()=>{
      if (!window.__indopakSampling) return;
      const find=id=>document.querySelector(`[data-testid="${id}"]`);
      const current=find('indopak-page-current'), outgoing=find('indopak-page-outgoing');
      const matrix=e=>{if(!e)return null;const m=new DOMMatrixReadOnly(getComputedStyle(e).transform); return {x:m.m41,y:m.m42,a:m.a,b:m.b,c:m.c,d:m.d};};
      const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right};};
      const mask=find('indopak-fold-mask'), face=find('indopak-fold-face'), edge=find('indopak-fold-edge'), paper=find('indopak-fold-paper');
      window.__indopakFrames.push({time:performance.now(),page:find('indopak-page-select')?.textContent,
        current:matrix(current),incoming:rect(find('indopak-page-svg')),outgoing:matrix(outgoing),
        hidden:outgoing?.getAttribute('aria-hidden'),targets:outgoing?.querySelectorAll('[data-testid^="indopak-word-"]').length,
        snapshot:rect(face?.querySelector('svg')),mask:matrix(mask),face:matrix(face),edge:matrix(edge),paper:matrix(paper),
        paperOpacity:paper ? Number(getComputedStyle(paper).opacity) : null,
        back:find('indopak-fold-back')?.getAttribute('d'),shadow:find('indopak-fold-shadow')?.getAttribute('fill'),
        gradients:edge?.querySelectorAll('linearGradient').length});
      requestAnimationFrame(frame);
    }; requestAnimationFrame(frame);
  });
  // Capture the real running animation, rather than disabling it or rendering a mock frame.
  const capture=screenshot ? (async()=>{
    await page.waitForFunction(({left,right})=>{
      const edge=document.querySelector('[data-testid="indopak-fold-edge"]');
      if(!edge)return false;
      const x=new DOMMatrixReadOnly(getComputedStyle(edge).transform).m41;
      return x>left+(right-left)*.23 && x<left+(right-left)*.77;
    },{left,right},{polling:'raf'});
    await page.screenshot({path:path.join(output,screenshot)});
  })():null;
  await action(); if(capture)await capture;
  await expectPage(page,expectedPage);
  const frames=await page.evaluate(()=>{window.__indopakSampling=false;return window.__indopakFrames;});
  const active=frames.filter(f=>f.page?.includes(`${expectedPage} / 548`) && f.outgoing);
  assert.ok(active.length>=3,'An actual multi-frame paper-fold transition is visible');
  assert.ok(active.some(f=>f.edge.x>left+20 && f.edge.x<right-20),'The fold crosses the visible paper, revealing the next page underneath');
  assert.ok(active.some(f=>f.paperOpacity>.5 && f.paper.a>.3),'The curved blank back and soft shadow become visible');
  let previous=-Infinity;
  for (const frame of active) {
    assert.equal(frame.hidden,'true'); assert.equal(frame.targets,0,'Outgoing scripture has no duplicate interactive verse targets');
    assert.ok(direction*frame.edge.x>=previous-1,'The crease advances monotonically in Quran RTL order'); previous=direction*frame.edge.x;
    assert.ok(frame.edge.x>=left-.5 && frame.edge.x<=right+.5,'The crease stays inside the visible paper');
    assert.ok(Math.abs(frame.mask.x+frame.face.x)<.1,'Counter-translation cancels the moving clip, keeping the ink anchored');
    assert.ok(Math.abs((direction===1 ? frame.mask.x : frame.mask.x+stage.width)-frame.edge.x)<.5,'The clip edge follows the decorative crease');
    for (const matrix of [frame.current,frame.outgoing,frame.mask,frame.face]) {
      assert.ok(Math.abs(matrix.a-1)<.001 && Math.abs(matrix.d-1)<.001 && Math.abs(matrix.b)<.001 && Math.abs(matrix.c)<.001,'No letter scale, reflection or skew is introduced');
    }
    assert.ok(Math.abs(frame.current.x)<.1 && Math.abs(frame.outgoing.x)<.1,'Neither Quran page slides');
    assert.ok(Math.abs(frame.snapshot.x-before.x)<1.5 && Math.abs(frame.snapshot.y-before.y)<1.5 && Math.abs(frame.snapshot.width-before.width)<1.5,'The outgoing ink retains its exact placement, zoom and both scroll offsets');
    assert.ok(Math.abs(frame.incoming.x-active[0].incoming.x)<1.5 && Math.abs(frame.incoming.y-active[0].incoming.y)<1.5,'The revealed next page remains stationary');
    assert.equal(frame.gradients,2,'Separate paper and soft shadow gradients are rendered');
    assert.ok(frame.back.includes(' C ') && frame.shadow.startsWith('url(#'),'Only the blank decorative back is curved/shaded');
  }
  const final=frames.at(-1); assert.ok(Math.abs(final.current.x)<.5 && !final.outgoing,'The old layer is removed and the current page ends at rest');
  return {frames:active.length,stationaryInk:true,curvedBlankBack:true,softShadow:true,rtlDirection:direction,first:active[0],last:active.at(-1),settled:final};
}
async function insets(page, values) {
  await page.getByTestId('system-window-boundary').first().evaluate((e, values) => {
    for (const edge of ['top','right','bottom','left']) e.style.setProperty(`padding-${edge}`, `${values[edge] || 0}px`, 'important');
  }, values); await pause(page);
}

module.exports = { makePage, box, pause, layout, gotoPage, expectPage, touchSwipe, insets };
if (require.main === module) (async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  const report = { method: 'Running production Expo WEB with bundled source assets, simulated insets; not a native Android/iOS device test', url, pages: [], profiles: [], insets: [], errors: [] };
  let active;
  try {
    const { context, page, errors } = await makePage(browser); active = page; report.errors.push(errors);
    assert.equal(await page.evaluate(k => localStorage.getItem(k), key), null, 'Opening does not write defaults over saved data');
    const before = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), originalKeys);
    await page.getByTestId('indopak-sources').click();
    const summary = page.getByTestId('indopak-source-summary');
    assert.equal(await summary.locator(':scope > *').count(),2);
    const sourceText = await summary.innerText(); assert.ok(sourceText.includes('QUL / Tarteel · QuranWBW'));
    assert.ok(!sourceText.includes('548 · 16') && !sourceText.includes('KFGQPC') && !sourceText.includes('11 / 59 / 242'));
    await page.screenshot({path:path.join(output,'concise-sources.png'),animations:'disabled'});
    await page.getByTestId('indopak-navigator').getByRole('button',{name:'Close',exact:true}).click();
    report.sourceSummary = sourceText;
    await page.evaluate(()=>{
      window.__indopakOutgoingAdds=0;
      new MutationObserver(records=>{
        for (const record of records) for (const node of record.addedNodes) if (node.nodeType===1 &&
          (node.matches('[data-testid="indopak-page-outgoing"]') || node.querySelector('[data-testid="indopak-page-outgoing"]'))) window.__indopakOutgoingAdds++;
      }).observe(document.querySelector('[data-testid="indopak-reader"]'),{childList:true,subtree:true});
    });
    await touchSwipe(page,{dx:-155}); await expectPage(page,1);
    assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null,'An outward boundary swipe does not save defaults');
    await touchSwipe(page,{dx:150,word:true}); await expectPage(page,2);
    assert.equal(await page.getByTestId('indopak-ayah-popover').count(),0,'Swipe starting on a verse must not open a verse modal');
    assert.equal(await page.evaluate(()=>window.__indopakOutgoingAdds),0,'Reduced motion creates no animated outgoing layer'); report.reducedMotion = true;
    await touchSwipe(page,{dx:155}); await expectPage(page,3);
    await touchSwipe(page,{dx:-155}); await expectPage(page,2);
    await touchSwipe(page,{dx:65,dy:-150}); await expectPage(page,2);
    await touchSwipe(page,{dx:155,multi:true}); await expectPage(page,2);
    await touchSwipe(page,{dx:155,multi:'afterCapture'}); await expectPage(page,2);
    await touchSwipe(page,{dx:155,cancel:true}); await expectPage(page,2);
    await touchSwipe(page,{dx:28}); await expectPage(page,2);
    await page.waitForTimeout(380);
    await page.getByTestId('indopak-page-svg').locator('rect[data-testid^="indopak-word-"]').first().tap();
    await page.getByTestId('indopak-ayah-popover').waitFor();
    await page.keyboard.press('Escape');
    await zoomIcon(page,true); await page.getByTestId('indopak-zoom').click(); await zoomIcon(page,true);
    const beforePan = await page.getByTestId('indopak-horizontal-scroll').evaluate(e=>e.scrollLeft);
    await touchSwipe(page,{dx:145}); await expectPage(page,2);
    const afterPan = await page.getByTestId('indopak-horizontal-scroll').evaluate(e=>e.scrollLeft);
    assert.ok(Math.abs(afterPan-beforePan)>10,'At 1.5× a horizontal drag pans, not a page turn');
    await touchSwipe(page,{dx:0,dy:-145}); await expectPage(page,2);
    assert.ok(await page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop>10),'Zoomed vertical panning still scrolls');
    await page.setViewportSize({width:280,height:1440}); await pause(page);
    const tallBefore = await page.getByTestId('indopak-horizontal-scroll').evaluate(e=>e.scrollLeft);
    await touchSwipe(page,{dx:100}); await expectPage(page,2);
    assert.ok(Math.abs(await page.getByTestId('indopak-horizontal-scroll').evaluate(e=>e.scrollLeft)-tallBefore)>10,'Zoomed horizontal panning survives a non-overflowing vertical wrapper');
    await page.getByTestId('indopak-zoom').click(); await page.getByTestId('indopak-zoom').click();
    await page.setViewportSize({width:390,height:844}); await pause(page);
    await gotoPage(page,548); await touchSwipe(page,{dx:155}); await expectPage(page,548);
    await touchSwipe(page,{dx:-155}); await expectPage(page,547);
    await page.waitForFunction(k => JSON.parse(localStorage.getItem(k) || '{}').page === 547,key);
    await page.getByTestId('screen-header').last().getByRole('button',{name:'Back',exact:true}).click();
    await page.getByTestId('floating-navigation-bar').waitFor();
    await page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded(); await page.getByTestId('qtile-16-line Quran').click();
    await expectPage(page,547); await page.getByTestId('floating-navigation-bar').waitFor({state:'detached'});
    report.swipes = {rightNext:true,leftPrevious:true,verseTapNotTriggered:true,subsequentVerseTap:true,verticalRejected:true,multiTouchRejected:true,addedFingerRejected:true,cancelRejected:true,shortDragRejected:true,zoomPan:true,boundaries:true,savedPageRestored:true};
    const targets = [1,2,3,76,77,100,200,274,400,500,529,530,548];
    for (const n of targets) { await gotoPage(page, n); report.pages.push({ page: n, ...(await layout(page, n)) }); }
    assert.equal(await page.getByTestId('indopak-next').count(),0);
    if (process.env.INDOPAK_SWEEP === '1') {
      await gotoPage(page, 1); await context.setOffline(true);
      const started = Date.now();
      for (let n = 1; n <= 548; n++) {
        if (n > 1) {
          await touchSwipe(page,{dx:155});
          await page.waitForFunction(n => document.querySelector('[data-testid="indopak-page-select"]')?.textContent.includes(`${n} / 548`), n);
        }
        await layout(page, n);
      }
      await context.setOffline(false);
      report.allPageSweep = { pages: 548, offline: true, reducedMotion: true, milliseconds: Date.now() - started, failedBounds: 0 };
      console.log('All 548 pages rendered offline with correct row counts and every original-font outline inside the printed body.');
    }
    await gotoPage(page,1); assert.equal(await page.getByTestId('indopak-previous').count(),0);
    await page.getByTestId('indopak-page-select').click(); await page.getByTestId('indopak-page-input').fill('604'); await page.getByTestId('indopak-page-go').click();
    await page.getByRole('alert').waitFor(); await page.getByTestId('indopak-page-input').fill('۲۷۴'); await page.getByTestId('indopak-page-go').click();
    await page.waitForFunction(() => document.querySelector('[data-testid="indopak-page-select"]')?.textContent.includes('274 / 548'));
    await page.getByTestId('indopak-save-page').click();
    await page.waitForFunction(k => JSON.parse(localStorage.getItem(k) || '{}').savedPages?.includes(274), key);
    await page.getByTestId('indopak-page-select').click(); await page.getByTestId('indopak-navigator').getByRole('button', { name: 'Bookmarks', exact: true }).click();
    await page.getByTestId('indopak-jump-bookmarks-274').click();
    await page.getByTestId('indopak-zoom').click(); await page.getByTestId('indopak-zoom').click();
    await page.waitForFunction(k => JSON.parse(localStorage.getItem(k) || '{}').zoom === 2, key); await zoomIcon(page,false); report.zoomIcons = true;
    assert.ok((await box(page.getByTestId('indopak-page-svg'))).width > (await box(page.getByTestId('indopak-page-viewport'))).width);
    await page.getByTestId('indopak-zoom').click();

    const profiles = [['compact',240,640],['cover',280,720],['small',320,568],['phone',390,844],['landscape',844,390],['tablet',800,1280],['tablet-landscape',1280,800],['foldable',884,1104],['desktop',1440,900]];
    for (const [name, width, height] of profiles) {
      await page.setViewportSize({ width, height }); await insets(page, {});
      report.profiles.push({ name, width, height, ...(await layout(page, 274)) });
      await page.screenshot({ path: path.join(output, `${name}.png`), animations: 'disabled' });
    }
    for (const [name, viewport, values] of [
      ['gestures',{width:390,height:844},{top:24,bottom:24}], ['buttons',{width:390,height:844},{top:24,bottom:48}],
      ['larger-keys',{width:280,height:720},{top:30,bottom:64}], ['side-keys',{width:844,height:390},{top:24,right:48}],
      ['left-keys',{width:844,height:390},{top:24,left:48}],
    ]) { await page.setViewportSize(viewport); await insets(page, values); report.insets.push({ name, ...(await layout(page, 274)) }); }
    await page.setViewportSize({width:844,height:390}); await insets(page,{});
    await touchSwipe(page,{dx:0,dy:-150}); await expectPage(page,274);
    assert.ok(await page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop>10),'An overflowing 1× landscape page still scrolls vertically');
    await touchSwipe(page,{dx:155}); await expectPage(page,275);
    await touchSwipe(page,{dx:-155}); await expectPage(page,274);
    assert.equal(await page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop),0,'A swipe resets the new page to the top');
    report.swipes.landscapeVerticalScroll = true;
    await page.setViewportSize({ width: 390, height: 844 }); await insets(page, {});
    report.modals = [];
    for (const viewport of [{width:320,height:568},{width:844,height:390}]) {
      await page.setViewportSize(viewport); await insets(page, {});
      for (const kind of ['page','surah','juz','bookmarks','sources','verse-list']) {
        if (kind === 'surah' || kind === 'juz' || kind === 'sources') await page.getByTestId(`indopak-${kind}`).click();
        else if (kind === 'page' || kind === 'bookmarks') {
          await page.getByTestId('indopak-page-select').click();
          if (kind === 'bookmarks') await page.getByTestId('indopak-navigator').getByRole('button',{name:'Bookmarks',exact:true}).click();
        } else {
          await page.getByRole('button',{name:'Verse',exact:true}).click();
        }
        const panel = page.getByTestId('indopak-navigator');
        // Android has a separate SystemModal boundary; the web portal intentionally
        // does not. Simulate that separate window on the modal root, NOT on the
        // unrelated app boundary behind the portal.
        const parent = await panel.evaluate(e => {
          const root = e.parentElement;
          const inset = {top:24,bottom:48,left:12,right:24};
          for (const [edge,n] of Object.entries(inset)) root.style.setProperty(`padding-${edge}`,`${n + 12}px`,'important');
          const r = root.getBoundingClientRect();
          return {x:r.x+inset.left,y:r.y+inset.top,right:r.right-inset.right,bottom:r.bottom-inset.bottom};
        }); await pause(page);
        const bounds = await box(panel); inside(bounds,parent,`${kind} modal safe frame`);
        const close = panel.getByRole('button',{name:'Close',exact:true}).last(); inside(await box(close),bounds,`${kind} Close`);
        report.modals.push({viewport,kind,parent,bounds}); await close.click();
      }
    }
    await page.setViewportSize({width:390,height:844}); await insets(page,{});
    const after = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])), originalKeys);
    assert.deepEqual(after, before, 'New reader/page bookmarks/zoom never rewrite existing preferences, position, notes or bookmarks');
    const restored = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), key); assert.equal(restored.page, 274); assert.deepEqual(restored.savedPages, [274]);

    // Offline after the local font has loaded: exercise an as-yet-unopened chunk, not cached API text.
    await context.setOffline(true); await gotoPage(page, 547); await layout(page, 547); await gotoPage(page, 274);
    await context.setOffline(false); report.offline = { passed: true, pages: [547,274], source: 'bundled assets; no text or layout API requests' };
    await page.getByTestId('screen-header').last().getByRole('button', { name: 'Back', exact: true }).click();
    await page.getByTestId('floating-navigation-bar').waitFor();
    for (const tab of ['home','prayer','library','tools','quran']) {
      await page.getByTestId(`navigation-${tab}`).click(); await page.getByTestId('floating-navigation-bar').waitFor();
    }
    await page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded(); await page.getByTestId('qtile-16-line Quran').click();
    await page.getByTestId('floating-navigation-bar').waitFor({state:'detached'}); report.menuRestoredOnExit = true;
    await page.waitForFunction(() => document.querySelector('[data-testid="indopak-page-select"]')?.textContent.includes('274 / 548'));
    assert.equal(await page.getByTestId('indopak-save-page').getAttribute('aria-checked'), 'true'); report.restored = true;

    await page.getByTestId('indopak-surah').click(); await page.getByRole('textbox', { name: 'Search', exact: true }).fill('55');
    await page.getByTestId('indopak-jump-surah-55').click();
    assert.ok((await page.getByTestId('indopak-page-select').innerText()).includes(`${meta.chapters[54].page} / 548`));
    await page.getByTestId('indopak-juz').click(); await page.getByRole('textbox', { name: 'Search', exact: true }).fill('30');
    await page.getByTestId('indopak-jump-juz-30').click();
    assert.ok((await page.getByTestId('indopak-page-select').innerText()).includes(`${meta.juz[29].page} / 548`)); report.directories = true;
    await gotoPage(page, meta.chapters[54].page);
    const word55 = await page.getByTestId('indopak-page-svg').locator('rect').filter({ hasText: /^$/ }).count(); assert.ok(word55 > 0);
    // Accessibility alternative to tiny word targets, then an actual word hit target.
    await page.getByRole('button', { name: 'Verse', exact: true }).click();
    await page.getByTestId('indopak-jump-verse-55:5').click(); await page.getByTestId('indopak-ayah-popover').waitFor();
    assert.equal(await page.evaluate(() => window.__indopakPlays.length), 0, 'Cold player: no earlier audio plays');
    await page.getByTestId('indopak-ayah-play').click(); await page.getByTestId('mini-player').waitFor();
    await page.waitForFunction(() => window.__indopakMedia.some(a => (a.currentSrc || a.src).includes('/ar.alafasy/4906.mp3') && !a.paused && a.currentTime > .2));
    assert.ok((await page.evaluate(() => window.__indopakPlays[0])).endsWith('/ar.alafasy/4906.mp3'));
    const media = await page.evaluate(() => window.__indopakMedia.map(a => ({ url:a.currentSrc || a.src,paused:a.paused,readyState:a.readyState,position:a.currentTime })).filter(a=>a.url.includes('/4906.mp3')));
    assert.ok(media.length); report.audio = media;
    await page.getByRole('button', { name: 'Pause recitation', exact: true }).click(); await layout(page);
    report.activeAudio = [];
    for (const [name,viewport,values] of [
      ['small',{width:320,height:568},{}], ['buttons',{width:390,height:844},{top:24,bottom:48}],
      ['larger-keys',{width:280,height:720},{top:30,bottom:64}], ['side-keys',{width:844,height:390},{top:24,right:48}],
      ['left-keys',{width:844,height:390},{top:24,left:48}],
    ]) {
      await page.setViewportSize(viewport); await insets(page,values);
      report.activeAudio.push({name,...(await layout(page))});
    }
    await page.setViewportSize({width:390,height:844}); await insets(page,{});
    await page.screenshot({path:path.join(output,'reader-with-audio.png'),animations:'disabled'});
    await page.getByRole('button',{name:'Open the audio player',exact:true}).click();
    await page.getByTestId('screen-header').last().getByText('Now playing',{exact:true}).waitFor(); await page.getByTestId('floating-navigation-bar').waitFor();
    const normalPlayer = await box(page.getByTestId('mini-player'));
    assert.ok(Math.abs(844-normalPlayer.bottom-96)<2,'The existing player position is unchanged away from this reader');
    await page.getByTestId('screen-header').last().getByRole('button',{name:'Back',exact:true}).click();
    await page.getByTestId('floating-navigation-bar').waitFor({state:'detached'}); await layout(page);
    report.audioScreenMenuRestored = true;
    await page.getByRole('button', { name: 'Verse', exact: true }).click(); await page.getByTestId('indopak-jump-verse-55:5').click();
    await page.getByTestId('indopak-ayah-translation').click(); await page.getByTestId('reader-header').waitFor();
    await page.getByText('55:5', { exact:true }).waitFor(); report.existingReader = true;
    await page.getByTestId('floating-navigation-bar').waitFor();
    await page.getByTestId('reader-header').getByRole('button',{name:'Go back',exact:true}).click();
    await page.getByTestId('indopak-reader').waitFor(); await page.getByTestId('floating-navigation-bar').waitFor({state:'detached'});
    await page.getByRole('button',{name:'Close the player',exact:true}).click();
    await page.getByTestId('mini-player').waitFor({state:'detached'}); await layout(page);
    await context.close();

    for (const [language,dark] of [['ur',false],['en',true]]) {
      const next = await makePage(browser,language,dark); active = next.page; report.errors.push(next.errors);
      await gotoPage(next.page,274); await layout(next.page,274);
      if(language==='ur') { await touchSwipe(next.page,{dx:155}); await expectPage(next.page,275); await touchSwipe(next.page,{dx:-155}); await expectPage(next.page,274); await next.page.waitForTimeout(380); report.rtlSwipes = true; }
      await next.page.setViewportSize({width:280,height:720}); await layout(next.page,274);
      await next.page.setViewportSize({width:390,height:844}); await pause(next.page);
      const firstWord = next.page.getByTestId('indopak-page-svg').locator('rect[data-testid^="indopak-word-"]').first();
      await firstWord.click(); await next.page.getByTestId('indopak-ayah-popover').waitFor();
      await next.page.screenshot({path:path.join(output,`${language}-${dark?'dark':'rtl'}-verse.png`),animations:'disabled'});
      await next.context.close();
    }
    const motion=await makePage(browser,'en',false,'no-preference'); active=motion.page; report.errors.push(motion.errors);
    await motion.page.waitForTimeout(450);
    report.motion={
      next:await sampleMotion(motion.page,()=>touchSwipe(motion.page,{dx:155}),2,1,'next-page-in-motion.png'),
      previous:await sampleMotion(motion.page,()=>touchSwipe(motion.page,{dx:-155}),1,-1,'previous-page-in-motion.png'),
    };
    report.motion.jump=await sampleMotion(motion.page,()=>gotoPage(motion.page,274),274,1);
    await motion.page.getByTestId('indopak-zoom').click();
    await touchSwipe(motion.page,{dx:120}); await touchSwipe(motion.page,{dx:0,dy:-145});
    report.motion.zoomedJump=await sampleMotion(motion.page,()=>gotoPage(motion.page,400),400,1);
    await touchSwipe(motion.page,{dx:110}); await touchSwipe(motion.page,{dx:0,dy:-110});
    report.motion.zoomedPreviousJump=await sampleMotion(motion.page,()=>gotoPage(motion.page,274),274,-1,'zoomed-page-fold.png');
    await motion.page.getByTestId('indopak-zoom').click(); await motion.page.getByTestId('indopak-zoom').click();
    await motion.page.setViewportSize({width:844,height:390}); await pause(motion.page);
    await touchSwipe(motion.page,{dx:0,dy:-150});
    assert.ok(await motion.page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop>10),'Landscape fold starts from a real scrolled position');
    report.motion.scrolledLandscape=await sampleMotion(motion.page,()=>touchSwipe(motion.page,{dx:155}),275,1,'landscape-page-fold.png');
    assert.equal(await motion.page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop),0,'The revealed page resets to the top, independently of the outgoing snapshot');
    await touchSwipe(motion.page,{dx:0,dy:-110});
    report.motion.scrolledLandscapePrevious=await sampleMotion(motion.page,()=>touchSwipe(motion.page,{dx:-155}),274,-1);
    await motion.page.setViewportSize({width:280,height:720}); await pause(motion.page);
    report.motion.compact=await sampleMotion(motion.page,()=>touchSwipe(motion.page,{dx:110}),275,1,'compact-page-fold.png');
    await motion.page.setViewportSize({width:390,height:844}); await pause(motion.page);
    await gotoPage(motion.page,274);
    await touchSwipe(motion.page,{dx:155});
    assert.equal(await motion.page.getByTestId('indopak-page-outgoing').count(),1,'Resize test interrupts an in-flight turn');
    await motion.page.setViewportSize({width:844,height:390});
    await expectPage(motion.page,275); await layout(motion.page,275); report.motion.resizeSettled=true;
    await touchSwipe(motion.page,{dx:155});
    assert.equal(await motion.page.getByTestId('indopak-page-outgoing').count(),1,'Reduce-motion test interrupts an in-flight turn');
    await motion.page.emulateMedia({reducedMotion:'reduce'});
    await expectPage(motion.page,276); await layout(motion.page,276); report.motion.reducedMotionChangeSettled=true;
    await motion.page.emulateMedia({reducedMotion:'no-preference'}); await motion.page.waitForTimeout(60);
    await touchSwipe(motion.page,{dx:155});
    assert.equal(await motion.page.getByTestId('indopak-page-outgoing').count(),1,'Leaving interrupts an in-flight turn');
    await motion.page.getByTestId('screen-header').last().getByRole('button',{name:'Back',exact:true}).click();
    await motion.page.getByTestId('floating-navigation-bar').waitFor();
    await motion.page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded(); await motion.page.getByTestId('qtile-16-line Quran').click();
    await expectPage(motion.page,277); await motion.page.getByTestId('floating-navigation-bar').waitFor({state:'detached'});
    report.motion.unmountCleanupAndRestore=true; await motion.context.close();
    report.motion.variants=[];
    for(const [language,dark] of [['ur',false],['en',true]]) {
      const variant=await makePage(browser,language,dark,'no-preference'); active=variant.page; report.errors.push(variant.errors);
      await variant.page.waitForTimeout(450); await gotoPage(variant.page,274);
      const next=await sampleMotion(variant.page,()=>touchSwipe(variant.page,{dx:155}),275,1,`${language}-${dark?'dark':'rtl'}-page-fold.png`);
      const previous=await sampleMotion(variant.page,()=>touchSwipe(variant.page,{dx:-155}),274,-1);
      report.motion.variants.push({language,dark,next,previous}); await variant.context.close();
    }
    report.localizedTop=[];
    for (const language of ['en','ar','ur','fa','ps','fr','tr','ru','uz','kk','zh','vi','az','bs','bg','si','bn','hi','id','ms','ta','ml']) {
      const translated=await makePage(browser,language); active=translated.page; report.errors.push(translated.errors);
      await gotoPage(translated.page,274);
      for (const width of [280,390]) {
        await translated.page.setViewportSize({width,height:720});
        const result=await layout(translated.page,274);
        report.localizedTop.push({language,width,top:result.top,counter:result.counter});
      }
      await translated.context.close();
    }
    const themed = await makePage(browser,'en','system'); active = themed.page; report.errors.push(themed.errors);
    await gotoPage(themed.page,274);
    await themed.page.waitForFunction(k=>JSON.parse(localStorage.getItem(k) || '{}').page===274,key);
    for (const colorScheme of ['dark','light']) {
      await themed.page.emulateMedia({colorScheme});
      await themed.page.waitForFunction(dark=>{
        const fill = document.querySelector('[data-testid="indopak-page-svg"] > rect')?.getAttribute('fill');
        return !!fill && (dark ? fill !== '#fffdf5' : fill === '#fffdf5');
      },colorScheme==='dark');
      await expectPage(themed.page,274); await layout(themed.page,274);
    }
    await themed.page.getByTestId('screen-header').last().getByRole('button',{name:'Back',exact:true}).click();
    await themed.page.getByTestId('floating-navigation-bar').waitFor();
    report.themeRemount = {darkAndLight:true,pageRestored:true,menuScoped:true}; await themed.context.close();
    for (const errors of report.errors) for (const [type, values] of Object.entries(errors)) assert.deepEqual(values, [], `${type} errors`);
    console.log(JSON.stringify({pages:report.pages.length,profiles:report.profiles.length,insets:report.insets.length,modals:report.modals.length,swipes:report.swipes,menuRestored:report.menuRestoredOnExit,rtlSwipes:report.rtlSwipes,zoomIcons:report.zoomIcons,reducedMotion:report.reducedMotion,motion:report.motion ? {nextFrames:report.motion.next.frames,previousFrames:report.motion.previous.frames,jumpFrames:report.motion.jump.frames,zoomedJumpFrames:report.motion.zoomedJump.frames,zoomedPreviousFrames:report.motion.zoomedPreviousJump.frames,landscapeFrames:report.motion.scrolledLandscape.frames,landscapePreviousFrames:report.motion.scrolledLandscapePrevious.frames,compactFrames:report.motion.compact.frames,variants:report.motion.variants.map(v=>({language:v.language,dark:v.dark,nextFrames:v.next.frames,previousFrames:v.previous.frames})),resizeSettled:report.motion.resizeSettled,reducedMotionChangeSettled:report.motion.reducedMotionChangeSettled,unmountCleanupAndRestore:report.motion.unmountCleanupAndRestore}:null,activeAudio:report.activeAudio.length,audioScreenMenuRestored:report.audioScreenMenuRestored,themeRemount:report.themeRemount,localizedTop:report.localizedTop.length,offline:report.offline,allPageSweep:report.allPageSweep,restored:report.restored,audio:report.audio,existingReader:report.existingReader,errors:report.errors},null,2));
  } catch(error) {
    report.failure = error.stack || String(error); if(active && !active.isClosed()) await active.screenshot({path:path.join(output,'failure.png')}).catch(()=>{}); throw error;
  } finally { fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
