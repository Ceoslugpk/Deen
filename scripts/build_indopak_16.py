#!/usr/bin/env python3
"""Rebuild the offline Taj 16-line assets, without rewriting Quran text.

Requires: pip install uharfbuzz==0.57.0 fonttools==4.68.0
Normal Expo builds consume the checked-in JSON and need neither Python nor a network.
Input checksums deliberately fail closed if a provider changes a source.
"""
from pathlib import Path
import argparse
from collections import Counter
import hashlib
import io
import json
import sqlite3
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
LAYOUT_SHA = '153c9a717c373d824a9fd973ef256f4d009959edd601b87d216ad102c5806281'
FONT_SHA = 'a6463e24e36651404e9eff52dae26e18e9ef0718eb620636a66a20026a75c563'
WORDS_SHA = '897ac06f3f508915b6e30fd6c16b1bdf8dc540f59482227f6b503cf0f981c5af'
CHAPTERS_SHA = 'e2122e25248fe70acf68ea8fca566560524e14797aa493b0d2a84dc4fa0d6c40'
WORDS_URL = 'https://api.islamicdata.uz/v1/files/Quran%20Script/indopak-nastaleeq.json'
CHUNK_SIZE = 32


def sha(data):
    return hashlib.sha256(data).hexdigest()


def checked(path, expected):
    data = path.read_bytes()
    if sha(data) != expected:
        raise ValueError(f'Unapproved source checksum: {path}')
    return data


