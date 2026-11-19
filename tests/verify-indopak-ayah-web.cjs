/** Real production WEB, actual touch holds/storage/assets; not Android/iOS device QA.
 * INDOPAK_URL=http://127.0.0.1:8106 node tests/verify-indopak-ayah-web.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { makePage, box, pause, gotoPage, expectPage, touchSwipe, insets, openDirectory } = require('./verify-indopak-web.cjs');
const output = process.env.INDOPAK_AYAH_ARTIFACTS_DIR || '/tmp/islamic-r98-ayah-smoke';
const key = '@deen/quran/indopak-taj-16/state/v1';
const oldKeys = ['@deen/quran/preferences/v1','@deen/quran/position/v1','@deen/quran/bookmarks/v1','@deen/quran/notes/v1'];
const read = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), key);
async function visibleWords(page) {
  return page.getByTestId('indopak-page-viewport').evaluate(stage => {
    const bounds = stage.getBoundingClientRect();
    return Array.from(stage.querySelectorAll('rect[data-testid^="indopak-word-"]')).map(e => {
      const r = e.getBoundingClientRect();
      return { id: Number(e.getAttribute('data-testid').split('-').at(-1)), verse: e.getAttribute('aria-label').match(/\d+:\d+/)[0], x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom };
    }).filter(r=>r.x<bounds.right-4 && r.right>bounds.x+4 && r.y>bounds.y+4 && r.bottom<bounds.bottom-4);
  });
}
async function checkPopup(page, selected) {
  const popup = page.getByTestId('indopak-ayah-popover'); await popup.waitFor(); await pause(page);
  const bounds = await box(popup), stage = await box(page.getByTestId('indopak-page-viewport'));
  assert.ok(bounds.x>=stage.x && bounds.right<=stage.right && bounds.y>=stage.y && bounds.bottom<=stage.bottom,'The anchored popup stays in the safe page viewport, not a modal sheet');
  assert.equal(await popup.getByRole('button').count(),3); assert.equal((await popup.innerText()).trim(),'','Only the three icons, with no visible text or close button');
  const targets=[];
  for(const action of ['play','translation','mark']) {
    const button = page.getByTestId(`indopak-ayah-${action}`), rect = await box(button);
    assert.ok(rect.width>=43.9 && rect.height>=43.9,'Every icon retains a 44px target');
    assert.ok(rect.x>=bounds.x && rect.right<=bounds.right && rect.y>=bounds.y && rect.bottom<=bounds.bottom);
    assert.ok((await button.getAttribute('aria-label')).includes(selected.verse),'All actions carry the exact canonical ayah in their accessible name');
    assert.equal(await button.locator('svg').count(),1);
    for(const other of targets) assert.ok(rect.x>=other.right-1 || rect.right<=other.x+1,'Icon targets never overlap');
    targets.push(rect);
  }
  assert.equal(await page.getByTestId('indopak-verse-panel').count(),0,'The old large verse panel has been removed');
  const highlight = page.locator(`[data-testid^="indopak-highlight-${selected.verse}-"]`);
  assert.ok(await highlight.count()>0,'The complete selected ayah is highlighted in its original page lines');
  if(selected.id) {
    const word = await box(page.getByTestId(`indopak-word-${selected.id}`));
    assert.ok(bounds.bottom<=word.y+1 || bounds.y>=word.bottom-1,'The popup sits above the tapped ayah, or below at the top edge, without covering it');
  }
  return {bounds,stage,targets,verse:selected.verse};
}
async function tapWord(page, word) {
  const locator=page.getByTestId(`indopak-word-${word.id}`), r=await box(locator), stage=await box(page.getByTestId('indopak-page-viewport'));
  await page.touchscreen.tap((Math.max(r.x,stage.x+2)+Math.min(r.right,stage.right-2))/2,(Math.max(r.y,stage.y+2)+Math.min(r.bottom,stage.bottom-2))/2);
  await page.getByTestId('indopak-ayah-popover').waitFor(); return checkPopup(page,word);
}
async function pressWord(page, word, {early, multi=false, added=false, cancel=false, move=false, resize=false, short=false}={}) {
  const r=await box(page.getByTestId(`indopak-word-${word.id}`)), stage=await box(page.getByTestId('indopak-page-viewport'));
  const x=(Math.max(r.x,stage.x+2)+Math.min(r.right,stage.right-2))/2, y=(Math.max(r.y,stage.y+2)+Math.min(r.bottom,stage.bottom-2))/2;
  const client=await page.context().newCDPSession(page), points=n=>[{x,y,id:1,radiusX:3,radiusY:3},...(n===2?[{x:x+8,y:y+8,id:2,radiusX:3,radiusY:3}]:[])];
  try {
    await page.evaluate(()=>{window.__ayahHoldStarted=performance.now();});
    await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(multi?2:1)});
    await page.waitForTimeout(200);
    if(added) await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(2)});
    if(cancel || short) await client.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});
    if(move) await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...points(1)[0],x:x+22,y:y+22}]});
    if(resize) await page.setViewportSize({width:844,height:390});
    await page.waitForTimeout(150); if(early) await early();
    await page.waitForTimeout(300);
    const held = await read(page);
    if(!cancel && !short) await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await pause(page); return held;
  } finally { await client.detach(); }
}
async function chooseVerse(page, verse) {
  await openDirectory(page,'verse');
  await page.getByTestId(`indopak-jump-verse-${verse}`).click();
  await page.getByTestId('indopak-ayah-popover').waitFor(); await pause(page);
}
async function resume(page) {
  await page.getByTestId('indopak-page-select').click();
  await page.getByTestId('indopak-navigator').getByRole('tab',{name:'Bookmarks',exact:true}).click();
  await page.getByTestId('indopak-resume').click();
}
(async()=>{
  fs.mkdirSync(output,{recursive:true}); const browser=await chromium.launch();
  const report={method:'Real touch input and original-font pages in production Expo WEB; no mocked data, storage or action callbacks; not physical-device QA',checks:{},layouts:[],localized:[],errors:[]}; let active;
  try {
    const own=await makePage(browser); active=own.page; report.errors.push(own.errors); const {page}=own;
    const old = await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),oldKeys);
    await page.evaluate(k=>{
      window.__ayahWrites=[]; const set=Storage.prototype.setItem;
      Storage.prototype.setItem=function(key,value){if(key===k)window.__ayahWrites.push({time:performance.now(),value:JSON.parse(value)});return Reflect.apply(set,this,[key,value]);};
    },key);
    await gotoPage(page,274); await page.waitForTimeout(400);
    let words=await visibleWords(page), a=words[Math.floor(words.length*.3)];
    report.layouts.push({name:'phone',...(await tapWord(page,a))});
    assert.equal((await read(page)).readingPoint,null,'A normal tap opens actions without overwriting the reading position');
    await page.screenshot({path:path.join(output,'phone-ayah-popup.png')});
    const stageBox=await box(page.getByTestId('indopak-page-viewport'));
    await page.mouse.click(stageBox.x+3,stageBox.y+3); await page.getByTestId('indopak-ayah-popover').waitFor({state:'detached'});
    report.checks.outsideClickDismisses=true; await tapWord(page,a);
    const markBox=await box(page.getByTestId('indopak-ayah-mark'));
    await page.mouse.move(markBox.x+22,markBox.y+22); await page.mouse.down(); await page.mouse.move(markBox.x+150,markBox.y+22,{steps:8}); await page.mouse.up();
    await expectPage(page,274); assert.equal((await read(page)).readingPoint,null,'Dragging an icon cannot turn a page or mark an ayah');
    report.checks.iconDragRejected=true;
    await page.getByTestId('indopak-ayah-mark').tap();
    await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key)||'{}').readingPoint?.wordId===id,{key,id:a.id});
    const first=(await read(page)).readingPoint; assert.equal(first.verse,a.verse); assert.equal(first.page,274);
    assert.equal(await page.getByTestId('indopak-ayah-mark').getAttribute('aria-pressed'),'true');
    await page.keyboard.press('Escape'); assert.ok(await page.locator(`[data-testid^="indopak-highlight-${a.verse}-"]`).count()>0,'The marked ayah stays visibly marked after dismissing the popup');
    const b=words.find(w=>w.verse!==a.verse && w.id>a.id) || words.find(w=>w.verse!==a.verse);
    await pressWord(page,b,{early:async()=>assert.deepEqual((await read(page)).readingPoint,first,'350ms is too early to replace the marker')});
    const second=(await read(page)).readingPoint; assert.equal(second.wordId,b.id); assert.equal(second.verse,b.verse);
    const delay=await page.evaluate(()=>window.__ayahWrites.at(-1).time-window.__ayahHoldStarted);
    assert.ok(delay>=490,`The save waits for the half-second hold: ${delay}`); report.checks.holdDelayMs=delay;
    await checkPopup(page,b); await page.screenshot({path:path.join(output,'held-ayah-marked.png')}); await page.keyboard.press('Escape');
    const c=words.find(w=>w.id!==b.id && w.verse!==b.verse);
    for(const [name,options] of [['short',{short:true}],['multiStart',{multi:true}],['addedFinger',{added:true}],['cancelled',{cancel:true}],['moved',{move:true}],['resized',{resize:true}]]) {
      if(name!=='short') { await page.setViewportSize({width:390,height:844}); await gotoPage(page,274); await page.waitForTimeout(400); }
      await pressWord(page,c,options); assert.deepEqual((await read(page)).readingPoint,second,`${name} press must not move the reading marker`);
      report.checks[name+'Rejected']=true;
    }
    await page.setViewportSize({width:390,height:844}); await gotoPage(page,274); await page.waitForTimeout(400);
    await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-unlock').waitFor(); await pause(page);
    words=await visibleWords(page); const focused=words[Math.floor(words.length/2)];
    await pressWord(page,focused); const exact=(await read(page)).readingPoint; assert.equal(exact.wordId,focused.id); assert.equal((await read(page)).zoom,1);
    report.layouts.push({name:'focused',...(await checkPopup(page,focused))}); await page.screenshot({path:path.join(output,'focused-ayah-popup.png')}); await page.keyboard.press('Escape');
    await page.getByTestId('indopak-unlock').click(); await page.getByTestId('indopak-top-controls').waitFor();
    await gotoPage(page,400); assert.deepEqual((await read(page)).readingPoint,exact,'Browsing other pages does not move the explicit reading marker');
    await resume(page); await expectPage(page,274); await pause(page);
    const resumed=await box(page.getByTestId(`indopak-word-${exact.wordId}`)), viewport=await box(page.getByTestId('indopak-page-viewport'));
    assert.ok(resumed.x<viewport.right && resumed.right>viewport.x && resumed.y>=viewport.y && resumed.bottom<=viewport.bottom,'Continue reading reveals the exact marked word/line without depending on the removed zoom');
    assert.deepEqual((await read(page)).readingPoint,exact); assert.deepEqual((await read(page)).savedPages,[],'Ayah marking never changes page bookmarks');
    report.checks.exactResume=true;
    await page.getByTestId('screen-header').last().getByRole('button',{name:'Back',exact:true}).click();
    await page.getByTestId('qtile-16-line Quran').scrollIntoViewIfNeeded(); await page.getByTestId('qtile-16-line Quran').click();
    await expectPage(page,274); await pause(page);
    const reopened=await box(page.getByTestId(`indopak-word-${exact.wordId}`)); assert.ok(reopened.y>=viewport.y && reopened.bottom<=viewport.bottom,'Reopening the marked page automatically reveals the exact saved place');
    assert.deepEqual((await read(page)).readingPoint,exact); report.checks.reopenRestored=true;
    const after=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),oldKeys); assert.deepEqual(after,old); report.checks.existingDataUntouched=true;
    await page.setViewportSize({width:844,height:390}); await pause(page);
    await openDirectory(page,'verse'); const last=page.locator('[data-testid^="indopak-jump-verse-"]').last(), lastKey=(await last.getAttribute('data-testid')).replace('indopak-jump-verse-',''); await last.click();
    await page.getByTestId('indopak-ayah-popover').waitFor(); report.layouts.push({name:'landscape-verse-list',...(await checkPopup(page,{verse:lastKey}))});
    await page.screenshot({path:path.join(output,'landscape-ayah-popup.png')}); await page.keyboard.press('Escape'); report.checks.verseListReveals=true;
    await page.setViewportSize({width:390,height:844}); await pause(page);
    await chooseVerse(page,lastKey);
    await page.getByTestId('indopak-focus').click(); await page.getByTestId('indopak-ayah-popover').waitFor({state:'detached'}); report.checks.focusDismisses=true;
    await pause(page); words=await visibleWords(page); const focusTap=words[Math.floor(words.length/2)]; await tapWord(page,focusTap);
    await page.getByTestId('indopak-unlock').click(); await page.getByTestId('indopak-ayah-popover').waitFor({state:'detached'}); report.checks.unlockDismisses=true;
    await page.setViewportSize({width:844,height:390}); await pause(page);
    await chooseVerse(page,lastKey); const beforeScroll=await page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop);
    await touchSwipe(page,{dx:0,dy:110}); await page.getByTestId('indopak-ayah-popover').waitFor({state:'detached'});
    assert.ok(Math.abs(await page.getByTestId('indopak-vertical-scroll').evaluate(e=>e.scrollTop)-beforeScroll)>10,'Real landscape scrolling dismisses the popup without changing the marker');
    report.checks.panDismisses=true;
    await own.context.close();

    for(const language of ['en','ar','ur','fa','ps','fr','tr','ru','uz','kk','zh','vi','az','bs','bg','si','bn','hi','id','ms','ta','ml']) {
      const local=await makePage(browser,language,language==='en'); active=local.page; report.errors.push(local.errors);
      await gotoPage(local.page,274); await local.page.waitForTimeout(400);
      for(const width of [280,390]) {
        await local.page.setViewportSize({width,height:720}); await pause(local.page);
        const items=await visibleWords(local.page), chosen=items[Math.floor(items.length*.45)];
        const result=await tapWord(local.page,chosen); report.localized.push({language,width,...result});
        if(width===390 && ['en','ur'].includes(language)) await local.page.screenshot({path:path.join(output,`${language}-${language==='en'?'dark':'rtl'}-ayah-popup.png`)});
        await local.page.keyboard.press('Escape');
      }
      await local.context.close();
    }
    for(const errors of report.errors) for(const [kind,values] of Object.entries(errors)) assert.deepEqual(values,[],`${kind} errors`);
    console.log(JSON.stringify({checks:report.checks,layouts:report.layouts.map(l=>l.name),localized:report.localized.length,errorFreeContexts:report.errors.length},null,2));
  }catch(error){report.failure=error.stack||String(error); if(active&&!active.isClosed())await active.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});throw error;}
  finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
