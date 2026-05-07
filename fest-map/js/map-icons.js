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
  toilet: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text x="12" y="15" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" font-weight="700">WC</text>
    </svg>
  `,
};

const iconClassByKind = {
  area: "area",
  authority: "authority",
  building: "building",
  club: "club",
  drink: "drink",
  exit: "exit",
  flight: "flight",
  food: "food",
  gate: "gate",
  heli: "heli",
  hub: "hub",
  info: "info",
  parking: "parking",
  "parking-direction-t": "parking-direction-t",
  school: "school",
  toilet: "toilet",
};

const operationalMarkerKinds = new Set([
  "area",
  "authority",
  "exit",
  "flight",
  "gate",
  "parking",
  "parking-direction-t",
  "toilet",
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
      useLogoMarker: Boolean(input.useLogoMarker),
      name: input.name,
    };
  }

  return {
    kind: input ?? "info",
    image: "",
    useLogoMarker: false,
    name: "",
  };
}

export function createEntityMarkerIcon(input, { selected = false } = {}) {
  const entity = normalizeMarkerInput(input);
  const kind = entity.kind;
  const iconKind = iconClassByKind[kind] ?? "info";
  const shouldUseLogo = entity.useLogoMarker && entity.image && !operationalMarkerKinds.has(iconKind);
  const markup = shouldUseLogo
    ? `<img class="entity-pin__logo" src="${escapeAttribute(entity.image)}" alt="${escapeAttribute(entity.name ?? "")}">`
    : iconMarkup[kind] ?? iconMarkup.info;

  return window.L.divIcon({
    className: "entity-pin-wrapper",
    html: `
      <span class="entity-pin entity-pin--${iconKind}${shouldUseLogo ? " entity-pin--logo" : ""}${selected ? " is-selected" : ""}" aria-hidden="true">
        <span class="entity-pin__inner">${markup}</span>
      </span>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 46],
    popupAnchor: [0, -34],
  });
}
