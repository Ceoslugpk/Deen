/* Android RemoteViews material, derived exclusively from the app's shipped
 * palettes. UI gradients, not new artwork and not a wallpaper-blur promise. */
const {createLoader}=require('../tests/helpers/load-typescript.cjs');
const {C_LIGHT,C_DARK,C_PALESTINE,C_PALESTINE_DARK,mix}=createLoader()('src/design/brand.ts');
const alpha=(hex,value)=>`#${Math.round(value*255).toString(16).padStart(2,'0')}${hex.slice(1)}`.toUpperCase();
const glassPalettes=Object.fromEntries([
 ['islamic_light',C_LIGHT,false,false],['islamic_dark',C_DARK,true,false],
 ['palestine_light',C_PALESTINE,false,true],['palestine_dark',C_PALESTINE_DARK,true,true],
].map(([name,p,dark,palestine])=>{
 const primary=p.green;
 return [name,{
  ink:p.ink,muted:mix(p.ink,p.card,0.28),accent:dark?p.green2:p.green,
  secondary:palestine?(dark?mix(p.coral,p.ink,0.16):p.coral):(dark?p.gold:mix(C_LIGHT.successInk,p.ink,0.12)),
  primary,onPrimary:palestine?(dark?'#000000':'#FFFFFF'):p.onAccentInk,
  primaryEnd:mix(primary,p.deep,0.035),
  rule:alpha(p.ink,dark?0.14:0.10),track:mix(p.card,p.ink,dark?0.16:0.12),
  // Dense translucent washes protect text even over black/white wallpaper.
  top:alpha(dark?mix(p.card,p.ink,0.015):p.card,0.97),
  bottom:alpha(mix(p.card,dark?p.green:p.mint,dark?0.025:0.32),0.97),
  rim:alpha('#FFFFFF',dark?0.22:0.90),
  sheen:alpha('#FFFFFF',dark?0.025:0.22),
  insetTop:alpha('#FFFFFF',dark?0.045:0.70),insetBottom:alpha('#FFFFFF',dark?0.015:0.28),
  insetRim:alpha(dark?p.ink:p.green,dark?0.13:0.10),
 }];
}));
module.exports={glassPalettes,alpha};
