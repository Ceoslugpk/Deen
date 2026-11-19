import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, FlatList, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { SystemModal } from './SystemModal';
import { IndopakPageCanvas } from './IndopakPageCanvas';
import { IndopakPageFold } from './IndopakPageFold';
import { useCalmMotion } from '../design/useCalmMotion';
import { useSafeContentFrame } from './SystemNavigationBoundary';
import { tx } from '../services/arabicCopy';
import { indopakText } from '../services/indopakCopy';
import { captureIndopakSwipe, indopakSwipePage, indopakTurnPlan, indopakZoomControl } from '../services/indopakInteraction';
import { ensureIndopakFont } from '../services/indopakFont';
import { defaultIndopakState, loadIndopakState, saveIndopakState, type IndopakState } from '../services/indopakState';
import {
  fitIndopakPage, INDOPAK_FONT, INDOPAK_PAGE_COUNT, indopakMeta, indopakPage,
  indopakVerseKey, indopakVerseWords, parseIndopakPage, validIndopakPage, type IndopakChapter,
} from '../services/indopakMushaf';

type Picker = 'page' | 'surah' | 'juz' | 'bookmarks' | 'verse' | 'sources';
type PageTurn = {
  from: number; plan: NonNullable<ReturnType<typeof indopakTurnPlan>>;
  viewport: { width: number; height: number }; size: { width: number; height: number };
  zoom: number; scroll: { x: number; y: number };
};
type Props = {
  colors: Record<string, string>; dark: boolean; language: string; rtl: boolean; initialPage?: number;
  icon: (name: string, size: number, color: string) => React.ReactNode;
  onPlayVerse: (key: string, chapter: IndopakChapter) => void;
  onOpenVerse: (key: string, chapter: IndopakChapter) => void;
};

