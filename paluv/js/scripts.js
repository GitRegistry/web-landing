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
