/*
 * Label-reveal animation for the Email/LinkedIn/GitHub buttons: expand
 * from icon-only to icon+label, on first view (staggered, held ~3s,
 * then collapsed) and on hover (same expand/collapse motion, no hold —
 * stays open for as long as it's hovered).
 *
 * The animated property is the WIDTH of .hero__social-item — the real
 * flex item in the .hero__social row (see style.css) — so a growing
 * button smoothly pushes its neighbors along the row via normal flex
 * reflow, rather than overlaying them in place. .hero__social-btn
 * (the visible icon+label pill) fills that item at width:100%, so it
 * grows in step automatically; its padding-left/border-radius are
 * animated directly for the centering + pill-shape effect.
 *
 * Fully independent from script.js (the hero typing animation),
 * scroll-animations.js, and signature-effects.js — including the
 * chat-bubble animations, which live in hero-illustration.js and are
 * untouched here.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var groups = Array.prototype.slice
    .call(document.querySelectorAll(".hero__social-item"))
    .map(function (item) {
      return {
        item: item,
        btn: item.querySelector(".hero__social-btn"),
        label: item.querySelector(".hero__social-btn__label"),
      };
    })
    .filter(function (g) {
      return g.btn && g.label;
    });
  if (!groups.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var REST_WIDTH = 44;
  var REST_PADDING_LEFT = 12; // must match .hero__social-btn's CSS
  var REST_RADIUS = 13;
  var EXPANDED_RADIUS = 22; // half of REST_WIDTH's height, for a full pill
  var EXPAND_DURATION = 0.4;
  var COLLAPSE_DURATION = 0.4;
  var HOLD_DURATION = 3;
  var EXPAND_EASE = "power2.out";
  var COLLAPSE_EASE = "power2.inOut";
  var FIRST_VIEW_STAGGER = 0.15;
  var FIRST_VIEW_START_DELAY = 0.9;

  // scrollWidth on the button reflects its full icon+label content
  // width even while overflow:hidden clips it visually at rest, so
  // this is measured fresh on every expand rather than cached once —
  // a hover well after page load always gets an accurate value
  // regardless of exactly when web fonts finished loading. sharedWidth
  // is the widest of the three, so "Email"/"GitHub" expand to the same
  // width as "LinkedIn" instead of each sizing to its own shorter
  // text; padding is computed per-button off that same shared width so
  // each button's own (possibly narrower) content still ends up
  // centered within it, rather than left-anchored with empty trailing
  // space.
  function measure(btn) {
    var fullWidths = groups.map(function (g) {
      return g.btn.scrollWidth;
    });
    var sharedWidth = Math.max.apply(null, fullWidths.concat(REST_WIDTH));
    var contentWidth = btn.scrollWidth - REST_PADDING_LEFT;
    var paddingLeft = Math.max(0, (sharedWidth - contentWidth) / 2);
    return { width: sharedWidth, paddingLeft: paddingLeft };
  }

  groups.forEach(function (g) {
    g.item.addEventListener("mouseenter", function () {
      var target = measure(g.btn);
      if (prefersReducedMotion) {
        gsap.set(g.item, { width: target.width });
        gsap.set(g.btn, {
          paddingLeft: target.paddingLeft,
          borderRadius: EXPANDED_RADIUS,
        });
        gsap.set(g.label, { opacity: 1 });
        return;
      }
      gsap.to(g.item, {
        width: target.width,
        duration: EXPAND_DURATION,
        ease: EXPAND_EASE,
      });
      gsap.to(g.btn, {
        paddingLeft: target.paddingLeft,
        borderRadius: EXPANDED_RADIUS,
        duration: EXPAND_DURATION,
        ease: EXPAND_EASE,
      });
      gsap.to(g.label, {
        opacity: 1,
        duration: EXPAND_DURATION,
        ease: EXPAND_EASE,
      });
    });

    g.item.addEventListener("mouseleave", function () {
      if (prefersReducedMotion) {
        gsap.set(g.item, { width: REST_WIDTH });
        gsap.set(g.btn, {
          paddingLeft: REST_PADDING_LEFT,
          borderRadius: REST_RADIUS,
        });
        gsap.set(g.label, { opacity: 0 });
        return;
      }
      gsap.to(g.item, {
        width: REST_WIDTH,
        duration: COLLAPSE_DURATION,
        ease: COLLAPSE_EASE,
      });
      gsap.to(g.btn, {
        paddingLeft: REST_PADDING_LEFT,
        borderRadius: REST_RADIUS,
        duration: COLLAPSE_DURATION,
        ease: COLLAPSE_EASE,
      });
      gsap.to(g.label, {
        opacity: 0,
        duration: COLLAPSE_DURATION * 0.6,
        ease: COLLAPSE_EASE,
      });
    });
  });

  // ---------- First-view reveal ----------
  // Skipped entirely under reduced motion — buttons simply stay at
  // their icon-only CSS resting state (hover above still shows the
  // label, just instantly instead of animated).
  if (prefersReducedMotion) return;

  function startFirstView() {
    groups.forEach(function (g, i) {
      var target = measure(g.btn);
      var tl = gsap.timeline({
        delay: FIRST_VIEW_START_DELAY + i * FIRST_VIEW_STAGGER,
      });
      tl.to(
        g.item,
        { width: target.width, duration: EXPAND_DURATION, ease: EXPAND_EASE },
        0
      )
        .to(
          g.btn,
          {
            paddingLeft: target.paddingLeft,
            borderRadius: EXPANDED_RADIUS,
            duration: EXPAND_DURATION,
            ease: EXPAND_EASE,
          },
          0
        )
        .to(
          g.label,
          { opacity: 1, duration: EXPAND_DURATION, ease: EXPAND_EASE },
          0
        )
        .to(
          g.item,
          {
            width: REST_WIDTH,
            duration: COLLAPSE_DURATION,
            ease: COLLAPSE_EASE,
          },
          "+=" + HOLD_DURATION
        )
        .to(
          g.btn,
          {
            paddingLeft: REST_PADDING_LEFT,
            borderRadius: REST_RADIUS,
            duration: COLLAPSE_DURATION,
            ease: COLLAPSE_EASE,
          },
          "<"
        )
        .to(
          g.label,
          {
            opacity: 0,
            duration: COLLAPSE_DURATION * 0.6,
            ease: COLLAPSE_EASE,
          },
          "<"
        );
    });
  }

  // Measuring scrollWidth before the mono font used in the label has
  // finished loading could size the expand to a fallback font's
  // (usually narrower) metrics, clipping the real label slightly once
  // the correct font swaps in — wait for fonts first, same pattern
  // used by experience-timeline.js for its own first measurement.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startFirstView).catch(startFirstView);
  } else {
    startFirstView();
  }
})();
