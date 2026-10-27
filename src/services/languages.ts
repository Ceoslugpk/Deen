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

/**
 * Languages with a finished interface. Everything else is offered but reads
 * English until its copy is written.
 */
export const UI_READY: LanguageCode[] = ['en', 'ar'];

export const LANGUAGES: Language[] = [
  {
    code: 'en', native: 'English', english: 'English', rtl: false, uiReady: true,
    text: { identifier: 'en.sahih', name: 'Saheeh International', kind: 'translation' },
    voice: { identifier: 'en.walk', name: 'Ibrahim Walk' },
  },
  {
    code: 'ar', native: 'العربية', english: 'Arabic', rtl: true, uiReady: true,
    text: { identifier: 'ar.muyassar', name: 'Tafsir al-Muyassar', kind: 'tafsir' },
  },
  {
    code: 'ur', native: 'اردو', english: 'Urdu', rtl: true, uiReady: false,
    text: { identifier: 'ur.jalandhry', name: 'Fateh Muhammad Jalandhry', kind: 'translation' },
    voice: { identifier: 'ur.khan', name: 'Shamshad Ali Khan' },
  },
  {
    code: 'fr', native: 'Français', english: 'French', rtl: false, uiReady: false,
    text: { identifier: 'fr.hamidullah', name: 'Muhammad Hamidullah', kind: 'translation' },
    voice: { identifier: 'fr.leclerc', name: 'Youssouf Leclerc' },
  },
  {
    code: 'tr', native: 'Türkçe', english: 'Turkish', rtl: false, uiReady: false,
    text: { identifier: 'tr.diyanet', name: 'Diyanet İşleri', kind: 'translation' },
    voice: { identifier: 'tr.vakfi-audio', name: 'Diyanet Vakfı' },
  },
  {
    code: 'ru', native: 'Русский', english: 'Russian', rtl: false, uiReady: false,
    text: { identifier: 'ru.kuliev', name: 'Elmir Kuliev', kind: 'translation' },
    voice: { identifier: 'ru.kuliev-audio', name: 'Elmir Kuliev' },
  },
  {
    code: 'zh', native: '中文', english: 'Chinese', rtl: false, uiReady: false,
    text: { identifier: 'zh.jian', name: 'Ma Jian', kind: 'translation' },
    voice: { identifier: 'zh.chinese', name: 'Chinese' },
  },
  {
    code: 'fa', native: 'فارسی', english: 'Persian', rtl: true, uiReady: false,
    text: { identifier: 'fa.fooladvand', name: 'Mohammad Mahdi Fooladvand', kind: 'translation' },
    voice: { identifier: 'fa.hedayatfarfooladvand', name: 'Fooladvand (Hedayatfar)' },
  },
  {
    code: 'uz', native: "Oʻzbekcha", english: 'Uzbek', rtl: false, uiReady: false,
    text: { identifier: 'uz.sodik', name: 'Muhammad Sodik Yusuf', kind: 'translation' },
    voice: { identifier: 'uz.sodik-audio', name: 'Muhammad Sodik Yusuf' },
  },
  {
    // Kazakh has an audio translation but no text edition on the API, so the
    // Quran text stays where it is and only the voice follows the choice.
    code: 'kk', native: 'Қазақша', english: 'Kazakh', rtl: false, uiReady: false,
    voice: { identifier: 'kk.khalifahaltai-audio', name: 'Khalifah Altai' },
  },
  {
    code: 'my', native: 'မြန်မာ', english: 'Burmese', rtl: false, uiReady: false,
    text: { identifier: 'my.ghazi', name: 'Ghazi Muhammed Hashim', kind: 'translation' },
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
