const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader();
const { settingsDedicationText: copy } = load('src/services/settingsDedication.ts');
const { LANGUAGES, isRtl } = load('src/services/languages.ts');
const supported = LANGUAGES.filter(row => row.uiReady || row.uiPartial);
const exactEnglish = '2026 © Islamic. This app is a hadiyah for my beloved parents and the entire Muslim Ummah. May Allah accept it as sadaqah jariyah and grant them His mercy and forgiveness.🤲❤️';

test('the English Settings dedication is exactly the user-provided text, including year, copyright and emojis', () => {
  assert.equal(copy('en'), exactEnglish);
  assert.equal(copy('en').split('2026 © Islamic.').length, 2);
});

test('all 22 actual interface languages have a full local dedication, not an English fallback', () => {
  assert.equal(supported.length, 22);
  // These are manually authored topic checks, not a claim of professional
  // linguistic review: parents, the Muslim community and the ongoing charity.
  const topics = {
    en: ['beloved parents', 'Muslim Ummah', 'sadaqah jariyah'],
    ar: ['لوالديَّ', 'للأمة الإسلامية', 'صدقةً جاريةً'],
    ur: ['والدین', 'امتِ مسلمہ', 'صدقۂ جاریہ'],
    fa: ['پدر و مادر', 'امت مسلمان', 'صدقهٔ جاریه'],
    ps: ['مور او پلار', 'مسلمان امت', 'صدقې جاریې'],
    fr: ['parents bien-aimés', 'communauté musulmane', 'sadaqah jariyah'],
    tr: ['anne babama', 'Müslüman ümmetine', 'sadaka-i cariye'],
    ru: ['родителям', 'мусульманской умме', 'садака джария'],
    uz: ['ота-онамга', 'мусулмон умматига', 'садақаи жория'],
    kk: ['ата-анама', 'мұсылман үмбетіне', 'садақа жария'],
    zh: ['父母', '穆斯林乌玛', '长久的施舍'],
    vi: ['cha mẹ', 'cộng đồng Muslim', 'sadaqah jariyah'],
    az: ['valideynlərimə', 'müsəlman ümmətinə', 'sədəqeyi-cariyə'],
    bs: ['roditeljima', 'muslimanskom ummetu', 'trajnu sadaku'],
    bg: ['родители', 'мюсюлманска общност', 'садака джария'],
    si: ['දෙමාපියන්ට', 'මුස්ලිම්', 'සදකා ජාරියා'],
    bn: ['বাবা-মা', 'মুসলিম উম্মাহর', 'সদকায়ে জারিয়া'],
    hi: ['माता-पिता', 'मुस्लिम उम्मत', 'सदक़ा-ए-जारिया'],
    id: ['orang tua', 'umat Muslim', 'sedekah jariyah'],
    ms: ['ibu bapa', 'umat Islam', 'sedekah jariah'],
    ta: ['பெற்றோருக்கும்', 'முஸ்லிம் உம்மத்திற்கும்', 'சதகா ஜாரியாவாக'],
    ml: ['മാതാപിതാക്കൾക്കും', 'മുസ്‌ലിം സമൂഹത്തിനുമുള്ള', 'സ്വദഖ ജാരിയയായി'],
  };
  for (const { code } of supported) {
    const value = copy(code);
    assert.ok(value.startsWith('2026 © Islamic. '), code);
    assert.ok(value.endsWith('🤲❤️'), code);
    assert.ok(value.length > 60, code); // CJK conveys the full dedication in fewer characters.
    if (code !== 'en') assert.notEqual(value, exactEnglish, code);
    for (const term of topics[code]) assert.ok(value.includes(term), `${code}: ${term}`);
  }
});

test('RTL dedications retain their native script; Uzbek and Kazakh remain Cyrillic', () => {
  for (const { code } of supported.filter(row => isRtl(row.code))) assert.match(copy(code), /[\u0600-\u06ff]/u, code);
  for (const code of ['uz', 'kk']) {
    const body = copy(code).slice('2026 © Islamic. '.length);
    assert.match(body, /[А-Яа-яҚқЎўҒғҲҳӘәІіҢңҮүҰұӨө]/u);
    assert.doesNotMatch(body, /[A-Za-z]/u);
  }
});

test('Malay and Indonesian retain independently translated wording', () => {
  assert.notEqual(copy('id'), copy('ms'));
  assert.match(copy('id'), /kedua orang tua/);
  assert.match(copy('ms'), /ibu bapa/);
});

test('unsupported or prototype-like locale names safely fall back to the exact English text', () => {
  for (const code of ['unknown', '', 'my', 'toString', 'constructor', '__proto__']) assert.equal(copy(code), exactEnglish, code);
  const source = fs.readFileSync(path.join(__dirname, '../src/services/settingsDedication.ts'), 'utf8');
  assert.ok(!source.includes('AsyncStorage')); assert.ok(!source.includes('writeJson')); assert.ok(!source.includes('Date('));
});

test('the localized dedication is the last Settings child, wraps without truncation, and respects RTL/theme styles', () => {
  const source = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  const settings = source.slice(source.indexOf('function SettingsScreen('), source.indexOf('const navigationRef'));
  const footer = settings.slice(settings.indexOf('<Text testID="settings-dedication"'));
  assert.match(footer, /^<Text testID="settings-dedication"/);
  assert.ok(footer.includes('settingsDedicationText(language)'));
  assert.ok(footer.includes("writingDirection: rtl ? 'rtl' : 'ltr'"));
  assert.ok(settings.indexOf('settings-dedication') > settings.indexOf('style={s.madeWith}'));
  assert.match(footer, /<\/Text>\s*<\/ScrollView>\s*<\/Page>}/);
  assert.ok(!footer.includes('numberOfLines=')); assert.ok(!footer.includes('adjustsFontSizeToFit='));
  const style = source.match(/settingsDedication:\{([^}]+)\}/)?.[1]; assert.ok(style);
  for (const property of ['color:C.muted', 'lineHeight:20', "width:'100%'", 'maxWidth:640']) assert.ok(style.includes(property), property);
});
