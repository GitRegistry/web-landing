(() => {
  const yearTarget = document.getElementById("year");
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  const header = document.querySelector("[data-site-header]");
  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  const setNavigationOpen = (isOpen) => {
    if (!navToggle || !siteNav) return;
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  };

  navToggle?.addEventListener("click", () => {
    setNavigationOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavigationOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavigationOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteNav?.classList.contains("is-open")) return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest(".site-header")) return;
    setNavigationOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      setNavigationOpen(false);
    }
  });

  document.querySelectorAll("[data-language-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const nextLanguage = link.getAttribute("hreflang");
      if (nextLanguage === "de" || nextLanguage === "en") {
        window.localStorage.setItem("paluv-language", nextLanguage);
        document.cookie = `paluv_language=${nextLanguage};path=/;max-age=31536000;SameSite=Lax`;
      }

      if (window.location.hash) {
        link.hash = window.location.hash;
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  window.clearTimeout(window.__paluvRevealFallback);

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const sendingText = contactForm.dataset.sending || "Sending…";
    const successText =
      contactForm.dataset.success || "Thank you. Your message has been sent.";
    const errorText =
      contactForm.dataset.error || "Something went wrong. Please try again.";

    if (formStatus) {
      formStatus.textContent = sendingText;
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    const payload = {
      to: "hello@paluv.de",
      subject: "New Paluv website inquiry",
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      language: document.documentElement.lang,
    };

    try {
      const response = await fetch("/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      contactForm.reset();
      if (formStatus) {
        formStatus.textContent = successText;
      }
    } catch (error) {
      console.error("Paluv contact form failed", error);
      if (formStatus) {
        formStatus.textContent = errorText;
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
})();
