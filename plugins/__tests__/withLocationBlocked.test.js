const assert=require('node:assert/strict');
const test=require('node:test');
const{AndroidConfig}=require('expo/config-plugins');
const{expo}=require('../../app.json');
const withUnusedPermissions=require('../withUnusedPermissions');
const blocked=['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION','ACCESS_BACKGROUND_LOCATION','FOREGROUND_SERVICE_LOCATION'].map(name=>'android.permission.'+name);

test('the Expo Android config explicitly blocks all four unwanted location permissions without requesting them',()=>{
 assert.deepEqual(expo.android.blockedPermissions,blocked);for(const name of blocked)assert.ok(!(expo.android.permissions||[]).includes(name));assert.ok(expo.plugins.includes('./plugins/withUnusedPermissions.js'));
});
test('Expo removal markers override a synthetic future dependency declaration and are idempotent',()=>{
 const input={manifest:{$:{'xmlns:android':'http://schemas.android.com/apk/res/android'},application:[{}],'uses-permission':[{ $:{'android:name':'android.permission.INTERNET'}},...blocked.map(name=>({$:{'android:name':name}}))]}};
 const first=AndroidConfig.Permissions.addBlockedPermissions(input,blocked);const before=structuredClone(first);const second=AndroidConfig.Permissions.addBlockedPermissions(first,blocked);assert.deepEqual(second,before);
 for(const name of blocked){const entries=second.manifest['uses-permission'].filter(p=>p.$['android:name']===name);assert.equal(entries.length,1);assert.equal(entries[0].$['tools:node'],'remove');}
 assert.ok(second.manifest['uses-permission'].some(p=>p.$['android:name']==='android.permission.INTERNET'&&!p.$['tools:node']));
});
test('existing activity-recognition, overlay and old fingerprint blocks remain unchanged',async()=>{
 const names=['ACTIVITY_RECOGNITION','SYSTEM_ALERT_WINDOW','USE_FINGERPRINT'].map(name=>'android.permission.'+name);assert.deepEqual(withUnusedPermissions.REMOVED.map(x=>x.name),names);
 const config=withUnusedPermissions({name:'Permission regression',slug:'permission-regression'});const result=await config.mods.android.manifest({...config,modRequest:{},modResults:{manifest:{application:[{}]}}});const manifest=result.modResults.manifest;
 assert.equal(manifest.$['xmlns:tools'],'http://schemas.android.com/tools');for(const name of names)assert.ok(manifest['uses-permission'].some(p=>p.$['android:name']===name&&p.$['tools:node']==='remove'));
});
test('selected cities and local coordinates are not permissions or deleted by the safeguard',()=>{
 const fs=require('node:fs'),path=require('node:path');const app=fs.readFileSync(path.join(__dirname,'../../App.tsx'),'utf8');assert.match(app,/loadStoredLocation\(\)\.then\(saved=>\{setLocation\(saved\|\|DEFAULT_LOCATION\);setHydrated\(true\)/);assert.ok(app.includes('setManual:commit'));
 assert.ok(!require('../../package.json').dependencies['expo-location']);
 // Widgets now own their receivers/resources in the local library. Pin the
 // permission boundary, not the obsolete empty-manifest implementation.
 const widgetManifest=fs.readFileSync(path.join(__dirname,'../../modules/deen-widgets/android/src/main/AndroidManifest.xml'),'utf8');
 const requested=[...widgetManifest.matchAll(/<uses-permission\s+android:name="([^"]+)"/g)].map(match=>match[1]);
 assert.deepEqual(requested,['android.permission.RECEIVE_BOOT_COMPLETED']);
 for(const permission of blocked)assert.ok(!requested.includes(permission));
});
