const assert=require('node:assert/strict');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
const fixed=Date.parse('2026-10-26T00:00:00Z');
class ClockDate extends Date {constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}}
const city={latitude:24.8607,longitude:67.0011,label:'Karachi, Pakistan',timezone:'Asia/Karachi'};
const input={location:city,calculationMethod:9,madhab:'shafi',timeFormat:'24',language:'en',dark:false};
const verse={reference:'1:2',arabic:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',translation:'All praise is for Allah, Lord of all worlds.'};
function harness(overrides={}){
 const writes=[],cacheReads=[];
 const bridge={widgetsAvailable:()=>true,publishSnapshotJson:async raw=>{writes.push(JSON.parse(raw));return true;},readSnapshotJson:async()=>null,startActivity:async()=>true,...overrides};
 const load=createLoader({'react-native':{Platform:{OS:'android'}},'./localState':{loadDailyContent:async date=>{cacheReads.push(date);return null;}},'./widgetBridge':bridge},{Date:ClockDate});
 return {api:load('src/services/widgetSync.ts'),model:load('src/services/widgetSnapshot.ts'),prayers:load('src/services/prayerTimes.ts'),copy:load('src/services/widgetCopy.ts'),hijri:load('src/services/hijri.ts'),writes,cacheReads,bridge};
}
test('32-day runway is canonical selected-city times/epochs, never phone-zone reconstruction',()=>{
 const original=process.env.TZ;let reference;
 try{for(const timezone of ['Asia/Dubai','UTC','America/Los_Angeles','Pacific/Kiritimati']){
  process.env.TZ=timezone;const h=harness(),s=h.api.buildWidgetSnapshot(input,new Date(fixed));assert.equal(s.v,1);assert.equal(s.schema,2);assert.equal(s.date,'2026-10-26');assert.equal(s.days.length,32);assert.equal(s.today.length,6);assert.equal(s.today[0].time,'05:18');assert.equal(new Date(s.today[0].at).toISOString(),'2026-10-26T00:18:00.000Z');assert.equal(s.timezone,'Asia/Karachi');
  const serial=JSON.stringify(s.days);if(reference)assert.equal(serial,reference,timezone);reference=serial;
 }}finally{if(original===undefined)delete process.env.TZ;else process.env.TZ=original;}
});
test('selected-zone date rolls ahead/behind the phone correctly, with matching Hijri table',()=>{
 const h=harness();for(const [zone,expected]of [['Pacific/Kiritimati','2026-10-26'],['America/Los_Angeles','2026-10-25']]){
  const s=h.api.buildWidgetSnapshot({...input,location:{...city,timezone:zone}},new Date(fixed));assert.equal(s.date,expected);const [y,m,d]=expected.split('-').map(Number),hijri=h.hijri.hijriForDate(new Date(y,m-1,d,12));assert.equal(s.hijri,`${hijri.day} ${hijri.monthName} ${hijri.year}`);
 }
});
test('runway spans DST with an independently calculated epoch and displayed time for every day',()=>{
 const h=harness(),location={latitude:40.7128,longitude:-74.006,label:'New York',timezone:'America/New_York'},s=h.api.buildWidgetSnapshot({...input,location},new Date(fixed));
 for(const day of s.days){const[y,m,d]=day.date.split('-').map(Number),date=new Date(y,m-1,d,12),times=h.prayers.computeDayTimes(location.latitude,location.longitude,date,9,'shafi',location.timezone),epochs=h.prayers.computeDayDates(location.latitude,location.longitude,date,9,'shafi');for(const p of day.prayers){assert.equal(p.time,times[p.name]);assert.equal(p.at,epochs[p.name].getTime());}}
 assert.ok(s.days.some(day=>day.date==='2026-11-01'));assert.ok(s.days.some(day=>day.date==='2026-11-02'));
});
test('Sunrise stays visible in the six rows but is never the next/current Salah',()=>{
 const h=harness(),s=h.api.buildWidgetSnapshot(input,new Date(fixed)),sunrise=s.today.find(p=>p.name==='Sunrise'),fajr=s.today[0];let now=h.model.resolveNow(s,sunrise.at-1);assert.equal(now.current.name,'Fajr');assert.equal(now.next.name,'Dhuhr');assert.equal(h.model.resolveNow(s,s.today.at(-1).at+1).next.at,s.tomorrow[0].at);assert.equal(h.model.resolveNow(s,s.days.at(-1).prayers.at(-1).at+1).next,null);assert.equal(h.model.resolveNow(s,fajr.at-1000).next.name,'Fajr');
});
test('no/invalid city still supplies usable Hijri days without fabricated prayer instants or GPS',()=>{
 const h=harness();for(const location of [null,{latitude:NaN,longitude:0},{latitude:91,longitude:0},{latitude:0,longitude:181}]){const s=h.api.buildWidgetSnapshot({...input,location},new Date(fixed));assert.equal(s.days.length,32);assert.ok(s.hijri);assert.equal(s.today.length,0);assert.equal(h.model.resolveNow(s,fixed).next,null);}
 const s=h.api.buildWidgetSnapshot({...input,location:{...city,timezone:'invalid/timezone'}},new Date(fixed));assert.equal(s.timezone,'UTC');
});
test('method, madhab, 12/24 preference and all 22 label languages use existing app code',async()=>{
 const h=harness(),base=h.api.buildWidgetSnapshot(input,new Date(fixed)),hanafi=h.api.buildWidgetSnapshot({...input,madhab:'hanafi'},new Date(fixed));assert.notEqual(base.today.find(p=>p.name==='Asr').at,hanafi.today.find(p=>p.name==='Asr').at);
 const twelve=h.api.buildWidgetSnapshot({...input,timeFormat:'12'},new Date(fixed));assert.match(twelve.today[0].time,/AM$/);assert.equal(twelve.today[0].at,base.today[0].at);
 for(const language of h.copy.widgetLanguages){await h.copy.loadWidgetLanguage(language);const s=h.api.buildWidgetSnapshot({...input,language},new Date(fixed));assert.equal(s.language,language);assert.equal(s.today[0].label,h.copy.prayerName(language,'Fajr'));if(['uz','kk'].includes(language)){assert.match(s.days[0].gregorian,/[А-Яа-яҚқЎўҒғҲҳӘәІіҢңҮүҰұӨө]/u);assert.doesNotMatch(s.days[0].gregorian,/[A-Za-z]/);}}
});
test('cached calendars preserve calculation freshness during counter/daily-only updates',()=>{
 const h=harness(),first=h.api.buildWidgetSnapshot(input,new Date(fixed)),again=h.api.buildWidgetSnapshot({...input,tasbih:{count:19,target:33,label:'Subhan Allah'},ayah:verse},new Date(fixed+60_000));assert.equal(again.updatedAt,first.updatedAt);assert.equal(again.tasbih.count,19);assert.equal(again.ayah.ref,'1:2');assert.equal(again.today[0].at,first.today[0].at);
});
test('publication runs without Home, snapshot or any content network request; one cache read, not 32',async()=>{
 const h=harness();assert.equal(await h.api.syncWidgets(input),true);assert.equal(h.writes.length,1);assert.equal(h.writes[0].days.length,32);assert.equal(h.cacheReads.length,1);assert.equal(h.writes[0].place,city.label);
});
test('background refill carries a config precondition and native rejection reaches the caller',async()=>{
 const h=harness(),previous=h.api.buildWidgetSnapshot(input,new Date(fixed));h.bridge.readSnapshotJson=async()=>JSON.stringify(previous);h.bridge.publishSnapshotJson=async raw=>{h.writes.push(JSON.parse(raw));return false;};assert.equal(await h.api.refreshStoredWidgets(),false);assert.equal(h.writes[0].expectedConfig,JSON.stringify(previous.config));assert.equal(h.writes[0].config.location.label,city.label);
});
test('an old background snapshot never replaces the foreground input used for later Ayah writes',async()=>{
 const h=harness(),old=h.api.buildWidgetSnapshot({...input,location:{...city,label:'Old city'}},new Date(fixed));await h.api.syncWidgets(input);h.bridge.readSnapshotJson=async()=>JSON.stringify(old);await h.api.refreshStoredWidgets();await h.api.syncWidgetAyah(verse,'2026-10-26');assert.equal(h.writes.at(-1).place,city.label);assert.equal(h.writes.at(-1).ayah.ref,'1:2');assert.equal(h.writes.at(-1).expectedConfig,undefined);
});
test('failed publications remain retryable, no stored config is a safe background no-op',async()=>{
 let attempts=0;const h=harness({publishSnapshotJson:async()=>++attempts>1});assert.equal(await h.api.syncWidgets(input),false);assert.equal(await h.api.syncWidgets(input),true);assert.equal(await h.api.refreshStoredWidgets(),false);assert.equal(await harness({widgetsAvailable:()=>false}).api.syncWidgets(input),false);
});
