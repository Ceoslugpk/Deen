import { QURAN_TOPICS, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from '../src/content/quranStudy';
import { WORSHIP_GUIDES, localizeGuide } from '../src/content/worshipGuides';
import { JOURNEY_STEPS, journeyMeta, localizeJourneyStep } from '../src/services/journeyService';
import { UZ } from '../src/services/uzbekCopy';

const UZs = 'uz';
const isUz = (s: string) => /[\u0400-\u04FF]/.test(s || '');

/**
 * Strings that are deliberately not Tamil script: Arabic letter-names in the
 * tajweed rules, and the transliterated formulas kept in Latin on purpose.
 */
const SAME_IN_UZBEK = [
    'قطب جد',
  // The Talbiyah and the Basmalah: Arabic formulas kept in Arabic on purpose.
  'Лаббайка Аллоҳумма',
  'Бисмиллоҳ',
  // Latin: product and permit names a pilgrim must recognise, plus reciters.
  'Nusuk', 'Islamic.app', 'WhatsApp', 'MP3Quran',

];

let fallbacks: string[] = [];
const check = (label: string, s: string) => {
  if (!s) return;
  if (isUz(s)) return;
  if (SAME_IN_UZBEK.some((f) => s.includes(f))) return;
  fallbacks.push(`${label}: ${JSON.stringify(s)}`);
};

console.log('Uzbek copy entries:', Object.keys(UZ).length);

console.log('\n--- Quran topics ---');
for (const t of QURAN_TOPICS) {
  check(`topic "${t.id}" title`, topicTitle(t, UZs));
  check(`topic "${t.id}" desc`, topicDescription(t, UZs));
  check(`topic "${t.id}" cat`, topicCategory(t, UZs));
}
console.log(`${QURAN_TOPICS.length} topics, ${fallbacks.length} fallbacks so far`);

console.log('\n--- Tajweed rules ---');
let n0 = fallbacks.length;
for (const r of TAJWEED_RULES) {
  check(`tajweed "${r.codes.join(',')}" name`, tajweedName(r, UZs));
  check(`tajweed "${r.codes.join(',')}" detail`, tajweedDetail(r, UZs));
}
console.log(`${TAJWEED_RULES.length} rules, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Worship guides ---');
n0 = fallbacks.length;
let steps = 0;
for (const g of WORSHIP_GUIDES) {
  const lg = localizeGuide(g, UZs) as any;
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
  const meta = journeyMeta(kind as any, UZs);
  check(`journeyMeta ${kind} intro`, (meta as any)?.intro);
  for (const st of JOURNEY_STEPS[kind]) {
    const ls = localizeJourneyStep(st, UZs) as any;
    check(`step ${st.id} title`, ls.title);
    check(`step ${st.id} short`, ls.short);
    check(`step ${st.id} detail`, ls.detail);
    if (ls.counterLabel) check(`step ${st.id} counter`, ls.counterLabel);
  }
}
console.log(`${JOURNEY_STEPS.umrah.length} umrah + ${JOURNEY_STEPS.hajj.length} hajj steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Sample render (umrah step 1) ---');
const s1 = localizeJourneyStep(JOURNEY_STEPS.umrah[0], UZs) as any;
console.log(' title :', s1.title);
console.log(' short :', s1.short);
console.log(' detail:', s1.detail.slice(0, 160) + '…');
console.log('\n--- Sample render (tajweed 1) ---');
console.log(' ', tajweedName(TAJWEED_RULES[0], UZs), '—', tajweedDetail(TAJWEED_RULES[0], UZs).slice(0, 90) + '…');
console.log('\n--- Sample render (worship guide 1) ---');
const g1 = localizeGuide(WORSHIP_GUIDES[0], UZs) as any;
console.log(' ', g1.title, '—', String(g1.summary ?? g1.subtitle).slice(0, 90) + '…');

console.log('\n=== TOTAL FALLBACKS:', fallbacks.length, '===');
if (fallbacks.length) console.log(fallbacks.slice(0, 40).join('\n'));
