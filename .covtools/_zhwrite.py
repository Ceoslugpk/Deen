# -*- coding: utf-8 -*-
"""Shared driver for building src/services/chineseCopy.ts in batches.

Usage:  from _zhwrite import apply; apply(NEW, LO, HI)
`NEW` must hold exactly the union keys in the half-open slice [LO, HI).
"""
import io, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from trio import read, write

MARKER = "export const ZH: Record<string, string> = {"
HEAD = """// Chinese UI copy.
// Simplified Chinese, matching the text edition the reader is given: Ma
// Jian's translation (tr_zh_ma_jian), which is printed in Simplified. The
// register is the one Chinese Muslims pray in, and it is the Chinese Islamic
// vocabulary rather than a calque of English: the prayer is 礼拜 and 拜功, the
// fast is 斋戒, the obligatory alms are 天课, the pre-dawn meal is 封斋饭 and
// the meal that breaks the fast is 开斋饭, the ablution is 小净 and the full
// washing is 大净, and God is 真主 — the name Chinese Muslims have used for
// centuries, rather than a generic word for a deity. Terms that Chinese
// Muslims keep in Arabic stay as Chinese Muslims say them: 古兰经, 苏勒,
// 阿耶, 卷, 赞词, 都阿.
//
// Surah names follow the convention every other language in this app uses —
// the Arabic name carried into the local script — so they read 法谛海 and
// 百格勒 rather than by meaning. See src/content/surahNames.ts.

"""
PATH = 'src/services/chineseCopy.ts'


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
    if s.count('{{') or not s.startswith('// Chinese UI copy.'):
        s = s.replace('{{', '{')
        if not s.startswith('// Chinese UI copy.'):
            s = HEAD + s[s.index(MARKER):]
        io.open(PATH, 'w', encoding='utf-8').write(s)
    assert '{{' not in io.open(PATH, encoding='utf-8').read()
    print('ok +%d -> total %d / %d' % (len(new), len(body), len(u)))
