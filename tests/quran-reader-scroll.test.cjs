const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { createMeasuredVerseScroll, READER_SCROLL_MAX_ATTEMPTS } = createLoader()('src/services/quranReaderScroll.ts');
function harness({ count = 286, highest = 11, advance = 8, average = 300 } = {}) {
  let now = 0, id = 0, mounted = true; const timers = new Map(), calls = [];
  const list = {
    scrollToIndex(options) {
      calls.push({ type: 'index', ...options });
      if (options.index > highest) api.failed({ index: options.index, highestMeasuredFrameIndex: highest, averageItemLength: average });
    },
    scrollToOffset(options) { calls.push({ type: 'offset', ...options }); highest = Math.min(count - 1, highest + advance); },
  };
  const api = createMeasuredVerseScroll({
    getList: () => mounted ? list : null, getItemCount: () => count,
    schedule: (callback, delay) => { const key = ++id; timers.set(key, { at: now + delay, callback }); return key; },
    unschedule: key => timers.delete(key),
  });
  function next() {
    const entry = [...timers].sort((a,b) => a[1].at - b[1].at)[0]; if (!entry) return false;
    timers.delete(entry[0]); now = entry[1].at; entry[1].callback(); return true;
  }
  return { api, calls, timers, next, flush() { let n=0; while(next()) assert.ok(++n < 300, 'Recovery must terminate'); }, setCount(n) { count=n; }, unmount() { mounted=false; } };
}

test('normal reader never supplies estimated heights as exact getItemLayout geometry', () => {
  const source=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8');
  const reader=source.slice(source.indexOf('function ReaderScreen('), source.indexOf('function VerseActionButton('));
  assert.ok(reader.includes('<FlatList')); assert.ok(reader.includes('data={verses}'));
  assert.ok(!reader.includes('getItemLayout={')); assert.ok(!reader.includes('length:rowHeight'));
  assert.ok(reader.includes('windowSize={7}')); assert.ok(reader.includes('initialNumToRender={12}'));
  assert.ok(reader.includes('maxToRenderPerBatch={8}')); assert.ok(!reader.includes('disableVirtualization'));
  assert.ok(reader.includes('onScrollToIndexFailed={onScrollToIndexFailed}'));
});

test('a measured early target scrolls and refines once, without a lingering timer', () => {
  const h=harness(); assert.equal(h.api.start(4),true); h.flush();
  assert.equal(h.calls.length,2); assert.ok(h.calls.every(c=>c.type==='index'&&c.index===4&&c.viewOffset===88&&c.animated===false));
  assert.equal(h.api.isPending(),false); assert.equal(h.timers.size,0);
});

for (const index of [155,254,281,285]) test(`distant ayah index ${index} is reached through measured batches, not a fake fixed row size`, () => {
  const h=harness(); h.api.start(index); h.flush();
  assert.equal(h.calls.at(-1).type,'index'); assert.equal(h.calls.at(-1).index,index);
  assert.ok(h.calls.filter(c=>c.type==='offset').length>0);
  assert.ok(h.calls.filter(c=>c.type==='index').length<READER_SCROLL_MAX_ATTEMPTS);
  assert.equal(h.api.isPending(),false);
});

test('an unreachable target has a strict retry bound and leaves no timer', () => {
  const h=harness({advance:0}); h.api.start(285); h.flush();
  assert.equal(h.calls.filter(c=>c.type==='index').length,READER_SCROLL_MAX_ATTEMPTS);
  assert.equal(h.timers.size,0); assert.equal(h.api.isPending(),false);
});

test('cancel before the first layout prevents every scroll', () => {
  const h=harness(); h.api.start(200); assert.equal(h.api.cancel(),true); assert.equal(h.api.cancel(),false); h.flush(); assert.deepEqual(h.calls,[]);
});

test('user cancellation during recovery prevents a later jump', () => {
  const h=harness(); h.api.start(200); h.next(); const before=h.calls.length;
  h.api.cancel(); h.api.failed({index:200,averageItemLength:300}); h.flush(); assert.equal(h.calls.length,before);
});

test('a new request supersedes the old target', () => {
  const h=harness(); h.api.start(200); h.api.start(7); h.flush(); assert.ok(h.calls.every(c=>c.index===7));
});

test('data shrinking or unmounting cannot issue an out-of-range or stale scroll', () => {
  for (const stop of [h=>h.setCount(7),h=>h.unmount()]) {
    const h=harness(); h.api.start(200); stop(h); h.flush(); assert.deepEqual(h.calls,[]); assert.equal(h.api.isPending(),false);
  }
});

test('invalid targets never start restoration', () => {
  const h=harness(); for(const index of [-1,286,NaN,Infinity,1.5]) assert.equal(h.api.start(index),false); h.flush(); assert.deepEqual(h.calls,[]);
});

test('missing/invalid averages wait safely at offset zero for real layout', () => {
  for (const average of [0,-1,NaN,Infinity,undefined]) {
    const h=harness({average,advance:30}); h.api.start(50); h.flush();
    for(const c of h.calls.filter(c=>c.type==='offset')) assert.ok(Number.isFinite(c.offset)&&c.offset>=0);
  }
});

test('an unrelated failed index cannot hijack the current target', () => {
  const h=harness(); h.api.start(7); h.api.failed({index:200,averageItemLength:999}); h.flush(); assert.ok(h.calls.every(c=>c.type==='index'&&c.index===7));
});

test('screen cleanup and native/web user gestures cancel restoration without changing Quran data or preferences', () => {
  const app=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8');
  const reader=app.slice(app.indexOf('function ReaderScreen('),app.indexOf('function VerseActionButton('));
  for(const text of ['onScrollBeginDrag={()=>{verseScroll.current?.cancel()}}','onTouchStart={()=>{verseScroll.current?.cancel()}}',"onWheel:()=>{verseScroll.current?.cancel()}",'useFocusEffect(useCallback(()=>()=>{verseScroll.current?.cancel()},[]))']) assert.ok(reader.includes(text),text);
  const service=fs.readFileSync(path.join(__dirname,'../src/services/quranReaderScroll.ts'),'utf8');
  for(const forbidden of ['AsyncStorage','fetch(','setVerses(','getItemLayout:']) assert.ok(!service.includes(forbidden),forbidden);
});
