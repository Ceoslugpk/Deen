import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, AppState, Keyboard, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SystemModal } from './SystemModal';
import { Tactile } from './Tactile';
import { appFeedbackText, openAppFeedbackForm } from '../services/appFeedback';
import { isAppAccelerometerAvailable, subscribeAppAccelerometer } from '../services/appAccelerometer';
import { SHAKE_SAMPLE_INTERVAL_MS } from '../services/shakeDetection';
import { isShakeReportBlocked, subscribeShakeReportGuard } from '../services/shakeReportGuard';
import { createShakeReportController, type ShakeReportSnapshot } from '../services/shakeReportController';
import { shakeReportPreference } from '../services/shakeReportPreference';
import { shakeReportText } from '../services/shakeReportCopy';

type Appearance = { language: string; rtl: boolean; styles: Record<string, any>; accent: string; card: string; line: string };
function usePreference() {
  const [value, setValue] = useState(shakeReportPreference.getSnapshot);
  useEffect(() => {
    const stop = shakeReportPreference.subscribe(setValue);
    setValue(shakeReportPreference.getSnapshot());
    void shakeReportPreference.hydrate();
    return stop;
  }, []);
  return value;
}

/** Mounted only on native. Web keeps the real manual external-link anchor,
 * without a misleading switch or a browser motion-permission prompt. */
export function ShakeReportSetting(props: Appearance & { icon?: React.ReactNode }) {
  if (Platform.OS === 'web') return null;
  return <NativeShakeReportSetting {...props} />;
}
function NativeShakeReportSetting({ language, styles: s, accent, icon }: Appearance & { icon?: React.ReactNode }) {
  const preference = usePreference();
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    void isAppAccelerometerAvailable().then(value => { if (alive) setAvailable(value); });
    return () => { alive = false; };
  }, []);
  const copy = (key: Parameters<typeof shakeReportText>[1]) => shakeReportText(language, key);
  const disabled = !preference.hydrated || preference.saving || (available !== true && !preference.enabled);
  return <View testID="settings-shake-report" style={[s.settingsRow, { gap: 12, alignItems: 'center' }]}>
    {icon}
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={s.settingName}>{copy('label')}</Text>
      <Text style={s.meta}>{available === null ? copy('checking') : available ? copy('description') : copy('unavailable')}</Text>
      {preference.saveError && <Text testID="settings-shake-report-save-error" accessibilityLiveRegion="polite" style={s.meta}>{copy('saveError')}</Text>}
    </View>
    <View style={{ direction: 'ltr', minWidth: 44, minHeight: 44, justifyContent: 'center' }}>
      <Switch testID="settings-shake-report-switch" accessibilityLabel={copy('label')} accessibilityHint={copy('description')}
        accessibilityState={{ disabled, busy: preference.saving }} disabled={disabled} value={preference.enabled}
        trackColor={{ true: accent }} onValueChange={value => { void shakeReportPreference.setEnabled(value); }} />
    </View>
  </View>;
}

