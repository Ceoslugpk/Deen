import React, { useId, useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { alpha, BRAND, mix } from '../design/brand';
import { indopakFoldGeometry, indopakFoldRange } from '../services/indopakFold';

type Props = {
  progress: Animated.Value; direction: 1 | -1;
  viewport: { width: number; height: number }; size: { width: number; height: number }; scroll: { x: number; y: number };
  colors: Record<string, string>; dark: boolean; children: React.ReactNode;
};

/** Lightweight 2D paper fold, not a 3D mesh curl. Only transforms/opacity animate on the native driver. */
export function IndopakPageFold({ progress, direction, viewport, size, scroll, colors: C, dark, children }: Props) {
  const id = `indopak-fold-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const geometry = useMemo(() => indopakFoldGeometry(viewport, size, scroll), [viewport, size, scroll]);
  if (!geometry) return null;
  const range = indopakFoldRange(geometry, viewport.width, direction);
  const { bandWidth: b, foldWidth: f, paperHeight: h, paperTop } = geometry;
  const phases = [0, .16, .68, 1], scales = [.04, 1, .82, .04];
  const bandScale = progress.interpolate({ inputRange: phases, outputRange: scales, extrapolate: 'clamp' });
  // Compensate for the default centre transform origin: the crease stays pinned to the mask edge.
  const bandAnchor = progress.interpolate({ inputRange: phases, outputRange: scales.map(n => direction * b * (1 - n) / 2), extrapolate: 'clamp' });
  const paper = dark ? C.card : '#fffdf5';
  const shade = mix(paper, BRAND.midnightInk, dark ? .42 : .18);
  const highlight = dark ? mix(paper, BRAND.mist, .14) : paper;
  // This non-interactive overlay uses physical Quran-page coordinates in every UI language.
  return <View testID="indopak-page-outgoing" style={[StyleSheet.absoluteFill, styles.coordinates]} pointerEvents="none" accessible={false}
    accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden={true}>
    <Animated.View testID="indopak-fold-mask" style={[StyleSheet.absoluteFill, styles.clip,
      { transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: range.mask }) }] }]}>
      <Animated.View testID="indopak-fold-face" style={[StyleSheet.absoluteFill, { backgroundColor: C.bg,
        transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: range.face }) }] }]}>
        {children}
      </Animated.View>
    </Animated.View>
    <Animated.View testID="indopak-fold-edge" style={[styles.edge, { left: direction === 1 ? -b : 0, top: paperTop, width: b, height: h,
      transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: range.edge }) }] }]}>
      <Animated.View testID="indopak-fold-paper" style={{ width: b, height: h,
        opacity: progress.interpolate({ inputRange: [0, .10, .86, 1], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' }),
        transform: [{ translateX: bandAnchor }, { scaleX: bandScale }] }}>
        {/* Mirror the blank back and its shadow only, never the Quran canvas. */}
        <View style={{ width: b, height: h, transform: [{ scaleX: direction }] }}>
          <Svg width={b} height={h} viewBox={`0 0 ${b} ${h}`} pointerEvents="none">
            <Defs>
              <LinearGradient id={`${id}-shadow`} x1={0} y1={0} x2={b} y2={0} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={BRAND.midnightInk} stopOpacity={0}/><Stop offset=".45" stopColor={BRAND.midnightInk} stopOpacity={dark ? .08 : .03}/>
                <Stop offset="1" stopColor={BRAND.midnightInk} stopOpacity={dark ? .48 : .24}/>
              </LinearGradient>
              <LinearGradient id={`${id}-paper`} x1={b - f} y1={0} x2={b} y2={0} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={shade}/><Stop offset=".24" stopColor={mix(paper, BRAND.midnightInk, .04)}/>
                <Stop offset=".58" stopColor={highlight}/><Stop offset=".85" stopColor={paper}/><Stop offset="1" stopColor={shade}/>
              </LinearGradient>
            </Defs>
            <Path testID="indopak-fold-shadow" d={geometry.shadowPath} fill={`url(#${id}-shadow)`}/>
            <Path testID="indopak-fold-back" d={geometry.backPath} fill={`url(#${id}-paper)`} stroke={alpha(C.ink, .10)} strokeWidth={.7}/>
            <Path testID="indopak-fold-crease" d={`M ${b - .5} 0 V ${h}`} stroke={alpha(C.ink, dark ? .30 : .14)} strokeWidth={.8}/>
          </Svg>
        </View>
      </Animated.View>
    </Animated.View>
  </View>;
}

const styles = StyleSheet.create({ coordinates: { direction: 'ltr' }, clip: { overflow: 'hidden' }, edge: { position: 'absolute' } });
