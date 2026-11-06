# -*- coding: utf-8 -*-
"""Insert SURAH_NAMES_UZ into src/content/surahNames.ts.

The 114 names come from five independent published Uzbek translations on
old.quranenc.com (mansour, mokhtasar, moyassar, rwwad, sadiq), which agree
on every one of the 114.
"""
import io, json

names = json.load(open('/tmp/uz_names.json'))['final']
assert len(names) == 114
assert len(set(names.values())) == 114

p = 'src/content/surahNames.ts'
s = io.open(p, encoding='utf-8').read()

# 1) widen the language union
old = "export type SurahNameLanguage = 'en' | 'ar' | 'ur' | 'fa' | 'id' | 'hi' | 'ml' | 'tr' | 'ru' | 'fr' | 'bn' | 'ms' | 'ta';"
new = "export type SurahNameLanguage = 'en' | 'ar' | 'ur' | 'fa' | 'id' | 'hi' | 'ml' | 'tr' | 'ru' | 'fr' | 'bn' | 'ms' | 'ta' | 'uz';"
assert s.count(old) == 1, 'type union not found'
s = s.replace(old, new)

# 2) the table, inserted immediately before TABLES
block = "export const SURAH_NAMES_UZ: Record<number, string> = {\n"
for i in range(1, 115):
    v = names[str(i)]
    assert "'" not in v, v
    block += "  %d: '%s',\n" % (i, v)
block += "};\n\n"
anchor = "const TABLES: Record<SurahNameLanguage, Record<number, string>> = {"
assert s.count(anchor) == 1, 'TABLES anchor not found'
s = s.replace(anchor, block + anchor)

# 3) register it
old_t = "  ta: SURAH_NAMES_TA,\n};"
new_t = "  ta: SURAH_NAMES_TA,\n  uz: SURAH_NAMES_UZ,\n};"
assert s.count(old_t) == 1, 'TABLES entry not found'
s = s.replace(old_t, new_t)

io.open(p, 'w', encoding='utf-8').write(s)
print('inserted SURAH_NAMES_UZ: 114 rows, %d unique' % len(set(names.values())))
