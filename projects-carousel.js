/*
 * Manual snap-scroll carousel for the Projects section: prev/next
 * arrows, progress dots, and a one-time GSAP entrance for the cards.
 * There is no scroll-hijacking here at all — the grid is a plain
 * scroll-snap container; this file only adds optional controls
 * (arrows/dots) on top of the drag/swipe/wheel scrolling the browser
 * already provides for free. After the initial reveal, everything is
 * fully user-controlled.
 *
 * Fully independent from script.js, scroll-animations.js, and
 * signature-effects.js.
 */
(function () {
  "use strict";

  var grid = document.getElementById("projectsGrid");
  var prevBtn = document.getElementById("projectsPrev");
  var nextBtn = document.getElementById("projectsNext");
  var dotsWrap = document.getElementById("projectsDots");
  if (!grid) return;

  var cards = Array.prototype.slice.call(
    grid.querySelectorAll(".project-card")
  );
  if (!cards.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Mobile-only peek carousel: blur every card except the active one.
  // Card size/spacing themselves are untouched (that's plain CSS via
  // .projects__grid's scroll-padding in the same breakpoint) — this
  // just tracks which card is active so the neighbors peeking in at
  // the edges can be blurred. Gated to the same max-width:700px
  // breakpoint used for that CSS, so desktop is never affected.
  var peekQuery = window.matchMedia("(max-width: 700px)");

  function updatePeekBlur(activeIndex) {
    if (!peekQuery.matches) {
      cards.forEach(function (card) {
        card.classList.remove("is-peeking");
      });
      return;
    }
    cards.forEach(function (card, i) {
      card.classList.toggle("is-peeking", i !== activeIndex);
    });
  }

  // ---------- Progress dots (one per card, generated so this stays
  // correct automatically if more project cards are added later) ----------
  var dots = [];
  if (dotsWrap) {
    cards.forEach(function (card, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to project " + (i + 1));
      dot.addEventListener("click", function () {
        scrollToCard(i);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function setActiveDot(index) {
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function getCardStep() {
    if (cards.length < 2) return cards[0] ? cards[0].offsetWidth : 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  function scrollToCard(index) {
    index = Math.max(0, Math.min(cards.length - 1, index));
    grid.scrollTo({
      left: cards[index].offsetLeft - grid.offsetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function currentIndex() {
    var step = getCardStep();
    if (!step) return 0;
    return Math.round(grid.scrollLeft / step);
  }

  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    var maxScroll = grid.scrollWidth - grid.clientWidth - 1;
    prevBtn.disabled = grid.scrollLeft <= 0;
    nextBtn.disabled = grid.scrollLeft >= maxScroll;
  }

  var scrollTimer;
  grid.addEventListener("scroll", function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var active = currentIndex();
      setActiveDot(active);
      updateArrows();
      updatePeekBlur(active);
    }, 80);
  });

  // Re-evaluate if the viewport crosses the 700px breakpoint (e.g.
  // device rotation, resizing a desktop window) so blur never lingers
  // on the wrong side of it.
  if (typeof peekQuery.addEventListener === "function") {
    peekQuery.addEventListener("change", function () {
      updatePeekBlur(currentIndex());
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      scrollToCard(currentIndex() - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      scrollToCard(currentIndex() + 1);
    });
  }

  setActiveDot(0);
  updateArrows();
  updatePeekBlur(0);

  // ---------- One-time entrance reveal ----------
  if (prefersReducedMotion) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    cards,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: { trigger: grid, start: "top 82%", once: true },
    }
  );
})();
