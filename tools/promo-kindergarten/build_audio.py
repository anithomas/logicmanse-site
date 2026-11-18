"""Synthesise the SFX track from cues.json (emitted by scene.js). Usage: build_audio.py cues.json out.wav"""
import sys, json, wave, numpy as np
SR = 48000; DUR = 46.6
cues = json.load(open(sys.argv[1]))
buf = np.zeros(int(SR * DUR)); rng = np.random.default_rng(7)
def tone(f0, f1, d, env=6, sq=False):
    n = int(d * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * (f0 * t + (f1 - f0) * t * t / (2 * d))
    s = np.sin(ph)
    if sq: s = np.sign(s) * .5
    return s * np.exp(-env * t / d) * np.minimum(1, t / .004)
def noise(d, env=5):
    n = int(d * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * np.exp(-env * t / d) * np.minimum(1, t / .003)
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode='same')
def hp(x, k): return x - lp(x, k)
def mix(*sigs):
    n = max(len(x) for x in sigs); out = np.zeros(n)
    for x in sigs: out[:len(x)] += x
    return out
def put(t, sig, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    sig = sig[:len(buf) - i]; buf[i:i + len(sig)] += sig * g
for c in cues:
    t, ty, g = c['t'], c['type'], c['g']
    if ty == 'tick': put(t, tone(1300, 1700, .05, 8), .35)
    elif ty == 'bonk': put(t, tone(300, 170, .24, 6), .7)
    elif ty == 'whoosh':
        n = int(.5 * SR); w = noise(.5, 2.2) * np.sin(np.pi * np.arange(n) / n); put(t - .1, lp(w, 36), .9)
    elif ty == 'pop': put(t, tone(500, 950, .07, 6), .5 * g)
    elif ty == 'scratch':
        n = int(.7 * SR); am = (np.sin(np.arange(n) / SR * 46) * .5 + .6)
        put(t, hp(noise(.7, 1.0)[:n], 60) * am, .22 * g)
    elif ty == 'tap': put(t, tone(480 + 70 * g, 600 + 70 * g, .12, 7), .55)
    elif ty == 'chime':
        put(t, mix(tone(880, 880, .7, 4), .6 * tone(1320, 1320, .7, 5), .3 * tone(1760, 1760, .7, 6)), .35)
    elif ty == 'step': put(t, tone(420 * 2 ** (g / 6), 420 * 2 ** (g / 6), .16, 8) + .4 * tone(840 * 2 ** (g / 6), 840 * 2 ** (g / 6), .16, 9), .4)
    elif ty == 'stamp': put(t, mix(tone(110, 55, .3, 5), .7 * lp(noise(.12, 8), 30)), .9)
    elif ty == 'conf':
        put(t, mix(noise(.25, 6) * .6, tone(1600, 2400, .2, 8)), .35)
        for j in range(6): put(t + .05 * j, tone(1500 + 220 * j, 2000 + 200 * j, .08, 9), .18)
    elif ty == 'hoot': put(t, mix(tone(440, 330, .28, 4) * .8, tone(660, 495, .28, 4) * .3), .5)
    elif ty == 'boing': put(t, tone(250, 700, .22, 5), .5)
    elif ty == 'flutter':
        for j in range(5): put(t + j * .045, tone(1300 + 60 * j, 1700 + 60 * j, .05, 4), .25)
    elif ty == 'bark': put(t, mix(tone(260, 150, .14, 5, True) * .7, noise(.09, 6) * .35), .45)
pk = np.abs(buf).max(); buf *= min(1, .8 / max(pk, 1e-6))
st = np.stack([buf, buf], 1)
with wave.open(sys.argv[2], 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((st * 32767).astype('<i2').tobytes())
print('sfx ok', len(cues))
