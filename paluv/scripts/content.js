const SHARED = {
  organizationName: "Paluv UG",
  siteUrl: "https://paluv.de",
  logoUrl: "https://paluv.de/assets/paluvlogo.png",
  socialImageUrl: "https://paluv.de/assets/paluv-og-v2.jpg",
  heroImage: "/assets/paluv-hero-v2.webp",
  generalEmail: "hello@paluv.de",
  businessEmail: "partner@paluv.de",
  analyticsScript: "https://analytics.misei.dev/script.js",
  fontsHref:
    "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
  assetVersion: "20260728-paluv-v3",
  year: "2026",
};

const HOME_CONTENT = {
  en: {
    htmlLang: "en",
    locale: "en_US",
    alternateLocale: "de_DE",
    title: "Paluv | Software, IT Systems & Aviation Technology",
    description:
      "Paluv is a technology company building software, IT systems and digital products, with a current focus on aviation, ATOs, aeroclubs and operators.",
    ogImageAlt: "General aviation aircraft on the apron at sunrise",
    nav: {
      home: "Home",
      partners: "Collaborators",
      products: "Products",
      services: "Services",
      contact: "Contact",
      menu: "Menu",
      languageSwitch: "Language selector",
    },
    hero: {
      eyebrow: "Technology · Software · Aviation",
      title: "Technology for real operations.",
      subtitle:
        "Paluv is a technology company focused on software and IT. Today, we apply that expertise to aviation, building systems and products for the organizations that keep aircraft moving.",
      primaryCta: "Start a project",
      secondaryCta: "Explore our work",
      meta: [
        { label: "Core", value: "Software · IT · Digital products" },
        { label: "Current focus", value: "Aviation" },
        { label: "Built for", value: "ATOs · Aeroclubs · Operators" },
      ],
    },
    promise: {
      eyebrow: "Our point of view",
      title: "We build technology first. Aviation is where we put it to work today.",
      text:
        "From software platforms and ERP systems to connected products, we combine engineering with operational understanding to make complex work simpler.",
      points: ["Software & IT", "Operational systems", "Aviation focus"],
    },
    sections: {
      products: {
        title: "Products",
        itemLabel: "Paluv product",
      },
      services: {
        title: "Technology that solves operational problems.",
        subtitle:
          "We design, build and operate focused software systems. Aviation is our current domain, but solid technology is the foundation of every engagement.",
      },
      partners: {
        title: "Technology is a partnership.",
        subtitle:
          "We work closely with organizations that lead in pilot training, qualification and hospitality, supported by a strong regional aviation network.",
      },
    },
    products: [
      {
        image: "/assets/kopi/heroSection.png",
        width: "1248",
        height: "832",
        imageAlt: "Kopi portable avionics companion hardware in use",
        title: "Kopi",
        description:
          "A portable all-in-one avionics companion for traffic awareness with ADS-B and ADS-L.",
        tag: "Hardware · Avionics",
        cta: "Discover Kopi",
        href: "https://kopi.paluv.de",
      },
      {
        image: "/assets/pilotary/mockup.jpeg",
        width: "5976",
        height: "3984",
        imageAlt: "Pilotary shared-flight marketplace shown on a phone during a flight",
        title: "Pilotary",
        description:
          "A German-first marketplace for discovering and coordinating shared private flights.",
        tag: "Platform · Community",
        cta: "Discover Pilotary",
        href: "https://pilotary.de",
      },
      {
        visual: "airevor",
        imageAlt: "AireVOR aircraft ERP fleet management dashboard",
        title: "AireVOR",
        description:
          "An aircraft ERP for ATOs and aeroclubs, unifying fleet availability, maintenance, documents, scheduling and daily operations.",
        tag: "ERP · Fleet management",
        cta: "Talk to us about AireVOR",
        href: "#contact",
      },
    ],
    services: [
      {
        index: "01",
        icon: "software",
        title: "Software engineering",
        description:
          "Custom web platforms, applications, ERP systems and portals built around the way your organization actually works.",
        tag: "Applications · Platforms · ERP",
      },
      {
        index: "02",
        icon: "automation",
        title: "IT & automation",
        description:
          "Integrations, cloud infrastructure and automated workflows that connect data, teams and operational processes.",
        tag: "Integrations · Cloud · Workflows",
      },
      {
        index: "03",
        icon: "aviation",
        title: "Aviation systems",
        description:
          "Purpose-built digital tools for aircraft, training records, academy operations, aeroclubs and pilot services.",
        tag: "Aircraft · Training · Operations",
      },
      {
        index: "04",
        icon: "product",
        title: "Digital products",
        description:
          "Product strategy, interface design and connected experiences taken from a clear idea to a dependable release.",
        tag: "Strategy · UX · Delivery",
      },
    ],
    partners: {
      kicker: "Technology partnerships",
      summary: "Paluv works as a technology partner, not simply a supplier.",
      premiumLabel: "Technology partners",
      premiumTitle: "We are the technology partner for organizations that set the standard.",
      networkLabel: "Regional network",
      networkTitle: "Connected by technology, aviation and Speyer.",
      premium: [
        {
          id: "fas",
          name: "Flight Academy Speyer",
          logo: "/assets/collaborators/fas-512.png",
          logoAlt: "Flight Academy Speyer",
          category: "Pilot training",
          status: "Technology partner",
          statement:
            "An officially authorised training organisation with more than 200 pilot students, guiding careers from ground school and first licences through commercial and airline pilot training.",
          href: "https://www.flightacademy-speyer.de/",
        },
        {
          id: "skymentor",
          name: "SkyMentor Aviation",
          logo: "/assets/collaborators/skymentor.png",
          logoAlt: "SkyMentor Aviation",
          category: "Pilot qualification",
          status: "Technology partner",
          statement:
            "A recognised aviation training provider for BZF and AZF radio licences plus ICAO language proficiency examinations accepted throughout EASA states.",
          href: "https://skymentor.de/",
        },
        {
          id: "donello",
          name: "Donello",
          logo: "/assets/collaborators/donello.svg",
          logoAlt: "Donello am Yachthafen",
          category: "Hospitality",
          status: "Technology partner",
          statement:
            "A highly regarded Italian restaurant at Speyer marina, combining Mediterranean cuisine, wine, events and waterfront hospitality.",
          href: "https://donello-speyer.de/",
        },
      ],
      network: [
        {
          id: "fsl",
          name: "Flugplatz Speyer/Ludwigshafen",
          logo: "/assets/collaborators/fsl.jpeg",
          logoAlt: "Flugplatz Speyer Ludwigshafen",
          category: "Aviation infrastructure",
          status: "Regional network",
          statement:
            "A modern regional airfield for business and private aviation in the Rhine-Neckar metropolitan region, and the operational home of our aviation network.",
          href: "https://flugplatz-speyer.de/",
        },
        {
          id: "technik-museum",
          name: "Technik Museum Speyer",
          logo: "/assets/collaborators/technik-museum-speyer.png",
          logoAlt: "Technik Museum Speyer",
          category: "Technology & aviation culture",
          status: "Regional network",
          statement:
            "A major technology museum bringing aviation and spaceflight history to life through more than 70 aircraft and helicopters, the Boeing 747 and Space Shuttle Buran.",
          href: "https://www.technik-museum.de/en/",
        },
      ],
    },
    contact: {
      eyebrow: "Let’s build",
      title: "Have a technology challenge in mind?",
      subtitle:
        "Tell us what you are working on. We will respond with a practical next step, usually within two working days.",
      directLabel: "Prefer email?",
      directCta: "Write to hello@paluv.de",
      fields: {
        name: "Name",
        email: "Email",
        message: "Message",
      },
      placeholders: {
        name: "Your name",
        email: "you@email.com",
        message: "What should we solve together?",
      },
      submit: "Send inquiry",
      sending: "Sending your inquiry…",
      success: "Thank you. Your message is on its way. We will reply soon.",
      error: "That did not work. Please try again or email us directly.",
    },
    map: {
      eyebrow: "Where aviation meets",
      title: "Rooted in Speyer.",
      caption:
        "Our network starts at Speyer Airport (EDRY) and reaches pilots, operators and partners throughout Europe.",
      link: "Open Speyer Airport on OpenStreetMap",
    },
    footer: {
      privacy: "Privacy (GDPR)",
      imprint: "Imprint",
      statement: "Software and IT systems, currently focused on aviation.",
    },
  },
  de: {
    htmlLang: "de",
    locale: "de_DE",
    alternateLocale: "en_US",
    title: "Paluv | Software, IT-Systeme & Aviation Technology",
    description:
      "Paluv ist ein Technologieunternehmen für Software, IT-Systeme und digitale Produkte, mit aktuellem Fokus auf Aviation, ATOs, Aeroclubs und Betreiber.",
    ogImageAlt: "General-Aviation-Flugzeug auf dem Vorfeld bei Sonnenaufgang",
    nav: {
      home: "Start",
      partners: "Kooperationen",
      products: "Produkte",
      services: "Services",
      contact: "Kontakt",
      menu: "Menü",
      languageSwitch: "Sprachauswahl",
    },
    hero: {
      eyebrow: "Technologie · Software · Aviation",
      title: "Technologie für echte Abläufe.",
      subtitle:
        "Paluv ist ein Technologieunternehmen mit Fokus auf Software und IT. Heute bringen wir diese Expertise in die Aviation und entwickeln Systeme und Produkte für Organisationen, die Flugzeuge in Bewegung halten.",
      primaryCta: "Projekt starten",
      secondaryCta: "Unsere Arbeit",
      meta: [
        { label: "Kern", value: "Software · IT · Digitale Produkte" },
        { label: "Aktueller Fokus", value: "Aviation" },
        { label: "Für", value: "ATOs · Aeroclubs · Betreiber" },
      ],
    },
    promise: {
      eyebrow: "Unsere Perspektive",
      title: "Wir bauen zuerst Technologie. Aviation ist heute unser Einsatzgebiet.",
      text:
        "Von Software-Plattformen und ERP-Systemen bis zu vernetzten Produkten verbinden wir Engineering mit operativem Verständnis und machen komplexe Arbeit einfacher.",
      points: ["Software & IT", "Operative Systeme", "Aviation-Fokus"],
    },
    sections: {
      products: {
        title: "Produkte",
        itemLabel: "Paluv Produkt",
      },
      services: {
        title: "Technologie, die operative Probleme löst.",
        subtitle:
          "Wir konzipieren, bauen und betreiben fokussierte Softwaresysteme. Aviation ist unser aktuelles Einsatzgebiet, solide Technologie bildet immer die Grundlage.",
      },
      partners: {
        title: "Technologie ist Partnerschaft.",
        subtitle:
          "Wir arbeiten eng mit Organisationen zusammen, die in Pilotenausbildung, Qualifikation und Hospitality Maßstäbe setzen, getragen von einem starken regionalen Aviation-Netzwerk.",
      },
    },
    products: [
      {
        image: "/assets/kopi/heroSection.png",
        width: "1248",
        height: "832",
        imageAlt: "Tragbarer Kopi-Avionikbegleiter im Einsatz",
        title: "Kopi",
        description:
          "Ein tragbarer All-in-One-Avionikbegleiter für mehr Verkehrsbewusstsein mit ADS-B und ADS-L.",
        tag: "Hardware · Avionik",
        cta: "Kopi entdecken",
        href: "https://kopi.paluv.de",
      },
      {
        image: "/assets/pilotary/mockup.jpeg",
        width: "5976",
        height: "3984",
        imageAlt: "Pilotary-Marktplatz für gemeinsame Flüge auf einem Smartphone während eines Flugs",
        title: "Pilotary",
        description:
          "Ein deutschsprachiger Marktplatz zum Entdecken und Koordinieren gemeinsamer privater Flüge.",
        tag: "Plattform · Community",
        cta: "Pilotary entdecken",
        href: "https://pilotary.de",
      },
      {
        visual: "airevor",
        imageAlt: "AireVOR ERP-Dashboard für das Management einer Flugzeugflotte",
        title: "AireVOR",
        description:
          "Ein Aircraft-ERP für ATOs und Aeroclubs, das Flottenverfügbarkeit, Wartung, Dokumente, Planung und Tagesbetrieb in einem System vereint.",
        tag: "ERP · Flottenmanagement",
        cta: "Über AireVOR sprechen",
        href: "#contact",
      },
    ],
    services: [
      {
        index: "01",
        icon: "software",
        title: "Software Engineering",
        description:
          "Individuelle Web-Plattformen, Anwendungen, ERP-Systeme und Portale, aufgebaut für die tatsächlichen Abläufe Ihrer Organisation.",
        tag: "Anwendungen · Plattformen · ERP",
      },
      {
        index: "02",
        icon: "automation",
        title: "IT & Automation",
        description:
          "Integrationen, Cloud-Infrastruktur und automatisierte Workflows, die Daten, Teams und operative Prozesse verbinden.",
        tag: "Integrationen · Cloud · Workflows",
      },
      {
        index: "03",
        icon: "aviation",
        title: "Aviation-Systeme",
        description:
          "Passgenaue digitale Werkzeuge für Flugzeuge, Trainingsakten, Flugschulbetrieb, Aeroclubs und Pilotenservices.",
        tag: "Flugzeuge · Training · Betrieb",
      },
      {
        index: "04",
        icon: "product",
        title: "Digitale Produkte",
        description:
          "Produktstrategie, Interface Design und vernetzte Erlebnisse, von einer klaren Idee bis zum verlässlichen Release.",
        tag: "Strategie · UX · Delivery",
      },
    ],
    partners: {
      kicker: "Technologiepartnerschaften",
      summary: "Paluv arbeitet als Technologiepartner, nicht nur als Lieferant.",
      premiumLabel: "Technologiepartner",
      premiumTitle: "Wir sind der Technologiepartner für Organisationen, die Maßstäbe setzen.",
      networkLabel: "Regionales Netzwerk",
      networkTitle: "Verbunden durch Technologie, Aviation und Speyer.",
      premium: [
        {
          id: "fas",
          name: "Flight Academy Speyer",
          logo: "/assets/collaborators/fas-512.png",
          logoAlt: "Flight Academy Speyer",
          category: "Pilotenausbildung",
          status: "Technologiepartner",
          statement:
            "Eine offiziell genehmigte Ausbildungsorganisation mit mehr als 200 Flugschülern, von der Theorie und ersten Lizenz bis zur Berufs- und Verkehrspilotenausbildung.",
          href: "https://www.flightacademy-speyer.de/",
        },
        {
          id: "skymentor",
          name: "SkyMentor Aviation",
          logo: "/assets/collaborators/skymentor.png",
          logoAlt: "SkyMentor Aviation",
          category: "Pilotenqualifikation",
          status: "Technologiepartner",
          statement:
            "Ein anerkannter Aviation-Ausbildungsanbieter für BZF- und AZF-Funklizenzen sowie ICAO-Sprachprüfungen, deren Zertifikate in allen EASA-Staaten anerkannt sind.",
          href: "https://skymentor.de/",
        },
        {
          id: "donello",
          name: "Donello",
          logo: "/assets/collaborators/donello.svg",
          logoAlt: "Donello am Yachthafen",
          category: "Hospitality",
          status: "Technologiepartner",
          statement:
            "Ein hoch angesehenes italienisches Restaurant am Yachthafen Speyer, das mediterrane Küche, Wein, Events und Gastlichkeit direkt am Wasser verbindet.",
          href: "https://donello-speyer.de/",
        },
      ],
      network: [
        {
          id: "fsl",
          name: "Flugplatz Speyer/Ludwigshafen",
          logo: "/assets/collaborators/fsl.jpeg",
          logoAlt: "Flugplatz Speyer Ludwigshafen",
          category: "Aviation-Infrastruktur",
          status: "Regionales Netzwerk",
          statement:
            "Ein moderner regionaler Verkehrslandeplatz für Geschäfts- und Privatfliegerei in der Metropolregion Rhein-Neckar und die operative Heimat unseres Aviation-Netzwerks.",
          href: "https://flugplatz-speyer.de/",
        },
        {
          id: "technik-museum",
          name: "Technik Museum Speyer",
          logo: "/assets/collaborators/technik-museum-speyer.png",
          logoAlt: "Technik Museum Speyer",
          category: "Technik- und Aviation-Kultur",
          status: "Regionales Netzwerk",
          statement:
            "Ein bedeutendes Technikmuseum, das Luft- und Raumfahrtgeschichte mit mehr als 70 Flugzeugen und Hubschraubern, der Boeing 747 und dem Space Shuttle Buran erlebbar macht.",
          href: "https://www.technik-museum.de/de/",
        },
      ],
    },
    contact: {
      eyebrow: "Gemeinsam starten",
      title: "Eine Technologie-Herausforderung im Kopf?",
      subtitle:
        "Erzählen Sie uns, woran Sie arbeiten. Wir antworten mit einem pragmatischen nächsten Schritt, in der Regel innerhalb von zwei Werktagen.",
      directLabel: "Lieber per E-Mail?",
      directCta: "An hello@paluv.de schreiben",
      fields: {
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
      },
      placeholders: {
        name: "Ihr Name",
        email: "you@email.com",
        message: "Was dürfen wir gemeinsam lösen?",
      },
      submit: "Anfrage senden",
      sending: "Ihre Anfrage wird gesendet…",
      success: "Vielen Dank. Ihre Nachricht ist unterwegs. Wir melden uns bald.",
      error: "Das hat nicht funktioniert. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.",
    },
    map: {
      eyebrow: "Wo Aviation zusammenkommt",
      title: "Verwurzelt in Speyer.",
      caption:
        "Unser Netzwerk beginnt am Flugplatz Speyer (EDRY) und verbindet Piloten, Betreiber und Partner in ganz Europa.",
      link: "Flugplatz Speyer auf OpenStreetMap öffnen",
    },
    footer: {
      privacy: "Datenschutz",
      imprint: "Impressum",
      statement: "Software und IT-Systeme, aktuell mit Fokus auf Aviation.",
    },
  },
};

