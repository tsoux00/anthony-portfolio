/*
 * Signature interactive layer: binary-trail cursor effect (default OS
 * cursor stays untouched), split-text heading reveals, link text-scramble,
 * and the horizontal scroll-pinned project showcase.
 *
 * Fully independent from script.js (hero typing animation untouched) and
 * from scroll-animations.js's existing Lenis/reveal/magnetic-button logic.
 * The only interaction with scroll-animations.js is at runtime: for the
 * four "major" headings we give a SplitText treatment to, we kill *their*
 * specific ScrollTrigger instance (created by scroll-animations.js) so the
 * two reveals don't fight over the same element's opacity. Every other
 * section-title, and the file itself, is left exactly as it was.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof SplitText !== "undefined") {
    gsap.registerPlugin(SplitText);
  }

  /* ======================================================================
     1. Binary trail (default OS cursor stays exactly as-is — no custom
     cursor shape/dot; only the "0"/"1" trail is added, following the
     real cursor position).
     ====================================================================== */
  (function initBinaryTrail() {
    if (prefersReducedMotion || isCoarsePointer) return;

    var isActive = false;
    var lastSpawn = 0;

    function setActive(active) {
      isActive = active;
    }

    function spawnDigit(x, y) {
      var span = document.createElement("span");
      span.className = "sig-binary";
      span.textContent = Math.random() < 0.5 ? "0" : "1";
      span.style.left = x + "px";
      span.style.top = y + "px";
      span.style.fontSize = (10 + Math.random() * 4).toFixed(1) + "px";
      document.body.appendChild(span);

      var driftX = (Math.random() - 0.5) * 28;
      var driftY = -(18 + Math.random() * 24);
      var rotateFrom = (Math.random() - 0.5) * 30;

      gsap.fromTo(
        span,
        { x: 0, y: 0, opacity: 0.55, scale: 1, rotation: rotateFrom },
        {
          x: driftX,
          y: driftY,
          opacity: 0,
          scale: 0.5 + Math.random() * 0.3,
          duration: 0.6 + Math.random() * 0.4,
          ease: "power1.out",
          onComplete: function () {
            span.remove();
          },
        }
      );
    }

    window.addEventListener("mousemove", function (e) {
      var now = performance.now();
      var interval = isActive ? 20 : 40;
      if (now - lastSpawn >= interval) {
        lastSpawn = now;
        spawnDigit(e.clientX, e.clientY);
      }
    });

    // Hover reaction: no cursor shape to scale, so react by spawning the
    // trail faster instead (handled via the `interval` above).
    var REACT_SELECTOR = "a, button, .project-card, .btn, .nav__link";
    document.addEventListener("mouseover", function (e) {
      var el = e.target.closest ? e.target.closest(REACT_SELECTOR) : null;
      if (el && (!e.relatedTarget || !el.contains(e.relatedTarget))) {
        setActive(true);
      }
    });
    document.addEventListener("mouseout", function (e) {
      var el = e.target.closest ? e.target.closest(REACT_SELECTOR) : null;
      if (el && (!e.relatedTarget || !el.contains(e.relatedTarget))) {
        setActive(false);
      }
    });
  })();

  /* ======================================================================
     2. Split-text heading reveals (About, Skills, Projects, Contact)
     ====================================================================== */
  (function initSplitHeadings() {
    if (prefersReducedMotion) return;
    if (typeof SplitText === "undefined" || typeof ScrollTrigger === "undefined") return;

    var TARGET_KEYS = ["about.title", "skills.title", "projects.title", "contact.title"];

    TARGET_KEYS.forEach(function (key) {
      var el = document.querySelector('.section-title[data-i18n="' + key + '"]');
      if (!el) return;

      // scroll-animations.js already put a fade/slide ScrollTrigger on every
      // .section-title. For these four headings we replace that with a
      // character reveal, so kill just their instance to avoid a double
      // (fighting) opacity animation on the same element.
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.getAll().forEach(function (st) {
          if (st.trigger === el) st.kill();
        });
      }
      gsap.set(el, { clearProps: "opacity,transform" });

      var currentSplit = null;

      function playReveal() {
        currentSplit = new SplitText(el, { type: "chars", charsClass: "sig-split-char" });
        gsap.set(currentSplit.chars, { opacity: 0, y: 20 });
        gsap.to(currentSplit.chars, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.025,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }

      function showStaticSplit() {
        currentSplit = new SplitText(el, { type: "chars", charsClass: "sig-split-char" });
        gsap.set(currentSplit.chars, { opacity: 1, y: 0 });
      }

      playReveal();

      // Language toggle rewrites el.textContent (via script.js's i18n code,
      // which we never touch/call directly) — that wipes the SplitText
      // spans, so re-split afterwards. Guard the observer against the
      // mutations SplitText itself causes, to avoid an infinite loop.
      var observer = new MutationObserver(function () {
        observer.disconnect();
        if (currentSplit) currentSplit.revert();
        showStaticSplit();
        observer.observe(el, { childList: true, characterData: true, subtree: true });
      });
      observer.observe(el, { childList: true, characterData: true, subtree: true });
    });
  })();

  /* ======================================================================
     3. Text scramble on project link hover
     (Removed from .nav__link — the menu now uses its original plain CSS
     :hover color/background, nothing else.)
     ====================================================================== */
  (function initScramble() {
    if (prefersReducedMotion) return;

    var SCRAMBLE_CHARS = "01!<>-_/[]{}—=+*^?#";

    function scramble(el) {
      // Restore original text before killing, so an interrupted re-hover
      // can never leave the label stuck mid-scramble.
      if (el._sigScramble) {
        el._sigScramble.kill();
        el.textContent = el._sigOriginalText;
      }
      var original = el.textContent;
      el._sigOriginalText = original;
      var len = original.length;
      var state = { progress: 0 };
      el._sigScramble = gsap.to(state, {
        progress: 1,
        duration: 0.35,
        ease: "none",
        onUpdate: function () {
          var revealCount = Math.floor(state.progress * len);
          var out = "";
          for (var i = 0; i < len; i++) {
            if (i < revealCount || original[i] === " ") {
              out += original[i];
            } else {
              out += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
            }
          }
          el.textContent = out;
        },
        onComplete: function () {
          el.textContent = original;
          el._sigScramble = null;
        },
      });
    }

    document.querySelectorAll(".project-card__actions .link-btn").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        scramble(el);
      });
    });
  })();

  /* ======================================================================
     4. Horizontal scroll-pinned project showcase (fine pointer only)
     Pins #projects and scrubs the card row horizontally as the user
     scrolls vertically. Desktop/trackpad (fine pointer) only — on touch
     (mobile/tablet/iPad) this is skipped entirely so the section scrolls
     vertically like any other, and the cards are just a plain, natively
     swipeable horizontal strip instead (see the "(pointer: coarse)" rule
     in style.css).
     ====================================================================== */
  (function initHorizontalShowcase() {
    if (prefersReducedMotion || isCoarsePointer) return;
    if (typeof ScrollTrigger === "undefined") return;

    var section = document.getElementById("projects");
    var sectionInner = section ? section.querySelector(".section-inner") : null;
    var grid = document.querySelector(".projects__grid");
    if (!section || !sectionInner || !grid) return;

    var cards = grid.querySelectorAll(".project-card");
    if (cards.length < 3) return;

    section.classList.add("sig-horizontal-projects");
    grid.classList.add("sig-horizontal-projects__track");

    function getMaxScroll() {
      return Math.max(0, grid.scrollWidth - sectionInner.clientWidth);
    }

    gsap.to(grid, {
      x: function () {
        return -getMaxScroll();
      },
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + getMaxScroll();
        },
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // The project images load asynchronously, so grid.scrollWidth (and
    // therefore the scrub end / how far the last card needs to travel)
    // is wrong until they've all decoded. Refresh once they're in so the
    // last card lands fully in view instead of being cut off short.
    var images = grid.querySelectorAll("img");
    var pending = 0;
    images.forEach(function (img) {
      if (img.complete) return;
      pending++;
      img.addEventListener(
        "load",
        function () {
          pending--;
          if (pending === 0) ScrollTrigger.refresh();
        },
        { once: true }
      );
      img.addEventListener("error", function () {
        pending--;
        if (pending === 0) ScrollTrigger.refresh();
      });
    });
  })();

  /* ======================================================================
     Keep ScrollTrigger positions accurate after the above DOM changes
     ====================================================================== */
  if (typeof ScrollTrigger !== "undefined") {
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  }
})();
