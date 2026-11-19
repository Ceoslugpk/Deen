import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Platform, type GestureResponderEvent } from 'react-native';
import { alpha } from '../design/brand';
import { INDOPAK_HOLD_MS, indopakAyahSegments, type IndopakSegment } from '../services/indopakSelection';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { tx } from '../services/arabicCopy';
import { indopakText } from '../services/indopakCopy';
import {
  centeredIndopakWord, indopakMeta, indopakPage, indopakShapePath, INDOPAK_VIEWBOX, placeIndopakPage, type IndopakWord, type PlacedIndopakLine,
} from '../services/indopakMushaf';

type Props = {
  number: number; width: number; height: number; colors: Record<string, string>; dark: boolean; language: string;
  verse?: string | null; recitingVerse?: string | null; readingPoint?: string | null; interactive?: boolean;
  onWordPress?: (key: string, wordId: number) => void; onWordLongPress?: (key: string, wordId: number) => void;
  onWordPressIn?: (key: string, wordId: number, event: GestureResponderEvent) => void; onWordPressOut?: () => void;
};
type WordActions = {
  press: (key: string, id: number) => void; hold: (key: string, id: number) => void; end: () => void;
  start: (key: string, id: number, event: GestureResponderEvent) => void;
  touch: (key: string, id: number, event: GestureResponderEvent) => void;
  mouse: (key: string, id: number, event: GestureResponderEvent) => void;
};

/** Resize only the SVG viewport: the unchanged original-font paths and hit targets are memoized per line. */
export function IndopakPageCanvas({ number, width, height, colors: C, dark, language, verse, recitingVerse, readingPoint,
  onWordPress, onWordLongPress, onWordPressIn, onWordPressOut, interactive = true }: Props) {
  const lastTouch = useRef(0);
  const callbacks = useRef({ onWordPress, onWordLongPress, onWordPressIn, onWordPressOut });
  useLayoutEffect(() => { callbacks.current = { onWordPress, onWordLongPress, onWordPressIn, onWordPressOut }; });
  // Event identity stays stable while the ref always dispatches to the latest committed reader state.
  const actions = useMemo<WordActions>(() => ({
    press: (key, id) => callbacks.current.onWordPress?.(key, id),
    hold: (key, id) => callbacks.current.onWordLongPress?.(key, id),
    end: () => callbacks.current.onWordPressOut?.(),
    start: (key, id, event) => callbacks.current.onWordPressIn?.(key, id, event),
    touch: (key, id, event) => { lastTouch.current = Date.now(); callbacks.current.onWordPressIn?.(key, id, event); },
    mouse: (key, id, event) => { if (Date.now() - lastTouch.current > 800) callbacks.current.onWordPressIn?.(key, id, event); },
  }), []);
  const page = useMemo(() => indopakPage(number), [number]);
  const placed = useMemo(() => placeIndopakPage(page), [page]);
  const rows = useMemo(() => {
    const segments = indopakAyahSegments(placed);
    return placed.map(line => ({ line, segments: segments.filter(s => s.line === line.source.n) }));
  }, [placed]);
  const meta = indopakMeta();
  const T = (value: string) => tx(language, value);
  return <Svg testID={interactive ? 'indopak-page-svg' : undefined} width={width} height={height}
    viewBox={`0 0 ${INDOPAK_VIEWBOX.width} ${INDOPAK_VIEWBOX.height}`} style={{ direction: 'ltr' }}
    accessibilityLabel={interactive ? `${T('Page')} ${number}` : undefined}
    accessibilityHint={interactive ? indopakText(language, 'hint') : undefined}>
    <IndopakPaper fill={dark ? C.card : '#fffdf5'} border={C.gold}/>
    <IndopakHeading word={meta.chapters[(page.words[0]?.[0] || 1) - 1].heading} cx={500} cy={54} fontSize={27} fill={C.muted}/>
    {rows.map(({ line, segments }) => <G key={line.source.n} testID={interactive ? `indopak-line-${line.source.n}` : undefined}>
      {line.source.t === 'surah_name' ? <>
        <Rect x={80} y={line.top + line.height * .22} width={840} height={line.height * .56} rx={14} fill={C.mint} stroke={C.gold} strokeWidth={1}/>
        <IndopakHeading word={meta.chapters[line.source.s! - 1].heading} cx={500} cy={line.top + line.height / 2} fontSize={44} fill={C.ink}/>
      </> : <>
        <IndopakHighlights segments={segments} verse={verse} recitingVerse={recitingVerse} readingPoint={readingPoint} interactive={interactive}
          mint={C.mint} gold={C.gold} green={C.green}/>
        <IndopakInkWords line={line} ink={C.ink} language={language} interactive={interactive} actions={actions}/>
      </>}
    </G>)}
  </Svg>;
}

