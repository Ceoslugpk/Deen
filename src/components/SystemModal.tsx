import React, { useEffect } from 'react';
import { Modal as NativeModal, Platform, type ModalProps } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SystemNavigationBoundary } from './SystemNavigationBoundary';
import { blockShakeReport } from '../services/shakeReportGuard';

/** A React Native Modal is a different Android window: the app shell's
 * padding cannot protect it. Measure that window independently, including
 * when Android already fits it inside a bar. Never seed it with the root's
 * cached initial metrics or add the root inset a second time. */
export function SystemModal({ children, blocksShakeReport = true, ...props }: ModalProps & { blocksShakeReport?: boolean }) {
  useEffect(() => {
    if (Platform.OS === 'web' || props.visible === false || !blocksShakeReport) return;
    return blockShakeReport();
  }, [props.visible, blocksShakeReport]);
  if (Platform.OS !== 'android') return <NativeModal {...props}>{children}</NativeModal>;
  return <NativeModal {...props} statusBarTranslucent navigationBarTranslucent>
    <SafeAreaProvider>
      <SystemNavigationBoundary>{children}</SystemNavigationBoundary>
    </SafeAreaProvider>
  </NativeModal>;
}
