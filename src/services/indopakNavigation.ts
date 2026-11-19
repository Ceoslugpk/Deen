/** UI-only navigation groups. No edition state, scripture or persistent preference changes. */
export type IndopakDirectory = 'surah' | 'juz' | 'verse';
export type IndopakPicker = IndopakDirectory | 'page' | 'bookmarks' | 'sources';
const DIRECTORY = ['surah', 'juz', 'verse'] as const;
const PAGES = ['page', 'bookmarks'] as const;

export function isIndopakDirectory(kind: IndopakPicker | null): kind is IndopakDirectory {
  return kind === 'surah' || kind === 'juz' || kind === 'verse';
}

export function indopakPickerTabs(kind: IndopakPicker): readonly IndopakPicker[] {
  return isIndopakDirectory(kind) ? DIRECTORY : kind === 'sources' ? [] : PAGES;
}

/** Physical left/right follow the displayed tab order; Home/End and vertical arrows work when tabs wrap. */
export function indopakPickerKey(kind: IndopakPicker, key: string, rtl = false): IndopakPicker | null {
  const tabs = indopakPickerTabs(kind), index = tabs.indexOf(kind);
  if (!tabs.length || index < 0) return null;
  if (key === 'Home') return tabs[0];
  if (key === 'End') return tabs[tabs.length - 1];
  const step = key === 'ArrowRight' ? (rtl ? -1 : 1) : key === 'ArrowLeft' ? (rtl ? 1 : -1)
    : key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  return step ? tabs[(index + step + tabs.length) % tabs.length] : null;
}
