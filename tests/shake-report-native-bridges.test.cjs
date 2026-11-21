/** Explicit native-bridge and hook doubles exercise production code. These
 * are not installed Android/iOS, motion hardware or battery measurements. */
const assert=require('node:assert/strict');
const test=require('node:test');
const React=require('react');
const{createLoader}=require('./helpers/load-typescript.cjs');
const flush=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
function sensorHarness(platform='android',overrides={},globals={}){
 const calls=[],sensor={setUpdateInterval:ms=>calls.push(['rate',ms]),addListener:fn=>{calls.push(['listen']);sensor.emit=fn;return{remove:()=>calls.push(['remove'])}},isAvailableAsync:async()=>{calls.push(['available']);return true;},getPermissionsAsync:async()=>{calls.push(['permissions']);return{granted:true}},requestPermissionsAsync(){throw Error('Do not request permissions');},removeAllListeners(){throw Error('Do not remove other consumers');},...overrides};
 const api=createLoader({'expo-sensors':{Accelerometer:sensor},'react-native':{Platform:{OS:platform}}},globals)('src/services/appAccelerometer.ts');return{api,sensor,calls};
}
test('Qibla and shake share one bridge at the fastest live rate; removal restores 80ms without removing Qibla',()=>{
 const h=sensorHarness(),broker=h.api.createAccelerometerBroker(h.sensor),qibla=[],shake=[];
 const first=broker.subscribe(d=>qibla.push(d),80),second=broker.subscribe(d=>shake.push(d),40);const sample={x:0,y:0,z:1};h.sensor.emit(sample);assert.equal(qibla.length,1);assert.equal(shake.length,1);second.remove();second.remove();h.sensor.emit(sample);assert.equal(qibla.length,2);assert.equal(shake.length,1);first.remove();first.remove();
 assert.deepEqual(h.calls,[['rate',80],['listen'],['rate',40],['rate',80],['remove']]);
});
test('removing Qibla first keeps the shake subscription and its rate intact',()=>{
 const h=sensorHarness(),broker=h.api.createAccelerometerBroker(h.sensor);const qibla=broker.subscribe(()=>{},80),shake=broker.subscribe(()=>{},40);qibla.remove();assert.deepEqual(h.calls,[['rate',80],['listen'],['rate',40]]);shake.remove();assert.deepEqual(h.calls.at(-1),['remove']);
});
test('failed bridge attachment rolls back and can retry cleanly',()=>{
 let attempts=0;const h=sensorHarness('android',{addListener(){if(attempts++===0)throw Error('No sensor');return{remove(){}};}}),broker=h.api.createAccelerometerBroker(h.sensor);
 assert.throws(()=>broker.subscribe(()=>{},40));const next=broker.subscribe(()=>{},80);next.remove();assert.deepEqual(h.calls,[['rate',40],['rate',80]]);
});
test('invalid/high-rate requests cannot change native sensor configuration',()=>{
 const h=sensorHarness(),broker=h.api.createAccelerometerBroker(h.sensor);for(const rate of [0,1,10,NaN,Infinity])assert.throws(()=>broker.subscribe(()=>{},rate));assert.deepEqual(h.calls,[]);
});
test('availability is metadata only, respects denial/missing sensor, and never asks for permission',async()=>{
 for(const platform of ['android','ios']){const h=sensorHarness(platform);assert.equal(await h.api.isAppAccelerometerAvailable(),true);assert.deepEqual(h.calls,[['available'],['permissions']]);}
 for(const overrides of [{isAvailableAsync:async()=>false},{getPermissionsAsync:async()=>({granted:false})},{getPermissionsAsync:async()=>{throw Error('Denied')}}]){const h=sensorHarness('android',overrides);assert.equal(await h.api.isAppAccelerometerAvailable(),false);}
});
test('web availability never touches DeviceMotion or a sensor permission bridge',async()=>{const h=sensorHarness('web');assert.equal(await h.api.isAppAccelerometerAvailable(),false);assert.deepEqual(h.calls,[]);});
test('an unresponsive availability bridge is bounded and clears its timeout',async()=>{
 let timeout,cleared=0;const h=sensorHarness('ios',{isAvailableAsync:()=>new Promise(()=>{})},{setTimeout:fn=>{timeout=fn;return 7;},clearTimeout:id=>{assert.equal(id,7);cleared++;}});const pending=h.api.isAppAccelerometerAvailable();timeout();assert.equal(await pending,false);assert.equal(cleared,1);
});

