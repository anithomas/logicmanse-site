"""captions.json (ElevenLabs Scribe word timings of the narration) -> captions.js / .srt / .vtt"""
import json, re
W = json.load(open('captions.json'))
phr, cur = [], []
for i, w in enumerate(W):
    if cur and (w['s'] - cur[-1]['e'] > 0.5 or len(cur) >= 6 or re.search(r'[.!?:,]$', cur[-1]['w'])):
        phr.append(cur); cur = []
    cur.append(w)
if cur: phr.append(cur)
open('captions.js', 'w').write('window.WORDS=' + json.dumps(W, ensure_ascii=False) + ';window.PHRASES=' + json.dumps([[W.index(w) for w in p] for p in phr]) + ';')
def ts(t, sep):
    h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60
    return f'{h:02d}:{m:02d}:{s:06.3f}'.replace('.', sep)
srt, vtt = [], ['WEBVTT\n']
for n, p in enumerate(phr, 1):
    a, b = p[0]['s'] - .05, p[-1]['e'] + .25
    if n < len(phr): b = min(b, phr[n][0]['s'] - .02)
    txt = ' '.join(w['w'] for w in p)
    srt.append(f'{n}\n{ts(a,",")} --> {ts(b,",")}\n{txt}\n'); vtt.append(f'{ts(a,".")} --> {ts(b,".")}\n{txt}\n')
open('captions.srt', 'w').write('\n'.join(srt)); open('captions.vtt', 'w').write('\n'.join(vtt))
print(len(phr), 'phrases')
