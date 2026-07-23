document.addEventListener("DOMContentLoaded", () => {

  // Reveal animation
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, {
    threshold: 0.2
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // Skill progress bars
  const skills = document.querySelectorAll(".skill-list li");

  skills.forEach(skill => {
    const bar = skill.querySelector("i");

    if (bar) {
      skill.style.setProperty("--w", bar.dataset.level + "%");
    }
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-animated");
      }
    });
  }, {
    threshold: 0.3
  });

  skills.forEach(skill => skillObserver.observe(skill));

});

/* ---------- Dark / Light Mode Toggle ---------- */
document.addEventListener("DOMContentLoaded", () => {

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {

      const html = document.documentElement;

      if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }

    });
  }

});
// Mobile navigation menu
document.addEventListener("DOMContentLoaded", () => {

  const nav = document.getElementById("nav");
  const navBurger = document.getElementById("navBurger");

  if (!navBurger || !nav) {
    console.log("Navigation elements not found");
    return;
  }

  navBurger.addEventListener("click", () => {
    console.log("Burger clicked");

    nav.classList.toggle("menu-open");
    navBurger.classList.toggle("is-open");

    const expanded = navBurger.classList.contains("is-open");
    navBurger.setAttribute("aria-expanded", expanded);
  });

});