test('nested native modals and overlay sheets hold independent idempotent blockers',()=>{
 const guard=createLoader()('src/services/shakeReportGuard.ts');let changes=0;const stop=guard.subscribeShakeReportGuard(()=>changes++);const first=guard.blockShakeReport(),second=guard.blockShakeReport();assert.equal(guard.isShakeReportBlocked(),true);first();first();assert.equal(guard.isShakeReportBlocked(),true);guard.setShakeReportOverlayActive(true);second();assert.equal(guard.isShakeReportBlocked(),true);guard.setShakeReportOverlayActive(false);assert.equal(guard.isShakeReportBlocked(),false);const n=changes;guard.setShakeReportOverlayActive(false);assert.equal(changes,n);stop();
});
test('only focused Qibla/lock/backup/reader-settings routes block; stale stack routes do not',()=>{
 const{shakeReportRoute:route}=createLoader()('src/services/shakeReportGuard.ts');for(const name of ['Qibla','Privacy Lock','Backup','Reader Settings'])assert.equal(route({routes:[{name}]}).blocked,true);
 const state={index:1,routes:[{name:'Qibla'},{name:'Main',state:{index:0,routes:[{name:'Quran',state:{index:1,routes:[{name:'Reader Settings'},{name:'Reader',key:'reader-42'}]}}]}}]};assert.equal(route(state).blocked,false);assert.ok(route(state).key.endsWith('/reader-42'));assert.equal(route(null).blocked,true);assert.equal(route({routes:[]}).blocked,true);
});
for(const platform of ['android','ios','web'])test(`${platform} SystemModal preserves window behavior and acquires only the intended shortcut blocker`,()=>{
 let effect,blocks=0,releases=0;const load=createLoader({'react':{...React,useEffect:fn=>{effect=fn;}},'react-native':{Platform:{OS:platform},Modal:()=>null},'react-native-safe-area-context':{SafeAreaProvider:()=>null},'./SystemNavigationBoundary':{SystemNavigationBoundary:()=>null},'../services/shakeReportGuard':{blockShakeReport:()=>{blocks++;return()=>releases++;}}});
 const{SystemModal}=load('src/components/SystemModal.tsx');SystemModal({visible:true,children:null});const stop=effect();assert.equal(blocks,platform==='web'?0:1);stop?.();assert.equal(releases,platform==='web'?0:1);
 SystemModal({visible:false,children:null});assert.equal(effect(),undefined);SystemModal({visible:true,blocksShakeReport:false,children:null});assert.equal(effect(),undefined);
});
test('native alerts release the guard on button, Android dismiss, and thrown bridge calls, retaining callbacks',()=>{
 for(const platform of ['android','ios']){let nativeArgs,blocks=0,releases=0,pressed=0,dismissed=0;const{AppAlert}=createLoader({'react-native':{Platform:{OS:platform},Alert:{alert:(...args)=>{nativeArgs=args;}}},'./shakeReportGuard':{blockShakeReport:()=>{blocks++;let done=false;return()=>{if(!done){done=true;releases++;}}}}})('src/services/guardedAppAlert.ts');
 AppAlert.alert('Title','Message',[{text:'Delete',style:'destructive',onPress:()=>pressed++}],{cancelable:true,onDismiss:()=>dismissed++});assert.equal(blocks,1);assert.equal(nativeArgs[0],'Title');assert.equal(nativeArgs[2][0].text,'Delete');assert.equal(nativeArgs[2][0].style,'destructive');nativeArgs[2][0].onPress();nativeArgs[3].onDismiss();assert.equal(releases,1);assert.equal(pressed,1);assert.equal(dismissed,1);
 AppAlert.alert('Default');assert.equal(nativeArgs[2].length,1);assert.equal(nativeArgs[2][0].text,undefined);nativeArgs[2][0].onPress();assert.equal(releases,2);
 }
 let released=false;const{AppAlert}=createLoader({'react-native':{Platform:{OS:'android'},Alert:{alert(){throw Error('Missing bridge')}}},'./shakeReportGuard':{blockShakeReport:()=>()=>released=true}})('src/services/guardedAppAlert.ts');assert.throws(()=>AppAlert.alert('Failed'));assert.equal(released,true);
});

