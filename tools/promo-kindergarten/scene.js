/* Leia Kindergarten promo — every frame is a pure function of t (seconds).
   window.renderAt(t) positions everything; window.CUES lists sound-effect cues. */
'use strict';
const W = 1920, H = 1080, TOTAL = 46.4;
const NAVY = '#25213f', ORANGE = '#c4680f', TEAL = '#1f8a93', GREEN = '#1f6b3a', RED = '#b72f2c', PURPLE = '#8a55c8',
  GOLD = '#f2b632', CREAM = '#fff6e4';
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

// ---------- scene timeline (output seconds; original voice/music is delayed 2.3 s) ----------
const S = {
  hook: [0, 2.6], cover: [2.3, 7.4], trace: [7.4, 13.3], count: [13.3, 18.4],
  solve: [18.4, 24.2], friends: [24.2, 29.6], grown: [29.6, 36.0], end: [36.0, TOTAL]
};
const WIPES = [[7.4, TEAL], [13.3, '#e8731a'], [18.4, GREEN], [24.2, RED], [29.6, NAVY], [36.0, '#f2b632']];

// ---------- persistent background ----------
const bg = mk(stage, `width:${W}px;height:${H}px`, '');
const blobs = [
  mk(bg, 'width:1100px;height:1100px;border-radius:50%;background:#f9dfba;opacity:.55'),
  mk(bg, 'width:900px;height:900px;border-radius:50%;background:#cfe0bd;opacity:.6'),
  mk(bg, 'width:700px;height:700px;border-radius:50%;background:#e4d8f4;opacity:.45'),
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

// ======================= HOOK =======================
builders.hook = (root) => {
  const l1 = mk(root, 'left:0;top:330px;width:1920px;text-align:center', `<span style="font:700 96px P;color:${NAVY}">Tired of the daily battle…</span>`);
  const l2 = mk(root, 'left:0;top:470px;width:1920px;text-align:center', `<span style="font:700 96px P;color:${NAVY}">to get them </span><span style="font:700 96px P;color:${ORANGE}">writing and counting</span><span style="font:700 96px P;color:${NAVY}">?</span>`);
  // frustrated scribble drawn under line 1 by a pencil
  const sc = mk(root, 'left:360px;top:440px;width:1200px;height:80px',
    svgNS(`<path id="scrib" d="M0,40 C40,0 70,80 110,30 S190,70 230,25 S320,75 360,30 S450,70 490,28 S580,72 620,30 S710,72 750,28 S840,70 880,32 S970,68 1010,34 S1100,60 1190,40" fill="none" stroke="#e5483f" stroke-width="10" stroke-linecap="round"/>`, '0 0 1200 80', 'width:1200px;height:80px'));
  const scrib = sc.querySelector('path');
  const pen = mk(root, 'width:136px;height:24px', PENCIL);
  // crumpled-paper balls that bounce off
  const balls = [0, 1, 2].map(i => mk(root, 'width:90px;height:90px', svgNS(`<path d="M-38,-4 L-22,-30 L2,-38 L30,-26 L40,2 L26,30 L-2,40 L-28,30Z" fill="#fff" stroke="#c9bfa4" stroke-width="4" stroke-linejoin="round"/><path d="M-22,-30 L-4,-8 L30,-26 M-4,-8 L-2,40 M-38,-4 L-4,-8 L40,2" stroke="#d9cfb6" stroke-width="3" fill="none"/>`, '-50 -50 100 100', 'width:90px;height:90px')));
  cue(0.15, 'tick'); cue(1.0, 'bonk');
  return (t) => {
    const k1 = eOut(prog(t, 0.05, 0.5)), k2 = eOut(prog(t, 0.95, 0.5));
    T(l1, { y: (1 - k1) * 40, a: k1 });
    T(l2, { y: (1 - k2) * 40, a: k2 });
    const sp = prog(t, 0.5, 0.9);
    drawOn(scrib, sp);
    T(sc, { a: sp > 0 ? 1 - prog(t, 1.5, 0.3) : 0 });
    if (scrib._len && sp > 0 && sp < 1) {
      const p = scrib.getPointAtLength(scrib._len * sp);
      T(pen, { x: 360 + p.x + 10, y: 440 + p.y - 22, r: -28 + Math.sin(t * 40) * 3, a: 1 });
    } else T(pen, { a: 0 });
    balls.forEach((b, i) => {
      const st = 1.0 + i * 0.14, kk = t - st;
      if (kk < 0 || kk > 1.4) { T(b, { a: 0 }); return; }
      const x = 1500 + i * 150 + kk * (180 + i * 90);
      const y = 640 - 360 * kk + 900 * kk * kk;
      T(b, { x, y, r: kk * 360, a: 1 });
    });
  };
};

// ======================= COVER =======================
builders.cover = (root) => {
  const cov = mk(root, `width:680px;height:880px;border-radius:12px;overflow:hidden;box-shadow:0 40px 70px rgba(120,70,10,.35),0 8px 18px rgba(120,70,10,.2)`,
    '<img src="assets/cover-front.jpg" style="width:680px;height:880px;display:block">');
  const sp = sparkles(root, [[160, 190, 1.1, 0], [830, 110, .9, 1.6], [880, 880, 1.2, 3], [120, 930, .8, 4.5], [880, 520, .7, 2.2]]);
  const h1 = words(root, [['Learning', NAVY], ['that', NAVY, 1], ['feels', NAVY], ['like', NAVY], ['play.', ORANGE]], 'left:1010px;top:200px', 3.35, 0.16, '700 104px/116px P');
  const ul = mk(root, 'left:1500px;top:428px;width:280px;height:30px', svgNS(`<path d="M4,18 C50,4 100,28 145,12 S230,22 276,8" fill="none" stroke="${ORANGE}" stroke-width="9" stroke-linecap="round"/>`, '0 0 280 30', 'width:280px;height:30px'));
  const ulp = ul.querySelector('path');
  const sub = mk(root, 'left:1010px;top:440px;font:600 38px P;color:' + TEAL, "Leia's Learning Adventures: Kindergarten");
  const chips = [['110 pages', TEAL], ['Ages 4–6', '#e8731a'], ['Letter + A4', GREEN]].map(([l, c], i) => {
    const e = mk(root, `left:${1010 + i * 0}px;top:540px`, ''); e.innerHTML = '';
    e.style.cssText += `;height:66px;background:${c};border-radius:999px;padding:0 34px;font:600 30px/66px P;color:#fff;white-space:nowrap;box-shadow:0 8px 18px rgba(0,0,0,.14)`;
    e.textContent = l; return e;
  });
  // chip x positions need widths -> fixed
  const cx = [1010, 1250, 1470];
  const paws = pawTrail(root, '#c4680f', 14);
  cue(2.45, 'whoosh'); cue(3.35, 'tick'); cue(4.4, 'pop'); cue(4.6, 'pop'); cue(4.8, 'pop');
  return (t) => {
    const k = spring(prog(t, 2.35, 0.9)), kx = eOut(prog(t, 2.35, 0.7));
    const bob = Math.sin(t * 1.7) * 9;
    T(cov, { x: lerp(-760, 170, kx), y: 100 + bob, r: lerp(-22, -5, k) + Math.sin(t * 1.2) * 1.2, s: lerp(.75, 1, k) });
    updSparkles(sp, t, 3.0, 99);
    updWords(h1.ws, t);
    T(ul, {}); drawOn(ulp, prog(t, 4.0, 0.55));
    const ks = eOut(prog(t, 3.9, 0.5)); T(sub, { x: 0, y: (1 - ks) * 24, a: ks });
    chips.forEach((c, i) => { const kk = eBack(prog(t, 4.4 + i * 0.2, 0.45)); T(c, { x: cx[i] - 1010 + 0, y: 0, s: kk, a: kk }); c.style.left = '1010px'; c.style.transform = `translate(${cx[i] - 1010}px,0) scale(${kk})`; c.style.transformOrigin = '0% 50%'; if (kk <= 0.003) c.style.display = 'none'; });
    updPaws(paws, t, 4.6, 980, 1860, 960, 26, 0.2, 1.7);
  };
};

// ======================= TRACE IT =======================
builders.trace = (root) => {
  const card = mk(root, 'width:1100px;height:760px', '');
  card.classList.add('card');
  // letters live in an SVG coordinate system placed on the card
  const svg = mk(card, 'left:0;top:0;width:1100px;height:760px', `
   <svg viewBox="0 0 1100 760" width="1100" height="760">
    <text x="60" y="64" font-family="P" font-weight="600" font-size="26" fill="#8a84a6">Aa is for</text>
    <g id="Agrp" transform="translate(70,90)">
      <path d="M150,20 L40,320 M150,20 L260,320 M88,215 L212,215" fill="none" stroke="${NAVY}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <path id="s1" d="M150,20 L40,320" fill="none" stroke="#e8731a" stroke-width="26" stroke-linecap="round" opacity=".9"/>
      <path id="s2" d="M150,20 L260,320" fill="none" stroke="#e8731a" stroke-width="26" stroke-linecap="round" opacity=".9"/>
      <path id="s3" d="M88,215 L212,215" fill="none" stroke="#e8731a" stroke-width="26" stroke-linecap="round" opacity=".9"/>
      <g id="dots"><circle cx="150" cy="20" r="22" fill="${NAVY}"/><text x="150" y="29" text-anchor="middle" font-family="P" font-weight="700" font-size="26" fill="#fff">1</text>
        <circle cx="150" cy="20" r="22" fill="${NAVY}" transform="translate(0,0)" opacity="0"/>
        <circle cx="88" cy="215" r="22" fill="${NAVY}"/><text x="88" y="224" text-anchor="middle" font-family="P" font-weight="700" font-size="26" fill="#fff">3</text>
        <circle cx="180" cy="72" r="19" fill="${NAVY}"/><text x="180" y="80" text-anchor="middle" font-family="P" font-weight="700" font-size="22" fill="#fff">2</text></g>
    </g>
    <g transform="translate(400,160)">
      <path d="M180,60 L180,240 M180,150 A80,90 0 1 0 100,240" fill="none" stroke="${NAVY}" stroke-width="16" stroke-linecap="round" opacity="0"/>
      <circle cx="105" cy="165" r="78" fill="none" stroke="${NAVY}" stroke-width="16"/>
      <path d="M183,70 L183,250" stroke="${NAVY}" stroke-width="16" stroke-linecap="round"/>
      <path id="sa" d="M183,100 C190,40 120,90 80,120 M105,87 A78,78 0 1 0 105,243 A78,78 0 1 0 105,87" fill="none" stroke="#e8731a" stroke-width="22" stroke-linecap="round" opacity=".0"/>
      <path id="sa1" d="M105,87 A78,78 0 1 0 105,243 A78,78 0 1 0 105,87" fill="none" stroke="#e8731a" stroke-width="22" stroke-linecap="round"/>
      <path id="sa2" d="M183,70 L183,250" fill="none" stroke="#e8731a" stroke-width="22" stroke-linecap="round"/>
    </g>
    <line x1="50" y1="470" x2="1050" y2="470" stroke="#3a3556" stroke-width="3"/>
    <line x1="50" y1="570" x2="1050" y2="570" stroke="#b8b2cc" stroke-width="3" stroke-dasharray="14 12"/>
    <line x1="50" y1="690" x2="1050" y2="690" stroke="#3a3556" stroke-width="3"/>
    <g id="guides" stroke="#b8b2cc" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 20" fill="none">
      <path d="M130,680 L190,500 L250,680 M150,610 L230,610"/><path d="M380,680 L440,500 L500,680 M400,610 L480,610"/><path d="M630,680 L690,500 L750,680 M650,610 L730,610"/>
    </g>
    <g id="gtrace" stroke="#e8731a" stroke-width="16" stroke-linecap="round" fill="none">
      <path id="g1" d="M130,680 L190,500 L250,680"/><path id="g2" d="M150,610 L230,610"/>
    </g>
    <circle cx="880" cy="540" r="11" fill="${NAVY}"/>
   </svg>`);
  const q = id => svg.querySelector('#' + id);
  const s1 = q('s1'), s2 = q('s2'), s3 = q('s3'), sa1 = q('sa1'), sa2 = q('sa2'), g1 = q('g1'), g2 = q('g2');
  const pen = mk(svg.firstElementChild ? card : card, 'width:136px;height:24px', PENCIL);
  // ant (animated silhouette)
  const ant = mk(card, 'left:640px;top:70px;width:360px;height:300px', svgNS(`
    <g id="antbody" fill="${NAVY}">
      <ellipse cx="80" cy="150" rx="60" ry="46"/><ellipse cx="200" cy="148" rx="44" ry="38"/><ellipse cx="300" cy="150" rx="68" ry="54"/>
      <ellipse cx="316" cy="132" rx="26" ry="12" fill="#fff" opacity=".85" transform="rotate(-18 316 132)"/>
      <circle cx="60" cy="136" r="9" fill="#fff"/>
    </g>
    <g id="legs" stroke="${NAVY}" stroke-width="9" stroke-linecap="round" fill="none"></g>
    <g id="ant1" stroke="${NAVY}" stroke-width="8" stroke-linecap="round" fill="none"><path d="M54,106 C40,70 60,46 82,56"/></g>
    <g id="ant2" stroke="${NAVY}" stroke-width="8" stroke-linecap="round" fill="none"><path d="M86,104 C86,64 112,44 130,58"/></g>`, '0 0 380 300', 'width:380px;height:300px'));
  const legs = ant.querySelector('#legs'), an1 = ant.querySelector('#ant1'), an2 = ant.querySelector('#ant2');
  const legDefs = [[170, 180, 150, 270], [200, 184, 210, 276], [240, 186, 290, 274]];
  legDefs.forEach(([x, y, fx, fy]) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', `M${x},${y} L${fx},${fy}`); legs.appendChild(p); });
  const cardLabel = mk(card, 'left:720px;top:410px;font:700 56px P;color:' + NAVY, 'Ant');
  // right column
  const ttl = words(root, [['Trace', TEAL], ['it.', TEAL]], 'left:1235px;top:215px', 8.4, 0.16, '700 124px/132px P');
  const body = mk(root, 'left:1235px;top:395px;width:590px;font:500 36px/54px P;color:#3a3556', 'Numbered start dots and arrows show where every stroke begins.');
  const ch = mk(root, 'left:1235px;top:640px', ''); ch.style.cssText += ';height:66px;background:' + TEAL + ';border-radius:999px;padding:0 30px 0 12px;display:flex;align-items:center;gap:14px;font:600 30px P;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.14)';
  ch.innerHTML = '<img src="assets/land-alphabet.png" style="flex-shrink:0;width:46px;height:46px;background:#fff;border-radius:50%">Alphabet Forest';
  const sp = sparkles(root, [[1180, 170, 1, 0], [1820, 560, .9, 2]], TEAL);
  const AG = { x: 70 + 0, y: 90 };
  const ptOn = (el, p, ox, oy) => { const pt = el.getPointAtLength(el.getTotalLength() * clamp(p)); return [ox + pt.x, oy + pt.y]; };
  const strokes = [[s1, 8.55, 0.7], [s2, 9.3, 0.7], [s3, 10.05, 0.45]];
  strokes.forEach(([, a, d]) => cue(a, 'scratch', 0.8));
  cue(10.6, 'scratch', .8); cue(11.4, 'scratch', .8); cue(12.2, 'scratch', .7);
  cue(7.5, 'whoosh');
  return (t) => {
    const k = eOut(prog(t, 7.45, 0.75));
    T(card, { x: lerp(-1300, 80, k), y: 160 + Math.sin(t * 1.4) * 6, r: lerp(-9, -1.4, k) });
    updWords(ttl.ws, t);
    const kb = eOut(prog(t, 9.0, 0.6)); T(body, { y: (1 - kb) * 20, a: kb });
    const kc = eBack(prog(t, 10.2, 0.5)); T(ch, { s: kc, a: kc }); ch.style.transformOrigin = '0 50%';
    updSparkles(sp, t, 8.0, 13.3);
    // letter A strokes + pencil
    let pen_on = false, pxy = [0, 0];
    strokes.forEach(([el, a, d]) => {
      const p = prog(t, a, d); drawOn(el, p);
      if (p > 0 && p < 1) { pen_on = true; pxy = ptOn(el, eIO(p), AG.x, AG.y); }
    });
    drawOn(sa1, prog(t, 10.6, 0.8)); drawOn(sa2, prog(t, 11.4, 0.45));
    if (prog(t, 10.6, 0.8) > 0 && prog(t, 10.6, 0.8) < 1) { pen_on = true; pxy = ptOn(sa1, prog(t, 10.6, 0.8), 400, 160); }
    else if (prog(t, 11.4, 0.45) > 0 && prog(t, 11.4, 0.45) < 1) { pen_on = true; pxy = ptOn(sa2, prog(t, 11.4, .45), 400, 160); }
    const pg1 = prog(t, 12.0, 0.45), pg2 = prog(t, 12.4, 0.3);
    drawOn(g1, pg1); drawOn(g2, pg2);
    if (pg1 > 0 && pg1 < 1) { pen_on = true; pxy = ptOn(g1, pg1, 0, 0); }
    else if (pg2 > 0 && pg2 < 1) { pen_on = true; pxy = ptOn(g2, pg2, 0, 0); }
    T(pen, { x: pxy[0] + 20, y: pxy[1] - 14, r: -35 + Math.sin(t * 38) * 2.5, a: pen_on ? 1 : 0 });
    // ant: legs march, antennae wiggle, body sways
    const w = t * 9;
    legs.childNodes.forEach((p, i) => { const sw = Math.sin(w + i * 2.1) * 14; p.setAttribute('transform', `rotate(${sw} ${legDefs[i][0]} ${legDefs[i][1]})`); });
    an1.setAttribute('transform', `rotate(${Math.sin(t * 5) * 10} 54 106)`);
    an2.setAttribute('transform', `rotate(${Math.sin(t * 5 + 1.4) * 10} 86 104)`);
    const ka = eBack(prog(t, 8.0, 0.6));
    T(ant, { x: Math.sin(t * 2.4) * 8 + (1 - ka) * 300, y: Math.abs(Math.sin(t * 4.8)) * -6, a: ka, r: Math.sin(t * 2.4) * 1.2 });
    T(cardLabel, { a: ka });
  };
};

// ======================= COUNT IT =======================
builders.count = (root) => {
  const card = mk(root, 'width:1100px;height:660px', ''); card.classList.add('card');
  const num6 = mk(card, 'left:70px;top:70px;width:260px;text-align:center;font:700 300px/300px P;color:#e8731a', '6');
  const nm = mk(card, 'left:70px;top:390px;width:260px;text-align:center;font:600 62px P;color:' + NAVY, 'six');
  // ten-frame
  const cells = [];
  for (let i = 0; i < 10; i++) {
    const c = i % 5, r = (i / 5) | 0;
    cells.push({ x: 380 + c * 134, y: 110 + r * 134 });
    mk(card, `left:${380 + c * 134}px;top:${110 + r * 134}px;width:126px;height:126px;border:5px solid ${NAVY};border-radius:20px;background:#fffaf0`);
  }
  const apples = [];
  for (let i = 0; i < 7; i++) {
    apples.push(mk(card, `left:${cells[i].x + 16}px;top:${cells[i].y + 16}px;width:100px;height:100px`, svgNS(
      `<path d="M50 28c-14-12-38-4-38 22 0 22 14 38 28 38 6 0 7-3 10-3s4 3 10 3c14 0 28-16 28-38 0-26-24-34-38-22z" fill="#e5483f"/><path d="M50 28c0-10 4-18 12-22" stroke="#6b4a2b" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="68" cy="14" rx="13" ry="7" fill="#4fa84f" transform="rotate(-25 68 14)"/><ellipse cx="30" cy="52" rx="6" ry="12" fill="#fff" opacity=".4" transform="rotate(20 30 52)"/>`, '0 0 100 100', 'width:100px;height:100px')));
  }
  const nums = [];
  for (let i = 0; i < 7; i++) nums.push(mk(card, `left:${cells[i].x}px;top:${cells[i].y - 10}px;width:126px;text-align:center;font:700 70px P;color:${ORANGE}`, String(i + 1)));
  const ripples = [];
  for (let i = 0; i < 7; i++) ripples.push(mk(card, `left:${cells[i].x + 13}px;top:${cells[i].y + 13}px;width:100px;height:100px;border-radius:50%;border:6px solid ${ORANGE}`));
  // star rating row
  const stars = [];
  for (let i = 0; i < 10; i++) stars.push(mk(card, `left:${390 + i * 66}px;top:430px;width:60px;height:60px`, svgNS(`<path d="${STAR5}" fill="#e6dfc9" stroke="#bdb39a" stroke-width="3" stroke-linejoin="round"/>`, '-52 -52 104 104', 'width:60px;height:60px')));
  const starsOn = [];
  for (let i = 0; i < 10; i++) starsOn.push(mk(card, `left:${390 + i * 66}px;top:430px;width:60px;height:60px`, svgNS(`<path d="${STAR5}" fill="${GOLD}" stroke="#d99a14" stroke-width="3" stroke-linejoin="round"/>`, '-52 -52 104 104', 'width:60px;height:60px')));
  const cap = mk(card, 'left:380px;top:540px;width:690px;font:600 44px P;color:' + TEAL, 'Touch · Say · Fill');
  
  const jumpers = []; // little confetti when 6 done
  const conf = confetti(root, 34, 41);
  const ttl = words(root, [['Count', ORANGE], ['it.', ORANGE]], 'left:1235px;top:215px', 13.8, 0.16, '700 124px/132px P');
  const body = mk(root, 'left:1235px;top:395px;width:590px;font:500 36px/54px P;color:#3a3556', 'Touch each picture, say the number, and see it fill up the ten-frame.');
  const ch = mk(root, 'left:1235px;top:640px', ''); ch.style.cssText += ';height:66px;background:#e8731a;border-radius:999px;padding:0 30px 0 12px;display:flex;align-items:center;gap:14px;font:600 30px P;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.14)';
  ch.innerHTML = '<img src="assets/land-number.png" style="flex-shrink:0;width:46px;height:46px;background:#fff;border-radius:50%">Number Meadow';
  const sp = sparkles(root, [[1210, 160, 1, 0], [1830, 600, .9, 1.7]], ORANGE);
  const T0 = 14.1, STEP = 0.38;
  for (let i = 0; i < 6; i++) cue(T0 + i * STEP, 'tap', i);
  cue(T0 + 6 * STEP + 0.15, 'chime'); cue(16.5, 'tap', 6); cue(17.1, 'chime');
  cue(13.4, 'whoosh');
  return (t) => {
    const k = eOut(prog(t, 13.35, 0.75));
    T(card, { x: lerp(-1300, 80, k), y: 200 + Math.sin(t * 1.5) * 6, r: lerp(9, 1.2, k) });
    updWords(ttl.ws, t);
    const kb = eOut(prog(t, 14.9, 0.6)); T(body, { y: (1 - kb) * 20, a: kb });
    const kc = eBack(prog(t, 15.6, 0.5)); T(ch, { s: kc, a: kc }); ch.style.transformOrigin = '0 50%';
    updSparkles(sp, t, 13.9, 18.4);
    // number 6 -> 7 morph
    const flip = prog(t, 16.15, 0.35);
    num6.textContent = flip > 0.5 ? '7' : '6'; nm.textContent = flip > 0.5 ? 'seven' : 'six';
    T(num6, { s: 1 + 0.12 * Math.sin(flip * Math.PI), sx: Math.abs(Math.cos(flip * Math.PI)) * 0.0 + (flip > 0 && flip < 1 ? Math.max(0.1, Math.abs(Math.cos(flip * Math.PI))) : 1) });
    T(nm, { a: 1 });
    // apples drop in
    for (let i = 0; i < 7; i++) {
      const st = i < 6 ? T0 + i * STEP : 16.5;
      const kk = t - st;
      const kp = clamp(kk / 0.42);
      const dropY = (1 - eOut(kp)) * -260 + (kp > 0 && kp < 1 ? 0 : 0);
      const sq = kp >= 1 ? 1 + 0.18 * Math.exp(-(kk - 0.42) * 9) * Math.sin((kk - 0.42) * 28) : 1;
      T(apples[i], { y: dropY, s: kp <= 0 ? 0 : (0.6 + 0.4 * eBack(kp)) * sq, a: kp > 0 ? 1 : 0 });
      // number label floating up
      const kn = clamp((kk - 0.35) / 0.9);
      T(nums[i], { y: -kn * 70, s: 0.7 + 0.5 * eBack(kn * 2), a: kk > 0.35 ? 1 - prog(kk - 0.35, 0.45, 0.45) : 0 });
      const kr = clamp((kk - 0.4) / 0.5);
      T(ripples[i], { s: 0.6 + kr * 1.1, a: kr > 0 && kr < 1 ? 0.8 * (1 - kr) : 0 });
      // stars fill
      if (i < 7) {
        const fs = prog(t, st + 0.5, 0.25);
        T(starsOn[i], { s: eBack(fs), a: fs > 0 ? 1 : 0 });
      }
    }
    for (let i = 7; i < 10; i++) T(starsOn[i], { a: 0 });
    updConfetti(conf, t, T0 + 6 * STEP + 0.1, 620, 720, 1.8);
    const kcap = eOut(prog(t, T0 + 6 * STEP, 0.5)); T(cap, { a: kcap, y: (1 - kcap) * 14 });
  };
};

// ======================= SOLVE IT =======================
builders.solve = (root) => {
  const card = mk(root, 'width:900px;height:940px', ''); card.classList.add('card');
  const CW = 140, ox = 110, oy = 100;
  const shapes = ['circle', 'heart', 'tri', 'sq', 'dia', 'hex', 'star'];
  const route = [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]];
  const onRoute = new Set(route.map(([c, r]) => c + ',' + r));
  const shapeSVG = (k, col) => {
    const f = `fill="none" stroke="${col}" stroke-width="7" stroke-linejoin="round"`;
    switch (k) {
      case 'circle': return `<circle r="22" ${f}/>`; case 'sq': return `<rect x="-22" y="-22" width="44" height="44" rx="4" ${f}/>`;
      case 'tri': return `<polygon points="0,-26 26,22 -26,22" ${f}/>`; case 'dia': return `<polygon points="0,-28 28,0 0,28 -28,0" ${f}/>`;
      case 'hex': return `<polygon points="-14,-24 14,-24 28,0 14,24 -14,24 -28,0" ${f}/>`; case 'heart': return `<path d="M0,22 C-34,-4 -18,-30 0,-10 C18,-30 34,-4 0,22Z" ${f}/>`;
      default: return `<path d="${STAR5.replace(/-?\d+(\.\d+)?/g, m => (parseFloat(m) * 0.55).toFixed(1))}" ${f}/>`;
    }
  };
  let grid = '', nodes = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) {
    const cx = ox + c * CW, cy = oy + r * CW;
    if (c < 4) grid += `<line x1="${cx}" y1="${cy}" x2="${cx + CW}" y2="${cy}" stroke="#e3dcc6" stroke-width="6"/>`;
    if (r < 5) grid += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + CW}" stroke="#e3dcc6" stroke-width="6"/>`;
  }
  const rc = ([c, r]) => [ox + c * CW, oy + r * CW];
  const pathD = route.map((p, i) => (i ? 'L' : 'M') + rc(p).join(',')).join(' ');
  for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) {
    const [cx, cy] = rc([c, r]);
    const sh = onRoute.has(c + ',' + r) ? 'star' : shapes[Math.floor(hash(c * 7 + r * 13 + 2) * 6)];
    nodes += `<g id="n${c}_${r}" transform="translate(${cx},${cy})"><circle r="52" fill="#fff" stroke="${NAVY}" stroke-width="6"/><circle class="fill" r="52" fill="#2f8f4e" opacity="0"/>${shapeSVG(sh, NAVY)}</g>`;
  }
  const svgEl = mk(card, 'left:0;top:0;width:900px;height:940px', `<svg viewBox="0 0 900 940" width="900" height="940">${grid}<path id="trail" d="${pathD}" fill="none" stroke="#3aa564" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>${nodes}<text x="16" y="34" font-family="P" font-weight="700" font-size="22" fill="${NAVY}">START</text></svg>`);
  const trail = svgEl.querySelector('#trail');
  const nodeEls = route.map(([c, r]) => svgEl.querySelector(`#n${c}_${r}`));
  const token = mk(card, 'width:84px;height:84px;border-radius:50%;background:#fff;border:6px solid #3aa564;overflow:hidden;box-shadow:0 8px 16px rgba(0,0,0,.25)', '<img src="assets/leia-line.png" style="width:96px;margin:-2px 0 0 -8px">');
  const fin = mk(card, 'left:620px;top:862px;padding:0 34px;height:72px;background:#b72f2c;border-radius:14px;font:700 40px/72px P;color:#fff;letter-spacing:2px;box-shadow:0 10px 20px rgba(0,0,0,.25)', 'FINISH!');
  const conf = confetti(root, 46, 77);
  const ttl = words(root, [['Solve', GREEN], ['it.', GREEN]], 'left:1100px;top:215px', 18.9, 0.16, '700 124px/132px P');
  const body = mk(root, 'left:1100px;top:395px;width:720px;font:500 36px/54px P;color:#3a3556', 'Only the right path reaches FINISH, so puzzles check themselves.');
  const ch = mk(root, 'left:1100px;top:640px', ''); ch.style.cssText += ';height:66px;background:' + GREEN + ';border-radius:999px;padding:0 30px 0 12px;display:flex;align-items:center;gap:14px;font:600 30px P;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.14)';
  ch.innerHTML = '<img src="assets/land-shape.png" style="flex-shrink:0;width:46px;height:46px;background:#fff;border-radius:50%">Shape Town';
  const sp = sparkles(root, [[1060, 160, 1, 0], [1850, 520, .9, 2.4]], GREEN);
  const P0 = 19.3, PD = 3.6;
  for (let i = 0; i < route.length; i++) cue(P0 + (PD * i / (route.length - 1)) * 0.9, 'step', i);
  cue(P0 + PD + 0.15, 'stamp'); cue(P0 + PD + 0.2, 'conf'); cue(18.5, 'whoosh');
  return (t) => {
    const k = eOut(prog(t, 18.45, 0.75));
    T(card, { x: lerp(-1100, 70, k), y: 70 + Math.sin(t * 1.5) * 6, r: lerp(-8, -1, k) });
    updWords(ttl.ws, t);
    const kb = eOut(prog(t, 20.0, 0.6)); T(body, { y: (1 - kb) * 20, a: kb });
    const kc = eBack(prog(t, 21.0, 0.5)); T(ch, { s: kc, a: kc }); ch.style.transformOrigin = '0 50%';
    updSparkles(sp, t, 18.9, 24.2);
    const p = eIO(prog(t, P0, PD));
    drawOn(trail, p);
    nodeEls.forEach((g, i) => {
      const reach = i / (route.length - 1), on = p > reach - 0.001 && p > 0;
      const f = g.querySelector('.fill'); f.setAttribute('opacity', on ? '1' : '0');
      const kk = clamp((p - reach) * 10); g.setAttribute('transform', g.getAttribute('transform').replace(/ scale\([^)]*\)/, '') + (on ? ` scale(${1 + 0.25 * Math.sin(kk * Math.PI)})` : ''));
    });
    if (trail._len) {
      const pt = trail.getPointAtLength(trail._len * p);
      T(token, { x: pt.x - 42, y: pt.y - 42, s: 1 + 0.08 * Math.sin(t * 14), a: p > 0 ? 1 : 0 });
    }
    const kf = spring(prog(t, P0 + PD + 0.1, 0.5));
    T(fin, { s: kf * (1 + (kf > 0 ? 0 : 0)), r: lerp(-14, -6, kf), a: kf > 0 ? 1 : 0 });
    updConfetti(conf, t, P0 + PD + 0.2, 800, 940, 2.4);
  };
};

