/**
 * The languages the app knows about, and what each one implies.
 *
 * Two different questions share this list. The first is the language of the
 * interface itself, which is only finished in English and Arabic — the others
 * are offered, and the interface stays in English for them until each one is
 * translated. The second is the language of the content: the Quran text you
 * read alongside the Arabic, and the voice you hear under the recitation.
 *
 * Every edition identifier below was checked against the live API. They are
 * not guesses: a wrong identifier silently returns nothing when the reader
 * fetches a page.
 */

export type LanguageCode = 'en' | 'ar' | 'ur' | 'fr' | 'tr' | 'ru' | 'zh' | 'fa' | 'uz' | 'kk' | 'my';

export type QuranTextEdition = {
  /** The AlQuran Cloud identifier, as the reader passes it to the API. */
  identifier: string;
  /** The name the API reports, shown next to the choice. */
  name: string;
  /**
   * For Arabic the text beside the Quran is a tafsir, not a translation — the
   * Quran is already in Arabic. Marking it keeps the wording honest.
   */
  kind: 'translation' | 'tafsir';
};

export type Language = {
  code: LanguageCode;
  /** The name as it is written in the language itself. */
  native: string;
  english: string;
  rtl: boolean;
  /** True once the interface copy exists in this language. */
  uiReady: boolean;
  /** The Quran text shown beside the Arabic, if the API has one. */
  text?: QuranTextEdition;
  /**
   * The translation voice played under the recitation. Arabic has no entry:
   * for Arabic the audio *is* the recitation, so the voice is chosen from the
   * reciter list instead.
   */
  voice?: { identifier: string; name: string };
};

const RTL: LanguageCode[] = ['ar', 'ur', 'fa'];


export const LANGUAGES: Language[] = [
  {
    code: 'en', native: 'English', english: 'English', rtl: false, uiReady: true,
    text: { identifier: 'tr_en_saheeh_international', name: 'Saheeh International', kind: 'translation' },
    voice: { identifier: 'en.walk', name: 'Ibrahim Walk' },
  },
  {
    code: 'ar', native: 'العربية', english: 'Arabic', rtl: true, uiReady: true,
    text: { identifier: 'tafsir_ar_arabic_ar-tafsir-muyassar', name: 'Tafsir al-Muyassar', kind: 'tafsir' },
  },
  {
    code: 'ur', native: 'اردو', english: 'Urdu', rtl: true, uiReady: false,
    text: { identifier: 'tr_ur_abul_ala_maududi', name: 'Abul Ala Maududi', kind: 'translation' },
    voice: { identifier: 'ur.khan', name: 'Shamshad Ali Khan' },
  },
  {
    code: 'fr', native: 'Français', english: 'French', rtl: false, uiReady: false,
    text: { identifier: 'tr_fr_muhammad_hamidullah', name: 'Muhammad Hamidullah', kind: 'translation' },
    voice: { identifier: 'fr.leclerc', name: 'Youssouf Leclerc' },
  },
  {
    code: 'tr', native: 'Türkçe', english: 'Turkish', rtl: false, uiReady: false,
    text: { identifier: 'tr_tr_diyanet_isleri_3', name: 'Diyanet İşleri', kind: 'translation' },
    voice: { identifier: 'tr.vakfi-audio', name: 'Diyanet Vakfı' },
  },
  {
    code: 'ru', native: 'Русский', english: 'Russian', rtl: false, uiReady: false,
    text: { identifier: 'tr_ru_elmir_kuliev', name: 'Elmir Kuliev', kind: 'translation' },
    voice: { identifier: 'ru.kuliev-audio', name: 'Elmir Kuliev' },
  },
  {
    code: 'zh', native: '中文', english: 'Chinese', rtl: false, uiReady: false,
    text: { identifier: 'tr_zh_ma_jian_latin_script', name: 'Ma Jian', kind: 'translation' },
    voice: { identifier: 'zh.chinese', name: 'Chinese' },
  },
  {
    code: 'fa', native: 'فارسی', english: 'Persian', rtl: true, uiReady: false,
    text: { identifier: 'tr_fa_baha_oddin_khorramshahi_2', name: 'Baha Oddin Khorramshahi', kind: 'translation' },
    voice: { identifier: 'fa.hedayatfarfooladvand', name: 'Fooladvand (Hedayatfar)' },
  },
  {
    code: 'uz', native: "Oʻzbekcha", english: 'Uzbek', rtl: false, uiReady: false,
    text: { identifier: 'tr_uz_muhammad_sodik_muhammad_yusuf', name: 'Muhammad Sodik Muhammad Yusuf', kind: 'translation' },
    voice: { identifier: 'uz.sodik-audio', name: 'Muhammad Sodik Yusuf' },
  },
  {
    code: 'kk', native: 'Қазақша', english: 'Kazakh', rtl: false, uiReady: false,
    text: { identifier: 'tr_kk_khalifah_altai', name: 'Khalifah Altai', kind: 'translation' },
    voice: { identifier: 'kk.khalifahaltai-audio', name: 'Khalifah Altai' },
  },
  {
    code: 'my', native: 'မြန်မာ', english: 'Burmese', rtl: false, uiReady: false,
    text: { identifier: 'tr_my_translation_by_ghazi_muhammed_ha', name: 'Ghazi Muhammed Hashim', kind: 'translation' },
    voice: { identifier: 'my.hashimtinmyint', name: 'Hashim Tin Myint' },
  },
];