/** Small explicit hook double; effects and cleanup are actually invoked, and
 * subsequent renders retain hook slots. It is not a React Native renderer. */
function hooks(){const slots=[];let index=0,pending=[];return{react:{...React,useRef(initial){const n=index++;return slots[n]||(slots[n]={current:initial});},useState(initial){const n=index++;if(!slots[n])slots[n]={value:typeof initial==='function'?initial():initial};return[slots[n].value,next=>{slots[n].value=typeof next==='function'?next(slots[n].value):next;}];},useEffect(fn,deps){const n=index++,old=slots[n];if(!old||!deps||deps.some((x,i)=>!Object.is(x,old.deps?.[i])))pending.push(()=>{old?.cleanup?.();slots[n]={deps,cleanup:fn()};});}},render(fn,props){index=0;const tree=fn(props);const effects=pending;pending=[];effects.forEach(fn=>fn());return tree;},unmount(){for(const slot of slots)slot?.cleanup?.();}};}
function find(node,testID){if(!node||typeof node!=='object')return null;if(node.props?.testID===testID)return node;for(const child of [node.props?.children].flat(Infinity)){const found=find(child,testID);if(found)return found;}return null;}
function nativeUI(platform='android'){
 const h=hooks(),events=new Map(),listeners=new Set(),timers=new Map(),trace={sensors:0,removed:0,opens:0},prefListeners=new Set();let sampleListener,clock=1000,id=0,preference={enabled:true,hydrated:true,saving:false,saveError:false},blocked=false;let guardListener;
 const pref={getSnapshot:()=>preference,hydrate:async()=>{},subscribe(fn){prefListeners.add(fn);return()=>prefListeners.delete(fn);},setEnabled:async value=>{preference={...preference,enabled:value};prefListeners.forEach(fn=>fn(preference));return true;}};
 const AppState={currentState:'active',addEventListener(name,fn){events.set(name,fn);listeners.add(fn);return{remove(){listeners.delete(fn);}}}};
 const Keyboard={isVisible:()=>false,addListener(name,fn){events.set(name,fn);listeners.add(fn);return{remove(){listeners.delete(fn);}}}};
 class FakeDate extends Date{static now(){return clock;}}
 const load=createLoader({'react':h.react,'react-native':{Platform:{OS:platform},AppState,Keyboard,AccessibilityInfo:{announceForAccessibility(){}},ActivityIndicator:'ActivityIndicator',Pressable:'Pressable',ScrollView:'ScrollView',Switch:'Switch',Text:'Text',View:'View'},'react-native-safe-area-context':{SafeAreaView:'SafeAreaView'},'./SystemModal':{SystemModal:'SystemModal'},'./Tactile':{Tactile:'Tactile'},'../services/appFeedback':{appFeedbackText:()=> 'Browser unavailable',openAppFeedbackForm:async()=>{trace.opens++;}},'../services/appAccelerometer':{isAppAccelerometerAvailable:async()=>true,subscribeAppAccelerometer(fn){trace.sensors++;sampleListener=fn;return{remove(){trace.removed++;sampleListener=null;}};}},'../services/shakeReportPreference':{shakeReportPreference:pref},'../services/shakeReportGuard':{isShakeReportBlocked:()=>blocked,subscribeShakeReportGuard(fn){guardListener=fn;return()=>{guardListener=null;};}}},{Date:FakeDate,setTimeout:(fn,ms)=>{const key=++id;timers.set(key,{fn,at:clock+ms});return key;},clearTimeout:key=>timers.delete(key)});
 const api=load('src/components/ShakeReportShortcut.tsx');const props={language:'en',rtl:false,styles:{},accent:'#333',card:'#fff',line:'#ddd',active:true,blocked:false,routeKey:'Home'};
 const element=api.ShakeReportShortcut(props),render=()=>h.render(element.type,props);
 function samples(fn,duration){for(let at=0;at<duration;at+=40){clock+=40;sampleListener?.(fn(at));}}
 return{h,api,props,events,listeners,timers,trace,AppState,render,pref,async shake(){samples(()=>({x:0,y:0,z:1}),800);samples(at=>({x:2.8*Math.sin(2*Math.PI*3.125*at/1000),y:0,z:1}),1600);await flush();},block(value){blocked=value;guardListener?.();},get sampleListener(){return sampleListener;}};
}

