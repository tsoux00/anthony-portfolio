/*
 * Generative abstract visual for each project card's media area.
 * Deterministic per project: a project's seed string is hashed to an
 * integer, which feeds a seeded PRNG (mulberry32) — no Math.random()
 * anywhere, so the exact same seed always produces the exact same
 * pattern (same shapes, positions, colors) on every load.
 *
 * To give a future project its own pattern: add
 * data-seed="Some Unique Name" to its .project-card__media div (the
 * project title is fine) — nothing else in this file needs to change.
 * Colors are drawn from the site's existing palette (var(--blue),
 * var(--green), plus the purple/amber/teal accents already used for the
 * Experience tags), so every generated pattern stays visually
 * consistent with the rest of the site regardless of seed.
 */
(function () {
  "use strict";

  var PALETTE = ["var(--blue)", "var(--green)", "#a855f7", "#f59e0b", "#14b8a6"];
  var WIDTH = 400;
  var HEIGHT = 225;

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildSvg(seedText) {
    var rand = mulberry32(hashString(seedText));
    var shapeCount = 5 + Math.floor(rand() * 3);
    var shapes = "";
    var i, r, cx, cy, color, opacity;

    for (i = 0; i < shapeCount; i++) {
      r = 30 + rand() * 90;
      cx = rand() * WIDTH;
      cy = rand() * HEIGHT;
      color = PALETTE[Math.floor(rand() * PALETTE.length)];
      opacity = (0.12 + rand() * 0.22).toFixed(2);
      shapes +=
        '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
        '" r="' + r.toFixed(1) + '" fill="' + color +
        '" opacity="' + opacity + '"></circle>';
    }

    var lineCount = 2 + Math.floor(rand() * 2);
    var j, x1, y1, x2, y2, lineColor;
    for (j = 0; j < lineCount; j++) {
      x1 = rand() * WIDTH;
      y1 = rand() * HEIGHT;
      x2 = rand() * WIDTH;
      y2 = rand() * HEIGHT;
      lineColor = PALETTE[Math.floor(rand() * PALETTE.length)];
      shapes +=
        '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) +
        '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
        '" stroke="' + lineColor + '" stroke-width="1.5" opacity="0.25"></line>';
    }

    return (
      '<svg viewBox="0 0 ' + WIDTH + " " + HEIGHT +
      '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="' + WIDTH + '" height="' + HEIGHT + '" fill="var(--bg-alt)"></rect>' +
      shapes +
      "</svg>"
    );
  }

  document
    .querySelectorAll(".project-card__media[data-seed]")
    .forEach(function (el) {
      var seed = el.getAttribute("data-seed") || "project";
      el.innerHTML = buildSvg(seed);
    });
})();
