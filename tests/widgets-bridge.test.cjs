/** Executes the real TS wrapper/adapter with native bridge doubles. These are
 * contract/race tests, not a Play binary or launcher/device acceptance test. */
const assert=require('node:assert/strict');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
function harness(overrides={}) {
  const calls=[];
  const native={publish:async value=>{calls.push(['publish',value]);return true;},refresh:async()=>{calls.push(['refresh']);return true;},read:async()=>'{"v":1}',clear:async()=>true,startActivity:async()=>false,stopActivity:async()=>true,...overrides};
  const load=createLoader({'expo':{requireNativeModule:name=>{assert.equal(name,'DeenWidgetBridge');return native;}}});
  return{api:load('src/services/widgetBridge.ts'),native,calls};
}
test('checked adapter reaches the exported wrapper, which calls all four native snapshot methods',async()=>{
 const h=harness();assert.equal(h.api.widgetsAvailable(),true);assert.equal(await h.api.publishSnapshotJson('one'),true);assert.equal(await h.api.readSnapshotJson(),'{"v":1}');assert.equal(await h.api.clearSnapshot(),true);assert.equal(await h.api.refreshWidgets(),true);
 assert.deepEqual(h.calls,[['publish','one'],['refresh'],['refresh']]);
});
test('publication and redraw are serialized; successful identical writes alone deduplicate',async()=>{
 let release;const h=harness({publish:async value=>{h.calls.push(['publish',value]);if(value==='first')await new Promise(r=>release=r);return true;}});
 const first=h.api.publishSnapshotJson('first'),second=h.api.publishSnapshotJson('second');await Promise.resolve();await Promise.resolve();assert.deepEqual(h.calls,[['publish','first']]);release();assert.equal(await first,true);assert.equal(await second,true);await h.api.publishSnapshotJson('second');
 assert.deepEqual(h.calls,[['publish','first'],['refresh'],['publish','second'],['refresh']]);assert.ok(h.api.lastPublishTime()>0);
});
test('native false/rejection and failed redraw never become cached successes or false acknowledgments',async()=>{
 for(const kind of ['false','throw','refresh']){let attempt=0;const h=harness({publish:async()=>{attempt++;if(attempt===1&&kind==='throw')throw Error('disk');return !(attempt===1&&kind==='false');},refresh:async()=>!(attempt===1&&kind==='refresh')});assert.equal(await h.api.publishSnapshotJson('same'),false,kind);assert.equal(h.api.lastPublishTime(),0);assert.equal(await h.api.publishSnapshotJson('same'),true);assert.equal(attempt,2);}
});
test('clearing derived state is ordered behind in-flight writes and invalidates deduplication',async()=>{
 const events=[];let release;const h=harness({publish:async()=>{events.push('write');if(events.length===1)await new Promise(r=>release=r);return true;},clear:async()=>{events.push('clear-derived');return true;}});
 const write=h.api.publishSnapshotJson('x'),clear=h.api.clearSnapshot();await Promise.resolve();await Promise.resolve();assert.deepEqual(events,['write']);release();await write;await clear;assert.equal(h.api.lastPublishTime(),0);await h.api.publishSnapshotJson('x');assert.deepEqual(events,['write','clear-derived','write']);
});
test('web/Expo Go/missing local module fail closed without throwing or claiming availability',async()=>{
 const api=createLoader({'expo':{requireNativeModule(){throw Error('not in this binary')}}})('src/services/widgetBridge.ts');assert.equal(api.widgetsAvailable(),false);assert.equal(await api.publishSnapshotJson('{}'),false);assert.equal(await api.readSnapshotJson(),null);assert.equal(await api.refreshWidgets(),false);assert.equal(await api.clearSnapshot(),false);assert.equal(await api.commandTasbihJson('{}'),null);assert.equal(api.nativeTasbihAvailable(),false);assert.equal(await api.consumeWidgetDestination(),null);api.subscribeWidgetDestination(()=>{})();
});
test('old binary remains compatible with snapshots and optional new counter/navigation APIs',async()=>{
 const h=harness();assert.equal(h.api.nativeTasbihAvailable(),false);assert.equal(await h.api.commandTasbihJson('{}'),null);assert.equal(await h.api.readNativeTasbihJson(),null);assert.equal(await h.api.consumeWidgetDestination(),null);h.api.subscribeWidgetDestination(()=>{})();assert.equal(await h.api.publishSnapshotJson('{}'),true);
});
test('supported native counter errors propagate: never silently mutate a second counter',async()=>{
 const failure=Error('acknowledgment lost');const h=harness({tasbihRead:async()=>{throw failure;},tasbihCommand:async()=>{throw failure;}});assert.equal(h.api.nativeTasbihAvailable(),true);await assert.rejects(h.api.commandTasbihJson('{}'),e=>e===failure);await assert.rejects(h.api.readNativeTasbihJson(),e=>e===failure);
});
test('counter commands, state reads and warm destination events retain their native contract',async()=>{
 let listener,removed=0;const h=harness({tasbihRead:async()=>'{"count":19}',tasbihCommand:async raw=>raw,consumeDestination:async()=>'hijri',addListener(name,fn){assert.equal(name,'onWidgetDestination');listener=fn;return{remove(){removed++}};}});assert.equal(h.api.nativeTasbihAvailable(),true);assert.equal(await h.api.commandTasbihJson('tap'),'tap');assert.equal(await h.api.readNativeTasbihJson(),'{"count":19}');assert.equal(await h.api.consumeWidgetDestination(),'hijri');let events=0;const stop=h.api.subscribeWidgetDestination(()=>events++);listener();stop();assert.equal(events,1);assert.equal(removed,1);
});
