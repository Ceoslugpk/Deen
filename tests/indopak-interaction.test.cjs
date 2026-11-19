const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { isIndopakReaderRoute, captureIndopakSwipe, indopakSwipePage } = createLoader()('src/services/indopakInteraction.ts');
const stack = (...names) => ({ index: names.length - 1, routes: names.map(name => typeof name === 'string' ? { name } : name) });
const quran = stack('QuranHome', '16-line Quran');
const tabs = (index = 2, nested = quran) => ({ index, routes: [
  { name: 'Home' }, { name: 'Prayer' }, { name: 'Quran', state: nested }, { name: 'Library' }, { name: 'Tools' },
] });
const root = (state = tabs()) => stack({ name: 'Main', state });
const pan = (dx, dy = 0, vx = 0, numberActiveTouches = 0) => ({ dx, dy, vx, numberActiveTouches });

test('the immersive menu rule matches only the focused 16-line Quran screen', () => {
  assert.equal(isIndopakReaderRoute(root()), true);
  assert.equal(isIndopakReaderRoute(quran), true);
  assert.equal(isIndopakReaderRoute(stack('16-line Quran')), true);
  assert.equal(isIndopakReaderRoute({ routes: [{ name: '16-line Quran' }] }), true);
  assert.equal(isIndopakReaderRoute(root(tabs(2, stack('QuranHome')))), false);
  assert.equal(isIndopakReaderRoute(root(tabs(2, stack('QuranHome', 'Reader')))), false);
  assert.equal(isIndopakReaderRoute(root(tabs(2, stack('QuranHome', '16-line Quran', 'Audio Player')))), false);
  assert.equal(isIndopakReaderRoute(stack({ name: 'Main', state: tabs() }, { name: 'Settings', state: stack('SettingsHome') })), false);
});

for (const index of [0, 1, 3, 4]) {
  test(`an inactive Quran stack cannot hide the menu on tab ${index}`, () => {
    const state = root(tabs(index)); const before = JSON.stringify(state);
    assert.equal(isIndopakReaderRoute(state), false); assert.equal(JSON.stringify(state), before);
  });
}

test('back/re-entry and malformed states do not leak a saved global hide flag', () => {
  const sequence = [root(), root(tabs(2, stack('QuranHome'))), root(tabs(0)), root(), root(tabs(2, stack('QuranHome','Reader'))), root()];
  assert.deepEqual(sequence.map(isIndopakReaderRoute), [true,false,false,true,false,true]);
  for (const state of [undefined,null,{},[],{routes:[]},{index:2,routes:[{name:'16-line Quran'}]}, {index:NaN,routes:[{}]}, {index:-1,routes:[{}]}, {index:.5,routes:[{}]}, {routes:[null]}, {routes:[{name:'Quran',params:{screen:'16-line Quran'}}]}]) {
    assert.equal(isIndopakReaderRoute(state), false);
  }
  const cycle = {routes:[]}; cycle.routes.push({name:'Main',state:cycle}); assert.equal(isIndopakReaderRoute(cycle),false);
});

test('a single right swipe advances and a single left swipe goes back, in Quran RTL order', () => {
  assert.equal(indopakSwipePage(274,1,390,pan(150)),275);
  assert.equal(indopakSwipePage(274,1,390,pan(-150)),273);
  assert.equal(indopakSwipePage(1,1,240,pan(44)),2);
  assert.equal(indopakSwipePage(547,1,800,pan(120)),548);
  assert.equal(indopakSwipePage(548,1,800,pan(-120)),547);
});

test('page swipes clamp at the authentic first/last page, never wrap or enter the 604-page map', () => {
  assert.equal(indopakSwipePage(1,1,390,pan(-200)),null);
  assert.equal(indopakSwipePage(548,1,390,pan(200)),null);
  for (const page of [0,549,604,1.5,NaN]) assert.equal(indopakSwipePage(page,1,390,pan(200)),null);
});

test('taps, short drags, vertical scrolls and predominantly vertical diagonals do not turn a page', () => {
  for (const gesture of [pan(0),pan(6,2,2),pan(28,0,0),pan(60,0,0),pan(0,180),pan(160,200),pan(-80,90),pan(NaN),pan(Infinity),pan(120,NaN)]) {
    assert.equal(indopakSwipePage(274,1,390,gesture),null,JSON.stringify(gesture));
  }
  assert.equal(captureIndopakSwipe(1,pan(0,180,0,1)),false);
  assert.equal(captureIndopakSwipe(1,pan(13,0,0,1)),false);
  assert.equal(captureIndopakSwipe(1,pan(20,3,0,1)),true);
  assert.equal(captureIndopakSwipe(1,pan(-20,3,0,1)),true);
});

