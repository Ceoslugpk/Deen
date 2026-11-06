# -*- coding: utf-8 -*-
"""Generate src/content/journeyKk.ts from the English journeyService.ts source of
truth, substituting through the committed Kazakh copy table.

Strings that live only on the journey screens (the step titles, the short lines
and the long `detail` paragraphs that no other screen shows) are supplied in
EXTRA below; everything else is pulled out of kazakhCopy.ts so the journey and
the rest of the interface cannot drift apart.
"""
import re
import io

copy = open('src/services/kazakhCopy.ts', encoding='utf-8').read()
T = {}
for m in re.finditer(r"'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'", copy):
    T.setdefault(m.group(1), m.group(2))

EXTRA = {
    # prepare
    'Trim the nails and hair, bathe, and put on the Ihram garments before passing the Miqat for your direction of travel. Then intend the Umrah in your heart and begin the Talbiyah. Once in Ihram, do not cut hair or nails, wear sewn clothing or perfume (for men), hunt, or contract a marriage — the details of what breaks Ihram and what expiates it differ between schools, so confirm your own case with a scholar you trust.':
        'Тырнақ пен шашты алдырып, ғұсыл алыңыз және бағытыңызға тиісті миқаттан өтпес бұрын ихрам киімдерін киіңіз. Сонан соң көңілде умраға ниет етіп, тәлбияны бастаңыз. Ихрамға кіргеннен кейін шаш пен тырнақ алдыруға, (ерлерге) тігілген киім мен иіссу қолдануға, аң аулауға және неке қиюға болмайды — ихрамды не бұзатыны және оның өтеуі не беретіні мазһабтарда әр түрлі, сондықтан өз жағдайыңызды сенетін ғалыммен растаңыз.',
    # talbiyah
    'The Talbiyah': 'Тәлбия',
    # tawaf
    'Enter at the Black Stone, intending to begin, and circle the Ka‘bah seven times with the Ka‘bah on your left. Touch or gesture to the Black Stone each time you pass it, and recite whatever remembrance or Qur’an comes easily — no specific supplication is fixed for each circuit. Men walk briskly for the first three circuits. When you finish, pray two rak‘ahs behind Maqam Ibrāhīm if you can, then drink Zamzam.':
        'Қара тастан бастауға ниет етіп кіріңіз де Қағбаны сол жағыңызда қалдырып, жеті рет айналыңыз. Қара тастың жанынан әр өткен сайын оған қол тигізіңіз не ишара жасаңыз және қолыңыздан келген кез келген зікір не Құран оқыңыз — әр айналымға арнайы бекітілген дұға жоқ. Ерлер алғашқы үш айналымда тез жүреді. Аяқтаған соң, мүмкін болса, Мақам Ибраһимнің артында екі рәкат намаз оқыңыз, сонан соң Зәмзәмнен ішіңіз.',
    'circuits': 'Айналымдар',
    'lengths': 'Рет',
    # intention
    'Tamattu‘, Qirān, or Ifrād': 'Тәматтуғ, Қиран немесе Ифрад',
    'Tamattu‘: enter Ihram for Umrah, complete it, leave Ihram, then enter Ihram again for Hajj on the 8th; it carries a sacrificial animal. Qirān: hold both Umrah and Hajj in one Ihram. Ifrād: enter Ihram for Hajj alone and stay in Ihram throughout. Which is preferable, and what each requires, depends on your circumstances and school — decide with knowledge before you travel.':
        'Тәматтуғ: умраға ихрам киіп оны аяқтаңыз, ихрамнан шығыңыз, сонан соң 8-ші күні қажылық үшін қайта ихрамға кіріңіз; онда құрбандық бар. Қиран: умра мен қажылықты бір ихрамда өткізу. Ифрад: тек қажылыққа ихрам киіп, соңына дейін ихрамда қалу. Қайсысы артық және әрқайсысына не қажет екені жағдайыңыз бен мазһабыңызға байланысты — сапарға шықпас бұрын біліп шешіңіз.',
    # ihram
    'Enter Ihram': 'Ихрамға кіру',
    # tarwiyah / arafah / muzdalifah
    '8th of Dhul-Hijjah — Mina': 'Зул-Хижжаның 8-і — Мина',
    '9th of Dhul-Hijjah — ‘Arafah': 'Зул-Хижжаның 9-ы — Арафат',
    'After sunrise, go to ‘Arafah and stand there from noon until sunset, praying Dhuhr and ‘Asr together and shortened. The whole of ‘Arafah is a place of standing, though the rock at Jabal al-Raḥmah is where people gather. Fill the day with the Talbiyah, remembrance, Qur’an, repentance and supplication — this is the day the pilgrimage turns on.':
        'Күн шыққаннан кейін Арафатқа барып, бесіннен күн батқанға дейін сонда тұрыңыз; бесін мен екіндіні қосып және қысқартып оқыңыз. Арафаттың бәрі — тұратын орын, бірақ адамдар Рахмат тауындағы жартастың жанына жиналады. Күнді тәлбиямен, зікірмен, Құранмен, тәубемен және дұғамен толтырыңыз — қажылық осы күнге тіреледі.',
    'Night at Muzdalifah': 'Мұздәлифадағы түн',
    'pebbles': 'Тастар',
    # hady
    'Offer the sacrificial animal that is due for Tamattu‘ and Qirān — today most pilgrims appoint an authorised agent, which is accepted. Then shave the head or trim the hair; women cut a fingertip’s length. With stoning, sacrifice and shaving done, everything Ihram had forbidden becomes lawful apart from intimacy with a spouse.':
        'Тәматтуғ пен Қиран үшін міндетті құрбандықты шалыңыз — бүгінде қажылардың көбі өкілетті өкіл тағайындайды, бұл қабылданады. Сонан соң басты қырыңыз не шашты қысқартыңыз; әйелдер бір саусақ ұшындай кеседі. Тас лақтыру, құрбандық және шаш алу аяқталған соң, жұбайымен жақындықтан басқа ихрам тыйым салғанның бәрі адал болады.',
    # tashreeq
    'On each afternoon after noon, stone the three pillars in order — the small, then the middle, then the large — with seven pebbles each, saying “Allāhu akbar” with every throw. Spend these nights at Mina. The one who leaves after the 12th, having stoned that day, does so without blame; the one who stays for the 13th also does so without blame.':
        'Күн сайын бесіннен кейін үш діңгекке ретімен тас лақтырыңыз — кішісіне, сонан соң ортаңғысына, сонан соң үлкеніне — әрқайсысына жеті тастан, әр лақтырғанда «Аллаһу әкбар» деп айтыңыз. Бұл түндерді Минада өткізіңіз. 12-ші күні тас лақтырып кеткен кісі кінәсіз кетеді; 13-іне дейін қалған кісі де кінәсіз қалады.',
    # wada
    'Farewell Tawaf': 'Қоштасу тауабы',
}

