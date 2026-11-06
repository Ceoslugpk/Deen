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

out = {}
for n in range(1, 115):
    url = ('https://ar.wikipedia.org/w/api.php?action=query&titles='
           + quote(names[n], safe='')
           + '&prop=langlinks&lllimit=500&redirects=1&format=json')
    for attempt in range(3):
        r = subprocess.run(['curl','-s','-A','DeenCompanion/1.0 (language research)',
                            '--max-time','25', url], capture_output=True, text=True)
        try:
            d = json.loads(r.stdout)
        except Exception:
            time.sleep(1.0); continue
        for p in d.get('query', {}).get('pages', {}).values():
            for ll in p.get('langlinks', []) or []:
                if ll.get('lang') == 'ta':
                    out[n] = ll['*']
        break
    time.sleep(0.35)
    sys.stdout.write('\r%d/114  found=%d' % (n, len(out))); sys.stdout.flush()

print()
json.dump(out, open('/tmp/ll_ta.json','w'), ensure_ascii=False, indent=1)
print('found %d/114, unique %d' % (len(out), len(set(out.values()))))
print('missing:', [n for n in range(1,115) if n not in out])
