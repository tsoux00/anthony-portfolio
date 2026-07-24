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

/* ---------- Contact form: validation + real email sending (EmailJS, no backend/database) ---------- */
document.addEventListener("DOMContentLoaded", () => {

  // 1. Go to https://www.emailjs.com → sign up free
  // 2. Add an Email Service (e.g. connect your Gmail) → copy its Service ID
  // 3. Create an Email Template with variables {{from_name}}, {{reply_to}}, {{message}}
  //    → copy its Template ID
  // 4. Account → General → copy your Public Key
  // 5. Paste all three below.
  const EMAILJS_PUBLIC_KEY  = "QVeq3fbY08DUTt3EA";
  const EMAILJS_SERVICE_ID  = "service_4rpj484";
  const EMAILJS_TEMPLATE_ID = "template_99mu3c5";
  const TO_EMAIL = "tsonyraf@gmail.com";

  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });

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

      console.log("Sending email...");

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: nameInput.value.trim(),
          reply_to: emailInput.value.trim(),
          message: msgInput.value.trim()
        }
      );

      console.log(response);

      submitBtn.textContent = "Message Sent ✓";

      formNote.textContent =
        "Thank you! Your message has been sent.";

      form.reset();

    } catch (err) {

      console.error(err);

      submitBtn.textContent = "Send message";

      formNote.textContent =
        "Unable to send the message. Please try again.";

    } finally {

      sending = false;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send message <span class="arrow">→</span>';
      }, 1500);

    }

  });

});