import json, subprocess, time, sys
from urllib.parse import quote

names = {}
ch = json.loads(subprocess.run(
    ['curl','-s','https://api.quran.com/api/v4/chapters?language=ar'],
    capture_output=True, text=True).stdout)['chapters']
for c in ch:
    names[c['id']] = 'سورة ' + c['name_arabic']
names.update({14:'سورة إبراهيم',34:'سورة سبأ',76:'سورة الإنسان',
              78:'سورة النبأ',82:'سورة الانفطار',84:'سورة الانشقاق'})

def get(url):
    for _ in range(3):
        r = subprocess.run(['curl','-s','-A','DeenCompanion/1.0 (language research)',
                            '--max-time','25', url], capture_output=True, text=True)
        try: return json.loads(r.stdout)
        except Exception: time.sleep(1.0)
    return None

# 1. QID for every surah, from the Arabic Wikipedia article.
qid = {}
for n in range(1, 115):
    url = ('https://ar.wikipedia.org/w/api.php?action=query&titles='
           + quote(names[n], safe='')
           + '&prop=pageprops&redirects=1&format=json')
    d = get(url)
    if d:
        for p in d.get('query', {}).get('pages', {}).values():
            q = (p.get('pageprops') or {}).get('wikibase_item')
            if q: qid[n] = q
    time.sleep(0.25)
    sys.stdout.write('\rQIDs %d/114 (%d)' % (n, len(qid))); sys.stdout.flush()
print()
json.dump(qid, open('/tmp/ta_qid.json','w'))

# 2. Tamil labels from Wikidata, 50 entities per request.
labels = {}
qs = [qid[n] for n in sorted(qid)]
for i in range(0, len(qs), 50):
    batch = qs[i:i+50]
    url = ('https://www.wikidata.org/w/api.php?action=wbgetentities&ids='
           + '|'.join(batch) + '&props=labels&languages=ta|en&format=json')
    d = get(url)
    if d:
        for q, ent in (d.get('entities') or {}).items():
            ta = (ent.get('labels') or {}).get('ta', {}).get('value')
            en = (ent.get('labels') or {}).get('en', {}).get('value')
            if ta: labels[q] = (ta, en)
    time.sleep(0.4)
    sys.stdout.write('\rlabels %d/%d (%d)' % (min(i+50, len(qs)), len(qs), len(labels))); sys.stdout.flush()
print()
out = {n: labels[qid[n]][0] for n in sorted(qid) if qid[n] in labels}
json.dump(out, open('/tmp/ll_ta.json','w'), ensure_ascii=False, indent=1)
print('Tamil labels: %d/114, unique %d' % (len(out), len(set(out.values()))))
print('missing:', [n for n in range(1,115) if n not in out])
for n in sorted(out)[:8]: print(' ', n, out[n])
