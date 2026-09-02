/*
 * Floating personality bubbles around the Hero illustration: a
 * staggered fade/scale entrance on load (the Hero is always above the
 * fold, so no ScrollTrigger is needed here — unlike the sections
 * further down the page), followed by a gentle continuous float once
 * each bubble has settled into place. Skipped entirely under reduced
 * motion, leaving the bubbles at their plain CSS resting state (fully
 * visible, no offset) — the safe fallback if this script or GSAP fails
 * to load.
 *
 * Fully independent from script.js (the hero typing animation),
 * scroll-animations.js, and signature-effects.js.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var bubbles = Array.prototype.slice.call(
    document.querySelectorAll(".hero__bubble")
  );
  if (!bubbles.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  // Slightly different duration/amplitude per bubble so the idle float
  // reads as three independent bubbles, not one synchronized group.
  var idleConfig = [
    { duration: 2.3, distance: 7 },
    { duration: 2.8, distance: 9 },
    { duration: 2.5, distance: 6 },
  ];

  function startIdleFloat(bubble, config) {
    gsap.to(bubble, {
      y: "+=" + config.distance,
      duration: config.duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  gsap.fromTo(
    bubbles,
    { opacity: 0, scale: 0.85, y: 12 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.18,
      delay: 0.4,
      onComplete: function () {
        bubbles.forEach(function (bubble, i) {
          startIdleFloat(bubble, idleConfig[i % idleConfig.length]);
        });
      },
    }
  );
})();
