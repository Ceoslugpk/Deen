# -*- coding: utf-8 -*-
import io,re,sys
NEW = eval(sys.stdin.read())
p='src/services/indonesianCopy.ts'
s=io.open(p,encoding='utf-8').read()
head=s[:s.index('export const ID')]
decl=[l for l in s.split('\n') if l.startswith('export const ID')][0]
ex=dict(re.findall(r"^\s*'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)',\s*$", s, re.M))
b=len(ex); ex.update(NEW)
def q(x): return "'" + x.replace('\\','\\\\').replace("'","\\'") + "'"
io.open(p,'w',encoding='utf-8').write(head+decl+"\n"+"".join("  %s: %s,\n"%(q(k),q(ex[k])) for k in sorted(ex))+"};\n")
print("entries %d -> %d (+%d)"%(b,len(ex),len(ex)-b))
