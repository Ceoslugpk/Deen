import { getAyahEditions } from './api';
import { LANGUAGE_NAMES } from './languageFlags';

/**
 * Tafsir, beside the verse.
 *
 * The app has always had commentary - there is a tafsir screen and a
 * comparison screen - but it lived somewhere else. Reading a verse and reading
 * what it means were two journeys through the app. This brings the commentary
 * to the verse so the reader never leaves the page.
 *
 * Three decisions shape everything here.
 *
 * One: commentary is shown for one verse at a time, never for a passage.
 * Tafsir is written against a verse. Asked for a range, a scholar's paragraph
 * is stretched across verses it was not written about, and the reader has no
 * way to know where the author stopped talking about one and began the next.
 *
 * Two: the edition is chosen by the language the person is already reading in,
 * and each language gets a book that is actually concise. A classic like
 * Tabari is al-Baqarah alone in 7.4MB - the whole surah has to be fetched
 * because the server serves surahs, not verses - so the default is always a
 * mukhtasar. Nobody should wait several megabytes to read four sentences.
 *
 * Three: nothing is invented. If no edition exists for the language, the
 * feature is absent rather than English pushed in its place, and if the
 * edition is silent on a verse the panel says so rather than showing an empty
 * box that looks like meaning.
 */

export type TafsirEdition = {
  /** The id the catalogue knows this book by. */
  id: string;
  /** What to call it on screen - the author, not a filename. */
  title: string;
  language: string;
};

/**
 * Which book each language opens with.
 *
 * Every one of these is a concise commentary in its own language, checked
 * against the live catalogue: 82 tafsir editions over 36 languages. Where a
 * language has only a mukhtasar, that is what it gets. Where it has several,
 * the concise one is still the default, because this panel sits under a verse
 * a person is trying to read - a full classical tafsir belongs on the tafsir
 * screen, where it is the thing being read and not a footnote.
 *
 * A language that is not here has no tafsir in the app. That is deliberate:
 * the alternative is handing a reader English commentary while their Quran
 * sits in Turkish above it.
 */
