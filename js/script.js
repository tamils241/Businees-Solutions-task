const revealItems = document.querySelectorAll(
  ".service-card, .stat-box, .work-card, .cta-section, .footer-column"
);
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navActions = document.querySelector(".nav-actions");
const navOverlay = document.querySelector(".nav-overlay");
const newsletterForm = document.querySelector(".newsletter-form");

if (navToggle && navMenu && navActions && navOverlay) {
  const closeNav = () => {
    navMenu.classList.remove("active");
    navActions.classList.remove("active");
    navOverlay.classList.remove("active");
    navToggle.setAttribute("aria-label", "Open navigation");
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("active");

    if (isOpen) {
      closeNav();
      return;
    }

    navMenu.classList.add("active");
    navActions.classList.add("active");
    navOverlay.classList.add("active");
    navToggle.setAttribute("aria-label", "Close navigation");
    navToggle.innerHTML = '<i class="fas fa-xmark"></i>';
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  navOverlay.addEventListener("click", closeNav);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => {
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("show");
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterForm.reset();
  });
}
