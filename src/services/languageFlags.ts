/**
 * Language codes, and the flag that stands for each one.
 *
 * A flag emoji is a pair of regional indicator symbols built from an ISO 3166-1
 * alpha-2 country code, so a language needs a country before it can have a
 * flag. That mapping is a judgement, not a fact, and these are the judgements
 * made here:
 *
 *   English is the Stars and Stripes rather than the Union flag, because the
 *   app's default translation is American.
 *
 *   Arabic is Saudi, because the Uthmani text the reader prints follows the
 *   Mushaf printed there.
 *
 *   A language spoken in one place takes that place - Icelandic is Iceland,
 *   Dhivehi is the Maldives. A language spread across a region takes where most
 *   of its speakers live, or where it is official: Swahili is Kenya, Hausa is
 *   Nigeria, Tamil is India rather than Sri Lanka.
 *
 *   A language with no country takes the one it is written in. Latin is the
 *   Vatican. Esperanto has none at all, and gets a white flag rather than a
 *   wrong one - a flag that claims a country is worse than a flag that says
 *   nothing.
 *
 * Some platforms will not draw these. Windows has never rendered regional
 * indicator pairs, and shows "TR" instead of the Turkish flag. That is a known
 * cost of the approach, and it is accepted: the same list drives a text label
 * next to every flag, so the row still reads on a machine that shows none.
 */

/** Language code -> ISO 3166-1 alpha-2, or '' where no country fits. */
const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  /* widely used */
  ar: 'SA', en: 'US', ur: 'PK', tr: 'TR', fa: 'IR', ru: 'RU', bn: 'BD',
  zh: 'CN', es: 'ES', fr: 'FR', id: 'ID', de: 'DE', hi: 'IN', ms: 'MY',
  pt: 'PT', it: 'IT', nl: 'NL', sw: 'KE', so: 'SO', ha: 'NG', yo: 'NG',
  /* south asia */
  ta: 'IN', te: 'IN', ml: 'IN', kn: 'IN', mr: 'IN', gu: 'IN', pa: 'IN',
  as: 'IN', si: 'LK', dv: 'MV', ne: 'NP', ps: 'AF', ku: 'IQ', sd: 'PK',
  /* central asia, caucasus, russia */
  uz: 'UZ', kk: 'KZ', ky: 'KG', tg: 'TJ', az: 'AZ', tt: 'RU', ba: 'RU',
  ce: 'RU', uk: 'UA',
  /* south-east asia */
  th: 'TH', vi: 'VN', km: 'KH', my: 'MM', tl: 'PH', ilp: 'PH', mrn: 'PH',
  jav: 'ID', ace: 'ID', knx: 'MY', ug: 'CN',
  /* europe */
  sq: 'AL', bs: 'BA', hr: 'HR', sr: 'RS', mkd: 'MK', bg: 'BG', cs: 'CZ',
  sk: 'SK', pl: 'PL', ro: 'RO', hu: 'HU', da: 'DK', fi: 'FI', sv: 'SE',
  no: 'NO', he: 'IL', mlt: 'MT', cat: 'ES', la: 'VA',
  /* africa */
  am: 'ET', om: 'ET', aar: 'DJ', bm: 'ML', ful: 'SN', rw: 'RW', run: 'BI',
  lin: 'CD', nya: 'MW', sna: 'ZW', sot: 'LS', xh: 'ZA', zu: 'ZA',
  af: 'ZA', tw: 'GH', dag: 'GH', ber: 'MA', luy: 'KE',
  /* east asia */
  ja: 'JP', ko: 'KR',
  /* constructed and unplaced */
  eo: '', qco: 'PG', yuw: 'PG',
};

