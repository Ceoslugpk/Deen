import { QURAN_TOPICS, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail, QURAN_VOCABULARY } from '../src/content/quranStudy';
import { WORSHIP_GUIDES, localizeGuide } from '../src/content/worshipGuides';
import { JOURNEY_STEPS, JOURNEY_META, journeyMeta, localizeJourneyStep } from '../src/services/journeyService';
import { ML } from '../src/services/malayalamCopy';
const MLs = 'ml';
const isMl = (s: string) => /[\u0d00-\u0d7f]/.test(s || '');
let fallbacks: string[] = [];
const check = (label: string, s: string) => { if (s && !isMl(s)) fallbacks.push(`${label}: ${JSON.stringify(s)}`); };

console.log('Malayalam copy entries:', Object.keys(ML).length);

console.log('\n--- Quran topics ---');
for (const t of QURAN_TOPICS) {
  check(`topic "${t.id}" title`, topicTitle(t, MLs));
  check(`topic "${t.id}" desc`, topicDescription(t, MLs));
  check(`topic "${t.id}" cat`, topicCategory(t, MLs));
}
console.log(`${QURAN_TOPICS.length} topics, ${fallbacks.length} fallbacks so far`);

console.log('\n--- Tajweed rules ---');
let n0 = fallbacks.length;
for (const r of TAJWEED_RULES) {
  check(`tajweed "${r.id}" name`, tajweedName(r, MLs));
  check(`tajweed "${r.id}" detail`, tajweedDetail(r, MLs));
}
console.log(`${TAJWEED_RULES.length} rules, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Worship guides ---');
n0 = fallbacks.length;
let steps = 0;
for (const g of WORSHIP_GUIDES) {
  const lg = localizeGuide(g, MLs);
  check(`guide ${g.id} title`, lg.title);
  check(`guide ${g.id} summary`, lg.summary);
  for (const s of (lg.steps || [])) { steps++; check(`guide ${g.id} step ${s.title}`, s.title); check(`guide ${g.id} step detail`, s.detail); }
}
console.log(`${WORSHIP_GUIDES.length} guides / ${steps} steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Journeys ---');
n0 = fallbacks.length;
for (const kind of ['umrah', 'hajj'] as const) {
  const meta = journeyMeta(kind as any, MLs);
  check(`journeyMeta ${kind} intro`, (meta as any)?.intro);
  for (const st of JOURNEY_STEPS[kind]) {
    const ls = localizeJourneyStep(st, MLs);
    check(`step ${st.id} title`, ls.title);
    check(`step ${st.id} short`, ls.short);
    check(`step ${st.id} detail`, ls.detail);
    if (ls.counterLabel) check(`step ${st.id} counter`, ls.counterLabel);
  }
}
console.log(`${Object.keys(JOURNEY_STEPS.umrah).length} umrah + ${Object.keys(JOURNEY_STEPS.hajj).length} hajj steps, ${fallbacks.length - n0} fallbacks`);

console.log('\n--- Sample render (umrah step 1) ---');
const s1 = localizeJourneyStep(JOURNEY_STEPS.umrah[0], MLs);
console.log(' title :', s1.title);
console.log(' short :', s1.short);
console.log(' detail:', s1.detail.slice(0, 160) + '…');
console.log('\n--- Sample render (tajweed 1) ---');
console.log(' ', tajweedName(TAJWEED_RULES[0], MLs), '—', tajweedDetail(TAJWEED_RULES[0], MLs).slice(0, 90) + '…');
console.log('\n--- Sample render (worship guide 1) ---');
const g1 = localizeGuide(WORSHIP_GUIDES[0], MLs);
console.log(' ', g1.title, '—', g1.summary.slice(0, 90) + '…');

console.log('\n=== TOTAL FALLBACKS:', fallbacks.length, '===');
if (fallbacks.length) console.log(fallbacks.slice(0, 40).join('\n'));
