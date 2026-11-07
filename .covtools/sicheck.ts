import { QURAN_TOPICS, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from '../src/content/quranStudy';
import { WORSHIP_GUIDES, localizeGuide } from '../src/content/worshipGuides';
import { JOURNEY_STEPS, journeyMeta, localizeJourneyStep } from '../src/services/journeyService';
import { SURAH_NAMES_SI } from '../src/content/surahNames';
import { tx, prayerName } from '../src/services/arabicCopy';
import { SI } from '../src/services/sinhalaCopy';

const LANG = 'si';

/**
 * Does this string carry Sinhala at all?
 *
 * The test is the script itself, and it is a sufficient one here: Sinhala is
 * U+0D80-U+0DFF, and no other language this app ships touches that block.
 * Translation is not optional in the way it can be for a Latin script — a
 * Sinhala screen that has fallen back is a screen with no Sinhala in it, so
 * the absence of the block is the whole answer.
 */
const SINHALA_LETTERS = /[\u0D80-\u0DFF]/;
const isSi = (s: string) => SINHALA_LETTERS.test(s || '');

/**
 * Strings that genuinely stay as they are in a Sinhala interface: Arabic and
 * transliterated formulas, product and place names a reader has to recognise
 * on a label or a form, bare numbers and units, and single-word loan terms
 * Sri Lankan Muslims use unchanged.
 */
const SAME_IN_SINHALA = [
  'قطب جد',
  'Labbayka', 'Allahu akbar', 'Nawaytu', 'Bismillah',
  'Nusuk', 'WhatsApp', 'MP3Quran', 'Islamic.app', 'Islamic Network',
  'api.islamicdata.uz', 'cdn.islamic.network', 'audio.islamicdata.uz', 'misc.islamicdata.uz',
  'Face ID', 'Android', 'iOS', 'YouTube', 'PIN',
];

/**
 * English function words that would survive in a real untranslated sentence.
 * Their presence in a string that also failed the Sinhala-letter test is what
 * marks it as a fallback rather than as short Sinhala that happens to be
 * written without a vowel sign.
 */
const ENGLISH_MARKERS = /\b(the|of|and|for|with|from|that|this|your|you|it|is|are|on|in|to|a|an|before|after|until|while|been|have|has|not|or|by|as|at)\b/i;

let fallbacks: string[] = [];

/**
 * `label` names the string, `got` is what the Sinhala interface renders, and
 * `eng` is what the same call renders in English. A string is a fallback when
 * the two are the same: that is the only case the reader sees English.
 */
const check = (label: string, got: string, eng: string) => {
  if (!got) return;
  if (isSi(got)) return;
  if (SAME_IN_SINHALA.some((f) => got.includes(f))) return;
  // A bare number, unit or symbol has nothing to translate.
  if (/^[\s\d.,:%·+\-—–/()#×°'"“”“]*$/.test(got)) return;
  // Short strings with no English function word are plausible Sinhala.
  if (got.split(/\s+/).length <= 3 && !ENGLISH_MARKERS.test(got)) return;
  // Still identical to English — this is what the reader would notice.
  if (got === eng) { fallbacks.push(`${label}: ${JSON.stringify(got)}`); return; }
  // Translated, but no diacritic anywhere: report it separately, not as a gap.
  if (ENGLISH_MARKERS.test(got)) fallbacks.push(`${label} (suspect English): ${JSON.stringify(got)}`);
};

console.log('Sinhala copy entries:', Object.keys(SI).length);

console.log('\n--- Quran topics ---');
for (const t of QURAN_TOPICS) {
  const EN = 'zz' as any;
  check(`topic "${t.id}" title`, topicTitle(t, LANG), topicTitle(t, EN));
  check(`topic "${t.id}" desc`, topicDescription(t, LANG), topicDescription(t, EN));
  check(`topic "${t.id}" cat`, topicCategory(t, LANG), topicCategory(t, EN));
}
console.log(`${QURAN_TOPICS.length} topics, ${fallbacks.length} fallbacks so far`);

console.log('\n--- Tajweed rules ---');
let n0 = fallbacks.length;
for (const r of TAJWEED_RULES) {
  const EN = 'zz' as any;
  check(`tajweed "${r.codes.join(',')}" name`, tajweedName(r, LANG), tajweedName(r, EN));
  check(`tajweed "${r.codes.join(',')}" detail`, tajweedDetail(r, LANG), tajweedDetail(r, EN));
}
console.log(`${TAJWEED_RULES.length} rules, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Worship guides ---');
n0 = fallbacks.length;
let steps = 0;
for (const g of WORSHIP_GUIDES) {
  const lg = localizeGuide(g, LANG) as any;
  const ge = localizeGuide(g, 'zz' as any) as any;
  check(`guide ${g.id} title`, lg.title, ge.title);
  check(`guide ${g.id} summary`, lg.summary ?? lg.subtitle, ge.summary ?? ge.subtitle);
  const bs = lg.steps || [];
  const es = ge.steps || [];
  for (let i = 0; i < bs.length; i++) {
    steps++;
    check(`guide ${g.id} step ${bs[i].title}`, bs[i].title, es[i]?.title ?? '');
    check(`guide ${g.id} step detail`, bs[i].detail, es[i]?.detail ?? '');
  }
}
console.log(`${WORSHIP_GUIDES.length} guides / ${steps} steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Journeys ---');
n0 = fallbacks.length;
for (const kind of ['umrah', 'hajj'] as const) {
  const meta = journeyMeta(kind as any, LANG);
  const metaEn = journeyMeta(kind as any, 'zz' as any);
  check(`journeyMeta ${kind} intro`, (meta as any)?.intro, (metaEn as any)?.intro);
  for (const st of JOURNEY_STEPS[kind]) {
    const ls = localizeJourneyStep(st, LANG) as any;
    const le = localizeJourneyStep(st, 'zz' as any) as any;
    check(`step ${st.id} title`, ls.title, le.title);
    check(`step ${st.id} short`, ls.short, le.short);
    check(`step ${st.id} detail`, ls.detail, le.detail);
    if (ls.counterLabel) check(`step ${st.id} counter`, ls.counterLabel, le.counterLabel ?? '');
  }
}
console.log(`${JOURNEY_STEPS.umrah.length} umrah + ${JOURNEY_STEPS.hajj.length} hajj steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Surah names ---');
n0 = fallbacks.length;
const sn = Object.keys(SURAH_NAMES_SI).length;
console.log(`${sn} surah names present`);
if (sn !== 114) fallbacks.push(`surah names: expected 114, got ${sn}`);
console.log(` 1=${SURAH_NAMES_SI[1]}  2=${SURAH_NAMES_SI[2]}  112=${SURAH_NAMES_SI[112]}  114=${SURAH_NAMES_SI[114]}`);

console.log('\n--- Prayer names ---');
console.log(' ', ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => prayerName(LANG, p)).join(' · '));

console.log('\n--- Copy table round-trip ---');
n0 = fallbacks.length;
let looked = 0, identical = 0;
for (const k of Object.keys(SI)) {
  looked++;
  const got = tx(LANG, k);
  if (got === k) { identical++; continue; }
  if (got !== SI[k]) fallbacks.push(`tx mismatch for ${JSON.stringify(k.slice(0, 60))}`);
}
console.log(`${looked} keys looked up, ${identical} returned the English source, ${fallbacks.length - n0} mismatches`);

console.log('\n--- Sample render (umrah step 1) ---');
const s1 = localizeJourneyStep(JOURNEY_STEPS.umrah[0], LANG) as any;
console.log(' title :', s1.title);
console.log(' short :', s1.short);
console.log(' detail:', s1.detail.slice(0, 160) + '…');

console.log('\n--- Sample render (tajweed 1) ---');
console.log(' ', tajweedName(TAJWEED_RULES[0], LANG), '—', tajweedDetail(TAJWEED_RULES[0], LANG).slice(0, 90) + '…');

console.log('\n--- Sample render (worship guide 1) ---');
const g1 = localizeGuide(WORSHIP_GUIDES[0], LANG) as any;
console.log(' ', g1.title, '—', String(g1.summary ?? g1.subtitle).slice(0, 90) + '…');

console.log('\n--- Sample copy ---');
console.log(' ', JSON.stringify(tx(LANG, 'Days owed')));
console.log(' ', JSON.stringify(tx(LANG, 'Prayer times, Qibla and fasting times read from one place. Tap to choose a city or enter coordinates.').slice(0, 120)));

console.log('\n=== TOTAL FALLBACKS:', fallbacks.length, '===');
if (fallbacks.length) console.log(fallbacks.slice(0, 40).join('\n'));
