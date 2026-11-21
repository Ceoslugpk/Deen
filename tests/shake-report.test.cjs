const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader({ './storage': { readJson: async () => false, writeJson: async () => true } });
const { createShakeDetector, SHAKE_COOLDOWN_MS, SHAKE_SAMPLE_INTERVAL_MS } = load('src/services/shakeDetection.ts');
const { createShakeReportController } = load('src/services/shakeReportController.ts');
const flush = async () => { for (let i=0;i<8;i++) await Promise.resolve(); };
function deferred() { let resolve, reject; const promise = new Promise((yes,no) => { resolve=yes; reject=no; }); return { promise, resolve, reject }; }
function signal(detector, sample, duration=4000, start=0) { let hits=0; for(let at=start;at<start+duration;at+=40) if(detector.add(sample(at),at)) hits++; return hits; }
const still = () => ({ x:0, y:0, z:1 });
function deliberate(at, axis='x') { const sample=still(); sample[axis]+=2.8*Math.sin(2*Math.PI*3.125*at/1000); return sample; }
function detectorWithWarmup() { const detector=createShakeDetector(); assert.equal(signal(detector,still,800),0); return detector; }

test('sampling is ordinary 25Hz and prompts have a 20-second cooldown',()=>{assert.equal(SHAKE_SAMPLE_INTERVAL_MS,40);assert.equal(SHAKE_COOLDOWN_MS,20000);});
for(const [name,sample] of [
 ['stationary',still], ['slow rotation',at=>({x:Math.sin(at/500),y:0,z:Math.cos(at/500)})],
 ['walking-like movement',at=>({x:.25*Math.sin(at/100),y:.1,z:1+.65*Math.sin(at/90)})],
 ['a single bump',at=>({x:at===1200?3.5:0,y:0,z:1})],
 ['a drop and landing',at=>at>=1000&&at<=1400?({x:0,y:0,z:0}):({x:0,y:0,z:at===1440?5:1})],
 ['same-direction isolated impulses',at=>({x:at%320===0?3:0,y:0,z:1})],
]) test(`signal fixture: ${name} never reports a deliberate shake`,()=>assert.equal(signal(createShakeDetector(),sample,8000),0));
for(const axis of ['x','y','z']) test(`deliberate alternating ${axis}-axis acceleration is accepted after warmup`,()=>{
 const detector=detectorWithWarmup();assert.ok(signal(detector,at=>deliberate(at,axis),1600,800)>0);
});
test('warmup, duplicate timestamps, low-rate bursts and invalid values cannot become four peaks',()=>{
 const d=createShakeDetector();for(let i=0;i<200;i++)assert.equal(d.add(deliberate(i*2),i*2),false);
 for(const at of [NaN,Infinity,-Infinity])assert.equal(d.add(still(),at),false);
 for(const x of [NaN,Infinity,-Infinity,99])assert.equal(d.add({x,y:0,z:1},1000),false);
 for(let at=2000;at<5000;at+=400)assert.equal(d.add(deliberate(at),at),false);
});
test('two isolated peaks or peaks spread over many seconds are insufficient',()=>{
 const d=detectorWithWarmup();assert.equal(signal(d,deliberate,320,800),0);
 assert.equal(signal(d,still,1800,1120),0);assert.equal(signal(d,deliberate,320,2920),0);
});
test('reset discards a partial gesture across lifecycle boundaries',()=>{
 const d=detectorWithWarmup();signal(d,deliberate,320,800);d.reset();assert.equal(signal(d,deliberate,400,1120),0);
});

