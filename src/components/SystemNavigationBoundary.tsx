import React, { type ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILL = { flex: 1 };

/**
 * Android draws edge-to-edge, including behind Back/Home/Recents. Reserve the
 * measured system inset once for the entire shell, not a guessed button-bar
 * height on each screen. The inner View is essential: absolute-positioned tabs,
 * the mini-player and sheets must anchor to the safe content box, not the outer
 * padded view. Insets update when navigation mode or window geometry changes.
 *
 * iOS keeps its existing per-screen safe areas; web keeps its existing layout.
 * Top/status-bar spacing is deliberately unchanged.
 */
export function SystemNavigationBoundary({ children, style }: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <SafeAreaView
    edges={Platform.OS === 'android' ? ['left', 'right', 'bottom'] : []}
    style={[FILL, style]}
  >
    <View style={FILL}>{children}</View>
  </SafeAreaView>;
}