/** All scripture, page layout and typography are local. Audio/translation actions use the existing app. */
export function IndopakMushafReader({ colors: C, dark, language, rtl, icon, initialPage, onPlayVerse, onOpenVerse }: Props) {
  const frame = useSafeContentFrame();
  const still = useCalmMotion();
  const compact = frame.width < 330, short = frame.height < 500 && frame.width >= 400;
  const inlineTop = short && frame.width >= 640, showEdition = !compact && !short;
  const T = useCallback((value: string) => tx(language, value), [language]);
  const copy = useCallback((key: Parameters<typeof indopakText>[1], values?: Record<string, number | string>) => indopakText(language, key, values), [language]);
  const [state, setState] = useState<IndopakState>(defaultIndopakState);
  const latest = useRef(state);
  const [hydrated, setHydrated] = useState(false);
  const [fontReady, setFontReady] = useState(false);
  const [fontError, setFontError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [picker, setPicker] = useState<Picker | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [turn, setTurn] = useState<PageTurn | null>(null);
  const turning = useRef(false), turnProgress = useRef(new Animated.Value(1)).current;
  const scroll = useRef({ x: 0, y: 0 });
  const suppressVerseUntil = useRef(0);
  const vertical = useRef<React.ElementRef<typeof ScrollView>>(null), horizontal = useRef<React.ElementRef<typeof ScrollView>>(null);
  useEffect(() => {
    let live = true;
    loadIndopakState().then(value => {
      if (!live) return;
      const restored = validIndopakPage(initialPage) ? { ...value, page: initialPage } : value;
      latest.current = restored; setState(restored); setHydrated(true);
    });
    return () => { live = false; };
  }, [initialPage]);
  useEffect(() => {
    let live = true;
    setFontError(false);
    ensureIndopakFont().then(ready => { if (live) { setFontReady(ready); setFontError(!ready); } });
    return () => { live = false; };
  }, [attempt]);

  const update = useCallback((patch: Partial<IndopakState>) => {
    if (!hydrated) return;
    const next = { ...latest.current, ...patch };
    latest.current = next; setState(next); setSaveError(false);
    void saveIndopakState(next).then(ok => { if (latest.current === next) setSaveError(!ok); });
  }, [hydrated]);
  const page = useMemo(() => {
    try { return indopakPage(state.page); } catch { return null; }
  }, [state.page]);
  const meta = indopakMeta();
  const chapterFor = (key: string) => meta.chapters[Number(key.split(':')[0]) - 1];
  const chapter = verse ? chapterFor(verse) : null;
  const verseText = useMemo(() => verse ? indopakVerseWords(verse).map(w => w[3]).join(' ') : '', [verse]);
  const verses = useMemo(() => page ? [...new Set(page.words.map(indopakVerseKey))] : [], [page]);
  const size = fitIndopakPage(viewport.width, viewport.height, state.zoom, true);
  const marked = state.savedPages.includes(state.page);
  const zoomControl = indopakZoomControl(state.zoom);
  // Start after React commits both layers. No timers, transparent text crossfade or 3D distortion.
  useLayoutEffect(() => {
    if (!turn) return;
    let live = true;
    const finish = () => {
      if (!live) return;
      turnProgress.setValue(1); turning.current = false; setTurn(null);
    };
    if (still || turn.viewport.width !== viewport.width || turn.viewport.height !== viewport.height || turn.zoom !== state.zoom) {
      finish(); return;
    }
    turnProgress.setValue(0);
    const animation = Animated.timing(turnProgress, { toValue: 1, duration: turn.plan.duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => { if (finished) finish(); });
    return () => { live = false; animation.stop(); };
  }, [turn, still, viewport.width, viewport.height, state.zoom, turnProgress]);
  const goPage = useCallback((number: number) => {
    if (!validIndopakPage(number) || !hydrated || turning.current) return;
    setVerse(null); setPicker(null);
    const from = latest.current.page, plan = viewport.height > 0 ? indopakTurnPlan(from, number, viewport.width, still) : null;
    if (plan) {
      turning.current = true;
      setTurn({ from, plan, viewport: { ...viewport }, size: { ...size }, zoom: latest.current.zoom, scroll: { ...scroll.current } });
      suppressVerseUntil.current = Math.max(suppressVerseUntil.current, Date.now() + plan.duration + 100);
    }
    if (from !== number) update({ page: number });
    vertical.current?.scrollTo({ y: 0, animated: false });
    horizontal.current?.scrollToEnd({ animated: false });
    scroll.current = { x: 0, y: 0 };
  }, [hydrated, update, still, viewport.width, viewport.height, size.width, size.height]);
  const swipeFrom = useRef<number | null>(null), swipeBlocked = useRef(false);
  const canSwipe = hydrated && fontReady && !fontError && !!page && !picker && !verse && !turn;
  const swipe = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: (_event, gesture) => {
      swipeBlocked.current = gesture.numberActiveTouches !== 1;
      return false;
    },
    onMoveShouldSetPanResponder: (_event, gesture) => canSwipe && !turning.current && !swipeBlocked.current && captureIndopakSwipe(state.zoom, gesture),
    onMoveShouldSetPanResponderCapture: (_event, gesture) => canSwipe && !turning.current && !swipeBlocked.current && captureIndopakSwipe(state.zoom, gesture),
    onPanResponderGrant: (_event, gesture) => {
      swipeFrom.current = latest.current.page; swipeBlocked.current = gesture.numberActiveTouches !== 1;
      suppressVerseUntil.current = Date.now() + 350;
    },
    onPanResponderStart: (_event, gesture) => { if (gesture.numberActiveTouches > 1) swipeBlocked.current = true; },
    onPanResponderMove: (_event, gesture) => { if (gesture.numberActiveTouches > 1) swipeBlocked.current = true; },
    onPanResponderRelease: (_event, gesture) => {
      suppressVerseUntil.current = Date.now() + 350;
      const from = swipeFrom.current; swipeFrom.current = null;
      if (!canSwipe || turning.current || swipeBlocked.current || from !== latest.current.page) return;
      const target = indopakSwipePage(from!, latest.current.zoom, viewport.width, gesture);
      if (target !== null) goPage(target);
    },
    onPanResponderTerminate: () => { swipeFrom.current = null; suppressVerseUntil.current = Date.now() + 350; },
    onPanResponderTerminationRequest: () => true,
    // A native scroll/stack-back recognizer may take over; cancellation never turns a page.
    onShouldBlockNativeResponder: () => false,
  }), [canSwipe, state.zoom, viewport.width, goPage]);
  // RN web's disabled ScrollView applies touch-action:none to descendants too.
  // Keep web wrappers enabled and let their actual overflow decide what scrolls;
  // stage pan-y reserves unzoomed horizontal drags for JS, without blocking vertical scrolling.
  const webGestureStyle: ViewStyle & { touchAction: 'pan-y' | 'auto' } = { touchAction: state.zoom === 1 ? 'pan-y' : 'auto' };
  const openWord = (key: string) => { if (!turning.current && Date.now() >= suppressVerseUntil.current) setVerse(key); };
  const togglePage = () => update({ savedPages: marked ? latest.current.savedPages.filter(p => p !== state.page)
    : [...latest.current.savedPages, state.page].sort((a, b) => a - b) });
  const button = (label: string, onPress: () => void, name: string, options: { disabled?: boolean; selected?: boolean; text?: string; testID?: string } = {}) => (
    <Pressable accessibilityRole={options.selected === undefined ? 'button' : 'checkbox'} accessibilityLabel={label}
      accessibilityState={{ disabled: !!options.disabled || !!turn, checked: options.selected }} aria-checked={options.selected}
      testID={options.testID} disabled={options.disabled || !hydrated || !!turn} onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: options.selected ? C.mint : C.card, borderColor: C.line, opacity: options.disabled ? .35 : pressed ? .65 : 1 }]}>
      {icon(name, 18, options.selected ? C.green : C.ink)}
      {!!options.text && <Text style={[styles.buttonText, { color: C.ink }]} numberOfLines={2}>{options.text}</Text>}
    </Pressable>
  );

  return <View testID="indopak-reader" style={styles.fill}>
    <View testID="indopak-top-controls" style={[styles.topControls, inlineTop && styles.topInline]}>
      <View testID="indopak-caption" style={[styles.caption, inlineTop && styles.captionInline]}>
        {showEdition && <View style={styles.shrink}>
          <Text style={[styles.edition, { color: C.ink }]} numberOfLines={1}>{copy('edition')}</Text>
          <Text style={[styles.meta, { color: C.green }]}>{T('Offline')}</Text>
        </View>}
        <Pressable testID="indopak-page-select" accessibilityRole="button" accessibilityLabel={`${T('Page')} ${state.page} / ${INDOPAK_PAGE_COUNT}`}
          accessibilityValue={{ min: 1, max: INDOPAK_PAGE_COUNT, now: state.page }} accessibilityLiveRegion="polite"
          accessibilityActions={[{ name: 'increment', label: T('Next section') }, { name: 'decrement', label: T('Previous section') }]}
          onAccessibilityAction={({ nativeEvent }) => {
            if (nativeEvent.actionName === 'increment') goPage(latest.current.page + 1);
            if (nativeEvent.actionName === 'decrement') goPage(latest.current.page - 1);
          }}
          disabled={!hydrated || !!turn} onPress={() => setPicker('page')}
          style={[styles.pageSelect, !showEdition && !inlineTop && styles.shrink, { borderColor: C.line, backgroundColor: C.card }]}>
          <View style={styles.counter}>
            <Text style={[styles.pageLabel, { color: C.muted }]} numberOfLines={1}>{T('Page')}</Text>
            <Text style={[styles.pageNumber, { color: C.ink }]} numberOfLines={1}>{state.page} / {INDOPAK_PAGE_COUNT}</Text>
          </View>
          {icon('chevron-down', 14, C.muted)}
        </Pressable>
        {compact && button(T('Verse'), () => setPicker('verse'), 'list-outline', { testID: 'indopak-verse-list' })}
        {button(T('Sources'), () => setPicker('sources'), 'information-circle-outline', { testID: 'indopak-sources' })}
      </View>
      <View testID="indopak-tools" style={[styles.tools, inlineTop && styles.shrink]}>
        {button(T('Surah'), () => setPicker('surah'), 'book-outline', { text: compact ? undefined : T('Surah'), testID: 'indopak-surah' })}
        {button(T('Juz'), () => setPicker('juz'), 'layers-outline', { text: compact ? undefined : T('Juz'), testID: 'indopak-juz' })}
        {button(T('Bookmarks'), togglePage, marked ? 'bookmark' : 'bookmark-outline', { selected: marked, testID: 'indopak-save-page' })}
        {button(`${copy('zoom')} ${state.zoom}×`, () => update({ zoom: zoomControl.next }), zoomControl.icon, { text: compact ? undefined : `${state.zoom}×`, testID: 'indopak-zoom' })}
        {!compact && button(T('Verse'), () => setPicker('verse'), 'list-outline', { text: T('Verse'), testID: 'indopak-verse-list' })}
      </View>
    </View>
    {!!saveError && <Pressable onPress={() => update({})} accessibilityRole="button"><Text style={[styles.message, { color: C.ink }]}>{copy('saveError')}</Text></Pressable>}
    <View testID="indopak-page-viewport" style={[styles.stage, Platform.OS === 'web' && webGestureStyle]} {...swipe.panHandlers} onLayout={({ nativeEvent: { layout } }) => {
      setViewport(current => current.width === layout.width && current.height === layout.height ? current : { width: layout.width, height: layout.height });
    }}>
      {!hydrated || (!fontReady && !fontError) ? <View style={styles.center}><ActivityIndicator color={C.green}/><Text style={[styles.message, { color: C.ink }]}>{T('Loading…')}</Text></View>
        : fontError || !page ? <View style={styles.center}><Text style={[styles.message, { color: C.ink }]}>{copy(fontError ? 'fontError' : 'dataError')}</Text>
          {fontError && button(T('Retry'), () => setAttempt(n => n + 1), 'refresh-outline', { text: T('Retry') })}</View>
        : <>
          <View testID="indopak-page-current" style={[styles.fill, { backgroundColor: C.bg }]}>
            <ScrollView ref={vertical} testID="indopak-vertical-scroll" nestedScrollEnabled scrollEnabled={Platform.OS === 'web' || size.height > viewport.height + 1} showsVerticalScrollIndicator={size.height > viewport.height}
              scrollEventThrottle={16} onScroll={({ nativeEvent }) => { scroll.current.y = nativeEvent.contentOffset.y; }}
              contentContainerStyle={{ minHeight: viewport.height, justifyContent: 'center' }}>
              <ScrollView ref={horizontal} testID="indopak-horizontal-scroll" horizontal nestedScrollEnabled scrollEnabled={Platform.OS === 'web' || state.zoom > 1} bounces={false} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={state.zoom > 1}
                scrollEventThrottle={16} onScroll={({ nativeEvent }) => { scroll.current.x = nativeEvent.contentOffset.x; }}
                style={{ height: size.height, direction: 'ltr' }} contentContainerStyle={{ minWidth: viewport.width, alignItems: 'center', justifyContent: 'center' }}
                onContentSizeChange={() => { if (state.zoom > 1) horizontal.current?.scrollToEnd({ animated: false }); }}>
                <IndopakPageCanvas number={state.page} width={size.width} height={size.height} colors={C} dark={dark} language={language} verse={verse} onWordPress={openWord}/>
              </ScrollView>
            </ScrollView>
          </View>
          {turn && <IndopakPageFold progress={turnProgress} direction={turn.plan.direction} viewport={turn.viewport} size={turn.size}
            scroll={turn.scroll} colors={C} dark={dark}>
            <View style={[styles.snapshot, { width: Math.max(turn.viewport.width, turn.size.width), height: Math.max(turn.viewport.height, turn.size.height),
              transform: [{ translateX: -turn.scroll.x }, { translateY: -turn.scroll.y }] }]}>
              <IndopakPageCanvas number={turn.from} width={turn.size.width} height={turn.size.height} colors={C} dark={dark} language={language} interactive={false}/>
            </View>
          </IndopakPageFold>}
        </>}
    </View>
    {picker && <SystemModal visible transparent animationType="fade" onRequestClose={() => setPicker(null)}>
      <IndopakNavigator key={picker} kind={picker} page={state.page} savedPages={state.savedPages} verses={verses}
        C={C} language={language} rtl={rtl} close={() => setPicker(null)} goPage={goPage}
        selectVerse={key => { setPicker(null); setVerse(key); }} setKind={setPicker} icon={icon}/>
    </SystemModal>}
    {verse && chapter && <SystemModal visible transparent animationType="fade" onRequestClose={() => setVerse(null)}>
      <IndopakVersePanel C={C} language={language} verse={verse} chapter={chapter} text={verseText} close={() => setVerse(null)}
        play={() => { setVerse(null); onPlayVerse(verse, chapter); }} open={() => { setVerse(null); onOpenVerse(verse, chapter); }}/>
    </SystemModal>}
  </View>;
}

