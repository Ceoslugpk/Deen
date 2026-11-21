/** Actual Expo production web and Settings UI. External form requests are
 * intercepted only after a user click, to verify the exact new-tab destination
 * without submitting a report or relying on Google's authentication/network.
 * FEEDBACK_URL=http://127.0.0.1:8117 node tests/verify-app-feedback-web.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const{chromium}=require('playwright');
const{createLoader}=require('./helpers/load-typescript.cjs');
const load=createLoader({'react-native':{Linking:{}}});
const{appFeedbackText:copy,APP_FEEDBACK_URL:target}=load('src/services/appFeedback.ts');
const{settingsDedicationText:dedication}=load('src/services/settingsDedication.ts');
const{appShareText:shareCopy}=load('src/services/appShareCopy.ts');
const{tx,loadCopy}=load('src/services/arabicCopy.ts');
const{LANGUAGES,isRtl}=load('src/services/languages.ts');
const url=process.env.FEEDBACK_URL||'http://127.0.0.1:8117';
const output=process.env.FEEDBACK_ARTIFACTS_DIR||'/tmp/islamic-r108-feedback';
const keys=['@deen/quran/position/v1','@deen/quran/bookmarks/v1','@deen/quran/notes/v1','@deen/quran/indopak-taj-16/state/v1'];
async function fullLabel(locator){return locator.evaluate(root=>{
 const box=root.getBoundingClientRect(),walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),clipped=[];let node;
 while(node=walker.nextNode()){
  if(!node.textContent.trim()||node.parentElement.closest('svg'))continue;
  const parent=node.parentElement,r=parent.getBoundingClientRect();if(parent.scrollWidth>parent.clientWidth+1||parent.scrollHeight>parent.clientHeight+1)clipped.push({text:node.textContent,overflow:true});
  for(let i=0;i<node.textContent.length;i++){
   if(/[\s\u200c\u200d]/u.test(node.textContent[i]))continue;
   const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);
   for(const q of range.getClientRects())if(q.width&&q.height&&(q.x<box.x-1||q.right>box.right+1||q.y<box.y-1||q.bottom>box.bottom+1||q.x<r.x-1||q.right>r.right+1||q.y<r.y-1||q.bottom>r.bottom+1))clipped.push({text:node.textContent,index:i,glyph:node.textContent[i]});
  }
 }
 return clipped;
});}
async function layout(page,language,width,height){
 await page.setViewportSize({width,height});const link=page.getByTestId('settings-report-feature');await link.scrollIntoViewIfNeeded();await page.waitForTimeout(220);
 assert.equal(await link.innerText(),copy(language,'label'));assert.equal(await link.getAttribute('aria-label'),copy(language,'label'));
 const details=await link.evaluate(e=>{const r=e.getBoundingClientRect(),safe=document.querySelector('[data-testid="system-safe-content"]').getBoundingClientRect(),nav=document.querySelector('[data-testid="floating-navigation-bar"]')?.getBoundingClientRect();return{tag:e.tagName,href:e.getAttribute('href'),target:e.target,rel:e.rel,direction:getComputedStyle(e).direction,previous:e.previousElementSibling?.dataset.testid,rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height},safe:{x:safe.x,y:safe.y,right:safe.right,bottom:nav&&nav.y>safe.y?Math.min(safe.bottom,nav.y):safe.bottom}};});
 assert.equal(details.tag,'A');assert.equal(details.href,target);assert.equal(details.target,'_blank');assert.match(details.rel,/\bnoopener\b/);assert.match(details.rel,/\bnoreferrer\b/);assert.equal(details.previous,'settings-share-app');assert.equal(details.direction,isRtl(language)?'rtl':'ltr');
 assert.ok(details.rect.height>=44&&details.rect.x>=details.safe.x&&details.rect.right<=details.safe.right&&details.rect.y>=details.safe.y&&details.rect.bottom<=details.safe.bottom,'The complete external-link row stays reachable inside the safe content, above navigation');
 assert.deepEqual(await fullLabel(link),[],'All label glyphs fit without clipping or ellipsis');
 assert.equal(await page.getByTestId('settings-dedication').evaluate(e=>e===e.parentElement.lastElementChild),true);
 assert.equal(await page.getByTestId('settings-dedication').innerText(),dedication(language));
 return{language,width,height,label:copy(language,'label'),...details};
}
async function seed(context,language,dark){await context.addInitScript(({language,dark,origin})=>{
 if(location.origin!==origin||localStorage.getItem('@test/feedback-seeded'))return;
 localStorage.setItem('@test/feedback-seeded','1');localStorage.setItem('@deen/onboarding/v1',JSON.stringify({completed:true,app:language,text:'en',voice:'en',locationAsked:true,notificationsAsked:true}));
 localStorage.setItem('@deen/language/v1',language);localStorage.setItem('@deen/location/v1',JSON.stringify({latitude:25.2048,longitude:55.2708,label:'Dubai',timezone:'Asia/Dubai'}));
 localStorage.setItem('deen-theme-v1',dark?'dark':'light');localStorage.setItem('deen-theme-name-v1','islamic');
 localStorage.setItem('@deen/quran/position/v1',JSON.stringify({surahId:55,surahName:'Ar-Rahman',verseKey:'55:5',ayah:5,page:531,updatedAt:123}));
 localStorage.setItem('@deen/quran/bookmarks/v1',JSON.stringify([{verseKey:'55:5',surahId:55,surahName:'Ar-Rahman',arabic:'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ',savedAt:123}]));
 localStorage.setItem('@deen/quran/notes/v1',JSON.stringify([{verseKey:'55:5',note:'keep this existing note',savedAt:123}]));
 localStorage.setItem('@deen/quran/indopak-taj-16/state/v1',JSON.stringify({version:1,page:274,readingPoint:{page:478,verse:'55:5',wordId:77600},bookmarks:[274]}));
},{language,dark,origin:new URL(url).origin});}
async function openExternal(context,page,keyboard=false){
 const original=page.url(),next=context.waitForEvent('page');const row=page.getByTestId('settings-report-feature');
 if(keyboard){await row.focus();await row.press('Enter');}else await row.click();
 const popup=await next;await popup.waitForLoadState('domcontentloaded');assert.equal(popup.url(),target);assert.equal(await popup.evaluate(()=>window.opener===null),true,'External tab cannot control the app window');assert.equal(page.url(),original,'Settings remains open in the original tab');assert.equal(await page.getByTestId('settings-report-feature').count(),1);await popup.close();return{keyboard,url:target,newTab:true,openerIsNull:true,originalSettingsPreserved:true};
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch();const report={url,method:'Real production web, normal motion, actual Settings navigation and HTML anchor activation. The Google form navigation alone is intercepted with a harmless document to verify exact URL, new-tab isolation, keyboard activation and no prefetch/referrer; no form is submitted. Native browser handoff/failures use explicit unit bridge doubles, not installed device testing.',layouts:[],external:[],contexts:[],errors:[]};let active;
 try{
  const languages=LANGUAGES.filter(x=>x.uiReady||x.uiPartial).filter(x=>!process.env.FEEDBACK_LANGUAGE||x.code===process.env.FEEDBACK_LANGUAGE);assert.ok(languages.length);
  for(const{code:language}of languages){
   await loadCopy(language);const dark=['ar','ur','fa','ps'].includes(language);const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});await seed(context,language,dark);
   const external=[];await context.route('https://forms.gle/**',async route=>{const request=route.request();external.push({url:request.url(),method:request.method(),navigation:request.isNavigationRequest(),referer:request.headers().referer||null});await route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>External navigation test</title><p>External form destination verified. No report submitted.</p>'});});
   const page=await context.newPage();active=page;page.setDefaultTimeout(30000);const errors={page:[],console:[],http:[],requests:[]};report.errors.push(errors);page.on('pageerror',e=>errors.page.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.console.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.http.push(`${r.status()} ${r.url()}`)});page.on('requestfailed',r=>errors.requests.push(`${r.url()} ${r.failure()?.errorText}`));
   await page.goto(url,{waitUntil:'load',timeout:60000});await page.getByRole('button',{name:tx(language,'Settings'),exact:true}).click();await page.getByTestId('settings-report-feature').waitFor();
   const saved=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys);assert.deepEqual(external,[],'No form request before a user action');
   for(const[width,height]of [[280,720],[390,844]])report.layouts.push(await layout(page,language,width,height));
   if(['en','ar','ur'].includes(language))await page.screenshot({path:path.join(output,`settings-feedback-${language}.png`),animations:'disabled'});
   report.external.push({language,...await openExternal(context,page)});
   if(language==='en'){
    report.external.push({language,...await openExternal(context,page,true)});
    for(const[width,height]of [[240,640],[844,390],[900,1100]])report.layouts.push(await layout(page,language,width,height));
    await page.setViewportSize({width:390,height:844});await page.getByTestId('settings-share-app').click();await page.getByTestId('app-share-qr').waitFor();assert.equal(await page.getByTestId('app-share-button').innerText(),shareCopy('en','button'));assert.equal(await page.getByTestId('app-share-url').count(),0);await page.getByTestId('screen-header').last().getByRole('button').first().click();await page.getByTestId('settings-report-feature').waitFor();
    await page.waitForLoadState('networkidle',{timeout:30000});await page.reload({waitUntil:'load',timeout:60000});await page.getByRole('button',{name:tx(language,'Settings'),exact:true}).click();report.layouts.push(await layout(page,language,390,844));report.external.push({language,afterReload:true,...await openExternal(context,page)});
   }
   assert.deepEqual(await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys),saved,'No bookmark, note or reading-point mutation');
   for(const request of external){assert.equal(request.url,target);assert.equal(request.method,'GET');assert.equal(request.navigation,true);assert.equal(request.referer,null);}
   assert.equal(await page.getByTestId('settings-report-feature-error').count(),0);
   report.contexts.push({language,dark,normalMotion:true,userDataPreserved:true,externalRequests:external});await context.close();
  }
  for(const errors of report.errors)for(const[kind,items]of Object.entries(errors))assert.deepEqual(items,[],kind);
  console.log(JSON.stringify({contexts:report.contexts.length,layouts:report.layouts.length,externalNavigations:report.external.length,allLanguages:report.contexts.map(x=>x.language),allErrorsEmpty:true},null,2));
 }catch(error){report.failure=error.stack||String(error);if(active&&!active.isClosed())await active.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});throw error;}
 finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
