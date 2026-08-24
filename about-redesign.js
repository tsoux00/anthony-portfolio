/*
 * About section redesign behavior: bio accent-line draw-in, staggered
 * card reveal, and 3D cursor-tilt on the identity cards. Fully
 * independent from script.js, scroll-animations.js, and
 * signature-effects.js.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var isFinePointer = window.matchMedia("(pointer: fine)").matches;

  var accent = document.querySelector(".about__accent");
  var cardsWrap = document.querySelector(".about__cards");
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".identity-card")
  );

  if (!prefersReducedMotion && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    if (accent) {
      gsap.fromTo(
        accent,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: accent, start: "top 85%", once: true },
        }
      );
    }

    if (cardsWrap && cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: cardsWrap, start: "top 80%", once: true },
        }
      );
    }
  }
  // If reduced motion is set (or ScrollTrigger fails to load), the
  // accent/cards simply stay at their CSS default: fully drawn / fully
  // visible, no animation.

  // 3D tilt — fine pointer only (disabled on touch: no cursor to tilt
  // toward), and skipped entirely under reduced motion.
  if (prefersReducedMotion || !isFinePointer) return;

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
