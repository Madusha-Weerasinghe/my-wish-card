/*
  Bouquet data.

  Each flower type is a list of petal rings:
    n     petals in the ring
    off   angle offset (deg) so rings interleave
    lift  how far petals curl toward the viewer (negative = cup)
    z     depth of the ring (px)
    s     ring size multiplier
    w     petal width multiplier (small = slim petals)

  Colours are blended from the outer ring to the inner ring.
*/

const CALYX = { n: 6, off: 0, lift: -8, z: -4, s: 0.42, w: 0.55, green: true };

const TYPES = {
  rose: {
    calyx: true,
    rings: [
      { n: 9, off: 0, lift: -22, z: 0, s: 1, w: 1.05 },
      { n: 8, off: 20, lift: -40, z: 4, s: 0.86, w: 1 },
      { n: 7, off: 8, lift: -58, z: 8, s: 0.7, w: 0.95 },
      { n: 5, off: 30, lift: -74, z: 12, s: 0.5, w: 0.9 },
      { n: 3, off: 0, lift: -84, z: 15, s: 0.32, w: 0.9 },
    ],
  },

  daisy: {
    calyx: true,
    rings: [
      { n: 16, off: 0, lift: -10, z: 0, s: 1, w: 0.36 },
      { n: 16, off: 11, lift: -16, z: 2, s: 0.88, w: 0.36 },
    ],
    center: { d: 26, z: 6, a: "#ffd84a", b: "#d99a1c" },
  },

  sunflower: {
    calyx: true,
    rings: [
      { n: 20, off: 0, lift: -6, z: 0, s: 1, w: 0.34 },
      { n: 20, off: 9, lift: -12, z: 2, s: 0.9, w: 0.34 },
      { n: 14, off: 5, lift: -20, z: 4, s: 0.72, w: 0.34 },
    ],
    center: { d: 44, z: 6, a: "#8a5522", b: "#2f1c0c", seeds: true },
  },

  tulip: {
    rings: [
      { n: 3, off: 0, lift: -56, z: 0, s: 0.9, w: 1.3 },
      { n: 3, off: 60, lift: -44, z: 4, s: 0.9, w: 1.3 },
      { n: 3, off: 30, lift: -70, z: 2, s: 0.7, w: 1.1 },
    ],
  },

  cosmos: {
    calyx: true,
    rings: [
      { n: 8, off: 0, lift: -16, z: 0, s: 1, w: 0.95 },
      { n: 8, off: 22.5, lift: -28, z: 3, s: 0.78, w: 0.9 },
    ],
    center: { d: 16, z: 8, a: "#ffe08a", b: "#d9962a" },
  },
};

/*
  c   = [outer tip, outer base, inner tip, inner base]
  d   = bloom start delay (s)
  sz  = flower scale
  tx  = tilt up/back (deg), ty = turn left/right (deg), tz = roll (deg)
*/
const BLOOMS = [
  { t: "sunflower", x: 130, y: 58, sz: 0.58, d: 1.0, tx: 26, ty: 0, tz: 0, c: ["#ffe98a", "#f6b800", "#ffd94a", "#e89a00"] },
  { t: "cosmos", x: 56, y: 98, sz: 0.5, d: 1.2, tx: 34, ty: -30, tz: -10, c: ["#e8d2ff", "#a566e0", "#d5a9f7", "#8746c4"] },
  { t: "tulip", x: 204, y: 94, sz: 0.5, d: 1.3, tx: 20, ty: 22, tz: 10, c: ["#ffb9a3", "#ee5a45", "#ff9a80", "#d63c2a"] },
  { t: "rose", x: 94, y: 134, sz: 0.5, d: 1.5, tx: 40, ty: -16, tz: -6, c: ["#f2707d", "#a5122b", "#c42a44", "#6c0a1c"] },
  { t: "daisy", x: 166, y: 138, sz: 0.48, d: 1.6, tx: 32, ty: 18, tz: 8, c: ["#ffffff", "#e6e0f0", "#ffffff", "#f1ecf7"] },
  { t: "cosmos", x: 30, y: 154, sz: 0.42, d: 1.8, tx: 36, ty: -42, tz: -16, c: ["#d6e8ff", "#5b8def", "#b3d0ff", "#3f6fd0"] },
  { t: "tulip", x: 232, y: 154, sz: 0.42, d: 1.9, tx: 26, ty: 36, tz: 16, c: ["#fff5b0", "#f2c230", "#ffe86e", "#dba417"] },
  { t: "rose", x: 130, y: 174, sz: 0.5, d: 2.0, tx: 44, ty: 6, tz: 2, c: ["#ffe0cf", "#f6a17f", "#f7b394", "#d4694a"] },
];

