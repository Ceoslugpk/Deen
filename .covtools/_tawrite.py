# -*- coding: utf-8 -*-
"""Shared driver for building src/services/tamilCopy.ts in batches."""
import io, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from trio import read, write

MARKER = "export const TA: Record<string, string> = {"
HEAD = """// Tamil UI copy.
// Tamil is written left-to-right, and this glossary follows the usage of Tamil
// Muslims rather than a literal rendering of the Arabic: the prayer is
// தொழுகை, the fast is நோன்பு, and the month is ரமலான். Terms that Tamil
// Muslims pronounce in their Arabic form are kept that way — ஜகாத், உளூ,
// குஸ்ல், திக்ர், துஆ — because those are the words a Tamil reader looks for.
//
// Surah names come from the Encyclopedia of the Noble Quran, cross-checked
// between two published Tamil translations (see src/content/surahNames.ts).

"""
PATH = 'src/services/tamilCopy.ts'

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
    if s.count('{{') or not s.startswith('// Tamil UI copy.'):
        s = s.replace('{{', '{')
        if not s.startswith('// Tamil UI copy.'):
            s = HEAD + s[s.index(MARKER):]
        io.open(PATH, 'w', encoding='utf-8').write(s)
    assert '{{' not in io.open(PATH, encoding='utf-8').read()
    print('ok +%d -> total %d / %d' % (len(new), len(body), len(u)))
