import { QURAN_TOPICS, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from '../src/content/quranStudy';
import { WORSHIP_GUIDES, localizeGuide } from '../src/content/worshipGuides';
import { JOURNEY_STEPS, journeyMeta, localizeJourneyStep } from '../src/services/journeyService';
import { SURAH_NAMES_AZ } from '../src/content/surahNames';
import { tx, prayerName } from '../src/services/arabicCopy';
import { AZ } from '../src/services/azCopy';

const LANG = 'az';

/**
 * A string counts as Azerbaijani if it carries a letter only Azerbaijani uses.
 * Azerbaijani is written in Latin script, so "is it Cyrillic" has no analogue
 * here — the test has to be the letters of its own alphabet instead.
 */
const AZERBAIJANI_LETTERS = /[əıöüşçğıƏİÖÜŞÇĞ]/;
const isAz = (s: string) => AZERBAIJANI_LETTERS.test(s || '');

/**
 * Strings that are deliberately not Azerbaijani: Arabic formulas and
 * letter-names kept inside the tajweed details and the journey text, the
 * transliterated tajweed terms, Latin product or place names a reader has to
 * recognise on a label or a form, and bare numbers and units.
 */
const SAME_IN_AZERBAIJANI = [
  'قطب جد', 'باء', 'ميم', 'نون', 'لام', 'الحمد',
  'Labbayka', 'Allāhu akbar', 'Allahu əkbər', 'Nawaytu', 'Bismillah',
  'Qalqalah', 'Ghunnah', 'Iqlāb', 'Idghām', 'Ikhfāʾ', 'Madd', 'sukūn', 'waṣl',
  'Nusuk', 'WhatsApp', 'MP3Quran', 'Islamic.app', 'Islamic Network',
  'api.islamicdata.uz', 'cdn.islamic.network', 'audio.islamicdata.uz', 'misc.islamicdata.uz',
  'Face ID', 'Android', 'iOS', 'YouTube', 'PIN',
  'Qur’an', 'Sahih al-Bukhari', 'Sahih Muslim',
];

let fallbacks: string[] = [];
const check = (label: string, s: string) => {
  if (!s) return;
  if (isAz(s)) return;
  if (SAME_IN_AZERBAIJANI.some((f) => s.includes(f))) return;
  // A bare number, unit or symbol has nothing to translate.
  if (/^[\s\d.,:%·+\-—–/()#×°'’"“”]*$/.test(s)) return;
  fallbacks.push(`${label}: ${JSON.stringify(s)}`);
};

console.log('Azerbaijani copy entries:', Object.keys(AZ).length);

console.log('\n--- Quran topics ---');
for (const t of QURAN_TOPICS) {
  check(`topic "${t.id}" title`, topicTitle(t, LANG));
  check(`topic "${t.id}" desc`, topicDescription(t, LANG));
  check(`topic "${t.id}" cat`, topicCategory(t, LANG));
}
console.log(`${QURAN_TOPICS.length} topics, ${fallbacks.length} fallbacks so far`);

console.log('\n--- Tajweed rules ---');
let n0 = fallbacks.length;
for (const r of TAJWEED_RULES) {
  check(`tajweed "${r.codes.join(',')}" name`, tajweedName(r, LANG));
  check(`tajweed "${r.codes.join(',')}" detail`, tajweedDetail(r, LANG));
}
console.log(`${TAJWEED_RULES.length} rules, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Worship guides ---');
n0 = fallbacks.length;
let steps = 0;
for (const g of WORSHIP_GUIDES) {
  const lg = localizeGuide(g, LANG) as any;
  check(`guide ${g.id} title`, lg.title);
  check(`guide ${g.id} summary`, lg.summary ?? lg.subtitle);
  for (const s of (lg.steps || [])) {
    steps++;
    check(`guide ${g.id} step ${s.title}`, s.title);
    check(`guide ${g.id} step detail`, s.detail);
  }
}
console.log(`${WORSHIP_GUIDES.length} guides / ${steps} steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Journeys ---');
n0 = fallbacks.length;
for (const kind of ['umrah', 'hajj'] as const) {
  const meta = journeyMeta(kind as any, LANG);
  check(`journeyMeta ${kind} intro`, (meta as any)?.intro);
  for (const st of JOURNEY_STEPS[kind]) {
    const ls = localizeJourneyStep(st, LANG) as any;
    check(`step ${st.id} title`, ls.title);
    check(`step ${st.id} short`, ls.short);
    check(`step ${st.id} detail`, ls.detail);
    if (ls.counterLabel) check(`step ${st.id} counter`, ls.counterLabel);
  }
}
console.log(`${JOURNEY_STEPS.umrah.length} umrah + ${JOURNEY_STEPS.hajj.length} hajj steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Surah names ---');
n0 = fallbacks.length;
const sn = Object.keys(SURAH_NAMES_AZ).length;
console.log(`${sn} surah names present`);
if (sn !== 114) fallbacks.push(`surah names: expected 114, got ${sn}`);
console.log(` 1=${SURAH_NAMES_AZ[1]}  2=${SURAH_NAMES_AZ[2]}  112=${SURAH_NAMES_AZ[112]}  114=${SURAH_NAMES_AZ[114]}`);

console.log('\n--- Prayer names ---');
console.log(' ', ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => prayerName(LANG, p)).join(' · '));

console.log('\n--- Copy table round-trip ---');
n0 = fallbacks.length;
let looked = 0, identical = 0;
for (const k of Object.keys(AZ)) {
  looked++;
  const got = tx(LANG, k);
  if (got === k) { identical++; continue; }
  if (got !== AZ[k]) fallbacks.push(`tx mismatch for ${JSON.stringify(k.slice(0, 60))}`);
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
