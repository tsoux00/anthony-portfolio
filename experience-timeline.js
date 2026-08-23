/*
 * Progressive scroll-fill for the Experience timeline line, plus a
 * per-bullet "lit" state that activates exactly when the fill reaches
 * that bullet's position. Fully independent from script.js,
 * scroll-animations.js and signature-effects.js — it only reads
 * .changelog-wrap / .changelog__fill / .changelog__dot and drives them
 * via a GSAP ScrollTrigger scrub. The existing IntersectionObserver
 * reveal that fades in each .changelog__entry (built in script.js) is
 * not touched at all.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var wrap = document.querySelector(".changelog-wrap");
  var fill = document.querySelector(".changelog__fill");
  if (!wrap || !fill) return;

  var dots = Array.prototype.slice.call(
    wrap.querySelectorAll(".changelog__dot")
  );

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // CSS already defaults .changelog__fill to scaleY(1) (fully drawn);
    // just light every bullet immediately, no animation.
    dots.forEach(function (dot) {
      dot.classList.add("is-lit");
    });
    return;
  }

  if (typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var wrapHeight = 0;
  var offsets = [];

  function measure() {
    wrapHeight = wrap.offsetHeight;
    var wrapTop = wrap.getBoundingClientRect().top;
    offsets = dots.map(function (dot) {
      return dot.getBoundingClientRect().top - wrapTop;
    });
  }

  measure();

  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top 70%",
        end: "bottom 60%",
        scrub: true,
        onUpdate: function (self) {
          var currentY = self.progress * wrapHeight;
          for (var i = 0; i < dots.length; i++) {
            dots[i].classList.toggle("is-lit", currentY >= offsets[i]);
          }
        },
      },
    }
  );

  var resizeTimer;
  function scheduleRemeasure() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      measure();
      ScrollTrigger.refresh();
    }, 150);
  }
  window.addEventListener("resize", scheduleRemeasure);
  // Web fonts loading after this script runs can reflow entry heights;
  // re-measure once everything (fonts included) has settled.
  window.addEventListener("load", scheduleRemeasure);
})();
