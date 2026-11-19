export type IndopakFoldGeometry = {
  left: number; right: number; paperTop: number; paperHeight: number;
  foldWidth: number; shadowWidth: number; bandWidth: number;
  backPath: string; shadowPath: string;
};

/** Only the decorative paper back bends. The original scripture is clipped, never warped or mirrored. */
export function indopakFoldGeometry(
  viewport: { width: number; height: number }, size: { width: number; height: number }, scroll: { x: number; y: number },
): IndopakFoldGeometry | null {
  if (![viewport.width, viewport.height, size.width, size.height].every(n => Number.isFinite(n) && n > 0)
    || !Number.isFinite(scroll.x) || !Number.isFinite(scroll.y)) return null;
  const paperLeft = (Math.max(viewport.width, size.width) - size.width) / 2 - scroll.x;
  const left = Math.max(0, paperLeft), right = Math.min(viewport.width, paperLeft + size.width);
  if (right <= left) return null;
  const paperTop = (Math.max(viewport.height, size.height) - size.height) / 2 - scroll.y;
  const foldWidth = Math.min(84, Math.max(18, (right - left) * .15), (right - left) * .38);
  const shadowWidth = Math.max(8, foldWidth * .5), bandWidth = foldWidth + shadowWidth;
  const h = size.height, b = bandWidth, f = foldWidth, s = shadowWidth;
  const number = (n: number) => Number(n.toFixed(4));
  const path = (extent: number) => `M ${number(b)} 0 C ${number(b - extent * .42)} ${number(h * .055)} ${number(b - extent)} ${number(h * .17)} ${number(b - extent)} ${number(h * .36)} C ${number(b - extent)} ${number(h * .64)} ${number(b - extent)} ${number(h * .83)} ${number(b)} ${number(h)} Z`;
  return { left, right, paperTop, paperHeight: h, foldWidth: f, shadowWidth: s, bandWidth: b,
    backPath: path(f), shadowPath: path(f + s) };
}

/** Moving a clipping window and counter-translating its contents leaves every letter stationary. */
export function indopakFoldRange(geometry: IndopakFoldGeometry, viewportWidth: number, direction: 1 | -1) {
  const edge: [number, number] = direction === 1 ? [geometry.left, geometry.right] : [geometry.right, geometry.left];
  const mask: [number, number] = direction === 1 ? edge : [edge[0] - viewportWidth, edge[1] - viewportWidth];
  const face: [number, number] = [-mask[0], -mask[1]];
  return { edge, mask, face };
}