test('real native host wiring: own Android modal blur does not immediately dismiss its confirmation',async()=>{
 const h=nativeUI();assert.equal(h.render(),null);await flush();assert.equal(h.trace.sensors,1);await h.shake();assert.equal(h.trace.opens,0);assert.equal(h.sampleListener,null);let prompt=h.render();assert.equal(prompt.type,h.api.ShakeReportPrompt);
 h.events.get('blur')();prompt=h.render();assert.equal(prompt.type,h.api.ShakeReportPrompt,'Own modal window focus must not dismiss itself');
 h.AppState.currentState='background';h.events.get('change')('background');assert.equal(h.render(),null);h.h.unmount();assert.equal(h.listeners.size,0);assert.equal(h.timers.size,0);
});
test('real native host pauses before Android blur/keyboard, on guard/opt-out, and cleans up subscriptions',async()=>{
 const h=nativeUI();h.render();await flush();h.events.get('blur')();assert.equal(h.sampleListener,null);h.events.get('focus')();await flush();assert.ok(h.sampleListener);h.events.get('keyboardDidShow')();assert.equal(h.sampleListener,null);h.events.get('keyboardDidHide')();await flush();assert.ok(h.sampleListener);h.block(true);assert.equal(h.sampleListener,null);h.block(false);await flush();assert.ok(h.sampleListener);await h.pref.setEnabled(false);assert.equal(h.sampleListener,null);h.h.unmount();assert.equal(h.listeners.size,0);assert.equal(h.timers.size,0);
});
test('real native host explicitly opens the shared external helper only from the report action',async()=>{
 const h=nativeUI('ios');h.render();await flush();await h.shake();const prompt=h.render();assert.equal(h.trace.opens,0);prompt.props.onReport();await flush();assert.equal(h.trace.opens,1);assert.equal(h.render(),null);h.h.unmount();assert.equal(h.timers.size,0);
});
test('real setting wiring reads an opt-in, awaits capability, changes only its preference and renders a labelled switch',async()=>{
 const h=nativeUI();await h.pref.setEnabled(false);const element=h.api.ShakeReportSetting(h.props);let view=h.h.render(element.type,element.props);let toggle=find(view,'settings-shake-report-switch');assert.equal(toggle.props.value,false);assert.equal(toggle.props.disabled,true);await flush();view=h.h.render(element.type,element.props);toggle=find(view,'settings-shake-report-switch');assert.equal(toggle.props.disabled,false);assert.equal(toggle.props.accessibilityLabel,'Shake to report');toggle.props.onValueChange(true);await flush();view=h.h.render(element.type,element.props);toggle=find(view,'settings-shake-report-switch');assert.equal(toggle.props.value,true);assert.equal(h.trace.sensors,0,'Settings capability check must not start sampling');h.h.unmount();
});
test('real prompt view keeps localized accessible controls, wrapping text, Back/escape, error and busy state',()=>{
 const h=nativeUI();let cancels=0,reports=0;const tree=h.api.ShakeReportPrompt({...h.props,busy:true,error:true,onCancel:()=>cancels++,onReport:()=>reports++});assert.equal(tree.props.blocksShakeReport,false);tree.props.onRequestClose();const prompt=find(tree,'shake-report-prompt');assert.equal(prompt.props.accessibilityViewIsModal,true);prompt.props.onAccessibilityEscape();assert.equal(cancels,2);const confirm=find(tree,'shake-report-confirm'),cancel=find(tree,'shake-report-cancel');assert.equal(confirm.props.disabled,true);assert.equal(confirm.props.accessibilityState.busy,true);assert.equal(confirm.props.accessibilityLabel,'Open report form');assert.equal(cancel.props.accessibilityLabel,'Not now');cancel.props.onPress();assert.equal(cancels,3);assert.ok(find(tree,'shake-report-error'));assert.equal(reports,0);
});
