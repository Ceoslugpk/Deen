import { Alert, Platform } from 'react-native';
import { blockShakeReport } from './shakeReportGuard';

/** Preserve existing native alerts and their callbacks while preventing the
 * optional shortcut from presenting another dialog on top. Undefined default
 * button text keeps React Native/iOS's own default OK label. */
export const AppAlert = {
  alert(...[title, message, buttons, options]: Parameters<typeof Alert.alert>) {
    if (Platform.OS === 'web') { Alert.alert(title, message, buttons, options); return; }
    const release = blockShakeReport();
    const guardedButtons = (buttons?.length ? buttons : [{}]).map(button => ({
      ...button, onPress: (...args: any[]) => { release(); return button.onPress?.(...args); },
    }));
    try {
      Alert.alert(title, message, guardedButtons, { ...options, onDismiss: () => { release(); options?.onDismiss?.(); } });
    } catch (error) { release(); throw error; }
  },
};
