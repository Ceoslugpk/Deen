import type { AudioTrack } from './audioService';
import { INDOPAK_VIEWBOX, indopakMeta, indopakPage, indopakPageForVerse, indopakVerseKey, validIndopakPage } from './indopakMushaf';
import { indopakPageOrigin, indopakRevealOffset, type IndopakRect } from './indopakSelection';

type Track = Pick<AudioTrack, 'chapterId' | 'ayahNumber' | 'globalNumber' | 'kind'>;

/** Follow the transport's canonical ayah, not a timer or a guessed full-Surah timestamp. */
export function indopakRecitingVerse(track: Track | null, error: string | null = null): string | null {
  if (!track || error || !['arabic', 'translation'].includes(track.kind) || !Number.isInteger(track.chapterId)
    || !Number.isInteger(track.ayahNumber) || !Number.isInteger(track.globalNumber) || track.globalNumber <= 0) return null;
  const chapter = indopakMeta().chapters[track.chapterId - 1];
  return chapter && track.ayahNumber >= 1 && track.ayahNumber <= chapter.verses ? `${track.chapterId}:${track.ayahNumber}` : null;
}

/** Retain the visible part of a page-spanning ayah instead of jumping back to its first page. */
export function indopakRecitationTarget(verse: string | null, currentPage: number) {
  if (!verse) return null;
  const current = validIndopakPage(currentPage) ? indopakPage(currentPage) : null;
  let page = current?.words.some(word => indopakVerseKey(word) === verse) ? current : null;
  if (!page) {
    const number = indopakPageForVerse(verse);
    if (!number) return null;
    page = indopakPage(number);
  }
  const index = page.words.findIndex(word => indopakVerseKey(word) === verse);
  return index < 0 ? null : { page: page.n, verse, wordId: page.firstWord + index };
}

/** Do not move a readable ayah. Reveal only when its anchor is outside the actual zoomed/scrolled viewport. */
export function indopakRecitationOffset(viewport: { width: number; height: number }, size: { width: number; height: number },
  scroll: { x: number; y: number }, rect: IndopakRect) {
  const origin = indopakPageOrigin(viewport, size);
  const x = origin.x + rect.x * size.width / INDOPAK_VIEWBOX.width - scroll.x;
  const y = origin.y + rect.y * size.height / INDOPAK_VIEWBOX.height - scroll.y;
  if (x >= 6 && x + rect.width * size.width / INDOPAK_VIEWBOX.width <= viewport.width - 6
    && y >= 6 && y + rect.height * size.height / INDOPAK_VIEWBOX.height <= viewport.height - 6) return null;
  const target = indopakRevealOffset(viewport, size, rect);
  // A short landscape pane may not have the popup's usual 74px of headroom.
  // Keep as much of the recited line visible as the real viewport permits.
  const headroom = Math.min(74, Math.max(6, viewport.height - rect.height * size.height / INDOPAK_VIEWBOX.height - 6));
  target.y = Math.max(0, Math.min(Math.max(0, size.height - viewport.height), origin.y + rect.y * size.height / INDOPAK_VIEWBOX.height - headroom));
  return target;
}
