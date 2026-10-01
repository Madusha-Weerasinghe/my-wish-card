/*
  Birthday cover.

  Everything is drawn with CSS / inline SVG and sized in em,
  so the whole cover scales with the page.
*/

const FLAG_COLORS = ["#f4a6b0", "#f8d98f", "#a9d6cf", "#e98aa0", "#fbe7c6", "#c9b8ef"];

const CONFETTI_COLORS = [
  "#f4a6b0",
  "#f6cf7a",
  "#9fd3ca",
  "#c9b8ef",
  "#e9788f",
  "#ffffff",
];

const SPARKLE_PATH =
  "M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z";

// Balloons rise from the bottom corners. x = distance from the side,
// y = height from the bottom, sr = string angle, d = float delay.
const BALLOONS = [
  { side: "left", x: 1.4, y: 11.5, c1: "#ffa9b5", c2: "#dd4f60", rot: -8, sr: 12, d: 0 },
  { side: "left", x: 4.1, y: 8.6, c1: "#ffe3a0", c2: "#e6a52c", rot: 6, sr: 4, d: 0.7 },
  { side: "left", x: 0.5, y: 6.6, c1: "#b4e6dd", c2: "#4ea89b", rot: -4, sr: 18, d: 1.4 },

  { side: "right", x: 1.6, y: 11, c1: "#f9bad6", c2: "#d8629a", rot: 8, sr: -12, d: 0.3 },
  { side: "right", x: 4.2, y: 8.2, c1: "#ffdcae", c2: "#ee9d38", rot: -6, sr: -4, d: 1.0 },
  { side: "right", x: 0.6, y: 6.2, c1: "#d6c8f8", c2: "#8b70d4", rot: 4, sr: -18, d: 1.7 },
];

const SPARKLES = [
  { x: 14, y: 26, s: 1.1, d: 0 },
  { x: 86, y: 30, s: 0.8, d: 0.9 },
  { x: 20, y: 52, s: 0.7, d: 1.6 },
  { x: 82, y: 56, s: 1, d: 0.4 },
  { x: 50, y: 15, s: 0.75, d: 1.2 },
];

/* ---------- helpers ---------- */

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

export function sparkle() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SPARKLE_PATH}"/></svg>`;
}

/* ---------- pieces ---------- */

// A sagging string of triangular flags.
export function renderBunting() {
  const P0 = { x: -10, y: 12 };
  const P1 = { x: 200, y: 84 };
  const P2 = { x: 410, y: 12 };

  const point = (t) => ({
    x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
    y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
  });

  const tangent = (t) => {
    const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
    const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
    const len = Math.hypot(dx, dy);

    return { x: dx / len, y: dy / len };
  };

  const flags = Array.from({ length: 11 }, (_, i) => {
    const t = 0.06 + i * 0.088;

    const p = point(t);
    const tan = tangent(t);
    const normal = { x: -tan.y, y: tan.x };

    const half = 15;
    const height = 30;

    const a = { x: p.x - tan.x * half, y: p.y - tan.y * half };
    const b = { x: p.x + tan.x * half, y: p.y + tan.y * half };
    const c = { x: p.x + normal.x * height, y: p.y + normal.y * height };

    const color = FLAG_COLORS[i % FLAG_COLORS.length];

    const pts = (...v) => v.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ");

    return `
      <polygon points="${pts(a, b, c)}" fill="${color}" />
      <polygon points="${pts(a, p, c)}" fill="#ffffff" opacity="0.22" />
      <polygon points="${pts(a, b, c)}" fill="none" stroke="rgba(120,70,80,0.18)" stroke-width="0.8" />
    `;
  }).join("");

  return `
    <svg class="bd-bunting" viewBox="0 0 400 110" aria-hidden="true">
      <path d="M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}"
            fill="none" stroke="#b8862b" stroke-width="1.6" />
      ${flags}
    </svg>
  `;
}

