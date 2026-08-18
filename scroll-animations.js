/*
 * Scroll-based animation layer: Lenis smooth scroll, GSAP ScrollTrigger
 * reveals, and magnetic CTA buttons.
 *
 * This file is fully independent from script.js and never touches the
 * hero typing/deletion animation (#typing, .hero__role) or its logic.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var sectionTitles = document.querySelectorAll(".section-title");
  var projectCards = document.querySelectorAll(".projects__grid .project-card");

  if (prefersReducedMotion) {
    // Respect the user's preference: skip Lenis and all scroll-driven
    // motion, just make sure everything ends up in its resting state.
    gsap.set(sectionTitles, { opacity: 1, y: 0 });
    gsap.set(projectCards, { opacity: 1, y: 0 });
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---------- Lenis smooth scroll (site-wide) ----------
  var lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    lenis.on("scroll", function () {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
    });

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Keep in-page anchor nav links (#projects, #skills, ...) buttery-smooth
    // through Lenis instead of the native jump/CSS smoothscroll.
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = link.getAttribute("href");
        if (!hash || hash.length < 2) return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      });
    });
  }

  if (typeof ScrollTrigger === "undefined") return;

  // ---------- Section heading reveals ----------
  sectionTitles.forEach(function (title) {
    gsap.fromTo(
      title,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: title, start: "top 85%", once: true },
      }
    );
  });

  // ---------- Project card staggered reveal ----------
  // One clean motion per card: fade + soft scale-up + slight rise. No
  // separate image wipe or extra layers competing with it.
  var projectGrid = document.querySelector(".projects__grid");
  if (projectGrid && projectCards.length) {
    gsap.fromTo(
      projectCards,
      { opacity: 0, y: 28, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: projectGrid, start: "top 80%", once: true },
      }
    );
  }

  // ---------- Magnetic hover on primary CTA buttons ----------
  var magneticStrength = 0.35;
  document.querySelectorAll(".btn").forEach(function (btn) {
    var bounds = null;

    btn.addEventListener("mouseenter", function () {
      bounds = btn.getBoundingClientRect();
    });

    btn.addEventListener("mousemove", function (e) {
      if (!bounds) bounds = btn.getBoundingClientRect();
      var relX = e.clientX - bounds.left - bounds.width / 2;
      var relY = e.clientY - bounds.top - bounds.height / 2;
      gsap.to(btn, {
        x: relX * magneticStrength,
        y: relY * magneticStrength,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", function () {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });

  // ---------- Keep ScrollTrigger positions accurate ----------
  // Covers window resize and layout shifts from the language toggle
  // (text length changes) without hooking into script.js at all.
  var refreshTimer;
  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      ScrollTrigger.refresh();
    }, 150);
  }
  window.addEventListener("resize", scheduleRefresh);
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(scheduleRefresh).observe(document.body);
  }
})();
