/*
 * "More" dropdown grouping Process/Notes/FAQ/Language in the header
 * nav. On desktop, hover-to-open is pure CSS (:hover in style.css,
 * scoped to (hover:hover) and (pointer:fine) devices, plus a small
 * invisible ::after "bridge" over the gap so moving the cursor from
 * the trigger down into the panel doesn't lose hover) — untouched
 * here. This file adds the click-to-open/toggle behavior, which does
 * double duty as the actual mechanism on mobile: there, style.css
 * restyles .nav__more-menu to sit inline (position:static, a
 * max-height/opacity transition) inside the already-open mobile menu
 * instead of floating as an absolutely-positioned panel, so the same
 * .is-open toggle below expands/collapses it in place.
 *
 * script.js attaches its own click listener to every .nav__link
 * (including this trigger, which shares that class for visual
 * consistency) that closes the whole mobile menu on any nav link
 * click — correct for the actual Process/Notes/FAQ/Language links,
 * which do navigate away, but not for the trigger itself, which only
 * expands/collapses a sublist and shouldn't close the mobile menu as
 * a side effect. Since script.js can't be touched, the trigger's own
 * click handler here calls stopImmediatePropagation() — unlike
 * stopPropagation(), this also blocks *other* listeners already
 * registered on this same element (script.js's) from firing for this
 * click, without affecting the real links below, which still close the
 * mobile menu after navigating exactly as before.
 *
 * Fully independent from script.js, scroll-animations.js, and
 * signature-effects.js.
 */
(function () {
  "use strict";

  var wrap = document.querySelector(".nav__more");
  var trigger = wrap && wrap.querySelector(".nav__more-trigger");
  var menu = wrap && wrap.querySelector(".nav__more-menu");
  if (!wrap || !trigger || !menu) return;

  function setOpen(isOpen) {
    wrap.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
  }

  trigger.addEventListener("click", function (e) {
    e.stopImmediatePropagation();
    setOpen(!wrap.classList.contains("is-open"));
  });

  document.addEventListener("click", function (e) {
    if (!wrap.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  Array.prototype.slice
    .call(menu.querySelectorAll(".nav__link"))
    .forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
})();
