export function localizeText(value, locale) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[locale] ?? value?.de ?? value?.en ?? "";
}

export function normalizeLocale(value) {
  return String(value ?? "").toLowerCase().startsWith("en") ? "en" : "de";
}

function formatEventDate(value, locale) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export const uiStrings = {
  de: {
    pageTitle: "Flugplatz Fest & Brazzeltag",
    metaDescription: "Interaktive Karte fuer das Flugplatzfest und den Brazzeltag am 9. und 10. Mai 2026 in Speyer.",
    languageSwitchLabel: "Sprache wechseln",
    footerCredit: "Powered by",
    categories: {
      company: { label: "Firmen" },
      point: { label: "Punkte" },
      service: { label: "Service" },
      entry: { label: "Ein- / Ausgaenge" },
      roundflight: { label: "Rundfluege" },
    },
    sheet: {
      browseTitle: "Eintraege entdecken",
      collapsedHint: "Nach oben wischen oder tippen, um alle Eintraege zu sehen.",
      expandedHint: "Tippe auf einen Eintrag, um ihn zu fokussieren und das Menue wieder zu schliessen.",
      openList: "Oeffnen",
      collapse: "Schliessen",
      events: "Programm",
      places: "Orte",
      call: "Anrufen",
      email: "E-Mail",
      website: "Website",
      program: "Programm",
      backToDetails: "Details",
      eventLocation: "Ort",
      emptyEvents: "Noch keine Programmpunkte eingetragen.",
      emptyState: "Noch keine Eintraege in dieser Kategorie.",
    },
    status: {
      loading: "Karte wird geladen ...",
      error: "Die Fest-Map-Daten konnten nicht geladen werden.",
    },
  },
  en: {
    pageTitle: "Flugplatz Fest & Brazzeltag",
    metaDescription: "Interactive map for Flugplatzfest and Brazzeltag on May 9 and 10, 2026 in Speyer.",
    languageSwitchLabel: "Change language",
    footerCredit: "Powered by",
    categories: {
      company: { label: "Company" },
      point: { label: "Points" },
      service: { label: "Service" },
      entry: { label: "Entry / Exit" },
      roundflight: { label: "Roundflights" },
    },
    sheet: {
      browseTitle: "Browse entries",
      collapsedHint: "Swipe up or tap to show the full list.",
      expandedHint: "Tap an entry to focus it and collapse the menu again.",
      openList: "Open",
      collapse: "Collapse",
      events: "Events",
      places: "Places",
      call: "Call",
      email: "Email",
      website: "Website",
      program: "Timetable",
      backToDetails: "Details",
      eventLocation: "Location",
      emptyEvents: "No timetable entries yet.",
      emptyState: "No entries in this category yet.",
    },
    status: {
      loading: "Loading map ...",
      error: "The Fest Map data could not be loaded.",
    },
  },
};

export function localizeEntities(entities, locale) {
  const normalizedLocale = normalizeLocale(locale);

  return entities.map((entity) => ({
    id: entity.id,
    type: entity.type,
    markerKind: entity.markerKind,
    markerLabel: entity.markerLabel,
    markerTone: entity.markerTone,
    coordinates: entity.coordinates,
    website: entity.website,
    phone: entity.phone,
    email: entity.email,
    image: entity.image ?? entity.logo,
    useLogoMarker: Boolean(entity.useLogoMarker),
    name: localizeText(entity.name, normalizedLocale),
    location: localizeText(entity.location, normalizedLocale),
    summary: localizeText(entity.summary, normalizedLocale),
    description: localizeText(entity.description, normalizedLocale),
  }));
}

export function localizeEvents(events, locale) {
  const normalizedLocale = normalizeLocale(locale);

  return events
    .map((event) => ({
      id: event.id,
      date: event.date,
      dateLabel: formatEventDate(event.date, normalizedLocale),
      time: event.time,
      locationEntryId: event.locationEntryId,
      title: localizeText(event.title, normalizedLocale),
      description: localizeText(event.description, normalizedLocale),
    }))
    .sort((left, right) => {
      const leftKey = `${left.date ?? ""} ${left.time ?? ""}`;
      const rightKey = `${right.date ?? ""} ${right.time ?? ""}`;
      return leftKey.localeCompare(rightKey);
    });
}
