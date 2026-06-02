/* =========================
   DOM Element References
   Purpose: Store the page elements used by the interactions below.
========================= */
const revealItems = document.querySelectorAll(
  ".service-card, .stat-box, .work-card, .cta-section, .footer-column"
);
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navMenu = document.querySelector(".nav-menu");
const navActions = document.querySelector(".nav-actions");
const navOverlay = document.querySelector(".nav-overlay");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterInput = document.querySelector(".newsletter-form input");
const newsletterMessage = document.querySelector(".newsletter-message");
const loader = document.querySelector("#loader");
const counters = document.querySelectorAll(".counter");
const heroLabel = document.querySelector(".hero-label");
const heroTitle = document.querySelector(".hero-content h1");
const heroText = document.querySelector(".hero-content > p:not(.hero-label)");
const heroButtons = document.querySelectorAll(".hero-actions .btn");

/* =========================
   Page Loader
   Purpose: Hide the loading screen after all page assets are ready.
========================= */
window.addEventListener("load", () => {
  loader?.classList.add("hidden");
});

/* =========================
   Counter Animation
   Purpose: Count each stat number from 0 to its data-target value.
========================= */
counters.forEach((counter) => {
  const target = Number(counter.dataset.target) || 0;
  const speed = 20;
  const increment = Math.max(target / 100, 1);

  const updateCounter = () => {
    const current = Number(counter.textContent) || 0;

    if (current < target) {
      counter.textContent = Math.min(Math.ceil(current + increment), target);
      setTimeout(updateCounter, speed);
      return;
    }

    counter.textContent = target;
  };

  updateCounter();
});

/* =========================
   Anime.js Hero Text
   Purpose: Split hero text into letters/words and animate them in sequence.
========================= */
const splitLetters = (element, className) => {
  const text = element.textContent.trim();
  element.setAttribute("aria-label", text);
  element.textContent = "";

  Array.from(text).forEach((character) => {
    const span = document.createElement("span");
    span.className = className;
    span.setAttribute("aria-hidden", "true");
    span.textContent = character === " " ? "\u00a0" : character;
    element.appendChild(span);
  });
};

const splitWords = (element, className) => {
  const text = element.textContent.trim().replace(/\s+/g, " ");
  element.setAttribute("aria-label", text);
  element.textContent = "";

  text.split(" ").forEach((word, index, words) => {
    const span = document.createElement("span");
    span.className = className;
    span.setAttribute("aria-hidden", "true");
    span.textContent = word;
    element.appendChild(span);

    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });
};

if (window.anime && heroLabel && heroTitle && heroText) {
  heroTitle.classList.add("hero-title");
  heroText.classList.add("hero-text");

  splitLetters(heroLabel, "letter");
  splitLetters(heroTitle, "letter");
  splitWords(heroText, "word");

  anime.set(".hero-label .letter, .hero-title .letter, .hero-text .word, .hero-actions .btn", {
    opacity: 0
  });

  anime
    .timeline({ easing: "easeOutExpo" })
    .add({
      targets: ".hero-label .letter",
      translateY: [18, 0],
      opacity: [0, 1],
      delay: anime.stagger(22)
    })
    .add(
      {
        targets: ".hero-title .letter",
        translateY: [80, 0],
        rotateX: [-90, 0],
        opacity: [0, 1],
        duration: 900,
        delay: anime.stagger(28)
      },
      "-=120"
    )
    .add(
      {
        targets: ".hero-text .word",
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 650,
        delay: anime.stagger(45)
      },
      "-=360"
    )
    .add(
      {
        targets: heroButtons,
        translateY: [24, 0],
        scale: [0.94, 1],
        opacity: [0, 1],
        duration: 620,
        delay: anime.stagger(120)
      },
      "-=260"
    );
}

/* =========================
   Mobile Navigation
   Purpose: Open and close the mobile menu, action buttons, and overlay.
========================= */
if (navToggle && navPanel && navMenu && navActions && navOverlay) {
  const setNavState = (isOpen) => {
    navPanel.classList.toggle("active", isOpen);
    navMenu.classList.toggle("active", isOpen);
    navActions.classList.toggle("active", isOpen);
    navOverlay.classList.toggle("active", isOpen);

    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.innerHTML = isOpen
      ? '<i class="fas fa-xmark"></i>'
      : '<i class="fas fa-bars"></i>';
  };

  navToggle.addEventListener("click", () => {
    setNavState(!navMenu.classList.contains("active"));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });

  navOverlay.addEventListener("click", () => setNavState(false));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      setNavState(false);
    }
  });
}

/* =========================
   Scroll Reveal Animation
   Purpose: Reveal cards and footer columns when they enter the viewport.
========================= */
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("show"));
}

/* =========================
   Newsletter Form
   Purpose: Validate email before showing a success or error message.
========================= */
if (newsletterForm && newsletterInput && newsletterMessage) {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const showNewsletterMessage = (message, type) => {
    newsletterMessage.textContent = message;
    newsletterMessage.className = `newsletter-message ${type}`;
  };

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = newsletterInput.value.trim();

    if (!isValidEmail(email)) {
      showNewsletterMessage("Please enter a valid email address.", "error");
      newsletterInput.focus();
      return;
    }

    showNewsletterMessage("Your email has been submitted successfully.", "success");
    newsletterForm.reset();
  });
}