svc = open('src/services/journeyService.ts', encoding='utf-8').read()


def tr(s, where):
    if s in EXTRA:
        return EXTRA[s]
    if s in T:
        return T[s]
    raise SystemExit('UNTRANSLATED (%s): %r' % (where, s))


def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


out = io.StringIO()
w = out.write

# --- JOURNEY_META: only the intro is localised (as in every other language). ---
meta_intro = {}
for m in re.finditer(r"  (umrah|hajj): \{\s*\n\s*title: '[^']*',\s*\n\s*arabic: '[^']*',\s*\n\s*intro: '((?:[^'\\]|\\.)*)',", svc):
    meta_intro[m.group(1)] = m.group(2)

assert set(meta_intro) == {'umrah', 'hajj'}, meta_intro

# --- steps ---
start = svc.index('export const JOURNEY_STEPS')
end = svc.index('\n};', start)
block = svc[start:end]

kinds = {}
for km in re.finditer(r"\n  (umrah|hajj): \[\n(.*?)(?=\n  (?:umrah|hajj): \[\n|\Z)", block, re.S):
    kind, body = km.group(1), km.group(2)
    steps = []
    for sm in re.finditer(
            r"\n    \{\s*\n\s*id: '([^']+)',\s*\n\s*title: '((?:[^'\\]|\\.)*)',\s*\n\s*short: '((?:[^'\\]|\\.)*)',\s*\n\s*detail: '((?:[^'\\]|\\.)*)',\s*\n\s*icon: '[^']*',\s*\n(?:\s*counter: \{ max: (\d+), label: '((?:[^'\\]|\\.))'"
            r".*?)?(?=\n    \}|\Z)", body, re.S):
        sid, title, short, detail = sm.group(1), sm.group(2), sm.group(3), sm.group(4)
        counter = sm.group(5)
        steps.append((sid, title, short, detail, counter))
    kinds[kind] = steps

