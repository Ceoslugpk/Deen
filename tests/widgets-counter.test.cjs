const assert=require('node:assert/strict');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
const clone=value=>JSON.parse(JSON.stringify(value));
const original={phraseId:'alhamdulillah',count:8,goal:99,rounds:7,days:{'2020-01-01':83},sessions:[{id:'keep-me',phrase:'Alhamdulillah',count:12,goal:33,completedAt:1}],unknownField:'retain-me'};
function harness(options={}){
 let mirror=JSON.stringify(options.saved??original),native=options.nativeState?clone(options.nativeState):null;const commands=[],writes=[],events=[];let reads=0;
 const bridge={nativeTasbihAvailable:()=>options.supported!==false,readNativeTasbihJson:async()=>{if(options.nativeReadFailure)throw Error('native read failed');return native?JSON.stringify(native):null;},commandTasbihJson:async raw=>{
  const command=JSON.parse(raw);commands.push(command);if(options.commandFailure){if(options.commitBeforeFailure)native={...native,count:native.count+1};throw Error('native acknowledgment lost');}
  if(command.op==='restore'||(command.op==='init'&&!native))native=clone(command.state);
  if(command.op==='tap'){native.count++;if(native.count>=native.goal){native.count=0;native.rounds++;}}
  if(command.op==='reset')native.count=0;
  return JSON.stringify(native);
 },readSnapshotJson:async()=>options.iosSnapshot?JSON.stringify(options.iosSnapshot):null,lastPublishTime:()=>options.lastPublishTime??1000};
 const load=createLoader({'react':{useState(){},useEffect(){}},'react-native':{Platform:{OS:options.platform??'android'}},'@react-native-async-storage/async-storage':{getItem:async()=>{reads++;if(options.mirrorReadFailure)throw Error('mirror unreadable');return mirror;}},'./storage':{writeText:async(key,value)=>{assert.equal(key,'tasbih-state-v1');writes.push(JSON.parse(value));if(options.mirrorWriteThrows)throw Error('backup threw');if(options.mirrorWriteFailure)return false;mirror=value;return true;}},'./widgetBridge':bridge});
 const api=load('src/services/tasbihService.ts');api.subscribeTasbih(value=>events.push(clone(value)));
 return{api,commands,writes,events,options,setMirror(value){mirror=typeof value==='string'?value:JSON.stringify(value);},get mirror(){return mirror;},get native(){return native;},setNative(value){native=clone(value);},get reads(){return reads;}};
}
test('first Android initialization imports the complete saved state/unknown fields without deleting history',async()=>{
 const h=harness(),state=await h.api.loadTasbihState();assert.deepEqual(clone(state),original);assert.deepEqual(h.native,original);assert.equal(h.commands[0].op,'init');assert.equal(h.commands[0].label,'Alhamdulillah');assert.deepEqual(h.native.sessions,original.sessions);
});
test('ordinary foreground hydration adopts full native state rather than a timestamp/count-only merge',async()=>{
 const authoritative={...original,count:18,rounds:9,days:{...original.days,'2026-10-26':127},sessions:[...original.sessions,{id:'widget-session',count:33,goal:33,completedAt:2,phrase:'Subhan Allah'}]};const h=harness({nativeState:authoritative});const state=await h.api.loadTasbihState();assert.deepEqual(clone(state),authoritative);assert.deepEqual(JSON.parse(h.mirror),authoritative);assert.equal(h.commands.length,0);assert.equal(h.reads,0);
});
test('an unreadable backup mirror cannot block/overwrite an existing authoritative native counter',async()=>{
 const h=harness({nativeState:original,mirrorReadFailure:true});assert.deepEqual(clone(await h.api.loadTasbihState()),original);assert.equal(h.reads,0);assert.equal(h.commands.length,0);
});
test('uninitialized native state plus corrupt/unreadable backup fails safely, never initializing zero',async()=>{
 for(const options of [{mirrorReadFailure:true},{}]){const h=harness(options);h.setMirror('{not-json');await assert.rejects(h.api.loadTasbihState(),/original data retained/);assert.equal(h.commands.length,0);assert.equal(h.writes.length,0);assert.equal(h.native,null);assert.equal(h.mirror,'{not-json');}
});
test('a failed native read is not mistaken for an empty store or a web/local fallback',async()=>{
 const h=harness({nativeReadFailure:true,nativeState:original});await assert.rejects(h.api.loadTasbihState(),/native read failed/);assert.equal(h.reads,0);assert.equal(h.commands.length,0);assert.equal(h.writes.length,0);
});
test('explicit backup restore alone replaces native state with the restored full record',async()=>{
 const h=harness({nativeState:{...original,count:29}});await h.api.loadTasbihState();const restored={...original,count:3,days:{'2019-04-04':129},sessions:[{...original.sessions[0],id:'from-backup'}]};h.setMirror(restored);await h.api.loadTasbihState(true);assert.deepEqual(h.native,restored);assert.deepEqual(h.commands.map(c=>c.op),['restore']);
});
test('100 overlapping app taps serialize into acknowledged native commands with distinct retry keys',async()=>{
 const h=harness({nativeState:{...original,count:0,goal:33,rounds:0}});await Promise.all(Array.from({length:100},()=>h.api.tapTasbih()));assert.equal(h.native.count,1);assert.equal(h.native.rounds,3);assert.equal(h.commands.length,100);assert.equal(new Set(h.commands.map(c=>c.idempotencyKey)).size,100);assert.equal(h.events.at(-1).count,1);assert.deepEqual(h.native.sessions,original.sessions);
});
test('an ambiguous native tap never runs the local reducer or repeats the command automatically',async()=>{
 const h=harness({nativeState:original});await h.api.loadTasbihState();const writes=h.writes.length;h.options.commandFailure=true;h.options.commitBeforeFailure=true;await assert.rejects(h.api.tapTasbih(),/acknowledgment lost/);assert.equal(h.commands.length,1);assert.equal(h.writes.length,writes);assert.equal(h.events.at(-1).count,8);assert.equal(h.native.count,9);h.options.commandFailure=false;await h.api.loadTasbihState();assert.equal(h.events.at(-1).count,9);
});
test('a failed backup mirror cannot undo or hide an acknowledged native count',async()=>{
 const h=harness({nativeState:original,mirrorWriteFailure:true});await h.api.loadTasbihState();await h.api.tapTasbih();assert.equal(h.events.at(-1).count,9);assert.equal(h.native.count,9);
});
test('web/old binary uses existing local reducer/history and does not issue native commands',async()=>{
 const h=harness({supported:false,platform:'web'});await h.api.loadTasbihState();await h.api.tapTasbih();assert.equal(h.events.at(-1).count,9);assert.deepEqual(h.events.at(-1).sessions,original.sessions);assert.equal(h.commands.length,0);assert.equal(h.events.at(-1).days['2020-01-01'],83);
});
test('local-only persistence failures reject without presenting an unsaved change as successful',async()=>{
 const h=harness({supported:false,platform:'web'});await h.api.loadTasbihState();h.options.mirrorWriteFailure=true;await assert.rejects(h.api.tapTasbih(),/could not be saved/);assert.equal(h.events.at(-1).count,8);assert.equal(JSON.parse(h.mirror).count,8);
});
test('saving a round keeps every prior session, including imports longer than the old UI cap',async()=>{
 const sessions=Array.from({length:85},(_,i)=>({...original.sessions[0],id:`history-${i}`}));const h=harness({supported:false,platform:'web',saved:{...original,sessions}});await h.api.loadTasbihState();await h.api.saveTasbihSession();const saved=JSON.parse(h.mirror);assert.equal(saved.sessions.length,86);assert.equal(saved.sessions.at(-1).id,'history-84');assert.equal(saved.count,0);assert.deepEqual(saved.days,original.days);
});
test('iOS preserves its Swift/AppGroup timestamp contract before any new full publication',async()=>{
 const h=harness({supported:false,platform:'ios',iosSnapshot:{tasbihAt:2000,tasbih:{count:23}}});const state=await h.api.loadTasbihState();assert.equal(state.count,23);assert.deepEqual(clone(state.sessions),original.sessions);assert.deepEqual(clone(state.days),original.days);assert.equal(h.commands.length,0);h.setMirror({...original,count:4});await h.api.loadTasbihState(true);assert.equal(h.events.at(-1).count,4,'Explicit restore must not immediately be undone by the old widget stamp');
});
test('an older iOS widget stamp does not replace the newer app value',async()=>{
 const h=harness({supported:false,platform:'ios',iosSnapshot:{tasbihAt:500,tasbih:{count:2}}});assert.equal((await h.api.loadTasbihState()).count,8);
});

