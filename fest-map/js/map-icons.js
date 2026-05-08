const iconMarkup = {
  area: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6h4"></path>
      <path d="M6 6v4"></path>
      <path d="M18 6h-4"></path>
      <path d="M18 6v4"></path>
      <path d="M6 18h4"></path>
      <path d="M6 18v-4"></path>
      <path d="M18 18h-4"></path>
      <path d="M18 18v-4"></path>
    </svg>
  `,
  airplane: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 13 8-2 3-7 2 1-1 6 6 1v2l-6 1 1 6-2 1-3-7-8-2Z"></path>
    </svg>
  `,
  authority: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 6 5v6c0 4 2.5 7 6 10 3.5-3 6-6 6-10V5l-6-2Z"></path>
    </svg>
  `,
  building: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V11l8-6 8 6v9"></path>
      <path d="M8 10h8"></path>
      <path d="M9 20v-5h6v5"></path>
    </svg>
  `,
  club: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.4 5 5.6.8-4 3.9 1 5.6L12 15.6 7 18.3l1-5.6-4-3.9 5.6-.8L12 3Z"></path>
    </svg>
  `,
  drink: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h10v7a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V7Z"></path>
      <path d="M16 8h2a2 2 0 0 1 0 4h-2"></path>
      <path d="M8 4h6"></path>
    </svg>
  `,
  drinks: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h10l-1.2 14H8.2L7 5Z"></path>
      <path d="M8 9h8"></path>
      <path d="M10 3h4"></path>
    </svg>
  `,
  exit: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h8v16H4z"></path>
      <path d="M10 12h10"></path>
      <path d="m17 8 4 4-4 4"></path>
    </svg>
  `,
  flight: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 13 8-2 3-7 2 1-1 6 6 1v2l-6 1 1 6-2 1-3-7-8-2Z"></path>
    </svg>
  `,
  food: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v8"></path>
      <path d="M5 3v5"></path>
      <path d="M9 3v5"></path>
      <path d="M7 11v10"></path>
      <path d="M16 3c1.5 2 1.5 6 0 8"></path>
      <path d="M16 11v10"></path>
    </svg>
  `,
  "ice-cream": `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 10a4 4 0 0 1 8 0"></path>
      <path d="M7 10h10l-5 11-5-11Z"></path>
      <path d="M10 13h4"></path>
    </svg>
  `,
  beer: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h9v12a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V5Z"></path>
      <path d="M16 8h2a2 2 0 0 1 0 4h-2"></path>
      <path d="M9 8h5"></path>
    </svg>
  `,
  coffee: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9h10v4a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V9Z"></path>
      <path d="M16 10h2a2 2 0 0 1 0 4h-2"></path>
      <path d="M8 5v2"></path>
      <path d="M12 5v2"></path>
    </svg>
  `,
  gate: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h16"></path>
      <path d="m8 8-4 4 4 4"></path>
      <path d="m16 8 4 4-4 4"></path>
    </svg>
  `,
  heli: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14"></path>
      <path d="M9 8v8"></path>
      <path d="M15 8v8"></path>
      <path d="M9 12h6"></path>
      <path d="M7 18h10"></path>
    </svg>
  `,
  hub: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 5c-6 0-10 4-10 10 6 0 10-4 10-10Z"></path>
      <path d="M7 17c2-3 5-5 8-6"></path>
    </svg>
  `,
  info: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8"></circle>
      <path d="M12 10v6"></path>
      <circle cx="12" cy="7.5" r="1"></circle>
    </svg>
  `,
  parking: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="3"></rect>
      <path d="M10 16V8h4a2.5 2.5 0 1 1 0 5h-4"></path>
    </svg>
  `,
  "disabled-parking": `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3"></rect>
      <circle cx="11" cy="8" r="1.5"></circle>
      <path d="M11 10v4h4l2 3"></path>
      <path d="M10 13a4 4 0 1 0 4 4"></path>
    </svg>
  `,
  "parking-direction-t": `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14"></path>
      <path d="M12 6v13"></path>
      <path d="M8 19h8"></path>
    </svg>
  `,
  school: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 10 9-4 9 4-9 4-9-4Z"></path>
      <path d="M7 12v4c0 1 2.2 2 5 2s5-1 5-2v-4"></path>
      <path d="M18 11v5"></path>
    </svg>
  `,
  boat: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 13h14l-2 5H7l-2-5Z"></path>
      <path d="M8 13V7l6 3-6 3Z"></path>
      <path d="M4 19c2 1 4 1 6 0 2 1 4 1 6 0 1 .5 2 .7 4 .4"></path>
    </svg>
  `,
  restaurant: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v8"></path>
      <path d="M5 3v5"></path>
      <path d="M9 3v5"></path>
      <path d="M7 11v10"></path>
      <path d="M16 3v18"></path>
      <path d="M16 3c2 1.5 3 4.5 2 8h-2"></path>
    </svg>
  `,
  "first-aid": `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="3"></rect>
      <path d="M12 8v8"></path>
      <path d="M8 12h8"></path>
    </svg>
  `,
  numbered: "",
  submarine: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 14c2-4 12-4 16 0-2 4-12 4-16 0Z"></path>
      <path d="M10 10V7h4v3"></path>
      <circle cx="9" cy="14" r="1"></circle>
      <circle cx="13" cy="14" r="1"></circle>
      <path d="M20 14h2"></path>
    </svg>
  `,
  toilet: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text x="12" y="15" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" font-weight="700">WC</text>
    </svg>
  `,
  wc: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text x="12" y="15" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" font-weight="700">WC</text>
    </svg>
  `,
  "wc-disabled": `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="5" r="2"></circle>
      <path d="M10 8v5h5l3 5"></path>
      <path d="M9 12a5 5 0 1 0 5 5"></path>
    </svg>
  `,
  shop: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9h12l-1 11H7L6 9Z"></path>
      <path d="M9 9a3 3 0 0 1 6 0"></path>
      <path d="M8 13h8"></path>
    </svg>
  `,
  ticket: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14v3a2 2 0 0 0 0 4v3H5v-3a2 2 0 0 0 0-4V8Z"></path>
      <path d="M10 9v10"></path>
    </svg>
  `,
};

const markerToneStyles = {
  eventRed: {
    fill: "#bd282e",
    fillStrong: "#ec5157",
  },
  eventBlue: {
    fill: "#235da8",
    fillStrong: "#4c88d6",
  },
  eventGreen: {
    fill: "#39933f",
    fillStrong: "#65bf68",
  },
  eventPurple: {
    fill: "#6f4ba4",
    fillStrong: "#9670d2",
  },
  eventCyan: {
    fill: "#2f8db5",
    fillStrong: "#61b9dc",
  },
  eventYellow: {
    fill: "#b6a81f",
    fillStrong: "#dfd34a",
  },
  eventPink: {
    fill: "#d91588",
    fillStrong: "#f15aaa",
  },
  eventOrange: {
    fill: "#df8b2c",
    fillStrong: "#f3b25e",
  },
  eventTeal: {
    fill: "#009b8f",
    fillStrong: "#39c4b8",
  },
};

const iconClassByKind = {
  area: "area",
  airplane: "airplane",
  authority: "authority",
  boat: "boat",
  beer: "beer",
  building: "building",
  club: "club",
  coffee: "coffee",
  "disabled-parking": "disabled-parking",
  drink: "drink",
  drinks: "drinks",
  exit: "exit",
  "first-aid": "first-aid",
  flight: "flight",
  food: "food",
  gate: "gate",
  heli: "heli",
  hub: "hub",
  "ice-cream": "ice-cream",
  info: "info",
  numbered: "numbered",
  parking: "parking",
  "parking-direction-t": "parking-direction-t",
  restaurant: "restaurant",
  school: "school",
  shop: "shop",
  submarine: "submarine",
  ticket: "ticket",
  toilet: "toilet",
  wc: "wc",
  "wc-disabled": "wc-disabled",
};

const operationalMarkerKinds = new Set([
  "area",
  "airplane",
  "authority",
  "beer",
  "boat",
  "coffee",
  "disabled-parking",
  "drink",
  "drinks",
  "exit",
  "first-aid",
  "flight",
  "food",
  "gate",
  "ice-cream",
  "numbered",
  "parking",
  "parking-direction-t",
  "restaurant",
  "shop",
  "submarine",
  "ticket",
  "toilet",
  "wc",
  "wc-disabled",
]);

function escapeAttribute(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function normalizeMarkerInput(input) {
  if (input && typeof input === "object") {
    return {
      kind: input.markerKind ?? input.type ?? "info",
      image: input.image,
      markerLabel: input.markerLabel,
      markerTone: input.markerTone,
      useLogoMarker: Boolean(input.useLogoMarker),
      name: input.name,
    };
  }

  return {
    kind: input ?? "info",
    image: "",
    markerLabel: "",
    markerTone: "",
    useLogoMarker: false,
    name: "",
  };
}

export function createEntityMarkerIcon(input, { selected = false } = {}) {
  const entity = normalizeMarkerInput(input);
  const kind = entity.kind;
  const iconKind = iconClassByKind[kind] ?? "info";
  const markerLabel = String(entity.markerLabel ?? "").trim();
  const shouldUseLabel = iconKind === "numbered" || markerLabel;
  const shouldUseLogo = entity.useLogoMarker && entity.image && !shouldUseLabel && !operationalMarkerKinds.has(iconKind);
  const toneStyle = markerToneStyles[entity.markerTone];
  const styleAttribute = toneStyle
    ? ` style="--pin-fill: ${toneStyle.fill}; --pin-fill-strong: ${toneStyle.fillStrong};"`
    : "";
  const markup = shouldUseLogo
    ? `<img class="entity-pin__logo" src="${escapeAttribute(entity.image)}" alt="${escapeAttribute(entity.name ?? "")}">`
    : shouldUseLabel
      ? `<span class="entity-pin__label">${escapeAttribute(markerLabel || iconKind)}</span>`
    : iconMarkup[kind] ?? iconMarkup.info;

  return window.L.divIcon({
    className: "entity-pin-wrapper",
    html: `
      <span class="entity-pin entity-pin--${iconKind}${shouldUseLogo ? " entity-pin--logo" : ""}${shouldUseLabel ? " entity-pin--label" : ""}${selected ? " is-selected" : ""}"${styleAttribute} aria-hidden="true">
        <span class="entity-pin__inner">${markup}</span>
      </span>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 46],
    popupAnchor: [0, -34],
  });
}