function harness(options={}) {
 let now=1000, id=0, listener=null, allowed=true;
 const timers=new Map(), trace={available:0,subscriptions:0,removals:0,opens:0,changes:[]};
 const controller=createShakeReportController({
  available:()=>{trace.available++;return options.available?options.available():Promise.resolve(true);},
  subscribe:fn=>{trace.subscriptions++;if(options.subscribeThrows)throw Error('Sensor unavailable');listener=fn;return{remove(){trace.removals++;if(listener===fn)listener=null;}};},
  canPresent:()=>allowed,
  openForm:()=>{trace.opens++;return options.open?options.open():Promise.resolve();},
  changed:value=>trace.changes.push({...value}), now:()=>now,
  schedule:(fn,ms)=>{const key=++id;timers.set(key,{fn,at:now+ms});return key;},unschedule:key=>timers.delete(key),
 });
 let policy={enabled:true,active:true,blocked:false,contextKey:'Home'};
 function tick(ms) { const end=now+ms;let n=0;while(true){const entry=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!entry)break;assert.ok(++n<100);timers.delete(entry[0]);now=entry[1].at;entry[1].fn();}now=end; }
 function samples(fn,duration=800){const begin=now;for(let t=0;t<duration;t+=40){tick(40);listener?.(fn(now-begin));}}
 const api={controller,trace,timers,tick,samples,async start(){controller.update(policy);await flush();},async update(patch){policy={...policy,...patch};controller.update(policy);await flush();},shake(){samples(still,800);samples(deliberate,1600);},setAllowed(value){allowed=value;},get listener(){return listener;}};
 return api;
}
test('default/off, background and blocked policies never probe or subscribe to sensors',async()=>{
 for(const patch of [{enabled:false},{active:false},{blocked:true}]){const h=harness();await h.update(patch);assert.equal(h.trace.available,0);assert.equal(h.trace.subscriptions,0);h.controller.dispose();}
});
test('a shake opens one confirmation only, and not the browser or a report',async()=>{
 const h=harness();await h.start();h.shake();assert.equal(h.controller.getSnapshot().visible,true);assert.equal(h.trace.opens,0);assert.equal(h.listener,null);assert.equal(h.trace.removals,1);assert.equal(h.trace.changes.length,1);h.controller.dispose();assert.equal(h.timers.size,0);
});
test('cancel closes without sending; no sampling during cooldown, then a fresh warmup is required',async()=>{
 const h=harness();await h.start();h.shake();h.controller.cancel();assert.equal(h.controller.getSnapshot().visible,false);assert.equal(h.trace.opens,0);assert.equal(h.trace.subscriptions,1);h.tick(SHAKE_COOLDOWN_MS-1);await flush();assert.equal(h.trace.subscriptions,1);h.tick(1);await flush();assert.equal(h.trace.subscriptions,2);assert.equal(h.controller.getSnapshot().visible,false);h.shake();assert.equal(h.controller.getSnapshot().visible,true);h.controller.dispose();
});
test('explicit confirmation awaits one browser handoff and guards repeated taps',async()=>{
 const pending=deferred(),h=harness({open:()=>pending.promise});await h.start();h.shake();const first=h.controller.confirm();await h.controller.confirm();assert.equal(h.trace.opens,1);assert.equal(h.controller.getSnapshot().busy,true);pending.resolve();await first;assert.equal(h.controller.getSnapshot().visible,false);assert.equal(h.controller.getSnapshot().busy,false);assert.equal(h.controller.getSnapshot().error,false);h.controller.dispose();
});
test('browser failure stays honest and supports explicit retry, not automatic reopening',async()=>{
 let attempts=0;const h=harness({open:async()=>{if(attempts++===0)throw Error('No browser');}});await h.start();h.shake();await h.controller.confirm();assert.equal(h.controller.getSnapshot().visible,true);assert.equal(h.controller.getSnapshot().error,true);assert.equal(h.controller.getSnapshot().busy,false);await h.controller.confirm();assert.equal(h.trace.opens,2);assert.equal(h.controller.getSnapshot().visible,false);h.controller.dispose();
});
for(const [name,patch] of [['background',{active:false}],['modal or privacy lock',{blocked:true}],['opt out',{enabled:false}],['navigation change',{contextKey:'Reader'}]])test(`${name} removes sensing and dismisses a pending prompt`,async()=>{
 const h=harness();await h.start();h.shake();await h.update(patch);assert.equal(h.controller.getSnapshot().visible,false);await h.controller.confirm();assert.equal(h.trace.opens,0);h.controller.dispose();assert.equal(h.timers.size,0);
});
test('a gate changing between React updates and a sensor event is checked synchronously',async()=>{
 const h=harness();await h.start();h.samples(still);h.setAllowed(false);h.samples(deliberate,1600);assert.equal(h.listener,null);assert.equal(h.controller.getSnapshot().visible,false);assert.equal(h.trace.opens,0);h.controller.dispose();
});
test('late sensor availability after opting out or unmount cannot attach a listener',async()=>{
 for(const dispose of [false,true]){const pending=deferred(),h=harness({available:()=>pending.promise});await h.start();if(dispose)h.controller.dispose();else await h.update({enabled:false});pending.resolve(true);await flush();assert.equal(h.trace.subscriptions,0);assert.equal(h.timers.size,0);h.controller.dispose();}
});
test('late browser failure cannot resurrect a dialog after a lock/background transition',async()=>{
 const pending=deferred(),h=harness({open:()=>pending.promise});await h.start();h.shake();const opening=h.controller.confirm();await h.update({blocked:true});pending.reject(Error('Browser unavailable'));await opening;assert.equal(h.controller.getSnapshot().visible,false);assert.equal(h.controller.getSnapshot().error,false);h.controller.dispose();
});
for(const [name,options] of [['missing',{available:async()=>false}],['denied/rejected',{available:async()=>{throw Error('Denied')}}],['subscription failure',{subscribeThrows:true}]]) test(`${name} sensor leaves manual reporting untouched and never loops`,async()=>{
 const h=harness(options);await h.start();assert.equal(h.controller.getSnapshot().unavailable,true);h.tick(60000);await flush();assert.equal(h.trace.available,1);assert.equal(h.trace.opens,0);assert.equal(h.controller.getSnapshot().visible,false);h.controller.dispose();
});
test('a silently non-delivering sensor times out and releases its own subscription',async()=>{
 const h=harness();await h.start();h.tick(5000);assert.equal(h.listener,null);assert.equal(h.controller.getSnapshot().unavailable,true);assert.equal(h.timers.size,0);h.controller.dispose();
});
test('ordinary samples never cause React-facing snapshot updates',async()=>{
 const h=harness();await h.start();h.samples(still,60000);assert.deepEqual(h.trace.changes,[]);h.controller.dispose();assert.equal(h.trace.removals,1);assert.equal(h.timers.size,0);
});