// ======================= FRIENDS =======================
builders.friends = (root) => {
  const head = words(root, [['Seven', NAVY], ['lands.', NAVY], ['Three', NAVY], ['friends.', NAVY, 1], ['One', ORANGE], ['very', ORANGE], ['good', ORANGE], ['dog.', ORANGE]], 'left:0;top:34px;width:1920px;text-align:center', 24.55, 0.1, '700 88px/96px P');
  head.box.style.textAlign = 'center';
  const defs = [
    { n: 'ollie', cx: 330, ring: TEAL, label: 'the Owl', t: 24.75, w: 300, top: 36 },
    { n: 'ruby', cx: 770, ring: '#e8731a', label: 'the Rabbit', t: 25.25, w: 270, top: 28 },
    { n: 'bella', cx: 1210, ring: PURPLE, label: 'the Butterfly', t: 25.5, w: 330, top: 46 },
    { n: 'leia', cx: 1650, ring: RED, label: 'the Dog', t: 25.75 },
  ];
  const chars = defs.map((d, i) => {
    const grp = mk(root, 'width:440px;height:440px', '');
    const halo = mk(grp, `left:30px;top:30px;width:380px;height:380px;border-radius:50%;background:#fff8ea;box-shadow:inset 0 0 0 10px ${d.ring},0 14px 30px rgba(0,0,0,.12)`);
    if (d.n === 'leia') {
      const av = mk(grp, 'left:50px;top:50px;width:340px;height:340px;border-radius:50%;overflow:hidden', '<img src="assets/leia-line.png" style="width:400px;margin:-4px 0 0 -30px">');
      d.imgs = [av];
    } else {
      const fill = mk(grp, `left:${220 - d.w / 2}px;top:${d.top}px;width:${d.w}px`, `<img src="assets/${d.n}-fill.png" style="width:${d.w}px;display:block">`);
      const line = mk(grp, `left:${220 - d.w / 2}px;top:${d.top}px;width:${d.w}px`, `<img src="assets/${d.n}-line.png" style="width:${d.w}px;display:block">`);
      d.fill = fill; d.line = line;
    }
    const nm = mk(root, `width:440px;text-align:center;font:700 46px P;color:${NAVY}`, d.n[0].toUpperCase() + d.n.slice(1));
    const pill = mk(root, 'width:440px;text-align:center', `<span style="display:inline-block;height:50px;padding:0 26px;background:${d.ring};border-radius:999px;font:600 28px/50px P;color:#fff;white-space:nowrap">${d.label}</span>`);
    d.grp = grp; d.halo = halo; d.nm = nm; d.pill = pill;
    cue(d.t + 0.1, ['hoot', 'boing', 'flutter', 'bark'][i]);
    return d;
  });
  // land chips with icons
  const lands = [['alphabet', 'Alphabet Forest', TEAL], ['echo', 'Echo Pond', '#e8731a'], ['number', 'Number Meadow', GREEN], ['counting', 'Counting Trail', PURPLE], ['shape', 'Shape Town', RED], ['color', 'Color Garden', TEAL], ['puzzle', 'Puzzle Market', '#e8731a']];
  const landEls = lands.map(([k, lab, col], i) => {
    const g = mk(root, 'width:240px;height:150px', `<img src="assets/land-${k}.png" style="position:absolute;left:70px;top:0;width:100px;height:100px;background:#fff;border-radius:50%;box-shadow:0 6px 14px rgba(0,0,0,.18)"><div style="position:absolute;left:0;top:108px;width:240px;text-align:center;font:600 26px P;color:${col}">${lab}</div>`);
    cue(26.75 + i * 0.16, 'pop', 0.7);
    return g;
  });
  const paws = pawTrail(root, '#c4680f', 16);
  const conf = confetti(root, 30, 9);
  cue(24.3, 'whoosh'); cue(25.85, 'conf');
  const sp = sparkles(root, [[120, 220, 1, 0], [1800, 240, 1.1, 2], [960, 190, .8, 4]], GOLD);
  return (t) => {
    updWords(head.ws, t);
    updSparkles(sp, t, 25.9, 29.6);
    chars.forEach((d, i) => {
      const kk = t - d.t;
      let y = 0, sy = 1, sx = 1, r = 0, a = 0;
      if (kk >= -0.05) {
        a = 1;
        const kd = clamp(kk / 0.5);
        // drop with squash & stretch, then settle
        y = -(1 - eOut(kd)) * 700;
        if (kk < 0.5) { sy = 1 + 0.18 * (1 - kd); sx = 1 - 0.1 * (1 - kd); }
        else { const e = kk - 0.5; sy = 1 - 0.2 * Math.exp(-e * 7) * Math.cos(e * 22); sx = 1 + 0.12 * Math.exp(-e * 7) * Math.cos(e * 22); }
        // idle motion after landing
        const idle = prog(kk, 0.9, 0.4);
        if (d.n === 'ruby') y += -Math.abs(Math.sin(t * 3 + 1)) * 36 * idle;
        if (d.n === 'bella') { y += Math.sin(t * 3.4) * 16 * idle; r = Math.sin(t * 2.3) * 5 * idle; }
        if (d.n === 'ollie') r = Math.sin(t * 2.6) * 2.5 * idle;
        if (d.n === 'leia') { r = Math.sin(t * 2.1) * 4 * idle; y += Math.sin(t * 4) * 5 * idle; }
      }
      T(d.grp, { x: d.cx - 220, y: 230 + y, sx, sy, r, a });
      d.grp.style.transformOrigin = '50% 92%';
      // colour wipes onto the line art
      if (d.fill) { const kf = eOut(prog(kk, 0.35, 0.6)); d.fill.style.clipPath = `circle(${(kf * 80).toFixed(1)}% at 50% 55%)`; }
      const kl = eBack(prog(kk, 0.45, 0.4));
      T(d.nm, { x: d.cx - 220, y: 660, s: kl, a: kl });
      const kp = eBack(prog(kk, 0.62, 0.4));
      T(d.pill, { x: d.cx - 220, y: 728, s: kp, a: kp });
      d.halo.style.opacity = clamp(kk * 4);
    });
    landEls.forEach((g, i) => {
      const k = eBack(prog(t, 26.75 + i * 0.16, 0.5));
      T(g, { x: 120 + i * 245, y: 840 + (1 - k) * 80 + Math.sin(t * 2 + i) * 4, s: k, a: k > 0 ? 1 : 0 });
    });
    updPaws(paws, t, 27.8, 100, 1820, 1040, 12, 0.12, 1.4);
    updConfetti(conf, t, 25.85, 960, 460, 2.2);
  };
};

