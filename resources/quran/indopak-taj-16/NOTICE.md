# Taj Company 16-line IndoPak Quran resources

This resource is edition-specific: **548 pages**, not the Madani 604-page layout.

## Sources and credits

- Printed edition: **Taj Company, IndoPak 16 lines**.
- Layout: **QUL / Tarteel**, https://qul.tarteel.ai/resources/mushaf-layout/11 . The original SQLite database is retained here byte-for-byte.
- Word text: **QuranWBW IndoPak Nastaleeq**, hosted by the app owner's Islamic Data API at https://api.islamicdata.uz/v1/files/Quran%20Script/indopak-nastaleeq.json . Corresponding QUL resource: https://qul.tarteel.ai/resources/quran-script/59 . Quran text is copied verbatim; no normalization, diacritic removal, tatweel insertion, or replacement of private-use marks is performed.
- Font: **AlQuran IndoPak by QuranWBW**, Ayman Siddiqui, based on Al Qalam Quran Majeed / Al Qalam Quran Majeed Web. Credits in the original font: Al Qalam, Ghandhara, KFGQPC, Ayman Siddiqui; Abdul Majeed Khan, Arif Karim, Shakir-ul-Qadree, Jawad. QUL resource: https://qul.tarteel.ai/resources/font/242 . The uploaded font is retained unmodified at `assets/fonts/IndopakNastaleeq.ttf`.
- Canonical Surah metadata: the app owner's `/v1/structure` response. Juz boundaries: the app's existing canonical verse-based division table; **not** its Madani page numbers.

## Permission status

Before implementation the owner explicitly confirmed in this conversation that the required provider permissions for development, bundling and published-app distribution had been obtained. No additional permission conditions or permission documents were supplied. This records the owner's confirmation; it is **not an independent rights verification or a grant to third parties**. Forks/reusers must obtain their own applicable permissions. Do not assume that the app's source-code license covers these resources. Keep all original credits and notices.

The original font's embedded notice is reproduced in `FONT-LICENSE.txt`. Permission for this app does not make the font openly licensed and does not authorize modifications or unrelated uses.

## Integrity and regeneration

- Original SQLite SHA-256: `153c9a717c373d824a9fd973ef256f4d009959edd601b87d216ad102c5806281`
- Original font SHA-256: `a6463e24e36651404e9eff52dae26e18e9ef0718eb620636a66a20026a75c563`
- Original raw word JSON SHA-256: `897ac06f3f508915b6e30fd6c16b1bdf8dc540f59482227f6b503cf0f981c5af`
- Pinned Surah metadata (`structure.json`) SHA-256: `e2122e25248fe70acf68ea8fca566560524e14797aa493b0d2a84dc4fa0d6c40`

`scripts/build_indopak_16.py` validates every word placement and all 114 Surah starts, then emits compact, lazy-loaded JSON assets for Android, iOS and web. Install the pinned generator-only dependencies with `pip install uharfbuzz==0.57.0 fonttools==4.68.0`; normal Expo builds need neither Python nor those packages. Run `python3 scripts/build_indopak_16.py --words /path/to/original/indopak-nastaleeq.json` to use a local checksum-verified source; without `--words`, it downloads and verifies that same source.

Page typography uses the original font's glyph contours at explicit right-to-left HarfBuzz positions. This avoids platform-specific SVG text shaping separating leading waqf marks from private-use ayah symbols. The contours/positions are rendering metadata, not a modified or subset font, and remain subject to the applicable resource permissions. The original TTF is also bundled unchanged and loaded for the verse preview. No replacement alphabet or edited Quran strings are introduced.

Large page/shape tables use UTF-8 JSON-string envelopes so native compilers do not have to optimize millions of numeric array operands. The runtime parses page chunks on demand and keeps at most six expanded chunks and 512 composed word paths. Expo builds use the checked-in assets and do not query the API or require a SQLite native dependency.

The original database has 8,742 rows. Source-defined shorter pages are preserved: pages 1 and 2 have 7 rows, 529 and 530 have 15, and 548 has 10. No missing words or discontinuities were found. These are not padded with invented text or inferred heading/basmalah rows.
