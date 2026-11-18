/* Leia Kindergarten promo — every frame is a pure function of t (seconds).
   window.renderAt(t) positions everything; window.CUES lists sound-effect cues. */
'use strict';
const W = 1920, H = 1080, TOTAL = 42.4;
const NAVY = '#25213f', ORANGE = '#c4680f', TEAL = '#1f8a93', GREEN = '#1f6b3a', RED = '#b72f2c', PURPLE = '#8a55c8',
  GOLD = '#f2b632', CREAM = '#fff6e4', PINK = '#d81b60';
const CONF = ['#e8731a', '#2a9aa5', '#8a55c8', '#e5483f', '#f2b632', '#3d9a52', '#f08cb5'];

// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, d) => clamp((t - a) / d);
const eOut = k => 1 - Math.pow(1 - clamp(k), 3);
const eIO = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eBack = k => { k = clamp(k); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const spring = k => { k = clamp(k); return k >= 1 ? 1 : 1 - Math.exp(-7 * k) * Math.cos(13 * k); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const stage = document.getElementById('stage');
const CUES = [];
window.CUES = CUES;
const cue = (t, type, g) => CUES.push({ t, type, g: g == null ? 1 : g });

function mk(parent, css, html, tag = 'div') {
  const e = document.createElement(tag);
  e.className = 'a';
  if (css) e.style.cssText = css;
  if (html != null) e.innerHTML = html;
  parent.appendChild(e);
  return e;
}
// transform + opacity in one call
function T(e, o = {}) {
  const { x = 0, y = 0, s = 1, r = 0, a = 1, sx = 1, sy = 1 } = o;
  if (a <= 0.003) { e.style.display = 'none'; return; }
  e.style.display = '';
  e.style.opacity = a >= 1 ? '' : a.toFixed(3);
  e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${(s * sx).toFixed(4)},${(s * sy).toFixed(4)})`;
}
const svgNS = (inner, vb, css) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" style="${css || ''}">${inner}</svg>`;
function drawOn(path, p) {            // stroke-dash reveal for an SVG path/polyline element
  if (!path._len) path._len = path.getTotalLength();
  path.style.strokeDasharray = path._len + ' ' + (path._len + 2);
  path.style.strokeDashoffset = (path._len * (1 - clamp(p))).toFixed(1);
  path.style.opacity = p <= 0 ? 0 : 1;
}
function words(parent, items, css, t0, gap, font) {
  // items: [[text,color],...] laid out inline; returns word spans
  const box = mk(parent, css, '');
  box.style.font = font || '';
  const ws = [];
  items.forEach(([txt, col, br], i) => {
    const sp = document.createElement('span');
    sp.className = 'w'; sp.style.color = col || NAVY; sp.textContent = txt + ' ';
    sp.style.whiteSpace = 'pre';
    box.appendChild(sp);
    if (br) box.appendChild(document.createElement('br'));
    ws.push({ sp, t: t0 + i * gap });
  });
  return { box, ws };
}
function updWords(ws, t, rise = 46) {
  ws.forEach(({ sp, t: t0 }) => {
    const k = prog(t, t0, 0.5), b = eBack(k);
    sp.style.opacity = clamp(k * 3).toFixed(3);
    sp.style.transform = `translateY(${(1 - b) * rise}px) scale(${0.85 + 0.15 * b})`;
  });
}
const SPARK = '<path d="M0,-1 L.22,-.22 L1,0 L.22,.22 L0,1 L-.22,.22 L-1,0 L-.22,-.22Z" fill="currentColor"/>';
const PAW = (c) => `<svg viewBox="-50 -50 100 100"><g fill="${c}"><ellipse cx="0" cy="14" rx="23" ry="19"/><ellipse cx="-27" cy="-6" rx="9" ry="13" transform="rotate(-22 -27 -6)"/><ellipse cx="-10" cy="-26" rx="9" ry="13"/><ellipse cx="10" cy="-26" rx="9" ry="13"/><ellipse cx="27" cy="-6" rx="9" ry="13" transform="rotate(22 27 -6)"/></g></svg>`;
const STAR5 = 'M0,-50 L14.7,-20 L47.6,-15.5 L23.8,7.7 L29.4,40.5 L0,25 L-29.4,40.5 L-23.8,7.7 L-47.6,-15.5 L-14.7,-20Z';
const PENCIL = svgNS(`<g transform="rotate(0)"><rect x="0" y="-9" width="86" height="18" rx="3" fill="#f2b632"/><rect x="0" y="-9" width="86" height="6" fill="#f7cd64"/><polygon points="0,-9 -26,0 0,9" fill="#f4d9b0"/><polygon points="-14,-4.5 -26,0 -14,4.5" fill="#3a3556"/><rect x="86" y="-9" width="16" height="18" rx="4" fill="#e8731a"/><rect x="82" y="-9" width="5" height="18" fill="#bbb"/></g>`, '-30 -12 136 24', 'width:136px;height:24px');

function confetti(parent, n, seed) {
  const ps = [];
  for (let i = 0; i < n; i++) {
    const e = mk(parent, `width:${14 + hash(seed + i) * 14}px;height:${9 + hash(seed + i * 3) * 10}px;background:${CONF[i % CONF.length]};border-radius:${i % 3 ? 2 : 9}px`);
    ps.push({ e, a: hash(seed + i * 7) * Math.PI * 2, v: 380 + hash(seed + i * 11) * 620, rv: (hash(seed + i * 13) - .5) * 900, ph: hash(seed + i * 5) * 6 });
  }
  return ps;
}
function updConfetti(ps, t, t0, ox, oy, life = 2.2) {
  const k = t - t0;
  ps.forEach(p => {
    if (k < 0 || k > life) { p.e.style.display = 'none'; return; }
    const spread = Math.min(1, k * 3.2);
    const x = ox + Math.cos(p.a) * p.v * k * 0.62 * spread + Math.sin(k * 6 + p.ph) * 16;
    const y = oy + Math.sin(p.a) * p.v * k * 0.62 * spread + 520 * k * k;
    T(p.e, { x, y, r: p.rv * k, a: 1 - prog(k, life - 0.7, 0.7) });
  });
}
function sparkles(parent, list, color) {
  return list.map(([x, y, s, ph]) => {
    const e = mk(parent, `width:60px;height:60px;color:${color || GOLD}`, svgNS(SPARK, '-1 -1 2 2', 'width:60px;height:60px'));
    return { e, x, y, s, ph };
  });
}
function updSparkles(sp, t, t0, t1) {
  sp.forEach(({ e, x, y, s, ph }) => {
    const k = Math.sin((t * 3.2 + ph) % (Math.PI * 2));
    const on = prog(t, t0, 0.4) * (1 - prog(t, t1 - 0.4, 0.4));
    T(e, { x: x - 30, y: y - 30, s: s * (0.55 + 0.45 * Math.abs(k)) * eBack(on), r: t * 40 + ph * 20, a: on > 0 ? 0.5 + 0.5 * Math.abs(k) : 0 });
  });
}
function pawTrail(parent, color, n) {
  const ps = [];
  for (let i = 0; i < n; i++) ps.push(mk(parent, 'width:64px;height:64px', PAW(color)));
  return ps;
}
function updPaws(ps, t, t0, x0, x1, y0, amp, step = 0.24, life = 2.0) {
  ps.forEach((e, i) => {
    const st = t0 + i * step, k = t - st;
    if (k < 0 || k > life) { T(e, { a: 0 }); return; }
    const x = lerp(x0, x1, i / (ps.length - 1));
    const y = y0 + (i % 2 ? amp : -amp);
    T(e, { x: x - 32, y: y - 32, s: 0.55 * eBack(k / 0.3), r: 90 + (i % 2 ? 8 : -8), a: 0.5 * (1 - prog(k, life - 0.8, 0.8)) });
  });
}
function chip(parent, label, bg, iconSrc) {
  const h = (iconSrc ? `<img src="${iconSrc}" style="width:46px;height:46px;background:#fff;border-radius:50%;margin-left:-14px">` : '') + label;
  return mk(parent, `height:66px;background:${bg};box-shadow:0 8px 18px rgba(0,0,0,.14)`, h).style.cssText += ';display:inline-flex;align-items:center;gap:12px;border-radius:999px;padding:0 30px;font-weight:600;font-size:30px;color:#fff;white-space:nowrap;' ;
}

// ---------- scene timeline (output seconds; narration is delayed 2.3 s) ----------
const S = {
  hook: [0, 2.6], cover: [2.3, 8.8], color: [8.8, 13.7], puzzles: [13.7, 18.5],
  draw: [18.5, 22.9], extras: [22.9, 29.7], bonus: [29.7, 35.7], end: [35.7, TOTAL]
};
const WIPES = [[8.8, PINK], [13.7, TEAL], [18.5, '#e8731a'], [22.9, PURPLE], [29.7, GREEN], [35.7, GOLD]];

// ---------- persistent background ----------
const bg = mk(stage, `width:${W}px;height:${H}px`, '');
const blobs = [
  mk(bg, 'width:1100px;height:1100px;border-radius:50%;background:#fbd5e0;opacity:.55'),
  mk(bg, 'width:900px;height:900px;border-radius:50%;background:#cfe0bd;opacity:.6'),
  mk(bg, 'width:700px;height:700px;border-radius:50%;background:#e4d8f4;opacity:.5'),
];
const doodleDefs = [
  ['A', 'g'], ['B', 'g'], ['C', 'g'], ['1', 'g'], ['2', 'g'], ['3', 'g'], ['★', 's'], ['●', 'c'], ['▲', 't'], ['■', 'q'], ['♥', 'h'], ['a', 'g'], ['b', 'g'], ['7', 'g'], ['★', 's'], ['●', 'c']
];
const doodles = doodleDefs.map(([g, k], i) => {
  const col = CONF[i % CONF.length];
  let html;
  if (k === 'g') html = `<span style="font:700 ${70 + hash(i) * 40}px P;color:${col}">${g}</span>`;
  else if (k === 's') html = svgNS(`<path d="${STAR5}" fill="${col}"/>`, '-50 -50 100 100', 'width:64px;height:64px');
  else if (k === 'c') html = `<div style="width:46px;height:46px;border-radius:50%;border:8px solid ${col}"></div>`;
  else if (k === 't') html = svgNS(`<polygon points="0,-44 44,34 -44,34" fill="none" stroke="${col}" stroke-width="12" stroke-linejoin="round"/>`, '-50 -50 100 100', 'width:56px;height:56px');
  else if (k === 'q') html = `<div style="width:44px;height:44px;border-radius:8px;border:8px solid ${col}"></div>`;
  else html = svgNS(`<path d="M0,38 C-60,-8 -26,-48 0,-18 C26,-48 60,-8 0,38Z" fill="${col}"/>`, '-50 -50 100 100', 'width:58px;height:58px');
  return { e: mk(bg, '', html), x0: hash(i * 3) * W, sp: 14 + hash(i * 5) * 26, ph: hash(i * 9) * 6, rot: (hash(i * 13) - .5) * 40 };
});
function updBg(t) {
  const hue = [[0, 0], [2.3, 0], [7.4, 1], [13.3, 2], [18.4, 3], [24.2, 4], [29.6, 5], [36, 6]];
  blobs[0].style.opacity = 0.5;
  T(blobs[0], { x: -420 + Math.sin(t * .25) * 60, y: -300 + Math.cos(t * .2) * 50 });
  T(blobs[1], { x: 1350 + Math.cos(t * .22) * 70, y: 640 + Math.sin(t * .27) * 50 });
  T(blobs[2], { x: 700 + Math.sin(t * .17) * 140, y: 700 + Math.cos(t * .21) * 60, a: .5 });
  doodles.forEach(d => {
    const y = ((H + 120) - ((t * d.sp + d.ph * 160) % (H + 240)));
    T(d.e, { x: d.x0 + Math.sin(t * .6 + d.ph) * 26, y: y - 60, r: d.rot + t * 12, a: .13 });
  });
}

// ---------- scene containers ----------
const scn = {};
for (const k in S) scn[k] = mk(stage, `width:${W}px;height:${H}px;transform:none`, '');
const wipeEls = WIPES.map(([, c]) => mk(stage, `width:${W}px;height:${H}px;background:${c}`, ''));
// finish with a fixed element for the whole-frame fade at the very end
const builders = {};

// ===== scenes for "Super Leia to the Rescue!" (timed to the narration, which starts at 2.3 s) =====
const setTimes = (ws, arr) => ws.forEach((w, i) => { w.t = arr[i]; });
const crayonSVG = (col) => svgNS(`<rect x="-14" y="-70" width="28" height="120" rx="4" fill="${col}"/><polygon points="-14,-70 14,-70 0,-102" fill="${col}"/><rect x="-14" y="-28" width="28" height="30" fill="#fff" opacity=".35"/><rect x="-14" y="30" width="28" height="6" fill="#000" opacity=".12"/>`, '-20 -110 40 170', 'width:40px;height:170px');
const BONE = (c, s) => svgNS(`<path d="M20,40 C0,30 4,8 24,10 C32,11 38,16 40,22 L120,22 C122,16 128,11 136,10 C156,8 160,30 140,40 C160,50 156,72 136,70 C128,69 122,64 120,58 L40,58 C38,64 32,69 24,70 C4,72 0,50 20,40Z" fill="${c}" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`, '-4 0 164 80', `width:${s}px;height:${s * 80 / 164}px`);
const chipEl = (parent, css, label, bg, icon) => {
  const e = mk(parent, css, '');
  e.style.cssText += `;height:66px;background:${bg};border-radius:999px;padding:0 ${icon ? 30 : 34}px 0 ${icon ? 12 : 34}px;display:flex;align-items:center;gap:14px;font:600 30px P;color:#fff;white-space:nowrap;box-shadow:0 8px 18px rgba(0,0,0,.14)`;
  e.innerHTML = (icon ? `<img src="${icon}" style="flex-shrink:0;width:46px;height:46px;background:#fff;border-radius:50%;object-fit:cover">` : '') + label;
  return e;
};

// ======================= HOOK =======================
builders.hook = (root) => {
  const l1 = mk(root, 'left:0;top:236px;width:1920px;text-align:center', `<span style="font:700 92px P;color:${NAVY}">Kids glued to a screen again?</span>`);
  const l2 = mk(root, 'left:0;top:372px;width:1920px;text-align:center', `<span style="font:700 92px P;color:${NAVY}">Give them something to</span>`);
  const l3 = mk(root, 'left:0;top:488px;width:1920px;text-align:center', `<span style="font:700 92px P;color:${PINK}">color, solve and draw.</span>`);
  const tablet = mk(root, 'width:240px;height:170px', svgNS(`<rect x="0" y="0" width="240" height="170" rx="22" fill="${NAVY}"/><rect x="14" y="14" width="212" height="142" rx="12" fill="#3a3556"/><circle cx="90" cy="70" r="9" fill="#fff"/><circle cx="150" cy="70" r="9" fill="#fff"/><path d="M84,118 Q120,96 156,118" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`, '0 0 240 170', 'width:240px;height:170px'));
  const cols = [PINK, '#2a9aa5', GOLD];
  const crayons = cols.map(c => mk(root, 'width:40px;height:170px', crayonSVG(c)));
  cue(0.15, 'tick'); cue(1.25, 'bonk'); cue(1.5, 'pop', 0.6); cue(1.7, 'pop', 0.6); cue(1.9, 'pop', 0.6);
  return (t) => {
    const k1 = eOut(prog(t, 0.05, 0.5)), k2 = eOut(prog(t, 0.6, 0.5)), k3 = eOut(prog(t, 1.1, 0.5));
    T(l1, { y: (1 - k1) * 40, a: k1 }); T(l2, { y: (1 - k2) * 40, a: k2 }); T(l3, { y: (1 - k3) * 40, a: k3 });
    // tablet wobbles, then gets kicked off the screen
    const kk = prog(t, 1.2, 0.5);
    const wob = Math.sin(t * 22) * 4 * (1 - prog(t, 0.9, 0.3));
    T(tablet, { x: 840 + eIO(kk) * 1300, y: 700 - Math.sin(kk * Math.PI) * 120 + eIO(kk) * 80, r: wob + kk * 500, a: prog(t, 0.2, 0.3) > 0 ? 1 : 0, s: eBack(prog(t, 0.2, 0.4)) });
    crayons.forEach((c, i) => { const st = 1.45 + i * 0.18, k = t - st, kd = clamp(k / 0.5); T(c, { x: 760 + i * 130, y: 720 - Math.abs(Math.sin(k * 5)) * 24 * (kd >= 1 ? 1 : 0) + (1 - eBack(kd)) * 260, r: (i - 1) * 14, a: k > 0 ? 1 : 0 }); });
  };
};

// ======================= COVER =======================
builders.cover = (root) => {
  const cov = mk(root, 'width:657px;height:880px;border-radius:12px;overflow:hidden;box-shadow:0 40px 70px rgba(120,60,90,.35),0 8px 18px rgba(120,60,90,.2)', '<img src="assets/cover-front.jpg" style="width:657px;height:880px;display:block;object-fit:cover">');
  const sp = sparkles(root, [[150, 180, 1.1, 0], [840, 110, .9, 1.6], [830, 880, 1.2, 3], [110, 930, .8, 4.5]], PINK);
  const h1 = words(root, [['Super', NAVY], ['Leia', NAVY, 1], ['to', PINK], ['the', PINK], ['Rescue!', PINK]], 'left:960px;top:150px', 2.8, 0.2, '700 108px/118px P');
  setTimes(h1.ws, [2.85, 3.25, 3.55, 3.7, 3.85]);
  const ul = mk(root, 'left:1425px;top:376px;width:380px;height:30px', svgNS(`<path d="M4,18 C60,2 120,28 180,12 S300,22 376,8" fill="none" stroke="${PINK}" stroke-width="9" stroke-linecap="round"/>`, '0 0 380 30', 'width:380px;height:30px'));
  const ulp = ul.querySelector('path');
  const sub = mk(root, 'left:960px;top:428px;font:600 40px P;color:' + TEAL, 'A Coloring &amp; Activity Adventure');
  const chipRow = mk(root, 'left:960px;top:520px;display:flex;gap:18px;align-items:center', '');
  const chips = [['106 pages', TEAL], ['Ages 4–8', '#e8731a'], ['Paperback + PDF', GREEN]].map(([l, c]) => { const e = document.createElement('div'); e.textContent = l; e.style.cssText = `height:66px;background:${c};border-radius:999px;padding:0 32px;font:600 30px/66px P;color:#fff;white-space:nowrap;box-shadow:0 8px 18px rgba(0,0,0,.14);transform-origin:0 50%;opacity:0`; chipRow.appendChild(e); return e; });
  const av = mk(root, `left:960px;top:640px;width:210px;height:210px;border-radius:50%;border:10px solid ${PINK};overflow:hidden;box-shadow:0 14px 28px rgba(0,0,0,.2)`, '<img src="assets/leia-avatar.jpg" style="width:190px;height:190px;display:block">');
  const tag = mk(root, 'left:1200px;top:700px;font:700 46px/54px P;color:' + NAVY, 'Inspired by a<br><span style="color:' + PINK + '">real dog!</span>');
  const paws = pawTrail(root, '#d81b60', 12);
  cue(2.45, 'whoosh'); cue(2.85, 'tick'); cue(3.85, 'pop'); cue(5.0, 'pop'); cue(5.2, 'pop'); cue(5.4, 'pop'); cue(7.3, 'bark');
  return (t) => {
    const k = spring(prog(t, 2.35, 0.9)), kx = eOut(prog(t, 2.35, 0.7));
    T(cov, { x: lerp(-760, 150, kx), y: 100 + Math.sin(t * 1.7) * 9, r: lerp(-22, -4, k) + Math.sin(t * 1.2) * 1.2, s: lerp(.75, 1, k) });
    updSparkles(sp, t, 3.0, 99);
    updWords(h1.ws, t);
    T(ul, {}); drawOn(ulp, prog(t, 4.1, 0.55));
    const ks = eOut(prog(t, 4.9, 0.5)); T(sub, { y: (1 - ks) * 24, a: ks });
    chips.forEach((c, i) => { const kk = eBack(prog(t, 5.3 + i * 0.2, 0.45)); c.style.transform = `scale(${Math.max(kk, 0)})`; c.style.opacity = kk > 0.003 ? 1 : 0; });
    const ka = spring(prog(t, 7.25, 0.6)); T(av, { s: ka, r: (1 - ka) * -40, a: ka > 0 ? 1 : 0 });
    const kt = eOut(prog(t, 7.5, 0.5)); T(tag, { y: (1 - kt) * 20, a: kt });
    updPaws(paws, t, 5.6, 980, 1860, 960, 24, 0.2, 1.7);
  };
};

// ======================= COLOR IT =======================
builders.color = (root) => {
  const tiles = [
    { src: 'page-garden', lab: 'Portraits', x: 790, y: 70, r: -3, t: 10.3, col: PINK },
    { src: 'page-forest', lab: 'Seasons', x: 1340, y: 80, r: 3, t: 11.1, col: '#e8731a' },
    { src: 'page-kitchen', lab: 'Walks', x: 810, y: 545, r: 2.5, t: 12.0, col: GREEN },
    { src: 'page-xmas', lab: 'Holiday scenes', x: 1350, y: 555, r: -2.5, t: 12.5, col: RED },
  ].map(d => {
    const g = mk(root, 'width:510px;height:420px', '');
    const card = mk(g, 'left:0;top:0;width:510px;height:390px;background:#fff;border-radius:14px;padding:12px;box-shadow:0 24px 44px rgba(90,50,60,.28)', '');
    const gray = mk(card, 'left:12px;top:12px;width:486px;height:366px;border-radius:6px;overflow:hidden', `<img src="assets/${d.src}.jpg" style="width:486px;height:366px;object-fit:cover;display:block;filter:grayscale(1) contrast(1.15) brightness(1.18)">`);
    const col = mk(card, 'left:12px;top:12px;width:486px;height:366px;border-radius:6px;overflow:hidden', `<img src="assets/${d.src}.jpg" style="width:486px;height:366px;object-fit:cover;display:block">`);
    const lab = mk(g, `left:120px;top:360px;width:270px;height:54px;background:${d.col};border-radius:999px;text-align:center;font:600 28px/54px P;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.18)`, d.lab);
    d.g = g; d.col_ = col; d.lab_ = lab; return d;
  });
  const big = mk(root, 'left:110px;top:230px;width:640px;text-align:center;font:700 330px/330px P;color:' + PINK, '0');
  const txt = mk(root, 'left:110px;top:560px;width:640px;text-align:center;font:700 64px/72px P;color:' + NAVY, 'coloring pages');
  const sub = mk(root, 'left:110px;top:650px;width:640px;text-align:center;font:500 36px/50px P;color:#3a3556', 'portraits · seasons · walks · holidays');
  const head = mk(root, 'left:40px;top:120px;width:720px;text-align:center;font:700 70px/80px P;color:' + NAVY, 'Color it <span style="color:' + PINK + '">your way</span>');
  const conf = confetti(root, 30, 21);
  const sp = sparkles(root, [[760, 90, 1, 0], [1860, 500, .9, 2], [90, 900, 1, 4]], PINK);
  cue(8.9, 'whoosh'); cue(9.4, 'chime');
  tiles.forEach(d => { cue(d.t, 'pop'); cue(d.t + 0.25, 'scratch', .7); });
  return (t) => {
    updSparkles(sp, t, 9.2, 13.7);
    const kh = eOut(prog(t, 8.95, 0.55)); T(head, { y: (1 - kh) * 30, a: kh });
    // count-up to 30 as the narrator says "thirty"
    const n = Math.round(30 * eOut(prog(t, 9.3, 0.9))); big.textContent = String(n);
    const kb = eBack(prog(t, 9.25, 0.6)); T(big, { s: .85 + .15 * kb, a: kb > 0 ? 1 : 0 });
    const kt = eOut(prog(t, 9.9, 0.5)); T(txt, { y: (1 - kt) * 20, a: kt }); T(sub, { y: (1 - kt) * 20, a: kt });
    tiles.forEach((d, i) => {
      const k = prog(t, d.t - 0.1, 0.55), sp_ = spring(k);
      const bob = Math.sin(t * 1.6 + i) * 5;
      T(d.g, { x: d.x, y: d.y + bob + (1 - eOut(k)) * 320, s: .6 + .4 * sp_, r: d.r * sp_ + (1 - sp_) * 14, a: k > 0 ? 1 : 0 });
      // the page colours itself in
      const kc = eOut(prog(t, d.t + 0.15, 0.7)); d.col_.style.clipPath = `circle(${(kc * 90).toFixed(1)}% at 50% 55%)`;
      const kl = eBack(prog(t, d.t + 0.35, 0.4)); T(d.lab_, { s: kl, a: kl > 0 ? 1 : 0 });
    });
    updConfetti(conf, t, 12.7, 1100, 520, 2.0);
  };
};

// ======================= PUZZLES =======================
function makeMaze(cols, rows, seed) {
  const open = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ N: 0, E: 0, S: 0, W: 0 })));
  const seen = Array.from({ length: rows }, () => Array(cols).fill(false));
  const st = [[0, 0]]; seen[0][0] = true; let n = 0;
  const D = [['N', 0, -1, 'S'], ['E', 1, 0, 'W'], ['S', 0, 1, 'N'], ['W', -1, 0, 'E']];
  while (st.length) {
    const [x, y] = st[st.length - 1];
    const opts = D.filter(([, dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny][nx]; });
    if (!opts.length) { st.pop(); continue; }
    const [d, dx, dy, od] = opts[Math.floor(hash(seed + n++) * opts.length)];
    open[y][x][d] = 1; open[y + dy][x + dx][od] = 1; seen[y + dy][x + dx] = true; st.push([x + dx, y + dy]);
  }
  // solution by BFS
  const prev = {}, q = [[0, 0]]; prev['0,0'] = null;
  while (q.length) { const [x, y] = q.shift(); D.forEach(([d, dx, dy]) => { if (open[y][x][d]) { const k = (x + dx) + ',' + (y + dy); if (!(k in prev)) { prev[k] = [x, y]; q.push([x + dx, y + dy]); } } }); }
  const path = []; let c = [cols - 1, rows - 1]; while (c) { path.unshift(c); c = prev[c[0] + ',' + c[1]]; }
  return { open, path };
}
builders.puzzles = (root) => {
  const head = mk(root, 'left:0;top:36px;width:1920px;text-align:center;font:700 80px/88px P;color:' + NAVY, 'Then switch it <span style="color:' + PINK + '">up!</span>');
  const mkTile = (title, col, x, y, t0) => {
    const g = mk(root, 'width:620px;height:400px', '');
    const card = mk(g, 'left:0;top:0;width:620px;height:400px', ''); card.classList.add('card');
    mk(card, `left:0;top:0;width:620px;height:64px;background:${col};border-radius:28px 28px 0 0;font:700 34px/64px P;color:#fff;text-align:center`, title);
    return { g, card, x, y, t0 };
  };
  const tiles = [mkTile('Mazes', PINK, 190, 150, 14.5), mkTile('Word searches', TEAL, 1110, 150, 15.25), mkTile('Crosswords', '#e8731a', 190, 570, 16.3), mkTile('Dot-to-dots', GREEN, 1110, 570, 17.0)];
  // --- maze
  const MZ = makeMaze(9, 5, 11), CS = 56, mx = 58, my = 100;
  let w = '';
  for (let y = 0; y < 5; y++) for (let x = 0; x < 9; x++) {
    const X = mx + x * CS, Y = my + y * CS, o = MZ.open[y][x];
    if (!o.N && !(x === 0 && y === 0)) w += `<line x1="${X}" y1="${Y}" x2="${X + CS}" y2="${Y}"/>`;
    if (!o.W) w += `<line x1="${X}" y1="${Y}" x2="${X}" y2="${Y + CS}"/>`;
    if (y === 4 && !(x === 8)) w += `<line x1="${X}" y1="${Y + CS}" x2="${X + CS}" y2="${Y + CS}"/>`;
    if (x === 8) w += `<line x1="${X + CS}" y1="${Y}" x2="${X + CS}" y2="${Y + CS}"/>`;
  }
  const pd = MZ.path.map((p, i) => (i ? 'L' : 'M') + (mx + p[0] * CS + CS / 2) + ',' + (my + p[1] * CS + CS / 2)).join(' ');
  const mzSvg = mk(tiles[0].card, 'left:0;top:0;width:620px;height:400px', svgNS(`<g stroke="${NAVY}" stroke-width="5" stroke-linecap="round">${w}</g><path id="mzp" d="${pd}" fill="none" stroke="${PINK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><text x="${mx - 4}" y="${my - 12}" font-family="P" font-weight="700" font-size="20" fill="${NAVY}">START</text><text x="${mx + 9 * CS - 62}" y="${my + 5 * CS + 30}" font-family="P" font-weight="700" font-size="20" fill="${NAVY}">FINISH</text>`, '0 0 620 400', 'width:620px;height:400px'));
  const mzp = mzSvg.querySelector('#mzp');
  const mzTok = mk(tiles[0].card, `width:44px;height:44px;border-radius:50%;border:5px solid ${PINK};overflow:hidden;background:#fff`, '<img src="assets/leia-avatar.jpg" style="width:40px;height:40px;display:block">');
  // --- word search
  const L = 'ABCDEFGHIJKLMNOPRSTUW', gw = 9, gh = 5, GS = 56, gx = 58, gy = 104;
  const grid = Array.from({ length: gh }, (_, r) => Array.from({ length: gw }, (_, c) => L[Math.floor(hash(r * 9 + c + 5) * L.length)]));
  'LEIA'.split('').forEach((ch, i) => { grid[1][1 + i] = ch; }); 'DOG'.split('').forEach((ch, i) => { grid[1 + i][7] = ch; });
  let ws = '';
  grid.forEach((row, r) => row.forEach((ch, c) => { ws += `<text x="${gx + c * GS + GS / 2}" y="${gy + r * GS + 38}" text-anchor="middle" font-family="P" font-weight="600" font-size="34" fill="${NAVY}">${ch}</text>`; }));
  const wsSvg = mk(tiles[1].card, 'left:0;top:0;width:620px;height:400px', svgNS(`<rect id="h1" x="${gx + 1 * GS + 4}" y="${gy + 1 * GS + 6}" width="${4 * GS - 8}" height="${GS - 12}" rx="24" fill="${PINK}" opacity=".38" style="transform-origin:${gx + GS}px 0;transform:scaleX(0)"/><rect id="h2" x="${gx + 7 * GS + 6}" y="${gy + 1 * GS + 4}" width="${GS - 12}" height="${3 * GS - 8}" rx="24" fill="${GOLD}" opacity=".5" style="transform-origin:0 ${gy + GS}px;transform:scaleY(0)"/>${ws}`, '0 0 620 400', 'width:620px;height:400px'));
  const h1 = wsSvg.querySelector('#h1'), h2 = wsSvg.querySelector('#h2');
  // --- crossword
  const cw = 6, ch_ = 5, CC = 56, cxo = 142, cyo = 86;
  const cells = {}; 'BALL'.split('').forEach((c, i) => { cells['0,' + i] = c; }); 'LEIA'.split('').forEach((c, i) => { cells[i + ',3'] = c; }); 'PAW'.split('').forEach((c, i) => { cells['3,' + (2 + i)] = c; });
  let cs = '';
  for (let r = 0; r < ch_; r++) for (let c = 0; c < cw; c++) {
    const k = c + ',' + r, X = cxo + c * CC, Y = cyo + r * CC;
    if (k in cells) cs += `<rect x="${X}" y="${Y}" width="${CC}" height="${CC}" fill="#fff" stroke="${NAVY}" stroke-width="3"/><text class="cl" data-k="${k}" x="${X + CC / 2}" y="${Y + 44}" text-anchor="middle" font-family="P" font-weight="700" font-size="38" fill="#e8731a">${cells[k]}</text>`;
    else cs += `<rect x="${X}" y="${Y}" width="${CC}" height="${CC}" fill="${NAVY}" opacity=".9"/>`;
  }
  const cwSvg = mk(tiles[2].card, 'left:0;top:0;width:620px;height:400px', svgNS(cs, '0 0 620 400', 'width:620px;height:400px'));
  const cls = [...cwSvg.querySelectorAll('.cl')];
  const order = ['0,0', '0,1', '0,2', '0,3', '1,3', '2,3', '3,3', '3,2', '3,4'];
  // --- dot to dot (a bone)
  const P = [[30, 62], [50, 32], [88, 36], [104, 66], [196, 66], [212, 36], [250, 32], [270, 62], [270, 98], [250, 128], [212, 124], [196, 94], [104, 94], [88, 124], [50, 128], [30, 98]];
  const BX = p => p[0] * 1.6 + 70, BY = p => p[1] * 1.6 + 62;
  const bd = 'M' + P.map(p => BX(p) + ',' + BY(p)).join(' L') + ' Z';
  let dots = '';
  P.forEach((p, i) => { dots += `<circle cx="${BX(p)}" cy="${BY(p)}" r="10" fill="${NAVY}"/><text x="${BX(p) + (p[0] < 150 ? -20 : 20)}" y="${BY(p) + (p[1] < 80 ? -14 : 30)}" text-anchor="middle" font-family="P" font-weight="700" font-size="26" fill="${GREEN}">${i + 1}</text>`; });
  const ddSvg = mk(tiles[3].card, 'left:0;top:0;width:620px;height:400px', svgNS(`<path id="bfill" d="${bd}" fill="#ffd9e4" opacity="0"/><path id="bline" d="${bd}" fill="none" stroke="${GREEN}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>${dots}`, '0 0 620 400', 'width:620px;height:400px'));
  const bline = ddSvg.querySelector('#bline'), bfill = ddSvg.querySelector('#bfill');
  const conf = confetti(root, 34, 55);
  cue(13.8, 'whoosh'); tiles.forEach(d => cue(d.t0, 'tap', 3)); cue(15.6, 'scratch', 0.7); cue(16.1, 'chime'); cue(17.3, 'scratch', 0.7); cue(17.9, 'chime');
  const sp = sparkles(root, [[100, 120, 1, 0], [1820, 140, 1, 2], [960, 560, .8, 4]], TEAL);
  return (t) => {
    updSparkles(sp, t, 14.0, 18.5);
    const kh = eOut(prog(t, 13.85, 0.5)); T(head, { y: (1 - kh) * 30, a: kh });
    tiles.forEach((d, i) => { const k = prog(t, d.t0 - 0.1, 0.5); T(d.g, { x: d.x, y: d.y + (1 - eOut(k)) * 260 + Math.sin(t * 1.5 + i) * 4, s: .7 + .3 * spring(k), r: (1 - spring(k)) * (i % 2 ? 12 : -12), a: k > 0 ? 1 : 0 }); });
    // maze solves itself
    const mp = eIO(prog(t, 14.9, 0.9)); drawOn(mzp, mp);
    if (mzp._len) { const pt = mzp.getPointAtLength(mzp._len * mp); T(mzTok, { x: pt.x - 22, y: pt.y - 22, a: mp > 0 ? 1 : 0 }); }
    // LEIA, then DOG, get circled
    h1.style.transform = `scaleX(${eOut(prog(t, 15.7, 0.5)).toFixed(3)})`; h2.style.transform = `scaleY(${eOut(prog(t, 16.15, 0.4)).toFixed(3)})`;
    // crossword fills in
    cls.forEach(el => { const i = order.indexOf(el.dataset.k), k = eBack(prog(t, 16.5 + i * 0.1, 0.25)); el.setAttribute('opacity', k > 0 ? 1 : 0); el.style.transformOrigin = '50% 50%'; el.style.transformBox = 'fill-box'; el.style.transform = `scale(${k})`; });
    // dots connect, bone colours in
    drawOn(bline, prog(t, 17.15, 1.1)); bfill.setAttribute('opacity', eOut(prog(t, 18.0, 0.4)) * 0.9);
    updConfetti(conf, t, 18.05, 1420, 760, 1.8);
  };
};

