import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';
import { tx } from '../services/arabicCopy';
import type { indopakPopoverLayout } from '../services/indopakSelection';

type Props = {
  layout: NonNullable<ReturnType<typeof indopakPopoverLayout>>; verse: string; marked: boolean;
  colors: Record<string, string>; language: string; rtl: boolean;
  icon: (name: string, size: number, color: string) => React.ReactNode;
  play: () => void; translate: () => void; mark: () => void; close: () => void; touching: (active: boolean) => void;
};

/** Non-modal: only three labelled, 44px icon actions above the actual selected ayah. */
export function IndopakAyahPopover({ layout, verse, marked, colors: C, language, rtl, icon, play, translate, mark, close, touching }: Props) {
  const first = useRef<React.ElementRef<typeof View>>(null);
  const T = (s: string) => tx(language, s);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
      window.addEventListener('keydown', onKey);
      first.current?.focus();
      return () => window.removeEventListener('keydown', onKey);
    }
    const back = BackHandler.addEventListener('hardwareBackPress', () => { close(); return true; });
    return () => back.remove();
  }, [close, verse]);
  const actions = [
    { id: 'play', label: T('Play'), name: 'volume-high-outline', run: play },
    { id: 'translation', label: T('Translation'), name: 'language-outline', run: translate },
    { id: 'mark', label: T(marked ? 'Reading position saved' : 'Save reading position'), name: 'bookmark-outline', run: mark },
  ];
  return <View testID="indopak-ayah-popover" accessibilityRole="toolbar" accessibilityLabel={`${T('Verse')} ${verse}`}
    onStartShouldSetResponderCapture={() => { touching(true); return false; }} onPointerDown={e => { touching(true); e.stopPropagation(); }}
    onAccessibilityEscape={close} onTouchStart={e => { touching(true); e.stopPropagation(); }}
    onTouchMove={e => e.stopPropagation()} onTouchEnd={e => { touching(false); e.stopPropagation(); }}
    onTouchCancel={e => { touching(false); e.stopPropagation(); }}
    style={[styles.root, { left: layout.x, top: layout.y, width: layout.width, height: layout.height }]}>
    <View pointerEvents="none" testID="indopak-ayah-popover-pointer" style={[styles.arrow, { left: layout.arrowX - 7,
      ...(layout.side === 'above' ? { bottom: -6, borderTopWidth: 7, borderTopColor: C.line } : { top: -6, borderBottomWidth: 7, borderBottomColor: C.line }) }]}/>
    <View style={[styles.bar, { backgroundColor: C.card, borderColor: C.line, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
      {actions.map((action, i) => <Pressable key={action.id} ref={i === 0 ? first : undefined}
        testID={`indopak-ayah-${action.id}`} accessibilityRole="button" accessibilityLabel={`${action.label} · ${verse}`}
        accessibilityState={action.id === 'mark' ? { selected: marked } : undefined} aria-pressed={action.id === 'mark' ? marked : undefined}
        onPress={action.run} style={({ pressed }) => [styles.action, { backgroundColor: action.id === 'mark' && marked ? C.mint : 'transparent', opacity: pressed ? .6 : 1 }]}>
        {icon(action.name, 21, action.id === 'mark' && marked ? C.green : C.ink)}
      </Pressable>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  root: { position: 'absolute', direction: 'ltr', zIndex: 4 },
  bar: { flex: 1, borderWidth: 1, borderRadius: 17, paddingHorizontal: 6, paddingVertical: 4, gap: 4,
    boxShadow: '0px 3px 12px rgba(20,18,31,0.16)' },
  action: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  arrow: { position: 'absolute', width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
});
