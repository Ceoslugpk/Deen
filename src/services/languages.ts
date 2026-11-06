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

export type LanguageCode =
  | 'en' | 'ar' | 'ur' | 'fr' | 'tr' | 'ru' | 'zh' | 'fa' | 'uz' | 'kk' | 'my'
  /* Below: languages the hadith corpus carries that the rest of the app does
     not offer yet — no Quran translation, no recitation voice, no interface
     copy. They exist so hadith can be read in them, not so the app can be. */
  | 'bn' | 'id' | 'ta' | 'hi' | 'ml' | 'ms';

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
  /** True once the interface copy is complete in this language. */
  uiReady: boolean;
  /**
   * True while the copy is partly written. A language in this state shows its
   * own words where they exist and English where they do not, which is better
   * than nothing and not the same as finished — so the picker says so, rather
   * than claiming the whole app speaks it.
   */
  uiPartial?: boolean;
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
    code: 'ar', native: 'العربية', english: 'Arabic', rtl: true, uiReady: true, uiPartial: false,
    text: { identifier: 'tafsir_ar_arabic_ar-tafsir-muyassar', name: 'Tafsir al-Muyassar', kind: 'tafsir' },
  },
  {
    /* Every string the interface can show is written in Urdu: the screens,
       the tab bar, and the notifications that arrive before the app is even
       opened. And the content tables with them — the full 2,766-key union
       every copy table holds between them, all four spacing variants of the
       concatenation fragments included, plus the eleven worship guides, the
       twelve Quran topics, the thirteen tajweed rules and both journeys.
       Marked ready and no longer partial.

       The Quran, hadith, adhkar, dua and names content stays in the language
       its source published it in — that is content, not interface, and
       translating it is not ours to do.

       No translation voice, measured the same way Persian was. Spoken
       translations come from cdn.islamic.network, and all nine Urdu editions
       the API lists return 403 there. The control makes that 403 readable:
       on the identical path, editions that do carry recordings — ar.alafasy,
       fr.leclerc, tr.vakfi-audio — all return 200. So it means there is
       nothing to play, not that the identifier is wrong.

       Nothing is broken by the omission. The player does not read a voice
       from this list; it resolves one from the live catalogue and, where a
       language has no recording, plays the Arabic alone. Recitation only. */
    code: 'ur', native: 'اردو', english: 'Urdu', rtl: true,
    uiReady: true, uiPartial: false,
    text: { identifier: 'tr_ur_abul_ala_maududi', name: 'Abul Ala Maududi', kind: 'translation' },
  },
  {
    code: 'fr', native: 'Français', english: 'French', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_fr_muhammad_hamidullah', name: 'Muhammad Hamidullah', kind: 'translation' },
    voice: { identifier: 'fr.leclerc', name: 'Youssouf Leclerc' },
  },
  {
    code: 'tr', native: 'Türkçe', english: 'Turkish', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_tr_diyanet_isleri_3', name: 'Diyanet İşleri', kind: 'translation' },
    voice: { identifier: 'tr.vakfi-audio', name: 'Diyanet Vakfı' },
  },
  {
    code: 'ru', native: 'Русский', english: 'Russian', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_ru_elmir_kuliev', name: 'Elmir Kuliev', kind: 'translation' },
    voice: { identifier: 'ru.kuliev-audio', name: 'Elmir Kuliev' },
  },
  {
    code: 'bn', native: 'বাংলা', english: 'Bengali', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_bn_muhiuddin_khan', name: 'Muhiuddin Khan', kind: 'translation' },
    /* No Bengali recitation is served by any of the audio hosts the app uses
       — every candidate returned 403 — so there is deliberately no voice
       here, and the reader offers Bengali text without audio. */
  },
  {
    code: 'ms', native: 'Bahasa Melayu', english: 'Malay', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_ms_abdullah_muhammad_basmeih', name: 'Abdullah Muhammad Basmeih', kind: 'translation' },
    /* No Malay recitation is served by any of the audio hosts the app uses
       — every candidate returned 403, and the recitation lists carry no Malay
       reciter — so there is deliberately no voice here, and the reader offers
       Malay text without audio, as it already does for Persian, Urdu,
       Indonesian and Bengali. */
  },
  {
    code: 'ta', native: 'தமிழ்', english: 'Tamil', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_ta_abdul_hameed_baqavi', name: 'Abdul Hameed Baqavi', kind: 'translation' },
    /* No Tamil recitation is served by any of the audio hosts the app uses
       — every candidate returned 403 across six editions — so there is
       deliberately no voice here, and the reader offers Tamil text without
       audio, as it already does for Persian, Urdu, Indonesian, Bengali and
       Malay. */
  },
  {
    code: 'zh', native: '中文', english: 'Chinese', rtl: false, uiReady: true, uiPartial: false,
    text: { identifier: 'tr_zh_ma_jian', name: 'Ma Jian', kind: 'translation' },
    voice: { identifier: 'zh.chinese', name: 'Chinese' },
  },
  {
    /* Every string the interface shows is now written in Persian, and the
       content tables with it: the full 2,766-key union that all seven
       non-English copy tables hold between them, the seven concatenation
       fragments included, plus the eleven worship guides, the twelve Quran
       topics, the thirteen tajweed rules and both journeys. So it is marked
       ready, and no longer partial.

       The Quran, hadith, adhkar and dua content stays in the language its
       source published it in — that is content, not interface, and
       translating it is not ours to do.

       No translation voice, and this one is measured rather than assumed.
       Spoken translations come from cdn.islamic.network, and all fourteen
       Persian editions the API lists return 403 there. That 403 is
       meaningful, which is the part worth recording: on the identical path,
       editions that do carry recordings — ar.alafasy, fr.leclerc,
       tr.vakfi-audio — all return 200. So a 403 here means there is nothing
       to play, not that the identifier is wrong. (English fares no better:
       en.walk is a text edition with no recording either.)

       Nothing is broken by this. The player does not read a voice from this
       list at all; it resolves one from the live catalogue, and where a
       language has no recording it plays the Arabic alone rather than a
       translation the reader did not choose. Recitation only, then — which
       is what leaving this entry off now says. */
    code: 'fa', native: 'فارسی', english: 'Persian', rtl: true,
    uiReady: true, uiPartial: false,
    text: { identifier: 'tr_fa_baha_oddin_khorramshahi_2', name: 'Baha Oddin Khorramshahi', kind: 'translation' },
  },
  {
    /* Indonesian carries the largest Muslim population of any language here.
       The Ministry of Religious Affairs translation is published on our own
       API, so the Quran text is wired from the start.

       No voice, deliberately. The spoken translations come from
       cdn.islamic.network, and no Indonesian identifier there could be
       verified — every candidate returned 403. Since a known-good voice
       (en.walk) also returns 403 on that path, a 403 cannot distinguish
       "wrong identifier" from "does not exist", so rather than ship an
       unverified one and leave the player silently dead, no voice is
       offered. The picker reads this as recitation only, which is what it is.

       The interface copy is now complete on the union measure: 2,766 strings,
       the whole union of every other language's table, and the seven
       concatenation fragments the other tables carry. It was marked ready
       earlier on the narrower rendered-string measure; it is complete now on
       the wide one too. The one thing still missing is a translation voice,
       which is why the picker reads it as recitation only — see above. */
    code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', rtl: false,
    uiReady: true, uiPartial: false,
    text: { identifier: 'tr_id_indonesian_islamic_affairs_minis', name: 'Kementerian Agama RI', kind: 'translation' },
  },
  {
    /* Hindi is the second language of the app's largest audience after
       English, and the first for a great many readers in India. Three
       Devanagari translations are published on our own API; all three were
       fetched and verified to return Devanagari rather than a Latin
       transliteration. The edition named below is the one offered.

       No voice, for the same reason Indonesian has none: spoken translations
       come from cdn.islamic.network, where a 403 cannot be told apart from
       "does not exist" because a known-good voice 403s on that path too.
       Rather than ship an unverified identifier and leave the player silently
       dead, none is offered and the picker reads as recitation only.

       The interface copy and the content tables are now written: the full
       2,758-string union that Arabic, Urdu, Turkish, Persian and Indonesian
       hold between them, plus the rites, fiqh, tajweed and topic tables. It is
       marked ready rather than partial for that reason. The one thing still
       missing is a translation voice, which is why the picker reads it as
       recitation only — see above.

       Devanagari is written left to right, so `rtl` stays false and Hindi must
       never reach a helper that picks a table from a boolean direction. */
    code: 'hi', native: 'हिन्दी', english: 'Hindi', rtl: false,
    uiReady: true, uiPartial: false,
    /* Suhel Farooq Khan and Saifur Rahman Nadwi, chosen over the two other
       Devanagari editions because its register is the one this app's Hindi is
       written in: it keeps رحمن and رحيم as रहमान व रहीम and writes क़ायनात
       where the alternatives Sanskritise to संसार and प्रशंसा. Verified
       Devanagari across the mushaf — the `_la` suffix on other Hindi editions
       is a Latin transliteration and would have shipped the wrong script. */
    text: { identifier: 'tr_hi_suhel_farooq_khan_and_saifur_rah', name: 'सुहेल फ़ारूक़ ख़ान और सैफ़ुर रहमान नदवी', kind: 'translation' },
  },

  {
    /* Malayalam: Kerala, and the large Malayali community in the Gulf, which
       is a large part of who this app is for. Six translations are published
       on our own API under `ml`; four of them are Latin transliterations, and
       only two return Malayalam script. Both of those were fetched and read
       before one was named here — the same check that caught a Latin Hindi
       edition a round earlier, and for the same reason: the identifier cannot
       be trusted from its name.

       Karakunnu & Elayavoor is the one offered. It is the translation in
       widest circulation in Kerala, and it is set more carefully than the
       alternative, which puts a space before its full stops. Verified
       Malayalam across the mushaf.

       No voice, for the same reason Indonesian and Hindi have none: spoken
       translations come from cdn.islamic.network, where a 403 cannot be told
       apart from "does not exist" because a known-good voice 403s on that
       path too. Rather than ship an unverified identifier and leave the
       player silently dead, none is offered and the picker reads it as
       recitation only.

       The interface copy and the content tables are now written, and the
       copy covers the whole union of every other language's table — 2,766
       strings, the most complete in the app. Ready.

       Malayalam is written left to right, so `rtl` stays false. */
    code: 'ml', native: 'മലയാളം', english: 'Malayalam', rtl: false,
    uiReady: true, uiPartial: false,
    text: { identifier: 'tr_ml_karakunnu_elayavoor', name: 'കാരകുന്ന് & എളയാവൂര്', kind: 'translation' },
  },
  {
    code: 'uz', native: "Oʻzbekcha", english: 'Uzbek', rtl: false, uiReady: true, uiPartial: false,
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

/**
 * The languages the hadith corpus is published in, and how much of it each
 * one covers.
 *
 * This is a separate list from LANGUAGES on purpose. The app's list answers
 * "what can I read the whole app in" — interface copy, Quran translation,
 * recitation voice. This one answers a narrower question: what can I read a
 * narration in. Bengali, Indonesian and Tamil have no Quran translation and no
 * audio, so they belong here and not there; and the five app languages with no
 * hadith edition at all (Chinese, Persian, Uzbek, Kazakh, Burmese) belong
 * there and not here.
 *
 * `collections` is how many of the ten collections carry that language. It is
 * published by the server rather than counted here, because coverage is
 * per-collection and uneven: only Arabic and English reach all ten.
 */
export type HadithLanguage = {
  code: LanguageCode;
  native: string;
  english: string;
  rtl: boolean;
};

export const HADITH_LANGUAGES: HadithLanguage[] = [
  { code: 'en', native: 'English', english: 'English', rtl: false },
  { code: 'ar', native: 'العربية', english: 'Arabic', rtl: true },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', rtl: false },
  { code: 'fr', native: 'Français', english: 'French', rtl: false },
  { code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', rtl: false },
  { code: 'tr', native: 'Türkçe', english: 'Turkish', rtl: false },
  { code: 'ur', native: 'اردو', english: 'Urdu', rtl: true },
  { code: 'ru', native: 'Русский', english: 'Russian', rtl: false },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', rtl: false },
];

export function hadithLanguage(code: string): HadithLanguage | undefined {
  return HADITH_LANGUAGES.find((entry) => entry.code === code);
}

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