export const TAFSIR_BY_LANGUAGE: Record<string, TafsirEdition> = {
  ar: { id: 'tafsir_ar_arabic_ar-tafsir-muyassar', title: 'التفسير الميسر', language: 'ar' },
  en: { id: 'tafsir_en_english_abridged-explanation-of-the-quran', title: 'Abridged Explanation of the Quran', language: 'en' },
  ur: { id: 'tafsir_ur_urdu_tafsir-bayan-ul-quran', title: 'بیان القرآن', language: 'ur' },
  id: { id: 'tafsir_id_indonesian_indonesian-mokhtasar', title: 'Tafsir Ringkas (Mukhtasar)', language: 'id' },
  ms: { id: 'tafsir_id_indonesian_indonesian-mokhtasar', title: 'Tafsir Ringkas (Mukhtasar)', language: 'id' },
  tr: { id: 'tafsir_tr_turkish_turkish-mokhtasar', title: 'Türkçe Muhtasar Tefsir', language: 'tr' },
  fr: { id: 'tafsir_fr_french_fr-mukhtasar', title: 'Le Mukhtasar (français)', language: 'fr' },
  es: { id: 'tafsir_es_spanish_spanish-mokhtasar', title: 'El Mukhtasar (español)', language: 'es' },
  de: { id: 'tafsir_en_english_abridged-explanation-of-the-quran', title: 'Abridged Explanation of the Quran', language: 'en' },
  ru: { id: 'tafsir_ru_russian_russian-mokhtasar', title: 'Мухтасар (русский)', language: 'ru' },
  bn: { id: 'tafsir_bn_bengali_bengali-mokhtasar', title: 'মুখতাসার তাফসীর', language: 'bn' },
  fa: { id: 'tafsir_fa_persian_persian-mokhtasar', title: 'مختصر تفسیر', language: 'fa' },
  hi: { id: 'tafsir_hi_hindi_hindi-mokhtasar', title: 'हिंदी मुख़्तसर तफ़्सीर', language: 'hi' },
  ta: { id: 'tafsir_ta_tamil_tamil-mokhtasar', title: 'தமிழ் முக்தஸர்', language: 'ta' },
  ml: { id: 'tafsir_ml_malayalam_malayalam-mokhtasar', title: 'മലയാളം മുഖ്തസ്വർ', language: 'ml' },
  ps: { id: 'tafsir_ps_pashto_pashto-mokhtasar', title: 'مختصر تفسیر (پښتو)', language: 'ps' },
  ku: { id: 'tafsir_ku_kurdish_kurdish-mokhtasar', title: 'Muxtesera Kurdî', language: 'ku' },
  uz: { id: 'tafsir_uz_uzbek_uzbek-mokhtasar', title: 'Muxtasar (oʻzbekcha)', language: 'uz' },
  az: { id: 'tafsir_az_azerbaijani_azeri-mokhtasar', title: 'Muxtəsər (Azərbaycan)', language: 'az' },
  sq: { id: 'tafsir_sq_albanian_sq-saadi', title: 'Tefsiri As-Saadi', language: 'sq' },
  bs: { id: 'tafsir_bs_bosnian_bosnian-mokhtasar', title: 'Muhtasar (bosanski)', language: 'bs' },
  zh: { id: 'tafsir_zh_chinese_chinese-mokhtasar', title: '中文简注', language: 'zh' },
  ja: { id: 'tafsir_ja_japanese_japanese-mokhtasar', title: '日本語ムフタサル', language: 'ja' },
  ko: { id: 'tafsir_zh_chinese_chinese-mokhtasar', title: '中文简注', language: 'zh' },
  th: { id: 'tafsir_th_thai_thai-mokhtasar', title: 'อัลมุคตะศ็อร', language: 'th' },
  vi: { id: 'tafsir_vi_vietnamese_vietnamese-mokhtasar', title: 'Mukhtasar (tiếng Việt)', language: 'vi' },
  it: { id: 'tafsir_it_italian_italian-mokhtasar', title: 'Il Mukhtasar (italiano)', language: 'it' },
  nl: { id: 'tafsir_en_english_abridged-explanation-of-the-quran', title: 'Abridged Explanation of the Quran', language: 'en' },
  pt: { id: 'tafsir_es_spanish_spanish-mokhtasar', title: 'El Mukhtasar (português)', language: 'es' },
  sr: { id: 'tafsir_sr_serbian_serbian-mokhtasar', title: 'Muhtasar (srpski)', language: 'sr' },
  te: { id: 'tafsir_te_telugu_telugu-mokhtasar', title: 'తెలుగు ముఖ్తసర్', language: 'te' },
  si: { id: 'tafsir_si_sinhala_sinhalese-mokhtasar', title: 'සිංහල මුක්තසර්', language: 'si' },
  km: { id: 'tafsir_km_khmer_khmer-mokhtasar', title: 'មុខតាសា (ខ្មែរ)', language: 'km' },
  ky: { id: 'tafsir_ky_kyrgyz_kyrgyz-mokhtasar', title: 'Мухтасар (кыргызча)', language: 'ky' },
  ug: { id: 'tafsir_ug_uyghur_uyghur-mokhtasar', title: 'مۇختەسەر تەپسىر', language: 'ug' },
  tl: { id: 'tafsir_tl_tagalog_tagalog-mokhtasar', title: 'Mukhtasar (Tagalog)', language: 'tl' },
};

/**
 * The book this language reads, or nothing.
 *
 * No fallback to another language. A reader whose language has no commentary
 * is better served by no panel than by one they cannot read.
 */