const LEGAL_CONTENT = {
  en: {
    nav: {
      home: "Home",
      imprint: "Imprint",
      privacy: "Privacy",
      languageSwitch: "Language selector",
    },
    pages: {
      imprint: {
        pageTitle: "Imprint | Paluv UG",
        metaDescription: "Imprint and provider information for Paluv UG.",
        path: "/en/imprint/",
        alternatePath: "/de/impressum/",
        updatedLabel: "Last updated: April 9, 2026",
        heading: "Imprint",
        note: "The VAT ID, if assigned, will be added once available.",
        sections: [
          {
            title: "Provider",
            paragraphs: [
              "Paluv UG",
              "Bergstraße 1",
              "75236 Kämpfelbach, Germany",
            ],
          },
          {
            title: "Represented by",
            paragraphs: ["Managing directors: Maik Vögele, David Fernández Esteban"],
          },
          {
            title: "Contact",
            paragraphs: [
              'Email: <a href="mailto:hello@paluv.de">hello@paluv.de</a>',
              'Business inquiries: <a href="mailto:partner@paluv.de">partner@paluv.de</a>',
            ],
          },
          {
            title: "Commercial register",
            paragraphs: [
              "Register court: Amtsgericht Mannheim",
              "Registration number: HRB 758033",
            ],
          },
          {
            title: "VAT ID",
            paragraphs: [
              "VAT identification number pursuant to Section 27 a German VAT Act: not yet assigned",
            ],
          },
          {
            title: "Consumer dispute resolution",
            paragraphs: [
              "We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.",
            ],
          },
        ],
      },
      privacy: {
        pageTitle: "Privacy (GDPR) | Paluv UG",
        metaDescription:
          "Shared privacy notice for Paluv UG and the Paluv, Kopi, and Pilotary marketing sites.",
        path: "/en/privacy/",
        alternatePath: "/de/datenschutz/",
        updatedLabel: "Last updated: July 28, 2026",
        heading: "Privacy Notice (GDPR)",
        note: "",
        sections: [
          {
            title: "Controller",
            paragraphs: [
              "Paluv UG",
              "Bergstraße 1",
              "75236 Kämpfelbach, Germany",
              'General privacy inquiries and data protection contact: <a href="mailto:hello@paluv.de">hello@paluv.de</a>',
              'The full provider details are listed in the <a href="/en/imprint/">imprint</a>.',
            ],
          },
          {
            title: "Scope of this notice",
            paragraphs: [
              "This privacy notice applies to the websites <code>paluv.de</code>, <code>kopi.paluv.de</code>, <code>pilotary.paluv.de</code>, <code>pilotary.com</code>, and <code>pilotary.de</code>.",
              "It covers the informational pages, forms, analytics integrations, language preference storage, and embedded content currently implemented on those sites.",
            ],
          },
          {
            title: "Server logs",
            paragraphs: [
              "When you visit the websites, the web server may process IP address, request path, timestamp, status code, referrer, and user agent in server logs to keep the service secure and stable.",
              "Legal basis: Art. 6(1)(f) GDPR.",
            ],
          },
          {
            title: "Contact, waitlist, and newsletter forms",
            paragraphs: [
              "Paluv, Kopi, and Pilotary provide forms that process the data you actively submit, in particular your name, email address, message, and technical transmission metadata.",
              "These forms are used to respond to inquiries, handle pre-contractual communication, and manage product or newsletter interest.",
              "Legal basis: Art. 6(1)(b) GDPR where your request relates to a contract or pre-contractual communication, otherwise Art. 6(1)(f) GDPR.",
            ],
          },
          {
            title: "Mail delivery processor",
            paragraphs: [
              "Form submissions are relayed to <code>mailer.misei.dev</code> for message delivery to Paluv inboxes. The processor receives the message payload and transmission metadata required to send the email.",
            ],
          },
          {
            title: "Analytics",
            paragraphs: [
              "All three websites load the script <code>analytics.misei.dev</code>. Pilotary additionally loads the analytics service <code>cloud.umami.is</code>.",
              "When those scripts run, the respective analytics provider may process technical usage data such as IP-derived information, page views, browser characteristics, referrer, and interaction events.",
            ],
          },
          {
            title: "Language preferences",
            paragraphs: [
              "Paluv stores the selected language in <code>localStorage</code> under <code>paluv-language</code> and in the functional cookie <code>paluv_language</code> for up to one year. The cookie lets the server reopen the site in the chosen language.",
              "Kopi stores your selected language in <code>localStorage</code> under the key <code>langChoice</code> so the site can reopen in your preferred language.",
              "Local-storage values stay in your browser until you clear local storage or overwrite the preference.",
            ],
          },
          {
            title: "Recipients",
            paragraphs: [
              "Depending on the page you use, personal data can be disclosed to the technical providers operating <code>mailer.misei.dev</code>, <code>analytics.misei.dev</code>, and <code>cloud.umami.is</code>.",
            ],
          },
          {
            title: "Storage period",
            paragraphs: [
              "We store personal data only for as long as it is required for the relevant purpose, for follow-up communication, or to satisfy statutory retention obligations.",
            ],
          },
          {
            title: "Your rights",
            paragraphs: [
              "You may request access, rectification, erasure, restriction of processing, data portability, and object to processing where the legal requirements are met.",
              "You also have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.",
            ],
          },
        ],
      },
    },
  },
  de: {
    nav: {
      home: "Start",
      imprint: "Impressum",
      privacy: "Datenschutz",
      languageSwitch: "Sprachauswahl",
    },
    pages: {
      imprint: {
        pageTitle: "Impressum | Paluv UG",
        metaDescription: "Impressum und Anbieterkennzeichnung der Paluv UG.",
        path: "/de/impressum/",
        alternatePath: "/en/imprint/",
        updatedLabel: "Stand: 9. April 2026",
        heading: "Impressum",
        note: "Die Umsatzsteuer-ID wird ergänzt, sobald sie vorliegt.",
        sections: [
          {
            title: "Anbieter",
            paragraphs: [
              "Paluv UG",
              "Bergstraße 1",
              "75236 Kämpfelbach, Deutschland",
            ],
          },
          {
            title: "Vertreten durch",
            paragraphs: ["Geschäftsführer: Maik Vögele, David Fernández Esteban"],
          },
          {
            title: "Kontakt",
            paragraphs: [
              'E-Mail: <a href="mailto:hello@paluv.de">hello@paluv.de</a>',
              'Geschäftsanfragen: <a href="mailto:partner@paluv.de">partner@paluv.de</a>',
            ],
          },
          {
            title: "Handelsregister",
            paragraphs: [
              "Registergericht: Amtsgericht Mannheim",
              "Registernummer: HRB 758033",
            ],
          },
          {
            title: "Umsatzsteuer-ID",
            paragraphs: [
              "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: noch nicht erteilt",
            ],
          },
          {
            title: "Verbraucherstreitbeilegung",
            paragraphs: [
              "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
            ],
          },
        ],
      },
      privacy: {
        pageTitle: "Datenschutz | Paluv UG",
        metaDescription:
          "Gemeinsame Datenschutzhinweise für Paluv UG sowie die Websites von Paluv, Kopi und Pilotary.",
        path: "/de/datenschutz/",
        alternatePath: "/en/privacy/",
        updatedLabel: "Stand: 28. Juli 2026",
        heading: "Datenschutzhinweis",
        note: "",
        sections: [
          {
            title: "Verantwortlicher",
            paragraphs: [
              "Paluv UG",
              "Bergstraße 1",
              "75236 Kämpfelbach, Deutschland",
              'Allgemeine Datenschutzanfragen und Datenschutzkontakt: <a href="mailto:hello@paluv.de">hello@paluv.de</a>',
              'Die vollständigen Anbieterangaben finden sich im <a href="/de/impressum/">Impressum</a>.',
            ],
          },
          {
            title: "Geltungsbereich",
            paragraphs: [
              "Dieser Datenschutzhinweis gilt für die Websites <code>paluv.de</code>, <code>kopi.paluv.de</code>, <code>pilotary.paluv.de</code>, <code>pilotary.com</code> und <code>pilotary.de</code>.",
              "Er erfasst die aktuell implementierten Informationsseiten, Formulare, Analyse-Skripte, lokale Spracheinstellungen und eingebetteten Inhalte dieser Websites.",
            ],
          },
          {
            title: "Server-Logs",
            paragraphs: [
              "Beim Aufruf der Websites kann der Webserver IP-Adresse, angeforderte URL, Zeitstempel, Statuscode, Referrer und User-Agent in Server-Logs verarbeiten, um den sicheren und stabilen Betrieb der Websites zu gewährleisten.",
              "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.",
            ],
          },
          {
            title: "Kontakt-, Waitlist- und Newsletter-Formulare",
            paragraphs: [
              "Auf Paluv, Kopi und Pilotary werden die von dir aktiv eingegebenen Daten verarbeitet, insbesondere Name, E-Mail-Adresse, Nachricht sowie technische Übermittlungsdaten.",
              "Diese Daten werden genutzt, um Anfragen zu beantworten, vorvertragliche Kommunikation zu bearbeiten und Produkt- oder Newsletter-Interesse zu verwalten.",
              "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen oder vorvertraglichen Anfragen, im Übrigen Art. 6 Abs. 1 lit. f DSGVO.",
            ],
          },
          {
            title: "Mail-Versanddienst",
            paragraphs: [
              "Formulareingaben werden zur Zustellung an Paluv-Postfächer an <code>mailer.misei.dev</code> übermittelt. Dabei erhält der Dienst die Nachrichteninhalte und die für den Versand erforderlichen technischen Metadaten.",
            ],
          },
          {
            title: "Analyse-Dienste",
            paragraphs: [
              "Alle drei Websites laden das Skript <code>analytics.misei.dev</code>. Auf Pilotary wird zusätzlich der Dienst <code>cloud.umami.is</code> eingebunden.",
              "Wenn diese Skripte ausgeführt werden, können die jeweiligen Anbieter technische Nutzungsdaten wie IP-bezogene Informationen, Seitenaufrufe, Browsermerkmale, Referrer und Interaktionen verarbeiten.",
            ],
          },
          {
            title: "Sprachpräferenzen",
            paragraphs: [
              "Paluv speichert die gewählte Sprache im <code>localStorage</code> unter <code>paluv-language</code> und für bis zu ein Jahr im funktionalen Cookie <code>paluv_language</code>. Mit dem Cookie kann der Server die Website wieder in der gewählten Sprache öffnen.",
              "Kopi speichert die gewählte Sprache im <code>localStorage</code> unter dem Schlüssel <code>langChoice</code>, damit die Website beim nächsten Besuch direkt in der gewünschten Sprache geöffnet werden kann.",
              "Die Local-Storage-Werte bleiben im Browser gespeichert, bis du den lokalen Speicher löschst oder die Einstellung überschreibst.",
            ],
          },
          {
            title: "Empfänger",
            paragraphs: [
              "Je nach genutzter Seite können personenbezogene Daten an die technischen Anbieter hinter <code>mailer.misei.dev</code>, <code>analytics.misei.dev</code> und <code>cloud.umami.is</code> übermittelt werden.",
            ],
          },
          {
            title: "Speicherdauer",
            paragraphs: [
              "Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck, für Anschlusskommunikation oder zur Erfüllung gesetzlicher Aufbewahrungspflichten erforderlich ist.",
            ],
          },
          {
            title: "Deine Rechte",
            paragraphs: [
              "Du kannst Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch verlangen, soweit die gesetzlichen Voraussetzungen erfüllt sind.",
              "Außerdem hast du das Recht, dich bei einer Aufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat deines gewöhnlichen Aufenthalts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.",
            ],
          },
        ],
      },
    },
  },
};

module.exports = {
  SHARED,
  HOME_CONTENT,
  LEGAL_CONTENT,
};
