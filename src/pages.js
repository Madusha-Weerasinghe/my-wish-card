/*
  Birthday inside pages (01 letter, 02 wishes).

  The recipient and sender names come from cardData, so the
  handwritten name lines are filled in automatically.
*/

import { renderBunting, sparkle } from "./cover";

const GEMS = [
  ["#ffa9b5", "#dd4f60"],
  ["#ffe3a0", "#e6a52c"],
  ["#b4e6dd", "#4ea89b"],
  ["#d6c8f8", "#8b70d4"],
];

function paragraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join("");
}

/* ---------- page 01: handwritten letter ---------- */

export function renderLetterPage(page, cardData) {
  return `
    <div class="card-page inside-page bd-page bd-letter">

      ${renderBunting()}

      <div class="bd-sheet">

        <span class="bd-num">${page.number}</span>

        <div class="hw-line">
          <span class="hw-label">${page.greeting || "Dear"}</span>
          <span class="hw-name">${cardData.recipientName}</span><span class="hw-comma">,</span>
        </div>

        <div class="hw-body">
          ${paragraphs(page.message)}
          ${page.secondaryMessage ? paragraphs(page.secondaryMessage) : ""}
        </div>

        <div class="hw-sign">
          <span class="hw-with">${page.signature || "With love,"}</span>
          <span class="hw-sender">${cardData.senderName}</span>
        </div>

      </div>
    </div>
  `;
}

/* ---------- page 02: wishes ---------- */

export function renderWishesPage(page, cardData) {
  const wishes = page.wishes
    .map((wish, i) => {
      const [c1, c2] = GEMS[i % GEMS.length];

      return `
        <li>
          <span class="bd-gem" style="--c1:${c1};--c2:${c2}">${sparkle()}</span>
          <span class="hw-wish">${wish}</span>
        </li>
      `;
    })
    .join("");

  return `
    <div class="card-page inside-page bd-page bd-wishes">

      ${renderBunting()}

      <div class="bd-sheet">

        <span class="bd-num">${page.number}</span>

        <h2 class="bd-wishes-title">${page.title}</h2>

        <p class="bd-wishes-for">
          for <span class="hw-name">${cardData.recipientName}</span>
        </p>

        <ul class="bd-wish-list">${wishes}</ul>

        ${page.quote ? `<p class="bd-wish-quote">“${page.quote}”</p>` : ""}

        <p class="bd-wish-final">Happy Birthday, ${cardData.recipientName}!</p>

      </div>
    </div>
  `;
}

/* ---------- page 04: good luck ---------- */

export function renderLuckPage(page, cardData) {
  return `
    <div class="card-page inside-page bd-page bd-luck">

      ${renderBunting()}

      <div class="bd-sheet">

        <span class="bd-num">${page.number}</span>

        <div class="luck-stars" aria-hidden="true">
          <span>${sparkle()}</span>
          <span>${sparkle()}</span>
          <span>${sparkle()}</span>
        </div>

        <h2 class="bd-wishes-title">${page.title}</h2>

        <div class="luck-message">${paragraphs(page.message)}</div>

        <p class="luck-cheer">${page.cheer}</p>

        <div class="hw-sign">
          <span class="hw-with">${page.signature || "With love,"}</span>
          <span class="hw-sender">${cardData.senderName}</span>
        </div>

      </div>
    </div>
  `;
}
