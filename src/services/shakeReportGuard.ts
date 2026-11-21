/** Process-local interaction gates, not analytics. Sheets and native modals
 * notify the shortcut before it can interrupt an existing task. */
const blockers = new Set<symbol>();
const listeners = new Set<() => void>();
let overlayActive = false;
const emit = () => listeners.forEach(listener => listener());
export const isShakeReportBlocked = () => overlayActive || blockers.size > 0;
export function subscribeShakeReportGuard(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function setShakeReportOverlayActive(active: boolean) {
  if (overlayActive === active) return;
  overlayActive = active; emit();
}
export function blockShakeReport() {
  const token = Symbol(); blockers.add(token); emit();
  let released = false;
  return () => { if (released) return; released = true; blockers.delete(token); emit(); };
}

/** Only the focused branch counts. An old Qibla screen retained in a back
 * stack must not disable the shortcut on every subsequent screen. */
export function shakeReportRoute(state: any): { key: string; blocked: boolean } {
  let cursor = state, key = '', blocked = !state;
  const visited = new Set<any>();
  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    const route = cursor.routes?.[cursor.index ?? 0];
    if (!route) break;
    key += '/' + (route.key || route.name || '');
    if (['Qibla', 'Privacy Lock', 'Backup', 'Reader Settings'].includes(route.name)) blocked = true;
    cursor = route.state;
  }
  return { key, blocked: blocked || !key };
}
