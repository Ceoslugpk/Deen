"""Draws the navigation as it now stands: the header with its three actions and
the floating tab bar with its five tabs, in both themes and in Arabic.

Nothing here renders React. It rebuilds the same geometry from App.tsx — 36px
mark, three 40px header buttons, a 66px bar with 23px icons — so a change to
the navigation can be looked at without a full export.

Usage:
    python3 qa-tools/nav_preview.py [out.png]
"""
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFont

S = 2  # device pixel ratio the sheet is drawn at
W = 940  # logical width of the sheet

FONT_NAME = 'assets/fonts/Newsreader-SemiBold.ttf'
FONT_UI = 'assets/fonts/DMSans-SemiBold.ttf'
FONT_UI_REG = 'assets/fonts/DMSans-Regular.ttf'
FONT_AR = 'assets/fonts/NotoNaskhArabic-SemiBold.ttf'

LIGHT = dict(bg='#F7F5F2', card='#FFFFFF', ink='#25233A', btn='#FFFFFF',
             btnLine='#E7E2E5', barLine='#E7E2E5', pill='#F2EFF8',
             on='#5146A4', off='#6B7180', cap='#6A6979')
DARK = dict(bg='#12111A', card='#1B1926', ink='#F1EDE6', btn='#0C0B12',
            btnLine='#0C0B12', barLine='#2E2A3C', pill='#241F33',
            on='#A79AEA', off='#6B7180', cap='#9C98AB')

TABS = [('Home', 'tab-home', 'الرئيسية'), ('Prayer', 'salah-guide', 'الصلاة'),
        ('Quran', 'quran', 'القرآن'), ('Library', 'tab-library', 'المكتبة'),
        ('Tools', 'tab-tools', 'الأدوات')]


def punch(layer, mask):
    """Erase a layer wherever `mask` is opaque — how the crescent is cut."""
    r, g, b, a = layer.split()
    a = ImageChops.multiply(a, ImageChops.invert(mask.split()[3]))
    return Image.merge('RGBA', (r, g, b, a))


def glyph(kind, n, col):
    """A bell, a crescent, or a gear, drawn at n×n and returned with alpha."""
    layer = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = n / 2

    if kind == 'bell':
        top, bot = c - 0.30 * n, c + 0.26 * n
        d.pieslice([c - 0.28 * n, top, c + 0.28 * n, top + 0.56 * n], 180, 360, fill=col)
        d.polygon([(c - 0.28 * n, top + 0.28 * n), (c - 0.30 * n, bot - 0.10 * n),
                   (c + 0.30 * n, bot - 0.10 * n), (c + 0.28 * n, top + 0.28 * n)], fill=col)
        d.rounded_rectangle([c - 0.34 * n, bot - 0.12 * n, c + 0.34 * n, bot - 0.02 * n],
                            radius=0.05 * n, fill=col)
        d.arc([c - 0.06 * n, bot - 0.02 * n, c + 0.06 * n, bot + 0.12 * n], 0, 180, fill=col, width=max(1, int(0.05 * n)))
        d.arc([c - 0.07 * n, top - 0.14 * n, c + 0.07 * n, top + 0.04 * n], 180, 360, fill=col, width=max(1, int(0.05 * n)))

    elif kind == 'moon':
        d.ellipse([c - 0.30 * n, c - 0.30 * n, c + 0.30 * n, c + 0.30 * n], fill=col)
        cut = Image.new('RGBA', (n, n), (0, 0, 0, 0))
        ImageDraw.Draw(cut).ellipse([c - 0.30 * n + 0.17 * n, c - 0.33 * n,
                                     c + 0.30 * n + 0.17 * n, c + 0.27 * n], fill=(0, 0, 0, 255))
        layer = punch(layer, cut)

    elif kind == 'gear':
        r_out, t = 0.30 * n, max(2, int(0.09 * n))
        d.ellipse([c - r_out, c - r_out, c + r_out, c + r_out], outline=col, width=t)
        for k in range(8):
            ang = k * 3.14159 / 4
            x1, y1 = c + 0.24 * n * -1 * _cos(ang), c + 0.24 * n * -1 * _sin(ang)
            x2, y2 = c + 0.40 * n * _cos(ang), c + 0.40 * n * _sin(ang)
            d.line([(x1, y1), (x2, y2)], fill=col, width=max(2, int(0.10 * n)))
        hole = Image.new('RGBA', (n, n), (0, 0, 0, 0))
        ImageDraw.Draw(hole).ellipse([c - 0.13 * n, c - 0.13 * n, c + 0.13 * n, c + 0.13 * n], fill=(0, 0, 0, 255))
        layer = punch(layer, hole)

    return layer


def _cos(a):
    import math
    return math.cos(a)


