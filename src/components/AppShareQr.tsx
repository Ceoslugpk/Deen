import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import qr from '../data/app-share-qr.json';

const extent = qr.size + qr.quietZone * 2;
const ink = qr.rows.flatMap((row, y) => Array.from(row).flatMap((cell, x) => cell === '1'
  ? [`M${x + qr.quietZone} ${y + qr.quietZone}h1v1h-1z`] : [])).join('');

/** Always black on opaque white, including dark mode. Four clear modules on
 * every edge; integer rendered modules keep phone-sized QR codes crisp. */
export function AppShareQr({ availableWidth, label }: { availableWidth: number; label: string }) {
  const size = Math.max(extent, Math.floor(Math.min(294, availableWidth) / extent) * extent);
  return <View style={{ width: size, height: size, maxWidth: '100%', aspectRatio: 1, backgroundColor: '#fff' }}>
    <Svg testID="app-share-qr" accessibilityRole="image" accessibilityLabel={label} width="100%" height="100%" viewBox={`0 0 ${extent} ${extent}`}>
      <Rect x={0} y={0} width={extent} height={extent} fill="#fff" />
      <Path d={ink} fill="#000" />
    </Svg>
  </View>;
}