const IndopakPaper = memo(function IndopakPaper({ fill, border }: { fill: string; border: string }) {
  return <>
    <Rect x={8} y={8} width={984} height={1624} rx={12} fill={fill} stroke={border} strokeWidth={3}/>
    <Rect x={25} y={25} width={950} height={1590} rx={5} fill="none" stroke={border} strokeWidth={1}/>
  </>;
});

/** Highlights can change without rebuilding, retransmitting or reparsing scripture outline props. */
const IndopakHighlights = memo(function IndopakHighlights({ segments, verse, recitingVerse, readingPoint, interactive, mint, gold, green }: {
  segments: IndopakSegment[]; verse?: string | null; recitingVerse?: string | null; readingPoint?: string | null;
  interactive: boolean; mint: string; gold: string; green: string;
}) {
  return <>{segments.filter(s => s.verse === verse || s.verse === recitingVerse || s.verse === readingPoint).map(s =>
    <G key={s.verse} pointerEvents="none" testID={interactive && s.verse === recitingVerse ? `indopak-reciting-${s.verse}-${s.line}` : undefined}>
      <Rect testID={interactive ? `indopak-highlight-${s.verse}-${s.line}` : undefined} pointerEvents="none"
        x={s.x} y={s.y} width={s.width} height={s.height} rx={7}
        fill={s.verse === verse || s.verse === recitingVerse ? mint : alpha(gold, .14)} stroke={s.verse === readingPoint ? gold : green}
        strokeWidth={s.verse === readingPoint ? 2.4 : s.verse === recitingVerse ? 2 : 1}/>
    </G>)}</>;
});

/** No zoom/selection/playback props: hundreds of fixed glyph paths and handlers survive those updates untouched. */
const IndopakInkWords = memo(function IndopakInkWords({ line, ink, language, interactive, actions }: {
  line: PlacedIndopakLine; ink: string; language: string; interactive: boolean; actions: WordActions;
}) {
  const upm = indopakMeta().unitsPerEm, label = tx(language, 'Verse');
  return <>{line.words.map(word => <G key={word.id}>
    {interactive && line.source.t === 'ayah' && <Rect x={word.boxX - 2} y={line.top + 2} width={word.width + 4} height={line.height - 4}
      fill="transparent" rx={7} testID={`indopak-word-${word.id}`} accessibilityLabel={`${label} ${word.key}`}
      delayLongPress={INDOPAK_HOLD_MS} delayPressIn={0}
      onPressIn={event => actions.start(word.key, word.id, event)} onPressOut={actions.end}
      {...(Platform.OS === 'web' ? {
        onTouchStart: (event: GestureResponderEvent) => actions.touch(word.key, word.id, event),
        onTouchEnd: actions.end, onTouchCancel: actions.end,
        onMouseDown: (event: GestureResponderEvent) => actions.mouse(word.key, word.id, event),
        onMouseUp: actions.end, onMouseLeave: actions.end,
      } : {})}
      onLongPress={() => actions.hold(word.key, word.id)} onPress={() => actions.press(word.key, word.id)}/>}
    <Path pointerEvents="none" d={indopakShapePath(word.shape)} fill={ink} testID={interactive ? `indopak-ink-${word.id}` : undefined}
      transform={`translate(${word.x} ${line.baseline}) scale(${line.fontSize / upm} ${-line.fontSize / upm})`}/>
  </G>)}</>;
});

/** Word paths are a rendering of the unchanged supplied font, not replacement Quran text. */
const IndopakHeading = memo(function IndopakHeading({ word, cx, cy, fontSize, fill }: { word: IndopakWord; cx: number; cy: number; fontSize: number; fill: string }) {
  const { x, baseline, scale } = centeredIndopakWord(word, cx, cy, fontSize);
  return <Path d={indopakShapePath(word[9])} fill={fill} pointerEvents="none" transform={`translate(${x} ${baseline}) scale(${scale} ${-scale})`}/>;
});
