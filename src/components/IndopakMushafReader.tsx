import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, BackHandler, Easing, FlatList, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type GestureResponderEvent, type KeyDownEvent, type ViewStyle, type PanResponderCallbacks } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useIndopakRecitation } from '../services/useIndopakRecitation';
import { indopakRecitationOffset, indopakRecitationTarget } from '../services/indopakPlayback';
import { SystemModal } from './SystemModal';
import { IndopakPageCanvas } from './IndopakPageCanvas';
import { IndopakPageFold } from './IndopakPageFold';
import { IndopakAyahPopover } from './IndopakAyahPopover';
import { INDOPAK_HOLD_MS, indopakAyahSegments, indopakPopoverLayout, indopakRevealOffset, indopakStationaryPress, indopakWordAnchor, indopakResizeOffset, type IndopakSelection } from '../services/indopakSelection';
import { useCalmMotion } from '../design/useCalmMotion';
import { clearIndopakFocusPopover, fitIndopakFocusPage, INDOPAK_FOCUS_UNLOCK } from '../services/indopakFocus';
import { beginIndopakPinch, moveIndopakPinch, captureIndopakFocusPan, clampIndopakFocusOffset, type IndopakPinch } from '../services/indopakZoom';
import { useSafeContentFrame } from './SystemNavigationBoundary';
import { tx } from '../services/arabicCopy';
import { indopakText } from '../services/indopakCopy';
import { captureIndopakSwipe, indopakSwipePage, indopakTurnPlan } from '../services/indopakInteraction';
import { indopakPickerKey, indopakPickerTabs, isIndopakDirectory, type IndopakDirectory, type IndopakPicker } from '../services/indopakNavigation';
import { ensureIndopakFont } from '../services/indopakFont';
import { defaultIndopakState, loadIndopakState, saveIndopakState, normalizeIndopakReadingPoint, type IndopakReadingPoint, type IndopakState } from '../services/indopakState';
import {
  fitIndopakPage, INDOPAK_PAGE_COUNT, indopakMeta, indopakPage,
  indopakVerseKey, placeIndopakPage, parseIndopakPage, validIndopakPage, type IndopakChapter,
} from '../services/indopakMushaf';

type Picker = IndopakPicker;
type PageTurn = {
  from: number; plan: NonNullable<ReturnType<typeof indopakTurnPlan>>;
  viewport: { width: number; height: number }; size: { width: number; height: number };
  focusMode: boolean; scroll: { x: number; y: number };
};
type Props = {
  colors: Record<string, string>; dark: boolean; language: string; rtl: boolean; initialPage?: number;
  icon: (name: string, size: number, color: string) => React.ReactNode;
  focusMode: boolean; onFocusModeChange: (value: boolean) => void;
  onPlayVerse: (key: string, chapter: IndopakChapter) => void;
  onOpenVerse: (key: string, chapter: IndopakChapter) => void;
};

