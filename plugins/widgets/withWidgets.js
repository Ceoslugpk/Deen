/** Widgets now compile in the autolinked local Expo library, including its
 * Compose config, resources and manifest. No edits to app Gradle/MainActivity
 * or generated iOS projects are required. Receiver FQCNs remain unchanged. */
const { withDangerousMod, withAndroidManifest, withEntitlementsPlist } = require('expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');
const APP_GROUP = 'group.com.qashi.islamic';
const OLD_SOURCES = ['DeenWidgetData.kt','DeenWidgetTheme.kt','PrayerWidget.kt','AyahWidget.kt','TasbihWidget.kt','HijriWidget.kt','DeenWidgetReceivers.kt'];
const OLD_RECEIVERS = ['Prayer','Ayah','Tasbih','Hijri'].map(name=>`com.deen.widgets.${name}WidgetReceiver`);
module.exports = function withWidgets(config) {
  // Migration of ONLY files emitted by the former generator. Without this,
  // incremental native generation would contain duplicate classes and the
  // app's old transparent layout would override the repaired library layout.
  config=withDangerousMod(config,['android',mod=>{
    const main=path.join(mod.modRequest.platformProjectRoot,'app/src/main');
    const owned=[...OLD_SOURCES.map(name=>path.join('java/com/deen/widgets',name)),
      ...['prayer','ayah','tasbih','hijri'].map(name=>`res/xml/${name}_widget_info.xml`),
      'res/layout/widget_loading.xml','res/values/deen_widgets.xml'];
    for(const file of owned) fs.rmSync(path.join(main,file),{force:true});
    return mod;
  }]);
  config=withAndroidManifest(config,mod=>{
    const app=mod.modResults.manifest.application?.[0];
    if(app?.receiver) app.receiver=app.receiver.filter(item=>!OLD_RECEIVERS.includes(item?.$?.['android:name']));
    return mod;
  });
  return withEntitlementsPlist(config,mod=>{
    const groups=mod.modResults['com.apple.security.application-groups'] || [];
    if(!groups.includes(APP_GROUP)) mod.modResults['com.apple.security.application-groups']=[...groups,APP_GROUP];
    return mod;
  });
};
module.exports.APP_GROUP=APP_GROUP;
