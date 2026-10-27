"""Lifts a generated dark-mode icon off its background.

The generator draws the icon lit on a dark, sometimes tinted, ground. This
estimates that ground from the border of the image, keys it out with a soft
threshold, and un-premultiplies the edge pixels so the illustration keeps its
own colours. Then it sizes the result to the 160px canvas the light icons use,
so the two variants line up in the layout.
"""
import sys
from pathlib import Path
from PIL import Image

SIZE = 160
NEAR = 18.0     # inside this distance from the ground the pixel is background
FAR = 92.0      # beyond it the pixel is fully the icon


def median(values):
    values = sorted(values)
    return values[len(values) // 2]


def ground(im):
    w, h = im.size
    px = im.load()
    r, g, b = [], [], []
    band = max(2, w // 40)
    for x in range(w):
        for y in list(range(band)) + list(range(h - band, h)):
            cr, cg, cb, ca = px[x, y]
            if ca > 10:
                r.append(cr); g.append(cg); b.append(cb)
    for y in range(h):
        for x in list(range(band)) + list(range(w - band, w)):
            cr, cg, cb, ca = px[x, y]
            if ca > 10:
                r.append(cr); g.append(cg); b.append(cb)
    if len(r) < 40:
        return (0, 0, 0)
    return (median(r), median(g), median(b))


def lift(path: Path) -> None:
    im = Image.open(path).convert('RGBA')
    if im.size[0] > SIZE:
        im = im.resize((SIZE, SIZE), Image.LANCZOS)
    br, bg, bb = ground(im)
    out = []
    for r, g, b, _a in im.getdata():
        dist = ((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2) ** 0.5
        if dist <= NEAR:
            out.append((0, 0, 0, 0)); continue
        alpha = 1.0 if dist >= FAR else (dist - NEAR) / (FAR - NEAR)
        cr = br + (r - br) / alpha
        cg = bg + (g - bg) / alpha
        cb = bb + (b - bb) / alpha
        out.append((max(0, min(255, round(cr))), max(0, min(255, round(cg))),
                    max(0, min(255, round(cb))), round(alpha * 255)))
    im.putdata(out)
    im.save(path)


def report(path: Path) -> None:
    px = list(Image.open(path).convert('RGBA').getdata())
    clear = sum(1 for q in px if q[3] < 10) / len(px)
    print('%-28s transparent %.0f%%' % (path.name, clear * 100))


def flood(path: Path, tol: float = 58.0) -> None:
    """Removes the background that is still joined to the edge of the frame.

    A single colour is not always enough: some generators paint a gradient or a
    card behind the icon. Growing outwards from the border stops at the icon.
    """
    from collections import deque
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()
    br, bg, bb = ground(im)
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if px[x, y][3] > 10:
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if px[x, y][3] > 10:
                q.append((x, y))
    while q:
        x, y = q.popleft()
        if seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        r, g, b, a = px[x, y]
        if a <= 10:
            continue
        d = ((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2) ** 0.5
        if d > tol:
            continue
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                q.append((nx, ny))
    im.save(path)



def wand(path: Path, step: float = 16.0, seed_tol: float = 70.0) -> None:
    """Removes the ground with a contiguous fill that follows a gradient.

    Keying on one colour fails when the generator shades the panel it paints
    behind the icon: the fill clears the outer ring and then stops. This grows
    the region from the border, accepting a neighbour when it is close to the
    pixel it came from, so a graded panel is taken whole.
    """
    from collections import deque
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()
    br, bg, bb = ground(im)
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if px[x, y][3] > 10:
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if px[x, y][3] > 10:
                q.append((x, y))
    while q:
        x, y = q.popleft()
        if seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        r, g, b, a = px[x, y]
        if a <= 10:
            continue
        if ((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2) ** 0.5 > seed_tol:
            continue
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if not (0 <= nx < w and 0 <= ny < h) or seen[ny * w + nx]:
                continue
            nr, ng, nb, na = px[nx, ny]
            if na <= 10:
                continue
            if ((nr - r) ** 2 + (ng - g) ** 2 + (nb - b) ** 2) ** 0.5 <= step:
                q.append((nx, ny))
    im.save(path)


def panel_key(path: Path, vmax: float = 110.0, chroma: float = 20.0) -> str:
    """Clears the grey plate the generator sometimes paints behind the icon.

    Some renders come back with the subject sitting on a neutral grey or black
    plate: near-black, no colour in it, and covering the whole frame. The
    subject is always lit — off-white, gold or indigo — so a dark and colourless
    pixel is the plate, not the artwork.

    Only ever run on a file that has been flagged. Several accepted icons carry
    dark indigo shapes of their own, and this would take a bite out of those.
    """
    im = Image.open(path).convert('RGBA')
    px = im.load()
    w, h = im.size
    band = 22
    corners = [px[ox + x, oy + y][3]
               for (ox, oy) in ((0, 0), (w - band, 0), (0, h - band), (w - band, h - band))
               for x in range(band) for y in range(band)]
    if sum(corners) / len(corners) < 25:
        return 'clean already — left alone'
    out = []
    for (r, g, b, a) in im.getdata():
        dark = max(r, g, b) < vmax
        flat = (max(r, g, b) - min(r, g, b)) < chroma
        out.append((r, g, b, 0) if (a > 10 and dark and flat) else (r, g, b, a))
    im.putdata(out)
    im.save(path)
    after = [px[ox + x, oy + y][3]
             for (ox, oy) in ((0, 0), (w - band, 0), (0, h - band), (w - band, h - band))
             for x in range(band) for y in range(band)]
    return 'corners %.0f -> %.0f' % (sum(corners) / len(corners), sum(after) / len(after))

if __name__ == '__main__' and len(sys.argv) > 1:
    # python3 qa-tools/dark_icon.py <paths…>          key out the ground and size to 160
    # python3 qa-tools/dark_icon.py --flood <paths…>  also remove a painted card
    mode = sys.argv[1]
    args = sys.argv[2:] if mode in ('--flood', '--wand', '--panel') else sys.argv[1:]
    for arg in args:
        p = Path(arg)
        if mode == '--flood':
            flood(p)
        elif mode == '--wand':
            wand(p)
        elif mode == '--panel':
            print('%-28s %s' % (p.name, panel_key(p)))
            continue
        else:
            lift(p)
        report(p)