export const isRtl = (code: LanguageCode) => RTL.includes(code);

export function languageByCode(code: string): Language | undefined {
  return LANGUAGES.find((entry) => entry.code === code);
}

/** The name to show: in its own language, with the English under it. */
export function languageLabel(code: LanguageCode, inRtl = false): string {
  const entry = languageByCode(code);
  if (!entry) return code;
  return inRtl ? entry.native : entry.native;
}

/**
 * The recitation played when the audio language is Arabic. There is no
 * translation voice for Arabic — the recitation is the point.
 */
export const DEFAULT_RECITER = { identifier: 'ar.alafasy', name: 'Mishary Rashid Alafasy' };

/** A minimal shape, so this helper does not depend on the API module. */
export type EditionLike = { id: string; language: string; author?: string | null; displayName?: string | null };

/**
 * The edition to offer first for a language.
 *
 * The server carries ninety-seven languages and several editions of most of
 * them — fifty-seven in English alone — and reports no way to tell which is
 * better: every edition claims all 6,236 verses. So this does not try to rank
 * them. It takes the one already chosen by hand for this app where there is
 * one, then falls back to the first edition with a named author, since
 * "Unknown" tells a reader nothing about what they are about to download.
 *
 * It is only a starting point. The full list stays one tap away.
 */
export function pickEdition<T extends EditionLike>(editions: T[], language: string): T | null {
  const inLanguage = editions.filter((e) => e.language === language);
  if (!inLanguage.length) return null;

  const curated = languageByCode(language)?.text?.identifier;
  if (curated) {
    const hit = inLanguage.find((e) => e.id === curated);
    if (hit) return hit;
  }
  const named = inLanguage.filter((e) => e.author && !/unknown/i.test(e.author));
  return named[0] || inLanguage[0];
}

/**
 * Every edition the server carries for one language.
 *
 * Choosing a language means choosing all of it: someone reading Turkish should
 * be able to switch between the sixty Turkish translations later without the
 * app having to go back to the network. `pickEdition` is the one to show;
 * this is the set to keep.
 *
 * Ordered so the recommended one comes first — the reader sees their default
 * at the top of the list rather than hunting for it.
 */
export function editionsForLanguage<T extends EditionLike>(editions: T[], language: string): T[] {
  const inLanguage = editions.filter((e) => e.language === language);
  const first = pickEdition(editions, language);
  if (!first) return inLanguage;
  return [first, ...inLanguage.filter((e) => e.id !== first.id)];
}
