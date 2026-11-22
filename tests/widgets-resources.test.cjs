const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const test=require('node:test');
const {createLoader}=require('./helpers/load-typescript.cjs');
const root=path.resolve(__dirname,'..'),native=path.join(root,'modules/deen-widgets/android'),res=path.join(native,'src/main/res');
const families=['prayer','ayah','tasbih','hijri'];
const read=p=>fs.readFileSync(p,'utf8');
function plugin(){const mods={};const module={exports:{}};vm.runInNewContext(read(path.join(root,'plugins/widgets/withWidgets.js')),{module,exports:module.exports,require:name=>name==='expo/config-plugins'?{withDangerousMod(config,[platform,run]){mods[platform]=run;return config;},withAndroidManifest(config,run){mods.manifest=run;return config;},withEntitlementsPlist(config,run){mods.entitlements=run;return config;}}:require(name)});module.exports({});return{mods,api:module.exports};}
test('all four existing receiver identities are owned by the autolinked library, not duplicated in app injection',()=>{
 const manifest=read(path.join(native,'src/main/AndroidManifest.xml'));for(const family of families){const cls=family[0].toUpperCase()+family.slice(1)+'WidgetReceiver';assert.equal(manifest.split(`com.deen.widgets.${cls}`).length-1,1);assert.match(manifest,new RegExp(`@xml/${family}_widget_info`));}
 const config=JSON.parse(read(path.join(root,'modules/deen-widgets/expo-module.config.json')));assert.deepEqual(config.coreFeatures,['compose']);assert.deepEqual(config.android.modules,['expo.modules.deenwidgets.DeenWidgetsModule']);
 const gradle=read(path.join(native,'build.gradle'));assert.ok(gradle.includes("id 'expo-module-gradle-plugin'"));assert.ok(gradle.includes("apply plugin: 'org.jetbrains.kotlin.plugin.compose'"));assert.match(gradle,/buildFeatures\s*\{\s*compose true/);assert.ok(!read(path.join(root,'plugins/widgets/withWidgets.js')).includes('withAppBuildGradle'));
});
test('every provider has visible initial, per-family XML and pre-Android-12 image fallbacks without phantom configuration',()=>{
 for(const family of families){const info=read(path.join(res,`xml/${family}_widget_info.xml`));assert.ok(info.includes('initialLayout="@layout/widget_loading"'));assert.ok(info.includes(`previewLayout="@layout/widget_preview_${family}"`));assert.ok(info.includes(`previewImage="@drawable/widget_${family}_icon"`));assert.ok(info.includes('updatePeriodMillis="1800000"'));assert.ok(!info.includes('reconfigurable'));assert.ok(!info.includes('android:configure='));}
 for(const filename of ['widget_loading','widget_error',...families.map(name=>`widget_preview_${name}`)]){const xml=read(path.join(res,`layout/${filename}.xml`));assert.ok(!xml.includes('@android:color/transparent'));assert.ok(xml.includes('android:background="@drawable/widget_card"'));assert.ok(xml.includes('<TextView'));assert.ok(xml.includes('android:text='));}
 assert.ok(read(path.join(res,'drawable/widget_card.xml')).includes('@drawable/widget_glass_islamic_light'));
 assert.ok(read(path.join(res,'drawable-night/widget_card.xml')).includes('@drawable/widget_glass_islamic_dark'));
});
test('preview assets are exact copies of shipped artwork, never new artwork or screenshots passed off as device evidence',()=>{
 for(const[family,icon]of Object.entries({prayer:'prayer-fajr',ayah:'offline-quran',tasbih:'tasbih',hijri:'hijri'}))assert.ok(fs.readFileSync(path.join(res,`drawable-nodpi/widget_${family}_icon.webp`)).equals(fs.readFileSync(path.join(root,`assets/tool-icons/${icon}.webp`))));
});
test('22 languages include localized empty/error/Now/counter-failure copy and Android Indonesian in alias',async()=>{
 const h=createLoader(),copy=h('src/services/widgetCopy.ts'),{LANGUAGES}=h('src/services/languages.ts');assert.deepEqual([...copy.widgetLanguages].sort(),[...LANGUAGES.filter(l=>l.uiReady||l.uiPartial).map(l=>l.code)].sort());assert.equal(copy.widgetLanguages.length,22);
 for(const language of copy.widgetLanguages){await copy.loadWidgetLanguage(language);const row=copy.widgetText(language),file=path.join(res,language==='en'?'values':`values-${language==='id'?'in':language}`,'widget_strings.xml');const xml=read(file);for(const[key,value]of Object.entries(row)){assert.ok(value?.trim(),`${language}/${key}`);assert.ok(xml.includes(`name="widget_${key}"`));if(language!=='en'&&['open','choose','expired','error','counter','saved','loading','now','failure'].includes(key))assert.notEqual(value,copy.widgetText('en')[key],`${language}/${key}`);}
  if(['uz','kk'].includes(language))for(const key of ['choose','error','now'])assert.match(row[key],/[А-Яа-яҚқЎўҒғҲҳӘәІіҢңҮүҰұӨө]/u);
 }
 assert.notEqual(copy.widgetText('ms').error,copy.widgetText('id').error);for(const invalid of ['constructor','__proto__','unknown'])assert.equal(copy.widgetText(invalid).failure,copy.widgetText('en').failure);
});
test('checked-in resource generation is deterministic',()=>{
 const hashes=()=>{const out={};function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())scan(p);else out[path.relative(res,p)]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}scan(res);return out;};
 const before=hashes();const result=spawnSync(process.execPath,['scripts/generate-widget-resources.cjs'],{cwd:root,encoding:'utf8',timeout:60_000});assert.equal(result.status,0,result.stderr);assert.deepEqual(hashes(),before);
});
test('incremental migration removes only former generated code/resources, never saved files or unrelated code',()=>{
 const{mods}=plugin(),directory=fs.mkdtempSync(path.join(os.tmpdir(),'islamic-widgets-')),main=path.join(directory,'app/src/main');
 try{const owned=['java/com/deen/widgets/PrayerWidget.kt','res/layout/widget_loading.xml','res/xml/prayer_widget_info.xml','res/values/deen_widgets.xml'],retained=['java/com/deen/widgets/OtherUserFile.kt','res/layout/another_layout.xml','files/deen_widgets.xml','files/tasbih-state-v1'];for(const file of [...owned,...retained]){fs.mkdirSync(path.dirname(path.join(main,file)),{recursive:true});fs.writeFileSync(path.join(main,file),'keep data');}const mod={modRequest:{platformProjectRoot:directory}};mods.android(mod);mods.android(mod);for(const file of owned)assert.equal(fs.existsSync(path.join(main,file)),false);for(const file of retained)assert.equal(read(path.join(main,file)),'keep data');}finally{fs.rmSync(directory,{recursive:true,force:true});}
});
test('manifest migration is idempotent, preserves unrelated receivers and both AppGroup entitlements',()=>{
 const{mods,api}=plugin();assert.equal(api.APP_GROUP,'group.com.qashi.islamic');const manifest={modResults:{manifest:{application:[{receiver:[{$:{'android:name':'com.deen.widgets.PrayerWidgetReceiver'}},{$:{'android:name':'kept.receiver'}}]}]}}};mods.manifest(manifest);mods.manifest(manifest);assert.equal(manifest.modResults.manifest.application[0].receiver.length,1);assert.equal(manifest.modResults.manifest.application[0].receiver[0].$['android:name'],'kept.receiver');const entitlement={modResults:{'com.apple.security.application-groups':['group.keep.mine']}};mods.entitlements(entitlement);mods.entitlements(entitlement);assert.deepEqual([...entitlement.modResults['com.apple.security.application-groups']],['group.keep.mine','group.com.qashi.islamic']);
 for(const filename of ['modules/deen-widgets/ios/DeenWidgetBridge.swift','targets/widgets/Sources/DeenWidgetData.swift'])assert.ok(read(path.join(root,filename)).includes('group.com.qashi.islamic'));
});
test('production bridge imports the actual installed Expo Coroutine DSL and uses real intent/event APIs',()=>{
 const code=read(path.join(native,'src/main/java/expo/modules/deenwidgets/DeenWidgetsModule.kt'));assert.ok(code.includes('import expo.modules.kotlin.functions.Coroutine'));assert.ok(code.includes('import expo.modules.kotlin.functions.Queues'));assert.ok(code.includes('Events("onWidgetDestination")'));assert.ok(code.includes('OnNewIntent'));assert.ok(code.includes('.runOnQueue(Queues.MAIN)'));assert.ok(code.includes('tasbihRead'));assert.match(code,/WidgetRepository\.publish\(context\(\), json\)/);
 const core=path.join(root,'node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin');assert.ok(read(path.join(core,'functions/AsyncFunctionBuilder.kt')).includes('AsyncFunctionBuilder.Coroutine'));assert.ok(read(path.join(core,'modules/ModuleDefinitionBuilder.kt')).includes('fun OnNewIntent'));assert.ok(read(path.join(core,'objects/ObjectDefinitionBuilder.kt')).includes('fun Events'));
 // This source-contract check does NOT compile the full Expo bridge/app.
});
test('native redraw/scheduling observes durable state, uses host TextClock and inexact workers rather than JS/minute timers',()=>{
 const code=name=>read(path.join(native,`src/main/java/com/deen/widgets/${name}.kt`));assert.ok(code('WidgetBase').includes('collectAsState(initial)'));assert.ok(code('WidgetBase').includes('SizeMode.Exact'));assert.ok(code('WidgetBase').includes('setLayoutDirection'));assert.ok(code('PrayerWidget').includes('setTimeZone'));assert.ok(code('PrayerWidget').includes('AndroidRemoteViews'));assert.ok(read(path.join(res,'layout/widget_clock.xml')).includes('<TextClock'));const worker=code('WidgetRefreshWorker');assert.ok(worker.includes('(30,TimeUnit.MINUTES)'));assert.ok(worker.includes('setInitialDelay'));assert.ok(!worker.includes('setExact'));assert.ok(!worker.includes('AlarmManager'));
 const repository=code('WidgetRepository');assert.ok(repository.includes('preferencesDataStore'));assert.ok(repository.includes('expectedConfig'));assert.ok(repository.includes('sameJson'));assert.ok(!repository.includes('.clear()'));assert.ok(!repository.includes('deleteFile'));
});