function IndopakNavigator({ kind, page, savedPages, verses, C, language, rtl, close, goPage, selectVerse, setKind, icon }: {
  kind: Picker; page: number; savedPages: number[]; verses: string[]; C: Record<string, string>; language: string; rtl: boolean;
  close: () => void; goPage: (page: number) => void; selectVerse: (key: string) => void; setKind: (kind: Picker) => void;
  icon: Props['icon'];
}) {
  const { height } = useSafeContentFrame();
  const T = (value: string) => tx(language, value), copy = (key: Parameters<typeof indopakText>[1]) => indopakText(language, key, { total: INDOPAK_PAGE_COUNT });
  const meta = indopakMeta();
  const [input, setInput] = useState(String(page)), [search, setSearch] = useState(''), [invalid, setInvalid] = useState(false);
  const labels: Record<Picker, string> = { page: T('Page'), surah: T('Surah'), juz: T('Juz'), bookmarks: T('Bookmarks'), verse: T('Verse'), sources: T('Sources') };
  const items = kind === 'surah' ? meta.chapters.map(c => ({ id: String(c.id), label: `${c.id}. ${c.name}`, detail: c.arabic, page: c.page }))
    : kind === 'juz' ? meta.juz.map(j => ({ id: String(j.id), label: `${T('Juz')} ${j.id}`, detail: j.verse, page: j.page }))
    : kind === 'bookmarks' ? savedPages.map(p => ({ id: String(p), label: `${T('Page')} ${p}`, detail: meta.chapters[indopakPage(p).words[0][0] - 1].name, page: p }))
    : verses.map(key => ({ id: key, label: `${T('Verse')} ${key}`, detail: meta.chapters[Number(key.split(':')[0]) - 1].name, page: 0 }));
  const filtered = items.filter(item => `${item.label} ${item.detail}`.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()));
  const jump = () => { const number = parseIndopakPage(input); if (number === null) setInvalid(true); else goPage(number); };
  return <View style={[styles.modalRoot, { backgroundColor: 'rgba(0,0,0,.42)' }]}>
    <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close}/>
    <View testID="indopak-navigator" style={[styles.modal, { backgroundColor: C.bg, borderColor: C.line, maxHeight: Math.max(120, height - 24), direction: rtl ? 'rtl' : 'ltr' }]}>
      <Text style={[styles.title, { color: C.ink }]}>{labels[kind]}</Text>
      {kind !== 'sources' && <View style={styles.tabs}>{(['page', 'surah', 'juz', 'bookmarks'] as Picker[]).map(value => <Pressable key={value} accessibilityRole="button"
        accessibilityState={{ selected: kind === value }} aria-selected={kind === value} onPress={() => setKind(value)} style={[styles.tab, { backgroundColor: kind === value ? C.mint : C.card, borderColor: C.line }]}>
        <Text style={[styles.buttonText, { color: C.ink }]}>{labels[value]}</Text></Pressable>)}</View>}
      {kind === 'page' ? <View style={{ gap: 10 }}>
        <TextInput testID="indopak-page-input" accessibilityLabel={T('Page')} value={input} onChangeText={v => { setInput(v); setInvalid(false); }}
          onSubmitEditing={jump} keyboardType="number-pad" returnKeyType="go" maxLength={3} selectTextOnFocus
          style={[styles.input, { color: C.ink, backgroundColor: C.card, borderColor: C.line, textAlign: 'center', writingDirection: 'ltr' }]}/>
        {invalid && <Text accessibilityRole="alert" style={[styles.message, { color: C.ink }]}>{copy('pageError')}</Text>}
        <Pressable testID="indopak-page-go" accessibilityRole="button" onPress={jump} style={[styles.action, { backgroundColor: C.green }]}><Text style={[styles.buttonText, { color: C.onAccent }]}>{T('Read')}</Text></Pressable>
      </View> : kind === 'sources' ? <View testID="indopak-source-summary" style={{ gap: 8, paddingVertical: 12 }}>
        <Text style={[styles.body, { color: C.ink }]}>{copy('edition')}</Text>
        <Text style={[styles.body, { color: C.muted }]}>QUL / Tarteel · QuranWBW</Text>
      </View> : <>
        <TextInput accessibilityLabel={T('Search')} placeholder={T('Search')} placeholderTextColor={C.muted} value={search} onChangeText={setSearch}
          style={[styles.input, { color: C.ink, backgroundColor: C.card, borderColor: C.line }]}/>
        <FlatList style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" data={filtered} keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={[styles.message, { color: C.muted }]}>{kind === 'bookmarks' ? copy('empty') : T('Search')}</Text>}
          renderItem={({ item }) => <Pressable accessibilityRole="button" testID={`indopak-jump-${kind}-${item.id}`}
            onPress={() => kind === 'verse' ? selectVerse(item.id) : goPage(item.page)} style={[styles.listRow, { borderColor: C.line }]}>
            <View style={styles.shrink}><Text style={[styles.body, { color: C.ink }]}>{item.label}</Text><Text style={[styles.meta, { color: C.muted }]}>{item.detail}</Text></View>
            {icon(rtl ? 'chevron-back' : 'chevron-forward', 18, C.green)}
          </Pressable>}/>
      </>}
      <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close} style={[styles.action, { backgroundColor: C.card, borderWidth: 1, borderColor: C.line }]}>
        <Text style={[styles.buttonText, { color: C.ink }]}>{T('Close')}</Text>
      </Pressable>
    </View>
  </View>;
}