/**
 * The English name for every code the Worker serves.
 *
 * The Worker sends `languageName` on each edition, but it is lower-case and
 * arrives per edition rather than per language, so the language list would
 * depend on whichever edition happened to be read first. Keeping the names
 * here makes the list stable and lets it be shown before any catalog loads.
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  ar: 'Arabic', en: 'English', ur: 'Urdu', tr: 'Turkish', fa: 'Persian',
  ru: 'Russian', bn: 'Bengali', zh: 'Chinese', es: 'Spanish', fr: 'French',
  bs: 'Bosnian', id: 'Indonesian', sq: 'Albanian', de: 'German', tg: 'Tajik',
  hi: 'Hindi', th: 'Thai', az: 'Azerbaijani', ml: 'Malayalam', si: 'Sinhala',
  cs: 'Czech', kk: 'Kazakh', ro: 'Romanian', ta: 'Tamil', vi: 'Vietnamese',
  as: 'Assamese', ja: 'Japanese', ku: 'Kurdish', pt: 'Portuguese',
  te: 'Telugu', uz: 'Uzbek', my: 'Burmese', gu: 'Gujarati', ha: 'Hausa',
  it: 'Italian', ko: 'Korean', ky: 'Kyrgyz', mkd: 'Macedonian', ne: 'Nepali',
  uk: 'Ukrainian', am: 'Amharic', bm: 'Bambara', bg: 'Bulgarian',
  nl: 'Dutch', kn: 'Kannada', km: 'Khmer', mr: 'Marathi', ps: 'Pashto',
  pa: 'Punjabi', tl: 'Tagalog', ug: 'Uyghur', yo: 'Yoruba', ber: 'Amazigh',
  cat: 'Catalan', nya: 'Chichewa', hr: 'Croatian', da: 'Danish',
  dv: 'Divehi', fi: 'Finnish', ful: 'Fulah', he: 'Hebrew', hu: 'Hungarian',
  rw: 'Kinyarwanda', mlt: 'Maltese', no: 'Norwegian', pl: 'Polish',
  sr: 'Serbian', so: 'Somali', sw: 'Swahili', sv: 'Swedish', ace: 'Achinese',
  aar: 'Afar', af: 'Afrikaans', ba: 'Bashkir', ce: 'Chechen',
  dag: 'Dagbani', eo: 'Esperanto', ilp: 'Iranun', jav: 'Javanese',
  knx: 'Kendayan', la: 'Latin', lin: 'Lingala', luy: 'Luyia', ms: 'Malay',
  mrn: 'Maranao', om: 'Oromo', run: 'Rundi', sna: 'Shona', sd: 'Sindhi',
  sk: 'Slovak', sot: 'Sotho', tt: 'Tatar', tw: 'Twi', xh: 'Xhosa',
  yuw: 'Yau', qco: 'Yau', zu: 'Zulu',
};

/** A white flag, for a language that belongs to no country. */
const NO_COUNTRY_FLAG = '\u{1F3F3}\u{FE0F}';

/**
 * The flag for a language code, as an emoji string.
 *
 * Unknown codes fall back to the white flag rather than to a wrong country,
 * for the reason given at the top of this file.
 */
export function languageFlag(code: string): string {
  const country = LANGUAGE_TO_COUNTRY[(code || '').toLowerCase().trim()];
  if (!country) return NO_COUNTRY_FLAG;
  /* Regional indicator symbols sit at U+1F1E6 for 'A'. */
  return String.fromCodePoint(...[...country.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** The readable name, falling back to the code itself. */
export function languageLabel(code: string): string {
  const key = (code || '').toLowerCase().trim();
  return LANGUAGE_NAMES[key] || key.toUpperCase() || 'Other';
}

/** True when we actually know a country for this code. */
export function hasLanguageFlag(code: string): boolean {
  return !!LANGUAGE_TO_COUNTRY[(code || '').toLowerCase().trim()];
}

export type LanguageEntry = { code: string; label: string; flag: string; count: number };

/**
 * The languages present in a set of editions, most-used first.
 *
 * Sorted by how many editions each language has, because a list of 97
 * languages is only useful if the ones someone is likely to want are at the
 * top. Ties break on the name so the order never shuffles between runs.
 */
export function languagesOf(
  editions: Array<{ language?: string }>,
  options: { servableOnly?: boolean; isServable?: (edition: any) => boolean } = {},
): LanguageEntry[] {
  const counts = new Map<string, number>();
  for (const edition of editions) {
    if (options.servableOnly && options.isServable && !options.isServable(edition)) continue;
    const code = (edition.language || '').toLowerCase().trim();
    if (!code) continue;
    counts.set(code, (counts.get(code) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([code, count]) => ({ code, label: languageLabel(code), flag: languageFlag(code), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
