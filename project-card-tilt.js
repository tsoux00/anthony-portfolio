/*
 * 3D cursor-tilt hover for project cards — the exact same GSAP tilt
 * parameters used for the About section's identity cards
 * (about-redesign.js: relX/relY from the pointer position within the
 * card's bounds, rotateY: relX*14, rotateX: -relY*14, y:-6,
 * transformPerspective:900, same durations/easing in and out).
 * Reimplemented here rather than shared from that file so the About
 * section's script — and the cards it targets — stay completely
 * untouched. Fine-pointer only and skipped entirely under reduced
 * motion, matching that implementation's fallback exactly.
 *
 * Fully independent from script.js, scroll-animations.js, and
 * signature-effects.js.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var isFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !isFinePointer) return;

  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".projects__grid .project-card")
  );
  if (!cards.length) return;

  cards.forEach(function (card) {
    var bounds = null;

    card.addEventListener("mouseenter", function () {
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", function (e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      var relX = (e.clientX - bounds.left) / bounds.width - 0.5;
      var relY = (e.clientY - bounds.top) / bounds.height - 0.5;
      gsap.to(card, {
        rotateY: relX * 14,
        rotateX: -relY * 14,
        y: -6,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", function () {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  });
})();
