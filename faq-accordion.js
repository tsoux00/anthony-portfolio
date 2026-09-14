/*
 * FAQ accordion: each answer is hidden (height:0) by default in CSS —
 * the safe fallback if this script or GSAP fails to load, since
 * "answers hidden until clicked" already matches that resting state.
 * Clicking a question smoothly expands its answer (height + opacity)
 * and rotates its chevron; only one question stays open at a time —
 * opening a new one collapses whichever was previously open.
 *
 * Entrance (each card fading/sliding in as it scrolls into view) is
 * handled entirely by the site's existing .reveal + IntersectionObserver
 * mechanism in script.js — nothing needed here for that part.
 *
 * Fully independent from script.js, scroll-animations.js, and
 * signature-effects.js.
 */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(
    document.querySelectorAll(".faq-item")
  );
  if (!items.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var EXPAND_DURATION = 0.4;
  var COLLAPSE_DURATION = 0.4;
  var EXPAND_EASE = "power2.out";
  var COLLAPSE_EASE = "power2.inOut";

  var openItem = null;

  function open(entry) {
    entry.item.classList.add("is-open");
    entry.question.setAttribute("aria-expanded", "true");

    if (prefersReducedMotion || typeof gsap === "undefined") {
      entry.answer.style.height = "auto";
      entry.inner.style.opacity = "1";
      return;
    }

    gsap.to(entry.answer, {
      height: entry.inner.scrollHeight,
      duration: EXPAND_DURATION,
      ease: EXPAND_EASE,
    });
    gsap.to(entry.inner, {
      opacity: 1,
      duration: EXPAND_DURATION,
      ease: EXPAND_EASE,
    });
  }

  function close(entry) {
    entry.item.classList.remove("is-open");
    entry.question.setAttribute("aria-expanded", "false");

    if (prefersReducedMotion || typeof gsap === "undefined") {
      entry.answer.style.height = "0px";
      entry.inner.style.opacity = "0";
      return;
    }

    gsap.to(entry.answer, {
      height: 0,
      duration: COLLAPSE_DURATION,
      ease: COLLAPSE_EASE,
    });
    gsap.to(entry.inner, {
      opacity: 0,
      duration: COLLAPSE_DURATION * 0.6,
      ease: COLLAPSE_EASE,
    });
  }

  items.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    var inner = item.querySelector(".faq-answer__inner");
    if (!question || !answer || !inner) return;

    var entry = { item: item, question: question, answer: answer, inner: inner };

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      if (openItem && openItem !== entry) {
        close(openItem);
      }

      if (isOpen) {
        close(entry);
        openItem = null;
      } else {
        open(entry);
        openItem = entry;
      }
    });
  });
})();
