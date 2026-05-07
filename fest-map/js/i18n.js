export function localizeText(value, locale) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[locale] ?? value?.de ?? value?.en ?? "";
}

export function normalizeLocale(value) {
  return String(value ?? "").toLowerCase().startsWith("en") ? "en" : "de";
}

export const uiStrings = {
  de: {
    pageTitle: "Flugplatz Fest & Brazzeltag",
    metaDescription: "Interaktive Karte fuer das Flugplatzfest und den Brazzeltag am 9. und 10. Mai 2026 in Speyer.",
    languageSwitchLabel: "Sprache wechseln",
    footerCredit: "Powered by",
    categories: {
      all: { label: "Alle" },
      building: { label: "Gebaeude" },
      area: { label: "Bereiche" },
      service: { label: "Services" },
      entry: { label: "Ein- / Ausgaenge" },
    },
    sheet: {
      browseTitle: "Eintraege entdecken",
      collapsedHint: "Nach oben wischen oder tippen, um alle Eintraege zu sehen.",
      expandedHint: "Tippe auf einen Eintrag, um ihn zu fokussieren und das Menue wieder zu schliessen.",
      openList: "Oeffnen",
      collapse: "Schliessen",
      events: "Events",
      places: "Places",
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
      all: { label: "All" },
      building: { label: "Buildings" },
      area: { label: "Areas" },
      service: { label: "Services" },
      entry: { label: "Entries" },
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
      time: event.time,
      locationEntryId: event.locationEntryId,
      title: localizeText(event.title, normalizedLocale),
      description: localizeText(event.description, normalizedLocale),
    }))
    .sort((left, right) => String(left.time ?? "").localeCompare(String(right.time ?? "")));
}