// ======================= GROWN-UPS =======================
builders.grown = (root) => {
  const ttl = words(root, [['Grown-ups', NAVY], ['love', NAVY, 1], ['it', ORANGE], ['too.', ORANGE]], 'left:100px;top:130px', 30.1, 0.16, '700 100px/112px P');
  const tips = ['A short tip on every page', 'Answer key at the back', 'A certificate to celebrate'].map((txt, i) => {
    const g = mk(root, `width:880px;height:120px;background:#fff;border-radius:22px;box-shadow:0 14px 30px rgba(120,80,20,.18);border-left:12px solid ${[TEAL, '#e8731a', GREEN][i]}`, '');
    mk(g, 'left:40px;top:28px;width:64px;height:64px', svgNS(`<circle cx="32" cy="32" r="30" fill="${GREEN}"/><path class="ck" d="M17,33 L28,44 L48,21" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 64 64', 'width:64px;height:64px'));
    mk(g, 'left:130px;top:0;height:120px;font:600 38px/120px P;color:' + NAVY, txt);
    cue(31.0 + i * 0.55, 'tick');
    return g;
  });
  const cert = mk(root, 'width:640px;height:828px;border-radius:14px;overflow:hidden;box-shadow:0 36px 70px rgba(80,50,10,.35)', '<img src="assets/certificate.jpg" style="width:640px;height:828px;display:block">');
  const seal = mk(root, 'width:200px;height:200px', svgNS(`<g><path d="${STAR5}" fill="${GOLD}" transform="scale(2)"/><circle r="64" fill="#e8a91b" stroke="#fff" stroke-width="6"/><text y="14" text-anchor="middle" font-family="P" font-weight="700" font-size="40" fill="#fff">★</text></g>`, '-100 -100 200 200', 'width:200px;height:200px'));
  const conf = confetti(root, 54, 3), conf2 = confetti(root, 30, 17);
  const sp = sparkles(root, [[1020, 150, 1, 0], [1750, 120, 1.1, 1.8], [1850, 760, 1, 3.3], [960, 880, .8, 4.8]], GOLD);
  cue(29.7, 'whoosh'); cue(33.55, 'stamp'); cue(33.6, 'conf');
  return (t) => {
    updWords(ttl.ws, t);
    updSparkles(sp, t, 30.4, 36);
    tips.forEach((g, i) => {
      const k = eOut(prog(t, 31.0 + i * 0.55, 0.6));
      T(g, { x: lerp(-1000, 100, k), y: 400 + i * 160, a: k > 0 ? 1 : 0 });
      const ck = g.querySelector('.ck'); drawOn(ck, prog(t, 31.35 + i * 0.55, 0.4));
    });
    const kc = spring(prog(t, 30.2, 1.0)), kx = eOut(prog(t, 30.2, 0.8));
    T(cert, { x: lerp(2200, 1120, kx), y: 130 + Math.sin(t * 1.5) * 7, r: lerp(18, 4, kc) });
    const ks = prog(t, 33.4, 0.35), sh = t > 33.6 && t < 34.0 ? Math.sin((t - 33.6) * 90) * 5 * (1 - (t - 33.6) / .4) : 0;
    T(seal, { x: 1500 + sh, y: 730 + sh, s: lerp(3.2, 1, eOut(ks)), r: lerp(-40, -10, eOut(ks)), a: ks > 0 ? Math.min(1, ks * 3) : 0 });
    updConfetti(conf, t, 33.6, 1440, 820, 2.4); updConfetti(conf2, t, 31.0, 960, 700, 2.0);
  };
};

// ======================= END CARD =======================
builders.end = (root) => {
  const cov = mk(root, 'width:600px;height:776px;border-radius:12px;overflow:hidden;box-shadow:0 40px 70px rgba(120,70,10,.35)', '<img src="assets/cover-front.jpg" style="width:600px;height:776px;display:block">');
  const t1 = mk(root, 'left:860px;top:90px;font:700 90px/98px P;color:' + NAVY, "Leia’s Learning");
  const t2 = mk(root, 'left:860px;top:190px;font:700 90px/98px P;color:' + ORANGE, 'Adventures');
  const t3 = mk(root, 'left:860px;top:310px;font:600 38px P;color:' + TEAL, 'Kindergarten workbook · Ages 4–6');
  const rows = ['110 printable pages', 'US Letter and A4 PDFs', 'Answer key included', 'Instant download'].map((txt, i) => {
    const g = mk(root, 'width:900px;height:70px', '');
    mk(g, 'left:0;top:6px;width:58px;height:58px', svgNS(`<circle cx="29" cy="29" r="28" fill="${GREEN}"/><path class="ck" d="M15,30 L25,40 L44,18" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 58 58', 'width:58px;height:58px'));
    mk(g, 'left:84px;top:0;height:70px;font:600 40px/70px P;color:' + NAVY, txt);
    cue(36.75 + i * 0.6, 'tick');
    return g;
  });
  const by = mk(root, 'left:860px;top:752px;font:500 28px P;color:#6f6a8a', 'A LogicManse Publications book by @Antz');
  const cta = mk(root, 'left:860px;top:810px;height:78px;padding:0 40px;background:' + NAVY + ';border-radius:999px;font:600 32px/78px P;color:#fff;white-space:nowrap;box-shadow:0 12px 24px rgba(0,0,0,.25)', 'On Amazon &amp; Etsy  ·  logicmanse.ca');
  const conf = confetti(root, 50, 29);
  // the four friends cheer along the bottom
  const mini = ['ollie', 'ruby', 'bella'].map((n, i) => {
    const g = mk(root, 'width:200px;height:200px', `<img src="assets/${n}-fill.png" style="position:absolute;left:0;top:0;height:150px"><img src="assets/${n}-line.png" style="position:absolute;left:0;top:0;height:150px">`);
    return g;
  });
  const leiaMini = mk(root, 'width:136px;height:136px;border-radius:50%;background:#fff8ea;border:8px solid ' + RED + ';overflow:hidden', '<img src="assets/leia-line.png" style="width:160px;margin:-3px 0 0 -12px">');
  const paws = pawTrail(root, '#c4680f', 18);
  const sp = sparkles(root, [[820, 120, 1.1, 0], [1830, 300, 1, 1.4], [150, 940, 1, 3]], GOLD);
  cue(36.1, 'whoosh'); cue(36.6, 'conf');
  for (let i = 0; i < 4; i++) cue(40.2 + i * 0.28, 'pop', 0.6);
  return (t) => {
    const k = spring(prog(t, 36.1, 0.9)), kx = eOut(prog(t, 36.1, 0.7));
    T(cov, { x: lerp(-700, 150, kx), y: 120 + Math.sin(t * 1.6) * 9, r: lerp(-20, -4, k) + Math.sin(t * 1.1) * 1.3, s: lerp(.8, 1, k) });
    const kt = eOut(prog(t, 36.5, 0.6)); T(t1, { y: (1 - kt) * 30, a: kt });
    const kt2 = eOut(prog(t, 36.7, 0.6)); T(t2, { y: (1 - kt2) * 30, a: kt2 });
    const kt3 = eOut(prog(t, 36.9, 0.6)); T(t3, { y: (1 - kt3) * 20, a: kt3 });
    rows.forEach((g, i) => {
      const st = 36.75 + i * 0.6 + 0.7, kk = eOut(prog(t, st, 0.5));
      T(g, { x: 860 + (1 - kk) * 80, y: 420 + i * 86, a: kk });
      g.querySelector('.ck') && drawOn(g.querySelector('.ck'), prog(t, st + 0.3, 0.35));
    });
    const kb = eOut(prog(t, 40.0, 0.6)); T(by, { a: kb });
    const kcta = spring(prog(t, 40.9, 0.7)); T(cta, { s: kcta, a: kcta > 0 ? 1 : 0, y: Math.sin(t * 2.5) * 3 }); cta.style.transformOrigin = '0 50%';
    updSparkles(sp, t, 37, 99);
    mini.forEach((g, i) => {
      const st = 40.2 + i * 0.28, kk = t - st;
      const hop = kk > 0 ? -Math.abs(Math.sin(kk * 3.2 + i)) * 30 : 0;
      const kd = eBack(clamp(kk / 0.5));
      T(g, { x: 880 + i * 190, y: 920 + hop + (1 - kd) * 200, s: 1, a: kk > 0 ? 1 : 0 });
    });
    const kl = t - 40.9;
    T(leiaMini, { x: 1450, y: 926 - Math.abs(Math.sin(Math.max(kl, 0) * 3.4)) * 26, s: kl > 0 ? eBack(kl / 0.5) : 0, a: kl > 0 ? 1 : 0 });
    updPaws(paws, t, 38.0, 180, 800, 1030, 16, 0.18, 1.8);
    updConfetti(conf, t, 36.6, 960, 600, 2.4);
  };
};

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
  // very first cover wipe handled by cross-fade; keep wipe scenes hidden before start
  return true;
};
window.TOTAL = TOTAL;
window.getCues = () => CUES.slice().sort((a, b) => a.t - b.t);
document.fonts.ready.then(() => { window.READY = true; });