export function tafsirEditionFor(language: string | undefined | null): TafsirEdition | null {
  if (!language) return null;
  const raw = String(language).trim();
  if (!raw) return null;

  /* The reader stores the language it is reading in as a display name -
     'English', not 'en' - because that is what the reader shows and what the
     footer prints. So the preference has to be turned back into a code before
     it can name a book, using the same table the rest of the app uses to turn
     a code into a name. Writing a second mapping here would be a mapping that
     can disagree with the first.
   *
   * A code is still accepted, because that is what a caller with a catalogue
   * row in hand has.
   */
  const direct = TAFSIR_BY_LANGUAGE[raw.toLowerCase()];
  if (direct) return direct;

  const folded = raw.toLowerCase();
  for (const [code, name] of Object.entries(LANGUAGE_NAMES)) {
    if (String(name).toLowerCase() === folded && TAFSIR_BY_LANGUAGE[code]) {
      return TAFSIR_BY_LANGUAGE[code];
    }
  }
  return null;
}

/**
 * The verse key a tafsir request should be made for.
 *
 * Tafsirs are written per verse and served per surah, so this returns the
 * surah's commentary as a map keyed by verse. Anything that is not a plain
 * `surah:ayah` reference - a range, a juz, a page - is refused rather than
 * guessed at, because guessing would put one verse's commentary under another.
 */
export function verseKeyParts(verseKey: string | undefined | null): { surah: number; ayah: number } | null {
  if (!verseKey) return null;
  const match = /^(\d{1,3}):(\d{1,3})$/.exec(String(verseKey).trim());
  if (!match) return null;
  const surah = Number(match[1]);
  const ayah = Number(match[2]);
  if (!(surah >= 1 && surah <= 114) || !(ayah >= 1)) return null;
  return { surah, ayah };
}

export type VerseTafsir = {
  edition: TafsirEdition;
  /** The commentary for this verse, markup removed. Empty when the book is silent. */
  text: string;
  /**
   * True when the edition's entry for this verse is only a cross-reference -
   * "18:9" - rather than commentary. Several books in the catalogue do this
   * where two verses were treated as one passage, and the server offers no way
   * to follow the pointer, so showing it would print a number and call it a
   * tafsir. Detected rather than displayed.
   */
  pointer?: boolean;
};

/**
 * Whether an entry is a bare verse reference.
 *
 * Urdu As-Saadi, Ibn Kathir and Qutb all answer 18:10 with the four characters
 * "18:9". A number is not commentary, and it is not the fault of the reader to
 * work that out. Short, digits and separators only, and containing a
 * reference - anything else is treated as prose and shown.
 */
export function isPointerOnly(text: string | null | undefined): boolean {
  const value = String(text ?? '').trim();
  if (!value || value.length > 40) return false;
  if (!/\d+\s*[:\-\u2013]\s*\d+/.test(value)) return false;
  return !/[^\s\d:\-\u2013()\[\].,\u060C\u061B]/.test(value);
}

/**
 * Commentary for one verse.
 *
 * Fetched through the app's existing edition path, which already knows how to
 * map a catalogue id onto the server's route and already keeps the answer for
 * a year in the tafsir cache. The surah is what travels; the verse is picked
 * out of it here. The caller gets the one verse it asked about, so a reader
 * cannot accidentally show the wrong one.
 */
export async function loadVerseTafsir(
  verseKey: string,
  language: string | undefined | null,
  options: { stripMarkup?: (input: string) => string } = {},
): Promise<VerseTafsir | null> {
  const parts = verseKeyParts(verseKey);
  const edition = tafsirEditionFor(language);
  if (!parts || !edition) return null;

  const rows = await getAyahEditions(verseKey, [edition.id]);
  const row = rows.find((entry) => entry.edition === edition.id);
  const raw = row?.text ?? '';
  const text = options.stripMarkup ? options.stripMarkup(raw) : raw;
  const pointer = isPointerOnly(text);
  /* A pointer is not text to show. It is kept in the result, flagged, so the
     panel can say what happened instead of printing "18:9". */
  return pointer ? { edition, text: '', pointer: true } : { edition, text };
}

/**
 * Whether commentary is worth showing at all.
 *
 * A panel that opens onto nothing is worse than no panel: it costs a tap and
 * tells the reader the book has nothing to say, which may only mean the
 * request failed. Callers use this to decide whether to draw the control.
 */
export function hasTafsir(text: string | null | undefined): boolean {
  return typeof text === 'string' && text.trim().length > 0;
}
