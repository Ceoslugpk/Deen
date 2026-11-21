import { Platform, Share } from 'react-native';
import { appShareText } from './appShareCopy';
import qr from '../data/app-share-qr.json';

/** The QR, store action and share payload have exactly one destination. */
export const APP_PLAY_STORE_URL = qr.url;
export const APP_SHARE_MESSAGE = `Islamic Companion\n${APP_PLAY_STORE_URL}`;
export type AppShareResult = 'shared' | 'copied' | 'dismissed';

/** User-initiated only. No contacts permission, accounts, tracking or network call.
 * Desktop browsers without Web Share get a truthful clipboard fallback. A
 * cancelled native/browser sheet is not an error and must never copy secretly. */
export async function shareAppLink(language: string): Promise<AppShareResult> {
  if (Platform.OS === 'web' && (typeof navigator === 'undefined' || typeof navigator.share !== 'function')) {
    if (typeof navigator === 'undefined' || typeof navigator.clipboard?.writeText !== 'function') throw new Error('Clipboard unavailable');
    // Use the browser's rejecting API directly. Expo's legacy web fallback
    // reports true even when execCommand('copy') returns false; that must not
    // turn a denied copy into a misleading success message on this page.
    await navigator.clipboard.writeText(APP_SHARE_MESSAGE);
    return 'copied';
  }
  try {
    const result = await Share.share({ title: appShareText(language, 'title'), message: APP_SHARE_MESSAGE });
    return result?.action === Share.dismissedAction ? 'dismissed' : 'shared';
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') return 'dismissed';
    throw error;
  }
}
