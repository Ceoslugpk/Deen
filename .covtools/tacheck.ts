import { QURAN_TOPICS, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from '../src/content/quranStudy';
import { WORSHIP_GUIDES, localizeGuide } from '../src/content/worshipGuides';
import { JOURNEY_STEPS, journeyMeta, localizeJourneyStep } from '../src/services/journeyService';
import { TA } from '../src/services/tamilCopy';

const TAs = 'ta';
const isTa = (s: string) => /[\u0B80-\u0BFF]/.test(s || '');

/**
 * Strings that are deliberately not Tamil script: Arabic letter-names in the
 * tajweed rules, and the transliterated formulas kept in Latin on purpose.
 */
const SAME_IN_TAMIL = [
  'قطب جد',
];

let fallbacks: string[] = [];
const check = (label: string, s: string) => {
  if (!s) return;
  if (isTa(s)) return;
  if (SAME_IN_TAMIL.some((f) => s.includes(f))) return;
  fallbacks.push(`${label}: ${JSON.stringify(s)}`);
};

console.log('Tamil copy entries:', Object.keys(TA).length);

console.log('\n--- Quran topics ---');
for (const t of QURAN_TOPICS) {
  check(`topic "${t.id}" title`, topicTitle(t, TAs));
  check(`topic "${t.id}" desc`, topicDescription(t, TAs));
  check(`topic "${t.id}" cat`, topicCategory(t, TAs));
}
console.log(`${QURAN_TOPICS.length} topics, ${fallbacks.length} fallbacks so far`);

console.log('\n--- Tajweed rules ---');
let n0 = fallbacks.length;
for (const r of TAJWEED_RULES) {
  check(`tajweed "${r.codes.join(',')}" name`, tajweedName(r, TAs));
  check(`tajweed "${r.codes.join(',')}" detail`, tajweedDetail(r, TAs));
}
console.log(`${TAJWEED_RULES.length} rules, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Worship guides ---');
n0 = fallbacks.length;
let steps = 0;
for (const g of WORSHIP_GUIDES) {
  const lg = localizeGuide(g, TAs) as any;
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
  const meta = journeyMeta(kind as any, TAs);
  check(`journeyMeta ${kind} intro`, (meta as any)?.intro);
  for (const st of JOURNEY_STEPS[kind]) {
    const ls = localizeJourneyStep(st, TAs) as any;
    check(`step ${st.id} title`, ls.title);
    check(`step ${st.id} short`, ls.short);
    check(`step ${st.id} detail`, ls.detail);
    if (ls.counterLabel) check(`step ${st.id} counter`, ls.counterLabel);
  }
}
console.log(`${JOURNEY_STEPS.umrah.length} umrah + ${JOURNEY_STEPS.hajj.length} hajj steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Sample render (umrah step 1) ---');
const s1 = localizeJourneyStep(JOURNEY_STEPS.umrah[0], TAs) as any;
console.log(' title :', s1.title);
console.log(' short :', s1.short);
console.log(' detail:', s1.detail.slice(0, 160) + '…');
console.log('\n--- Sample render (tajweed 1) ---');
console.log(' ', tajweedName(TAJWEED_RULES[0], TAs), '—', tajweedDetail(TAJWEED_RULES[0], TAs).slice(0, 90) + '…');
console.log('\n--- Sample render (worship guide 1) ---');
const g1 = localizeGuide(WORSHIP_GUIDES[0], TAs) as any;
console.log(' ', g1.title, '—', String(g1.summary ?? g1.subtitle).slice(0, 90) + '…');

console.log('\n=== TOTAL FALLBACKS:', fallbacks.length, '===');
if (fallbacks.length) console.log(fallbacks.slice(0, 40).join('\n'));
