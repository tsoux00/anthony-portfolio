/*
 * Floating personality bubbles around the Hero illustration: a
 * staggered fade/scale entrance on load (the Hero is always above the
 * fold, so no ScrollTrigger is needed here — unlike the sections
 * further down the page), followed by a gentle continuous float once
 * each bubble has settled into place, and a hover state reusing the
 * site's most-repeated card hover language (lift + deeper shadow +
 * blue border tint — the same treatment as mini-card/project-card/the
 * Hero stat cards) rather than inventing a new one. Skipped entirely
 * under reduced motion, leaving the bubbles at their plain CSS resting
 * state (fully visible, no offset) — the safe fallback if this script
 * or GSAP fails to load; the box-shadow/border-color part of the hover
 * is plain CSS (style.css) and still applies (instantly) even then.
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
    return gsap.to(bubble, {
      y: "+=" + config.distance,
      duration: config.duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  // The idle float already owns this bubble's `y`/transform, so hover
  // can't just add a CSS :hover transform on top without fighting it.
  // Instead: starting a new GSAP tween on `y`/`scale` here takes over
  // from (and, per GSAP's default overwrite behavior, replaces) the
  // running idle tween; on mouseleave the bubble is eased back to its
  // exact resting position and only then does a fresh idle loop start
  // again — restarting cleanly rather than trying to resume a tween
  // that's no longer the one in control.
  function attachHover(bubble, config) {
    bubble.addEventListener("mouseenter", function () {
      gsap.to(bubble, {
        y: -4,
        scale: 1.06,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    bubble.addEventListener("mouseleave", function () {
      gsap.to(bubble, {
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        onComplete: function () {
          startIdleFloat(bubble, config);
        },
      });
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
          var config = idleConfig[i % idleConfig.length];
          startIdleFloat(bubble, config);
          attachHover(bubble, config);
        });
      },
    }
  );
})();
