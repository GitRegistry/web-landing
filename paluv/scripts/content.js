const SHARED = {
  organizationName: "Paluv UG",
  siteUrl: "https://paluv.de",
  logoUrl: "https://paluv.de/assets/PaluvLogoBlack.png",
  logoAltEn: "Paluv UG logo",
  logoAltDe: "Paluv UG Logo",
  generalEmail: "hello@paluv.de",
  businessEmail: "partner@paluv.de",
  analyticsScript: "https://analytics.misei.dev/script.js",
  mapEmbedSrc:
    "https://www.openstreetmap.org/export/embed.html?bbox=8.44167%2C49.29472%2C8.46167%2C49.31472&amp;layer=mapnik&amp;marker=49.30472%2C8.45167",
  fontsHref:
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600;700&family=Sora:wght@300;400;500;600&display=swap",
  year: "2026",
};

const HOME_CONTENT = {
  en: {
    htmlLang: "en",
    locale: "en_US",
    alternateLocale: "de_DE",
    title: "Paluv UG | Aviation Software, Operations Services & Pilot Products",
    description:
      "Paluv UG builds aviation software, operations services, and pilot-first products like Kopi and Pilotary for GA operators, pilots, and flight schools.",
    ogImageAlt: SHARED.logoAltEn,
    loadingText: "Loading model",
    loadingErrorText: "Model failed to load",
    loadingAriaLabel: "Loading 3D model",
    nav: {
      home: "Home",
      products: "Products",
      services: "Services",
      partners: "Partners",
      contact: "Contact",
      menu: "Menu",
      languageSwitch: "Language selector",
    },
    hero: {
      eyebrow: "Software. Operations. Innovation",
      title: "Engineering passion applied to aviation",
      subtitle:
        "We innovate aviation through software excellence, operational services, and pilot-first products. We build the ecosystem operators need.",
      primaryCta: "Contact",
      secondaryCta: "Portfolio",
      meta: [
        { label: "Focus", value: "Pilots · GA Operators · Flight Schools" },
        { label: "Domains", value: "IT-Software · Ops · Supply Chain" },
        { label: "Based", value: "Germany · Europe" },
      ],
    },
    sections: {
      products: {
        title: "Products",
      },
      services: {
        title: "Services",
        subtitle:
          "Four commercial lanes built for pilots, operators, schools, and aviation-facing brands.",
      },
      partners: {
        title: "Partners",
        subtitle:
          "Selected collaborations and ecosystem partners will be published here as they go live.",
      },
    },
    products: [
      {
        image: "/assets/kopi/heroSection.png",
        imageAlt: "Kopi hero section",
        title: "Kopi",
        description: "Portable all-in-one avionics copilot. ADS-B & ADS-L",
        tag: "Product · Crowdfunding",
        cta: "Visit Kopi",
        href: "https://kopi.paluv.de",
      },
      {
        image: "/assets/pilotary/mockup.jpeg",
        imageAlt: "Pilotary hero section",
        title: "Pilotary",
        description: "The first pilot digital wallet community.",
        tag: "App · Ecosystem",
        cta: "Visit Pilotary",
        href: "https://pilotary.de",
      },
    ],
    services: [
      {
        index: "01 · Digital",
        title: "Digital Services",
        description:
          "Custom software, workflow tools, portals, and aviation-first digital systems for operators, flight schools, and pilot communities.",
        tag: "Software · Workflow",
      },
      {
        index: "02 · Commerce",
        title: "Supply & Shop",
        description:
          "B2C pilot webshop and B2B distribution for oils, parts, and aviation supply-chain support.",
        tag: "B2C Shop · B2B Supply",
      },
      {
        index: "03 · Pilots",
        title: "Pilot Services",
        description:
          "Insurance, breakdown assistance, and pilot support services designed around real operations and real flying.",
        tag: "Insurance · Assistance",
      },
      {
        index: "04 · Brand",
        title: "Branding & Merch",
        description:
          "Merchandising, customization, and aviation brand execution for clubs, schools, events, and commercial partners.",
        tag: "Merch · Customization",
      },
    ],
    partners: {
      cardTitle: "Coming soon",
      items: [
        "We are preparing a public partner showcase for training, operations, supply, and pilot services.",
        "Initial collaborations are already in motion and more profiles will be added here soon.",
      ],
    },
    contact: {
      title: "Contact",
      fields: {
        name: "Name",
        email: "Email",
        message: "Message",
      },
      placeholders: {
        name: "Your name",
        email: "you@email.com",
        message: "Tell us about the project",
      },
      submit: "Send message",
    },
    map: {
      title: "Speyer Airport",
      caption: "Speyer Airport (EDRY) · Speyer, Germany",
    },
    footer: {
      privacy: "Privacy (GDPR)",
      imprint: "Imprint",
    },
  },
  de: {
    htmlLang: "de",
    locale: "de_DE",
    alternateLocale: "en_US",
    title: "Paluv UG | Luftfahrtsoftware, operative Services & Pilot-Produkte",
    description:
      "Paluv UG entwickelt Luftfahrtsoftware, operative Services und pilotenzentrierte Produkte wie Kopi und Pilotary für GA-Betreiber, Piloten und Flugschulen.",
    ogImageAlt: SHARED.logoAltDe,
    loadingText: "Modell wird geladen",
    loadingErrorText: "Modell konnte nicht geladen werden",
    loadingAriaLabel: "3D Modell wird geladen",
    nav: {
      home: "Start",
      products: "Produkte",
      services: "Services",
      partners: "Partner",
      contact: "Kontakt",
      menu: "Menu",
      languageSwitch: "Sprachauswahl",
    },
    hero: {
      eyebrow: "Software. Betrieb. Innovation",
      title: "Engineering-Passion für die Luftfahrt",
      subtitle:
        "Wir optimieren die Luftfahrt durch Software operative Services und Produkte für Piloten. Wir schaffen Mehrwert für jeden Piloten und Avionik-Begeisterten.",
      primaryCta: "Kontakt",
      secondaryCta: "Portfolio",
      meta: [
        { label: "Fokus", value: "Piloten · GA-Betreiber · Flugschulen" },
        { label: "Bereiche", value: "IT-Software · Betrieb · Lieferkette" },
        { label: "Standort", value: "Deutschland · Europa" },
      ],
    },
    sections: {
      products: {
        title: "Produkte",
      },
      services: {
        title: "Services",
        subtitle:
          "Vier kommerzielle Bereiche für Piloten, Betreiber, Flugschulen und luftfahrtaffine Marken.",
      },
      partners: {
        title: "Partner",
        subtitle:
          "Ausgewählte Kooperationen und Ecosystem-Partner werden hier veröffentlicht, sobald sie live sind.",
      },
    },
    products: [
      {
        image: "/assets/kopi/heroSection.png",
        imageAlt: "Kopi Hero-Bereich",
        title: "Kopi",
        description: "Tragbarer All-in-One Avionik-Copilot. ADS-B & ADS-L",
        tag: "Produkt · Crowdfunding",
        cta: "Zu Kopi",
        href: "https://kopi.paluv.de",
      },
      {
        image: "/assets/pilotary/mockup.jpeg",
        imageAlt: "Pilotary Hero-Bereich",
        title: "Pilotary",
        description: "Die erste digitale Pilot-Wallet-Community.",
        tag: "App · Ökosystem",
        cta: "Zu Pilotary",
        href: "https://pilotary.de",
      },
    ],
    services: [
      {
        index: "01 · Digital",
        title: "Digital Services",
        description:
          "Individuelle Software, Workflow-Tools, Portale und luftfahrttaugliche Digitalsysteme für Betreiber, Flugschulen und Pilot-Communities.",
        tag: "Software · Workflow",
      },
      {
        index: "02 · Handel",
        title: "Supply & Shop",
        description:
          "B2C-Pilotenshop und B2B-Distribution für Öl, Teile und belastbaren Supply-Chain-Support in der Luftfahrt.",
        tag: "Shop · Distribution",
      },
      {
        index: "03 · Piloten",
        title: "Pilot Services",
        description:
          "Versicherungen, Pannenhilfe und pilotennahe Services, aufgebaut für den echten Betrieb und echte Fliegerei.",
        tag: "Versicherung · Support",
      },
      {
        index: "04 · Marke",
        title: "Branding & Merch",
        description:
          "Merchandising, Customization und Markenauftritte für Clubs, Flugschulen, Events und kommerzielle Partner.",
        tag: "Merch · Branding",
      },
    ],
    partners: {
      cardTitle: "Coming soon",
      items: [
        "Wir bereiten aktuell einen öffentlichen Partnerbereich für Training, Operations, Supply und Pilot Services vor.",
        "Erste Kooperationen laufen bereits, weitere Profile werden hier zeitnah ergänzt.",
      ],
    },
    contact: {
      title: "Kontakt",
      fields: {
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
      },
      placeholders: {
        name: "Ihr Name",
        email: "you@email.com",
        message: "Erzählen Sie uns vom Projekt",
      },
      submit: "Nachricht senden",
    },
    map: {
      title: "Flugplatz Speyer",
      caption: "Flugplatz Speyer (EDRY) · Speyer, Deutschland",
    },
    footer: {
      privacy: "Datenschutz",
      imprint: "Impressum",
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
        note:
          "The commercial register number and the VAT ID, if assigned, will be added once available.",
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
              "Registration number: pending",
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
        updatedLabel: "Last updated: April 9, 2026",
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
            title: "Embedded map on Paluv",
            paragraphs: [
              "The Paluv website embeds map content from OpenStreetMap. When the map loads, OpenStreetMap can receive your IP address, browser metadata, and the page from which the request originated.",
            ],
          },
          {
            title: "Language preference on Kopi",
            paragraphs: [
              "Kopi stores your selected language in <code>localStorage</code> under the key <code>langChoice</code> so the site can reopen in your preferred language.",
              "This value stays in your browser until you clear local storage or overwrite the preference.",
            ],
          },
          {
            title: "Recipients",
            paragraphs: [
              "Depending on the page you use, personal data can be disclosed to the technical providers operating <code>mailer.misei.dev</code>, <code>analytics.misei.dev</code>, <code>cloud.umami.is</code>, and OpenStreetMap.",
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
        note:
          "Die Handelsregisternummer und die Umsatzsteuer-ID werden ergänzt, sobald sie vorliegen.",
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
              "Registernummer: wird nach Eintragung ergänzt",
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
        updatedLabel: "Stand: 9. April 2026",
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
            title: "Eingebettete Karte auf Paluv",
            paragraphs: [
              "Auf der Paluv-Website ist eine Karte von OpenStreetMap eingebettet. Beim Laden der Karte können IP-Adresse, Browser-Metadaten und die aufrufende Seite an OpenStreetMap übertragen werden.",
            ],
          },
          {
            title: "Sprachspeicherung auf Kopi",
            paragraphs: [
              "Kopi speichert die gewählte Sprache im <code>localStorage</code> unter dem Schlüssel <code>langChoice</code>, damit die Website beim nächsten Besuch direkt in der gewünschten Sprache geöffnet werden kann.",
              "Der Wert bleibt im Browser gespeichert, bis du den lokalen Speicher löschst oder die Einstellung überschreibst.",
            ],
          },
          {
            title: "Empfänger",
            paragraphs: [
              "Je nach genutzter Seite können personenbezogene Daten an die technischen Anbieter hinter <code>mailer.misei.dev</code>, <code>analytics.misei.dev</code>, <code>cloud.umami.is</code> und OpenStreetMap übermittelt werden.",
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
