/*
  Memory pages (03 + 04): loose polaroids.

  - Each polaroid can be dragged on its own (pointer events).
  - A tap (no drag) opens a full-size viewer with next / previous.
  - Mouse and touch starts on a polaroid are stopped in the capture
    phase, so dragging never turns the page.
*/

import { renderBunting } from "./cover";

/* ---------- rendering ---------- */

function renderPolaroid(photo) {
  const src = `/api/card-photo?n=${photo.n}`;

  return `
    <figure
      class="polaroid"
      role="button"
      tabindex="0"
      data-photo="${photo.n}"
      data-src="${src}"
      data-caption="${photo.caption}"
      aria-label="View photo: ${photo.caption}"
    >
      <img data-src="${src}" alt="${photo.caption}" draggable="false" />
      <figcaption>${photo.caption}</figcaption>
    </figure>
  `;
}

export function renderMemoriesPage(page) {
  return `
    <div class="card-page inside-page bd-page bd-memories">

      ${renderBunting()}

      <div class="bd-sheet">

        <span class="bd-num">${page.number}</span>

        <h2 class="bd-wishes-title">${page.title}</h2>

        <p class="mem-message">${page.message}</p>

        <div class="mem-board">
          ${page.photos.map(renderPolaroid).join("")}
        </div>

        <p class="mem-hint">${page.hint || "drag the photos · tap one to see it bigger"}</p>

        ${
          page.signature
            ? `<div class="mem-sign">
                 <span>${page.signature}</span>
               </div>`
            : ""
        }

      </div>
    </div>
  `;
}

/* ---------- viewer ---------- */

function buildViewer() {
  const viewer = document.createElement("div");

  viewer.className = "photo-viewer";
  viewer.hidden = true;

  viewer.innerHTML = `
    <button class="pv-btn pv-close" type="button" aria-label="Close">×</button>
    <button class="pv-btn pv-nav pv-prev" type="button" aria-label="Previous photo">‹</button>

    <figure class="pv-figure">
      <img alt="" draggable="false" />
      <figcaption></figcaption>
    </figure>

    <button class="pv-btn pv-nav pv-next" type="button" aria-label="Next photo">›</button>

    <div class="pv-count"></div>
  `;

  document.body.appendChild(viewer);

  return viewer;
}

/* ---------- interaction ---------- */

export function initPhotoPile() {
  const viewer = buildViewer();

  const viewerImage = viewer.querySelector("img");
  const viewerCaption = viewer.querySelector("figcaption");
  const viewerCount = viewer.querySelector(".pv-count");

  const SLACK = 12; // px a photo may hang over the board edge
  const TAP_DISTANCE = 6;

  let topZ = 10;
  let drag = null;
  let current = 0;

  const photos = () =>
    [...document.querySelectorAll(".polaroid")].sort(
      (a, b) => Number(a.dataset.photo) - Number(b.dataset.photo),
    );

  /* ----- viewer ----- */

  function show(index) {
    const list = photos();

    if (!list.length) return;

    current = (index + list.length) % list.length;

    const { src, caption } = list[current].dataset;

    viewerImage.src = src;
    viewerImage.alt = caption;
    viewerCaption.textContent = caption;
    viewerCount.textContent = `${current + 1} / ${list.length}`;

    viewer.hidden = false;
  }

  function close() {
    viewer.hidden = true;
  }

  viewer.addEventListener("click", (event) => {
    if (event.target.closest(".pv-prev")) return show(current - 1);
    if (event.target.closest(".pv-next")) return show(current + 1);

    if (event.target.closest(".pv-close") || !event.target.closest("figure")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (viewer.hidden) {
      const el = event.target.closest?.(".polaroid");

      if (el && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        show(photos().indexOf(el));
      }

      return;
    }

    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  /* ----- keep the page-flip library out of it ----- */

  const blockFlip = (event) => {
    if (event.target.closest?.(".polaroid")) {
      event.stopPropagation();
    }
  };

  document.addEventListener("mousedown", blockFlip, true);
  document.addEventListener("touchstart", blockFlip, true);

  /* ----- dragging ----- */

  document.addEventListener("pointerdown", (event) => {
    const el = event.target.closest?.(".polaroid");

    if (!el) return;

    if (event.pointerType === "mouse" && event.button !== 0) return;

    const board = el.closest(".mem-board");

    if (!board) return;

    const matrix = new DOMMatrix(getComputedStyle(el).transform);

    const rect = el.getBoundingClientRect();
    const area = board.getBoundingClientRect();

    drag = {
      el,
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x0: matrix.m41,
      y0: matrix.m42,
      moved: false,
      minX: matrix.m41 + (area.left - rect.left) - SLACK,
      maxX: matrix.m41 + (area.right - rect.right) + SLACK,
      minY: matrix.m42 + (area.top - rect.top) - SLACK,
      maxY: matrix.m42 + (area.bottom - rect.bottom) + SLACK,
    };

    // Freeze the current position into px so we can move from it.
    el.style.setProperty("--x", `${matrix.m41}px`);
    el.style.setProperty("--y", `${matrix.m42}px`);

    el.style.zIndex = ++topZ;

    el.setPointerCapture(event.pointerId);
  });

  document.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.moved && Math.hypot(dx, dy) < TAP_DISTANCE) return;

    if (!drag.moved) {
      drag.moved = true;
      drag.el.classList.add("dragging");
    }

    const x = Math.min(drag.maxX, Math.max(drag.minX, drag.x0 + dx));
    const y = Math.min(drag.maxY, Math.max(drag.minY, drag.y0 + dy));

    drag.el.style.setProperty("--x", `${x}px`);
    drag.el.style.setProperty("--y", `${y}px`);
  });

  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.id) return;

    const { el, moved } = drag;

    el.classList.remove("dragging");

    drag = null;

    if (!moved && event.type === "pointerup") {
      show(photos().indexOf(el));
    }
  };

  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);
}