type ShortcutProps = Appearance & { active: boolean; blocked: boolean; routeKey: string };
export function ShakeReportShortcut(props: ShortcutProps) {
  if (Platform.OS === 'web') return null;
  return <NativeShakeReportShortcut {...props} />;
}
function NativeShakeReportShortcut(props: ShortcutProps) {
  const latest = useRef(props); latest.current = props;
  const controller = useRef<ReturnType<typeof createShakeReportController> | null>(null);
  const sync = useRef<() => void>(() => {});
  const [snapshot, setSnapshot] = useState<ShakeReportSnapshot>({ visible: false, busy: false, error: false, unavailable: false });
  useEffect(() => {
    let foreground = AppState.currentState === 'active';
    let windowFocused = true;
    let keyboard = Keyboard.isVisible?.() === true;
    const getPolicy = () => {
      const { active, blocked, routeKey } = latest.current;
      const preference = shakeReportPreference.getSnapshot();
      return {
        enabled: preference.hydrated && preference.enabled,
        active: active && foreground && windowFocused && AppState.currentState === 'active',
        blocked: blocked || keyboard || Keyboard.isVisible?.() === true || isShakeReportBlocked(),
        contextKey: routeKey,
      };
    };
    const instance = createShakeReportController({
      available: isAppAccelerometerAvailable,
      subscribe: listener => subscribeAppAccelerometer(listener, SHAKE_SAMPLE_INTERVAL_MS),
      canPresent: () => { const p = getPolicy(); return p.enabled && p.active && !p.blocked; },
      openForm: openAppFeedbackForm,
      changed: setSnapshot,
    });
    controller.current = instance;
    sync.current = () => instance.update(getPolicy());
    const refresh = () => sync.current();
    const subscriptions = [
      AppState.addEventListener('change', state => { foreground = state === 'active'; refresh(); }),
      Keyboard.addListener('keyboardDidShow', () => { keyboard = true; refresh(); }),
      Keyboard.addListener('keyboardDidHide', () => { keyboard = false; refresh(); }),
    ];
    if (Platform.OS === 'android') subscriptions.push(
      AppState.addEventListener('blur', () => {
        // Our own Android Modal can take window focus. Sampling is already
        // stopped while confirming; do not immediately dismiss that modal.
        if (instance.getSnapshot().visible) return;
        windowFocused = false; refresh();
      }),
      AppState.addEventListener('focus', () => { windowFocused = true; refresh(); }),
    );
    if (Platform.OS === 'ios') subscriptions.push(Keyboard.addListener('keyboardWillShow', () => { keyboard = true; refresh(); }));
    const stopGuard = subscribeShakeReportGuard(refresh);
    const stopPreference = shakeReportPreference.subscribe(refresh);
    void shakeReportPreference.hydrate();
    refresh();
    return () => {
      sync.current = () => {};
      controller.current = null;
      stopGuard(); stopPreference(); subscriptions.forEach(subscription => subscription.remove()); instance.dispose();
    };
  }, []);
  useEffect(() => { sync.current(); }, [props.active, props.blocked, props.routeKey]);
  if (!snapshot.visible) return null;
  return <ShakeReportPrompt {...props} busy={snapshot.busy} error={snapshot.error}
    onCancel={() => controller.current?.cancel()} onReport={() => { void controller.current?.confirm(); }} />;
}

/** The real prompt view; no screenshot/log collector or data-prefill path. */
export function ShakeReportPrompt({ language, rtl, styles: s, accent, card, line, busy, error, onCancel, onReport }: Appearance & {
  busy: boolean; error: boolean; onCancel: () => void; onReport: () => void;
}) {
  const copy = (key: Parameters<typeof shakeReportText>[1]) => shakeReportText(language, key);
  return <SystemModal visible transparent animationType="fade" blocksShakeReport={false} onRequestClose={onCancel}
    onShow={() => AccessibilityInfo.announceForAccessibility(copy('title'))}>
    <SafeAreaView edges={Platform.OS === 'ios' ? ['top', 'left', 'right', 'bottom'] : []}
      style={{ flex: 1, backgroundColor: 'rgba(20,18,32,.42)' }}>
      <View style={{ flex: 1, padding: 18, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable accessible={false} importantForAccessibility="no" onPress={onCancel}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
        <View testID="shake-report-prompt" accessibilityViewIsModal onAccessibilityEscape={onCancel}
          style={{ width: '100%', maxWidth: 480, maxHeight: '100%', backgroundColor: card, borderColor: line, borderWidth: 1, borderRadius: 20,
            direction: rtl ? 'rtl' : 'ltr' }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16 }}>
            <Text accessibilityRole="header" style={s.sheetTitle}>{copy('title')}</Text>
            <Text style={s.intro}>{copy('message')}</Text>
            {error && <Text testID="shake-report-error" accessibilityLiveRegion="polite" style={s.intro}>{appFeedbackText(language, 'error')}</Text>}
            <Tactile testID="shake-report-confirm" accessibilityRole="button" accessibilityLabel={copy('report')}
              disabled={busy} accessibilityState={{ disabled: busy, busy }} onPress={onReport}
              style={[s.primary, { minHeight: 48, paddingHorizontal: 16, flexDirection: 'row', gap: 8 }]}>
              {busy && <ActivityIndicator color="#fff" />}
              <Text style={[s.primaryText, { flexShrink: 1, textAlign: 'center' }]}>{copy('report')}</Text>
            </Tactile>
            <Tactile testID="shake-report-cancel" accessibilityRole="button" accessibilityLabel={copy('cancel')} onPress={onCancel}
              style={[s.secondary, { minHeight: 48, paddingHorizontal: 16 }]}>
              <Text style={[s.secondaryText, { flexShrink: 1, textAlign: 'center', color: accent }]}>{copy('cancel')}</Text>
            </Tactile>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  </SystemModal>;
}
