/** Real production web, real Quran responses and scrolling. No content mocks.
 * READER_URL=http://127.0.0.1:8115 node tests/verify-quran-reader-web.cjs
 * READER_BASELINE=1 runs the old-build-compatible failing reproduction only.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('playwright');
const {createLoader}=require('./helpers/load-typescript.cjs');
const {tx,loadCopy}=createLoader()('src/services/arabicCopy.ts');
const url=process.env.READER_URL||'http://127.0.0.1:8115';
const output=process.env.READER_ARTIFACTS_DIR||'/tmp/islamic-r106-reader';
const baseline=process.env.READER_BASELINE==='1';
const pause=p=>p.waitForTimeout(100);
const digest=text=>crypto.createHash('sha256').update(text).digest('hex');
const protectedKeys=['@deen/quran/notes/v1','@deen/quran/indopak-taj-16/state/v1','@deen/audio-settings/v1'];
async function makePage(browser,profile){
 const motion=process.env.READER_MOTION||profile.motion||'no-preference';
 const context=await browser.newContext({viewport:profile.viewport,isMobile:true,hasTouch:true,reducedMotion:motion});
 await context.addInitScript(({language,prefs})=>{
  localStorage.setItem('@deen/onboarding/v1',JSON.stringify({completed:true,app:language,text:language,voice:'en',locationAsked:true,notificationsAsked:true}));
  localStorage.setItem('@deen/language/v1',language);localStorage.setItem('@deen/location/v1',JSON.stringify({latitude:25.2048,longitude:55.2708,label:'Dubai',timezone:'Asia/Dubai'}));
  localStorage.setItem('deen-theme-v1',language==='ur'?'dark':'light');localStorage.setItem('deen-theme-name-v1','islamic');
  localStorage.setItem('@deen/quran/preferences/v1',JSON.stringify({translationEdition:language==='ur'?'tr_ur_fateh_muhammad_jalandhry':'tr_en_saheeh_international',translationName:language==='ur'?'فتح محمد جالندھری':'Saheeh International',translationLanguage:language==='ur'?'Urdu':'English',translationAppLanguage:language,scriptEdition:'quran-uthmani',arabicFont:'hafs',fontSize:30,lineHeight:1.9,showTranslation:true,readingMode:'cards',focusMode:false,...prefs}));
  localStorage.setItem('@deen/quran/notes/v1',JSON.stringify([{verseKey:'1:1',note:'keep this existing note',savedAt:123}]));
  localStorage.setItem('@deen/quran/indopak-taj-16/state/v1',JSON.stringify({version:1,page:274,readingPoint:{page:478,verse:'55:5',wordId:77600},bookmarks:[274]}));
  localStorage.setItem('@deen/audio-settings/v1',JSON.stringify({translationAudioEnabled:false,rate:1.25,reciter:'ar.alafasy'}));
 },{language:profile.language,prefs:profile.prefs||{}});
 const page=await context.newPage();page.setDefaultTimeout(30000);const errors={page:[],console:[],http:[],requests:[]},responses=[],arabic=new Map();
 page.on('pageerror',e=>errors.page.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.console.push(m.text());});
 page.on('requestfailed',r=>errors.requests.push(`${r.url()} ${r.failure()?.errorText}`));
 page.on('response',async r=>{
  if(r.status()>=400)errors.http.push(`${r.status()} ${r.url()}`);
  if(/\/surahs\/\d+$/.test(r.url()))try{const raw=await r.json(),rows=raw.surah?.ayahs;if(rows){responses.push({url:r.url(),status:r.status(),count:rows.length,first:rows[0].numberInSurah,last:rows.at(-1).numberInSurah,sha256:digest(JSON.stringify(rows))});if(r.url().includes('/scripts/'))for(const row of rows)arabic.set(`${raw.surah.number}:${row.numberInSurah}`,row.text);}}catch{}
 });
 await loadCopy(profile.language);await page.goto(url,{waitUntil:'load',timeout:60000});await page.getByTestId('navigation-quran').click();
 const before=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),protectedKeys);
 return{context,page,errors,responses,arabic,before,language:profile.language,name:profile.name,motion};
}
async function openStart(h){await h.page.getByText(tx(h.language,'Start reading'),{exact:true}).click();await h.page.getByRole('button',{name:`${tx(h.language,'Play verse')} 55:1`,exact:true}).waitFor();await markList(h);}
async function markList(h){
 if(await h.page.getByTestId('quran-reader-list').count())return;
 await h.page.getByRole('button',{name:new RegExp(`^${tx(h.language,'Play verse')} \\d+:\\d+$`)}).first().evaluate(e=>{
  for(let node=e.parentElement;node;node=node.parentElement)if(node.scrollHeight>node.clientHeight&&/auto|scroll/.test(getComputedStyle(node).overflowY)){node.setAttribute('data-reader-list-probe','true');break;}
 });
}
const list=h=>h.page.locator('[data-testid="quran-reader-list"], [data-reader-list-probe="true"]');
async function snapshot(h){return list(h).evaluate((e,prefix)=>{
 const box=e.getBoundingClientRect(),bar=document.querySelector('[data-testid="floating-navigation-bar"]')?.getBoundingClientRect(),bottom=bar&&bar.y>box.y?Math.min(box.bottom,bar.y):box.bottom;
 const buttons=[...e.querySelectorAll('[aria-label]')].filter(b=>b.getAttribute('aria-label').startsWith(prefix+' '));
 const rows=buttons.map(button=>{const root=button.closest('[data-testid^="reader-verse-"]')||button.parentElement.parentElement.parentElement,r=root.getBoundingClientRect();return{key:button.getAttribute('aria-label').slice(prefix.length+1),y:r.y,bottom:r.bottom,height:r.height,text:root.textContent};});
 return{top:e.scrollTop,height:e.clientHeight,contentHeight:e.scrollHeight,max:e.scrollHeight-e.clientHeight,mounted:rows.length,first:rows[0]?.key,last:rows.at(-1)?.key,visible:rows.filter(r=>r.bottom>box.y+1&&r.y<bottom-1)};
 },tx(h.language,'Play verse'));}
async function scan(h,surah,count,name){
 // A normal-motion route transition can show the loading list first. Begin
 // scrolling only once this surah's actual first ayah has arrived.
 await h.page.getByRole('button',{name:`${tx(h.language,'Play verse')} ${surah}:1`,exact:true}).waitFor();
 const samples=[],seen=new Set();let stalls=0,maxMounted=0;
 const bounds=await list(h).boundingBox();await h.page.mouse.move(bounds.x+bounds.width/2,bounds.y+Math.min(bounds.height*.55,400));
 for(let iteration=0;iteration<1800;iteration++){
  await pause(h.page);const s=await snapshot(h);maxMounted=Math.max(maxMounted,s.mounted);
  for(const row of s.visible){
   assert.ok(row.height>0&&row.text.trim(),`Real ayah content at ${row.key}`);
   const expected=h.arabic.get(row.key);assert.ok(expected,`Actual Arabic response contains ${row.key}`);assert.ok(row.text.includes(expected),`Full Arabic is rendered at ${row.key}`);seen.add(row.key);
  }
  samples.push({...s,visible:s.visible.map(r=>({key:r.key,y:r.y,bottom:r.bottom,height:r.height}))});
  if(s.top>800&&s.visible.length===0){await h.page.screenshot({path:path.join(output,`${name}-blank.png`)});throw Object.assign(new Error(`Blank Quran window at ${s.top}px: mounted ${s.first} through ${s.last}; expected all ${count} ayahs`),{samples,seen:[...seen]});}
  if([...seen].some(key=>Number(key.split(':')[1])>=14)&&!samples.some(x=>x.captured14)){
   samples.at(-1).captured14=true;await h.page.screenshot({path:path.join(output,`${name}-past-14.png`),animations:'disabled'});
  }
  const atEnd=s.top>=s.max-2;
  if(atEnd&&s.visible.some(row=>row.key===`${surah}:${count}`)){
   assert.deepEqual([...seen].sort((a,b)=>Number(a.split(':')[1])-Number(b.split(':')[1])),Array.from({length:count},(_,i)=>`${surah}:${i+1}`),'Every ayah was actually visible during the scan, not merely present in the response');
   await h.page.screenshot({path:path.join(output,`${name}-end.png`),animations:'disabled'});
   return{surah,count,seen:seen.size,samples,maxMounted};
  }
  stalls=atEnd?stalls+1:0;
  if(stalls>=15)throw Object.assign(new Error(`Reader stopped before ${surah}:${count}, last mounted ${s.last}`),{samples,seen:[...seen]});
  // Real wheel input from a cold list, not a programmatic offset that can
  // bypass the interaction/batching path a user actually exercises.
  await h.page.mouse.wheel(0,Math.min(500,s.height*.65));
 }
 throw new Error(`Reader scan did not terminate: ${name}`);
}
async function back(h){await h.page.getByTestId('reader-header').getByRole('button').first().click();await h.page.getByRole('textbox',{name:tx(h.language,'Search the Quran'),exact:true}).waitFor();}
async function reference(h,key){const input=h.page.getByRole('textbox',{name:tx(h.language,'Search the Quran'),exact:true});await input.fill(key);await input.press('Enter');await h.page.getByTestId('reader-header').waitFor();await markList(h);}
async function target(h,key){
 await h.page.waitForFunction(({key,prefix})=>{const button=[...document.querySelectorAll('[aria-label]')].find(e=>e.getAttribute('aria-label')===`${prefix} ${key}`);if(!button)return false;const r=button.getBoundingClientRect(),header=document.querySelector('[data-testid="reader-header"]')?.getBoundingClientRect();return r.y>=(header?.bottom||0)&&r.bottom<innerHeight-80;},{key,prefix:tx(h.language,'Play verse')},{timeout:20000});
 await pause(h.page);const s=await snapshot(h);assert.ok(s.visible.some(v=>v.key===key));return{key,top:s.top,visible:s.visible.map(v=>v.key),mounted:s.mounted};
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch();const report={method:'Actual production Expo WEB, unmodified live Quran responses and real wheel scrolling from a cold list. Normal animations are enabled by default, with a separate reduced-motion control. No content mocks; not installed Android/iOS device validation.',url,baseline,profiles:[],checks:{},errors:[]};let active;
 try{
  const profiles=baseline?[{name:'baseline',language:'en',viewport:{width:390,height:844}}]:[
   {name:'phone',language:'en',viewport:{width:390,height:844}},
   {name:'rtl-urdu',language:'ur',viewport:{width:390,height:844},prefs:{fontSize:36}},
   {name:'large-arabic-continuous',language:'en',viewport:{width:900,height:1100},prefs:{fontSize:44,showTranslation:false,readingMode:'continuous'}},
   {name:'phone-reduced-motion',language:'en',viewport:{width:390,height:844},motion:'reduce'},
  ];
  const selected=process.env.READER_PROFILE?profiles.filter(p=>p.name===process.env.READER_PROFILE):profiles;
  assert.ok(selected.length,'READER_PROFILE must name an existing explicit profile');
  for(const profile of selected){
   const h=await makePage(browser,profile);active=h.page;report.errors.push(h.errors);const result={...profile,motion:h.motion,walks:[],responses:h.responses};report.profiles.push(result);await openStart(h);
   result.walks.push(await scan(h,55,78,`${profile.name}-55`));
   if(profile.name==='phone'){
    await back(h);await reference(h,'2:1');result.walks.push(await scan(h,2,286,'phone-2'));
    result.jumps=[];for(const key of ['2:156','2:255','2:282','2:286']){await back(h);await reference(h,key);result.jumps.push(await target(h,key));}
    await back(h);await reference(h,'2:156');await target(h,'2:156');await h.page.getByRole('button',{name:'Mark position at 2:156',exact:true}).click();
    await back(h);await h.page.getByText('CONTINUE READING',{exact:true}).click();await markList(h);report.checks.continueReading=await target(h,'2:156');
    await list(h).evaluate(e=>{e.scrollTop=0;});await pause(h.page);await h.page.mouse.move(200,500);await h.page.mouse.wheel(0,15000);await h.page.waitForTimeout(500);const fast=await snapshot(h);assert.ok(fast.visible.length,'A fast browser flick settles on real ayahs');report.checks.fastFlick={top:fast.top,visible:fast.visible.map(v=>v.key)};
    await h.page.screenshot({path:path.join(output,'phone-fast-flick.png'),animations:'disabled'});
    await h.page.setViewportSize({width:844,height:390});await h.page.waitForTimeout(400);assert.ok((await snapshot(h)).visible.length,'Rotation cannot leave an empty list');report.checks.rotation=true;
   }
   assert.deepEqual(await h.page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),protectedKeys),h.before,'Existing notes, separate IndoPak position/bookmarks and audio preferences remain byte-identical');
   result.preservedUserData=true;
   await h.context.close();
  }
  for(const errors of report.errors)for(const [kind,items]of Object.entries(errors))assert.deepEqual(items,[],kind);
  console.log(JSON.stringify({profiles:report.profiles.map(p=>({name:p.name,walks:p.walks.map(w=>({surah:w.surah,allVisible:w.seen,maxMounted:w.maxMounted})),jumps:p.jumps})),checks:report.checks},null,2));
 }catch(error){report.failure=error.stack||String(error);if(error.samples)report.failedSamples=error.samples;if(error.seen)report.failedSeen=error.seen;if(active&&!active.isClosed())await active.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});throw error;}
 finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
