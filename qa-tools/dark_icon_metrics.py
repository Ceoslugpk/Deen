"""Measure dark-mode tool icons against the thresholds calibrated on the accepted set.

Usage:
    python3 qa-tools/dark_icon_metrics.py <icon-dark.png> [...]

Columns
    size          160x160 is required by app.json / the asset catalogue
    border        max alpha over every pixel on the frame edge      (want < 10)
    corners       mean alpha of the four 12x12 corner blocks        (want < 25)
    light         mean lightness of opaque pixels (alpha >= 128)    (want >= 0.41)
    mid           share of pixels with 10 < alpha < 245             (want <= 14%)
    solid         share of pixels with alpha >= 245

`mid` is legitimately high (34-40%) on the icons whose design is a radial glow
(prayer-fajr, prayer-asr, prayer-isha, hadith); judge those on `corners`.
"""
import sys
from pathlib import Path

from PIL import Image

LIGHT_MIN = 0.41
MID_MAX = 0.14
CORNER_MAX = 25.0
BORDER_MAX = 10
CLEAR_MIN = 0.25     # below this the frame is filled, not transparent



def metrics(path):
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()

    opaque = sum(1 for y in range(h) for x in range(w) if px[x, y][3] >= 128)
    total = w * h
    light = 0.0
    if opaque:
        acc = 0.0
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a >= 128:
                    acc += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0
        light = acc / opaque

    border = max(
        [px[x, 0][3] for x in range(w)]
        + [px[x, h - 1][3] for x in range(w)]
        + [px[0, y][3] for y in range(h)]
        + [px[w - 1, y][3] for y in range(h)]
    )

    k = 12
    blocks = [
        [(x, y) for y in range(k) for x in range(k)],
        [(x, y) for y in range(k) for x in range(w - k, w)],
        [(x, y) for y in range(h - k, h) for x in range(k)],
        [(x, y) for y in range(h - k, h) for x in range(w - k, w)],
    ]
    corners = max(
        sum(px[x, y][3] for x, y in blk) / float(len(blk)) for blk in blocks
    )

    mid = sum(1 for y in range(h) for x in range(w) if 10 < px[x, y][3] < 245)
    solid = sum(1 for y in range(h) for x in range(w) if px[x, y][3] >= 245)
    clear = sum(1 for y in range(h) for x in range(w) if px[x, y][3] < 10)
    return {
        'size': f'{w}x{h}',
        'border': border,
        'corners': corners,
        'light': light,
        'mid': mid / float(total),
        'solid': solid / float(total),
        'clear': clear / float(total),
        'opaque': opaque / float(total),
    }


def verdict(m, dark=True):
    """Applies the thresholds. Light icons are judged on absence of ground, not tone."""
    fails = []
    if m['size'] != '160x160':
        fails.append('SIZE')
    if m['border'] >= BORDER_MAX:
        fails.append('EDGE')
    if m['corners'] >= CORNER_MAX:
        fails.append('PANEL')
    if m['clear'] < CLEAR_MIN:
        fails.append('FILLED')
    if m['opaque'] < 0.02:
        fails.append('EMPTY')
    if dark:
        if m['light'] < LIGHT_MIN:
            fails.append('DARK')
        if m['mid'] > MID_MAX:
            fails.append('HAZE')
    return ','.join(fails) if fails else 'ok'


def main(paths):
    print(f"{'icon':<28}{'size':>9}{'clear':>7}{'border':>8}{'corners':>9}{'light':>7}{'mid':>7}   verdict")
    flagged = 0
    for p in paths:
        m = metrics(p)
        dark = p.endswith('-dark.png')
        note = verdict(m, dark)
        if note != 'ok':
            flagged += 1
        print(
            f"{Path(p).name.removesuffix('.png'):<28}{m['size']:>9}{m['clear']:>6.0%}"
            f"{m['border']:>8}{m['corners']:>9.1f}{m['light']:>7.2f}{m['mid']:>6.0%}   {note}"
        )
    print(f"\n{len(paths)} icons, {flagged} flagged")


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        print(__doc__)
    else:
        main(args)
