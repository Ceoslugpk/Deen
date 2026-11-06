# -*- coding: utf-8 -*-
"""
Wires Chinese into the six dispatch points.

Every edit locates its anchor by a short ASCII-only substring and asserts it was
found exactly once before writing, so a failed run writes nothing at all rather
than leaving a half-patched file behind.
"""
import io
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


# ---------------------------------------------------------------- 1. guides ---
patch(
    'src/content/worshipGuides.ts',
    "import { uzbekReference, WORSHIP_GUIDES_UZ } from './worshipGuidesUz';\n",
    "import { uzbekReference, WORSHIP_GUIDES_UZ } from './worshipGuidesUz';\n"
    "import { chineseReference, WORSHIP_GUIDES_ZH } from './worshipGuidesZh';\n",
)
patch(
    'src/content/worshipGuides.ts',
    "  uz: { guides: WORSHIP_GUIDES_UZ, reference: uzbekReference },\n",
    "  uz: { guides: WORSHIP_GUIDES_UZ, reference: uzbekReference },\n"
    "  zh: { guides: WORSHIP_GUIDES_ZH, reference: chineseReference },\n",
)

# --------------------------------------------------------------- 2. journey ---
patch(
    'src/services/journeyService.ts',
    "import { JOURNEY_META_UZ, JOURNEY_STEPS_UZ } from '../content/journeyUz';\n",
    "import { JOURNEY_META_UZ, JOURNEY_STEPS_UZ } from '../content/journeyUz';\n"
    "import { JOURNEY_META_ZH, JOURNEY_STEPS_ZH } from '../content/journeyZh';\n",
)
patch(
    'src/services/journeyService.ts',
    "  const table = code === 'uz' ? JOURNEY_META_UZ :",
    "  const table = code === 'zh' ? JOURNEY_META_ZH : code === 'uz' ? JOURNEY_META_UZ :",
)
patch(
    'src/services/journeyService.ts',
    "  const table = code === 'uz' ? JOURNEY_STEPS_UZ :",
    "  const table = code === 'zh' ? JOURNEY_STEPS_ZH : code === 'uz' ? JOURNEY_STEPS_UZ :",
)

# ------------------------------------------------------------ 3. quranStudy ---
ZH_TABLES = """
export const TOPIC_ZH: Record<string, { title: string; description: string }> = {
  oneness: { title: '真主的独一', description: '确认真主绝对独一、无求与无可比拟的经文。' },
  trust: { title: '信托与依靠', description: '信托真主，同时审慎行动并坚持不懈。' },
  signs: { title: '造化中的迹象', description: '引人思考造化、秩序与目的的经文。' },
  resurrection: { title: '复活与归返', description: '对问责、自新与最终归于真主的提醒。' },
  parents: { title: '父母与家人', description: '家庭生活中的仁慈、感恩与美德。' },
  justice: { title: '公正与诚信', description: '即使于己不利，仍坚定主持公正。' },
  patience: { title: '艰难中的忍耐', description: '在艰难中借忍耐与礼拜求助。' },
  speech: { title: '慎言', description: '言说至善，避免猜疑，维护彼此的尊严。' },
  remembrance: { title: '记念与宁静', description: '通过记念真主而获得内心的安定。' },
  repentance: { title: '希望与忏悔', description: '永不绝望于主的慈悯，犯错后诚心归返。' },
  gratitude: { title: '感恩', description: '认识恩典，并以感恩的功修回应。' },
  dua: { title: '都阿与临近', description: '真主的临近，以及呼唤他的邀约。' },
};
export const TOPIC_CATEGORY_ZH: Record<string, string> = { Faith: '信仰', Life: '生活', Spirituality: '灵性' };
export const TAJWEED_ZH: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: '不发音的字母', detail: '连接海姆宰、静音符与太阳字母的 لام 不单独发音。' },
  m: { name: '自然长音', detail: '标准延长，持续两个元音拍。' },
  p: { name: '允许长音', detail: '允许延长两、四或六拍。' },
  n: { name: '必需长音', detail: '六个元音拍的必需延长。' },
  o: { name: '必然长音', detail: '必然的延长，通常为四至五拍。' },
  q: { name: '盖勒盖拉', detail: 'قطب جد 中任一字母带静音符时的受限回声。' },
  c: { name: '唇音隐读', detail: 'باء 之前隐读的 ميم 音。' },
  f: { name: '隐读', detail: '静音 نون 或鼻音符在其字母前的隐读。' },
  w: { name: '唇音并入', detail: '静音 ميم 并入后继的 ميم。' },
  i: { name: '伊格拉卜', detail: '静音 نون 或鼻音符在 باء 前变为隐读的 ميم。' },
  a: { name: '带鼻音的并入', detail: '带鼻音共鸣的并入。' },
  u: { name: '不带鼻音的并入', detail: '不带鼻音的并入。' },
  g: { name: '鼻音', detail: '持续两拍的鼻音。' },
};
"""
patch(
    'src/content/quranStudy.ts',
    "\nexport const TAJWEED_RU: Record<string, { name: string; detail: string }> = {",
    ZH_TABLES + "\nexport const TAJWEED_RU: Record<string, { name: string; detail: string }> = {",
)
for kind in ('TOPIC', 'TOPIC_CATEGORY', 'TAJWEED'):
    patch(
        'src/content/quranStudy.ts',
        f"c==='uz'?{kind}_UZ:",
        f"c==='zh'?{kind}_ZH:c==='uz'?{kind}_UZ:",
    )

