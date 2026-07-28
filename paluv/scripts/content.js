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
  assetVersion: "20260728-paluv-v2",
  year: "2026",
};

const HOME_CONTENT = {
  en: {
    htmlLang: "en",
    locale: "en_US",
    alternateLocale: "de_DE",
    title: "Paluv | Aviation Software, Pilot Products & Operations",
    description:
      "Paluv builds aviation software, pilot products and operational services for general aviation, flight schools and aviation partners across Europe.",
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
      eyebrow: "Aviation · Software · Operations",
      title: "Built for people who fly.",
      subtitle:
        "Paluv turns real general-aviation experience into focused software, connected products and dependable operational services.",
      primaryCta: "Start a project",
      secondaryCta: "Explore our work",
      meta: [
        { label: "Home base", value: "Speyer · Germany" },
        { label: "For", value: "Pilots · Operators · Academies" },
        { label: "Working across", value: "Software · Products · Services" },
      ],
    },
    promise: {
      eyebrow: "From the cockpit out",
      title: "Technology should make aviation feel simpler — not more complicated.",
      text:
        "We combine product thinking, engineering and operational perspective to create tools that earn their place in everyday flying.",
      points: ["Pilot-first", "General aviation", "Built in Germany"],
    },
    sections: {
      products: {
        title: "Products",
      },
      services: {
        title: "One aviation partner. Four capabilities.",
        subtitle:
          "From the first workflow sketch to delivery in the field, Paluv connects digital work with the operational reality around it.",
      },
      partners: {
        title: "Better aviation is collaborative.",
        subtitle:
          "We work with flight schools, service teams, technical specialists and selected regional partners around Speyer.",
      },
    },
    products: [
      {
        image: "/assets/kopi/heroSection.png",
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
        imageAlt: "Pilotary shared-flight marketplace shown on a phone during a flight",
        title: "Pilotary",
        description:
          "A German-first marketplace for discovering and coordinating shared private flights.",
        tag: "Platform · Community",
        cta: "Discover Pilotary",
        href: "https://pilotary.de",
      },
    ],
    services: [
      {
        index: "01",
        title: "Aviation software",
        description:
          "Focused portals, workflow tools and custom systems for operators, flight schools and pilot communities.",
        tag: "Product design · Engineering",
      },
      {
        index: "02",
        title: "Supply & commerce",
        description:
          "Pilot retail and B2B distribution for oils, parts and practical aviation supply-chain support.",
        tag: "Retail · Distribution",
      },
      {
        index: "03",
        title: "Pilot services",
        description:
          "Insurance, assistance and pilot support designed around real operations and real flying.",
        tag: "Insurance · Assistance",
      },
      {
        index: "04",
        title: "Brand & merchandise",
        description:
          "Thoughtful merchandise, customization and brand delivery for clubs, academies, events and partners.",
        tag: "Brand systems · Production",
      },
    ],
    partners: {
      kicker: "Our network",
      summary: "A growing network rooted at Speyer Airport and connected across general aviation.",
      items: [
        {
          id: "fas",
          name: "Flight Academy Speyer",
          logo: "/assets/collaborators/fas-512.png",
          logoAlt: "FAS logo",
          category: "Flight academy",
          status: "Collaboration",
          services:
            "Pilot onboarding journeys, training workflow software, student communication, and academy-facing digital services.",
          note: "Training and aviation education collaboration.",
        },
        {
          id: "fsl",
          name: "FSL",
          logo: "/assets/collaborators/fsl.jpeg",
          logoAlt: "FSL logo",
          category: "Flight services",
          status: "Collaboration",
          services:
            "Operational tools, process automation, lightweight portals, and aviation-specific service design for daily workflows.",
          note: "Operations and aviation service collaboration.",
        },
        {
          id: "skymentor",
          name: "Skymentor",
          logo: "/assets/collaborators/skymentor.png",
          logoAlt: "Skymentor logo",
          category: "Pilot ecosystem",
          status: "Collaboration",
          services:
            "Pilot-facing services, digital workflows, and aviation community support.",
          note: "Pilot network and ecosystem collaboration.",
        },
        {
          id: "technim",
          name: "Technim",
          logo: "/assets/collaborators/technim.png",
          logoAlt: "Technim logo",
          category: "Technical partner",
          status: "Collaboration",
          services:
            "Technical collaboration for aviation-adjacent systems, operations, and delivery support.",
          note: "Technical ecosystem collaboration.",
        },
        {
          id: "donello",
          name: "Donello",
          logoText: "donello",
          category: "Regional hospitality partner",
          status: "Speyer partner",
          services:
            "A selected hospitality partner for the Paluv and Flight Academy Speyer network, located directly at Speyer marina.",
          note: "Italian and mediterranean cuisine by the water, a few minutes from Speyer Cathedral.",
          href: "https://donello-speyer.de",
        },
      ],
    },
    contact: {
      eyebrow: "Let’s build",
      title: "Have an aviation challenge in mind?",
      subtitle:
        "Tell us what you are working on. We will respond with a practical next step — usually within two working days.",
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
      success: "Thank you — your message is on its way. We will reply soon.",
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
      statement: "Aviation products and services, built from the cockpit out.",
    },
  },
  de: {
    htmlLang: "de",
    locale: "de_DE",
    alternateLocale: "en_US",
    title: "Paluv | Luftfahrtsoftware, Piloten-Produkte & Services",
    description:
      "Paluv entwickelt Luftfahrtsoftware, Piloten-Produkte und operative Services für General Aviation, Flugschulen und Aviation-Partner in Europa.",
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
      eyebrow: "Aviation · Software · Operations",
      title: "Für Menschen, die fliegen.",
      subtitle:
        "Paluv übersetzt echte Erfahrung aus der General Aviation in fokussierte Software, vernetzte Produkte und verlässliche operative Services.",
      primaryCta: "Projekt starten",
      secondaryCta: "Unsere Arbeit",
      meta: [
        { label: "Homebase", value: "Speyer · Deutschland" },
        { label: "Für", value: "Piloten · Betreiber · Flugschulen" },
        { label: "Bereiche", value: "Software · Produkte · Services" },
      ],
    },
    promise: {
      eyebrow: "Aus dem Cockpit gedacht",
      title: "Technologie sollte Luftfahrt einfacher machen — nicht komplizierter.",
      text:
        "Wir verbinden Produktdenken, Engineering und operative Perspektive zu Werkzeugen, die sich ihren Platz im fliegerischen Alltag verdienen.",
      points: ["Pilotenfokus", "General Aviation", "Entwickelt in Deutschland"],
    },
    sections: {
      products: {
        title: "Produkte",
      },
      services: {
        title: "Ein Aviation-Partner. Vier Kompetenzen.",
        subtitle:
          "Vom ersten Workflow bis zur Umsetzung im Feld verbindet Paluv digitale Arbeit mit der operativen Realität.",
      },
      partners: {
        title: "Bessere Luftfahrt entsteht gemeinsam.",
        subtitle:
          "Wir arbeiten mit Flugschulen, Service-Teams, technischen Spezialisten und ausgewählten regionalen Partnern rund um Speyer.",
      },
    },
    products: [
      {
        image: "/assets/kopi/heroSection.png",
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
        imageAlt: "Pilotary-Marktplatz für gemeinsame Flüge auf einem Smartphone während eines Flugs",
        title: "Pilotary",
        description:
          "Ein deutschsprachiger Marktplatz zum Entdecken und Koordinieren gemeinsamer privater Flüge.",
        tag: "Plattform · Community",
        cta: "Pilotary entdecken",
        href: "https://pilotary.de",
      },
    ],
    services: [
      {
        index: "01",
        title: "Aviation Software",
        description:
          "Fokussierte Portale, Workflow-Tools und individuelle Systeme für Betreiber, Flugschulen und Pilot-Communities.",
        tag: "Product Design · Engineering",
      },
      {
        index: "02",
        title: "Supply & Commerce",
        description:
          "Pilotenshop und B2B-Distribution für Öle, Teile und praxisnahen Supply-Chain-Support in der Luftfahrt.",
        tag: "Handel · Distribution",
      },
      {
        index: "03",
        title: "Pilot Services",
        description:
          "Versicherung, Assistance und Pilotensupport für den echten Betrieb und echte Fliegerei.",
        tag: "Versicherung · Support",
      },
      {
        index: "04",
        title: "Brand & Merchandise",
        description:
          "Durchdachtes Merchandise, Individualisierung und Markenrealisierung für Clubs, Flugschulen, Events und Partner.",
        tag: "Markensysteme · Produktion",
      },
    ],
    partners: {
      kicker: "Unser Netzwerk",
      summary: "Ein wachsendes Netzwerk mit Wurzeln am Flugplatz Speyer und Verbindungen in die General Aviation.",
      items: [
        {
          id: "fas",
          name: "Flight Academy Speyer",
          logo: "/assets/collaborators/fas-512.png",
          logoAlt: "FAS Logo",
          category: "Flight Academy",
          status: "Kooperation",
          services:
            "Pilot-Onboarding, Trainings-Workflows, Kommunikation mit Flugschülern und digitale Services für Flugschulen.",
          note: "Kooperation im Bereich Training und Aviation Education.",
        },
        {
          id: "fsl",
          name: "FSL",
          logo: "/assets/collaborators/fsl.jpeg",
          logoAlt: "FSL Logo",
          category: "Flight Services",
          status: "Kooperation",
          services:
            "Operative Tools, Prozessautomatisierung, schlanke Portale und luftfahrtspezifisches Service Design für den Tagesbetrieb.",
          note: "Kooperation im Bereich Operations und Aviation Services.",
        },
        {
          id: "skymentor",
          name: "Skymentor",
          logo: "/assets/collaborators/skymentor.png",
          logoAlt: "Skymentor Logo",
          category: "Piloten-Ökosystem",
          status: "Kooperation",
          services:
            "Pilotennahe Services, digitale Workflows und Unterstützung für Aviation Communities.",
          note: "Kooperation im Piloten- und Aviation-Ökosystem.",
        },
        {
          id: "technim",
          name: "Technim",
          logo: "/assets/collaborators/technim.png",
          logoAlt: "Technim Logo",
          category: "Technischer Partner",
          status: "Kooperation",
          services:
            "Technische Zusammenarbeit für aviation-nahe Systeme, Operations und Delivery Support.",
          note: "Technische Ökosystem-Kooperation.",
        },
        {
          id: "donello",
          name: "Donello",
          logoText: "donello",
          category: "Regionaler Hospitality-Partner",
          status: "Partner in Speyer",
          services:
            "Ausgewählter Hospitality-Partner im Netzwerk von Paluv und der Flight Academy Speyer, direkt am Yachthafen Speyer.",
          note: "Italienisch-mediterrane Küche am Wasser, nur wenige Minuten vom Speyerer Dom.",
          href: "https://donello-speyer.de",
        },
      ],
    },
    contact: {
      eyebrow: "Gemeinsam starten",
      title: "Eine Aviation-Herausforderung im Kopf?",
      subtitle:
        "Erzählen Sie uns, woran Sie arbeiten. Wir antworten mit einem pragmatischen nächsten Schritt — in der Regel innerhalb von zwei Werktagen.",
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
      success: "Vielen Dank — Ihre Nachricht ist unterwegs. Wir melden uns bald.",
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
      statement: "Aviation-Produkte und Services, aus dem Cockpit gedacht.",
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
