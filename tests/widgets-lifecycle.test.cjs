const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'App.tsx'),'utf8');
const source=ts.createSourceFile('App.tsx',app,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const functionSource=name=>source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name)?.getText(source);
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return{promise,resolve,reject};};
function background(platform='android',options={}){
 const calls=[],tasks=new Map();
 const mocks={'react-native':{Platform:{OS:platform}},'./widgetSync':{refreshStoredWidgets:async()=>{calls.push('replenish');return options.success!==false;}},'./widgetBridge':{widgetsAvailable:()=>options.widgets!==false},'expo-task-manager':{isTaskDefined:name=>tasks.has(name),defineTask:(name,run)=>{calls.push('define');tasks.set(name,run)},isAvailableAsync:async()=>options.available!==false,isTaskRegisteredAsync:async()=>!!options.registered},'expo-background-task':{BackgroundTaskResult:{Success:1,Failed:2},registerTaskAsync:async(name,opts)=>{calls.push(['register',name,opts.minimumInterval]);if(options.registrationFailure)throw Error('denied');}}};
 for(const name of options.missing||[])Object.defineProperty(mocks,name,{get(){throw Error('Native module missing in old binary');},enumerable:true,configurable:true});
 const api=createLoader(mocks)('src/services/widgetBackground.ts');return{api,calls,tasks};
}
test('headless Android task is defined synchronously at module scope, before registration or Home',async()=>{
 const h=background();assert.deepEqual(h.calls,['define']);assert.equal(h.tasks.size,1);assert.equal(await h.api.registerWidgetBackgroundTask(),true);assert.deepEqual(h.calls.at(-1),['register','com.qashi.islamic.widgets.replenish.v2',360]);const run=h.tasks.get(h.api.WIDGET_BACKGROUND_TASK);assert.equal(await run({}),1);assert.equal(await run({error:Error('OS stopped task')}),2);
});
test('background failures propagate honestly and an already registered task is not registered repeatedly',async()=>{
 const h=background('android',{registered:true,success:false});assert.equal(await h.api.registerWidgetBackgroundTask(),true);assert.equal(h.calls.length,1);assert.equal(await h.tasks.get(h.api.WIDGET_BACKGROUND_TASK)({}),2);
 for(const options of [{widgets:false},{available:false},{registrationFailure:true}])assert.equal(await background('android',options).api.registerWidgetBackgroundTask(),false);
});
test('iOS/web and older binaries lacking either native task module never crash on import',async()=>{
 for(const platform of ['web','ios']){const h=background(platform,{missing:['expo-task-manager','expo-background-task']});assert.equal(h.tasks.size,0);assert.equal(await h.api.registerWidgetBackgroundTask(),false);}
 for(const missing of [['expo-task-manager'],['expo-background-task']]){const h=background('android',{missing});assert.equal(h.tasks.size,0);assert.equal(await h.api.registerWidgetBackgroundTask(),false);}
 const entry=fs.readFileSync(path.join(root,'index.ts'),'utf8');assert.ok(entry.indexOf("import './src/services/widgetBackground'")<entry.indexOf('registerRootComponent(App)'));
});
test('all four native destinations target existing nested app screens; untrusted values cannot become routes',()=>{
 const{widgetDestinationRoute:route}=createLoader()('src/services/widgetNavigation.ts');const clean=value=>JSON.parse(JSON.stringify(value));
 assert.deepEqual(clean(route('prayer')),{name:'Main',params:{screen:'Prayer'}});assert.deepEqual(clean(route('ayah')),{name:'Main',params:{screen:'Home'}});
 for(const[destination,screen]of [['tasbih','Tasbih'],['hijri','Hijri Calendar']])assert.deepEqual(clean(route(destination)),{name:'Main',params:{screen:'Tools',params:{screen,initial:false}}});
 for(const value of [null,'','Reader','https://evil.invalid','__proto__'])assert.equal(route(value),null);
});
/** Small explicit hook double. Executes the actual App.tsx lifecycle function
 * and effect cleanups; it is not a React Native or physical launcher renderer. */
