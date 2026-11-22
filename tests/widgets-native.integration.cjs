/** Real JS exports + native TasbihBridge/DataStore through a test-only stdio
 * transport, NOT a substituted counter reducer and NOT an Expo JNI/device run.
 * Run after the standalone native harness exports its unit-test classpath. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const readline=require('node:readline');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
const root=path.resolve(__dirname,'..'),cwd=path.join(root,'tests/android-widgets');
const clean=value=>JSON.parse(JSON.stringify(value));

test('actual JS counter/exported adapter and Android DataStore recover without reset or duplicate taps',{timeout:120_000},async t=>{
 const java=process.env.JAVA_HOME?path.join(process.env.JAVA_HOME,'bin/java'):'java';
 const classpath=fs.readFileSync(path.join(cwd,'.gradle/widget-test-classpath.txt'),'utf8').trim();
 const child=spawn(java,['-Xmx256m','-XX:MaxMetaspaceSize=192m','-XX:ActiveProcessorCount=2','-Xss512k','-Dfile.encoding=UTF-8','-Drobolectric.dependency.repo.url=https://repo.maven.apache.org/maven2','-cp',classpath,'org.junit.runner.JUnitCore','com.deen.widgets.WidgetBridgeRpcTest'],{cwd,stdio:['pipe','pipe','pipe']});
 let output='',next=0,resolveReady,rejectReady,exited=false;
 const pending=new Map(),ready=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
 const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>{exited=true;const error=Error(`Native integration exited ${code}/${signal}\n${output.slice(-5000)}`);for(const work of pending.values())work.reject(error);pending.clear();rejectReady(error);resolve({code,signal});});});
 child.stderr.on('data',data=>{output+=data;});
 readline.createInterface({input:child.stdout}).on('line',line=>{
  output+=line+'\n';const marker=line.indexOf('ISLAMIC_WIDGET_RPC ');if(marker<0)return;
  // JUnit prints its progress dot without a newline before the first reply.
  const value=JSON.parse(line.slice(marker+'ISLAMIC_WIDGET_RPC '.length));if(value.event==='ready'){resolveReady();return;}
  const work=pending.get(value.id);if(!work)return;pending.delete(value.id);if(value.error)work.reject(Error(value.error));else work.resolve(value.result);
 });
 function rpc(method,fields={}){return new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});child.stdin.write(JSON.stringify({id,method,...fields})+'\n');});}
 const startup=setTimeout(()=>rejectReady(Error('Native integration startup timeout\n'+output.slice(-3000))),60_000);
 let mirror,loseNextAcknowledgment=false;const commands=[];
 try {
  await ready;clearTimeout(startup);
  const original={phraseId:'alhamdulillah',count:8,goal:99,rounds:7,days:{'2020-01-01':83},sessions:Array.from({length:85},(_,i)=>({id:`kept-${i}`,phrase:'Alhamdulillah',count:12,goal:33,completedAt:i+1})),unknownField:{retain:'all'}};
  mirror=JSON.stringify(original);
  const native={tasbihRead:()=>rpc('read'),tasbihCommand:async command=>{commands.push(JSON.parse(command));const result=await rpc('command',{command});if(loseNextAcknowledgment){loseNextAcknowledgment=false;throw Error('Simulated lost transport acknowledgment AFTER a real native commit');}return result;},publish:async()=>true,read:async()=>null,refresh:async()=>true,clear:async()=>true,startActivity:async()=>false,stopActivity:async()=>true};
  const load=createLoader({'react':{useEffect(){},useState(){}},'react-native':{Platform:{OS:'android'}},'expo':{requireNativeModule(name){assert.equal(name,'DeenWidgetBridge');return native;}},'@react-native-async-storage/async-storage':{getItem:async key=>{assert.equal(key,'tasbih-state-v1');return mirror;}},'./storage':{writeText:async(key,value)=>{assert.equal(key,'tasbih-state-v1');mirror=value;return true;}}});
  const api=load('src/services/tasbihService.ts'),events=[];api.subscribeTasbih(value=>events.push(clean(value)));
  await t.test('a genuinely empty native authority imports the complete existing app record',async()=>{
   assert.equal(await rpc('read'),null);assert.deepEqual(clean(await api.loadTasbihState()),original);assert.deepEqual(JSON.parse(await rpc('read')),original);assert.equal(commands[0].op,'init');
  });
  await t.test('100 app taps traverse the exported wrapper and real native transaction/rollover',async()=>{
   await Promise.all(Array.from({length:100},()=>api.tapTasbih()));const value=JSON.parse(await rpc('read'));assert.equal(value.count,9);assert.equal(value.rounds,8);assert.equal(Object.values(value.days).reduce((a,b)=>a+b,0),183);assert.deepEqual(value.sessions,original.sessions);assert.deepEqual(value.unknownField,original.unknownField);assert.deepEqual(JSON.parse(mirror),value);assert.equal(new Set(commands.map(c=>c.idempotencyKey)).size,commands.length);
  });
  await t.test('a launcher-side transaction is adopted in full without a competing app counter',async()=>{
   await rpc('widgetTap',{key:'native-widget-tap'});const before=commands.length;const adopted=await api.loadTasbihState();assert.equal(adopted.count,10);assert.equal(commands.length,before);assert.deepEqual(JSON.parse(mirror),JSON.parse(await rpc('read')));
  });
  await t.test('a lost reply after native persistence produces safe read-only recovery, not another tap',async()=>{
   loseNextAcknowledgment=true;const before=commands.length;await assert.rejects(api.tapTasbih(),/lost transport acknowledgment/);assert.equal(api.getTasbihStatus().phase,'error');assert.equal(events.at(-1).count,10);assert.equal(JSON.parse(await rpc('read')).count,11);await assert.rejects(api.tapTasbih());assert.equal(commands.length,before+1);await api.loadTasbihState();assert.equal(commands.length,before+1);assert.equal(events.at(-1).count,11);assert.equal(api.getTasbihStatus().phase,'ready');
  });
  await t.test('session/phrase/goal/reset commands preserve all imported history and unknown fields',async()=>{
   await api.saveTasbihSession();let value=JSON.parse(await rpc('read'));assert.equal(value.count,0);assert.equal(value.sessions.length,86);assert.equal(value.sessions[0].count,11);assert.equal(value.sessions.at(-1).id,'kept-84');const days=clean(value.days);await api.setTasbihGoal(33);await api.setTasbihPhrase('subhan-allah');await api.tapTasbih();await api.resetTasbihCount();value=JSON.parse(await rpc('read'));assert.equal(value.goal,33);assert.equal(value.phraseId,'subhan-allah');assert.equal(value.count,0);assert.equal(value.sessions.length,86);assert.deepEqual(value.unknownField,original.unknownField);assert.equal(Object.values(value.days).reduce((a,b)=>a+b,0),Object.values(days).reduce((a,b)=>a+b,0)+1);
  });
  await rpc('close');child.stdin.end();const result=await exit;assert.equal(result.code,0,output.slice(-5000));assert.match(output,/OK \(1 test\)/);
 } finally {
  clearTimeout(startup);if(!exited){child.stdin.end();child.kill('SIGTERM');}for(const value of pending.values())value.reject(Error('integration cleanup'));pending.clear();
 }
});
