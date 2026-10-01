import { PageFlip } from "page-flip";
import { cardData } from "./cardData";
import "./style.css";
import "./bouquet.css";
import { renderBouquet, renderFlowerFx, spawnWindPetals } from "./bouquet";
import "./cover.css";
import { renderBirthdayCover, renderEndCover } from "./cover";
import "./pages.css";
import { renderLetterPage, renderWishesPage, renderLuckPage } from "./pages";
import "./memories.css";
import { renderMemoriesPage, initPhotoPile } from "./memories";

function renderPage(page) {
  if (page.type === "letter") {
    return renderLetterPage(page, cardData);
  }

  if (page.type === "luck") {
    return renderLuckPage(page, cardData);
  }

  if (page.type === "wishes") {
    return renderWishesPage(page, cardData);
  }

  if (page.type === "memories") {
    return renderMemoriesPage(page);
  }

  if (page.type === "photo") {
    return `
      <div class="card-page inside-page">
        <div class="page-inner">

          <span class="page-number">${page.number}</span>

          <div class="ornament">♡</div>

          <h2>${page.title}</h2>

          <div class="photo-frame">
            <img
              src="${page.image}"
              alt="${page.title}"
            />
          </div>

          <p>${page.message}</p>

        </div>
      </div>
    `;
  }

  return `
    <div class="card-page inside-page">
      <div class="page-inner">

        <span class="page-number">${page.number}</span>

        <div class="ornament">♡</div>

        <h2>${page.title}</h2>

        <p>${page.message}</p>

        ${
          page.secondaryMessage
            ? `<p class="secondary-message">${page.secondaryMessage}</p>`
            : ""
        }

        ${page.quote ? `<p class="quote">“${page.quote}”</p>` : ""}

        ${
          page.signature ? `<div class="signature">${page.signature}</div>` : ""
        }

      </div>
    </div>
  `;
}

/* ==================================================
   CREATE CARD
================================================== */

document.querySelector("#app").innerHTML = `


  <!-- =========================
       OPENING SCREEN
  ========================== -->

  <div id="opening-screen" class="opening-screen">

  <div class="opening-content">

    <div class="opening-heart">
      ♡
    </div>

    <p class="opening-eyebrow">
      A little surprise
    </p>

    <h1>
      For ${cardData.recipientName}
    </h1>

    <p class="opening-text">
      This little card is just for you.
    </p>

    <div class="access-form">

      <input
        id="access-code"
        type="password"
        placeholder="Enter your secret code"
        autocomplete="off"
        spellcheck="false"
      />

      <button
        id="unlock-card-btn"
        type="button"
      >
        Unlock Card
      </button>

      <p
        id="access-error"
        class="access-error"
      ></p>

    </div>

  </div>

</div>

<div id="flower-reveal" class="flower-reveal">
  ${renderFlowerFx()}
  <div class="flower-scene">
    <div class="flower-glow"></div>

    ${renderBouquet()}

    <p class="flower-message">
      A little something for you...
    </p>
  </div>
</div>

  <!-- =========================
       CARD
  ========================== -->

  <main class="scene" id="card-scene">

    <div id="wish-card" class="wish-card">

      <!-- FRONT COVER -->

      ${renderBirthdayCover(cardData)}


      <!-- =========================
           CARD PAGES
      ========================== -->

      ${cardData.pages.map(renderPage).join("")}


      <!-- =========================
           BACK COVER
      ========================== -->

      ${renderEndCover(cardData)}

    </div>

  </main>


  <!-- =========================
       BACKGROUND MUSIC
  ========================== -->

  <audio id="background-music" loop preload="none"></audio>


  <!-- =========================
       MUSIC CONTROL
  ========================== -->

  <div id="card-dock" class="card-dock" role="toolbar" aria-label="Card controls">

    <button
      id="music-toggle"
      class="dock-btn music-toggle"
      aria-label="Toggle music"
      aria-pressed="true"
      type="button"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="ico-note" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" />
        <path class="ico-slash" d="M4 4l16 16" />
      </svg>
      <span class="dock-label">Music</span>
    </button>

    <button
      id="lock-card"
      class="dock-btn lock-card"
      aria-label="Lock card"
      type="button"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      <span class="dock-label">Lock</span>
    </button>

  </div>

`;

/* ==================================================
   ELEMENTS
================================================== */

const openingScreen = document.querySelector("#opening-screen");
const flowerReveal = document.querySelector("#flower-reveal");
const cardScene = document.querySelector("#card-scene");
const unlockCardButton = document.querySelector("#unlock-card-btn");

