# -*- coding: utf-8 -*-
"""Shared driver for building src/services/uzbekCopy.ts in batches.

Usage:  from _uzwrite import apply; apply(NEW, LO, HI)
`NEW` must hold exactly the union keys in the half-open slice [LO, HI).
"""
import io, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from trio import read, write

MARKER = "export const UZ: Record<string, string> = {"
HEAD = """// Uzbek UI copy.
// Uzbek here is written in Cyrillic: the script every published Uzbek
// translation of the Quran uses, the one Muhammad Sodik Muhammad Yusuf's
// translation is printed in, and the one the Muslim Board of Uzbekistan sets
// its own prayer timetables in. The glossary follows the usage of Uzbek
// Muslims rather than a literal rendering of the Arabic: the prayer is намоз,
// the fast is рўза, the obligatory alms are закот, and the pre-dawn meal is
// саҳарлик — Persian words that reached Uzbek through Turkic, and the ones an
// Uzbek reader looks for. Terms kept in their Arabic form stay that way:
// Қуръон, сура, оят, жуз, зикр, дуо.
//
// Surah names come from the Encyclopedia of the Noble Quran, cross-checked
// between five published Uzbek translations (see src/content/surahNames.ts).

"""
PATH = 'src/services/uzbekCopy.ts'


def apply(new, lo, hi):
    u = json.load(open('.covtools/bn_union.json'))
    want = set(u[lo:hi])
    got = set(new)
    assert want == got, (
        'KEY MISMATCH\n  missing=%r\n  extra=%r' % (
            sorted(want - got), sorted(got - want)))
    if os.path.exists(PATH):
        head, body, tail = read(PATH, MARKER)
    else:
        head, body, tail = HEAD, {}, '\n'
    body.update(new)
    write(PATH, head, body, MARKER, tail)
    s = io.open(PATH, encoding='utf-8').read()
    if s.count('{{') or not s.startswith('// Uzbek UI copy.'):
        s = s.replace('{{', '{')
        if not s.startswith('// Uzbek UI copy.'):
            s = HEAD + s[s.index(MARKER):]
        io.open(PATH, 'w', encoding='utf-8').write(s)
    assert '{{' not in io.open(PATH, encoding='utf-8').read()
    print('ok +%d -> total %d / %d' % (len(new), len(body), len(u)))
