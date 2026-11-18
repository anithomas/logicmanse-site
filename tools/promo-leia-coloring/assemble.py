"""Rebuilds scene.js from the shared Kindergarten engine + this video's builders.js"""
old = open('../promo-kindergarten/scene.js').read()
def sl(a, b=None):
    i = old.index(a); j = old.index(b) if b else len(old); return old[i:j]
header = old[:old.index('// ---------- scene timeline')].replace("TOTAL = 46.4", "TOTAL = 42.4").replace("GOLD = '#f2b632', CREAM = '#fff6e4';", "GOLD = '#f2b632', CREAM = '#fff6e4', PINK = '#d81b60';")
timeline = '''// ---------- scene timeline (output seconds; narration is delayed 2.3 s) ----------
const S = {
  hook: [0, 2.6], cover: [2.3, 8.8], color: [8.8, 13.7], puzzles: [13.7, 18.5],
  draw: [18.5, 22.9], extras: [22.9, 29.7], bonus: [29.7, 35.7], end: [35.7, TOTAL]
};
const WIPES = [[8.8, PINK], [13.7, TEAL], [18.5, '#e8731a'], [22.9, PURPLE], [29.7, GREEN], [35.7, GOLD]];

'''
bg = sl('// ---------- persistent background ----------', '// ======================= HOOK').replace("background:#f9dfba;opacity:.55", "background:#fbd5e0;opacity:.55").replace("background:#e4d8f4;opacity:.45", "background:#e4d8f4;opacity:.5")
caps = sl('// ---------- captions (word-highlight, burned in) ----------', '// ---------- assemble ----------')
asm = sl('// ---------- assemble ----------')
open('scene.js', 'w').write(header + timeline + bg + open('builders.js').read() + '\n' + caps + asm)
