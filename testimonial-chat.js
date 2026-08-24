/*
 * Scroll-triggered entrance for the "What shipping with me is like" chat
 * message. Fully independent from script.js, scroll-animations.js, and
 * signature-effects.js. The avatar keeps its own continuous drift
 * animation (reused from .nav__avatar / @keyframes avatarDrift, both
 * untouched) — this file only adds a one-time reveal on scroll, using a
 * different direction for the sender (scale in) than the bubble (slide
 * in from the left), so the two don't read as the same motion.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var sender = document.querySelector(".chat-message__sender");
  var bubble = document.querySelector(".chat-message__bubble");
  if (!sender || !bubble) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  if (typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    sender,
    { opacity: 0, scale: 0.7 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: sender, start: "top 85%", once: true },
    }
  );

  gsap.fromTo(
    bubble,
    { opacity: 0, x: -40 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: 0.15,
      ease: "power2.out",
      scrollTrigger: { trigger: bubble, start: "top 85%", once: true },
    }
  );
})();
