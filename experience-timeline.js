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
    // CSS already defaults .changelog__fill to height:100% (fully
    // drawn); just light every bullet immediately, no animation.
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

  function start() {
    measure();

    // Animates the fill's own `height` in pixels rather than
    // `transform: scaleY()`. A very thin (2px) element continuously
    // scaled via transform during a scrub can show a GPU-compositing
    // rendering artifact in some browsers — a faint duplicate/ghost of
    // the bar at its previous size for a frame or two ("double line")
    // before it settles. Animating height avoids that class of
    // artifact entirely, at the cost of triggering layout on this one
    // small absolutely-positioned element, which is cheap. The target
    // height is a function (re-read from `wrapHeight`) so a resize
    // recalculation is picked up correctly, matching the
    // `invalidateOnRefresh` pattern used elsewhere on this site.
    gsap.fromTo(
      fill,
      { height: 0 },
      {
        height: function () {
          return wrapHeight;
        },
        ease: "none",
        invalidateOnRefresh: true,
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

    // Only resize needs a later re-measure now (a real, user-initiated
    // layout change). We deliberately do NOT also refresh on
    // window "load": that can fire well after the user has already
    // started scrolling (e.g. once a late image elsewhere on the page
    // finishes loading), and ScrollTrigger.refresh() re-applies the
    // tween's value for the current scroll position immediately, not
    // smoothly — if the recalculated height differs even slightly from
    // the one used when the trigger was created, the fill snaps from
    // one length to another mid-scroll, which reads as a "double line"
    // flash. Waiting for fonts below removes the main reason that
    // number would ever be wrong in the first place.
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measure();
        ScrollTrigger.refresh();
      }, 150);
    });
  }

  // Wait for web fonts to finish loading before the very first
  // measurement — a late font swap changing text metrics inside
  // .changelog-wrap was the main realistic cause of the height being
  // wrong at setup time, which is what made a later corrective refresh
  // (and its visible jump) seem necessary.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
})();
