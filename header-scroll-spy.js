/*
 * Header active-section tracking. Fully independent from script.js,
 * scroll-animations.js, and signature-effects.js.
 *
 * Uses IntersectionObserver (matching the pattern already established
 * everywhere else on this site for scroll-driven state — reveal system,
 * skill bars, language cards, pipeline steps) rather than GSAP
 * ScrollTrigger, since this is a simple "is this section current" check,
 * not a scrub/percentage effect.
 *
 * The mobile hamburger menu uses the exact same <a class="nav__link">
 * elements as desktop (just repositioned via CSS media query), so no
 * separate mobile-specific logic is needed — the active class applies
 * to the same DOM node either way.
 */
(function () {
  "use strict";

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__link")
  );
  if (!navLinks.length) return;

  var linkMap = {};
  navLinks.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) === "#" && href.length > 1) {
      linkMap[href.slice(1)] = link;
    }
  });

  var sections = Object.keys(linkMap)
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  if (!sections.length) return;

  var currentActiveId = null;

  function setActive(id) {
    if (id === currentActiveId) return;
    currentActiveId = id;
    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });
    var link = linkMap[id];
    if (!link) return;
    link.classList.add("is-active");
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
