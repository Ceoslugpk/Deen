# -*- coding: utf-8 -*-
"""Escape-aware reader/writer for the copy tables.

The regex captures the RAW (still-escaped) text between the quotes, so a
writer that escapes again double-escapes. These decode on read and encode
on write, which makes a sort-and-rewrite idempotent -- and repairs the 20
Turkish values that shipped with a stray backslash before an apostrophe
('Kur\\'an' where 'Kur'an' was meant).
"""
import io, re

ROW = re.compile(r"^\s*'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)',\s*$", re.M)

def unescape(s):
    if '\\' not in s:
        return s
    out, i = [], 0
    while i < len(s):
        c = s[i]
        if c == '\\' and i + 1 < len(s):
            n = s[i+1]
            out.append({'n':'\n','t':'\t','r':'\r','\\':'\\',"'":"'",'"':'"','0':'\0'}.get(n, '\\' + n))
            i += 2
        else:
            out.append(c); i += 1
    return ''.join(out)

def clean(v):
    # A stray backslash immediately before an apostrophe is never wanted in
    # these tables; it renders as Kur\'an.
    while "\\'" in v:
        v = v.replace("\\'", "'")
    return v

def escape(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

def q(x):
    return "'" + escape(x) + "'"

def read(path, marker):
    """Return (head, body_dict, tail) for the Record opened by `marker`."""
    s = io.open(path, encoding='utf-8').read()
    i = s.index(marker)
    j = s.index('\n};', i)
    body = {clean(unescape(k)): clean(unescape(v)) for k, v in ROW.findall(s[i:j+3])}
    return s[:i], body, s[j+3:]

def write(path, head, body, marker, tail):
    lines = ''.join('  %s: %s,\n' % (q(k), q(body[k])) for k in sorted(body))
    io.open(path, 'w', encoding='utf-8').write(
        head + marker + '{\n' + lines + '};\n' + tail)
