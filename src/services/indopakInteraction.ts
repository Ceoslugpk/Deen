import { validIndopakPage } from './indopakMushaf';

/** Read only the focused branch, never an inactive tab/stack entry or route params. */
export function isIndopakReaderRoute(state: unknown): boolean {
  let branch = state;
  for (let depth = 0; depth < 24; depth++) {
    if (!branch || typeof branch !== 'object') return false;
    const current = branch as { index?: number; routes?: Array<{ name?: string; state?: unknown }> };
    if (!Array.isArray(current.routes) || !current.routes.length) return false;
    const index = current.index ?? 0;
    if (!Number.isInteger(index) || index < 0 || index >= current.routes.length) return false;
    const route = current.routes[index];
    if (!route || typeof route !== 'object') return false;
    if (!route.state) return route.name === '16-line Quran';
    branch = route.state;
  }
  return false;
}

export type IndopakPan = { dx: number; dy: number; vx?: number; numberActiveTouches: number };
const horizontal = (gesture: IndopakPan) => Number.isFinite(gesture.dx) && Number.isFinite(gesture.dy)
  && Math.abs(gesture.dx) >= 14 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.6;

/** At higher zoom levels both axes belong to panning. Taps/vertical drags remain children’s. */
export function captureIndopakSwipe(zoom: number, gesture: IndopakPan): boolean {
  return zoom === 1 && gesture.numberActiveTouches === 1 && horizontal(gesture);
}

/** Quran page order is RTL in every interface language: swipe RIGHT for the next page. */
export function indopakSwipePage(page: number, zoom: number, width: number, gesture: IndopakPan): number | null {
  if (!validIndopakPage(page) || zoom !== 1 || !Number.isFinite(width) || width <= 0
    || ![0, 1].includes(gesture.numberActiveTouches) || !horizontal(gesture)) return null;
  const distance = Math.abs(gesture.dx), threshold = Math.max(44, Math.min(96, width * .18));
  const velocity = Number.isFinite(gesture.vx) ? Math.abs(gesture.vx!) : 0;
  if (distance < threshold && !(distance >= 32 && velocity >= .5)) return null;
  const target = page + (gesture.dx > 0 ? 1 : -1);
  return validIndopakPage(target) ? target : null;
}

/** The lightweight fold keeps original ink crisp: only its clipping edge and blank back move. */
export function indopakTurnPlan(from: number, to: number, width: number, reducedMotion: boolean): {
  direction: 1 | -1; distance: number; duration: number;
} | null {
  if (reducedMotion || !validIndopakPage(from) || !validIndopakPage(to) || from === to
    || !Number.isFinite(width) || width <= 0) return null;
  return { direction: to > from ? 1 : -1, distance: width, duration: 320 };
}
