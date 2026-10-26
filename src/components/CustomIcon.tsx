import React from 'react';
import Svg, { Circle, G, Line, Path, Polyline, Rect } from 'react-native-svg';

// A restrained semantic palette: every icon shares one quiet surface.
// Meaning comes from the line color, not a rainbow of containers.
const SURFACE = { bg: '#F3F0F7', border: '#E3DEE9', accent: '#B49352' };
export const ICON_THEMES = [
  { fg: '#5146A4', ...SURFACE }, // worship / primary
  { fg: '#2F6F73', ...SURFACE }, // direction / place
  { fg: '#785A72', ...SURFACE }, // knowledge / reflection
  { fg: '#8A6A32', ...SURFACE }, // time / calendar
  { fg: '#8B5960', ...SURFACE }, // remembrance
];
export function iconTheme(name: string) {
  const n = name.replace(/-outline$/, '');
  if (['compass','location','navigate','business','server','cloud-offline','open'].includes(n)) return ICON_THEMES[1];
  if (['book','bookmark','layers','chatbubble-ellipses','text','language','search','library','create'].includes(n)) return ICON_THEMES[2];
  if (['calendar','time','sunny','partly-sunny','cloudy-night','moon','speedometer'].includes(n)) return ICON_THEMES[3];
  if (['hand-left','radio','sparkles','refresh','flag','heart'].includes(n)) return ICON_THEMES[4];
  return ICON_THEMES[0];
}

