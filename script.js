if (!window.__thonyPortfolioScriptInit) {
  window.__thonyPortfolioScriptInit = true;

  document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Theme toggle ---------- */
    const themeToggle = document.getElementById("themeToggle");
    const langSwitch = document.getElementById("langSwitch");
    const langSwitchLabel = document.getElementById("langSwitchLabel");
    const langSwitchIcon = document.getElementById("langSwitchIcon");
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    let activeLanguage = localStorage.getItem("portfolioLanguage") || "en";

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

    const translations = {
      en: {
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.experience": "Experience",
        "nav.projects": "Projects",
        "nav.process": "Process",
        "nav.education": "Education",
        "nav.certs": "Certs",
        "nav.notes": "Notes",
        "nav.contact": "Contact",
        "hero.badge": "v1.0.0 · currently shipping",
        "hero.roleLabel": "I am a",
        "hero.summary": "I sit between engineering, design, and the business, and I make the backlog tell the truth. Three years turning ambiguous problems into products that ship on time, get adopted, and get renewed.",
        "hero.ctaProjects": "View case studies",
        "hero.ctaResume": "Download résumé",
        "hero.statYears": "Years in product",
        "hero.statFeatures": "Features shipped",
        "hero.statPredictability": "Sprint predictability",
        "hero.statProducts": "Products delivered",
        "about.release": "v1.1 · about",
        "about.title": "Release notes on how I work",
        "skills.release": "v1.2 · capability matrix",
        "skills.title": "Skills, by category",
        "experience.release": "v1.3 · changelog",
        "experience.title": "Experience",
        "projects.release": "v1.4 · case studies",
        "projects.title": "Projects",
        "process.release": "v1.5 · pipeline",
        "process.title": "How an idea becomes a release",
        "education.release": "v1.6 · education",
        "education.title": "Education & continuous learning",
        "education.intro": "A background built through formal study, language growth, and practical product work.",
        "languages.release": "v1.6.1 · languages",
        "languages.title": "Languages",
        "languages.intro": "Communication is part of delivery. These are the languages I use to bridge teams, clients, and ideas.",
        "certs.release": "v1.7 · credentials",
        "certs.title": "Certifications",
        "testimonials.release": "v1.8 · notes from the team",
        "testimonials.title": "What shipping with me is like",
        "testimonials.quote": "\"Anthony is the only PO I've worked with who writes acceptance criteria I never have to ask about twice.\"",
        "testimonials.author": "— Hugues Seureau, Staff Engineer",
        "contact.release": "v1.9 · get in touch",
        "contact.title": "Open to the next hard problem",
        "contact.badgeRoles": "Available for new roles",
        "contact.badgeReply": "⏱ < 24h response time",
        "contact.badgeRemote": "🌍 Remote-friendly",
        "contact.intro": "Best reached by email. I read everything, and I answer product questions faster than sales pitches.",
        "contact.emailLabel": "Email",
        "contact.phoneLabel": "Phone",
        "contact.linkedinLabel": "LinkedIn",
        "contact.githubLabel": "GitHub",
        "contact.downloadBtn": "Download résumé (PDF)",
        "contact.nameLabel": "Name",
        "contact.emailLabelField": "Email",
        "contact.messageLabel": "Message",
        "contact.submitBtn": "Send message",
        "contact.disclaimer": "This is a static form — no data is submitted or stored anywhere.",
        "footer.text": "© 2026 Anthony Rasolofoarimanana. Built static — no backend, no database.",
        "footer.meta": "v1.9.0 · last deployed June 2026"
      },
      fr: {
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.experience": "Experience",
        "nav.projects": "Projects",
        "nav.process": "Process",
        "nav.education": "Education",
        "nav.certs": "Certs",
        "nav.notes": "Notes",
        "nav.contact": "Contact",
        "hero.badge": "v1.0.0 · currently shipping",
        "hero.roleLabel": "I am a",
        "hero.summary": "I sit between engineering, design, and the business, and I make the backlog tell the truth. Three years turning ambiguous problems into products that ship on time, get adopted, and get renewed.",
        "hero.ctaProjects": "View case studies",
        "hero.ctaResume": "Download résumé",
        "hero.statYears": "Years in product",
        "hero.statFeatures": "Features shipped",
        "hero.statPredictability": "Sprint predictability",
        "hero.statProducts": "Products delivered",
        "about.release": "v1.1 · about",
        "about.title": "Release notes on how I work",
        "skills.release": "v1.2 · capability matrix",
        "skills.title": "Skills, by category",
        "experience.release": "v1.3 · changelog",
        "experience.title": "Experience",
        "projects.release": "v1.4 · case studies",
        "projects.title": "Projects",
        "process.release": "v1.5 · pipeline",
        "process.title": "How an idea becomes a release",
        "education.release": "v1.6 · education",
        "education.title": "Education & continuous learning",
        "education.intro": "A background built through formal study, language growth, and practical product work.",
        "languages.release": "v1.6.1 · languages",
        "languages.title": "Languages",
        "languages.intro": "Communication is part of delivery. These are the languages I use to bridge teams, clients, and ideas.",
        "certs.release": "v1.7 · credentials",
        "certs.title": "Certifications",
        "testimonials.release": "v1.8 · notes from the team",
        "testimonials.title": "What shipping with me is like",
        "testimonials.quote": "\"Anthony is the only PO I've worked with who writes acceptance criteria I never have to ask about twice.\"",
        "testimonials.author": "— Hugues Seureau, Staff Engineer",
        "contact.release": "v1.9 · get in touch",
        "contact.title": "Open to the next hard problem",
        "contact.badgeRoles": "Available for new roles",
        "contact.badgeReply": "⏱ < 24h response time",
        "contact.badgeRemote": "🌍 Remote-friendly",
        "contact.intro": "Best reached by email. I read everything, and I answer product questions faster than sales pitches.",
        "contact.emailLabel": "Email",
        "contact.phoneLabel": "Phone",
        "contact.linkedinLabel": "LinkedIn",
        "contact.githubLabel": "GitHub",
        "contact.downloadBtn": "Download résumé (PDF)",
        "contact.nameLabel": "Name",
        "contact.emailLabelField": "Email",
        "contact.messageLabel": "Message",
        "contact.submitBtn": "Send message",
        "contact.disclaimer": "This is a static form — no data is submitted or stored anywhere.",
        "footer.text": "© 2026 Anthony Rasolofoarimanana. Built static — no backend, no database.",
        "footer.meta": "v1.9.0 · last deployed June 2026"
      }
    };

    function applyLanguage(lang) {
      const current = translations[lang] || translations.en;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (current[key]) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.setAttribute("placeholder", current[key]);
          } else {
            el.textContent = current[key];
          }
        }
      });
      document.documentElement.lang = lang === "fr" ? "fr" : "en";
      document.documentElement.setAttribute("data-language", lang === "fr" ? "fr" : "en");
      localStorage.setItem("portfolioLanguage", lang);
      if (langSwitchLabel) {
        langSwitchLabel.textContent = lang === "fr" ? "EN" : "FR";
      }
      if (langSwitch) {
        langSwitch.setAttribute("aria-pressed", String(lang === "fr"));
        langSwitch.setAttribute("data-lang", lang === "fr" ? "fr" : "en");
      }
    }

    function setLanguage(lang, { animate = true } = {}) {
      const target = lang === "fr" ? "fr" : "en";
      if (animate && langSwitch) {
        langSwitch.classList.add("is-loading");
        setTimeout(() => {
          activeLanguage = target;
          applyLanguage(target);
          langSwitch.classList.remove("is-loading");
        }, 700);
      } else {
        activeLanguage = target;
        applyLanguage(target);
      }
    }

    if (langSwitch) {
      langSwitch.addEventListener("click", () => {
        const nextLang = activeLanguage === "fr" ? "en" : "fr";
        setLanguage(nextLang);
      });
    }

    applyLanguage(activeLanguage);

    // Hero typing animation
    const typingTarget = document.getElementById("typing");
    const heroRole = document.querySelector(".hero__role");
    const roleOptions = ["Product Owner", "Project Manager", "QA Engineer", "No-code Developer"];
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
    const languageCards = document.querySelectorAll(".language-card");
    const languageBars = document.querySelectorAll(".language-card__bar span");

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

    languageBars.forEach(bar => {
      const level = Number(bar.dataset.level) || 0;
      bar.style.setProperty("--level", `${level}%`);
    });

    const languageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          languageObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    languageCards.forEach(card => languageObserver.observe(card));

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
    const EMAILJS_PUBLIC_KEY            = "QVeq3fbY08DUTt3EA";
    const EMAILJS_SERVICE_ID            = "service_4rpj484";
    const EMAILJS_TEMPLATE_ID           = "template_99mu3c5";
    const EMAILJS_VISITOR_TEMPLATE_ID   = "template_4h80gme";
    const EMAILJS_DOWNLOAD_TEMPLATE_ID  = "template_4h80gme";
    const VISITOR_NOTIFICATION_FLAG     = "visitorNotificationSent";
    const VISITOR_NOTIFICATION_STATE_KEY = "visitorNotificationState";
    const VISITOR_NOTIFICATION_WINDOW_MS = 2 * 60 * 60 * 1000;

    if (window.emailjs) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    function formatDateTime(date) {
      const pad = (value) => String(value).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function getMadagascarDate(date) {
      const offsetMinutes = date.getTimezoneOffset();
      const madagascarOffset = 180; // UTC+3
      return new Date(date.getTime() + (offsetMinutes + madagascarOffset) * 60000);
    }

    function detectBrowserAndOs(userAgent) {
      const ua = userAgent || navigator.userAgent || "";
      let browser = "Unknown browser";
      if (/Edg\//.test(ua)) browser = "Edge";
      else if (/OPR\//.test(ua) || /Opera/.test(ua)) browser = "Opera";
      else if (/Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua)) browser = "Chrome";
      else if (/Firefox\//.test(ua)) browser = "Firefox";
      else if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browser = "Safari";
      else if (/MSIE |Trident\//.test(ua)) browser = "Internet Explorer";

      let os = "Unknown OS";
      if (/Windows NT 10.0/.test(ua)) os = "Windows 10";
      else if (/Windows NT 6.3/.test(ua)) os = "Windows 8.1";
      else if (/Windows NT 6.2/.test(ua)) os = "Windows 8";
      else if (/Windows NT 6.1/.test(ua)) os = "Windows 7";
      else if (/Mac OS X/.test(ua) && !/Mobile/.test(ua)) os = "macOS";
      else if (/Android/.test(ua)) os = "Android";
      else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
      else if (/Linux/.test(ua)) os = "Linux";
      else if (/CrOS/.test(ua)) os = "Chrome OS";

      return `${browser} on ${os}`;
    }

    function detectDeviceType(userAgent) {
      const ua = userAgent || navigator.userAgent || "";
      if (/Tablet|iPad|PlayBook|Silk/.test(ua)) return "Tablet";
      if (/Mobi|Android|iPhone|iPod|Mobile/.test(ua)) return "Mobile";
      return "Desktop";
    }

    async function getVisitorIp() {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) throw new Error("IP lookup failed");
        const data = await response.json();
        return data.ip || "Not available";
      } catch (err) {
        return "Not available";
      }
    }

    function getDeviceFingerprint() {
      const parts = [
        navigator.userAgent || "",
        navigator.language || "",
        navigator.platform || "",
        window.screen?.width || "",
        window.screen?.height || "",
        window.screen?.colorDepth || ""
      ];
      return parts.join("|");
    }

    function readVisitorNotificationState() {
      try {
        const raw = localStorage.getItem(VISITOR_NOTIFICATION_STATE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        return null;
      }
    }

    function writeVisitorNotificationState(fingerprint, timestamp) {
      try {
        localStorage.setItem(VISITOR_NOTIFICATION_STATE_KEY, JSON.stringify({ fingerprint, lastSentAt: timestamp }));
      } catch (err) {
        // Ignore storage failures and still keep session-level throttling.
      }
    }

    function shouldSendVisitorNotification(now) {
      if (sessionStorage.getItem(VISITOR_NOTIFICATION_FLAG) === "true") return false;

      const state = readVisitorNotificationState();
      const fingerprint = getDeviceFingerprint();
      if (!state) return true;
      if (state.fingerprint !== fingerprint) return true;
      return now.getTime() - Number(state.lastSentAt || 0) >= VISITOR_NOTIFICATION_WINDOW_MS;
    }

    async function getVisitorLocation() {
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 7000,
              maximumAge: 0
            });
          });

          return `Lat ${position.coords.latitude.toFixed(4)}, Lng ${position.coords.longitude.toFixed(4)}`;
        } catch (err) {
          // Fall back to IP-based lookup below.
        }
      }

      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Location lookup failed");
        const data = await response.json();
        const parts = [data.city, data.region, data.country_name].filter(Boolean);
        return parts.length ? parts.join(", ") : "Location unavailable";
      } catch (err) {
        return "Location unavailable";
      }
    }

    async function sendVisitorNotification() {
      if (!window.emailjs || !EMAILJS_SERVICE_ID || !EMAILJS_VISITOR_TEMPLATE_ID) return;

      const now = new Date();
      if (!shouldSendVisitorNotification(now)) return;

      const madagascarDate = getMadagascarDate(now);
      const visitorIp = await getVisitorIp();
      const visitorLocation = await getVisitorLocation();
      const browserOs = detectBrowserAndOs(navigator.userAgent);
      const deviceType = detectDeviceType(navigator.userAgent);
      const referrer = document.referrer || "Not available";

      const templateParams = {
        subject: "Someone just visited your portfolio",
        visit_date: formatDateTime(now),
        visit_time_madagascar: `${formatDateTime(madagascarDate)} (UTC+3)`,
        visitor_ip: visitorIp,
        visitor_location: visitorLocation,
        browser_os: browserOs,
        device_type: deviceType,
        referrer,
        to_email: "tsonyraf@gmail.com",
        message: `A visitor opened the portfolio at ${formatDateTime(now)}.\nLocation: ${visitorLocation}`
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_VISITOR_TEMPLATE_ID, templateParams);
        sessionStorage.setItem(VISITOR_NOTIFICATION_FLAG, "true");
        writeVisitorNotificationState(getDeviceFingerprint(), now.getTime());
      } catch (err) {
        console.warn("Visitor notification failed", err);
      }
    }

    async function sendDownloadNotification(fileName) {
      if (!window.emailjs || !EMAILJS_SERVICE_ID || !EMAILJS_DOWNLOAD_TEMPLATE_ID) return;

      const now = new Date();
      const browserOs = detectBrowserAndOs(navigator.userAgent);
      const deviceType = detectDeviceType(navigator.userAgent);

      const templateParams = {
        subject: "New Resume Download – Portfolio",
        download_date: formatDateTime(now),
        file_name: fileName,
        browser_os: browserOs,
        device_type: deviceType,
        to_email: "tsonyraf@gmail.com",
        message: `Resume download started for ${fileName} at ${formatDateTime(now)}.`
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_DOWNLOAD_TEMPLATE_ID, templateParams);
      } catch (err) {
        console.warn("Resume download notification failed", err);
      }
    }

    function initResumeDownloadTracking() {
      const resumeLinks = document.querySelectorAll('a[download][href$="resume.pdf"]');
      if (!resumeLinks.length) return;

      resumeLinks.forEach(link => {
        const fileName = link.getAttribute("download") || link.getAttribute("href").split("/").pop() || "resume.pdf";
        link.addEventListener("click", (event) => {
          sendDownloadNotification(fileName);
        });
      });
    }

    initResumeDownloadTracking();

    if (sessionStorage.getItem(VISITOR_NOTIFICATION_FLAG) !== "true") {
      sendVisitorNotification();
    }

    const form = document.getElementById("contactForm");
    if (!form) return;

    const nameInput = document.getElementById("fname");
    const emailInput = document.getElementById("femail");
    const subjectInput = document.getElementById("fsubject");
    const msgInput = document.getElementById("fmsg");
    const nameError = document.getElementById("fnameError");
    const emailError = document.getElementById("femailError");
    const subjectError = document.getElementById("fsubjectError");
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
      if (subjectInput.value.trim().length < 3) {
        setError(subjectInput, subjectError, "Please enter a subject.");
        valid = false;
      } else {
        setError(subjectInput, subjectError, "");
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
            subject: subjectInput.value.trim(),
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