def main():
    import uharfbuzz as hb
    from fontTools.ttLib import TTFont
    from fontTools.pens.basePen import BasePen
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--layout', type=Path, default=ROOT / 'resources/quran/indopak-taj-16/taj-indopak-16-lines.db')
    parser.add_argument('--font', type=Path, default=ROOT / 'assets/fonts/IndopakNastaleeq.ttf')
    parser.add_argument('--words', type=Path)
    parser.add_argument('--chapters', type=Path, default=ROOT / 'resources/quran/indopak-taj-16/structure.json', help='Pinned /v1/structure response')
    args = parser.parse_args()
    layout_bytes = checked(args.layout, LAYOUT_SHA)
    font_bytes = checked(args.font, FONT_SHA)
    if args.words:
        word_bytes = checked(args.words, WORDS_SHA)
    else:
        with urllib.request.urlopen(WORDS_URL, timeout=45) as response:
            word_bytes = response.read()
        if sha(word_bytes) != WORDS_SHA:
            raise ValueError('The published word resource changed; review before rebuilding')
    source_words = json.loads(word_bytes)
    words = {int(w['id']): w for w in source_words.values()}
    if len(words) != 83668 or set(words) != set(range(1, 83669)):
        raise ValueError('Incomplete or repeated word IDs')
    verse_keys = {(int(w['surah']), int(w['ayah'])) for w in words.values()}
    if len(verse_keys) != 6236 or len({s for s, _ in verse_keys}) != 114:
        raise ValueError('Incomplete verse/surah coverage')
    for word in words.values():
        expected = f"{word['surah']}:{word['ayah']}:{word['word']}"
        if word['location'] != expected or not word['text']:
            raise ValueError(f'Invalid word location/text: {expected}')

    con = sqlite3.connect(args.layout.resolve().as_uri() + '?mode=ro', uri=True)
    con.row_factory = sqlite3.Row
    con.execute('PRAGMA query_only=ON')
    con.execute('PRAGMA trusted_schema=OFF')
    if con.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
        raise ValueError('Layout database failed integrity check')
    info = dict(con.execute('SELECT * FROM info').fetchone())
    if (info['number_of_pages'], info['lines_per_page'], info['font_name']) != (548, 16, 'indopak-nastaleeq'):
        raise ValueError('Unexpected Mushaf edition')
    rows = [dict(r) for r in con.execute('SELECT * FROM pages ORDER BY page_number,line_number')]
    con.close()
    counts = Counter(r['page_number'] for r in rows)
    if set(counts) != set(range(1, 549)) or len(rows) != 8742:
        raise ValueError('Incomplete layout')
    covered = []
    surah_starts = {}
    for index, row in enumerate(rows):
        if row['line_type'] == 'ayah':
            first, last = row['first_word_id'], row['last_word_id']
            if not isinstance(first, int) or not isinstance(last, int) or first > last:
                raise ValueError('Invalid word range')
            covered.extend(range(first, last + 1))
        elif row['line_type'] == 'surah_name':
            next_line = next(r for r in rows[index + 1:] if r['line_type'] == 'ayah')
            first = words[next_line['first_word_id']]
            if (int(first['surah']), int(first['ayah']), int(first['word'])) != (row['surah_number'], 1, 1):
                raise ValueError('Surah heading does not match the word resource')
            surah_starts[str(row['surah_number'])] = row['page_number']
        elif row['line_type'] != 'basmallah':
            raise ValueError('Unknown line type')
    if covered != list(range(1, 83669)) or len(surah_starts) != 114:
        raise ValueError('Omitted, duplicated, or out-of-order Quran words')

    face = hb.Face(font_bytes)
    font = hb.Font(face)
    font.scale = (face.upem, face.upem)
    hb.ot_font_set_funcs(font)
    # SVG text shapers differ between platforms and split leading waqf marks from
    # PUA ayah symbols. Draw the original font's unchanged outlines at HarfBuzz
    # positions instead. Keep the original text as well as the original TTF.
    shapes, shape_ids, metrics, used_glyphs = [], {}, {}, set()

    def shape_text(text):
        if text not in metrics:
            buffer = hb.Buffer()
            buffer.add_str(text)
            buffer.direction, buffer.script, buffer.language = 'rtl', 'arab', 'ur'
            hb.shape(font, buffer)
            pen = left = right = top = bottom = 0
            placed = []
            for glyph, pos in zip(buffer.glyph_infos, buffer.glyph_positions):
                if glyph.codepoint == 0:
                    raise ValueError(f'Missing font glyph in {text!r}')
                ext = font.get_glyph_extents(glyph.codepoint)
                if ext:
                    x = pen + pos.x_offset + ext.x_bearing
                    y = pos.y_offset + ext.y_bearing
                    left, right = min(left, x), max(right, x + ext.width)
                    top, bottom = max(top, y), min(bottom, y + ext.height)
                placed.extend((glyph.codepoint, pen + pos.x_offset, pos.y_offset))
                used_glyphs.add(glyph.codepoint)
                pen += pos.x_advance
            shape_ids[text] = len(shapes)
            shapes.append(placed)
            metrics[text] = [pen, left, right, top, bottom, shape_ids[text]]
        return metrics[text]

    shaped = {word_id: [int(w['surah']), int(w['ayah']), int(w['word']), w['text'], *shape_text(w['text'])]
              for word_id, w in words.items()}

    chapter_bytes = checked(args.chapters, CHAPTERS_SHA)
    structure = json.loads(chapter_bytes)
    chapters = sorted(structure['surahs'], key=lambda c: c['id'])
    if [c['id'] for c in chapters] != list(range(1, 115)):
        raise ValueError('Incomplete Surah metadata')
    for chapter in chapters:
        if sum(1 for s, _ in verse_keys if s == chapter['id']) != chapter['verses_count']:
            raise ValueError('Surah metadata/word numbering mismatch')
    chapters = [{'id': c['id'], 'name': c['name_simple'], 'arabic': c['name_arabic'], 'verses': c['verses_count'],
                 'page': surah_starts[str(c['id'])], 'heading': [c['id'], 0, 0, c['name_arabic'], *shape_text(c['name_arabic'])]}
                for c in chapters]

    class RelativePathPen(BasePen):
        # Each glyph starts at (0,0). Runtime can prepend one absolute M x y and
        # concatenate these relative contours into ONE path for each Quran word.
        # No path simplification, rasterization, subsetting or font-file changes.
        def __init__(self, glyph_set):
            super().__init__(glyph_set)
            self.commands, self.point, self.start = [], (0, 0), (0, 0)

        def append(self, command, *points):
            x, y = self.point
            values = [v for px, py in points for v in (px - x, py - y)]
            self.commands.append(command + ' '.join(str(int(v)) if v == int(v) else repr(v) for v in values))
            self.point = points[-1]

        def _moveTo(self, point):
            self.append('m', point)
            self.start = point

        def _lineTo(self, point):
            self.append('l', point)

        def _curveToOne(self, a, b, c):
            self.append('c', a, b, c)

        def _qCurveToOne(self, a, b):
            self.append('q', a, b)

        def _closePath(self):
            self.commands.append('z')
            self.point = self.start

        def _endPath(self):
            pass

    original_font = TTFont(io.BytesIO(font_bytes))
    glyph_set, glyph_paths = original_font.getGlyphSet(), {}
    for glyph_id in sorted(used_glyphs):
        pen = RelativePathPen(glyph_set)
        glyph_set[original_font.getGlyphName(glyph_id)].draw(pen)
        glyph_paths[str(glyph_id)] = ''.join(pen.commands)
    original_font.close()

    pages = []
    for page_number in range(1, 549):
        selected = [r for r in rows if r['page_number'] == page_number]
        if [r['line_number'] for r in selected] != list(range(1, len(selected) + 1)):
            raise ValueError('Repeated or missing printed line numbers')
        ayahs = [r for r in selected if r['line_type'] == 'ayah']
        first, last = ayahs[0]['first_word_id'], ayahs[-1]['last_word_id']
        lines = []
        for r in selected:
            line = {'n': r['line_number'], 't': r['line_type'], 'c': bool(r['is_centered'])}
            if r['line_type'] == 'ayah':
                line.update(f=r['first_word_id'], l=r['last_word_id'])
            elif r['line_type'] == 'surah_name':
                line['s'] = r['surah_number']
            lines.append(line)
        pages.append({'n': page_number, 'firstWord': first, 'lines': lines, 'words': [shaped[i] for i in range(first, last + 1)]})

    verse_pages = {}
    for page in pages:
        for word in page['words']:
            verse_pages.setdefault(f'{word[0]}:{word[1]}', page['n'])
    division_data = json.loads((ROOT / 'src/data/mushaf-pages.json').read_text())
    juz = []
    for number in range(1, 31):
        surah, ayah, _ = division_data['juz'][str(number)][0]
        juz.append({'id': number, 'verse': f'{surah}:{ayah}', 'page': verse_pages[f'{surah}:{ayah}']})

    output = ROOT / 'src/data/indopak16'
    output.mkdir(parents=True, exist_ok=True)
    def packed_json(filename, value):
        # Keep large numeric tables as one UTF-8 JSON string per module. Hermes
        # need not optimize millions of array-literal operands during a build;
        # the reader parses only the requested chunk with native JSON.parse.
        payload = json.dumps(value, ensure_ascii=False, separators=(',', ':'))
        envelope = {'encoding': 'utf8-json-v1', 'json': payload}
        (output / filename).write_text(json.dumps(envelope, ensure_ascii=False, separators=(',', ':')) + '\n')

    (output / 'glyphs.json').write_text(json.dumps(glyph_paths, separators=(',', ':')) + '\n')
    packed_json('shapes.json', shapes)
    chunks = []
    for start in range(0, len(pages), CHUNK_SIZE):
        name = f'pages-{start // CHUNK_SIZE + 1:02}.json'
        packed_json(name, pages[start:start + CHUNK_SIZE])
        chunks.append(name)
    meta = {
        'schemaVersion': 3, 'edition': 'indopak-taj-16', 'pageCount': 548, 'linesPerPage': 16,
        'wordCount': 83668, 'verseCount': 6236, 'chunkSize': CHUNK_SIZE, 'unitsPerEm': face.upem,
        'spaceAdvance': font.get_glyph_h_advance(font.get_nominal_glyph(32)),
        'shapeCount': len(shapes), 'glyphCount': len(glyph_paths),
        'renderer': 'original-font-outlines-harfbuzz-0.57.0', 'storage': 'utf8-json-v1',
        'basmallah': [shaped[i] for i in range(1, 5)], 'chapters': chapters, 'juz': juz,
        'source': {'layout': 'https://qul.tarteel.ai/resources/mushaf-layout/11', 'words': WORDS_URL,
                   'font': 'https://qul.tarteel.ai/resources/font/242', 'layoutSha256': sha(layout_bytes),
                   'wordsSha256': sha(word_bytes), 'fontSha256': sha(font_bytes), 'chaptersSha256': sha(chapter_bytes)},
        'shortPages': {str(p): n for p, n in counts.items() if n != 16},
    }
    (output / 'meta.json').write_text(json.dumps(meta, ensure_ascii=False, separators=(',', ':')) + '\n')
    loaders = "// Generated by scripts/build_indopak_16.py. Lazy evaluation keeps unrelated screens unchanged.\nexport const INDOPAK_CHUNKS: Array<() => unknown> = [\n"
    loaders += ''.join(f"  () => require('../data/indopak16/{name}'),\n" for name in chunks) + '];\n'
    (ROOT / 'src/services/indopakChunks.ts').write_text(loaders)
    print(f'Validated {len(pages)} pages / {len(rows)} source rows / {len(covered)} words / {len(verse_keys)} verses; wrote {len(chunks)} lazy chunks.')
    print('Source-defined shorter pages:', meta['shortPages'])
    print('Generated bytes:', sum(p.stat().st_size for p in output.glob('*.json')))


if __name__ == '__main__':
    main()
