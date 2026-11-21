/** Real production app navigation and text/layout checks, not native shake
 * simulation. Motion and geolocation APIs are trip-wired: web must not ask.
 * SHAKE_WEB_URL=http://127.0.0.1:8118 node tests/verify-shake-location-web.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const{chromium}=require('playwright');
const{createLoader}=require('./helpers/load-typescript.cjs');
const load=createLoader();
const{appPrivacyText:copy}=load('src/services/appPrivacyCopy.ts');
const{tx,loadCopy}=load('src/services/arabicCopy.ts');
const{LANGUAGES,isRtl}=load('src/services/languages.ts');
const url=process.env.SHAKE_WEB_URL||'http://127.0.0.1:8118';
const output=process.env.SHAKE_WEB_ARTIFACTS_DIR||'/tmp/islamic-r110-web-policy';
const keys=['@deen/location/v1','@deen/worship-settings/v1','@deen/quran/position/v1','@deen/quran/bookmarks/v1','@deen/quran/notes/v1','@deen/quran/indopak-taj-16/state/v1'];
async function fit(locator){return locator.evaluate(root=>{
 const box=root.getBoundingClientRect(),bad=[],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode())for(let i=0;i<node.textContent.length;i++){
  if(/[\s\u200c\u200d]/u.test(node.textContent[i]))continue;
  const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);
  for(const r of range.getClientRects())if(r.width&&r.height&&(r.x<box.x-1||r.right>box.right+1||r.y<box.y-1||r.bottom>box.bottom+1))bad.push({i,text:node.textContent});
 }
 return{bad,overflow:root.scrollWidth>root.clientWidth+1};
});}
async function seed(context,language,dark){await context.addInitScript(({language,dark,origin})=>{
 if(location.origin!==origin)return;
 window.__permissionCalls=[];const denied=name=>{window.__permissionCalls.push(name);throw Error('Unexpected permission API: '+name);};
 try{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:()=>denied('geolocation.getCurrentPosition'),watchPosition:()=>denied('geolocation.watchPosition')}});}catch{}
 for(const name of ['DeviceMotionEvent','DeviceOrientationEvent'])try{Object.defineProperty(window,name,{configurable:true,value:class{static requestPermission(){return denied(name+'.requestPermission')}}});}catch{}
 if(localStorage.getItem('@test/shake-policy-seeded'))return;
 localStorage.setItem('@test/shake-policy-seeded','1');localStorage.setItem('@deen/onboarding/v1',JSON.stringify({completed:true,app:language,text:'en',voice:'en',locationAsked:true,notificationsAsked:true}));localStorage.setItem('@deen/language/v1',language);localStorage.setItem('deen-theme-v1',dark?'dark':'light');localStorage.setItem('deen-theme-name-v1','islamic');
 localStorage.setItem('@deen/location/v1',JSON.stringify({latitude:25.2048,longitude:55.2708,label:'Dubai',timezone:'Asia/Dubai'}));
 localStorage.setItem('@deen/worship-settings/v1',JSON.stringify({hapticsEnabled:false,timeFormat:'24',madhab:'hanafi',prayerReminders:{Fajr:false},remindersEnabled:false}));
 localStorage.setItem('@deen/quran/position/v1',JSON.stringify({surahId:55,surahName:'Ar-Rahman',verseKey:'55:5',ayah:5,page:531,updatedAt:123}));localStorage.setItem('@deen/quran/bookmarks/v1',JSON.stringify([{verseKey:'55:5',surahId:55,surahName:'Ar-Rahman',savedAt:123}]));localStorage.setItem('@deen/quran/notes/v1',JSON.stringify([{verseKey:'55:5',note:'keep existing note',savedAt:123}]));localStorage.setItem('@deen/quran/indopak-taj-16/state/v1',JSON.stringify({version:1,page:274,readingPoint:{page:478,verse:'55:5',wordId:77600},bookmarks:[274]}));
 // Even a preference carried from a native backup must not activate web motion.
 localStorage.setItem('@deen/shake-report/v1','true');
},{language,dark,origin:new URL(url).origin});}
async function snapshot(page){return page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys);}
async function sectionLayout(page,language,width,height){
 await page.setViewportSize({width,height});const result={language,width,height,sections:[]};
 for(const key of ['location','motion','reports']){
  const body=page.getByTestId('legal-'+key);await body.scrollIntoViewIfNeeded();assert.equal(await body.innerText(),copy(language,key));assert.deepEqual(await fit(body),{bad:[],overflow:false},`${language}/${key} glyph fit`);
  assert.equal(await body.evaluate(e=>getComputedStyle(e).direction),isRtl(language)?'rtl':'ltr');result.sections.push(key);
 }
 return result;
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch();const report={url,method:'Actual exported app, normal motion, real Settings → Privacy Policy/Data Safety screens. No native sensor simulation. Web motion/location permission APIs are trip-wired. All text, wrapping, direction, back navigation and saved-data checks use the running app.',contexts:[],layouts:[],errors:[]};let active;
 try{
  const languages=LANGUAGES.filter(x=>x.uiReady||x.uiPartial).filter(x=>!process.env.SHAKE_WEB_LANGUAGE||x.code===process.env.SHAKE_WEB_LANGUAGE);
  for(const{code:language}of languages){
   await loadCopy(language);const dark=['ar','ur','fa','ps'].includes(language);const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});await seed(context,language,dark);const page=await context.newPage();active=page;page.setDefaultTimeout(30000);const errors={page:[],console:[],http:[],requests:[]};report.errors.push(errors);page.on('pageerror',e=>errors.page.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.console.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.http.push(`${r.status()} ${r.url()}`)});page.on('requestfailed',r=>errors.requests.push(`${r.url()} ${r.failure()?.errorText}`));
   await page.goto(url,{waitUntil:'load',timeout:60000});await page.getByRole('button',{name:tx(language,'Settings'),exact:true}).click();await page.getByTestId('settings-report-feature').waitFor();const saved=await snapshot(page);
   assert.equal(await page.getByTestId('settings-shake-report').count(),0);assert.equal(await page.getByTestId('shake-report-prompt').count(),0);assert.equal(await page.getByTestId('settings-report-feature').getAttribute('href'),'https://forms.gle/9jbqgcvUTBDV4g9Z6');
   await page.getByRole('button',{name:tx(language,'Privacy Policy'),exact:true}).click();await page.getByTestId('legal-location').waitFor();
   for(const[width,height]of [[280,720],[390,844]])report.layouts.push(await sectionLayout(page,language,width,height));
   for(const key of ['collection','rights','stored','children'])assert.equal(await page.getByTestId('legal-'+key).innerText(),copy(language,key));
   assert.ok(!(await page.locator('body').innerText()).includes('Location permission is optional'));
   if(['en','ar','ur'].includes(language)){
    await page.getByTestId('legal-location').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`privacy-location-${language}.png`),animations:'disabled'});
    await page.getByTestId('legal-reports').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`privacy-reports-${language}.png`),animations:'disabled'});
   }
   if(language==='en')for(const[width,height]of [[240,640],[844,390],[900,1100]])report.layouts.push(await sectionLayout(page,language,width,height));
   await page.setViewportSize({width:390,height:844});await page.getByTestId('screen-header').last().getByRole('button').first().click();await page.getByTestId('settings-report-feature').waitFor();await page.getByRole('button',{name:tx(language,'Data Safety'),exact:true}).click();await page.getByTestId('legal-location').waitFor();for(const key of ['location','motion','reports','collection','rights','stored'])assert.equal(await page.getByTestId('legal-'+key).innerText(),copy(language,key));
   await page.getByTestId('screen-header').last().getByRole('button').first().click();await page.getByTestId('settings-report-feature').waitFor();assert.deepEqual(await snapshot(page),saved,'Existing location, prayer settings, reading data and notes must be preserved');assert.deepEqual(await page.evaluate(()=>window.__permissionCalls),[]);assert.equal(await page.evaluate(()=>localStorage.getItem('@deen/shake-report/v1')),'true','Web must not rewrite a native opt-in');
   report.contexts.push({language,dark,normalMotion:true,policyAndDataSafety:true,permissionCalls:[],userDataPreserved:true,manualReportPreserved:true,nativeShortcutAbsentOnWeb:true});await context.close();
  }
  for(const group of report.errors)for(const[kind,errors]of Object.entries(group))assert.deepEqual(errors,[],kind);
  console.log(JSON.stringify({contexts:report.contexts.length,layouts:report.layouts.length,allLanguages:report.contexts.map(x=>x.language),allErrorsEmpty:true},null,2));
 }catch(error){report.failure=error.stack||String(error);if(active&&!active.isClosed())await active.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});throw error;}
 finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
