document.addEventListener("DOMContentLoaded", () => {
  const topBar = document.querySelector(".top-bar");
  const progress = document.querySelector(".progress-bar");
  const preorderBtn = document.querySelector(".bottom-preorder");
  const revealTargets = document.querySelectorAll(
    "section:not(.hero), .feature-card, .lineup__card, .gallery__item, .screen-card"
  );

  revealTargets.forEach((el) => el.classList.add("section-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((el) => observer.observe(el));

  const scrollLinks = [
    ...document.querySelectorAll('a[href^="#"]'),
    ...document.querySelectorAll("[data-scroll]"),
  ];

  scrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.dataset.scroll || link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  const handleScroll = () => {
    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const ratio = scrollable ? Math.min(1, window.scrollY / scrollable) : 0;

    if (topBar) {
      topBar.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    if (progress) {
      progress.style.transform = `scaleX(${ratio})`;
    }

    if (preorderBtn) {
      const footer = document.getElementById("contact");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const nearFooter = footerTop <= window.innerHeight + 30;
      preorderBtn.classList.toggle("is-hidden", nearFooter);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  const interactive = document.querySelector(".glass-card");
  if (interactive) {
    let frame;
    const resetTilt = () => {
      interactive.style.transform = "rotateX(0) rotateY(0)";
    };

    interactive.addEventListener("mousemove", (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = interactive.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        interactive.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(
          x * 6
        ).toFixed(2)}deg)`;
      });
    });

    interactive.addEventListener("mouseleave", () => {
      cancelAnimationFrame(frame);
      resetTilt();
    });
  }

  const waitlistForms = document.querySelectorAll(".cta__form");
  const lang = document.body.dataset.lang === "de" ? "de" : "en";
  const labels =
    lang === "de"
      ? { sending: "Senden...", success: "Gesendet", error: "Nochmal" }
      : { sending: "Sending...", success: "Sent", error: "Retry" };

  waitlistForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button");
      const messageInput = form.querySelector("input[name='message']");
      const emailInput = form.querySelector("input[name='email']");
      if (!button || !messageInput) return;

      const message = messageInput.value.trim();
      const emailValue = emailInput ? emailInput.value.trim() : "";
      if (!message) {
        messageInput.focus();
        return;
      }

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = labels.sending;

      try {
        const emailMatch = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        const email = emailValue || (emailMatch ? emailMatch[0] : "");
        if (!email) {
          console.warn("CTA submit: no email provided");
        }
        const payload = {
          to: "hello@paluv.de",
          subject: "New lead",
          name: email ? email.split("@")[0] : "Anonymous",
          email,
          message,
        };
        console.info("CTA submit: sending lead", {
          hasEmail: Boolean(email),
          messageLength: message.length,
        });

        const response = await fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.info("CTA submit: response", { status: response.status });
        if (!response.ok) throw new Error("Request failed");
        button.textContent = labels.success;
        messageInput.value = "";
        if (emailInput) emailInput.value = "";
        messageInput.blur();
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 1800);
      } catch (error) {
        console.error("CTA submit: failed", error);
        button.textContent = labels.error;
        button.disabled = false;
      }
    });
  });

  const menuToggle = document.getElementById("menu-toggle");
  const menuOverlay = document.getElementById("menu-overlay");
  const closeMenu = document.querySelector(".menu-overlay__close");
  const menuLinks = document.querySelectorAll("[data-menu-link]");

  const setMenuState = (isOpen) => {
    if (!menuOverlay || !menuToggle) return;
    menuOverlay.classList.toggle("is-open", isOpen);
    menuOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("no-scroll", isOpen);
  };

  const videoModal = document.getElementById("video-modal");
  const videoTriggers = document.querySelectorAll("[data-video-trigger]");
  const videoCloseButtons = videoModal?.querySelectorAll("[data-video-close]") || [];
  const heroVideo = document.getElementById("hero-video");
  const heroVideoSources = heroVideo
    ? Array.from(heroVideo.querySelectorAll("source[data-src]"))
    : [];

  const loadHeroVideo = () => {
    if (!heroVideo || heroVideo.dataset.loaded === "true") return;
    heroVideoSources.forEach((source) => {
      source.src = source.dataset.src || "";
    });
    heroVideo.load();
    heroVideo.dataset.loaded = "true";
  };

  const openVideoModal = () => {
    if (!videoModal) return;
    setMenuState(false);
    loadHeroVideo();
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    if (heroVideo) {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    }
  };

  const closeVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (heroVideo) {
      heroVideo.pause();
    }
  };

  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openVideoModal();
    });
  });

  videoCloseButtons.forEach((button) => {
    button.addEventListener("click", closeVideoModal);
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuOverlay?.classList.contains("is-open");
    setMenuState(!isOpen);
  });
  closeMenu?.addEventListener("click", () => setMenuState(false));
  menuOverlay?.addEventListener("click", (event) => {
    if (event.target === menuOverlay) setMenuState(false);
  });

  menuLinks.forEach((link) =>
    link.addEventListener("click", () => {
      setMenuState(false);
    })
  );

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (videoModal?.classList.contains("is-open")) {
      closeVideoModal();
      return;
    }
    setMenuState(false);
  });

  if (videoModal) {
    openVideoModal();
  }

  const langButtons = document.querySelectorAll(".lang-btn");
  const currentLang =
    document.body.dataset.lang ||
    (window.location.pathname.match(/\/(en|de)(\/|$)/) || [])[1] ||
    null;

  const getBasePath = () => {
    const match = window.location.pathname.match(/^(.*?)(\/(en|de))(\/|$)/);
    if (match && match[1] !== undefined) {
      return match[1].endsWith("/") ? match[1] : match[1] + "/";
    }
    return "/";
  };

  const redirectToLang = (lang) => {
    if (lang !== "en" && lang !== "de") return;
    localStorage.setItem("langChoice", lang);
    const base = getBasePath();
    const target = `${base}${lang}/`;
    if (!window.location.pathname.startsWith(target)) {
      window.location.href = target;
    } else {
      setMenuState(false);
    }
  };

  langButtons.forEach((btn) => {
    const target = btn.dataset.langTarget;
    if (target === currentLang) {
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
    }
    btn.addEventListener("click", () => redirectToLang(target));
  });

  const storyVideo = document.getElementById("story-video");
  if (storyVideo) {
    let direction = 1;
    let reverseFrame = null;
    const ensurePlay = () => storyVideo.play().catch(() => {});

    const startReverse = () => {
      cancelAnimationFrame(reverseFrame);
      storyVideo.pause();
      let prevTimestamp = null;
      const buffer = Math.max(0.1, Math.min(0.35, storyVideo.duration * 0.04));

      const step = (timestamp) => {
        if (prevTimestamp === null) prevTimestamp = timestamp;
        const deltaSeconds = (timestamp - prevTimestamp) / 1000;
        prevTimestamp = timestamp;
        storyVideo.currentTime = Math.max(buffer, storyVideo.currentTime - deltaSeconds);

        if (storyVideo.currentTime <= buffer + 0.01) {
          direction = 1;
          ensurePlay();
          return;
        }
        reverseFrame = requestAnimationFrame(step);
      };

      reverseFrame = requestAnimationFrame(step);
    };

    const handleForwardEnd = () => {
      if (!storyVideo.duration) return;
      const buffer = Math.max(0.1, Math.min(0.35, storyVideo.duration * 0.04));
      if (direction === 1 && storyVideo.currentTime >= storyVideo.duration - buffer) {
        direction = -1;
        startReverse();
      }
    };

    const initVideo = () => {
      const buffer = Math.max(0.1, Math.min(0.35, storyVideo.duration * 0.04 || 0.2));
      storyVideo.currentTime = buffer;
      direction = 1;
      ensurePlay();
    };

    storyVideo.addEventListener("timeupdate", handleForwardEnd);
    if (storyVideo.readyState >= 1) {
      initVideo();
    } else {
      storyVideo.addEventListener("loadedmetadata", initVideo);
    }
  }
});
