if (!window.__thonyPortfolioScriptInit) {
  window.__thonyPortfolioScriptInit = true;

  document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Theme toggle ---------- */
    const themeToggle = document.getElementById("themeToggle");
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else if (savedTheme === "light") {
      html.removeAttribute("data-theme");
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      html.setAttribute("data-theme", "dark");
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        if (html.getAttribute("data-theme") === "dark") {
          html.removeAttribute("data-theme");
          localStorage.setItem("theme", "light");
        } else {
          html.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        }
      });
    }

    // Hero typing animation
    const typingTarget = document.getElementById("typing");
    const heroRole = document.querySelector(".hero__role");
    const heroText = "Product Owner & QA Engineer";
    let typeIndex = 0;
    let hasTyped = false;

    function typeHeroText() {
      if (!typingTarget || hasTyped) return;
      hasTyped = true;
      typingTarget.textContent = "";
      const typeNext = () => {
        if (typeIndex < heroText.length) {
          typingTarget.textContent += heroText[typeIndex++];
          setTimeout(typeNext, 70);
        }
      };
      typeNext();
    }

    if (heroRole) {
      const heroObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeHeroText();
            observer.disconnect();
          }
        });
      }, { threshold: 0.35 });
      heroObserver.observe(heroRole);
    }

    // Reveal animation + experience morph effect
    const revealElements = document.querySelectorAll(".reveal, .changelog__entry");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.2 });
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
    }, { threshold: 0.3 });
    skills.forEach(skill => skillObserver.observe(skill));

    // Mobile navigation menu
    const nav = document.getElementById("nav");
    const navBurger = document.getElementById("navBurger");
    if (navBurger && nav) {
      navBurger.addEventListener("click", () => {
        nav.classList.toggle("menu-open");
        navBurger.classList.toggle("is-open");
        navBurger.setAttribute("aria-expanded", navBurger.classList.contains("is-open"));
      });
    }

    /* ---------- Contact form: validation + real email sending (EmailJS, no backend/database) ---------- */
    const EMAILJS_PUBLIC_KEY  = "QVeq3fbY08DUTt3EA";
    const EMAILJS_SERVICE_ID  = "service_4rpj484";
    const EMAILJS_TEMPLATE_ID = "template_99mu3c5";

    if (window.emailjs) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const form = document.getElementById("contactForm");
    if (!form) return;

    const nameInput = document.getElementById("fname");
    const emailInput = document.getElementById("femail");
    const msgInput = document.getElementById("fmsg");
    const nameError = document.getElementById("fnameError");
    const emailError = document.getElementById("femailError");
    const msgError = document.getElementById("fmsgError");
    const formNote = document.getElementById("formNote");
    const submitBtn = form.querySelector("button[type='submit']");
    let sending = false;

    function setError(field, errorEl, message) {
      const wrapper = field.closest(".field");
      if (message) {
        wrapper.classList.add("has-error");
        errorEl.textContent = message;
      } else {
        wrapper.classList.remove("has-error");
        errorEl.textContent = "";
      }
    }

    function validate() {
      let valid = true;
      if (nameInput.value.trim().length < 2) {
        setError(nameInput, nameError, "Please enter your name.");
        valid = false;
      } else {
        setError(nameInput, nameError, "");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, emailError, "Please enter a valid email.");
        valid = false;
      } else {
        setError(emailInput, emailError, "");
      }
      if (msgInput.value.trim().length < 10) {
        setError(msgInput, msgError, "Please enter at least 10 characters.");
        valid = false;
      } else {
        setError(msgInput, msgError, "");
      }
      return valid;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (sending) return;
      if (!validate()) return;
      sending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      formNote.textContent = "";
      try {
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: nameInput.value.trim(),
            reply_to: emailInput.value.trim(),
            message: msgInput.value.trim()
          }
        );
        submitBtn.textContent = "Message Sent ✓";
        formNote.textContent = "Thank you! Your message has been sent.";
        form.reset();
      } catch (err) {
        console.error(err);
        submitBtn.textContent = "Send message";
        formNote.textContent = "Unable to send the message. Please try again.";
      } finally {
        sending = false;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send message <span class="arrow">→</span>';
        }, 1500);
      }
    });
  });
}