function hooks(){const slots=[];let index=0,pending=[];return{useRef(initial){const n=index++;return slots[n]||(slots[n]={current:initial});},useState(initial){const n=index++;if(!slots[n])slots[n]={value:initial};return[slots[n].value,value=>{slots[n].value=value;}];},useEffect(fn,deps){const n=index++,old=slots[n];if(!old||deps.some((value,i)=>!Object.is(value,old.deps?.[i])))pending.push(()=>{old?.cleanup?.();slots[n]={deps,cleanup:fn()};});},render(fn){index=0;const tree=fn();const next=pending;pending=[];next.forEach(fn=>fn());return tree;},unmount(){slots.forEach(slot=>slot?.cleanup?.());}};}
function lifecycle(platform='android'){
 const h=hooks(),timers=new Map(),trace={sync:[],navigate:[],register:0,reads:0,removed:0};let id=0,change,event,pendingDestination='prayer';
 const env={language:{language:'en',ready:true},city:{location:{latitude:25.2,longitude:55.2,label:'Saved city',timezone:'Asia/Dubai'},hydrated:true},worship:{settings:{calculationMethod:9,madhab:'shafi',timeFormat:'24'},hydrated:true},theme:{dark:false,hydrated:true},counter:{phraseId:'subhan-allah',count:0,goal:33},read:async()=>({...env.counter,count:19})};
 const{widgetDestinationRoute}=createLoader()('src/services/widgetNavigation.ts');
 const globals={...h,Platform:{OS:platform},useLanguage:()=>env.language,useAppLocation:()=>env.city,useWorshipSettings:()=>env.worship,useTheme:()=>env.theme,useTasbih:()=>env.counter,currentPhrase:()=>({transliteration:'Subhan Allah'}),widgetsAvailable:()=>true,syncWidgets:async value=>{trace.sync.push(JSON.parse(JSON.stringify(value)));return true;},loadTasbihState:async()=>{trace.reads++;const adopted=await env.read();env.counter=adopted;return adopted;},consumeWidgetDestination:async()=>{const next=pendingDestination;pendingDestination=null;return next;},subscribeWidgetDestination:fn=>{event=fn;return()=>{event=null;trace.removed++;}},widgetDestinationRoute,navigateWhenReady:(...args)=>trace.navigate.push(JSON.parse(JSON.stringify(args))),registerWidgetBackgroundTask:async()=>{trace.register++;return true;},AppState:{addEventListener(name,fn){change=fn;return{remove(){change=null;trace.removed++;}}}},setTimeout:fn=>{const n=++id;timers.set(n,fn);return n;},clearTimeout:n=>timers.delete(n)};
 const compiled=ts.transpileModule(`${functionSource('WidgetLifecycle')}\nmodule.exports=WidgetLifecycle;`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;const module={exports:{}};vm.runInNewContext(compiled,{...globals,module,exports:module.exports});
 return{h,env,trace,timers,render:()=>h.render(module.exports),tick(){for(const[n,fn]of [...timers]){timers.delete(n);fn();}},resume(){change?.('active')},intent(destination){pendingDestination=destination;event?.();}};
}
test('global publication waits for selected city, language, settings AND theme hydration',async()=>{
 for(const gate of ['language','city','worship','theme']){const h=lifecycle();h.env[gate][gate==='language'?'ready':'hydrated']=false;h.render();await flush();h.tick();assert.equal(h.trace.sync.length,0,gate);assert.equal(h.trace.register,0,gate);h.env[gate][gate==='language'?'ready':'hydrated']=true;h.render();await flush();assert.equal(h.trace.sync.length,1,gate);assert.equal(h.trace.sync[0].location.label,'Saved city');assert.equal(h.trace.sync[0].tasbih.count,19);h.h.unmount();}
});
test('a pending counter read cannot publish zero or a default/null city; latest selected settings win',async()=>{
 const h=lifecycle(),pending=deferred();h.env.read=()=>pending.promise;assert.equal(h.render(),null);await flush();h.tick();assert.equal(h.trace.sync.length,0);assert.equal(h.trace.navigate[0][1].screen,'Prayer','Destination navigation must not wait for counter/storage/network');h.env.city.location={...h.env.city.location,label:'New manually selected city'};h.env.worship.settings.timeFormat='12';h.render();pending.resolve({...h.env.counter,count:27});await flush();assert.equal(h.trace.sync[0].location.label,'New manually selected city');assert.equal(h.trace.sync[0].timeFormat,'12');assert.equal(h.trace.sync[0].tasbih.count,27);h.h.unmount();
});
test('foreground guard synchronously blocks an already pending timer before React can rerender',async()=>{
 const h=lifecycle('ios');h.render();await flush();h.render();assert.ok(h.timers.size);const before=h.trace.sync.length,pending=deferred();h.env.read=()=>pending.promise;h.resume();h.tick();await flush();assert.equal(h.trace.sync.length,before);pending.resolve({...h.env.counter,count:31});await flush();assert.equal(h.trace.sync.at(-1).tasbih.count,31);h.h.unmount();
});
test('warm intent events route immediately even with no AppState change; cleanup removes all listeners',async()=>{
 const h=lifecycle();h.render();await flush();const before=h.trace.reads;h.intent('hijri');await flush();assert.deepEqual(h.trace.navigate.at(-1),['Main',{screen:'Tools',params:{screen:'Hijri Calendar',initial:false}}]);assert.equal(h.trace.reads,before);h.intent('tasbih');await flush();assert.equal(h.trace.navigate.at(-1)[1].params.screen,'Tasbih');h.h.unmount();assert.equal(h.trace.removed,2);assert.equal(h.timers.size,0);
});
test('counter read failures do not prevent Android prayer/Hijri sync, but never replace an iOS snapshot',async()=>{
 for(const platform of ['android','ios']){const h=lifecycle(platform);h.env.read=async()=>{throw Error('unreadable')};h.render();await flush();assert.equal(h.trace.sync.length,platform==='android'?1:0);if(platform==='android')assert.equal(h.trace.sync[0].tasbih,null);h.h.unmount();}
});
test('web does not register native listeners or publish widgets',async()=>{const h=lifecycle('web');h.render();await flush();h.tick();assert.equal(h.trace.register,0);assert.equal(h.trace.sync.length,0);assert.equal(h.trace.reads,0);h.h.unmount();});
test('local Home prayer result is applied independently of optional network content, without a competing full widget publisher',async()=>{
 const code=functionSource('useHomeData');assert.match(code,/managedPrayerSnapshot\(location,settings\)\.then\(p=>\{setSnapshot\(p.snapshot\)/);assert.match(code,/Promise\.all\(\[prayerTask/);assert.ok(!/\bsyncWidgets\(/.test(code));assert.match(code,/syncWidgetAyah\(ayah,dateKey\)/);
 assert.ok(!functionSource('TasbihScreen').includes('syncWidgets('));assert.ok(functionSource('reloadAllState').includes('loadTasbihState(true)'));assert.ok(app.indexOf('<LocationProvider><WidgetLifecycle/><AppShell/>')>0);
});
