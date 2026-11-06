# -*- coding: utf-8 -*-
"""Generate src/content/worshipGuidesKk.ts from the English source of truth,
substituting every string through the committed Kazakh copy table.

Nothing is hand-typed: each Kazakh string is pulled out of kazakhCopy.ts, so the
guides and the rest of the interface cannot drift apart.
"""
import re
import io

ROOT = 'src/'
copy = open(ROOT + 'services/kazakhCopy.ts', encoding='utf-8').read()
T = {}
for m in re.finditer(r"'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'", copy):
    T.setdefault(m.group(1), m.group(2))

# The nine guide titles are not in the copy table (the ids are, the titles are not).
TITLE = {
    'Wudu Guide': 'Дәрет нұсқаулығы',
    'Salah Guide': 'Намаз нұсқаулығы',
    'Janazah Guide': 'Жаназа нұсқаулығы',
    'Istikhara Guide': 'Истихара нұсқаулығы',
    'Taraweeh Guide': 'Тарауих намазы',
    'Ramadan Guide': 'Рамазан нұсқаулығы',
    'Fasting Guide': 'Ораза нұсқаулығы',
    'Laylatul Qadr': 'Қадір түні',
    'Zakat al-Fitr': 'Пітір садақасы',
}

eng = open(ROOT + 'content/worshipGuides.ts', encoding='utf-8').read()


def tr(s, where):
    if s in T:
        return T[s]
    raise SystemExit('UNTRANSLATED (%s): %r' % (where, s))


def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


# Parse the English guides array for: id, subtitle, introduction, steps[], note.
guides = []
for m in re.finditer(
        r"\{\s*\n\s*id: '([^']+)', title: '[^']+', subtitle: '((?:[^'\\]|\\.)*)',"
        r"(?:\s*\n\s*arabic: '((?:[^'\\]|\\.)*)',)?"
        r"\s*\n\s*introduction: '((?:[^'\\]|\\.)*)',"
        r"\s*\n\s*steps: \[(.*?)\],", eng, re.S):
    gid, sub, _arb, intro, stepsraw = m.groups()
    steps = re.findall(r"'((?:[^'\\]|\\.)*)'", stepsraw)
    guides.append((gid, sub, intro, steps))

notes = {}
for m in re.finditer(r"id: '([^']+)'.*?\n\s*note: '((?:[^'\\]|\\.)*)'\n", eng, re.S):
    notes[m.group(1)] = m.group(2)

print('parsed guides:', len(guides))

out = io.StringIO()
w = out.write

w('''/**
 * The worship guides in Kazakh.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the Kazakh
 * wording, so a guide that has not been written here yet simply reads in
 * English rather than showing an empty screen.
 *
 * The register is the one a Kazakh Muslim prays in, and it is Cyrillic — the
 * script the religious literature of the country is written in, and the script
 * the preset Qur'an edition (`tr_kk_khalifah_altai`) uses: дәрет for the
 * washing, намаз for the prayer, рүкүғ and сәжде and тәшәһһуд for its parts,
 * жаназа намазы for the funeral prayer, тарауих for the Ramadan night prayer,
 * истихара, сәресі and ауызашар, пітір садақасы for the Eid charity, and ораза
 * for the fast. The testimony is Шаһада — the word the copy table uses
 * elsewhere, so the guides and the rest of the interface agree.
 *
 * The Prophet ﷺ is never named without the blessing.
 *
 * Kazakh is written left-to-right, so these guides are only reachable through a
 * language code: the old `rtl` boolean could never have found them.
 *
 * Arabic numerals are kept, as the rest of the Kazakh interface keeps them — no
 * digit conversion belongs here.
 */

export type WorshipGuideKk = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_KK: Record<string, WorshipGuideKk> = {
''')

for gid, sub, intro, steps in guides:
    w("  '%s': {\n" % gid)
    w("    title: '%s',\n" % esc(T.get(gid) or TITLE[gid]))
    w("    subtitle: '%s',\n" % esc(tr(sub, gid + '.subtitle')))
    w("    introduction: '%s',\n" % esc(tr(intro, gid + '.introduction')))
    w('    steps: [\n')
    for s in steps:
        w("      '%s',\n" % esc(tr(s, gid + '.step')))
    w('    ],\n')
    if gid in notes:
        w("    note: '%s',\n" % esc(tr(notes[gid], gid + '.note')))
    w('  },\n')

w('''};

/**
 * Reference labels in Kazakh.
 *
 * The numbers are left as they are: Kazakh is written in Arabic numerals
 * throughout this app, so a reference reads "Құран 5:6" and not some other
 * digits. Only the words before the number change.
 */
export function kazakhReference(label: string): string {
  return label
    .replace('Qur’an', 'Құран')
    .replace('Sahih al-Bukhari', 'Сахих әл-Бұхари')
    .replace('Sahih Muslim', 'Сахих Мүслім');
}
''')

open(ROOT + 'content/worshipGuidesKk.ts', 'w', encoding='utf-8').write(out.getvalue())
print('written src/content/worshipGuidesKk.ts')
