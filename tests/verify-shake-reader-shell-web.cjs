/** Root/overlay regression after adding a native-only shortcut. Actual
 * original IndoPak pages, normal motion, no fake native shake UI on web. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const{chromium}=require('playwright');
const{makePage,gotoPage,box,pause}=require('./verify-indopak-web.cjs');
const{createLoader}=require('./helpers/load-typescript.cjs');
const load=createLoader(),{tx,loadCopy}=load('src/services/arabicCopy.ts');
const output=process.env.SHAKE_SHELL_ARTIFACTS_DIR||'/tmp/islamic-r110-reader-shell';
const keys=['@deen/quran/preferences/v1','@deen/quran/position/v1','@deen/quran/bookmarks/v1','@deen/quran/notes/v1','@deen/audio-settings/v1'];
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch();const report={method:'Actual production web, normal motion, original supplied IndoPak pages, real Focus/Unlock/Back and overlays. Not native gesture/sensor/device QA.',contexts:[],errors:[]};let active;
 try{
  for(const language of ['en','ar','ur']){
   await loadCopy(language);const h=await makePage(browser,language,language!=='en','no-preference',{}, {version:1,page:274,readingPoint:{page:478,verse:'55:5',wordId:77600},bookmarks:[274]});const{page}=h;active=page;report.errors.push(h.errors);await gotoPage(page,274);await page.waitForTimeout(300);const before=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),keys);
   assert.equal(await page.getByTestId('floating-navigation-bar').count(),0);assert.equal(await page.getByTestId('indopak-top-controls').count(),1);await page.getByTestId('indopak-focus').click();await page.getByTestId('indopak-unlock').waitFor();await pause(page);
   for(const id of ['indopak-top-controls','screen-header','floating-navigation-bar','mini-player','shake-report-prompt'])assert.equal(await page.getByTestId(id).count(),0,id);
   for(const[width,height]of [[390,844],[844,390],[390,844]]){
    await page.setViewportSize({width,height});await pause(page);const safe=await box(page.getByTestId('system-safe-content').first()),viewport=await box(page.getByTestId('indopak-page-viewport')),unlock=await box(page.getByTestId('indopak-unlock'));
    assert.ok(Math.abs(safe.width-viewport.width)<1.1&&Math.abs(safe.height-viewport.height)<1.1);assert.ok(Math.abs(unlock.right-(safe.right-8))<1.1&&Math.abs(unlock.y-(safe.y+8))<1.1);assert.equal(await page.getByTestId('indopak-page-svg').locator('[data-testid^="indopak-line-"]').count(),16);
   }
   await page.screenshot({path:path.join(output,`focus-preserved-${language}.png`),animations:'disabled'});
   await page.getByTestId('indopak-unlock').click();await page.getByTestId('indopak-top-controls').waitFor();assert.equal(await page.getByTestId('floating-navigation-bar').count(),0);assert.equal(await page.getByTestId('indopak-unlock').count(),0);assert.deepEqual(await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),keys),before);
   await page.getByTestId('screen-header').last().getByRole('button').first().click();await page.getByTestId('floating-navigation-bar').waitFor();await page.getByRole('button',{name:tx(language,'Settings'),exact:true}).click();await page.getByTestId('settings-report-feature').waitFor();assert.equal(await page.getByTestId('settings-shake-report').count(),0);assert.equal(await page.getByTestId('settings-report-feature').getAttribute('href'),'https://forms.gle/9jbqgcvUTBDV4g9Z6');
   report.contexts.push({language,normalMotion:true,original16Lines:true,focusAndUnlock:true,physicalTopRightUnlock:true,rotation:true,tabChromeRestoredOnlyAfterLeavingReader:true,oldReaderAndAudioPreferencesPreserved:true,nativeShortcutAbsentOnWeb:true});await h.context.close();
  }
  for(const group of report.errors)for(const[kind,items]of Object.entries(group))assert.deepEqual(items,[],kind);console.log(JSON.stringify({contexts:report.contexts.length,allErrorsEmpty:true},null,2));
 }catch(error){report.failure=error.stack||String(error);if(active&&!active.isClosed())await active.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});throw error;}
 finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