function IndopakVersePanel({ C, language, verse, chapter, text, close, play, open }: {
  C: Record<string, string>; language: string; verse: string; chapter: IndopakChapter; text: string;
  close: () => void; play: () => void; open: () => void;
}) {
  const { height } = useSafeContentFrame();
  const T = (value: string) => tx(language, value);
  return <View style={[styles.modalRoot, { backgroundColor: 'rgba(0,0,0,.42)' }]}>
    <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close}/>
    <View testID="indopak-verse-panel" style={[styles.modal, { backgroundColor: C.bg, borderColor: C.line, maxHeight: Math.max(120, height - 24) }]}>
      <Text style={[styles.title, { color: C.ink }]}>{chapter.name} · {verse}</Text>
      <ScrollView style={{ flexShrink: 1 }}><Text style={{ fontFamily: INDOPAK_FONT, fontSize: 26, lineHeight: 60, color: C.ink, textAlign: 'right', writingDirection: 'rtl', padding: 8 }}>{text}</Text></ScrollView>
      <Pressable testID="indopak-play-verse" accessibilityRole="button" onPress={play} style={[styles.action, { backgroundColor: C.green }]}><Text style={[styles.buttonText, { color: C.onAccent }]}>{T('Play')}</Text></Pressable>
      <Pressable testID="indopak-open-verse" accessibilityRole="button" onPress={open} style={[styles.action, { backgroundColor: C.card, borderColor: C.line, borderWidth: 1 }]}><Text style={[styles.buttonText, { color: C.ink }]}>{indopakText(language, 'openVerse')}</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close} style={[styles.action, { backgroundColor: C.card }]}><Text style={[styles.buttonText, { color: C.ink }]}>{T('Close')}</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0, minWidth: 0 }, shrink: { flex: 1, minWidth: 0 },
  topControls: { gap: 6, paddingHorizontal: 12, paddingTop: 4, paddingBottom: 6 },
  topInline: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  caption: { flexDirection: 'row', alignItems: 'center', gap: 6 }, captionInline: { flexShrink: 0 },
  edition: { fontFamily: 'DMSans_600SemiBold', fontSize: 12 }, meta: { fontFamily: 'DMSans_400Regular', fontSize: 10, lineHeight: 15 },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  button: { minWidth: 44, minHeight: 44, flexShrink: 1, paddingHorizontal: 10, gap: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 14 },
  buttonText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, textAlign: 'center', flexShrink: 1 },
  stage: { flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 16 },
  snapshot: { position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  pageSelect: { minWidth: 104, flexShrink: 0, flexDirection: 'row', gap: 6, minHeight: 44, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 14 },
  counter: { alignItems: 'center', minWidth: 0, flexShrink: 1 },
  pageLabel: { fontFamily: 'DMSans_400Regular', fontSize: 10, lineHeight: 12 },
  pageNumber: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, lineHeight: 16, fontVariant: ['tabular-nums'], writingDirection: 'ltr' },
  modalRoot: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 },
  modal: { width: '100%', maxWidth: 520, minHeight: 0, flexShrink: 1, padding: 16, gap: 12, borderRadius: 24, borderWidth: 1 },
  title: { fontFamily: 'DMSans_700Bold', fontSize: 18, flexShrink: 1 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tab: { paddingHorizontal: 10, paddingVertical: 12, minHeight: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center' },
  input: { minHeight: 48, padding: 12, borderRadius: 12, borderWidth: 1, fontFamily: 'DMSans_400Regular', fontSize: 16 },
  action: { minHeight: 44, padding: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, minHeight: 58, gap: 8, borderBottomWidth: 1 },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 14, lineHeight: 21 },
  message: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
