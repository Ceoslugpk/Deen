#!/usr/bin/env python3
"""Audit `src/` for exported symbols that nothing outside their own file uses.

Emits three buckets:
  A_DEAD   - zero references anywhere (incl. own file)  -> safe to delete the symbol
  B_LOCAL  - referenced only inside the defining file    -> drop `export`, keep symbol
  C_LIVE   - referenced from at least one other file     -> keep
"""
import re, subprocess, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def tracked(pats):
    out = subprocess.run(["git", "ls-files", "-z", "--"] + pats, cwd=ROOT,
                         capture_output=True, text=True).stdout
    return [p for p in out.split("\0") if p]

SOURCES = [p for p in tracked(["*.ts", "*.tsx", "*.js", "*.cjs", "*.json"])
           if not p.startswith("web-preview/")]
SRC = [p for p in SOURCES if p.startswith("src/")]

def read(p):
    try:
        return open(os.path.join(ROOT, p), encoding="utf-8").read()
    except Exception:
        return ""

def strip_noise(s):
    s = re.sub(r"/\*.*?\*/", " ", s, flags=re.S)
    s = re.sub(r"(?m)^\s*//.*$", " ", s)
    s = re.sub(r"(?m)^\s*\*.*$", " ", s)          # jsdoc continuation lines
    return s

TEXTS = {p: read(p) for p in SOURCES}
CLEAN = {p: strip_noise(TEXTS[p]) for p in SOURCES}

EXPORT_RE = re.compile(
    r"(?m)^[ \t]*export\s+"
    r"(?:declare\s+)?"
    r"(?:async\s+|default\s+)?"
    r"(?:const|let|var|function\*?|class|interface|type|enum|namespace)\s+"
    r"([A-Za-z_$][\w$]*)")
EXPORT_STAR = re.compile(r"(?m)^[ \t]*export\s*\*")
EXPORT_LIST = re.compile(r"(?m)^[ \t]*export\s*\{([^}]*)\}")

results = {}
for p in SRC:
    t = TEXTS[p]
    names = set(EXPORT_RE.findall(t))
    for m in EXPORT_LIST.finditer(t):
        for part in m.group(1).split(","):
            part = part.strip()
            if not part:
                continue
            orig = part.split(" as ")[0].strip()
            if re.fullmatch(r"[A-Za-z_$][\w$]*", orig):
                names.add(orig)
    for n in names:
        results.setdefault((p, n), {"kind": None})

# classify
buckets = {"A_DEAD": [], "B_LOCAL": [], "C_LIVE": []}
detail = {}
for (p, n) in sorted(results):
    hits = []
    for q in SOURCES:
        body = CLEAN[q]
        if not re.search(r"\b%s\b" % re.escape(n), body):
            continue
        if q == p:
            # count references in own file beyond the declaration line itself
            cnt = 0
            for line in CLEAN[q].splitlines():
                if re.search(r"\b%s\b" % re.escape(n), line):
                    if re.match(r"^[ \t]*export\s", line) and re.search(
                            r"export\s+(?:declare\s+)?(?:async\s+|default\s+)?"
                            r"(?:const|let|var|function\*?|class|interface|type|enum|namespace)\s+"
                            r"%s\b" % re.escape(n), line):
                        continue  # the declaration itself
                    cnt += 1
            if cnt:
                hits.append((q, cnt))
            continue
        cnt = len(re.findall(r"\b%s\b" % re.escape(n), body))
        if cnt:
            hits.append((q, cnt))
    outside = [h for h in hits if h[0] != p]
    if outside:
        buckets["C_LIVE"].append((p, n))
        detail[(p, n)] = outside
    elif hits:
        buckets["B_LOCAL"].append((p, n))
        detail[(p, n)] = hits
    else:
        buckets["A_DEAD"].append((p, n))
        detail[(p, n)] = []

if __name__ == "__main__":
    for k in ("A_DEAD", "B_LOCAL", "C_LIVE"):
        print(f"\n=== {k}  ({len(buckets[k])}) ===")
        for p, n in buckets[k]:
            extra = ""
            if k == "C_LIVE":
                extra = "   <- " + ", ".join(f"{q}({c})" for q, c in detail[(p, n)][:3])
            elif k == "B_LOCAL":
                extra = f"   [{detail[(p,n)][0][1]} refs in own file]"
            print(f"  {p}: {n}{extra}")
    json.dump({k: [[p, n] for p, n in v] for k, v in buckets.items()},
              open(os.path.join(ROOT, "tools-audit/unused_exports.json"), "w"), indent=1)
    print(f"\ntotal scanned: {len(SRC)} files in src/, {len(SOURCES)} corpus files")
