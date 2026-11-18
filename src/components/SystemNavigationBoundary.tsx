import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { systemContentFrame, type ContentFrame } from '../services/systemLayout';

const FILL = { flex: 1 };
const CONTENT: ViewStyle = { flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden' };
const ContentFrameContext = createContext<ContentFrame | null>(null);

/** Bars and height caps use their actual safe parent, including nested
 * windows/panes, rather than assuming the whole device display is available. */
export function useSafeContentFrame(): ContentFrame {
  const measured = useContext(ContentFrameContext);
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  return measured ?? systemContentFrame(frame, insets, Platform.OS);
}

/**
 * Android draws edge-to-edge, including behind the status bar and system
 * navigation. Reserve all four measured insets once for the entire shell;
 * never guess which navigation mode the device is using or cache its height.
 * The inner View is essential: absolute tabs, the mini-player and sheets must
 * anchor to the safe content box, not the outer padded view. Native insets
 * update when navigation mode, cutouts or window geometry change.
 *
 * iOS keeps its existing per-screen safe areas; web keeps its existing layout.
 */
export function SystemNavigationBoundary({ children, style }: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const [measured, setMeasured] = useState<ContentFrame | null>(null);
  const content = measured ?? systemContentFrame(frame, insets, Platform.OS);
  return <SafeAreaView
    testID="system-window-boundary"
    edges={Platform.OS === 'android' ? ['top', 'left', 'right', 'bottom'] : []}
    style={[FILL, style]}
  >
    <View testID="system-safe-content" style={CONTENT} onLayout={({ nativeEvent: { layout } }) => {
      setMeasured((current) => current?.width === layout.width && current?.height === layout.height
        ? current : { width: layout.width, height: layout.height });
    }}>
      <ContentFrameContext.Provider value={content}>{children}</ContentFrameContext.Provider>
    </View>
  </SafeAreaView>;
}
