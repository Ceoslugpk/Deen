import { indopakPageOrigin } from './indopakSelection';

export const INDOPAK_FOCUS_MIN_ZOOM = 1;
export const INDOPAK_FOCUS_MAX_ZOOM = 3;
export type IndopakPoint = { x: number; y: number };
type Size = { width: number; height: number };
export type IndopakPinch = {
  distance: number; zoom: number; size: Size; anchor: IndopakPoint;
};
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(Math.max(low, high), value));
const validSize = (size: Size) => [size.width, size.height].every(n => Number.isFinite(n) && n > 0);
const validPoint = (point: IndopakPoint) => [point.x, point.y].every(Number.isFinite);
export function boundIndopakFocusZoom(zoom: number) {
  return Number.isFinite(zoom) ? clamp(zoom, INDOPAK_FOCUS_MIN_ZOOM, INDOPAK_FOCUS_MAX_ZOOM) : 1;
}
export function clampIndopakFocusOffset(viewport: Size, size: Size, offset: IndopakPoint): IndopakPoint {
  if (!validSize(viewport) || !validSize(size) || !validPoint(offset)) return { x: 0, y: 0 };
  return { x: clamp(offset.x, 0, size.width - viewport.width), y: clamp(offset.y, 0, size.height - viewport.height) };
}
function pair(points: IndopakPoint[]) {
  if (points.length !== 2 || !points.every(validPoint)) return null;
  const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
  if (!Number.isFinite(distance) || distance < 8) return null;
  return { distance, centre: { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 } };
}

/** Coordinates are local to the safe page viewport, never SVG target-relative.
 * Keep an immutable paper-space anchor, so rapid events do not accumulate drift
 * or depend on when native ScrollView reports its resized content. */
export function beginIndopakPinch(viewport: Size, size: Size, offset: IndopakPoint, zoom: number, points: IndopakPoint[]): IndopakPinch | null {
  const p = pair(points);
  if (!p || !validSize(viewport) || !validSize(size) || !validPoint(offset) || !Number.isFinite(zoom) || zoom < 1 || zoom > INDOPAK_FOCUS_MAX_ZOOM) return null;
  const origin = indopakPageOrigin(viewport, size);
  return { distance: p.distance, zoom, size: { ...size }, anchor: {
    x: (offset.x + p.centre.x - origin.x) / size.width,
    y: (offset.y + p.centre.y - origin.y) / size.height,
  } };
}
export function moveIndopakPinch(start: IndopakPinch, viewport: Size, points: IndopakPoint[]) {
  const p = pair(points);
  if (!p || !validSize(viewport) || !validSize(start.size) || !validPoint(start.anchor)
    || !Number.isFinite(start.distance) || start.distance < 8 || !Number.isFinite(start.zoom) || start.zoom < 1 || start.zoom > INDOPAK_FOCUS_MAX_ZOOM) return null;
  const zoom = boundIndopakFocusZoom(start.zoom * p.distance / start.distance);
  const size = { width: start.size.width * zoom / start.zoom, height: start.size.height * zoom / start.zoom };
  const origin = indopakPageOrigin(viewport, size);
  const offset = clampIndopakFocusOffset(viewport, size, {
    x: origin.x + start.anchor.x * size.width - p.centre.x,
    y: origin.y + start.anchor.y * size.height - p.centre.y,
  });
  return { zoom, size, offset };
}

/** At fit, horizontal gestures still turn pages. Magnified single-finger
 * drags pan both axes instead; they must never turn a page, even at an edge. */
export function captureIndopakFocusPan(zoom: number, gesture: { numberActiveTouches: number; dx: number; dy: number }) {
  return zoom > 1 && gesture.numberActiveTouches === 1 && [gesture.dx, gesture.dy].every(Number.isFinite)
    && Math.hypot(gesture.dx, gesture.dy) >= 8;
}