function preferenceHarness(saved=false,write=async()=>true){const calls=[];const{createShakeReportPreferenceStore,SHAKE_REPORT_KEY}=load('src/services/shakeReportPreference.ts');const store=createShakeReportPreferenceStore({readJson:async key=>{calls.push(['read',key]);return saved;},writeJson:async(key,value)=>{calls.push(['write',key,value]);return write(value);}});return{store,calls,key:SHAKE_REPORT_KEY};}
test('opt-in defaults off, only a literal saved true enables it, and hydration never writes',async()=>{
 for(const saved of [null,false,undefined,'true',1,{},true]){const h=preferenceHarness(saved);assert.equal(h.store.getSnapshot().enabled,false);await h.store.hydrate();await h.store.hydrate();assert.equal(h.store.getSnapshot().enabled,saved===true);assert.equal(h.store.getSnapshot().hydrated,true);assert.deepEqual(h.calls,[['read',h.key]]);}
});
test('preference changes use only their own key, publish immediately, and survive a reload',async()=>{
 let disk=false;const h=preferenceHarness(disk,async value=>{disk=value;return true;});await h.store.hydrate();const promise=h.store.setEnabled(true);assert.equal(h.store.getSnapshot().enabled,true);await promise;assert.equal(h.store.getSnapshot().saveError,false);const next=preferenceHarness(disk);await next.store.hydrate();assert.equal(next.store.getSnapshot().enabled,true);await h.store.setEnabled(false);assert.equal(disk,false);assert.deepEqual(h.calls,[['read',h.key],['write',h.key,true],['write',h.key,false]]);
});
test('failed saves are visible, keep the in-session choice, and recover on retry',async()=>{
 let writes=0;const h=preferenceHarness(false,async()=>++writes>1);await h.store.hydrate();assert.equal(await h.store.setEnabled(true),false);assert.equal(h.store.getSnapshot().enabled,true);assert.equal(h.store.getSnapshot().saveError,true);assert.equal(h.store.getSnapshot().saving,false);assert.equal(await h.store.setEnabled(true),true);assert.equal(h.store.getSnapshot().saveError,false);
});
test('a delayed hydration cannot overwrite a newer explicit choice',async()=>{
 const pending=deferred();const{createShakeReportPreferenceStore}=load('src/services/shakeReportPreference.ts');const store=createShakeReportPreferenceStore({readJson:()=>pending.promise,writeJson:async()=>true});const hydrating=store.hydrate();await store.setEnabled(false);pending.resolve(true);await hydrating;assert.equal(store.getSnapshot().enabled,false);assert.equal(store.getSnapshot().hydrated,true);
});

