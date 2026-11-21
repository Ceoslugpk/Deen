const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const test=require('node:test');
const ts=require('typescript');
const source=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8');
const ast=ts.createSourceFile('App.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
function calls(root,name){const out=[];function visit(node){if(ts.isCallExpression(node)&&node.expression.getText(ast)===name)out.push(node);ts.forEachChild(node,visit);}visit(root);return out;}
function property(object,name){assert.ok(ts.isObjectLiteralExpression(object));return object.properties.find(p=>p.name?.getText(ast)===name)?.initializer;}
const loops=calls(ast,'Animated.loop');

test('every repeating decorative animation step explicitly avoids an InteractionManager handle',()=>{
 assert.equal(loops.length,3,'Audit every loop, including globally mounted skeleton and hero auras and the player aura');
 for(const loop of loops){
  const steps=[...calls(loop,'Animated.timing'),...calls(loop,'Animated.spring')];assert.ok(steps.length>0);
  for(const step of steps)assert.equal(property(step.arguments[1],'isInteraction')?.kind,ts.SyntaxKind.FalseKeyword,step.getText(ast));
  assert.equal(calls(loop,'Animated.delay').length,0,'Animated.delay defaults to an interaction; a perpetual sequence cannot use that default');
 }
});

test('skeleton sweep keeps its 1150ms sweep, 420ms hold and instant reset without blocking list batches',()=>{
 const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='SkeletonProvider');const steps=calls(fn,'Animated.timing');
 assert.deepEqual(steps.map(s=>Number(property(s.arguments[1],'duration').getText(ast))),[1150,0,0]);
 assert.equal(property(steps[1].arguments[1],'delay').getText(ast),'420');
 assert.deepEqual(steps.map(s=>property(s.arguments[1],'toValue').getText(ast)),['1','1','0']);
 assert.ok(fn.getText(ast).includes('if (still)'));assert.ok(fn.getText(ast).includes('return () => loop.stop()'));
});

test('hero drift and player aura retain their native transforms and cleanup; no animation removal or reader redesign',()=>{
 for(const name of ['useDrift','PlayerAura']){
  const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);assert.ok(fn);
  for(const step of calls(fn,'Animated.timing'))assert.equal(property(step.arguments[1],'useNativeDriver').kind,ts.SyntaxKind.TrueKeyword);
  assert.ok(fn.getText(ast).includes('return () => loop.stop()'));
 }
 const reader=source.slice(source.indexOf('function ReaderScreen('),source.indexOf('function VerseActionButton('));
 for(const fragment of ['windowSize={7}','initialNumToRender={12}','maxToRenderPerBatch={8}','data={verses}'])assert.ok(reader.includes(fragment));
 assert.ok(!reader.includes('disableVirtualization'));assert.ok(!reader.includes('getItemLayout={'));
});

test('browser regression defaults to normal animations, real cold-list wheel input and a separate reduced-motion control',()=>{
 const runner=fs.readFileSync(path.join(__dirname,'verify-quran-reader-web.cjs'),'utf8');
 assert.ok(runner.includes("profile.motion||'no-preference'"));
 assert.ok(runner.includes("name:'phone-reduced-motion'"));assert.ok(runner.includes("motion:'reduce'"));
 const scan=runner.slice(runner.indexOf('async function scan('),runner.indexOf('async function back('));
 assert.ok(scan.includes('mouse.wheel('));assert.ok(!scan.includes('e.scrollTop='));
 assert.ok(scan.includes('Every ayah was actually visible during the scan'));
 assert.ok(scan.includes('row.text.includes(expected)'));
});

test('web deferred rendering uses the public bounded deadline instead of waiting indefinitely for an idle frame',()=>{
 const {createLoader}=require('./helpers/load-typescript.cjs');const calls=[];
 const api=createLoader({'react-native-web':{InteractionManager:{setDeadline:ms=>calls.push(ms)}}})('src/services/uiScheduling.web.ts');
 assert.deepEqual(calls,[]);api.configureUiScheduling();assert.deepEqual(calls,[8]);
 assert.equal(api.WEB_INTERACTION_BUDGET_MS,8);
});

test('native scheduler configuration never accesses React Native Web or the removed native InteractionManager API',()=>{
 const {createLoader}=require('./helpers/load-typescript.cjs');
 const forbidden=new Proxy({},{get(){throw new Error('Native must not import the removed API or web scheduler');}});
 const api=createLoader({'react-native':forbidden,'react-native-web':forbidden})('src/services/uiScheduling.ts');
 assert.doesNotThrow(()=>api.configureUiScheduling());
 const native=fs.readFileSync(path.join(__dirname,'../src/services/uiScheduling.ts'),'utf8');
 assert.ok(!native.includes('require('));assert.ok(!native.includes('from '));
});

test('scheduler setup runs at module startup and does not replace global timers or turn off application motion',()=>{
 assert.ok(source.includes("from './src/services/uiScheduling'"));
 assert.equal(source.split('configureUiScheduling();').length,2);
 const web=fs.readFileSync(path.join(__dirname,'../src/services/uiScheduling.web.ts'),'utf8');
 for(const forbidden of ['globalThis.','window.','requestIdleCallback =','cancelAnimationFrame(','reduceMotion'])assert.ok(!web.includes(forbidden),forbidden);
});
