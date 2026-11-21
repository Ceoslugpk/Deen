/** One checked adapter to the local Expo module. Web/Expo Go fail closed. */
import type { WidgetModule } from '../../modules/deen-widgets';

let cached: WidgetModule | null | undefined;
function nativeModule(): WidgetModule | null {
  if (cached !== undefined) return cached;
  try {
    const mod = require('../../modules/deen-widgets') as WidgetModule;
    cached = ['publishSnapshotJson', 'refreshWidgets', 'readSnapshotJson', 'clearSnapshot'].every(
      key => typeof (mod as unknown as Record<string, unknown>)[key] === 'function',
    ) ? mod : null;
  } catch { cached = null; }
  return cached;
}

let lastPublished = '';
let lastPublishedAt = 0;
let writes: Promise<unknown> = Promise.resolve();
export const lastPublishTime = () => lastPublishedAt;
export const widgetsAvailable = () => nativeModule() !== null;

/** Serialize app publications. Never acknowledge/deduplicate a failed write. */
export function publishSnapshotJson(json: string): Promise<boolean> {
  const work = writes.then(async () => {
    const native = nativeModule();
    if (!native) return false;
    if (json === lastPublished) return true;
    try {
      if (await native.publishSnapshotJson(json) !== true) return false;
      // Persistence succeeded, but a failed update must remain retryable.
      if (await native.refreshWidgets() !== true) return false;
      lastPublished = json;
      lastPublishedAt = Date.now();
      return true;
    } catch { return false; }
  });
  writes = work.catch(() => undefined);
  return work;
}
export async function refreshWidgets(): Promise<boolean> {
  try { return await nativeModule()?.refreshWidgets() === true; } catch { return false; }
}
export async function readSnapshotJson(): Promise<string | null> {
  try { return await nativeModule()?.readSnapshotJson() ?? null; } catch { return null; }
}
export async function clearSnapshot(): Promise<boolean> {
  // Only derived prayer/daily data is cleared natively. Never erase Tasbih.
  const work = writes.then(async () => {
    try {
      if (await nativeModule()?.clearSnapshot() !== true) return false;
      lastPublished = ''; lastPublishedAt = 0;
      return true;
    } catch { return false; }
  });
  writes = work.catch(() => undefined);
  return work;
}
export function nativeTasbihAvailable(): boolean {
  try { return nativeModule()?.supportsTasbihCommands() === true; } catch { return false; }
}
/** Null means unsupported. A supported but failed command throws: do NOT
 * silently apply it to a second local counter after an ambiguous native write. */
export async function commandTasbihJson(command: string): Promise<string | null> {
  const native = nativeModule();
  if (!native || !nativeTasbihAvailable()) return null;
  return native.commandTasbihJson(command);
}
/** Native read failures must not masquerade as an empty/uninitialized store. */
export async function readNativeTasbihJson(): Promise<string | null> {
  const native = nativeModule();
  if (!native || !nativeTasbihAvailable()) return null;
  return native.readNativeTasbihJson();
}
export async function consumeWidgetDestination(): Promise<string | null> {
  try { return await nativeModule()?.consumeWidgetDestination() ?? null; } catch { return null; }
}
export function subscribeWidgetDestination(listener: () => void): () => void {
  try { return nativeModule()?.subscribeWidgetDestination(listener) ?? (() => undefined); } catch { return () => undefined; }
}
export async function startActivity(input: { name: string; time: string; nextAt: number; place: string; method: string }): Promise<boolean> {
  try { return await nativeModule()?.startActivity(input.name, input.time, input.nextAt, input.place, input.method) === true; } catch { return false; }
}
export async function stopActivity(): Promise<boolean> {
  try { return await nativeModule()?.stopActivity() === true; } catch { return false; }
}