/** All scripture, page layout and typography are local. Audio/translation actions use the existing app. */
export function IndopakMushafReader({ colors: C, dark, language, rtl, icon, initialPage, focusMode, onFocusModeChange, onPlayVerse, onOpenVerse }: Props) {
  const frame = useSafeContentFrame();
  const still = useCalmMotion();
  const focused = useIsFocused(), recitingVerse = useIndopakRecitation();
  const [audioFollow, setAudioFollow] = useState<{ requested: string; wordId: number; started: boolean } | null>(null);
  const lastFollowed = useRef('');
  const [wordPressing, setWordPressing] = useState(false), [pageTouching, setPageTouching] = useState(false);
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
  const [directory, setDirectory] = useState<IndopakDirectory>('surah');
  const changePicker = useCallback((kind: Picker) => {
    if (isIndopakDirectory(kind)) setDirectory(kind);
    setPicker(kind);
  }, []);
  const [selection, setSelection] = useState<IndopakSelection | null>(null);
  const verse = selection?.verse || null;
  const closeSelection = useCallback(() => setSelection(null), []);
  const [pendingReveal, setPendingReveal] = useState<{ point: IndopakReadingPoint; open: boolean } | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  // Focus magnification is route-local and transient. Never read or update the
  // old stored zoom field; normal reading is always the original 1× fit.
  const zoomContext = `${focusMode && focused ? 'focus' : 'fit'}:${state.page}:${viewport.width}:${viewport.height}`;
  const [magnification, setMagnification] = useState({ context: zoomContext, zoom: 1 });
  const activeZoom = focusMode && focused && magnification.context === zoomContext ? magnification.zoom : 1;
  const pendingMagnification = useRef<{ context: string; size: typeof viewport; offset: { x: number; y: number } } | null>(null);
  const gestureSession = useRef<null | { kind: 'pinch'; start: IndopakPinch } | { kind: 'pan'; x: number; y: number; dx: number; dy: number }
    | { kind: 'swipe'; page: number } | { kind: 'blocked' }>(null);
  const viewportNode = useRef<React.ElementRef<typeof View>>(null), viewportOrigin = useRef({ x: 0, y: 0 });
  const measureViewport = useCallback(() => {
    viewportNode.current?.measureInWindow((x, y) => { viewportOrigin.current = { x, y }; });
  }, []);
  useLayoutEffect(() => {
    measureViewport();
    const frame = requestAnimationFrame(measureViewport);
    return () => cancelAnimationFrame(frame);
  }, [measureViewport, focusMode, viewport.width, viewport.height, frame.width, frame.height]);
  const [turn, setTurn] = useState<PageTurn | null>(null);
  const turning = useRef(false), turnProgress = useRef(new Animated.Value(1)).current;
  const scroll = useRef({ x: 0, y: 0 });
  const suppressVerseUntil = useRef(0), popupTouch = useRef(false);
  const hold = useRef({ active: false, blocked: true, held: false, x: 0, y: 0, page: 0, focusMode, wordId: 0, verse: '' });
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endWord = useCallback(() => { hold.current.active = false; setWordPressing(false); if (holdTimer.current) clearTimeout(holdTimer.current); holdTimer.current = null; }, []);
  const focusButton = useRef<React.ElementRef<typeof View>>(null), unlockButton = useRef<React.ElementRef<typeof View>>(null);
  const previousFocusMode = useRef(focusMode);
  const exitFocus = useCallback(() => onFocusModeChange(false), [onFocusModeChange]);
  useEffect(() => {
    if (previousFocusMode.current === focusMode) return;
    previousFocusMode.current = focusMode;
    if (Platform.OS !== 'web') return;
    const frame = requestAnimationFrame(() => (focusMode ? unlockButton : focusButton).current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [focusMode]);
  useEffect(() => {
    if (!focusMode || !focused) return;
    const unlock = () => { if (selection || picker) return false; exitFocus(); return true; };
    if (Platform.OS === 'web') {
      const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && unlock()) event.preventDefault(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    const back = BackHandler.addEventListener('hardwareBackPress', unlock);
    return () => back.remove();
  }, [focusMode, focused, selection, picker, exitFocus]);
  const vertical = useRef<React.ElementRef<typeof ScrollView>>(null), horizontal = useRef<React.ElementRef<typeof ScrollView>>(null);
  const geometry = useRef<{ page: number; viewport: typeof viewport; size: typeof viewport } | null>(null);
  const scrollCorrection = useRef<{ page: number; x: number; y: number } | null>(null);
  const applyScrollCorrection = useCallback(() => {
    const target = scrollCorrection.current;
    if (!target || target.page !== latest.current.page) return;
    scroll.current = { x: target.x, y: target.y };
    vertical.current?.scrollTo({ y: target.y, animated: false });
    horizontal.current?.scrollTo({ x: target.x, animated: false });
  }, []);
  const positionPage = useCallback((target: { x: number; y: number }) => {
    scrollCorrection.current = { ...target, page: latest.current.page };
    applyScrollCorrection();
  }, [applyScrollCorrection]);
  const userPanning = useCallback(() => { scrollCorrection.current = null; }, []);
  useEffect(() => {
    let live = true;
    loadIndopakState().then(value => {
      if (!live) return;
      const restored = validIndopakPage(initialPage) ? { ...value, page: initialPage } : value;
      latest.current = restored; setState(restored); setHydrated(true);
      if (restored.readingPoint?.page === restored.page) setPendingReveal({ point: restored.readingPoint, open: false });
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
    if (!hydrated) return Promise.resolve(false);
    const next = { ...latest.current, ...patch };
    latest.current = next; setState(next); setSaveError(false);
    return saveIndopakState(next).then(ok => { if (latest.current === next) setSaveError(!ok); return ok; });
  }, [hydrated]);
  const page = useMemo(() => {
    try { return indopakPage(state.page); } catch { return null; }
  }, [state.page]);
  const meta = indopakMeta();
  const chapterFor = (key: string) => meta.chapters[Number(key.split(':')[0]) - 1];
  const chapter = verse ? chapterFor(verse) : null;
  const placed = useMemo(() => page ? placeIndopakPage(page) : [], [page]);
  const segments = useMemo(() => indopakAyahSegments(placed), [placed]);
  const verses = useMemo(() => page ? [...new Set(page.words.map(indopakVerseKey))] : [], [page]);
  const fitSize = focusMode ? fitIndopakFocusPage(viewport.width, viewport.height) : fitIndopakPage(viewport.width, viewport.height, 1, true);
  const size = { width: fitSize.width * activeZoom, height: fitSize.height * activeZoom };
  const marked = state.savedPages.includes(state.page);
  const anchoredPopover = selection ? indopakPopoverLayout(viewport, size, scroll.current, segments, selection) : null;
  const popover = focusMode ? clearIndopakFocusPopover(viewport, anchoredPopover) : anchoredPopover;
  useLayoutEffect(() => {
    endWord(); setPageTouching(false); hold.current.blocked = true; closeSelection();
    gestureSession.current = null; pendingMagnification.current = null;
    setMagnification(current => current.context === zoomContext && current.zoom === 1 ? current : { context: zoomContext, zoom: 1 });
  }, [zoomContext, closeSelection, endWord]);
  useLayoutEffect(() => {
    if (!hydrated || !fontReady || !page || !size.width || !size.height) return;
    const before = geometry.current, pending = pendingMagnification.current;
    const pinchTarget = pending?.context === zoomContext && Math.abs(pending.size.width - size.width) < .01 && Math.abs(pending.size.height - size.height) < .01
      ? pending.offset : null;
    if (!pinchTarget && before?.page === state.page && before.size.width === size.width && before.size.height === size.height
      && before.viewport.width === viewport.width && before.viewport.height === viewport.height) return;
    geometry.current = { page: state.page, viewport: { ...viewport }, size: { ...size } };
    const target = pinchTarget || (before?.page === state.page
      ? indopakResizeOffset(before.viewport, before.size, scroll.current, viewport, size)
      : { x: Math.max(0, size.width - viewport.width), y: 0 });
    if (pinchTarget) pendingMagnification.current = null;
    positionPage(target);
    // Web can lay out synchronously; native can report its new content size later.
    // Reapply only this explicit correction, never an unconditional scroll-to-right on every resize.
    const frame = requestAnimationFrame(applyScrollCorrection);
    return () => cancelAnimationFrame(frame);
  }, [hydrated, fontReady, page, state.page, viewport.width, viewport.height, size.width, size.height, magnification, zoomContext, positionPage, applyScrollCorrection]);
  useEffect(() => () => { if (holdTimer.current) clearTimeout(holdTimer.current); }, []);
  // Start after React commits both layers. No timers, transparent text crossfade or 3D distortion.
  useLayoutEffect(() => {
    if (!turn) return;
    let live = true;
    const finish = () => {
      if (!live) return;
      turnProgress.setValue(1); turning.current = false; setTurn(null);
    };
    if (still || turn.viewport.width !== viewport.width || turn.viewport.height !== viewport.height || turn.focusMode !== focusMode) {
      finish(); return;
    }
    turnProgress.setValue(0);
    const animation = Animated.timing(turnProgress, { toValue: 1, duration: turn.plan.duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => { if (finished) finish(); });
    return () => { live = false; animation.stop(); };
  }, [turn, still, viewport.width, viewport.height, focusMode, turnProgress]);
  const goPage = useCallback((number: number, followingAudio = false) => {
    if (!validIndopakPage(number) || !hydrated || turning.current) return;
    if (!followingAudio) { setAudioFollow(null); lastFollowed.current = ''; }
    closeSelection(); setPicker(null);
    const from = latest.current.page, plan = viewport.height > 0 ? indopakTurnPlan(from, number, viewport.width, still) : null;
    if (plan) {
      turning.current = true;
      setTurn({ from, plan, viewport: { ...viewport }, size: { ...size }, focusMode, scroll: { ...scroll.current } });
      suppressVerseUntil.current = Math.max(suppressVerseUntil.current, Date.now() + plan.duration + 100);
    }
    if (from !== number) update({ page: number });
    positionPage({ x: Math.max(0, size.width - viewport.width), y: 0 });
  }, [hydrated, update, still, viewport.width, viewport.height, size.width, size.height, positionPage, focusMode]);
  useLayoutEffect(() => {
    if (!pendingReveal || turn || !hydrated || !fontReady || pendingReveal.point.page !== state.page || size.width <= 0 || size.height <= 0) return;
    const anchor = indopakWordAnchor(placed, pendingReveal.point.verse, pendingReveal.point.wordId);
    setPendingReveal(null);
    if (!anchor) return;
    const target = indopakRevealOffset(viewport, size, anchor.rect);
    positionPage(target);
    if (pendingReveal.open) setSelection({ verse: pendingReveal.point.verse, wordId: anchor.wordId });
  }, [pendingReveal, turn, hydrated, fontReady, state.page, placed, viewport.width, viewport.height, size.width, size.height, positionPage]);
  useEffect(() => {
    if (!audioFollow || !focused || !hydrated || !fontReady || !page || size.width <= 0 || size.height <= 0) return;
    if (!recitingVerse) {
      if (audioFollow.started) { setAudioFollow(null); lastFollowed.current = ''; }
      return;
    }
    // An older track may still be audible while the explicitly requested ayah loads.
    if (!audioFollow.started) {
      if (recitingVerse !== audioFollow.requested) return;
      setAudioFollow({ ...audioFollow, started: true });
    }
    if (turn || picker || selection || pendingReveal || wordPressing || pageTouching) return;
    const target = indopakRecitationTarget(recitingVerse, state.page);
    if (!target) return;
    if (target.page !== state.page) { goPage(target.page, true); return; }
    const token = `${recitingVerse}:${state.page}:${focusMode}:${viewport.width}:${viewport.height}`;
    if (lastFollowed.current === token) return;
    lastFollowed.current = token;
    const anchor = indopakWordAnchor(placed, recitingVerse, recitingVerse === audioFollow.requested ? audioFollow.wordId : target.wordId);
    if (!anchor) return;
    const offset = indopakRecitationOffset(viewport, size, scroll.current, anchor.rect);
    if (!offset) return;
    positionPage(offset);
  }, [recitingVerse, audioFollow, focused, hydrated, fontReady, page, turn, picker, selection, pendingReveal, wordPressing, pageTouching,
    state.page, focusMode, viewport.width, viewport.height, size.width, size.height, placed, goPage, positionPage]);
  const swipeBlocked = useRef(false);
  const canSwipe = focused && hydrated && fontReady && !fontError && !!page && !picker && !turn;
  const touchPoints = (event: GestureResponderEvent) => {
    if (Platform.OS === 'web') {
      const node = viewportNode.current as unknown as HTMLElement | null, rect = node?.getBoundingClientRect();
      if (rect) viewportOrigin.current = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    }
    return Array.from(event.nativeEvent.touches || []).map(touch => ({ x: touch.pageX - viewportOrigin.current.x, y: touch.pageY - viewportOrigin.current.y }));
  };
  const blockWordGesture = () => {
    hold.current.blocked = true; endWord(); closeSelection();
    suppressVerseUntil.current = Date.now() + 350;
  };
  const startPinch = (event: GestureResponderEvent) => {
    swipeBlocked.current = true; blockWordGesture();
    const start = beginIndopakPinch(viewport, size, scroll.current, activeZoom, touchPoints(event));
    gestureSession.current = start ? { kind: 'pinch', start } : { kind: 'blocked' };
  };
  const commitPinch = (next: NonNullable<ReturnType<typeof moveIndopakPinch>>) => {
    pendingMagnification.current = { context: zoomContext, size: next.size, offset: next.offset };
    setMagnification({ context: zoomContext, zoom: next.zoom });
  };
  const captureGesture = (_event: GestureResponderEvent, gesture: Parameters<NonNullable<PanResponderCallbacks['onPanResponderMove']>>[1]) =>
    canSwipe && !popupTouch.current && !turning.current && (focusMode && gesture.numberActiveTouches === 2
      || !swipeBlocked.current && (captureIndopakFocusPan(activeZoom, gesture) || captureIndopakSwipe(activeZoom, gesture)));
  const cancelGesture = () => {
    gestureSession.current = null; swipeBlocked.current = true; setPageTouching(false); blockWordGesture();
  };
  const handlers: PanResponderCallbacks = {
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: (event, gesture) => {
      popupTouch.current = false;
      swipeBlocked.current = gesture.numberActiveTouches !== 1;
      if (swipeBlocked.current) blockWordGesture();
      return canSwipe && !turning.current && focusMode && event.nativeEvent.touches?.length === 2;
    },
    onMoveShouldSetPanResponder: captureGesture,
    onMoveShouldSetPanResponderCapture: captureGesture,
    onPanResponderGrant: (event, gesture) => {
      setPageTouching(true); blockWordGesture();
      if (focusMode && event.nativeEvent.touches?.length === 2) startPinch(event);
      else if (activeZoom > 1 && gesture.numberActiveTouches === 1) {
        gestureSession.current = { kind: 'pan', ...scroll.current, dx: gesture.dx, dy: gesture.dy };
      } else {
        swipeBlocked.current = gesture.numberActiveTouches !== 1;
        gestureSession.current = swipeBlocked.current ? { kind: 'blocked' } : { kind: 'swipe', page: latest.current.page };
      }
    },
    onPanResponderStart: (event, gesture) => {
      if (gesture.numberActiveTouches <= 1) return;
      swipeBlocked.current = true; blockWordGesture();
      if (focusMode && event.nativeEvent.touches?.length === 2 && gestureSession.current?.kind !== 'pinch' && gestureSession.current?.kind !== 'blocked') startPinch(event);
      else if (event.nativeEvent.touches?.length !== 2) gestureSession.current = { kind: 'blocked' };
    },
    onPanResponderMove: (event, gesture) => {
      const session = gestureSession.current;
      if (!session || !canSwipe || turning.current) return;
      if (session.kind === 'pinch') {
        if (!focusMode || event.nativeEvent.touches?.length !== 2) { gestureSession.current = { kind: 'blocked' }; return; }
        const next = moveIndopakPinch(session.start, viewport, touchPoints(event));
        if (next) commitPinch(next);
      } else if (gesture.numberActiveTouches > 1) {
        swipeBlocked.current = true; gestureSession.current = { kind: 'blocked' }; blockWordGesture();
      } else if (session.kind === 'pan') {
        positionPage(clampIndopakFocusOffset(viewport, size, { x: session.x - (gesture.dx - session.dx), y: session.y - (gesture.dy - session.dy) }));
      }
    },
    onPanResponderEnd: event => {
      // Lifting either pinch finger cannot turn the remainder into a swipe/hold.
      if (gestureSession.current?.kind === 'pinch' && event.nativeEvent.touches?.length !== 2) gestureSession.current = { kind: 'blocked' };
    },
    onPanResponderRelease: (_event, gesture) => {
      const session = gestureSession.current; gestureSession.current = null;
      setPageTouching(false); blockWordGesture();
      if (!canSwipe || turning.current || swipeBlocked.current || session?.kind !== 'swipe' || session.page !== latest.current.page) return;
      const target = indopakSwipePage(session.page, activeZoom, viewport.width, gesture);
      if (target !== null) goPage(target);
    },
    onPanResponderTerminate: cancelGesture,
    onPanResponderTerminationRequest: () => true,
    // System back/cancel can always win. Focus disables native scrolling;
    // normal mode retains its original native/vertical scroll behavior.
    onShouldBlockNativeResponder: () => false,
  };
  const gestureHandlers = useRef(handlers);
  useLayoutEffect(() => { gestureHandlers.current = handlers; });
  // Keep one recognizer for the entire mount. Recreating a PanResponder on
  // every pinch-sized render loses its touch history halfway through a zoom.
  const swipe = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (e, g) => gestureHandlers.current.onStartShouldSetPanResponder?.(e, g) || false,
    onStartShouldSetPanResponderCapture: (e, g) => gestureHandlers.current.onStartShouldSetPanResponderCapture?.(e, g) || false,
    onMoveShouldSetPanResponder: (e, g) => gestureHandlers.current.onMoveShouldSetPanResponder?.(e, g) || false,
    onMoveShouldSetPanResponderCapture: (e, g) => gestureHandlers.current.onMoveShouldSetPanResponderCapture?.(e, g) || false,
    onPanResponderGrant: (e, g) => { gestureHandlers.current.onPanResponderGrant?.(e, g); },
    onPanResponderStart: (e, g) => { gestureHandlers.current.onPanResponderStart?.(e, g); },
    onPanResponderMove: (e, g) => { gestureHandlers.current.onPanResponderMove?.(e, g); },
    onPanResponderEnd: (e, g) => { gestureHandlers.current.onPanResponderEnd?.(e, g); },
    onPanResponderRelease: (e, g) => { gestureHandlers.current.onPanResponderRelease?.(e, g); },
    onPanResponderTerminate: (e, g) => { gestureHandlers.current.onPanResponderTerminate?.(e, g); },
    onPanResponderTerminationRequest: (e, g) => gestureHandlers.current.onPanResponderTerminationRequest?.(e, g) ?? true,
    onShouldBlockNativeResponder: () => false,
  }), []);
  // Focus owns both pinch/pan axes and suppresses browser page zoom. Normal
  // mode keeps pan-y and its existing scroll/swipe ownership unchanged.
  const webGestureStyle: ViewStyle & { touchAction: 'none' | 'pan-y' } = { touchAction: focusMode ? 'none' : 'pan-y' };
  const wheelEnd = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelHandler = useRef<(event: WheelEvent) => void>(() => {});
  useLayoutEffect(() => {
    wheelHandler.current = event => {
      if (!focusMode || !canSwipe || turning.current || (!event.ctrlKey && activeZoom === 1)) return;
      event.preventDefault(); userPanning(); blockWordGesture(); setPageTouching(true);
      if (wheelEnd.current) clearTimeout(wheelEnd.current);
      wheelEnd.current = setTimeout(() => { setPageTouching(false); wheelEnd.current = null; }, 180);
      const node = viewportNode.current as unknown as HTMLElement | null, rect = node?.getBoundingClientRect();
      if (!rect) return;
      if (event.ctrlKey) {
        // Browser trackpad pinch arrives as ctrl+wheel, not TouchEvents.
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const points = [{ x: x - 50, y }, { x: x + 50, y }];
        const start = beginIndopakPinch(viewport, size, scroll.current, activeZoom, points);
        const radius = 50 * Math.exp(-Math.max(-120, Math.min(120, event.deltaY)) * .01);
        const next = start && moveIndopakPinch(start, viewport, [{ x: x - radius, y }, { x: x + radius, y }]);
        if (next) commitPinch(next);
      } else {
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.height : 1;
        positionPage(clampIndopakFocusOffset(viewport, size, { x: scroll.current.x + event.deltaX * unit, y: scroll.current.y + event.deltaY * unit }));
      }
    };
  });
  useEffect(() => {
    if (Platform.OS !== 'web' || !focusMode) return;
    const node = viewportNode.current as unknown as HTMLElement | null;
    const wheel = (event: WheelEvent) => wheelHandler.current(event);
    node?.addEventListener('wheel', wheel, { passive: false });
    return () => { node?.removeEventListener('wheel', wheel); if (wheelEnd.current) clearTimeout(wheelEnd.current); };
  }, [focusMode, zoomContext]);
  const beginWord = (key: string, wordId: number, event: GestureResponderEvent) => {
    endWord(); setWordPressing(true);
    const e = event.nativeEvent, touch = e.touches?.[0] || e;
    hold.current = { active: true, blocked: (e.touches?.length || 1) !== 1 || Date.now() < suppressVerseUntil.current,
      held: false, x: touch.pageX, y: touch.pageY, page: latest.current.page, focusMode, wordId, verse: key };
    // SVG's web click adapter does not register its native responder mixin. Use one cancellable web-only hold timer.
    if (Platform.OS === 'web' && !hold.current.blocked) holdTimer.current = setTimeout(() => holdWord(key, wordId), INDOPAK_HOLD_MS);
  };
  const openWord = (key: string, wordId: number) => {
    if (!turning.current && !hold.current.blocked && !hold.current.held && Date.now() >= suppressVerseUntil.current) setSelection({ verse: key, wordId });
  };
  const markAyah = (key: string, wordId: number) => {
    const point = normalizeIndopakReadingPoint({ page: latest.current.page, verse: key, wordId });
    if (!point || turning.current) return;
    void update({ readingPoint: point }).then(ok => {
      if (ok && latest.current.readingPoint === point) AccessibilityInfo.announceForAccessibility?.(T('Reading position saved'));
    });
  };
  const holdWord = (key: string, wordId: number) => {
    const h = hold.current;
    if (!h.active || h.blocked || h.held || h.wordId !== wordId || h.verse !== key || h.page !== latest.current.page
      || h.focusMode !== focusMode || turning.current || Date.now() < suppressVerseUntil.current) return;
    h.held = true;
    setSelection({ verse: key, wordId }); markAyah(key, wordId);
  };
  const scrolled = (axis: 'x' | 'y', value: number) => {
    if (Math.abs(scroll.current[axis] - value) > 1) { hold.current.blocked = true; endWord(); closeSelection(); }
    scroll.current[axis] = value;
  };
  const togglePage = () => update({ savedPages: marked ? latest.current.savedPages.filter(p => p !== state.page)
    : [...latest.current.savedPages, state.page].sort((a, b) => a - b) });
  const button = (label: string, onPress: () => void, name: string, options: { disabled?: boolean; selected?: boolean; text?: string; testID?: string; buttonRef?: React.Ref<React.ElementRef<typeof View>> } = {}) => (
    <Pressable accessibilityRole={options.selected === undefined ? 'button' : 'checkbox'} accessibilityLabel={label}
      accessibilityState={{ disabled: !!options.disabled || !!turn, checked: options.selected }} aria-checked={options.selected}
      ref={options.buttonRef} testID={options.testID} disabled={options.disabled || !hydrated || !!turn} onPress={() => { closeSelection(); onPress(); }}
      style={({ pressed }) => [styles.button, { backgroundColor: options.selected ? C.mint : C.card, borderColor: C.line, opacity: options.disabled ? .35 : pressed ? .65 : 1 }]}>
      {icon(name, 18, options.selected ? C.green : C.ink)}
      {!!options.text && <Text style={[styles.buttonText, { color: C.ink }]}>{options.text}</Text>}
    </Pressable>
  );

  return <View testID="indopak-reader" style={[styles.fill, focusMode && styles.focusRoot]} onAccessibilityEscape={focusMode ? exitFocus : undefined}>
    {!focusMode && <View testID="indopak-top-controls" style={[styles.topControls, inlineTop && styles.topInline]}>
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
          disabled={!hydrated || !!turn} onPress={() => { closeSelection(); setPicker('page'); }}
          style={[styles.pageSelect, !showEdition && !inlineTop && styles.shrink, { borderColor: C.line, backgroundColor: C.card }]}>
          <View style={styles.counter}>
            <Text style={[styles.pageLabel, { color: C.muted }]} numberOfLines={1}>{T('Page')}</Text>
            <Text style={[styles.pageNumber, { color: C.ink }]} numberOfLines={1}>{state.page} / {INDOPAK_PAGE_COUNT}</Text>
          </View>
          {icon('chevron-down', 14, C.muted)}
        </Pressable>
        {button(T('Sources'), () => setPicker('sources'), 'information-circle-outline', { testID: 'indopak-sources' })}
      </View>
      <View testID="indopak-tools" style={[styles.tools, inlineTop && styles.shrink]}>
        {button(copy('goTo'), () => setPicker(directory), 'list-outline', { text: copy('goTo'), testID: 'indopak-go-to' })}
        {button(T('Bookmarks'), togglePage, marked ? 'bookmark' : 'bookmark-outline', { selected: marked, testID: 'indopak-save-page' })}
        {button(T('Focus mode'), () => onFocusModeChange(true), 'fullscreen', { text: compact ? undefined : T('Focus mode'), testID: 'indopak-focus', buttonRef: focusButton })}
      </View>
    </View>}
    {!focusMode && !!saveError && <Pressable onPress={() => update({})} accessibilityRole="button"><Text style={[styles.message, { color: C.ink }]}>{copy('saveError')}</Text></Pressable>}
    <View ref={viewportNode} testID="indopak-page-viewport" style={[styles.stage, Platform.OS === 'web' && webGestureStyle]} {...swipe.panHandlers}
      {...(Platform.OS === 'web' && !focusMode ? { onWheel: userPanning } : {})}
      onPointerDown={() => { userPanning(); closeSelection(); }}
      onTouchStart={event => { userPanning(); setPageTouching(true); if ((event.nativeEvent.touches?.length || 1) > 1) hold.current.blocked = true; closeSelection(); }}
      onTouchMove={event => { const h = hold.current, e = event.nativeEvent;
        const touch = e.touches?.[0] || e;
        if (!indopakStationaryPress(e.touches?.length || 1, touch.pageX - h.x, touch.pageY - h.y)) { h.blocked = true; endWord(); } }}
      onTouchEnd={event => { endWord(); if (!event.nativeEvent.touches?.length) setPageTouching(false); }}
      onTouchCancel={cancelGesture}
      onLayout={({ nativeEvent: { layout } }) => {
      measureViewport();
      setViewport(current => current.width === layout.width && current.height === layout.height ? current : { width: layout.width, height: layout.height });
    }}>
      {!hydrated || (!fontReady && !fontError) ? <View style={styles.center}><ActivityIndicator color={C.green}/><Text style={[styles.message, { color: C.ink }]}>{T('Loading…')}</Text></View>
        : fontError || !page ? <View style={styles.center}><Text style={[styles.message, { color: C.ink }]}>{copy(fontError ? 'fontError' : 'dataError')}</Text>
          {fontError && button(T('Retry'), () => setAttempt(n => n + 1), 'refresh-outline', { text: T('Retry') })}</View>
        : <>
          <View testID="indopak-page-current" style={[styles.fill, { backgroundColor: C.bg }]}>
            <ScrollView ref={vertical} testID="indopak-vertical-scroll" nestedScrollEnabled scrollEnabled={!focusMode && (Platform.OS === 'web' || size.height > viewport.height + 1)} showsVerticalScrollIndicator={size.height > viewport.height}
              scrollEventThrottle={16} onScroll={({ nativeEvent }) => { scrolled('y', nativeEvent.contentOffset.y); }}
              onScrollBeginDrag={userPanning} onContentSizeChange={applyScrollCorrection}
              contentContainerStyle={{ minHeight: viewport.height, justifyContent: 'center' }}>
              <ScrollView ref={horizontal} testID="indopak-horizontal-scroll" horizontal nestedScrollEnabled scrollEnabled={!focusMode && Platform.OS === 'web'} bounces={false} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16} onScroll={({ nativeEvent }) => { scrolled('x', nativeEvent.contentOffset.x); }}
                onScrollBeginDrag={userPanning} onContentSizeChange={applyScrollCorrection}
                style={{ height: size.height, direction: 'ltr' }} contentContainerStyle={{ minWidth: viewport.width, alignItems: 'center', justifyContent: 'center' }}>
                <IndopakPageCanvas number={state.page} width={size.width} height={size.height} colors={C} dark={dark} language={language} verse={verse} recitingVerse={recitingVerse}
                  readingPoint={state.readingPoint?.page === state.page ? state.readingPoint.verse : null}
                  onWordPress={openWord} onWordPressIn={beginWord} onWordPressOut={endWord} onWordLongPress={holdWord}/>
              </ScrollView>
            </ScrollView>
          </View>
          {turn && <IndopakPageFold progress={turnProgress} direction={turn.plan.direction} viewport={turn.viewport} size={turn.size}
            scroll={turn.scroll} colors={C} dark={dark}>
            <View style={[styles.snapshot, { width: Math.max(turn.viewport.width, turn.size.width), height: Math.max(turn.viewport.height, turn.size.height),
              transform: [{ translateX: -turn.scroll.x }, { translateY: -turn.scroll.y }] }]}>
              <IndopakPageCanvas number={turn.from} width={turn.size.width} height={turn.size.height} colors={C} dark={dark} language={language} readingPoint={state.readingPoint?.page === turn.from ? state.readingPoint.verse : null} interactive={false}/>
            </View>
          </IndopakPageFold>}
          {selection && chapter && popover && !turn && <IndopakAyahPopover layout={popover} verse={selection.verse}
            marked={state.readingPoint?.page === state.page && state.readingPoint.verse === selection.verse}
            colors={C} language={language} rtl={rtl} icon={icon} close={closeSelection} touching={active => { popupTouch.current = active; }}
            play={() => { closeSelection(); lastFollowed.current = '';
              setAudioFollow({ requested: selection.verse, wordId: selection.wordId, started: recitingVerse === selection.verse });
              onPlayVerse(selection.verse, chapter); }}
            translate={() => { closeSelection(); onOpenVerse(selection.verse, chapter); }} mark={() => markAyah(selection.verse, selection.wordId)}/>}
        </>}
    </View>
    {picker && <SystemModal visible transparent animationType="fade" onRequestClose={() => setPicker(null)}>
      <IndopakNavigator key={picker} kind={picker} page={state.page} savedPages={state.savedPages} verses={verses} readingPoint={state.readingPoint}
        resume={() => { if (state.readingPoint) { goPage(state.readingPoint.page); setPendingReveal({ point: state.readingPoint, open: false }); } }}
        C={C} language={language} rtl={rtl} close={() => setPicker(null)} goPage={goPage}
        selectVerse={key => { setPicker(null); const anchor = indopakWordAnchor(placed, key);
          if (anchor) setPendingReveal({ point: { page: state.page, verse: key, wordId: anchor.wordId }, open: true }); }} setKind={changePicker} icon={icon}/>
    </SystemModal>}
    {focusMode && <Pressable ref={unlockButton} testID="indopak-unlock" accessibilityRole="button"
      accessibilityLabel={`${T('Unlock')} · ${T('Focus mode')}`} onPress={exitFocus}
      style={({ pressed }) => [styles.unlock, { backgroundColor: C.card, borderColor: C.line, opacity: pressed ? .65 : 1 }]}>
      {icon('lock-open-outline', 22, C.ink)}
    </Pressable>}
  </View>;
}

function IndopakNavigator({ kind, page, savedPages, verses, readingPoint, resume, C, language, rtl, close, goPage, selectVerse, setKind, icon }: {
  kind: Picker; page: number; savedPages: number[]; verses: string[]; readingPoint: IndopakReadingPoint | null; resume: () => void; C: Record<string, string>; language: string; rtl: boolean;
  close: () => void; goPage: (page: number) => void; selectVerse: (key: string) => void; setKind: (kind: Picker) => void;
  icon: Props['icon'];
}) {
  const { height } = useSafeContentFrame();
  const T = (value: string) => tx(language, value), copy = (key: Parameters<typeof indopakText>[1]) => indopakText(language, key, { total: INDOPAK_PAGE_COUNT });
  const meta = indopakMeta();
  const [input, setInput] = useState(String(page)), [search, setSearch] = useState(''), [invalid, setInvalid] = useState(false);
  const activeTab = useRef<React.ElementRef<typeof View>>(null);
  const tabs = indopakPickerTabs(kind), directory = isIndopakDirectory(kind);
  useEffect(() => {
    if (Platform.OS !== 'web' || !tabs.length) return;
    const frame = requestAnimationFrame(() => activeTab.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [kind]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    // Also handle the opening fade, before the web Modal marks itself active.
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [close]);
  const labels: Record<Picker, string> = { page: T('Page'), surah: T('Surah'), juz: T('Juz'), bookmarks: T('Bookmarks'), verse: T('Verse'), sources: T('Sources') };
  const title = directory ? copy('goTo') : labels[kind];
  const items = kind === 'surah' ? meta.chapters.map(c => ({ id: String(c.id), label: `${c.id}. ${c.name}`, detail: c.arabic, page: c.page }))
    : kind === 'juz' ? meta.juz.map(j => ({ id: String(j.id), label: `${T('Juz')} ${j.id}`, detail: j.verse, page: j.page }))
    : kind === 'bookmarks' ? savedPages.map(p => ({ id: String(p), label: `${T('Page')} ${p}`, detail: meta.chapters[indopakPage(p).words[0][0] - 1].name, page: p }))
    : verses.map(key => ({ id: key, label: `${T('Verse')} ${key}`, detail: meta.chapters[Number(key.split(':')[0]) - 1].name, page: 0 }));
  const filtered = items.filter(item => `${item.label} ${item.detail}`.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()));
  const jump = () => { const number = parseIndopakPage(input); if (number === null) setInvalid(true); else goPage(number); };
  const heading = <View style={styles.modalHeading}>
    <Text testID="indopak-navigator-title" style={[styles.title, { color: C.ink }]}>{title}</Text>
    {!!tabs.length && <View testID="indopak-navigator-tabs" accessibilityRole="tablist" accessibilityLabel={title} style={styles.tabs}>
      {tabs.map(value => <Pressable key={value} testID={`indopak-tab-${value}`} ref={value === kind ? activeTab : undefined}
        accessibilityRole="tab" accessibilityLabel={labels[value]} accessibilityState={{ selected: kind === value }} aria-selected={kind === value}
        {...(Platform.OS === 'web' ? { tabIndex: value === kind ? 0 : -1, onKeyDown: (event: KeyDownEvent) => {
          const next = indopakPickerKey(kind, event.nativeEvent.key, rtl);
          if (next) { event.preventDefault(); setKind(next); }
          else if (event.nativeEvent.key === ' ') event.preventDefault();
        } } : {})}
        onPress={() => setKind(value)} style={[styles.tab, { backgroundColor: kind === value ? C.mint : C.card, borderColor: C.line }]}>
        <Text style={[styles.buttonText, { color: C.ink }]}>{labels[value]}</Text>
      </Pressable>)}
    </View>}
    {kind === 'verse' && <Text testID="indopak-verse-page" style={[styles.meta, { color: C.muted }]}>{T('Page')} {page} / {INDOPAK_PAGE_COUNT}</Text>}
  </View>;
  const readingMarker = kind === 'bookmarks' && readingPoint ? <Pressable testID="indopak-resume" accessibilityRole="button" onPress={resume}
    style={[styles.listRow, { borderColor: C.gold }]}>
    <View style={styles.shrink}><Text style={[styles.body, { color: C.green }]}>{T('Continue reading')}</Text>
      <Text style={[styles.meta, { color: C.muted }]}>{meta.chapters[Number(readingPoint.verse.split(':')[0]) - 1].name} · {readingPoint.verse} · {T('Page')} {readingPoint.page}</Text></View>
    {icon('bookmark-outline', 20, C.green)}
  </Pressable> : null;
  return <View style={[styles.modalRoot, { backgroundColor: 'rgba(0,0,0,.42)' }]}>
    <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close}/>
    <View testID="indopak-navigator" onAccessibilityEscape={close} style={[styles.modal, { backgroundColor: C.bg, borderColor: C.line, maxHeight: Math.max(120, height - 24), direction: rtl ? 'rtl' : 'ltr' }]}>
      {kind === 'page' || kind === 'sources' ? <ScrollView testID="indopak-navigator-scroll" style={styles.modalScroll} contentContainerStyle={styles.modalHeading} keyboardShouldPersistTaps="handled">
        {heading}
        {kind === 'page' ? <View style={{ gap: 10 }}>
          <TextInput testID="indopak-page-input" accessibilityLabel={T('Page')} value={input} onChangeText={v => { setInput(v); setInvalid(false); }}
            onSubmitEditing={jump} keyboardType="number-pad" returnKeyType="go" maxLength={3} selectTextOnFocus
            style={[styles.input, { color: C.ink, backgroundColor: C.card, borderColor: C.line, textAlign: 'center', writingDirection: 'ltr' }]}/>
          {invalid && <Text accessibilityRole="alert" style={[styles.message, { color: C.ink }]}>{copy('pageError')}</Text>}
          <Pressable testID="indopak-page-go" accessibilityRole="button" onPress={jump} style={[styles.action, { backgroundColor: C.green }]}><Text style={[styles.buttonText, { color: C.onAccent }]}>{T('Read')}</Text></Pressable>
        </View> : <View testID="indopak-source-summary" style={{ gap: 8, paddingVertical: 12 }}>
          <Text style={[styles.body, { color: C.ink }]}>{copy('edition')}</Text>
          <Text style={[styles.body, { color: C.muted }]}>QUL / Tarteel · QuranWBW</Text>
        </View>}
      </ScrollView> : <FlatList testID="indopak-directory-list" style={styles.modalScroll} keyboardShouldPersistTaps="handled" data={filtered} keyExtractor={item => item.id}
        ListHeaderComponent={<View style={styles.modalHeading}>
          {heading}
          <TextInput testID="indopak-directory-search" accessibilityLabel={T('Search')} placeholder={T('Search')} placeholderTextColor={C.muted} value={search} onChangeText={setSearch}
            style={[styles.input, { color: C.ink, backgroundColor: C.card, borderColor: C.line }]}/>
          {readingMarker}
        </View>}
        ListEmptyComponent={<Text style={[styles.message, { color: C.muted }]}>{kind === 'bookmarks' ? copy('empty') : T('Search')}</Text>}
        renderItem={({ item }) => <Pressable accessibilityRole="button" testID={`indopak-jump-${kind}-${item.id}`}
          onPress={() => kind === 'verse' ? selectVerse(item.id) : goPage(item.page)} style={[styles.listRow, { borderColor: C.line }]}>
          <View style={styles.shrink}><Text style={[styles.body, { color: C.ink }]}>{item.label}</Text><Text style={[styles.meta, { color: C.muted }]}>{item.detail}</Text></View>
          {icon(rtl ? 'chevron-back' : 'chevron-forward', 18, C.green)}
        </Pressable>}/>}
      <Pressable testID="indopak-navigator-close" accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close} style={[styles.action, { backgroundColor: C.card, borderWidth: 1, borderColor: C.line }]}>
        <Text style={[styles.buttonText, { color: C.ink }]}>{T('Close')}</Text>
      </Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0, minWidth: 0 }, shrink: { flex: 1, minWidth: 0 },
  focusRoot: { direction: 'ltr' },
  unlock: { position: 'absolute', top: INDOPAK_FOCUS_UNLOCK.inset, right: INDOPAK_FOCUS_UNLOCK.inset, zIndex: 8, elevation: 6,
    width: INDOPAK_FOCUS_UNLOCK.size, height: INDOPAK_FOCUS_UNLOCK.size, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  topControls: { gap: 6, paddingHorizontal: 12, paddingTop: 4, paddingBottom: 6 },
  topInline: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  caption: { flexDirection: 'row', alignItems: 'center', gap: 6 }, captionInline: { flexShrink: 0 },
  edition: { fontFamily: 'DMSans_600SemiBold', fontSize: 12 }, meta: { fontFamily: 'DMSans_400Regular', fontSize: 10, lineHeight: 15 },
  tools: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 6 },
  button: { minWidth: 44, minHeight: 44, maxWidth: '100%', flexShrink: 0, paddingHorizontal: 10, paddingVertical: 8, gap: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 14 },
  buttonText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, lineHeight: 17, textAlign: 'center', minWidth: 0, flexShrink: 1 },
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
  modalHeading: { gap: 12 }, modalScroll: { flexShrink: 1, minHeight: 0 },
  tab: { minWidth: 64, maxWidth: '100%', flexGrow: 1, flexShrink: 0, paddingHorizontal: 10, paddingVertical: 12, minHeight: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center' },
  input: { minHeight: 48, padding: 12, borderRadius: 12, borderWidth: 1, fontFamily: 'DMSans_400Regular', fontSize: 16 },
  action: { minHeight: 44, padding: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, minHeight: 58, gap: 8, borderBottomWidth: 1 },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 14, lineHeight: 21 },
  message: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
