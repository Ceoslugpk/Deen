# -*- coding: utf-8 -*-
"""Shared driver for building src/services/kazakhCopy.ts in batches.

Usage:  from _kkwrite import apply; apply(NEW, LO, HI)
`NEW` must hold exactly the union keys in the half-open slice [LO, HI).
"""
import io, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from trio import read, write

MARKER = "export const KK: Record<string, string> = {"
HEAD = """// Kazakh UI copy.
// Cyrillic, matching the text edition the reader is given: Khalifah Altai's
// translation (tr_kk_khalifah_altai), which is printed in Cyrillic. The
// register is the one Kazakh Muslims pray in, and it is the Kazakh Islamic
// vocabulary rather than a calque of English or a borrowing from Russian: the
// prayer is намаз, the fast is ораза, the obligatory alms are зекет, free
// giving is садақа, the small ablution is дәрет and the full washing is ғұсыл,
// the call to prayer is азан, supplication is дұға and remembrance is зікір.
// God is Алла — the name Kazakh Muslims have always used, rather than a
// generic word for a deity. The month is Рамазан, as Kazakh says it, and the
// two festivals are Ораза айт and Құрбан айт.
//
// Surah names follow the convention every other language in this app uses —
// the Arabic name carried into the local script — so they read Фатиха and
// Бақара rather than by meaning. See src/content/surahNames.ts.

"""
PATH = 'src/services/kazakhCopy.ts'


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
    if s.count('{{') or not s.startswith('// Kazakh UI copy.'):
        s = s.replace('{{', '{')
        if not s.startswith('// Kazakh UI copy.'):
            s = HEAD + s[s.index(MARKER):]
        io.open(PATH, 'w', encoding='utf-8').write(s)
    assert '{{' not in io.open(PATH, encoding='utf-8').read()
    print('ok +%d -> total %d / %d' % (len(new), len(body), len(u)))