# ----------------------------------------------------------- 4. arabicCopy ---
patch(
    'src/services/arabicCopy.ts',
    "import { UZ } from './uzbekCopy';\n",
    "import { UZ } from './uzbekCopy';\nimport { ZH } from './chineseCopy';\n",
)
patch(
    'src/services/arabicCopy.ts',
    "const PRAYERS_UZ: Record<string, string> = {\n",
    "const PRAYERS_ZH: Record<string, string> = {\n"
    "  Fajr: '晨礼', Dhuhr: '晌礼', 'Asr: '晡礼', Maghrib: '昏礼', Isha: '宵礼',\n"
    "  Jumu'ah: '主麻', Witr: '维特尔拜', Tahajjud: '夜间拜', Duha: '杜哈拜',\n"
    "  Taraweeh: '泰拉威哈拜', 'Eid al-Fitr': '开斋节', 'Eid al-Adha': '宰牲节',\n"
    "  Sunrise: '日出', Sunset: '日落', Midnight: '夜半',\n"
    "};\n"
    "const PRAYERS_UZ: Record<string, string> = {\n",
)
patch(
    'src/services/arabicCopy.ts',
    "'ta' | 'uz', Record<string, string>> = {\n",
    "'ta' | 'uz' | 'zh', Record<string, string>> = {\n",
)
patch(
    'src/services/arabicCopy.ts',
    "  uz: PRAYERS_UZ,\n",
    "  uz: PRAYERS_UZ,\n  zh: PRAYERS_ZH,\n",
)
patch(
    'src/services/arabicCopy.ts',
    "function tableFor(code: string | boolean): 'ar' | 'ur' | 'tr' | 'fa' | 'id' | 'hi' | 'ml' | 'ru' | 'fr' | 'bn' | 'ms' | 'ta' | 'uz' | null {",
    "function tableFor(code: string | boolean): 'ar' | 'ur' | 'tr' | 'fa' | 'id' | 'hi' | 'ml' | 'ru' | 'fr' | 'bn' | 'ms' | 'ta' | 'uz' | 'zh' | null {",
)
patch(
    'src/services/arabicCopy.ts',
    "    if (code === 'uz') return 'uz';\n",
    "    if (code === 'uz') return 'uz';\n    if (code === 'zh') return 'zh';\n",
)
patch(
    'src/services/arabicCopy.ts',
    "    if (table === 'uz') return UZ[text] ?? text;\n",
    "    if (table === 'uz') return UZ[text] ?? text;\n    if (table === 'zh') return ZH[text] ?? text;\n",
)

# ------------------------------------------------------------ 5. languages ---
patch(
    'src/services/languages.ts',
    "    code: 'zh', native: '中文', english: 'Chinese', rtl: false, uiReady: false,\n",
    "    code: 'zh', native: '中文', english: 'Chinese', rtl: false, uiReady: true, uiPartial: false,\n",
)
patch(
    'src/services/languages.ts',
    "  { code: 'ta', native: 'தமிழ்', english: 'Tamil', rtl: false },\n];\n",
    "  { code: 'ta', native: 'தமிழ்', english: 'Tamil', rtl: false },\n"
    "  { code: 'zh', native: '中文', english: 'Chinese', rtl: false },\n];\n",
)

if FAILURES:
    print('\nFAILED — nothing written for:')
    for f in FAILURES:
        print('  ' + f)
    sys.exit(1)
print('\nall six dispatch points wired')
