import { surahNames, SurahNameLanguage } from '../src/content/surahNames';
const codes: SurahNameLanguage[] = ['en','ar','ur','fa','id','hi','ml','tr','ru','fr','bn','ms','ta'];
let bad = 0;
for (const code of codes) {
  const list = surahNames(code);
  const uniq = new Set(list).size;
  console.log(code, list.length + '/114', 'unique:' + uniq);
  if (list.length !== 114 || uniq !== 114) bad++;
}
console.log('--- sample (ta) ---');
const ta = surahNames('ta');
for (const i of [1, 2, 3, 4, 5, 12, 18, 36, 55, 67, 87, 97, 112, 113, 114]) {
  console.log(' ', i, ta[i - 1]);
}
console.log(bad === 0 ? 'surah names OK — 13 languages, 114/114 unique' : 'PROBLEMS: ' + bad);
