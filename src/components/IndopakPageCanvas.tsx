import React, { useMemo, useRef } from 'react';
import { Platform, type GestureResponderEvent } from 'react-native';
import { alpha } from '../design/brand';
import { INDOPAK_HOLD_MS, indopakAyahSegments } from '../services/indopakSelection';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { tx } from '../services/arabicCopy';
import { indopakText } from '../services/indopakCopy';
import {
  centeredIndopakWord, indopakMeta, indopakPage, indopakShapePath, INDOPAK_VIEWBOX, placeIndopakPage, type IndopakWord,
} from '../services/indopakMushaf';

type Props = {
  number: number; width: number; height: number; colors: Record<string, string>; dark: boolean; language: string;
  verse?: string | null; recitingVerse?: string | null; readingPoint?: string | null; interactive?: boolean;
  onWordPress?: (key: string, wordId: number) => void; onWordLongPress?: (key: string, wordId: number) => void;
  onWordPressIn?: (key: string, wordId: number, event: GestureResponderEvent) => void; onWordPressOut?: () => void;
};

/** Same original-font outlines for the live page and its short-lived, non-interactive outgoing snapshot. */
export function IndopakPageCanvas({ number, width, height, colors: C, dark, language, verse, recitingVerse, readingPoint, onWordPress, onWordLongPress, onWordPressIn, onWordPressOut, interactive = true }: Props) {
  const lastTouch = useRef(0);
  const page = useMemo(() => indopakPage(number), [number]);
  const placed = useMemo(() => placeIndopakPage(page), [page]);
  const segments = useMemo(() => indopakAyahSegments(placed), [placed]);
  const meta = indopakMeta();
  const T = (value: string) => tx(language, value);
  return <Svg testID={interactive ? 'indopak-page-svg' : undefined} width={width} height={height}
    viewBox={`0 0 ${INDOPAK_VIEWBOX.width} ${INDOPAK_VIEWBOX.height}`} style={{ direction: 'ltr' }}
    accessibilityLabel={interactive ? `${T('Page')} ${number}` : undefined}
    accessibilityHint={interactive ? indopakText(language, 'hint') : undefined}>
    <Rect x={8} y={8} width={984} height={1624} rx={12} fill={dark ? C.card : '#fffdf5'} stroke={C.gold} strokeWidth={3}/>
    <Rect x={25} y={25} width={950} height={1590} rx={5} fill="none" stroke={C.gold} strokeWidth={1}/>
    <IndopakHeading word={meta.chapters[(page.words[0]?.[0] || 1) - 1].heading} cx={500} cy={54} fontSize={27} fill={C.muted}/>
    {placed.map(line => line.source.t === 'surah_name' ? <G key={line.source.n} testID={interactive ? `indopak-line-${line.source.n}` : undefined}>
      <Rect x={80} y={line.top + line.height * .22} width={840} height={line.height * .56} rx={14} fill={C.mint} stroke={C.gold} strokeWidth={1}/>
      <IndopakHeading word={meta.chapters[line.source.s! - 1].heading} cx={500} cy={line.top + line.height / 2} fontSize={44} fill={C.ink}/>
    </G> : <G key={line.source.n} testID={interactive ? `indopak-line-${line.source.n}` : undefined}>
      {segments.filter(s => s.line === line.source.n && (s.verse === verse || s.verse === recitingVerse || s.verse === readingPoint)).map(s =>
        <G key={s.verse} pointerEvents="none" testID={interactive && s.verse === recitingVerse ? `indopak-reciting-${s.verse}-${s.line}` : undefined}>
          <Rect testID={interactive ? `indopak-highlight-${s.verse}-${s.line}` : undefined} pointerEvents="none"
            x={s.x} y={s.y} width={s.width} height={s.height} rx={7}
            fill={s.verse === verse || s.verse === recitingVerse ? C.mint : alpha(C.gold, .14)} stroke={s.verse === readingPoint ? C.gold : C.green}
            strokeWidth={s.verse === readingPoint ? 2.4 : s.verse === recitingVerse ? 2 : 1}/>
        </G>) }
      {line.words.map(word => <G key={word.id}>
        {interactive && line.source.t === 'ayah' && <Rect x={word.boxX - 2} y={line.top + 2} width={word.width + 4} height={line.height - 4}
          fill="transparent" rx={7}
          testID={`indopak-word-${word.id}`} accessibilityLabel={`${T('Verse')} ${word.key}`}
          delayLongPress={INDOPAK_HOLD_MS} delayPressIn={0}
          onPressIn={event => onWordPressIn?.(word.key, word.id, event)} onPressOut={onWordPressOut}
          {...(Platform.OS === 'web' ? {
            onTouchStart: (event: GestureResponderEvent) => { lastTouch.current = Date.now(); onWordPressIn?.(word.key, word.id, event); },
            onTouchEnd: onWordPressOut, onTouchCancel: onWordPressOut,
            onMouseDown: (event: GestureResponderEvent) => { if (Date.now() - lastTouch.current > 800) onWordPressIn?.(word.key, word.id, event); },
            onMouseUp: onWordPressOut, onMouseLeave: onWordPressOut,
          } : {})}
          onLongPress={() => onWordLongPress?.(word.key, word.id)} onPress={() => onWordPress?.(word.key, word.id)}/>}
        <Path pointerEvents="none" d={indopakShapePath(word.shape)} fill={C.ink} testID={interactive ? `indopak-ink-${word.id}` : undefined}
          transform={`translate(${word.x} ${line.baseline}) scale(${line.fontSize / meta.unitsPerEm} ${-line.fontSize / meta.unitsPerEm})`}/>
      </G>)}
    </G>)}
  </Svg>;
}

/** Word paths are a rendering of the unchanged supplied font, not replacement Quran text. */
function IndopakHeading({ word, cx, cy, fontSize, fill }: { word: IndopakWord; cx: number; cy: number; fontSize: number; fill: string }) {
  const { x, baseline, scale } = centeredIndopakWord(word, cx, cy, fontSize);
  return <Path d={indopakShapePath(word[9])} fill={fill} pointerEvents="none" transform={`translate(${x} ${baseline}) scale(${scale} ${-scale})`}/>;
}
