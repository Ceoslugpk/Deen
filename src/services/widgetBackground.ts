import { Platform } from 'react-native';
import { refreshStoredWidgets } from './widgetSync';
import { widgetsAvailable } from './widgetBridge';

export const WIDGET_BACKGROUND_TASK = 'com.qashi.islamic.widgets.replenish.v2';
let manager: typeof import('expo-task-manager') | null = null;
let background: typeof import('expo-background-task') | null = null;
// Synchronous, module-scope definition is required for headless startup.
// Guarded requires also protect an older installed binary receiving JS before
// the new native modules exist, as well as web, iOS and Expo Go.
if (Platform.OS === 'android') {
  try {
    const tasks = require('expo-task-manager') as typeof import('expo-task-manager');
    const scheduler = require('expo-background-task') as typeof import('expo-background-task');
    if (!tasks.isTaskDefined(WIDGET_BACKGROUND_TASK)) {
      tasks.defineTask(WIDGET_BACKGROUND_TASK, async ({ error }) => {
        if (error) return scheduler.BackgroundTaskResult.Failed;
        return await refreshStoredWidgets() ? scheduler.BackgroundTaskResult.Success : scheduler.BackgroundTaskResult.Failed;
      });
    }
    manager = tasks; background = scheduler;
  } catch { /* New native modules require a new binary, never crash an old one. */ }
}
export async function registerWidgetBackgroundTask(): Promise<boolean> {
  if (Platform.OS !== 'android' || !widgetsAvailable() || !manager || !background) return false;
  try {
    if (!await manager.isAvailableAsync()) return false;
    if (!await manager.isTaskRegisteredAsync(WIDGET_BACKGROUND_TASK)) {
      await background.registerTaskAsync(WIDGET_BACKGROUND_TASK, { minimumInterval: 360 });
    }
    return true;
  } catch { return false; }
}
