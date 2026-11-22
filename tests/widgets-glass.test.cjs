const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const test=require('node:test');
const {glassPalettes}=require('../scripts/widget-glass-tokens.cjs');
const root=path.resolve(__dirname,'..');
const res=path.join(root,'modules/deen-widgets/android/src/main/res');
const rgb=hex=>hex.slice(1).match(/../g).map(value=>parseInt(value,16));
function over(hex,background){const color=rgb(hex),alpha=color.length===4?color.shift()/255:1;return color.map((v,i)=>v*alpha+background[i]*(1-alpha));}
function luminance(color){const [r,g,b]=color.map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});return r*0.2126+g*0.7152+b*0.0722;}
function contrast(a,b){a=luminance(a);b=luminance(b);return(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);}
const read=name=>fs.readFileSync(path.join(res,name),'utf8');

test('all four glass materials use app-family resources, gradients, translucency and fine rims without blur APIs',()=>{
 assert.deepEqual(Object.keys(glassPalettes),['islamic_light','islamic_dark','palestine_light','palestine_dark']);
 for(const[name,p]of Object.entries(glassPalettes)){
  const card=read(`drawable/widget_glass_${name}.xml`),inset=read(`drawable/widget_inset_${name}.xml`),button=read(`drawable/widget_button_${name}.xml`);
  for(const color of [p.top,p.bottom,p.rim,p.sheen])assert.ok(card.includes(color),`${name}/${color}`);
  assert.ok(card.includes('<layer-list'));assert.ok(card.includes('<gradient'));assert.ok(card.includes('android:radius="26dp"'));assert.ok(card.includes('android:width="1dp"'));
  assert.ok(rgb(p.top)[0]<255&&rgb(p.top)[0]>=240);assert.ok(inset.includes(p.insetRim));assert.ok(button.includes(p.primary));
 }
 const theme=fs.readFileSync(path.join(root,'modules/deen-widgets/android/src/main/java/com/deen/widgets/DeenWidgetTheme.kt'),'utf8');
 assert.ok(theme.includes('staticCompositionLocalOf'));assert.ok(theme.includes('ImageProvider(LocalWidgetPalette.current.card)'));assert.doesNotMatch(theme,/RenderEffect|BlurMaskFilter|WallpaperManager|FLAG_BLUR_BEHIND/);
});
test('small text and primary labels retain at least 4.5:1 through all glass layers over black and white wallpaper',()=>{
 for(const[name,p]of Object.entries(glassPalettes)){
  for(const key of ['ink','muted','accent','secondary']){
   let minimum=Infinity;
   for(const wallpaper of [[0,0,0],[255,255,255]])for(let step=0;step<=100;step++){
    const a=over(p.top,wallpaper),b=over(p.bottom,wallpaper),surface=a.map((v,i)=>v+(b[i]-v)*step/100);
    for(const sheen of ['#00FFFFFF',p.sheen])for(const inset of ['#00FFFFFF',p.insetTop,p.insetBottom])minimum=Math.min(minimum,contrast(rgb(p[key]),over(inset,over(sheen,surface))));
   }
   assert.ok(minimum>=4.5,`${name}/${key}: ${minimum.toFixed(3)}:1`);
  }
  for(const fill of [p.primary,p.primaryEnd])assert.ok(contrast(rgb(p.onPrimary),rgb(fill))>=4.5,`${name}/button`);
 }
});
test('host clock colours are assigned from the same explicit app-selected palette, not old purple literals',()=>{
 const clock=read('layout/widget_clock.xml');assert.doesNotMatch(clock,/#B9AEE0|#2D187D/);
 const prayer=fs.readFileSync(path.join(root,'modules/deen-widgets/android/src/main/java/com/deen/widgets/PrayerWidget.kt'),'utf8');
 assert.ok(prayer.includes('context.getColor(LocalWidgetPalette.current.muted)'));assert.ok(prayer.includes('setTextColor(R.id.widget_clock,color)'));assert.ok(prayer.includes('setTextColor(R.id.widget_clock_label,color)'));
});
test('Tasbih progress is a native determinate view and existing tap/reset callbacks remain the only widget commands',()=>{
 const code=fs.readFileSync(path.join(root,'modules/deen-widgets/android/src/main/java/com/deen/widgets/TasbihWidget.kt'),'utf8');
 assert.ok(code.includes('LinearProgressIndicator(progress'));assert.ok(code.includes('counter.count.toString()'));assert.ok(code.includes('counter.target'));assert.ok(code.includes('counter.label'));assert.ok(code.includes('contentDescription = "${counter.count} / ${counter.target}"'));
 assert.match(code,/onAction[\s\S]*mutate\(context,"tap"\)/);assert.match(code,/onAction[\s\S]*mutate\(context,"reset"\)/);assert.doesNotMatch(code,/mutate\(context,"goal"\)|quickGoal|saveSession|removeSession/);
});
