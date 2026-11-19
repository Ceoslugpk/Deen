import * as Font from 'expo-font';
import { INDOPAK_FONT } from './indopakMushaf';

let loading: Promise<boolean> | null = null;
/** Keep the existing Quran font preference and startup font set unchanged. */
export function ensureIndopakFont(): Promise<boolean> {
  if (Font.isLoaded(INDOPAK_FONT)) return Promise.resolve(true);
  if (loading) return loading;
  loading = Font.loadAsync({ [INDOPAK_FONT]: require('../../assets/fonts/IndopakNastaleeq.ttf') })
    .then(() => true)
    .catch(() => false)
    .finally(() => { loading = null; });
  return loading;
}