// ======================= DRAW IT =======================
builders.draw = (root) => {
  const head = mk(root, 'left:120px;top:60px;font:700 84px/92px P;color:' + NAVY, 'Draw <span style="color:' + PINK + '">it yourself!</span>');
  const card = mk(root, 'width:960px;height:700px', ''); card.classList.add('card');
  mk(card, 'left:40px;top:40px;width:880px;height:620px;border:8px solid ' + NAVY + ';border-radius:20px;background:#fffdf6', '');
  const mkG = (ds, col) => ds.map(d => `<path d="${d}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const house = ['M200,330 L480,170 L760,330', 'M250,330 L250,570 L710,570 L710,330', 'M420,570 L420,450 Q480,380 540,450 L540,570', 'M340,390 L620,390 L620,430 L340,430 Z', 'M690,250 L690,190 L730,190 L730,285'];
  const cake = ['M240,560 L240,440 L720,440 L720,560 Z', 'M290,440 L290,350 L670,350 L670,440', 'M340,350 L340,270 L620,270 L620,350', 'M240,440 Q290,480 340,440 Q390,480 440,440 Q490,480 540,440 Q590,480 640,440 Q690,480 720,440', 'M400,270 L400,200 M480,270 L480,190 M560,270 L560,200'];
  const fetch_ = ['M170,250 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0', 'M170,282 L170,410 M170,320 L250,260 M170,320 L110,380 M170,410 L120,520 M170,410 L230,520', 'M470,210 m-24,0 a24,24 0 1,0 48,0 a24,24 0 1,0 -48,0', 'M250,255 Q360,60 470,210', 'M560,500 Q600,430 680,450 L760,450 Q790,420 820,440 L850,520 M620,500 L610,570 M760,455 L770,570 M850,520 L840,570 M560,500 Q520,450 530,430'];
  const sv = mk(card, 'left:0;top:0;width:960px;height:700px', svgNS(`<g transform="translate(0,20)"><g id="gh">${mkG(house, PINK)}</g><g id="gc">${mkG(cake, '#e8731a')}</g><g id="gf">${mkG(fetch_, TEAL)}</g><text id="gname" x="480" y="418" text-anchor="middle" font-family="P" font-weight="700" font-size="32" fill="${NAVY}">LEIA</text><g id="flames"><ellipse cx="400" cy="178" rx="10" ry="18" fill="${GOLD}"/><ellipse cx="480" cy="168" rx="10" ry="18" fill="${GOLD}"/><ellipse cx="560" cy="178" rx="10" ry="18" fill="${GOLD}"/></g></g>`, '0 0 960 700', 'width:960px;height:700px'));
  const gh = [...sv.querySelectorAll('#gh path')], gc = [...sv.querySelectorAll('#gc path')], gf = [...sv.querySelectorAll('#gf path')];
  const gname = sv.querySelector('#gname'), flames = sv.querySelector('#flames');
  const pen = mk(card, 'width:136px;height:24px', PENCIL);
  const prompts = [['Her dream dog house', PINK, 19.4, 20.5], ['Her birthday cake', '#e8731a', 20.55, 21.7], ['You playing fetch', TEAL, 21.75, 22.9]].map(([lab, col, a, b]) => { const e = mk(root, `width:640px;height:110px;background:#fff;border-radius:24px;border-left:14px solid ${col};box-shadow:0 14px 30px rgba(90,50,60,.2);font:700 40px/110px P;color:${NAVY};padding-left:36px`, lab); return { e, col, a, b }; });
  const conf = confetti(root, 24, 66);
  cue(18.6, 'whoosh'); cue(19.5, 'scratch', 1); cue(20.6, 'scratch', 1); cue(21.8, 'scratch', 1); cue(22.5, 'chime');
  const sp = sparkles(root, [[1120, 100, 1, 0], [1840, 880, 1, 2], [90, 980, .8, 4]], PINK);
  const groups = [[gh, 19.45, 1.0], [gc, 20.6, 1.0], [gf, 21.8, 1.0]];
  return (t) => {
    updSparkles(sp, t, 18.7, 22.9);
    const kh = eOut(prog(t, 18.55, 0.5)); T(head, { y: (1 - kh) * 30, a: kh });
    const k = eOut(prog(t, 18.55, 0.7)); T(card, { x: lerp(-1100, 110, k), y: 200 + Math.sin(t * 1.5) * 5, r: lerp(-8, -1, k) });
    let pen_on = false, pxy = [0, 0];
    groups.forEach(([ps, a, d], gi) => {
      const next = gi < 2 ? groups[gi + 1][1] : 99; const fade = 1 - prog(t, next - 0.05, 0.25);
      ps.forEach((p, i) => {
        const st = a + i * 0.16, pp = prog(t, st, 0.3); drawOn(p, pp); p.style.opacity = pp > 0 ? fade : 0;
        if (pp > 0 && pp < 1 && fade > .9) { pen_on = true; const pt = p.getPointAtLength(p._len * pp); pxy = [pt.x + 0, pt.y + 20]; }
      });
    });
    gname.setAttribute('opacity', eOut(prog(t, 20.3, 0.3)) * (1 - prog(t, 20.55, 0.2)));
    flames.setAttribute('opacity', eOut(prog(t, 21.4, 0.3)) * (1 - prog(t, 21.75, 0.2)) * (0.8 + 0.2 * Math.sin(t * 30)));
    T(pen, { x: pxy[0] + 20, y: pxy[1] - 14, r: -35 + Math.sin(t * 38) * 2.5, a: pen_on ? 1 : 0 });
    prompts.forEach((p, i) => {
      const on = prog(t, p.a, 0.3) * (1 - prog(t, p.b, 0.2)), kin = eBack(prog(t, p.a - 0.25 + 0.0, 0.45));
      T(p.e, { x: 1110 + (1 - eOut(prog(t, 18.9 + i * 0.15, 0.5))) * 700, y: 300 + i * 150, s: 1 + 0.07 * on, a: prog(t, 18.9 + i * 0.15, 0.3) > 0 ? 1 : 0 });
      p.e.style.background = on > 0.5 ? p.col : '#fff'; p.e.style.color = on > 0.5 ? '#fff' : NAVY;
    });
    updConfetti(conf, t, 22.4, 600, 560, 1.4);
  };
};

// ======================= HIDDEN LEARNING + ANSWER KEY =======================
builders.extras = (root) => {
  const headA = mk(root, 'left:0;top:60px;width:1920px;text-align:center;font:700 80px/88px P;color:' + NAVY, 'Learning <span style="color:' + PINK + '">hides in the fun</span>');
  const headB = mk(root, 'left:0;top:60px;width:1920px;text-align:center;font:700 80px/88px P;color:' + NAVY, 'A full <span style="color:' + GREEN + '">answer key</span>');
  // card A1: counting
  const c1 = mk(root, 'width:800px;height:560px', ''); c1.classList.add('card');
  mk(c1, `left:0;top:0;width:800px;height:70px;background:${TEAL};border-radius:28px 28px 0 0;font:700 36px/70px P;color:#fff;text-align:center`, 'Count the bones');
  const bones = [0, 1, 2, 3, 4].map(i => mk(c1, `left:${48 + i * 142}px;top:170px`, BONE('#fff3d6', 130)));
  const nums = [0, 1, 2, 3, 4].map(i => mk(c1, `left:${48 + i * 142}px;top:250px;width:130px;text-align:center;font:700 80px/80px P;color:${PINK}`, String(i + 1)));
  mk(c1, 'left:0;top:420px;width:800px;text-align:center;font:600 44px P;color:' + NAVY, 'Point, say, count!');
  // card A2: letter tracing
  const c2 = mk(root, 'width:800px;height:560px', ''); c2.classList.add('card');
  mk(c2, `left:0;top:0;width:800px;height:70px;background:#e8731a;border-radius:28px 28px 0 0;font:700 36px/70px P;color:#fff;text-align:center`, 'Trace L for Leia');
  const tsv = mk(c2, 'left:0;top:0;width:800px;height:560px', svgNS(`<path d="M300,150 L300,430 L500,430" fill="none" stroke="#c9c2dd" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 30"/><path id="l1" d="M300,150 L300,430" fill="none" stroke="#e8731a" stroke-width="26" stroke-linecap="round"/><path id="l2" d="M300,430 L500,430" fill="none" stroke="#e8731a" stroke-width="26" stroke-linecap="round"/><circle cx="300" cy="150" r="24" fill="${NAVY}"/><text x="300" y="160" text-anchor="middle" font-family="P" font-weight="700" font-size="28" fill="#fff">1</text><circle cx="300" cy="430" r="24" fill="${NAVY}" opacity=".9"/><text x="300" y="440" text-anchor="middle" font-family="P" font-weight="700" font-size="28" fill="#fff">2</text>`, '0 0 800 560', 'width:800px;height:560px'));
  const l1 = tsv.querySelector('#l1'), l2 = tsv.querySelector('#l2');
  const pen = mk(c2, 'width:136px;height:24px', PENCIL);
  // card B: answer key
  const key = mk(root, 'width:900px;height:720px', ''); key.classList.add('card');
  mk(key, `left:0;top:0;width:900px;height:84px;background:${NAVY};border-radius:28px 28px 0 0;font:700 42px/84px P;color:#fff;text-align:center;letter-spacing:4px`, 'ANSWER KEY');
  const keyCells = [];
  for (let i = 0; i < 6; i++) {
    const cx_ = 50 + (i % 3) * 270, cy_ = 120 + ((i / 3) | 0) * 290;
    const th = mk(key, `left:${cx_}px;top:${cy_}px;width:240px;height:210px;border:5px solid ${NAVY};border-radius:14px;background:#fffdf6;overflow:hidden`, '');
    const mm = makeMaze(6, 5, 30 + i);
    let wl = ''; for (let y = 0; y < 5; y++) for (let x = 0; x < 6; x++) { const o = mm.open[y][x], X = 14 + x * 35, Y = 16 + y * 35; if (!o.N && !(x === 0 && y === 0)) wl += `<line x1="${X}" y1="${Y}" x2="${X + 35}" y2="${Y}"/>`; if (!o.W) wl += `<line x1="${X}" y1="${Y}" x2="${X}" y2="${Y + 35}"/>`; if (y === 4) wl += `<line x1="${X}" y1="${Y + 35}" x2="${X + 35}" y2="${Y + 35}"/>`; if (x === 5) wl += `<line x1="${X + 35}" y1="${Y}" x2="${X + 35}" y2="${Y + 35}"/>`; }
    const pd = mm.path.map((p, j) => (j ? 'L' : 'M') + (14 + p[0] * 35 + 17) + ',' + (16 + p[1] * 35 + 17)).join(' ');
    mk(th, 'left:0;top:0;width:240px;height:210px', svgNS(`<g stroke="${NAVY}" stroke-width="3" stroke-linecap="round">${wl}</g><path d="${pd}" fill="none" stroke="#3aa564" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 240 210', 'width:240px;height:210px'));
    const ck = mk(key, `left:${cx_ + 160}px;top:${cy_ + 130}px;width:90px;height:90px`, svgNS(`<circle cx="45" cy="45" r="42" fill="#3aa564" stroke="#fff" stroke-width="5"/><path class="ck" d="M24,47 L39,62 L67,30" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 90 90', 'width:90px;height:90px'));
    keyCells.push(ck);
  }
  const sticker = mk(root, `height:84px;padding:0 40px;background:${GOLD};border-radius:999px;font:700 40px/84px P;color:${NAVY};white-space:nowrap;box-shadow:0 14px 30px rgba(0,0,0,.2)`, 'Grown-ups are never stuck!');
  const conf = confetti(root, 36, 88);
  const sp = sparkles(root, [[200, 220, 1, 0], [1780, 260, 1.1, 1.8], [960, 940, .9, 3]], GOLD);
  cue(23.0, 'whoosh'); [0, 1, 2, 3, 4].forEach(i => cue(23.8 + i * 0.32, 'tap', i)); cue(24.5, 'scratch', .8); cue(25.1, 'scratch', .8);
  cue(25.6, 'whoosh'); for (let i = 0; i < 6; i++) cue(26.5 + i * 0.35, 'tick'); cue(28.6, 'stamp'); cue(28.65, 'conf');
  return (t) => {
    updSparkles(sp, t, 23.1, 29.7);
    const aOut = prog(t, 25.35, 0.35), A = 1 - aOut;
    const kh = eOut(prog(t, 22.95, 0.5)); T(headA, { y: (1 - kh) * 30 - aOut * 60, a: kh * A });
    const kb = eOut(prog(t, 25.6, 0.5)); T(headB, { y: (1 - kb) * 30, a: kb });
    // counting card
    const k1 = eOut(prog(t, 22.95, 0.7)); T(c1, { x: lerp(-900, 130, k1) - aOut * 1100, y: 250 + Math.sin(t * 1.6) * 6, r: lerp(-8, -1.5, k1), a: A });
    bones.forEach((b, i) => { const kk = prog(t, 23.7 + i * 0.32, 0.3); T(b, { y: (1 - eBack(kk)) * -160, s: .6 + .4 * eBack(kk), a: kk > 0 ? A : 0 }); T(nums[i], { y: (1 - eOut(prog(t, 23.9 + i * 0.32, 0.3))) * 30, a: prog(t, 23.9 + i * 0.32, 0.2) * A }); });
    // tracing card
    const k2 = eOut(prog(t, 23.2, 0.7)); T(c2, { x: lerp(2300, 990, k2) + aOut * 1100, y: 280 + Math.sin(t * 1.6 + 1) * 6, r: lerp(8, 1.5, k2), a: A });
    const p1 = prog(t, 24.4, 0.6), p2 = prog(t, 25.0, 0.5); drawOn(l1, p1); drawOn(l2, p2);
    let pt = null; if (p1 > 0 && p1 < 1) pt = l1.getPointAtLength(l1._len * p1); else if (p2 > 0 && p2 < 1) pt = l2.getPointAtLength(l2._len * p2);
    T(pen, { x: (pt ? pt.x : 0) + 20, y: (pt ? pt.y : 0) - 14, r: -35, a: pt ? A : 0 });
    // answer key
    const kk = spring(prog(t, 25.6, 0.8)); T(key, { x: lerp(2200, 510, eOut(prog(t, 25.6, 0.7))), y: 190 + Math.sin(t * 1.6) * 5, r: lerp(10, -1.5, kk), a: t > 25.55 ? 1 : 0 });
    keyCells.forEach((ck, i) => { const kc = eBack(prog(t, 26.5 + i * 0.35, 0.35)); T(ck, { s: kc, a: kc > 0 ? 1 : 0 }); drawOn(ck.querySelector('.ck'), prog(t, 26.65 + i * 0.35, 0.3)); });
    const ks = spring(prog(t, 28.3, 0.6)); T(sticker, { x: 1220 - 0, y: 820, s: ks, r: -6 + Math.sin(t * 5) * 2, a: ks > 0 ? 1 : 0 }); sticker.style.transformOrigin = '0 50%';
    updConfetti(conf, t, 28.6, 960, 620, 1.9);
  };
};

// ======================= BONUS PACK =======================
builders.bonus = (root) => {
  const QR = window.QR || [], N = QR.length || 33, QS = 13;
  const card = mk(root, 'width:560px;height:700px', ''); card.classList.add('card');
  let rects = ''; QR.forEach((row, y) => row.forEach((v, x) => { if (v) rects += `<rect x="${x * QS}" y="${y * QS}" width="${QS}" height="${QS}"/>`; }));
  const qr = mk(card, `left:60px;top:60px;width:${N * QS}px;height:${N * QS}px`, svgNS(`<rect width="${N * QS}" height="${N * QS}" fill="#fff"/><g fill="${NAVY}">${rects}</g>`, `0 0 ${N * QS} ${N * QS}`, `width:${N * QS}px;height:${N * QS}px`));
  const scan = mk(card, `left:44px;top:60px;width:${N * QS + 32}px;height:10px;background:${PINK};border-radius:6px;box-shadow:0 0 24px ${PINK}`, '');
  mk(card, 'left:0;top:540px;width:560px;text-align:center;font:700 40px P;color:' + NAVY, 'Scan the QR code');
  mk(card, 'left:0;top:596px;width:560px;text-align:center;font:500 26px P;color:#6f6a8a', 'logicmanse.ca/LeiaColoringBook');
  const head = words(root, [['Free', PINK], ['bonus', PINK, 1], ['color', NAVY], ['pack', NAVY]], 'left:860px;top:100px', 31.4, 0.18, '700 104px/112px P');
  setTimes(head.ws, [31.4, 31.75, 32.05, 32.3]);
  const ref = mk(root, 'width:340px;height:440px;background:#fff;padding:12px;border-radius:12px;box-shadow:0 24px 44px rgba(90,50,60,.3)', `<img src="assets/forest-color.jpg" style="width:316px;height:416px;object-fit:cover;display:block;border-radius:4px">`);
  const refL = mk(root, `width:340px;height:60px;background:${TEAL};border-radius:999px;text-align:center;font:600 28px/60px P;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.18)`, 'Color reference pages');
  const pol = mk(root, 'width:340px;height:440px;background:#fff;padding:14px 14px 70px;border-radius:12px;box-shadow:0 24px 44px rgba(90,50,60,.3)', `<div style="width:312px;height:340px;background:linear-gradient(160deg,#ffe3ec,#fff3d6);border-radius:6px;display:flex;align-items:center;justify-content:center">${PAW('#d81b60').replace('<svg', '<svg style="width:170px;height:170px"')}</div><div style="text-align:center;font:600 28px P;color:${NAVY};margin-top:14px">Leia</div>`);
  const polL = mk(root, `width:340px;height:60px;background:${PINK};border-radius:999px;text-align:center;font:600 28px/60px P;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.18)`, 'Real photos of Leia');
  const free = mk(root, `height:84px;padding:0 40px;background:${GOLD};border-radius:999px;font:700 40px/84px P;color:${NAVY};white-space:nowrap;box-shadow:0 14px 30px rgba(0,0,0,.2)`, 'Free download');
  const conf = confetti(root, 34, 101);
  const sp = sparkles(root, [[860, 100, 1, 0], [1850, 220, 1.1, 1.5], [840, 930, .9, 3]], PINK);
  cue(29.8, 'whoosh'); cue(30.3, 'scratch', .9); cue(31.4, 'chime'); cue(33.0, 'pop'); cue(34.4, 'pop'); cue(34.6, 'conf'); cue(33.8, 'tap', 4);
  return (t) => {
    updSparkles(sp, t, 30.0, 35.7);
    const k = eOut(prog(t, 29.75, 0.7)); T(card, { x: lerp(-700, 150, k), y: 190 + Math.sin(t * 1.6) * 6, r: lerp(-8, -2, k) });
    qr.style.clipPath = `inset(0 0 ${(100 - 100 * eOut(prog(t, 30.1, 1.1))).toFixed(1)}% 0)`;
    const sp_ = prog(t, 30.1, 1.1), sw = prog(t, 31.5, 1.6);
    T(scan, { y: 60 + (sp_ < 1 ? sp_ * N * QS : (Math.abs(Math.sin(sw * Math.PI * 1.5)) * N * QS)), a: t > 30.1 && t < 33.3 ? 0.9 : 0 });
    updWords(head.ws, t);
    const kr = spring(prog(t, 32.9, 0.6)); T(ref, { x: 900, y: 380 + Math.sin(t * 1.5) * 6, r: lerp(-30, -6, kr), s: .5 + .5 * kr, a: kr > 0 ? 1 : 0 });
    const klr = eBack(prog(t, 33.2, 0.4)); T(refL, { x: 900, y: 845, s: klr, a: klr > 0 ? 1 : 0 });
    const kp = spring(prog(t, 34.3, 0.6)); T(pol, { x: 1330, y: 400 + Math.sin(t * 1.5 + 1) * 6, r: lerp(30, 5, kp), s: .5 + .5 * kp, a: kp > 0 ? 1 : 0 });
    const klp = eBack(prog(t, 34.6, 0.4)); T(polL, { x: 1330, y: 855, s: klp, a: klp > 0 ? 1 : 0 });
    const kf = spring(prog(t, 33.6, 0.6)); T(free, { x: 1500, y: 130, s: kf, r: -5, a: kf > 0 ? 1 : 0 }); free.style.transformOrigin = '0 50%';
    updConfetti(conf, t, 34.5, 1300, 560, 1.9);
  };
};

// ======================= END CARD =======================
builders.end = (root) => {
  const cov = mk(root, 'width:600px;height:803px;border-radius:12px;overflow:hidden;box-shadow:0 40px 70px rgba(120,60,90,.35)', '<img src="assets/cover-front.jpg" style="width:600px;height:803px;display:block;object-fit:cover">');
  const t1 = mk(root, 'left:860px;top:90px;font:700 92px/100px P;color:' + NAVY, 'Super Leia');
  const t2 = mk(root, 'left:860px;top:192px;font:700 92px/100px P;color:' + PINK, 'to the Rescue!');
  const t3 = mk(root, 'left:860px;top:312px;font:600 38px P;color:' + TEAL, 'Coloring &amp; activity book · Ages 4–8');
  const rows = ['106 pages of fun', '30 coloring pages', 'Mazes, word searches &amp; more', 'Answer key + free bonus pack'].map((txt, i) => {
    const g = mk(root, 'width:900px;height:70px', '');
    mk(g, 'left:0;top:6px;width:58px;height:58px', svgNS(`<circle cx="29" cy="29" r="28" fill="${GREEN}"/><path class="ck" d="M15,30 L25,40 L44,18" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 58 58', 'width:58px;height:58px'));
    mk(g, 'left:84px;top:0;height:70px;font:600 40px/70px P;color:' + NAVY, txt);
    cue(36.4 + i * 0.55, 'tick'); return g;
  });
  const by = mk(root, 'left:860px;top:728px;font:500 28px P;color:#6f6a8a', 'A LogicManse Publications book by @Antz');
  const cta = mk(root, 'left:860px;top:782px;height:76px;padding:0 40px;background:' + NAVY + ';border-radius:999px;font:600 32px/76px P;color:#fff;white-space:nowrap;box-shadow:0 12px 24px rgba(0,0,0,.25)', 'On Amazon &amp; Etsy  ·  logicmanse.ca');
  const av = [0, 1, 2].map(i => mk(root, `width:104px;height:104px;border-radius:50%;border:6px solid ${[PINK, TEAL, GOLD][i]};overflow:hidden;background:#fff`, '<img src="assets/leia-avatar.jpg" style="width:92px;height:92px;display:block">'));
  const conf = confetti(root, 50, 29);
  const paws = pawTrail(root, '#d81b60', 18);
  const sp = sparkles(root, [[820, 120, 1.1, 0], [1830, 300, 1, 1.4], [150, 940, 1, 3]], PINK);
  cue(35.8, 'whoosh'); cue(36.3, 'conf'); [0, 1, 2].forEach(i => cue(39.6 + i * 0.3, 'bark', 0));
  return (t) => {
    const k = spring(prog(t, 35.8, 0.9)), kx = eOut(prog(t, 35.8, 0.7));
    T(cov, { x: lerp(-700, 150, kx), y: 100 + Math.sin(t * 1.6) * 9, r: lerp(-20, -4, k) + Math.sin(t * 1.1) * 1.3, s: lerp(.8, 1, k) });
    const kt = eOut(prog(t, 36.2, 0.6)); T(t1, { y: (1 - kt) * 30, a: kt });
    const kt2 = eOut(prog(t, 36.4, 0.6)); T(t2, { y: (1 - kt2) * 30, a: kt2 });
    const kt3 = eOut(prog(t, 36.6, 0.6)); T(t3, { y: (1 - kt3) * 20, a: kt3 });
    rows.forEach((g, i) => { const st = 36.4 + i * 0.55 + 0.7, kk = eOut(prog(t, st, 0.5)); T(g, { x: 860 + (1 - kk) * 80, y: 408 + i * 78, a: kk }); drawOn(g.querySelector('.ck'), prog(t, st + 0.3, 0.35)); });
    const kb = eOut(prog(t, 39.6, 0.6)); T(by, { a: kb });
    const kcta = spring(prog(t, 40.3, 0.7)); T(cta, { s: kcta, a: kcta > 0 ? 1 : 0, y: Math.sin(t * 2.5) * 3 }); cta.style.transformOrigin = '0 50%';
    updSparkles(sp, t, 36.4, 99);
    av.forEach((a, i) => { const st = 39.6 + i * 0.3, kk = t - st, hop = kk > 0 ? -Math.abs(Math.sin(kk * 3.4 + i)) * 26 : 0; T(a, { x: 1330 + i * 150, y: 872 + hop + (1 - eBack(clamp(kk / 0.5))) * 160, a: kk > 0 ? 1 : 0 }); });
    updPaws(paws, t, 37.5, 180, 800, 940, 16, 0.18, 1.8);
    updConfetti(conf, t, 36.3, 960, 600, 2.4);
  };
};

// ---------- captions (word-highlight, burned in) ----------
const capLayer = mk(stage, `width:${W}px;height:${H}px`, '');
const WORDS = window.WORDS || [], PHR = window.PHRASES || [];
const caps = PHR.map((idx, n) => {
  const box = mk(capLayer, 'left:0;top:988px;width:1920px;text-align:center', '');
  const pill = document.createElement('span');
  pill.style.cssText = `display:inline-block;background:rgba(255,255,255,.96);border-radius:24px;padding:8px 24px 12px 34px;box-shadow:0 10px 26px rgba(60,40,10,.22);font:600 46px/1.3 P;color:${NAVY};white-space:nowrap`;
  const ws = idx.map(i => { const sp = document.createElement('span'); sp.style.cssText = 'display:inline-block;margin-right:.27em'; sp.textContent = WORDS[i].w; pill.appendChild(sp); return { sp, w: WORDS[i] }; });
  box.appendChild(pill);
  const s = WORDS[idx[0]].s - 0.05; let e = WORDS[idx[idx.length - 1]].e + 0.25;
  if (n < PHR.length - 1) e = Math.min(e, WORDS[PHR[n + 1][0]].s - 0.02);
  return { box, ws, s, e };
});
function updCaps(t) {
  caps.forEach(c => {
    if (t < c.s || t >= c.e) { c.box.style.display = 'none'; return; }
    const kin = spring(prog(t, c.s, 0.28)), kout = 1 - prog(t, c.e - 0.1, 0.1);
    T(c.box, { y: (1 - eOut(prog(t, c.s, 0.2))) * 16, s: 0.92 + 0.08 * kin, a: Math.min(1, prog(t, c.s, 0.08) * 1.5) * kout });
    c.ws.forEach(({ sp, w }) => {
      const on = t >= w.s - 0.02 && t < w.e + 0.04, done = t >= w.e + 0.04;
      sp.style.color = on ? ORANGE : NAVY; sp.style.opacity = (on || done) ? 1 : 0.5;
      sp.style.transform = on ? 'translateY(-3px)' : 'none';
    });
  });
}

// ---------- assemble ----------
const upd = {};
for (const k in builders) upd[k] = builders[k](scn[k]);
const hookRoot = scn.hook;

window.renderAt = function (t) {
  updBg(t);
  for (const k in S) {
    const [a, b] = S[k];
    const vis = t >= a - 0.001 && t < b + 0.001;
    scn[k].style.display = vis ? '' : 'none';
    if (vis) upd[k](t);
  }
  // hook fades as the cover scene takes over
  const hk = scn.hook; hk.style.opacity = (1 - prog(t, 2.3, 0.25)).toFixed(3);
  // scene wipes: colour circle grows, then the sheet lifts away
  WIPES.forEach(([tb], i) => {
    const e = wipeEls[i], p = (t - (tb - 0.4)) / 0.8;
    if (p <= 0 || p >= 1) { e.style.display = 'none'; return; }
    e.style.display = '';
    if (p < 0.5) { e.style.transform = 'none'; e.style.clipPath = `circle(${(eIO(p * 2) * 2300).toFixed(0)}px at 960px 1180px)`; }
    else { e.style.clipPath = 'none'; e.style.transform = `translateY(${(-eIO((p - 0.5) * 2) * 1100).toFixed(0)}px)`; }
  });
  updCaps(t);
  return true;
};
window.TOTAL = TOTAL;
window.getCues = () => CUES.slice().sort((a, b) => a.t - b.t);
document.fonts.ready.then(() => { window.READY = true; });
