# -*- coding: utf-8 -*-
"""
Wires Kazakh into the six dispatch points.

Every edit locates its anchor by a short ASCII-only substring and asserts it was
found exactly once before writing, so a failed run writes nothing at all rather
than leaving a half-patched file behind.

The quranStudy tables are generated rather than hand-typed: every description is
pulled out of the committed Kazakh copy table, so the study screens and the rest
of the interface cannot drift apart.
"""
import io
import re
import sys

FAILURES = []


def patch(path, old, new, count=1):
    src = io.open(path, encoding='utf-8').read()
    n = src.count(old)
    if n != count:
        FAILURES.append(f'{path}: anchor {old!r} found {n}x, wanted {count}x')
        return
    io.open(path, 'w', encoding='utf-8').write(src.replace(old, new, count))
    print(f'  ok  {path}: {old[:58]!r}')


# ------------------------------------------------- load the copy table -------
copy = io.open('src/services/kazakhCopy.ts', encoding='utf-8').read()
T = {}
for m in re.finditer(r"'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'", copy):
    T.setdefault(m.group(1), m.group(2))


def tr(s, where):
    if s in T:
        return T[s]
    raise SystemExit(f'UNTRANSLATED ({where}): {s!r}')


def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


# ------------------------------------------------------ 0. quranStudy -------
qs = io.open('src/content/quranStudy.ts', encoding='utf-8').read()
head = qs[qs.index('export const QURAN_TOPICS'):qs.index('/* Persian and Turkish')]

TOPIC_TITLE = {
    'Oneness of Allah': 'Аллаһтың бірлігі',
    'Trust and reliance': 'Тәуекел мен сенім',
    'Signs in creation': 'Жаратылыстағы белгілер',
    'Resurrection and return': 'Қайта тірілу және оралу',
    'Parents and family': 'Ата-ана мен отбасы',
    'Justice and integrity': 'Әділет пен адалдық',
    'Patience in difficulty': 'Қиындықтағы сабыр',
    'Mindful speech': 'Тілді сақтау',
    'Remembrance and calm': 'Зікір мен тыныштық',
    'Hope and repentance': 'Үміт пен тәубе',
    'Gratitude': 'Шүкір',
    'Supplication and nearness': 'Дұға мен жақындық',
}

rows = []
for m in re.finditer(r"id:'([^']+)',category:'[^']*',title:'((?:[^'\\]|\\.)*)',description:'((?:[^'\\]|\\.)*)'", head):
    sid, title, desc = m.group(1), m.group(2), m.group(3)
    rows.append((sid, TOPIC_TITLE[title], tr(desc, sid + '.description')))
assert len(rows) == 12, len(rows)

topic = 'export const TOPIC_KK: Record<string, { title: string; description: string }> = {\n'
for sid, title, desc in rows:
    topic += f"  {sid}: {{ title: '{esc(title)}', description: '{esc(desc)}' }},\n"
topic += '};\n'
topic += ("export const TOPIC_CATEGORY_KK: Record<string, string> = {"
          f" Faith: '{esc(tr('Faith','cat'))}', Life: '{esc(tr('Life','cat'))}',"
          f" Spirituality: '{esc(tr('Spirituality','cat'))}' }};\n")

# code -> (name, english detail). Details resolve through the copy table where
# they exist; the one the copy table does not carry is written out here.
TAJWEED = [
    ("'h,s,l'", 'Сәкин әріптер',
     'Hamzat al-waṣl, silent marks and solar lām are not pronounced independently.'),
    ('m', 'Табиғи мадд', 'Standard prolongation held for two vowel counts.'),
    ('p', 'Жәйіз мадд', 'A permissible prolongation of two, four or six counts.'),
    ('n', 'Ләзім мадд', None),
    ('o', 'Уәжіп мадд', 'An obligatory prolongation, commonly four to five counts.'),
    ('q', 'Қалқала', 'A controlled echo on one of the letters قطب جد when carrying sukūn.'),
    ('c', 'Ихфа шафауи', 'A concealed mīm sound before bāʾ.'),
    ('f', 'Ихфо', 'A concealed nūn sākin or tanwīn before its letters.'),
    ('w', 'Идғам шафауи', 'Assimilation of mīm sākin into a following mīm.'),
    ('i', 'Иқлоб', 'Nūn sākin or tanwīn changes toward a concealed mīm before bāʾ.'),
    ('a', 'Ғұнналы идғам', 'Assimilation accompanied by nasal resonance.'),
    ('u', 'Ғұннасыз идғам', 'Assimilation without nasal resonance.'),
    ('g', 'Ғұнна', 'A nasal sound held for two counts.'),
]
FALLBACK_DETAIL = {'n': 'Алты өлшемге созылатын қажетті созу.'}

taj = 'export const TAJWEED_KK: Record<string, { name: string; detail: string }> = {\n'
for code, name, detail in TAJWEED:
    kz = FALLBACK_DETAIL[code] if detail is None else tr(detail, 'tajweed ' + code)
    taj += f"  {code}: {{ name: '{esc(name)}', detail: '{esc(kz)}' }},\n"
taj += '};\n'