// Small filler sprigs (baby's breath): x, y = tip of the sprig.
const FILLERS = [
  { x: 14, y: 116 },
  { x: 40, y: 58 },
  { x: 88, y: 24 },
  { x: 174, y: 26 },
  { x: 224, y: 60 },
  { x: 248, y: 112 },
  { x: 84, y: 82 },
  { x: 186, y: 84 },
];

// x, y = base of the leaf, r = rotation (deg), l = length scale
const LEAVES = [
  { x: 118, y: 206, r: -150, l: 1.15 },
  { x: 142, y: 206, r: -30, l: 1.15 },
  { x: 104, y: 194, r: -122, l: 0.95 },
  { x: 156, y: 194, r: -58, l: 0.95 },
  { x: 92, y: 172, r: -168, l: 0.85 },
  { x: 168, y: 172, r: -12, l: 0.85 },
  { x: 126, y: 124, r: -100, l: 0.8 },
  { x: 134, y: 124, r: -80, l: 0.8 },
];

const ANCHOR = { x: 130, y: 250 };

/* ---------- helpers ---------- */

// Small seeded random so the bouquet looks natural but never changes.
function rng(seed) {
  let a = seed * 2654435761;

  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;

    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mix(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);

  const ch = (shift) =>
    Math.round(((a >> shift) & 255) * (1 - t) + ((b >> shift) & 255) * t);

  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

/* ---------- petals ---------- */

function renderPetals(bloom, index) {
  const def = TYPES[bloom.t];
  const random = rng(index + 3);

  const rings = def.calyx ? [CALYX, ...def.rings] : def.rings;
  const last = Math.max(def.rings.length - 1, 1);

  return rings
    .map((ring, ri) => {
      let tip;
      let base;

      if (ring.green) {
        tip = "#9cc37f";
        base = "#3f6b3a";
      } else {
        const level = (def.calyx ? ri - 1 : ri) / last;

        tip = mix(bloom.c[0], bloom.c[2], level);
        base = mix(bloom.c[1], bloom.c[3], level);
      }

      return Array.from({ length: ring.n }, (_, i) => {
        const vars = [
          `--i:${i}`,
          `--n:${ring.n}`,
          `--off:${ring.off}deg`,
          `--jr:${((random() - 0.5) * 12).toFixed(1)}deg`,
          `--lift:${(ring.lift + (random() - 0.5) * 12).toFixed(1)}deg`,
          `--z:${ring.z}px`,
          `--s:${(ring.s * (0.94 + random() * 0.12)).toFixed(3)}`,
          `--w:${ring.w}`,
          `--delay:${(bloom.d + ri * 0.18).toFixed(2)}s`,
          `--tip:${tip}`,
          `--base:${base}`,
        ].join(";");

        return `<div class="petal" style="${vars}"></div>`;
      }).join("");
    })
    .join("");
}

function renderCenter(bloom) {
  const { center } = TYPES[bloom.t];

  if (!center) return "";

  const vars = `--cd:${center.d}px;--cz:${center.z + 14}px;--ca:${center.a};--cb:${center.b};--cdelay:${(bloom.d + 0.6).toFixed(2)}s`;

  return `<div class="flower-center${center.seeds ? " seeds" : ""}" style="${vars}"></div>`;
}

function renderBloom(bloom, index) {
  // Negative delay so the flowers sway out of step.
  const sway = `-${(index * 0.9).toFixed(1)}s`;

  const pose = `--tx:${bloom.tx}deg;--ty:${bloom.ty}deg;--tz:${bloom.tz}deg;--sway:${sway}`;

  return `
    <div class="bloom" style="left:${bloom.x}px;top:${bloom.y}px;--sz:${bloom.sz}">
      <div class="flower-head" style="${pose}">
        ${renderPetals(bloom, index)}
        ${renderCenter(bloom)}
      </div>
    </div>
  `;
}

/* ---------- stems ---------- */

// Path runs from the wrap up to the flower so it "grows" upward.
function stemPath(x, y, lean = 0.25) {
  const dx = x - ANCHOR.x;
  const dy = y - ANCHOR.y;

  const c1x = ANCHOR.x + dx * (1 - lean) * 0.35;
  const c1y = ANCHOR.y + dy * 0.35;

  const c2x = x;
  const c2y = y - dy * 0.45;

  return `M${ANCHOR.x} ${ANCHOR.y} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x} ${y}`;
}

function renderStems() {
  const stems = BLOOMS.map(
    (b, i) =>
      `<path class="stem" pathLength="1" d="${stemPath(b.x, b.y)}" style="--sd:${(0.3 + i * 0.08).toFixed(2)}s" />`,
  );

  const sprigs = FILLERS.map(
    (f, i) =>
      `<path class="stem sprig" pathLength="1" d="${stemPath(f.x, f.y + 6, 0.4)}" style="--sd:${(0.6 + i * 0.07).toFixed(2)}s" />`,
  );

  return `<svg class="stems" viewBox="0 0 260 330" aria-hidden="true">${sprigs.join("")}${stems.join("")}</svg>`;
}

function renderFillers() {
  return FILLERS.map((f, i) => {
    const random = rng(i + 40);

    const dots = Array.from({ length: 5 }, () => {
      const dx = (random() - 0.5) * 22;
      const dy = (random() - 0.5) * 18;
      const size = 4 + random() * 4;

      return `<span style="left:${dx.toFixed(1)}px;top:${dy.toFixed(1)}px;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px"></span>`;
    }).join("");

    return `<div class="sprig-head" style="left:${f.x}px;top:${f.y}px;--fd:${(1.6 + i * 0.08).toFixed(2)}s">${dots}</div>`;
  }).join("");
}

function renderLeaf(leaf, index) {
  return `<div class="bouquet-leaf" style="left:${leaf.x}px;top:${leaf.y}px;--r:${leaf.r}deg;--l:${leaf.l};--ld:${(0.8 + index * 0.08).toFixed(2)}s"></div>`;
}

/* ---------- stage effects ---------- */

// Tiny glints that twinkle on the flower heads once they have opened.
function renderGlints() {
  const random = rng(77);

  return BLOOMS.flatMap((b, i) =>
    [0, 1].map((k) => {
      const x = b.x + (random() - 0.5) * 34;
      const y = b.y - 6 + (random() - 0.5) * 30;
      const size = 7 + random() * 7;
      const delay = b.d + 1.6 + random() * 2 + k * 1.3;

      return `<span class="glint" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;--gs:${size.toFixed(1)}px;--gd:${delay.toFixed(2)}s;--gt:${(2.2 + random() * 1.6).toFixed(2)}s"></span>`;
    }),
  ).join("");
}

// Full-screen layer behind and around the bouquet.
export function renderFlowerFx() {
  const random = rng(5);
  const pick = (min, max) => min + random() * (max - min);

  const sparks = Array.from({ length: 14 }, () => {
    const gold = random() > 0.35;

    return `<span class="fx-spark${gold ? "" : " rose"}" style="left:${pick(4, 96).toFixed(1)}%;top:${pick(6, 92).toFixed(1)}%;--s:${pick(6, 12).toFixed(1)}px;--d:${pick(0.5, 6).toFixed(2)}s;--t:${pick(2.2, 4.6).toFixed(2)}s"></span>`;
  }).join("");

  const motes = Array.from({ length: 8 }, () =>
    `<span class="fx-mote" style="left:${pick(2, 98).toFixed(1)}%;--s:${pick(3, 8).toFixed(1)}px;--d:${pick(0, 9).toFixed(2)}s;--t:${pick(7, 13).toFixed(2)}s;--dx:${pick(-30, 30).toFixed(0)}px"></span>`,
  ).join("");

  const petals = Array.from({ length: 8 }, (_, i) => {
    const tone = ["#f7a6b6", "#f2707d", "#ffd0d6", "#ffe0cf"][i % 4];

    return `<span class="fx-petal" style="left:${pick(0, 100).toFixed(1)}%;--s:${pick(9, 16).toFixed(1)}px;--d:${pick(1, 9).toFixed(2)}s;--t:${pick(7, 12).toFixed(2)}s;--sw:${pick(24, 70).toFixed(0)}px;--c:${tone}"><i></i></span>`;
  }).join("");

  const burst = Array.from({ length: 14 }, (_, i) => {
    const angle = (360 / 14) * i + pick(-6, 6);
    const dist = pick(110, 230);

    return `<span class="fx-burst-dot${i % 3 === 0 ? " big" : ""}" style="--a:${angle.toFixed(1)}deg;--r:${dist.toFixed(0)}px"></span>`;
  }).join("");

  return `
    <div class="flower-fx" aria-hidden="true">
      <div class="fx-aura"></div>
      ${motes}
      ${petals}
      ${sparks}
      <div class="fx-burst">${burst}</div>
      <div class="fx-vignette"></div>
    </div>
  `;
}

export function renderBouquet() {
  // Lower flowers are drawn last so they overlap the ones behind.
  const ordered = BLOOMS.map((b, i) => ({ b, i })).sort((p, q) => p.b.y - q.b.y);

  return `
    <div class="bouquet">

      <div class="bouquet-back">
        ${renderStems()}
        ${LEAVES.map(renderLeaf).join("")}
        ${renderFillers()}
      </div>

      <div class="wrap wrap-back"></div>

      <div class="bouquet-blooms">
        ${ordered.map(({ b, i }) => renderBloom(b, i)).join("")}
      </div>

      <div class="wrap wrap-front"></div>

      <div class="bouquet-glints">${renderGlints()}</div>

      <div class="bow">
        <span class="bow-tail bow-tail-left"></span>
        <span class="bow-tail bow-tail-right"></span>
        <span class="bow-loop bow-loop-left"></span>
        <span class="bow-loop bow-loop-right"></span>
        <span class="bow-knot"></span>
      </div>

    </div>
  `;
}

/* ---------- wind transition ---------- */

/*
  A gust of petals blown across the screen, starting from the bouquet.
  Each petal is two nested elements: the outer one travels across the
  screen, the inner one waves up and down and tumbles, so the path curves
  like it is riding the wind.
*/
export function spawnWindPetals(count = 46) {
  const random = rng(901);
  const pick = (min, max) => min + random() * (max - min);
  const tones = ["#f7a6b6", "#f2707d", "#ffd0d6", "#ffe0cf", "#e8567a", "#fff1ea"];

  const layer = document.createElement("div");

  layer.className = "wind-layer";
  layer.setAttribute("aria-hidden", "true");

  layer.innerHTML = Array.from({ length: count }, (_, i) => {
    const size = pick(12, 26);

    const style = [
      `left:calc(50% + ${pick(-110, 110).toFixed(0)}px)`,
      `top:calc(42% + ${pick(-130, 120).toFixed(0)}px)`,
      `--s:${size.toFixed(1)}px`,
      `--dx:${pick(90, 150).toFixed(0)}vw`,
      `--dy:${pick(-60, 18).toFixed(0)}vh`,
      `--wave:${pick(30, 90).toFixed(0)}px`,
      `--rot:${pick(360, 900).toFixed(0)}deg`,
      `--dur:${pick(2.6, 4.4).toFixed(2)}s`,
      `--delay:${(i * 0.035 + pick(0, 0.5)).toFixed(2)}s`,
      `--c:${tones[i % tones.length]}`,
    ].join(";");

    return `<span class="wind-petal" style="${style}"><i></i></span>`;
  }).join("");

  document.body.appendChild(layer);

  setTimeout(() => layer.remove(), 6500);
}
