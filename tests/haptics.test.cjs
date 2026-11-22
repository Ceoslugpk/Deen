const assert=require('node:assert/strict');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
function harness(os='android',reject=false){const calls=[];const native={ImpactFeedbackStyle:{Light:'light',Medium:'medium'},NotificationFeedbackType:{Success:'success',Warning:'warning',Error:'error'}};for(const method of ['impactAsync','selectionAsync','notificationAsync'])native[method]=value=>{calls.push([method,value]);if(reject==='sync')throw Error('unavailable');return reject?Promise.reject(Error('unavailable')):Promise.resolve();};return{calls,api:createLoader({'react-native':{Platform:{OS:os}},'expo-haptics':native})('src/services/haptics.ts')};}
test('asynchronous haptic rejections are consumed for every counter/alert feedback kind',async()=>{
 const h=harness('android',true);for(const kind of ['tap','select','toggle','count','success','warning','error'])assert.doesNotThrow(()=>h.api.haptic(kind));await new Promise(setImmediate);assert.equal(h.calls.length,7);
});
test('a haptic failure never prevents its wrapped counter handler from running',async()=>{
 for(const failure of [true,'sync']){const h=harness('android',failure);let taps=0;assert.equal(h.api.withHaptic(()=>++taps,'count')(),1);await new Promise(setImmediate);assert.equal(taps,1);}
});
test('web and disabled haptics remain silent; iOS retains its existing feedback mapping',()=>{
 const web=harness('web');web.api.haptic();assert.equal(web.calls.length,0);const ios=harness('ios');ios.api.setHapticsEnabled(false);ios.api.haptic();assert.equal(ios.calls.length,0);ios.api.setHapticsEnabled(true);ios.api.haptic('success');assert.deepEqual(ios.calls,[['notificationAsync','success']]);
});
