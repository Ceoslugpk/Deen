const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const test=require('node:test');
const ts=require('typescript');
const {createLoader}=require('./helpers/load-typescript.cjs');
const target='https://forms.gle/9jbqgcvUTBDV4g9Z6';
const app=fs.readFileSync(path.join(__dirname,'../App.tsx'),'utf8');
const source=ts.createSourceFile('App.tsx',app,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const settings=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='SettingsScreen');
function harness(open=async()=>{}){const calls=[];const api=createLoader({'react-native':{Linking:{openURL:url=>{calls.push(url);return open(url);},canOpenURL(){throw Error('No preflight or browser chooser needed');}}}})('src/services/appFeedback.ts');return{api,calls};}
function nativeHandler(open){
 let arrow;function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(source)==='openFeedback')arrow=n.initializer;ts.forEachChild(n,visit);}visit(settings);assert.ok(arrow);
 const state={busy:false,error:true},openingFeedback={current:false};
 const run=vm.runInNewContext(`(${arrow.getText(source)})`,{openingFeedback,setFeedbackBusy:value=>{state.busy=value},setFeedbackError:value=>{state.error=value},openAppFeedbackForm:open});
 return{run,state,openingFeedback};
}

test('publisher form destination is exact HTTPS with no state, tracking or prefilled answer query',()=>{
 const{api,calls}=harness();assert.equal(api.APP_FEEDBACK_URL,target);assert.deepEqual(calls,[]);
 const url=new URL(api.APP_FEEDBACK_URL);assert.equal(url.protocol,'https:');assert.equal(url.search,'');assert.equal(url.hash,'');
});

test('native press hands the exact supplied link to the external system URL handler',async()=>{
 const{api,calls}=harness();await api.openAppFeedbackForm();assert.deepEqual(calls,[target]);
});

test('native browser errors reject honestly and can be retried',async()=>{
 const error=new Error('No external browser');let attempts=0;const h=harness(async()=>{if(attempts++===0)throw error;});
 await assert.rejects(h.api.openAppFeedbackForm(),e=>e===error);await h.api.openAppFeedbackForm();assert.deepEqual(h.calls,[target,target]);
});

test('native Settings handler guards duplicate presses until the browser handoff completes',async()=>{
 let resolve,calls=0;const pending=new Promise(r=>resolve=r);const h=nativeHandler(()=>{calls++;return pending});
 const first=h.run();assert.equal(h.state.busy,true);assert.equal(h.state.error,false);assert.equal(h.openingFeedback.current,true);
 await h.run();assert.equal(calls,1);resolve();await first;assert.equal(h.state.busy,false);assert.equal(h.openingFeedback.current,false);assert.equal(h.state.error,false);
});

test('native Settings error is visible and clears when the user retries successfully',async()=>{
 let calls=0;const h=nativeHandler(async()=>{if(calls++===0)throw new Error('Browser unavailable');});
 await h.run();assert.equal(h.state.error,true);assert.equal(h.state.busy,false);assert.equal(h.openingFeedback.current,false);
 await h.run();assert.equal(h.state.error,false);assert.equal(calls,2);
});

test('label and browser failure copy are translated in every actual interface language',()=>{
 const{api}=harness();const{LANGUAGES}=createLoader()('src/services/languages.ts');const languages=LANGUAGES.filter(x=>x.uiReady||x.uiPartial);assert.equal(languages.length,22);
 assert.equal(api.appFeedbackText('en','label'),'Report or request a feature');
 for(const{code}of languages)for(const key of ['label','error']){
  const value=api.appFeedbackText(code,key);assert.ok(value?.trim(),`${code}/${key}`);if(code!=='en')assert.notEqual(value,api.appFeedbackText('en',key),`${code}/${key}`);
  if(['uz','kk'].includes(code)){assert.match(value,/[А-Яа-яҚқЎўҒғҲҳӘәІіҢңҮүҰұӨө]/u);assert.doesNotMatch(value,/[A-Za-z]/u);}
  if(['ar','ur','fa','ps'].includes(code))assert.match(value,/[\u0600-\u06ff]/u);
 }
 assert.notEqual(api.appFeedbackText('id','label'),api.appFeedbackText('ms','label'));
});

test('unknown and prototype-like languages safely fall back to exact English',()=>{
 const{api}=harness();for(const code of ['','unknown','my','constructor','toString','__proto__'])for(const key of ['label','error'])assert.equal(api.appFeedbackText(code,key),api.appFeedbackText('en',key));
});

test('feedback action is immediately below Share app, above Made with, with a wrapping label and external icon',()=>{
 const jsx=[];function visit(n){if(ts.isJsxElement(n)){const attr=n.openingElement.attributes.properties.find(p=>p.name?.getText(source)==='testID');if(attr?.initializer?.text==='settings-report-feature')jsx.push(n);}ts.forEachChild(n,visit);}visit(settings);assert.equal(jsx.length,1);
 const node=jsx[0],siblings=node.parent.children.filter(n=>ts.isJsxElement(n));const index=siblings.indexOf(node);assert.ok(index>0);assert.match(siblings[index-1].getText(source),/testID="settings-share-app"/);
 const code=node.getText(source);assert.ok(code.includes('accessibilityRole="link"'));assert.ok(code.includes("appFeedbackText(language, 'label')"));assert.ok(code.includes("ico('open-outline'"));assert.ok(!code.includes('numberOfLines='));assert.ok(code.includes('minWidth: 0'));
 assert.ok(settings.getText(source).indexOf('settings-report-feature')<settings.getText(source).indexOf('style={s.madeWith}'));
});

test('web uses a real secure new-tab anchor without also running a JavaScript browser opener',()=>{
 const code=settings.getText(source);assert.ok(code.includes("href: APP_FEEDBACK_URL, hrefAttrs: { target: '_blank', rel: 'noopener noreferrer' }"));
 assert.ok(code.includes("onPress={Platform.OS === 'web' ? undefined : () => { void openFeedback(); }}"));
 assert.ok(code.includes('testID="settings-report-feature-error" accessibilityLiveRegion="polite"'));
});

test('the feedback helper never embeds the form, loads it in advance, submits it, shares it or reads/writes user data',()=>{
 const raw=fs.readFileSync(path.join(__dirname,'../src/services/appFeedback.ts'),'utf8');
 const helper=ts.transpileModule(raw,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,removeComments:true}}).outputText;
 for(const forbidden of ['WebView','openBrowserAsync','fetch(','axios','AsyncStorage','localStorage','clipboard','Share.share','entry.'])assert.ok(!helper.includes(forbidden),forbidden);
});
