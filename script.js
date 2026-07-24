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
    const roleOptions = ["Product Owner", "QA Engineer", "No-code Developer"];
    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseBetweenRoles = 1700;
    const pauseAfterDelete = 700;
    let currentRole = 0;

    function typeText(text, callback) {
      let index = 0;
      typingTarget.textContent = "";
      const typer = () => {
        if (index < text.length) {
          typingTarget.textContent += text[index++];
          setTimeout(typer, typingSpeed);
        } else {
          callback();
        }
      };
      typer();
    }

    function deleteText(callback) {
      const deleteChar = () => {
        const current = typingTarget.textContent;
        if (current.length > 0) {
          typingTarget.textContent = current.slice(0, -1);
          setTimeout(deleteChar, deletingSpeed);
        } else {
          callback();
        }
      };
      deleteChar();
    }

    function runTypingLoop() {
      const role = roleOptions[currentRole];
      typeText(role, () => {
        setTimeout(() => {
          deleteText(() => {
            currentRole = (currentRole + 1) % roleOptions.length;
            setTimeout(runTypingLoop, pauseAfterDelete);
          });
        }, pauseBetweenRoles);
      });
    }

    if (heroRole && typingTarget) {
      const heroObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runTypingLoop();
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

    // Pipeline step reveal animation
    const pipelineSteps = document.querySelectorAll(".pipeline__stage");
    const pipelineObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          const next = entry.target.nextElementSibling;
          if (next && next.classList.contains("pipeline__stage")) {
            setTimeout(() => next.classList.add("is-visible"), 110);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    pipelineSteps.forEach(step => pipelineObserver.observe(step));

    // Skill progress bars and dashboard reveal
    const skillCards = document.querySelectorAll(".skill-card");
    const skills = document.querySelectorAll(".skill-list li");

    skills.forEach(skill => {
      const bar = skill.querySelector("i");
      if (bar) {
        const level = Number(bar.dataset.level) || 0;
        bar.style.setProperty("--progress", `${level}%`);

        if (level >= 90) {
          bar.style.setProperty("--progress-start", "#34d399");
          bar.style.setProperty("--progress-end", "#10b981");
        } else if (level >= 75) {
          bar.style.setProperty("--progress-start", "#60a5fa");
          bar.style.setProperty("--progress-end", "#2563eb");
        } else {
          bar.style.setProperty("--progress-start", "#fbbf24");
          bar.style.setProperty("--progress-end", "#f97316");
        }
      }
    });

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
        }
      });
    }, { threshold: 0.35 });

    skills.forEach((skill, index) => {
      skill.style.setProperty("--delay", `${index * 80}ms`);
      skillObserver.observe(skill);
    });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty("--delay", `${index * 80}ms`);
          entry.target.classList.add("is-visible");
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillCards.forEach(card => cardObserver.observe(card));

    // Mobile navigation menu
    const nav = document.getElementById("nav");
    const navBurger = document.getElementById("navBurger");
    if (navBurger && nav) {
      navBurger.addEventListener("click", () => {
        nav.classList.toggle("menu-open");
        navBurger.classList.toggle("is-open");
        navBurger.setAttribute("aria-expanded", navBurger.classList.contains("is-open"));
      });

      const navLinks = nav.querySelectorAll(".nav__link");
      navLinks.forEach(link => {
        link.addEventListener("click", () => {
          if (nav.classList.contains("menu-open")) {
            nav.classList.remove("menu-open");
            navBurger.classList.remove("is-open");
            navBurger.setAttribute("aria-expanded", "false");
          }
        });
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