export default function CustomIcon({ name, size = 22, color, accent }: { name: string; size?: number; color?: string; accent?: string }) {
  const theme = iconTheme(name); const stroke = color || theme.fg; const detail = accent || theme.accent; const n = String(name).replace(/-outline$/, '');
  const common:any={stroke,strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round',fill:'none'}; let art:React.ReactNode;
  switch(n){
    case'home':art=<><Path {...common} d="M3 10.8 12 3l9 7.8"/><Path {...common} d="M5.5 9.5V21h13V9.5M9.2 21v-6.8h5.6V21"/></>;break;
    case'time':art=<><Circle {...common} cx="12" cy="12" r="8.5"/><Path {...common} d="M12 7.2v5.1l3.5 2.1"/></>;break;
    case'book':art=<><Path {...common} d="M3.5 5.2c3.4-.8 6-.1 8.5 2.1v12c-2.5-2.1-5.1-2.8-8.5-2.1z"/><Path {...common} d="M20.5 5.2c-3.4-.8-6-.1-8.5 2.1v12c2.5-2.1 5.1-2.8 8.5-2.1z"/></>;break;
    case'grid':art=<><Rect {...common} x="3.5" y="3.5" width="6.5" height="6.5" rx="2"/><Rect {...common} x="14" y="3.5" width="6.5" height="6.5" rx="2"/><Rect {...common} x="3.5" y="14" width="6.5" height="6.5" rx="2"/><Rect {...common} x="14" y="14" width="6.5" height="6.5" rx="2"/></>;break;
    case'settings':art=<><Circle {...common} cx="12" cy="12" r="3"/><Path {...common} d="M19.4 15a1.7 1.7 0 0 0 .34 1.9l.06.06-2.84 2.84-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1H9.6V21a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.34l-.06.06-2.84-2.84.06-.06A1.7 1.7 0 0 0 4.1 15a1.7 1.7 0 0 0-1.6-1H2.4V10h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.34-1.9l-.06-.06L6.54 4.2l.06.06A1.7 1.7 0 0 0 8.5 4a1.7 1.7 0 0 0 1.1-1.6v-.1h4v.1A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.9.26l.06-.06 2.84 2.84-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1z"/></>;break;
    case'moon':art=<Path {...common} d="M19.4 15.1A8 8 0 0 1 8.9 4.6 8.1 8.1 0 1 0 19.4 15.1z"/>;break;
    case'sunny':art=<><Circle {...common} cx="12" cy="12" r="3.7"/><G {...common}>{[[12,2,12,5],[12,19,12,22],[2,12,5,12],[19,12,22,12],[4.9,4.9,7,7],[17,17,19.1,19.1],[19.1,4.9,17,7],[7,17,4.9,19.1]].map((a,i)=><Line key={i} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]}/>)}</G></>;break;
    case'partly-sunny':art=<><Circle {...common} cx="8.5" cy="8.5" r="3"/><Path {...common} d="M8.5 2.5v1.7M3.9 3.9l1.2 1.2M2.5 8.5h1.7M15 8.5h1.7M6.5 18.5h11a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.5 1.3 3 3 0 0 0-1.8 5.7z"/></>;break;
    case'cloudy-night':art=<><Path {...common} d="M15.8 4.2a5.1 5.1 0 0 0 3.9 7.4 6 6 0 1 1-3.9-7.4z"/><Path {...common} d="M5.5 19.5h9a3 3 0 0 0 .2-6 4.2 4.2 0 0 0-8 1.1 2.5 2.5 0 0 0-1.2 4.9z"/></>;break;
    case'location':art=<><Path {...common} d="M20 10c0 5.3-8 11-8 11S4 15.3 4 10a8 8 0 1 1 16 0z"/><Circle {...common} cx="12" cy="10" r="2.5"/></>;break;
    case'arrow-forward':art=<><Line {...common} x1="4" y1="12" x2="20" y2="12"/><Polyline {...common} points="14,6 20,12 14,18"/></>;break;
    case'arrow-back':art=<><Line {...common} x1="20" y1="12" x2="4" y2="12"/><Polyline {...common} points="10,6 4,12 10,18"/></>;break;
    case'chevron-forward':art=<Polyline {...common} points="9,5 16,12 9,19"/>;break;
    case'compass':art=<><Circle {...common} cx="12" cy="12" r="9"/><Path {...common} d="m15.7 8.3-2.1 5.3-5.3 2.1 2.1-5.3z"/><Circle cx="12" cy="12" r="1" fill={detail}/></>;break;
    case'navigate':art=<Path {...common} d="m12 2 7.5 19-7.5-4-7.5 4z"/>;break;
    case'hand-left':art=<Path {...common} d="M8.5 11V5.4a1.6 1.6 0 0 1 3.2 0V10 4.3a1.6 1.6 0 0 1 3.2 0V10 5.6a1.6 1.6 0 0 1 3.2 0v7.2c0 5-2.7 8.2-7.2 8.2-2.9 0-4.6-1.2-6.1-3.6l-2.5-4a1.7 1.7 0 0 1 2.8-1.8l2 2.3V7.2a1.6 1.6 0 0 1 3.2 0"/>;break;
    case'radio':art=<><Circle cx="12" cy="12" r="2.1" fill={stroke}/><Path {...common} d="M8.4 8.4a5 5 0 0 0 0 7.2M15.6 8.4a5 5 0 0 1 0 7.2M5.4 5.4a9.3 9.3 0 0 0 0 13.2M18.6 5.4a9.3 9.3 0 0 1 0 13.2"/></>;break;
    case'calendar':art=<><Rect {...common} x="3.5" y="5" width="17" height="16" rx="3"/><Line {...common} x1="3.5" y1="9" x2="20.5" y2="9"/><Line {...common} x1="8" y1="3" x2="8" y2="7"/><Line {...common} x1="16" y1="3" x2="16" y2="7"/><Circle cx="8" cy="13" r="1" fill={detail}/><Circle cx="12" cy="13" r="1" fill={detail}/><Circle cx="16" cy="13" r="1" fill={detail}/><Circle cx="8" cy="17" r="1" fill={detail}/><Circle cx="12" cy="17" r="1" fill={detail}/></>;break;
    case'business':art=<><Path {...common} d="M4 21V5h10v16M14 9h6v12M8 9h2M8 13h2M8 17h2M17 13h1M17 17h1M2 21h20"/></>;break;
    case'sparkles':art=<><Path {...common} d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2zM18.5 13l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><Path {...common} d="m6 13 .8 2.2L9 16l-2.2.8L6 19l-.8-2.2L3 16l2.2-.8z"/></>;break;
    case'bookmark':art=<Path {...common} d="M6 3.5h12v17l-6-4-6 4z"/>;break;
    case'cloud-offline':art=<><Path {...common} d="m3 3 18 18M7.7 7.7A5.4 5.4 0 0 1 17 11a4 4 0 0 1 2 7.4M6 18.5a3.5 3.5 0 0 1-.2-6.9"/></>;break;
    case'notifications':art=<><Path {...common} d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z"/><Path {...common} d="M10 21h4"/></>;break;
    case'shield-checkmark':art=<><Path {...common} d="M12 2.5 20 6v5.5c0 5-3.1 8.2-8 10-4.9-1.8-8-5-8-10V6z"/><Polyline {...common} points="8.3,12 10.8,14.5 16,9.3"/></>;break;
    case'search':art=<><Circle {...common} cx="10.7" cy="10.7" r="6.7"/><Line {...common} x1="15.5" y1="15.5" x2="21" y2="21"/></>;break;
    case'play':art=<Path d="m8 5 11 7-11 7z" fill={stroke}/>;break;
    case'play-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Path d="m10 8 6 4-6 4z" fill={detail}/></>;break;
    case'headset':art=<><Path {...common} d="M4 14v-2a8 8 0 0 1 16 0v2"/><Rect {...common} x="3" y="13" width="4" height="7" rx="2"/><Rect {...common} x="17" y="13" width="4" height="7" rx="2"/><Path {...common} d="M17 20c0 1-1 2-3 2"/></>;break;
    case'layers':art=<><Path {...common} d="m12 3 9 5-9 5-9-5z"/><Path {...common} d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>;break;
    case'download':art=<><Path {...common} d="M12 3v12M7 10l5 5 5-5M4 20h16"/></>;break;
    case'refresh':art=<><Path {...common} d="M20 7v5h-5M4 17v-5h5"/><Path {...common} d="M18.2 12A6.5 6.5 0 0 0 7 6.2L4 9M5.8 12A6.5 6.5 0 0 0 17 17.8l3-2.8"/></>;break;
    case'flag':art=<><Path {...common} d="M5 22V3"/><Path {...common} d="M5 4h12l-2 4 2 4H5"/></>;break;
    case'calculator':art=<><Rect {...common} x="4" y="2.5" width="16" height="19" rx="3"/><Rect {...common} x="7" y="5.5" width="10" height="4" rx="1"/><Path {...common} d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/></>;break;
    case'chatbubble-ellipses':art=<><Path {...common} d="M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-4-.8L3 21l1.5-4.3A8.7 8.7 0 1 1 21 11.5z"/><Path {...common} d="M8 12h.01M12 12h.01M16 12h.01"/></>;break;
    case'options':art=<><Line {...common} x1="4" y1="6" x2="20" y2="6"/><Circle cx="9" cy="6" r="2" fill={detail}/><Line {...common} x1="4" y1="12" x2="20" y2="12"/><Circle cx="15" cy="12" r="2" fill={detail}/><Line {...common} x1="4" y1="18" x2="20" y2="18"/><Circle cx="7" cy="18" r="2" fill={detail}/></>;break;
    case'person-remove':art=<><Circle {...common} cx="9" cy="7" r="3.5"/><Path {...common} d="M3 21c.5-4.5 2.6-7 6-7s5.5 2.5 6 7M16 10h6"/></>;break;
    case'analytics':art=<><Path {...common} d="M4 20V10M10 20V4M16 20v-7M22 20H2"/><Circle cx="4" cy="8" r="1.6" fill={detail}/><Circle cx="10" cy="2.5" r="1.6" fill={detail}/><Circle cx="16" cy="11" r="1.6" fill={detail}/></>;break;
    case'language':art=<><Circle {...common} cx="12" cy="12" r="9"/><Path {...common} d="M3.5 12h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>;break;
    case'text':art=<><Path {...common} d="M4 5h16M12 5v15M8 20h8"/></>;break;
    case'server':art=<><Rect {...common} x="3" y="4" width="18" height="6" rx="2"/><Rect {...common} x="3" y="14" width="18" height="6" rx="2"/><Circle cx="7" cy="7" r="1" fill={detail}/><Circle cx="7" cy="17" r="1" fill={detail}/></>;break;
      case'pause':art=<><Rect x="7" y="5" width="3.6" height="14" rx="1.4" fill={stroke}/><Rect x="13.4" y="5" width="3.6" height="14" rx="1.4" fill={stroke}/></>;break;
    case'stop':art=<Rect x="6.5" y="6.5" width="11" height="11" rx="2" fill={stroke}/>;break;
    case'stop-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Rect x="8.8" y="8.8" width="6.4" height="6.4" rx="1.4" fill={detail}/></>;break;
    case'add':art=<><Line {...common} x1="12" y1="5" x2="12" y2="19"/><Line {...common} x1="5" y1="12" x2="19" y2="12"/></>;break;
    case'remove':art=<Line {...common} x1="5" y1="12" x2="19" y2="12"/>;break;
    case'close':art=<><Line {...common} x1="5.5" y1="5.5" x2="18.5" y2="18.5"/><Line {...common} x1="18.5" y1="5.5" x2="5.5" y2="18.5"/></>;break;
    case'close-circle':art=<><Circle cx="12" cy="12" r="9" fill={stroke}/><Line {...common} stroke={SURFACE.bg} x1="9" y1="9" x2="15" y2="15"/><Line {...common} stroke={SURFACE.bg} x1="15" y1="9" x2="9" y2="15"/></>;break;
    case'checkmark':art=<Polyline {...common} points="5,12.5 10,17.5 19,7"/>;break;
    case'checkmark-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Polyline {...common} points="8,12.4 11,15.4 16.2,9.4"/></>;break;
    case'add-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Line {...common} x1="12" y1="8.4" x2="12" y2="15.6"/><Line {...common} x1="8.4" y1="12" x2="15.6" y2="12"/></>;break;
    case'arrow-forward-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Polyline {...common} points="10.5,8.5 14,12 10.5,15.5"/></>;break;
    case'chevron-back':art=<Polyline {...common} points="15,5 8,12 15,19"/>;break;
    case'chevron-down':art=<Polyline {...common} points="6,9.5 12,15.5 18,9.5"/>;break;
    case'ellipse':art=<Circle {...common} cx="12" cy="12" r="8"/>;break;
    case'ellipsis-horizontal-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Circle cx="8" cy="12" r="1.2" fill={detail}/><Circle cx="12" cy="12" r="1.2" fill={detail}/><Circle cx="16" cy="12" r="1.2" fill={detail}/></>;break;
    case'copy':art=<><Rect {...common} x="9" y="9" width="11" height="11" rx="2.5"/><Path {...common} d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5"/></>;break;
    case'create':art=<><Path {...common} d="M4 20h4L19 9l-4-4L4 16z"/><Line {...common} x1="13.6" y1="6.4" x2="17.6" y2="10.4"/></>;break;
    case'eye':art=<><Path {...common} d="M2.5 12S6 5.6 12 5.6 21.5 12 21.5 12 18 18.4 12 18.4 2.5 12 2.5 12z"/><Circle {...common} cx="12" cy="12" r="3"/></>;break;
    case'information-circle':art=<><Circle {...common} cx="12" cy="12" r="9"/><Line {...common} x1="12" y1="11" x2="12" y2="16.6"/><Path {...common} d="M12 7.6h.01"/></>;break;
    case'library':art=<><Rect {...common} x="3.5" y="4.5" width="3.4" height="15" rx="1"/><Path {...common} d="M9.4 4.5h3.2v15H9.4z"/><Path {...common} d="M15.2 5.7l4.4-1.1 1.2 14.2-4.4.8z"/></>;break;
    case'open':art=<><Path {...common} d="M14 4h6v6"/><Line {...common} x1="20" y1="4" x2="11" y2="13"/><Path {...common} d="M18 14v4.4A1.6 1.6 0 0 1 16.4 20H5.6A1.6 1.6 0 0 1 4 18.4V7.6A1.6 1.6 0 0 1 5.6 6H10"/></>;break;
    case'share':art=<><Path {...common} d="M12 15.5V3.6"/><Polyline {...common} points="8,7.4 12,3.5 16,7.4"/><Path {...common} d="M5 13.2v5.3A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-5.3"/></>;break;
    case'stats-chart':art=<><Rect {...common} x="5" y="10" width="3.4" height="10" rx="1.2"/><Rect {...common} x="10.3" y="4.6" width="3.4" height="15.4" rx="1.2"/><Rect {...common} x="15.6" y="13" width="3.4" height="7" rx="1.2"/></>;break;
    case'volume-high':art=<><Path {...common} d="M4 9.5h3.4L12 5.6v12.8L7.4 14.5H4z"/><Path {...common} d="M15.6 9.2a4.4 4.4 0 0 1 0 5.6M18.2 6.6a8 8 0 0 1 0 10.8"/></>;break;
    case'list':art=<><Line {...common} x1="9" y1="6" x2="20" y2="6"/><Line {...common} x1="9" y1="12" x2="20" y2="12"/><Line {...common} x1="9" y1="18" x2="20" y2="18"/><Path {...common} d="M4.6 6h.01M4.6 12h.01M4.6 18h.01"/></>;break;
    case'trash':art=<><Path {...common} d="M4 7h16M9.6 7V4.9A1.4 1.4 0 0 1 11 3.5h2a1.4 1.4 0 0 1 1.4 1.4V7"/><Path {...common} d="M6.6 7l1 12.1A1.5 1.5 0 0 0 9.1 20.5h5.8a1.5 1.5 0 0 0 1.5-1.4L17.4 7"/><Line {...common} x1="10.6" y1="11" x2="10.6" y2="17"/><Line {...common} x1="13.4" y1="11" x2="13.4" y2="17"/></>;break;
    case'repeat':art=<><Path {...common} d="M17 3.6 20 6.6l-3 3"/><Path {...common} d="M20 6.6H8a4 4 0 0 0-4 4v1"/><Path {...common} d="M7 20.4 4 17.4l3-3"/><Path {...common} d="M4 17.4h12a4 4 0 0 0 4-4v-1"/></>;break;
    case'save':art=<><Path {...common} d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14"/><Path {...common} d="M12 3.6v10.6"/><Polyline {...common} points="8,10.2 12,14.2 16,10.2"/></>;break;
    case'speedometer':art=<><Path {...common} d="M4.5 18a9 9 0 1 1 15 0"/><Line {...common} x1="12" y1="13.4" x2="16.2" y2="9.2"/><Circle cx="12" cy="15.6" r="1.4" fill={detail}/></>;break;
    case'musical-notes':art=<><Path {...common} d="M9 18.2V6.4l10-2v11"/><Circle {...common} cx="6.4" cy="18.2" r="2.6"/><Circle {...common} cx="16.4" cy="15.4" r="2.6"/></>;break;
    case'heart':art=<Path {...common} d="M12 20s-7.4-4.6-7.4-9.6A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.4 3c0 5-7.4 9.6-7.4 9.6z"/>;break;
    case'person':art=<><Circle {...common} cx="12" cy="8" r="3.6"/><Path {...common} d="M4.6 20.4c.7-4.2 3.4-6.6 7.4-6.6s6.7 2.4 7.4 6.6"/></>;break;
    case'star':art=<Path {...common} d="m12 3.8 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 10l5.9-.8z"/>;break;
    default:art=<><Circle {...common} cx="12" cy="12" r="8.5"/><Path {...common} d="m12 7 1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z"/></>;
  }
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="19" cy="5" r="2" fill={detail} opacity={0.20}/>{art}</Svg>;
}