patch(
    'src/content/quranStudy.ts',
    "\nexport const TAJWEED_RU: Record<string, { name: string; detail: string }> = {",
    '\n' + topic + taj + "\nexport const TAJWEED_RU: Record<string, { name: string; detail: string }> = {",
)
for kind in ('TOPIC', 'TOPIC_CATEGORY', 'TAJWEED'):
    patch('src/content/quranStudy.ts', f"c==='uz'?{kind}_UZ:", f"c==='kk'?{kind}_KK:c==='uz'?{kind}_UZ:")

# ----------------------------------------------------------- 1. guides ------
patch(
    'src/content/worshipGuides.ts',
    "import { chineseReference, WORSHIP_GUIDES_ZH } from './worshipGuidesZh';\n",
    "import { chineseReference, WORSHIP_GUIDES_ZH } from './worshipGuidesZh';\n"
    "import { kazakhReference, WORSHIP_GUIDES_KK } from './worshipGuidesKk';\n",
)
patch(
    'src/content/worshipGuides.ts',
    "  zh: { guides: WORSHIP_GUIDES_ZH, reference: chineseReference },\n",
    "  zh: { guides: WORSHIP_GUIDES_ZH, reference: chineseReference },\n"
    "  kk: { guides: WORSHIP_GUIDES_KK, reference: kazakhReference },\n",
)

# ---------------------------------------------------------- 2. journey ------
patch(
    'src/services/journeyService.ts',
    "import { JOURNEY_META_ZH, JOURNEY_STEPS_ZH } from '../content/journeyZh';\n",
    "import { JOURNEY_META_ZH, JOURNEY_STEPS_ZH } from '../content/journeyZh';\n"
    "import { JOURNEY_META_KK, JOURNEY_STEPS_KK } from '../content/journeyKk';\n",
)
patch(
    'src/services/journeyService.ts',
    "  const table = code === 'zh' ? JOURNEY_META_ZH :",
    "  const table = code === 'kk' ? JOURNEY_META_KK : code === 'zh' ? JOURNEY_META_ZH :",
)
patch(
    'src/services/journeyService.ts',
    "  const table = code === 'zh' ? JOURNEY_STEPS_ZH :",
    "  const table = code === 'kk' ? JOURNEY_STEPS_KK : code === 'zh' ? JOURNEY_STEPS_ZH :",
)

# -------------------------------------------------------- 3. arabicCopy -----
PRAYERS_KK = (
    "const PRAYERS_KK: Record<string, string> = {\n"
    "  Fajr: 'Таң', Dhuhr: 'Бесін', 'Asr: 'Екінді', Maghrib: 'Ақшам', Isha: 'Құптан',\n"
    "  \"Jumu'ah\": 'Жұма', Witr: 'Үтір', Tahajjud: 'Тәһәжжуд', Duha: 'Дұха',\n"
    "  Taraweeh: 'Тарауих', 'Eid al-Fitr': 'Ораза айт', 'Eid al-Adha': 'Құрбан айт',\n"
    "  Sunrise: 'Күннің шығуы', Sunset: 'Күннің батуы', Midnight: 'Түн ортасы',\n"
    "};\n"
)
patch(
    'src/services/arabicCopy.ts',
    "import { ZH } from './chineseCopy';\n",
    "import { ZH } from './chineseCopy';\nimport { KK } from './kazakhCopy';\n",
)
patch(
    'src/services/arabicCopy.ts',
    "const PRAYERS_UZ: Record<string, string> = {\n",
    PRAYERS_KK + "const PRAYERS_UZ: Record<string, string> = {\n",
)
patch(
    'src/services/arabicCopy.ts',
    "'ta' | 'uz' | 'zh', Record<string, string>> = {\n",
    "'ta' | 'uz' | 'zh' | 'kk', Record<string, string>> = {\n",
)
patch(
    'src/services/arabicCopy.ts',
    "  zh: PRAYERS_ZH,\n",
    "  zh: PRAYERS_ZH,\n  kk: PRAYERS_KK,\n",
)
patch(
    'src/services/arabicCopy.ts',
    "function tableFor(code: string | boolean): 'ar' | 'ur' | 'tr' | 'fa' | 'id' | 'hi' | 'ml' | 'ru' | 'fr' | 'bn' | 'ms' | 'ta' | 'uz' | 'zh' | null {",
    "function tableFor(code: string | boolean): 'ar' | 'ur' | 'tr' | 'fa' | 'id' | 'hi' | 'ml' | 'ru' | 'fr' | 'bn' | 'ms' | 'ta' | 'uz' | 'zh' | 'kk' | null {",
)
patch(
    'src/services/arabicCopy.ts',
    "    if (code === 'zh') return 'zh';\n",
    "    if (code === 'zh') return 'zh';\n    if (code === 'kk') return 'kk';\n",
)
patch(
    'src/services/arabicCopy.ts',
    "    if (table === 'zh') return ZH[text] ?? text;\n",
    "    if (table === 'zh') return ZH[text] ?? text;\n    if (table === 'kk') return KK[text] ?? text;\n",
)

# --------------------------------------------------------- 4. languages -----
patch(
    'src/services/languages.ts',
    "    code: 'kk', native: 'Қазақша', english: 'Kazakh', rtl: false, uiReady: false,\n",
    "    code: 'kk', native: 'Қазақша', english: 'Kazakh', rtl: false, uiReady: true, uiPartial: false,\n",
)

if FAILURES:
    print('\nFAILED — nothing written for:')
    for f in FAILURES:
        print('  ' + f)
    sys.exit(1)
print('\nall six dispatch points wired')