const accessCodeInput = document.querySelector("#access-code");

const accessError = document.querySelector("#access-error");
const backgroundMusic = document.querySelector("#background-music");
const musicToggle = document.querySelector("#music-toggle");
const cardDock = document.querySelector("#card-dock");
const lockCardButton = document.querySelector("#lock-card");

async function checkExistingSession() {
  try {
    const response = await fetch("/api/check-session", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok && result.authenticated) {
      showCard({
        tryMusic: true,
      });
    }
  } catch (error) {
    console.log("No active card session.");
  }
}

/* ==================================================
   PAGE FLIP
================================================== */

const cardElement = document.querySelector("#wish-card");

/*
  Fit the book to the visible screen (no scrolling, nothing clipped).
  Page ratio is 400:560. Portrait phones show one page, wide screens two.
*/
const PAGE_RATIO = 400 / 560;

function fitCard() {
  const vv = window.visualViewport;
  const vw = vv ? vv.width : window.innerWidth;
  const vh = vv ? vv.height : window.innerHeight;

  const spread = vw >= 700;

  const availW = vw - 20;
  const availH = vh - 90; // room for the dock above and a little below

  let pageW = Math.min(500, availH * PAGE_RATIO, spread ? availW / 2 : availW);

  pageW = Math.max(pageW, 200);

  cardElement.style.width = `${Math.floor(spread ? pageW * 2 : pageW)}px`;
  cardElement.style.height = `${Math.floor(pageW / PAGE_RATIO)}px`;
}

fitCard();

const pageFlip = new PageFlip(cardElement, {
  width: 400,
  height: 560,

  size: "stretch",

  minWidth: 200,
  maxWidth: 500,

  minHeight: 280,
  maxHeight: 700,

  drawShadow: true,
  maxShadowOpacity: 0.45,

  showCover: true,

  mobileScrollSupport: true,

  flippingTime: 800,

  usePortrait: true,

  startPage: 0,

  swipeDistance: 25,

  clickEventForward: true,
});

pageFlip.loadFromHTML(document.querySelectorAll(".card-page"));

/*
  Smoothness: pause the decorative loops (confetti, sparkles, flames,
  bunting) while a page is turning so the flip gets every frame.
*/
pageFlip.on("changeState", ({ data }) => {
  cardElement.classList.toggle("is-flipping", data !== "read");
});

/*
  Mobile: every page is drawn in em, so scale the em to the real page
  width (400px wide = 16px, as designed) instead of guessing from the
  viewport. Keeps the layout identical on any phone or tablet.
*/
const firstPage = document.querySelector(".card-page");

function syncPageFont() {
  const width = firstPage.offsetWidth;

  if (!width) return;

  const size = Math.min(Math.max(width / 25, 11), 17);

  document.documentElement.style.setProperty("--page-font", `${size.toFixed(2)}px`);
}

new ResizeObserver(syncPageFont).observe(firstPage);
syncPageFont();

/*
  Shrink each page's text just enough that all of it sits inside the
  page. Pages are measured as off-screen clones (pages that are not
  showing can have no layout), then the result is applied as --fit.
*/
function fitContent() {
  const pageW = parseFloat(cardElement.style.width) / (window.innerWidth >= 700 ? 2 : 1);
  const pageH = parseFloat(cardElement.style.height);

  if (!pageW || !pageH) return;

  const probe = document.createElement("div");

  probe.style.cssText = `position:fixed;left:-9999px;top:0;width:${pageW}px;height:${pageH}px;visibility:hidden;pointer-events:none;`;

  document.body.appendChild(probe);

  document.querySelectorAll(".card-page.bd-page").forEach((page) => {
    const clone = page.cloneNode(true);

    clone.style.cssText = `position:relative;display:flex;width:${pageW}px;height:${pageH}px;transform:none;`;

    probe.appendChild(clone);

    const sheet = clone.querySelector(".bd-sheet");

    let fit = 1;

    sheet.style.setProperty("--fit", fit);

    /* lowest point of the content, plus the bottom padding it must clear */
    const overflows = () => {
      const padBottom = parseFloat(getComputedStyle(sheet).paddingBottom) || 0;

      let bottom = 0;

      /* offset* ignores rotation, so tilted handwriting is not over-counted */
      for (const child of sheet.children) {
        if (getComputedStyle(child).position === "absolute") continue;

        bottom = Math.max(bottom, child.offsetTop + child.offsetHeight);
      }

      return bottom + padBottom > pageH + 2;
    };

    while (fit > 0.5 && overflows()) {
      fit -= 0.02;

      sheet.style.setProperty("--fit", fit.toFixed(2));
    }

    page.querySelector(".bd-sheet").style.setProperty("--fit", fit.toFixed(2));

    probe.removeChild(clone);
  });

  probe.remove();
}

