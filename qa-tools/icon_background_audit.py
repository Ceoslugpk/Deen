"""Finds painted backgrounds in the tool icons, light and dark.

The corner-block check catches a plate that reaches the corners. This looks for
the weaker cases too: a wash that stops just short of the edge, a border band
that is not quite clear, and a large connected region of paint that touches the
frame. Every icon is also compared with its counterpart in the other theme.

Usage:
    python3 qa-tools/icon_background_audit.py [assets/tool-icons]
"""
import sys
from collections import deque
from pathlib import Path

from PIL import Image

RING = 6          # width of the border band, in pixels
CORNER = 24       # side of each corner block


def load(path):
    im = Image.open(path).convert('RGBA')
    return im, im.load(), im.size


def shares(px, w, h):
    """Splits the frame into clear / wash / soft / solid by alpha."""
    buckets = [0, 0, 0, 0]
    for y in range(h):
        for x in range(w):
            a = px[x, y][3]
            if a < 10:
                buckets[0] += 1
            elif a < 100:
                buckets[1] += 1
            elif a < 245:
                buckets[2] += 1
            else:
                buckets[3] += 1
    n = float(w * h)
    return [b / n for b in buckets]


def ring_alpha(px, w, h, depth=RING):
    vals = []
    for x in range(w):
        for y in list(range(depth)) + list(range(h - depth, h)):
            vals.append(px[x, y][3])
    for y in range(h):
        for x in list(range(depth)) + list(range(w - depth, w)):
            vals.append(px[x, y][3])
    return sum(vals) / float(len(vals))


def corner_alpha(px, w, h, k=CORNER):
    blocks = [[(x, y) for y in range(k) for x in range(k)],
              [(x, y) for y in range(k) for x in range(w - k, w)],
              [(x, y) for y in range(h - k, h) for x in range(k)],
              [(x, y) for y in range(h - k, h) for x in range(w - k, w)]]
    means = [sum(px[x, y][3] for x, y in b) / float(len(b)) for b in blocks]
    return max(means), sum(means) / len(means)


def border_touch_share(px, w, h, thresh=10):
    """Share of the frame covered by paint that is connected to the edge.

    A plate is one big region joined to the border. A subject in the middle is
    not, so even a large icon scores low here.
    """
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if px[x, y][3] > thresh:
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if px[x, y][3] > thresh:
                q.append((x, y))
    count = 0
    while q:
        x, y = q.popleft()
        if seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        if px[x, y][3] <= thresh:
            continue
        count += 1
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and px[nx, ny][3] > thresh:
                q.append((nx, ny))
    return count / float(w * h)


def classify(clear, wash, ring, corner_max, corner_mean, touch):
    """Returns a note only when something in the frame is not the subject."""
    if corner_max >= 25 or touch >= 0.35:
        return 'PLATE'
    if touch >= 0.15 or corner_mean >= 8:
        return 'EDGE-PAINT'
    if wash >= 0.14 and clear < 0.55:
        return 'WASH'
    if ring >= 3:
        return 'RING'
    return ''


def main(root):
    root = Path(root)
    rows = []
    for light in sorted(root.glob('*.png')):
        if '-dark' in light.name:
            continue
        for path in (light, light.with_name(light.stem + '-dark.png')):
            if not path.exists():
                continue
            im, px, (w, h) = load(path)
            clear, wash, soft, solid = shares(px, w, h)
            ring = ring_alpha(px, w, h)
            corner_max, corner_mean = corner_alpha(px, w, h)
            touch = border_touch_share(px, w, h)
            rows.append({
                'name': path.stem, 'size': f'{w}x{h}',
                'clear': clear, 'wash': wash, 'soft': soft, 'solid': solid,
                'ring': ring, 'cmax': corner_max, 'cmean': corner_mean,
                'touch': touch,
                'note': classify(clear, wash, ring, corner_max, corner_mean, touch),
            })

    print(f"{'icon':<26}{'clear':>6}{'wash':>6}{'soft':>6}{'solid':>6}"
          f"{'ring':>6}{'cmax':>7}{'cmean':>7}{'touch':>7}   note")
    counts = {}
    for r in rows:
        counts[r['note'] or 'clean'] = counts.get(r['note'] or 'clean', 0) + 1
        if r['note']:
            print(f"{r['name']:<26}{r['clear']:>5.0%}{r['wash']:>6.0%}{r['soft']:>6.0%}{r['solid']:>6.0%}"
                  f"{r['ring']:>6.1f}{r['cmax']:>7.1f}{r['cmean']:>7.1f}{r['touch']:>6.0%}   {r['note']}")
    print()
    for k in sorted(counts, key=lambda k: -counts[k]):
        print(f"  {k:<12} {counts[k]}")
    print(f"  {'TOTAL':<12} {len(rows)}")

    # how the two themes compare, icon by icon
    print('\nlargest clear-share gap between light and dark (dark fills more):')
    by_name = {r['name']: r for r in rows}
    gaps = []
    for name, r in by_name.items():
        if name.endswith('-dark'):
            continue
        d = by_name.get(name + '-dark')
        if d:
            gaps.append((r['clear'] - d['clear'], name))
    for gap, name in sorted(gaps, reverse=True)[:12]:
        if gap > 0.05:
            print(f"  {name:<24} light {by_name[name]['clear']:.0%} clear vs dark {by_name[name + '-dark']['clear']:.0%}  (-{gap:.0%})")


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'assets/tool-icons')
