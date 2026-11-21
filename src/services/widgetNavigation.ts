/** Shared by cold-start consumption and warm native-intent events. Unknown
 * values never turn into arbitrary routes. Ayah opens the existing Home card. */
export function widgetDestinationRoute(destination: string | null) {
  if (destination === 'prayer') return { name: 'Main', params: { screen: 'Prayer' } };
  if (destination === 'tasbih') return { name: 'Main', params: { screen: 'Tools', params: { screen: 'Tasbih', initial: false } } };
  if (destination === 'hijri') return { name: 'Main', params: { screen: 'Tools', params: { screen: 'Hijri Calendar', initial: false } } };
  if (destination === 'ayah') return { name: 'Main', params: { screen: 'Home' } };
  return null;
}