let refitTimer;

function refit() {
  clearTimeout(refitTimer);

  refitTimer = setTimeout(() => {
    fitCard();
    pageFlip.update();
    syncPageFont();
    fitContent();
  }, 150);
}

window.addEventListener("resize", refit);
window.addEventListener("orientationchange", refit);
window.visualViewport?.addEventListener("resize", refit);

/* fonts arrive late: re-measure once they are in */
document.fonts?.ready.then(refit);
document.fonts?.addEventListener("loadingdone", refit);

/* request the card fonts up front so they are in before the card shows */
[
  '500 20px "Caveat"',
  '700 20px "Caveat"',
  '400 20px "Great Vibes"',
  'italic 400 20px "Cormorant Garamond"',
  '400 20px "DM Sans"',
].forEach((font) => document.fonts?.load(font).then(refit).catch(() => {}));

initPhotoPile();

/* ==================================================
   OPEN CARD
================================================== */

/* ==================================================
   UNLOCK CARD
================================================== */

function setMusicState(on) {
  musicToggle.classList.toggle("is-off", !on);
  musicToggle.setAttribute("aria-pressed", String(on));
}

let mediaLoaded = false;

function loadPrivateMedia() {
  if (mediaLoaded) return;

  mediaLoaded = true;

  document.querySelectorAll("img[data-src]").forEach((img) => {
    img.src = img.dataset.src;
  });

  backgroundMusic.src = "/api/card-music";
  backgroundMusic.load();
}

function showCard({ tryMusic = true } = {}) {
  openingScreen.classList.add("hidden");
  cardScene.classList.add("visible");
  cardDock.classList.add("visible");

  /*
    Photos and music are private: they only load once the session
    cookie exists, so request them now, not at page load.
  */
  loadPrivateMedia();
  refit();

  backgroundMusic.volume = 0.25;

  if (tryMusic) {
    backgroundMusic
      .play()
      .then(() => {
        setMusicState(true);
      })
      .catch(() => {
        setMusicState(false);
      });
  }
}

async function unlockCard() {
  const code = accessCodeInput.value.trim();

  accessError.textContent = "";

  if (!code) {
    accessError.textContent = "Please enter the secret code.";

    return;
  }

  unlockCardButton.disabled = true;

  unlockCardButton.textContent = "Checking...";

  try {
    const response = await fetch("/api/verify-card", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        code,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      accessError.textContent = "That code isn't correct. Try again.";

      accessCodeInput.select();

      return;
    }

    /* =========================
       ACCESS GRANTED
    ========================== */

    showFlowerReveal();
  } catch (error) {
    console.error(error);

    accessError.textContent = "Something went wrong. Please try again.";
  } finally {
    unlockCardButton.disabled = false;

    unlockCardButton.textContent = "Unlock Card";
  }
}

/* ==================================================
   UNLOCK BUTTON
================================================== */

unlockCardButton.addEventListener("click", unlockCard);

/* ==================================================
   ENTER KEY
================================================== */

accessCodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlockCard();
  }
});

/* ==================================================
   MUSIC TOGGLE
================================================== */

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();

      setMusicState(true);
    } catch (error) {
      console.log("Music could not start:", error);
    }
  } else {
    backgroundMusic.pause();

    setMusicState(false);
  }
});

async function lockCard() {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Could not lock card:", error);
  }

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  window.location.reload();
}

function showFlowerReveal() {
  flowerReveal.classList.add("visible");

  /*
    Once the flower screen is fully opaque, remove the unlock screen
    behind it so it can never show through during the exit.
  */
  setTimeout(() => {
    openingScreen.classList.add("hidden");
  }, 1200);

  /*
    A gust of wind: the bouquet leans and its petals are blown across
    the screen. Once they are streaming past, the card fades in.
  */
  setTimeout(() => {
    flowerReveal.classList.add("wind");

    spawnWindPetals();
  }, 5600);

  setTimeout(() => {
    flowerReveal.classList.add("fade-out");

    showCard();
  }, 6800);

  setTimeout(() => {
    flowerReveal.classList.remove("visible");
    flowerReveal.classList.remove("wind");
    flowerReveal.classList.remove("fade-out");
  }, 8400);
}

lockCardButton.addEventListener("click", lockCard);

checkExistingSession();
