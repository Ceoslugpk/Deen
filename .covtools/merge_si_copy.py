# -*- coding: utf-8 -*-
"""Merge .covtools/si/b01..b22.json into src/services/sinhalaCopy.ts."""
import glob
import io
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

union = json.load(open(os.path.join(ROOT, '.covtools', 'bs', 'union.json'), encoding='utf-8'))

merged = {}
for path in sorted(glob.glob(os.path.join(ROOT, '.covtools', 'si', 'b*.json'))):
    merged.update(json.load(open(path, encoding='utf-8')))

assert set(merged) == set(union), (
    'missing', sorted(set(union) - set(merged))[:10],
    'extra', sorted(set(merged) - set(union))[:10],
)
assert len(merged) == len(union) == 2766, len(merged)

for k, v in merged.items():
    for ch in (chr(39), chr(92), chr(10), chr(13)):
        assert ch not in k and ch not in v, (ch, k)

HEADER = u'''// Sinhala UI copy.
//
// In the register Sri Lankan Muslims actually pray in, drawn from the
// Naseem Isamil and Masoor Maulana edition the reader is given
// (tr_si_naseem_isamil_and_masoor_maulana) - the clearest of the six Sinhala
// editions on the API, and the only group whose text is Sinhala rather than a
// romanisation of it. That edition's own word choice was checked first across
// 707 sampled verses: God is අල්ලාහ් (358 times, against දෙවියන් 137 for the
// generic Lord), the Messenger is රසූල් and the prophet is නබි, the angels are
// මලායික, the prayer is සලාත් and the alms සකාත්, the fast is උපවාසය and the
// pilgrimage හජ්. The mosque is මස්ජිද and the direction of prayer කිබ්ලාව.
//
// The Quran text carries none of the reader's own vocabulary - සූරා, ආයත්,
// දුආ, ජන්නත්, සුන්නා, රමලාන් and වුදු are absent from all sixteen sampled
// surahs - so those come from Sinhala Muslim usage instead, and are
// transliterated rather than translated: the surah is සූරා, the ayah ආයත්, the
// juz ජුස් and the hizb හිස්බ්, the supplication දුආ and the remembrance දික්ර්.
// The same rule holds for the rites and the names: තයම්මම් for tayammum,
// ස්නානය for the ghusl, ෆජ්ර් ලුහ්ර් අස්ර් මඃරිබ් ඉෂා for the five prayers,
// හනෆි මාලිකී ෂාෆි හන්බලී for the schools. Reciters, authors and months are
// transliterated too; the Prophet is never named bare.
//
// Where the madhabs differ - the minimum and maximum of hayd, whether the
// Quran may be recited in it, the nisab threshold - the app describes the
// difference rather than settling it, and says so on the screen.
//
// A Sinhala face ships with this language: no font in assets/fonts covered the
// script, so Noto Sans Sinhala was subsetted and grafted onto DM Sans as
// DMSansSinhala, and it is swapped in only while the UI language is Sinhala.
//
// Keys are the English strings, so any untranslated key falls back to
// English at the call site.


export const SI: Record<string, string> = {
'''

lines = [HEADER]
for key in union:
    lines.append("  '%s': '%s',\n" % (key, merged[key]))
lines.append('};\n')

out = os.path.join(ROOT, 'src', 'services', 'sinhalaCopy.ts')
io.open(out, 'w', encoding='utf-8', newline='\n').write(u''.join(lines))
print('wrote', out, len(union), 'entries')
