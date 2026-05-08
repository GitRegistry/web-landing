(() => {
  const yearTarget = document.getElementById("year");
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (!siteNav.classList.contains("is-open")) return;
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const partnerCards = Array.from(
    document.querySelectorAll("[data-partner-card]")
  );

  if (partnerCards.length > 0) {
    const cardStates = new Map();
    const supportsHover = window.matchMedia("(hover: hover)").matches;

    const setExpanded = (card, expanded) => {
      const button = card.querySelector(".partner-card__button");
      card.classList.toggle("is-active", expanded);
      if (button) {
        button.setAttribute("aria-expanded", String(expanded));
      }
    };

    const closeCards = (exceptCard = null) => {
      partnerCards.forEach((card) => {
        if (card === exceptCard) return;
        const state = cardStates.get(card);
        if (state) {
          state.pinned = false;
        }
        setExpanded(card, false);
      });
    };

    partnerCards.forEach((card) => {
      const button = card.querySelector(".partner-card__button");
      const state = { pinned: false };
      cardStates.set(card, state);

      if (!button) return;

      button.addEventListener("click", () => {
        const shouldPin = !state.pinned || !card.classList.contains("is-active");
        closeCards(card);
        state.pinned = shouldPin;
        setExpanded(card, shouldPin);
      });

      button.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        state.pinned = false;
        setExpanded(card, false);
        button.blur();
      });

      card.addEventListener("focusin", () => {
        if (state.pinned) return;
        closeCards(card);
        setExpanded(card, true);
      });

      card.addEventListener("focusout", (event) => {
        if (state.pinned || card.contains(event.relatedTarget)) return;
        setExpanded(card, false);
      });

      if (supportsHover) {
        card.addEventListener("mouseenter", () => {
          if (state.pinned) return;
          closeCards(card);
          setExpanded(card, true);
        });

        card.addEventListener("mouseleave", () => {
          if (state.pinned) return;
          setExpanded(card, false);
        });
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-partner-card]")) {
        return;
      }
      closeCards();
    });
  }

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (formStatus) {
        formStatus.textContent = "Sending...";
      }

      const formData = new FormData(contactForm);
      const payload = {
        to: "hello@paluv.de",
        subject: "New contact form message",
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        message: String(formData.get("message") || "").trim(),
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
          throw new Error(`Request failed: ${response.status}`);
        }

        if (formStatus) {
          formStatus.textContent = "Message sent. We will reply soon.";
        }
        contactForm.reset();
      } catch (error) {
        console.error(error);
        if (formStatus) {
          formStatus.textContent = "Something went wrong. Please try again.";
        }
      }
    });
  }
})();
