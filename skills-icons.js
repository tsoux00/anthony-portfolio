/*
 * Renders the Lucide icon placeholders ([data-lucide]) added to the
 * skills-by-category section into real inline SVGs. Nothing else on the
 * page uses Lucide, and this file touches nothing but calling the
 * library's own render function — no hero/reveal/animation logic here.
 */
(function () {
  "use strict";

  if (typeof lucide === "undefined") return;
  lucide.createIcons();
})();
