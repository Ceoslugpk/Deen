/** Executes the actual TasbihScreen function/handlers with an explicit hook
 * and native-component double. This is UI logic, not a running Android app. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const ts=require('typescript');
const test=require('node:test');
const React=require('react');
const app=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8');
const ast=ts.createSourceFile('App.tsx',app,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const source=ast.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='TasbihScreen').getText(ast);
const compiled=ts.transpileModule(source+'\nmodule.exports=TasbihScreen;',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
function harness(phase='error'){
 const calls={tap:0,read:0,refresh:0,mutate:0,alert:0},env={phase,count:8,rejectTap:false,rejectRead:false},phrase={id:'subhan-allah',arabic:'سُبْحَانَ ٱللَّٰهِ',transliteration:'Subhan Allah',meaning:'Glory be to Allah'};
 const state=()=>({phraseId:phrase.id,count:env.count,goal:33,rounds:0,days:{'2020-01-01':8},sessions:[]});
 const noop=()=>{},native={};for(const name of ['Page','ToolBar','ScrollView','ToolGraphic','Text','View','LinearGradient','ChoicePill','Tactile','TasbihRing','Section','Pressable'])native[name]=name;
 const globals={...native,React,require,module:{exports:{}},useLanguage:()=>({language:'en',rtl:false}),tx:(_,text)=>text,tf:(_,text,values)=>text.replace(/\{(\w+)\}/g,(_,key)=>values[key]),useQuranPreferences:()=>({preferences:{arabicFont:'amiri'}}),useTasbih:state,useTasbihStatus:()=>({phase:env.phase,code:env.phase==='error'?'TW_READ':undefined}),useWindowDimensions:()=>({width:360}),currentPhrase:()=>phrase,todayTotal:()=>8,useRef:value=>({current:value}),useState:value=>[value,noop],useEffect:noop,Animated:{Value:class{},View:'Animated.View',sequence:()=>({start:noop}),timing:noop,spring:noop},Platform:{OS:'android'},haptic:noop,useCardShare:()=>({share:async()=>{},offscreenCard:null}),widgetText:()=>({failure:'Could not confirm this change. Tap Retry to check your saved counter.',loading:'Loading…'}),loadTasbihState:async()=>{calls.read++;if(env.rejectRead)throw Error('unavailable');env.phase='ready';env.count=19;return state();},refreshWidgets:async()=>{calls.refresh++;return true;},tapTasbih:async()=>{calls.tap++;if(env.rejectTap){env.phase='error';throw Error('ack lost');}env.count++;return false;},DHIKR_PHRASES:[phrase],TASBIH_GOALS:[33,99],tasbihLifetime:()=>8,tasbihDays:()=>1,dhikrMeaning:()=>phrase.meaning,arNoun:()=>'',quranFont:()=>'',SCROLL:{},C:{},s:new Proxy({},{get:(_,key)=>key}),ico:()=>null,Alert:{alert(){calls.alert++;throw Error('Counter recovery must not open an alert loop');}}};
 for(const name of ['setTasbihPhrase','setTasbihGoal','resetTasbihCount','saveTasbihSession','removeTasbihSession'])globals[name]=async()=>{calls.mutate++;};
 vm.runInNewContext(compiled,{...globals,exports:globals.module.exports});
 function render(){return globals.module.exports({navigation:{}});}
 function nodes(tree){return tree&&typeof tree==='object'?[tree,...(Array.isArray(tree.props?.children)?tree.props.children:[tree.props?.children]).flatMap(value=>Array.isArray(value)?value.flatMap(nodes):nodes(value))]:[];}
 return{calls,env,render,nodes,find(tree,predicate){return nodes(tree).find(predicate);}};
}
const flush=()=>new Promise(setImmediate);
test('a failed app counter shows an in-place Retry, stable code and no fabricated zero/history',()=>{
 const h=harness(),tree=h.render();assert.ok(h.find(tree,n=>n.type==='Pressable'&&n.props.accessibilityLabel==='Retry'));assert.ok(h.find(tree,n=>n.type==='Text'&&n.props.children==='TW_READ'));assert.equal(h.find(tree,n=>n.type==='Text'&&n.props.style==='counterNo').props.children,'—');assert.equal(h.find(tree,n=>n.type==='TasbihRing').props.disabled,true);assert.ok(!h.find(tree,n=>n.type==='Text'&&n.props.children==='Saved rounds will appear here.'));assert.equal(h.calls.alert,0);
});
test('Retry reconciles in the same screen and refreshes widgets without incrementing/replaying a count',async()=>{
 const h=harness(),tree=h.render();h.find(tree,n=>n.type==='Pressable'&&n.props.accessibilityLabel==='Retry').props.onPress();await flush();assert.equal(h.calls.read,1);assert.equal(h.calls.refresh,1);assert.equal(h.calls.tap,0);assert.equal(h.calls.mutate,0);const next=h.render();assert.equal(h.find(next,n=>n.type==='TasbihRing').props.disabled,false);assert.equal(h.find(next,n=>n.type==='Text'&&n.props.style==='counterNo').props.children,19);assert.equal(h.calls.alert,0);
});
test('a failed Retry remains nonfatal and does not issue counter mutations or repeated dialogs',async()=>{
 const h=harness();h.env.rejectRead=true;h.find(h.render(),n=>n.type==='Pressable'&&n.props.accessibilityLabel==='Retry').props.onPress();await flush();assert.equal(h.env.phase,'error');assert.equal(h.calls.tap,0);assert.equal(h.calls.mutate,0);assert.equal(h.calls.alert,0);
});
test('unready controls cannot start mutations, and a rejected real tap is consumed by its handler',async()=>{
 const h=harness();let tree=h.render();await h.find(tree,n=>n.type==='TasbihRing').props.onPress();h.find(tree,n=>n.type==='ChoicePill').props.onPress();assert.equal(h.calls.tap,0);assert.equal(h.calls.mutate,0);h.env.phase='ready';h.env.rejectTap=true;tree=h.render();await h.find(tree,n=>n.type==='TasbihRing').props.onPress();await flush();assert.equal(h.calls.tap,1);assert.equal(h.env.phase,'error');assert.equal(h.calls.alert,0);
});