def _sin(a):
    import math
    return math.sin(a)


def header(theme, name='Deen Companion'):
    """The shared header: mark, wordmark, and three actions on the right."""
    h = 96
    img = Image.new('RGBA', (W * S, h * S), theme['bg'])
    d = ImageDraw.Draw(img)
    mid = h * S // 2
    pad = 20 * S

    mark = Image.open('assets/logo-mark-dark.png' if theme is DARK else 'assets/logo-mark.png')
    mark = mark.convert('RGBA').resize((36 * S, 36 * S), Image.LANCZOS)
    img.paste(mark, (pad, mid - 18 * S), mark)

    font = ImageFont.truetype(FONT_NAME, 20 * S)
    d.text((pad + 36 * S + 10 * S, mid), name, font=font, fill=theme['ink'], anchor='lm')

    bw, gap, n = 40 * S, 6 * S, 3
    x0 = W * S - pad - (n * bw + (n - 1) * gap)
    for i, kind in enumerate(('bell', 'moon', 'gear')):
        bx = x0 + i * (bw + gap)
        d.rounded_rectangle([bx, mid - bw // 2, bx + bw, mid + bw // 2], radius=14 * S,
                            fill=theme['btn'], outline=theme['btnLine'], width=max(1, S))
        g = glyph(kind, bw, theme['ink'])
        img.paste(g, (bx, mid - bw // 2), g)
    return img


def tabbar(theme, active=1, rtl=False):
    """The floating bar: 66px tall, five slots, a mint pill on the active one."""
    h = 110
    img = Image.new('RGBA', (W * S, h * S), theme['bg'])
    d = ImageDraw.Draw(img)

    bar_w, bar_h = min(max(W - 32, 300), 460), 66
    x0, y0 = (W * S - bar_w * S) // 2, (h * S - bar_h * S) // 2
    d.rounded_rectangle([x0, y0, x0 + bar_w * S, y0 + bar_h * S], radius=33 * S,
                        fill=theme['card'], outline=theme['barLine'], width=max(1, S))

    items = list(TABS)
    if rtl:
        items.reverse()
    slot = bar_w * S / len(items)
    label_font = ImageFont.truetype(FONT_AR if rtl else FONT_UI, 10 * S)

    for i, (label, icon, ar) in enumerate(items):
        text = ar if rtl else label
        cx = x0 + slot * i + slot / 2
        on = i == (len(items) - 1 - active if rtl else active)
        tw = d.textlength(text, font=label_font)
        pill_w = max(58 * S, tw + 24 * S)
        pill_h = 55 * S
        px, py = cx - pill_w / 2, y0 + (bar_h * S - pill_h) / 2
        if on:
            d.rounded_rectangle([px, py, px + pill_w, py + pill_h], radius=24 * S, fill=theme['pill'])

        src = f'assets/tool-icons/{icon}-dark.png' if theme is DARK else f'assets/tool-icons/{icon}.png'
        ic = Image.open(src).convert('RGBA').resize((23 * S, 23 * S), Image.LANCZOS)
        if not on:
            a = ic.split()[3].point(lambda v: int(v * 0.5))
            ic.putalpha(a)
        img.paste(ic, (int(cx - 11.5 * S), int(py + 8 * S)), ic)

        d.text((cx, py + 8 * S + 23 * S + 4 * S), text, font=label_font,
               fill=theme['on'] if on else theme['off'], anchor='ma')
    return img


def caption(text, theme):
    h = 30
    img = Image.new('RGBA', (W * S, h * S), theme['bg'])
    d = ImageDraw.Draw(img)
    d.text((20 * S, h * S - 10 * S), text, font=ImageFont.truetype(FONT_UI_REG, 12 * S), fill=theme['cap'])
    return img


def stack(parts):
    out = Image.new('RGBA', (W * S, sum(p.height for p in parts)), (0, 0, 0, 0))
    y = 0
    for p in parts:
        out.paste(p, (0, y), p)
        y += p.height
    return out


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'screenshots/nav-preview.png'
    parts = [
        caption('Header — light. Mark, wordmark, then notifications, theme, settings.', LIGHT),
        header(LIGHT),
        caption('Header — dark.', DARK),
        header(DARK),
        caption('Tab bar — light. Home, Prayer, Quran, Library, Tools; Prayer selected.', LIGHT),
        tabbar(LIGHT, active=1),
        caption('Tab bar — dark.', DARK),
        tabbar(DARK, active=1),
        caption('Tab bar — Arabic, laid out right to left.', LIGHT),
        tabbar(LIGHT, active=1, rtl=True),
    ]
    stack(parts).save(out)
    print(f'wrote {out}  {W}x{sum(p.height for p in parts) // S}')


if __name__ == '__main__':
    main()