test('failed commands suspend already queued mutations until an explicit read succeeds; Retry never replays a tap',async()=>{
 const h=harness({nativeState:original});await h.api.loadTasbihState();h.options.commandFailure=true;h.options.commitBeforeFailure=true;
 const results=await Promise.allSettled([h.api.tapTasbih(),h.api.tapTasbih(),h.api.tapTasbih()]);assert.ok(results.every(result=>result.status==='rejected'));
 assert.equal(h.commands.length,1);assert.equal(h.native.count,9);assert.equal(h.api.getTasbihStatus().phase,'error');assert.equal(h.api.getTasbihStatus().code,'TW_COMMAND');
 h.options.commandFailure=false;await h.api.loadTasbihState();assert.equal(h.commands.length,1,'Read-only Retry cannot add an uncertain tap');assert.equal(h.events.at(-1).count,9);assert.equal(h.api.getTasbihStatus().phase,'ready');await h.api.tapTasbih();assert.equal(h.native.count,10);
});
test('a rejected native read has a stable diagnostic and can recover in the same process without initializing or clearing data',async()=>{
 const h=harness({nativeState:original,nativeReadFailure:true}),statuses=[];const unsubscribe=h.api.subscribeTasbihStatus(value=>statuses.push({...value}));
 await assert.rejects(h.api.loadTasbihState());assert.equal(h.api.getTasbihStatus().code,'TW_READ');assert.equal(h.commands.length,0);assert.equal(h.writes.length,0);
 h.options.nativeReadFailure=false;await h.api.loadTasbihState();assert.equal(h.native.count,8);assert.deepEqual(h.native.sessions,original.sessions);assert.deepEqual(statuses.map(s=>s.phase),['loading','error','loading','ready']);unsubscribe();
});
test('initial import failures remain nondestructive and retryable without falling back to a second counter',async()=>{
 const h=harness({commandFailure:true}),before=h.mirror;await assert.rejects(h.api.loadTasbihState());assert.equal(h.api.getTasbihStatus().code,'TW_IMPORT');assert.equal(h.native,null);assert.equal(h.mirror,before);
 h.options.commandFailure=false;await h.api.loadTasbihState();assert.deepEqual(h.native,original);assert.deepEqual(h.commands.map(c=>c.op),['init','init']);assert.equal(h.api.getTasbihStatus().phase,'ready');
});
test('malformed native records never reach React subscribers or overwrite a valid backup',async()=>{
 for(const record of [{...original,days:null},{...original,sessions:{}},{...original,sessions:[{id:'broken'}]},{...original,goal:0},{...original,count:'8'}]){
  const h=harness({nativeState:record}),before=h.mirror;await assert.rejects(h.api.loadTasbihState());assert.equal(h.api.getTasbihStatus().code,'TW_DATA');assert.equal(h.events.length,0);assert.equal(h.writes.length,0);assert.equal(h.mirror,before);assert.deepEqual(h.native,record);
 }
});
test('a thrown backup writer or UI subscriber cannot turn an acknowledged native change into a failed command',async()=>{
 const h=harness({nativeState:original,mirrorWriteThrows:true});h.api.subscribeTasbih(()=>{throw Error('unmounted screen')});await h.api.loadTasbihState();await h.api.tapTasbih();assert.equal(h.native.count,9);assert.equal(h.events.at(-1).count,9);assert.equal(h.api.getTasbihStatus().phase,'ready');
});
test('loading/error status is independent of saved state and listeners can unsubscribe without mutating history',async()=>{
 const h=harness({nativeState:original}),seen=[];assert.equal(h.api.getTasbihStatus().phase,'idle');const off=h.api.subscribeTasbihStatus(s=>seen.push(s.phase));await h.api.loadTasbihState();off();await h.api.loadTasbihState();assert.deepEqual(seen,['loading','ready']);assert.deepEqual(h.native,original);
});