test('a deliberate short quick flick is accepted, but velocity alone cannot turn a page', () => {
  assert.equal(indopakSwipePage(20,1,390,pan(36,2,.7)),21);
  assert.equal(indopakSwipePage(20,1,390,pan(-36,2,-.7)),19);
  assert.equal(indopakSwipePage(20,1,390,pan(18,0,3)),null);
  assert.equal(indopakSwipePage(20,1,390,pan(36,2,0)),null);
  assert.equal(indopakSwipePage(20,1,390,pan(36,2,NaN)),null);
});

test('zoom panning and multi-touch are never claimed for page turns', () => {
  for (const zoom of [1.5,2,0,NaN]) {
    assert.equal(captureIndopakSwipe(zoom,pan(180,0,0,1)),false);
    assert.equal(indopakSwipePage(20,zoom,390,pan(180)),null);
  }
  for (const touches of [2,3,-1,NaN]) {
    assert.equal(captureIndopakSwipe(1,pan(180,0,0,touches)),false);
    assert.equal(indopakSwipePage(20,1,390,pan(180,0,0,touches)),null);
  }
  assert.equal(captureIndopakSwipe(1,pan(180,0,0,0)),false);
  for (const width of [0,-1,NaN,Infinity]) assert.equal(indopakSwipePage(20,1,width,pan(180)),null);
});

test('menu removal, freed reader space and mini-player placement are route-scoped, not global preferences', () => {
  const app = fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8');
  assert.ok(app.includes('onReady={() => setIndopakActive(isIndopakReaderRoute(navigationRef.getRootState()))}'));
  assert.match(app,/liveState.current = state; setIndopakActive\(isIndopakReaderRoute\(state\)\)/);
  assert.match(app,/if \(indopakActive\) return null;/);
  assert.match(app,/const bottom = indopakActive \? 16 \+ \(Platform.OS === 'ios' \? insets.bottom : 0\) : MINI_PLAYER_BOTTOM;/);
  const screen = app.slice(app.indexOf('function IndopakQuranScreen('),app.indexOf('function ReaderScreen('));
  assert.ok(screen.includes('paddingBottom:12')); assert.ok(!screen.includes('paddingBottom:BOTTOM_RESERVE'));
  assert.ok(!screen.includes('setChromeHidden')); assert.ok(!screen.includes('writeJson'));
});

test('the viewport yields to native recognizers and cancels page turns without disabling descendant web scrolling', () => {
  const component = fs.readFileSync(path.join(__dirname,'../src/components/IndopakMushafReader.tsx'),'utf8');
  assert.ok(component.includes('onPanResponderTerminationRequest: () => true'));
  assert.ok(component.includes('onShouldBlockNativeResponder: () => false'));
  assert.ok(component.includes('onPanResponderTerminate: () => { swipeFrom.current = null;'));
  assert.ok(component.includes('from !== latest.current.page'));
  assert.ok(component.includes('swipeBlocked.current ||'));
  assert.ok(component.includes("scrollEnabled={Platform.OS === 'web' || size.height > viewport.height + 1}"));
  assert.ok(component.includes("scrollEnabled={Platform.OS === 'web' || state.zoom > 1}"));
  assert.ok(component.includes("touchAction: state.zoom === 1 ? 'pan-y' : 'auto'"));
  assert.ok(component.includes('Date.now() >= suppressVerseUntil.current'));
});

test('the short source panel retains provider credit while full notices and original font restrictions remain', () => {
  const component = fs.readFileSync(path.join(__dirname,'../src/components/IndopakMushafReader.tsx'),'utf8');
  const notice = fs.readFileSync(path.join(__dirname,'../resources/quran/indopak-taj-16/NOTICE.md'),'utf8');
  const fontNotice = fs.readFileSync(path.join(__dirname,'../resources/quran/indopak-taj-16/FONT-LICENSE.txt'),'utf8');
  assert.ok(component.includes('QUL / Tarteel · QuranWBW'));
  for (const name of ['Ayman Siddiqui','Al Qalam','Ghandhara','KFGQPC','Abdul Majeed Khan','Arif Karim','Shakir-ul-Qadree','Jawad']) assert.ok(fontNotice.includes(name));
  assert.match(fontNotice,/NOT FOR MODIFICATION.*WITHOUT WRITTEN NOTICE/);
  assert.ok(notice.includes('not an independent rights verification'));
  assert.ok(!component.includes('QUL 11 / 59 / 242')); assert.ok(!component.includes('Abdul Majeed Khan'));
});
