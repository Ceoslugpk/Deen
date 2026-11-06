import json, subprocess, time, sys
from urllib.parse import quote

def get(url):
    for _ in range(4):
        r=subprocess.run(['curl','-s','-A','DeenCompanion/1.0','--max-time','25',url],capture_output=True,text=True)
        try: return json.loads(r.stdout)
        except Exception: time.sleep(1.2)
    return None

titles=json.load(open('/tmp/ta_titles.json'))
PREF=('சூரத்து','சூரத்துல்','சூரத்துத்','சூரத்துந்','சூரத்துர்','சூரத்துல்',
      'ஸூரத்து','ஸூரத்துல்','ஸூரத்துந்','ஸூரத்துத்','ஸூரத்துர்')
cand=[t for t in titles if t.startswith(PREF)]
print('surah-prefixed Tamil pages:', len(cand))

# Arabic surah title -> number
ar2n={}
ch=json.loads(subprocess.run(['curl','-s','https://api.quran.com/api/v4/chapters?language=ar'],
        capture_output=True,text=True).stdout)['chapters']
for c in ch:
    ar2n[c['name_arabic']]=c['id']
    ar2n['سورة '+c['name_arabic']]=c['id']

out={}
for i,t in enumerate(cand):
    u=('https://ta.wikipedia.org/w/api.php?action=query&titles='+quote(t,safe='')
       +'&prop=langlinks&lllang=ar&lllimit=500&redirects=1&format=json')
    d=get(u)
    if d:
        for p in d.get('query',{}).get('pages',{}).values():
            for ll in p.get('langlinks',[]) or []:
                title=ll['*']
                n=ar2n.get(title) or ar2n.get(title.replace('سورة ','').strip())
                if n and n not in out: out[n]=t
    time.sleep(0.25)
    sys.stdout.write('\r%d/%d mapped=%d'%(i+1,len(cand),len(out))); sys.stdout.flush()

print()
json.dump(out, open('/tmp/ll_ta.json','w'), ensure_ascii=False, indent=1)
print('mapped %d/114, unique %d'%(len(out),len(set(out.values()))))
print('missing:',[n for n in range(1,115) if n not in out])