test('all shortcut and corrected-policy copy exists in all 22 actual UI languages',()=>{
 const{shakeReportText}=load('src/services/shakeReportCopy.ts'),{appPrivacyText}=load('src/services/appPrivacyCopy.ts'),{LANGUAGES}=load('src/services/languages.ts');const languages=LANGUAGES.filter(x=>x.uiReady||x.uiPartial);assert.equal(languages.length,22);
 for(const fn of [shakeReportText,appPrivacyText]){
  const keys=fn===shakeReportText?['label','description','checking','unavailable','saveError','title','message','report','cancel']:['location','motionTitle','motion','reportsTitle','reports','collection','rights','stored','children'];
  for(const{code}of languages)for(const key of keys){const text=fn(code,key);assert.ok(text?.trim(),`${code}/${key}`);if(code!=='en')assert.notEqual(text,fn('en',key),`${code}/${key}`);if(['uz','kk'].includes(code))assert.doesNotMatch(text.replaceAll('Islamic@qashi.uz',''),/[A-Za-z]/u,`${code}/${key} is Cyrillic`);if(['ar','ur','fa','ps'].includes(code))assert.match(text,/[\u0600-\u06ff]/u);}
  for(const code of ['constructor','__proto__','toString','my','unknown',''])for(const key of keys)assert.equal(fn(code,key),fn('en',key));
 }
 assert.notEqual(shakeReportText('id','label'),shakeReportText('ms','label'));assert.notEqual(appPrivacyText('id','location'),appPrivacyText('ms','location'));
});

test('actual legal documents route corrected policy keys instead of obsolete GPS translations',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8'),source=ts.createSourceFile('App.tsx',app,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let initializer;
 for(const statement of source.statements)if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations)if(declaration.name.getText(source)==='LEGAL_DOCS')initializer=declaration.initializer;
 const{appPrivacyText}=load('src/services/appPrivacyCopy.ts');const raw=ts.transpileModule('const docs = '+initializer.getText(source)+'; docs;', {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;const docs=vm.runInNewContext(raw,{appPrivacyText});
 for(const kind of ['privacy','datasafety'])for(const key of ['location','motion','reports','collection','rights','stored']){const section=docs[kind].sections.find(s=>s.bodyKey===key);assert.ok(section,`${kind}/${key}`);assert.equal(section.body,appPrivacyText('en',key));}
 assert.ok(docs.privacy.sections.some(s=>s.bodyKey==='children'));assert.equal(docs.privacy.updated,'2026-10-26');assert.equal(docs.datasafety.updated,'2026-10-26');
 assert.doesNotMatch(JSON.stringify(docs),/nearest city|Location permission is optional|Your coordinates are not stored/);
 assert.ok(app.includes('section.bodyKey ? appPrivacyText(language, section.bodyKey) : T(section.body)'));
});
test('web has no shake switch/host and no browser motion permission request; native keeps gates and explicit confirmation',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8'),ui=fs.readFileSync(path.join(__dirname,'../src/components/ShakeReportShortcut.tsx'),'utf8');
 for(const marker of ["Platform.OS !== 'web' && <ShakeReportSetting","Platform.OS !== 'web' && <AppShakeReport",'blocked={blocked || locked}','!indopakFocus.focusMode','shakeReady={!splash && onboarding === false}'])assert.ok(app.includes(marker),marker);
 for(const marker of ["AppState.addEventListener('change'","AppState.addEventListener('blur'","AppState.addEventListener('focus'","Keyboard.addListener('keyboardDidShow'",'subscribeShakeReportGuard(refresh)','instance.dispose()','openForm: openAppFeedbackForm','blocksShakeReport={false}','accessibilityViewIsModal','onRequestClose={onCancel}','onPress={onReport}'])assert.ok(ui.includes(marker),marker);
 assert.ok(app.includes('qiblaFocused&&compassForeground'));assert.ok(app.includes('subscribeAppAccelerometer((d) => { acc = d; compute(); }, 80)'));assert.ok(!app.includes('Accelerometer.setUpdateInterval'));
 const code=ts.transpileModule(ui,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,removeComments:true}}).outputText;for(const forbidden of ['DeviceMotionEvent','requestPermissionsAsync','captureRef','prefill','fetch(','saveReadingPosition'])assert.ok(!code.includes(forbidden),forbidden);
});