function renderConfetti(seed = 11) {
  const random = rng(seed);
  const pieces = [];

  let guard = 0;

  while (pieces.length < 36 && guard++ < 400) {
    const x = 3 + random() * 94;
    const y = 12 + random() * 84;

    // Keep the middle clear for the text.
    if (x > 22 && x < 78 && y > 20 && y < 80) continue;

    const round = random() > 0.6;
    const size = 0.35 + random() * 0.4;

    pieces.push(`
      <i style="
        left:${x.toFixed(1)}%;
        top:${y.toFixed(1)}%;
        --w:${size.toFixed(2)}em;
        --h:${(round ? size : size * 0.45).toFixed(2)}em;
        --c:${CONFETTI_COLORS[Math.floor(random() * CONFETTI_COLORS.length)]};
        --r:${Math.floor(random() * 180)}deg;
        --br:${round ? "50%" : "1px"};
        --d:${(random() * 5).toFixed(1)}s;
      "></i>
    `);
  }

  return `<div class="bd-confetti" aria-hidden="true">${pieces.join("")}</div>`;
}

function renderBalloons() {
  return BALLOONS.map(
    (b) => `
      <div class="bd-balloon" style="
        ${b.side}:${b.x}em;
        bottom:${b.y}em;
        --c1:${b.c1};
        --c2:${b.c2};
        --rot:${b.rot}deg;
        --sr:${b.sr}deg;
        --d:${b.d}s;
      "></div>
    `,
  ).join("");
}

function renderSparkles() {
  return SPARKLES.map(
    (s) => `
      <span class="bd-spark" style="left:${s.x}%;top:${s.y}%;--s:${s.s}em;--d:${s.d}s">
        ${sparkle()}
      </span>
    `,
  ).join("");
}

/* ---------- cover ---------- */

export function renderBirthdayCover(cardData) {
  return `
    <div class="card-page cover birthday-cover">

      ${renderConfetti()}
      ${renderBalloons()}
      ${renderSparkles()}
      ${renderBunting()}

      <span class="bd-corner bd-corner-tl"></span>
      <span class="bd-corner bd-corner-tr"></span>
      <span class="bd-corner bd-corner-bl"></span>
      <span class="bd-corner bd-corner-br"></span>

      <div class="cover-content bd-content">

        <p class="bd-eyebrow">${cardData.coverText}</p>

        <h1 class="bd-title">
          <span class="bd-happy">Happy</span>
          <span class="bd-birthday">Birthday</span>
        </h1>

        <div class="bd-divider" aria-hidden="true">
          <i></i>
          <span class="bd-divider-star">${sparkle()}</span>
          <i></i>
        </div>

        <p class="bd-to">to the one and only</p>

        <p class="bd-name">${cardData.recipientName}</p>

        <p class="bd-sub">${cardData.coverSubtitle}</p>

      </div>

      <p class="bd-hint">Turn the page <span aria-hidden="true">›</span></p>

    </div>
  `;
}

/* ---------- end cover ---------- */

function renderCake() {
  return `
    <div class="cake" aria-hidden="true">

      <div class="cake-candles">
        <span class="candle"><i class="flame"></i></span>
        <span class="candle"><i class="flame"></i></span>
        <span class="candle"><i class="flame"></i></span>
      </div>

      <div class="cake-tier cake-tier-top"></div>
      <div class="cake-tier cake-tier-mid"></div>
      <div class="cake-tier cake-tier-bottom"></div>

      <div class="cake-plate"></div>

    </div>
  `;
}

export function renderEndCover(cardData) {
  return `
    <div class="card-page cover birthday-cover end-cover">

      ${renderConfetti(23)}
      ${renderSparkles()}
      ${renderBunting()}

      <span class="bd-corner bd-corner-tl"></span>
      <span class="bd-corner bd-corner-tr"></span>
      <span class="bd-corner bd-corner-bl"></span>
      <span class="bd-corner bd-corner-br"></span>

      <div class="cover-content bd-content end-content">

        <p class="bd-eyebrow">The end · for now</p>

        <div class="end-title">

          <p class="end-thanks">Thank You</p>

          <p class="end-sub">for being exactly you</p>

        </div>

        ${renderCake()}

        <div class="end-from">

          <p class="bd-to">made with love for</p>

          <p class="bd-name">${cardData.recipientName}</p>

        </div>

      </div>

    </div>
  `;
}