# simpler, robust re-parse of counter per step
def parse_steps(body):
    steps = []
    body = '\n' + body  # the first step in each array has no preceding newline
    for sm in re.finditer(r"\n    \{\s*\n\s*id: '([^']+)',", body):
        sid = sm.group(1)
        sub = body[sm.start():]
        nxt = re.search(r"\n    \{", sub[10:])
        sub = sub[:nxt.start() + 10] if nxt else sub
        title = re.search(r"title: '((?:[^'\\]|\\.)*)',", sub).group(1)
        short = re.search(r"short: '((?:[^'\\]|\\.)*)',", sub).group(1)
        detail = re.search(r"detail: '((?:[^'\\]|\\.)*)',", sub).group(1)
        cm = re.search(r"counter: \{ max: (\d+), label: '((?:[^'\\]|\\.)*)' \}", sub)
        steps.append((sid, title, short, detail, cm.group(2) if cm else None))
    return steps


kinds = {k: parse_steps(m.group(2)) for m in
         re.finditer(r"\n  (umrah|hajj): \[\n(.*?)(?=\n  (?:umrah|hajj): \[\n|\Z)", block, re.S)
         for k in [m.group(1)]}

# rebuild cleanly (dict comprehension above is fragile with the generator var)
kinds = {}
for km in re.finditer(r"\n  (umrah|hajj): \[\n(.*?)(?=\n  (?:umrah|hajj): \[\n|\Z)", block, re.S):
    kinds[km.group(1)] = parse_steps(km.group(2))

print({k: len(v) for k, v in kinds.items()})
allids = [s[0] for v in kinds.values() for s in v]
print(allids)

w('''/**
 * The Umrah and Hajj journey in Kazakh.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Kazakh is
 * written left-to-right, so the old boolean could not reach it at all and
 * these screens would have stayed in English.
 *
 * The wording follows the vocabulary a Kazakh Muslim actually uses, in Cyrillic
 * — the script of the country's religious literature and of the preset Qur'an
 * edition: ихрам, миқат, тауап, сәғи, айналым (the circuit), тәлбия, діңгек
 * (the pillar), Арафат, Мина, Мұздәлифа, құрбандық, Ифада тауабы, Ташриқ
 * күндері. Where the schools of law differ — on what breaks ihram, on whether
 * the sa'i of Hajj comes before or after Tawaf al-Ifadah — the text says so and
 * sends the reader to someone qualified, instead of quietly picking one ruling
 * and presenting it as the only one.
 *
 * The short lines are the same strings the rest of the interface uses, so the
 * wording a person reads on the journey screen is the wording they meet
 * everywhere else.
 *
 * The Prophet ﷺ is never named without the blessing.
 */

export type JourneyStepKk = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_KK: Record<string, { intro: string }> = {
''')

for kind in ('umrah', 'hajj'):
    w("  %s: {\n    intro: '%s',\n  },\n" % (kind, esc(tr(meta_intro[kind], kind + '.intro'))))

w('''};

export const JOURNEY_STEPS_KK: Record<string, JourneyStepKk> = {
''')

seen = set()
for kind in ('umrah', 'hajj'):
    w('  // %s\n' % kind)
    for sid, title, short, detail, counter in kinds[kind]:
        if sid in seen:
            continue
        seen.add(sid)
        w("  %s: {\n" % sid)
        w("    title: '%s',\n" % esc(tr(title, sid + '.title')))
        w("    short: '%s',\n" % esc(tr(short, sid + '.short')))
        w("    detail:\n      '%s',\n" % esc(tr(detail, sid + '.detail')))
        if counter:
            w("    counterLabel: '%s',\n" % esc(tr(counter, sid + '.counter')))
        w("  },\n")
    w('\n')

w('};\n')

open('src/content/journeyKk.ts', 'w', encoding='utf-8').write(out.getvalue())
print('written src/content/journeyKk.ts')
