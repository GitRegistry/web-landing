import { defaultMapView } from "/js/config.js";
import { createEntityMarkerIcon } from "/js/map-icons.js";

const overlayPalette = {
  cyan: {
    color: "#35d5ff",
    fillColor: "#35d5ff",
    routeColor: "#f3fbff",
    arrowClass: "taxi-arrow-icon",
  },
  light: {
    color: "#f4fbff",
    fillColor: "#dff8ff",
    routeColor: "#ffffff",
    arrowClass: "taxi-arrow-icon",
  },
  parking: {
    color: "#f7b15d",
    fillColor: "#ffd299",
    routeColor: "#fff4dd",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--parking",
  },
  alert: {
    color: "#ff6247",
    fillColor: "#ff6247",
    routeColor: "#ff6247",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--alert",
  },
  eventBlue: {
    color: "#2388ff",
    fillColor: "#2388ff",
    routeColor: "#2388ff",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
};

const overlayCategoryDefaults = {
  area: { tone: "cyan", kind: "polygon" },
  parking: { tone: "parking", kind: "polygon" },
  exit: { tone: "alert", kind: "route" },
  fence: { tone: "alert", kind: "route" },
  route: { tone: "light", kind: "route" },
  event: { tone: "eventBlue", kind: "route" },
};

function escapeHtml(value) {
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

function slugify(value, fallback) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

function localizedText(record) {
  if (!record || typeof record !== "object") {
    return "";
  }

  return record.de || record.en || "";
}

function parseNumber(value, fallback = null) {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : fallback;
}

function parseArrowFractions(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item >= 0 && item <= 1);
}

function formatArrowFractions(value) {
  return (Array.isArray(value) ? value : []).join(", ");
}

function midpoint(left, right) {
  return [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
}

function cloneCoordinates(point) {
  return [Number(point[0]), Number(point[1])];
}

function buildBoundsPoints(entities, overlays) {
  return [
    ...entities.map((entity) => entity.coordinates),
    ...overlays.flatMap((overlay) => overlay.points),
  ];
}

function createDefaultEntry(coordinates) {
  const idSeed = Date.now().toString(36);

  return {
    id: `entry-${idSeed}`,
    type: "service",
    markerKind: "info",
    coordinates: cloneCoordinates(coordinates),
    name: { de: "Neuer Eintrag", en: "New entry" },
    location: { de: "", en: "" },
    summary: { de: "", en: "" },
    description: { de: "", en: "" },
    website: "",
    phone: "",
    email: "",
    image: "/assets/logos/visitor-info.svg",
    useLogoMarker: false,
  };
}

function createDefaultEvent() {
  const idSeed = Date.now().toString(36);

  return {
    id: `event-${idSeed}`,
    time: "10:00",
    title: { de: "Neuer Programmpunkt", en: "New timetable entry" },
    description: { de: "", en: "" },
    locationEntryId: "",
  };
}

function createDefaultOverlay(kind, points) {
  const idSeed = Date.now().toString(36);
  const category = kind === "polygon" ? "area" : "route";
  const defaults = overlayCategoryDefaults[category];

  return {
    id: `${kind}-${idSeed}`,
    kind,
    label: { de: "", en: "" },
    points: points.map(cloneCoordinates),
    tone: defaults.tone,
    weight: null,
    opacity: null,
    fillOpacity: kind === "polygon" ? 0.12 : null,
    dashArray: "",
    arrowFractions: [],
    category,
  };
}

class ManagerApp {
  constructor() {
    this.state = {
      entities: [],
      overlays: [],
      events: [],
      assets: [],
      selectedEntryId: null,
      selectedOverlayId: null,
      selectedEventId: null,
      selectedAssetPath: null,
      selectedVertexIndex: null,
      activeTab: "entries",
      mode: "browse",
      draftPoints: [],
      dirty: false,
    };
  }

  async init() {
    this.cacheDom();
    this.bindEvents();
    this.initMap();
    await this.reloadAll({ fitMap: true });
    this.render();
  }

  cacheDom() {
    this.modeLabelNode = document.querySelector('[data-role="mode-label"]');
    this.messageNode = document.querySelector('[data-role="message"]');
    this.entryListNode = document.querySelector('[data-role="entry-list"]');
    this.overlayListNode = document.querySelector('[data-role="overlay-list"]');
    this.assetListNode = document.querySelector('[data-role="asset-list"]');
    this.entryCountNode = document.querySelector('[data-role="entry-count"]');
    this.overlayCountNode = document.querySelector('[data-role="overlay-count"]');
    this.eventCountNode = document.querySelector('[data-role="event-count"]');
    this.assetCountNode = document.querySelector('[data-role="asset-count"]');
    this.eventListNode = document.querySelector('[data-role="event-list"]');
    this.assetPreviewNode = document.querySelector('[data-role="asset-preview"]');
    this.assetMetaNode = document.querySelector('[data-role="asset-meta"]');
    this.entryForm = document.querySelector('[data-form="entry"]');
    this.overlayForm = document.querySelector('[data-form="overlay"]');
    this.eventForm = document.querySelector('[data-form="event"]');
    this.uploadForm = document.querySelector('[data-form="upload"]');
    this.tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
    this.panelNodes = Array.from(document.querySelectorAll("[data-panel]"));
    this.toolbarButtons = Array.from(document.querySelectorAll("[data-action]"));
  }

  bindEvents() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.state.activeTab = button.dataset.tab;
        this.renderTabs();
      });
    });

    document.querySelector('[data-action="reload-data"]').addEventListener("click", async () => {
      if (this.state.dirty && !window.confirm("Discard unsaved changes and reload from disk?")) {
        return;
      }

      await this.reloadAll({ fitMap: false });
      this.setMessage("Reloaded data from the repo.");
    });

    document.querySelector('[data-action="save-all"]').addEventListener("click", async () => {
      await this.saveAll();
    });

    document.querySelector('[data-action="start-entry"]').addEventListener("click", () => {
      this.startMode("placing-entry", "Click the map to place a new entry.");
    });

    document.querySelector('[data-action="start-polygon"]').addEventListener("click", () => {
      this.startDrawing("polygon");
    });

    document.querySelector('[data-action="start-route"]').addEventListener("click", () => {
      this.startDrawing("route");
    });

    document.querySelector('[data-action="finish-drawing"]').addEventListener("click", () => {
      this.finishDrawing();
    });

    document.querySelector('[data-action="cancel-drawing"]').addEventListener("click", () => {
      this.cancelDrawing();
    });

    document.querySelector('[data-action="delete-entry"]').addEventListener("click", () => {
      this.deleteSelectedEntry();
    });

    document.querySelector('[data-action="delete-overlay"]').addEventListener("click", () => {
      this.deleteSelectedOverlay();
    });

    document.querySelector('[data-action="remove-vertex"]').addEventListener("click", () => {
      this.removeSelectedVertex();
    });

    document.querySelector('[data-action="add-event"]').addEventListener("click", () => {
      this.addEvent();
    });

    document.querySelector('[data-action="delete-event"]').addEventListener("click", () => {
      this.deleteSelectedEvent();
    });

    document.querySelector('[data-action="assign-asset"]').addEventListener("click", () => {
      this.assignSelectedAsset();
    });

    document.querySelector('[data-action="delete-asset"]').addEventListener("click", async () => {
      await this.deleteSelectedAsset();
    });

    this.entryForm.addEventListener("input", () => {
      this.applyEntryForm();
    });
    this.entryForm.addEventListener("change", () => {
      this.applyEntryForm();
    });

    this.overlayForm.addEventListener("input", () => {
      this.applyOverlayForm();
    });
    this.overlayForm.addEventListener("change", () => {
      this.applyOverlayForm();
    });

    this.eventForm.addEventListener("input", () => {
      this.applyEventForm();
    });
    this.eventForm.addEventListener("change", () => {
      this.applyEventForm();
    });

    this.uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.uploadAsset();
    });

    window.addEventListener("beforeunload", (event) => {
      if (!this.state.dirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    });
  }

  initMap() {
    this.map = window.L.map("manager-map", {
      center: defaultMapView.center,
      zoom: defaultMapView.zoom,
      doubleClickZoom: false,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.entityLayer = window.L.layerGroup().addTo(this.map);
    this.overlayLayer = window.L.layerGroup().addTo(this.map);
    this.handleLayer = window.L.layerGroup().addTo(this.map);
    this.draftLayer = window.L.layerGroup().addTo(this.map);

    this.map.on("click", (event) => {
      this.handleMapClick(event);
    });

    this.map.on("dblclick", () => {
      if (this.state.mode === "drawing-polygon" || this.state.mode === "drawing-route") {
        this.finishDrawing();
      }
    });

    this.map.on("zoomend", () => {
      this.updateMarkerScale();
    });
    this.map.on("zoom", () => {
      this.updateMarkerScale();
    });
    this.updateMarkerScale();
  }

  async reloadAll({ fitMap = false } = {}) {
    const previousEntryId = this.state.selectedEntryId;
    const previousOverlayId = this.state.selectedOverlayId;
    const previousEventId = this.state.selectedEventId;
    const previousAssetPath = this.state.selectedAssetPath;

    const [entities, overlays, events, assets] = await Promise.all([
      fetch("/api/entities", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/overlays", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/events", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/assets", { cache: "no-store" }).then((response) => response.json()),
    ]);

    this.state.entities = entities;
    this.state.overlays = overlays;
    this.state.events = events;
    this.state.assets = assets;
    this.state.selectedEntryId = entities.some((entity) => entity.id === previousEntryId)
      ? previousEntryId
      : entities[0]?.id ?? null;
    this.state.selectedOverlayId = overlays.some((overlay) => overlay.id === previousOverlayId)
      ? previousOverlayId
      : null;
    this.state.selectedEventId = events.some((event) => event.id === previousEventId)
      ? previousEventId
      : events[0]?.id ?? null;
    this.state.selectedAssetPath = assets.some((asset) => asset.path === previousAssetPath)
      ? previousAssetPath
      : null;
    this.state.selectedVertexIndex = null;
    this.state.mode = "browse";
    this.state.draftPoints = [];
    this.state.dirty = false;

    this.render();

    if (fitMap) {
      this.fitMapToData();
    }
  }

  fitMapToData() {
    const points = buildBoundsPoints(this.state.entities, this.state.overlays);

    if (!points.length) {
      this.map.setView(defaultMapView.center, defaultMapView.zoom);
      return;
    }

    this.map.fitBounds(window.L.latLngBounds(points), {
      padding: [32, 32],
      maxZoom: 18,
    });
  }

  updateMarkerScale() {
    const zoom = this.map.getZoom();
    const scale = Math.max(0.28, Math.min(1, 0.28 + (zoom - 10) * 0.09));
    this.map.getContainer().style.setProperty("--marker-scale", scale.toFixed(2));
  }

  setMessage(message) {
    this.messageNode.textContent = message;
  }

  startMode(mode, message) {
    this.state.mode = mode;
    this.state.draftPoints = [];
    this.state.selectedVertexIndex = null;
    this.renderToolbar();
    this.renderMap();
    this.setMessage(message);
  }

  startDrawing(kind) {
    this.state.mode = kind === "polygon" ? "drawing-polygon" : "drawing-route";
    this.state.draftPoints = [];
    this.state.selectedOverlayId = null;
    this.state.selectedVertexIndex = null;
    this.state.activeTab = "overlays";
    this.render();
    this.setMessage(`Click the map to add ${kind} points, then finish drawing.`);
  }

  cancelDrawing() {
    this.state.mode = "browse";
    this.state.draftPoints = [];
    this.renderToolbar();
    this.renderMap();
    this.setMessage("Drawing cancelled.");
  }

  finishDrawing() {
    const kind = this.state.mode === "drawing-polygon" ? "polygon" : this.state.mode === "drawing-route" ? "route" : null;

    if (!kind) {
      this.setMessage("No active drawing to finish.");
      return;
    }

    const minPoints = kind === "polygon" ? 3 : 2;

    if (this.state.draftPoints.length < minPoints) {
      this.setMessage(`${kind === "polygon" ? "Polygons" : "Routes"} need at least ${minPoints} points.`);
      return;
    }

    const overlay = createDefaultOverlay(kind, this.state.draftPoints);
    this.state.overlays.push(overlay);
    this.state.selectedOverlayId = overlay.id;
    this.state.selectedVertexIndex = null;
    this.state.mode = "browse";
    this.state.draftPoints = [];
    this.state.activeTab = "overlays";
    this.markDirty("Created a new overlay.");
  }

  handleMapClick(event) {
    if (this.state.mode === "placing-entry") {
      const entry = createDefaultEntry([event.latlng.lat, event.latlng.lng]);
      this.state.entities.push(entry);
      this.state.selectedEntryId = entry.id;
      this.state.selectedOverlayId = null;
      this.state.mode = "browse";
      this.state.activeTab = "entries";
      this.markDirty("Placed a new entry.");
      return;
    }

    if (this.state.mode === "drawing-polygon" || this.state.mode === "drawing-route") {
      this.state.draftPoints.push([event.latlng.lat, event.latlng.lng]);
      this.renderToolbar();
      this.renderMap();
      this.setMessage(`Drawing in progress: ${this.state.draftPoints.length} point(s) placed.`);
      return;
    }

    this.state.selectedOverlayId = null;
    this.state.selectedEntryId = null;
    this.state.selectedVertexIndex = null;
    this.render();
  }

  render() {
    this.renderTabs();
    this.renderToolbar();
    this.renderEntryList();
    this.renderOverlayList();
    this.renderEventList();
    this.renderAssetList();
    this.renderEntryForm();
    this.renderOverlayForm();
    this.renderEventForm();
    this.renderAssetPreview();
    this.renderMap();
  }

  renderTabs() {
    this.tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === this.state.activeTab);
    });

    this.panelNodes.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === this.state.activeTab);
    });
  }

  renderToolbar() {
    const labels = {
      browse: "Mode: Browse",
      "placing-entry": "Mode: Place Entry",
      "drawing-polygon": "Mode: Draw Polygon",
      "drawing-route": "Mode: Draw Route",
    };

    this.modeLabelNode.textContent = labels[this.state.mode] ?? "Mode: Browse";

    this.toolbarButtons.forEach((button) => {
      const action = button.dataset.action;
      const isActive =
        (action === "start-entry" && this.state.mode === "placing-entry") ||
        (action === "start-polygon" && this.state.mode === "drawing-polygon") ||
        (action === "start-route" && this.state.mode === "drawing-route");

      button.classList.toggle("is-active", isActive);
    });
  }

  get selectedEntry() {
    return this.state.entities.find((entity) => entity.id === this.state.selectedEntryId) ?? null;
  }

  get selectedOverlay() {
    return this.state.overlays.find((overlay) => overlay.id === this.state.selectedOverlayId) ?? null;
  }

  get selectedAsset() {
    return this.state.assets.find((asset) => asset.path === this.state.selectedAssetPath) ?? null;
  }

  get selectedEvent() {
    return this.state.events.find((event) => event.id === this.state.selectedEventId) ?? null;
  }

  renderEntryList() {
    this.entryCountNode.textContent = `${this.state.entities.length} total`;
    this.entryListNode.innerHTML = this.state.entities
      .map((entity) => {
        const isActive = entity.id === this.state.selectedEntryId;
        return `
          <button type="button" class="manager-list-item ${isActive ? "is-active" : ""}" data-entry-id="${escapeHtml(entity.id)}">
            <strong>${escapeHtml(localizedText(entity.name) || entity.id)}</strong>
            <span>${escapeHtml(localizedText(entity.location))}</span>
            <small>${escapeHtml(entity.type)} · ${escapeHtml(entity.markerKind)}</small>
          </button>
        `;
      })
      .join("");

    this.entryListNode.querySelectorAll("[data-entry-id]").forEach((button) => {
      button.addEventListener("click", () => {
        this.state.selectedEntryId = button.dataset.entryId;
        this.state.selectedOverlayId = null;
        this.state.selectedVertexIndex = null;
        this.state.activeTab = "entries";
        this.render();

        const entry = this.selectedEntry;

        if (entry) {
          this.map.panTo(entry.coordinates);
        }
      });
    });
  }

  renderOverlayList() {
    this.overlayCountNode.textContent = `${this.state.overlays.length} total`;
    this.overlayListNode.innerHTML = this.state.overlays
      .map((overlay) => {
        const isActive = overlay.id === this.state.selectedOverlayId;
        const name = localizedText(overlay.label) || overlay.id;
        return `
          <button type="button" class="manager-list-item ${isActive ? "is-active" : ""}" data-overlay-id="${escapeHtml(overlay.id)}">
            <strong>${escapeHtml(name)}</strong>
            <span>${escapeHtml(overlay.kind)} · ${escapeHtml(overlay.category)}</span>
            <small>${overlay.points.length} points · tone ${escapeHtml(overlay.tone)}</small>
          </button>
        `;
      })
      .join("");

    this.overlayListNode.querySelectorAll("[data-overlay-id]").forEach((button) => {
      button.addEventListener("click", () => {
        this.state.selectedOverlayId = button.dataset.overlayId;
        this.state.selectedEntryId = null;
        this.state.selectedVertexIndex = null;
        this.state.activeTab = "overlays";
        this.render();
      });
    });
  }

  renderAssetList() {
    this.assetCountNode.textContent = `${this.state.assets.length} total`;
    this.assetListNode.innerHTML = this.state.assets
      .map((asset) => {
        const isActive = asset.path === this.state.selectedAssetPath;
        return `
          <button type="button" class="manager-asset-tile ${isActive ? "is-active" : ""}" data-asset-path="${escapeHtml(asset.path)}">
            <span class="manager-asset-thumb"><img src="${escapeHtml(asset.path)}" alt="${escapeHtml(asset.name)}"></span>
            <strong>${escapeHtml(asset.name)}</strong>
            <span class="manager-asset-meta">${asset.inUse ? "In use" : "Free"}${asset.deletable ? " · deletable" : ""}</span>
          </button>
        `;
      })
      .join("");

    this.assetListNode.querySelectorAll("[data-asset-path]").forEach((button) => {
      button.addEventListener("click", () => {
        this.state.selectedAssetPath = button.dataset.assetPath;
        this.state.activeTab = "assets";
        this.renderAssetList();
        this.renderAssetPreview();
      });
    });
  }

  setFormDisabled(form, disabled) {
    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLElement) {
        element.disabled = disabled;
      }
    });
  }

  renderEntryForm() {
    const entry = this.selectedEntry;

    this.setFormDisabled(this.entryForm, !entry);

    if (!entry) {
      this.entryForm.reset();
      return;
    }

    const { elements } = this.entryForm;
    elements.id.value = entry.id;
    elements.type.value = entry.type;
    elements.markerKind.value = entry.markerKind;
    elements.useLogoMarker.checked = Boolean(entry.useLogoMarker);
    elements.image.value = entry.image ?? "";
    elements.latitude.value = entry.coordinates[0];
    elements.longitude.value = entry.coordinates[1];
    elements.website.value = entry.website ?? "";
    elements.phone.value = entry.phone ?? "";
    elements.email.value = entry.email ?? "";
    elements.nameDe.value = entry.name?.de ?? "";
    elements.nameEn.value = entry.name?.en ?? "";
    elements.locationDe.value = entry.location?.de ?? "";
    elements.locationEn.value = entry.location?.en ?? "";
    elements.summaryDe.value = entry.summary?.de ?? "";
    elements.summaryEn.value = entry.summary?.en ?? "";
    elements.descriptionDe.value = entry.description?.de ?? "";
    elements.descriptionEn.value = entry.description?.en ?? "";
  }

  renderOverlayForm() {
    const overlay = this.selectedOverlay;

    this.setFormDisabled(this.overlayForm, !overlay);

    if (!overlay) {
      this.overlayForm.reset();
      return;
    }

    const { elements } = this.overlayForm;
    elements.id.value = overlay.id;
    elements.kind.value = overlay.kind;
    elements.category.value = overlay.category;
    elements.tone.value = overlay.tone;
    elements.dashArray.value = overlay.dashArray ?? "";
    elements.labelDe.value = overlay.label?.de ?? "";
    elements.labelEn.value = overlay.label?.en ?? "";
    elements.weight.value = overlay.weight ?? "";
    elements.opacity.value = overlay.opacity ?? "";
    elements.fillOpacity.value = overlay.fillOpacity ?? "";
    elements.arrowFractions.value = formatArrowFractions(overlay.arrowFractions);
  }

  renderEventList() {
    this.eventCountNode.textContent = `${this.state.events.length} total`;
    this.eventListNode.innerHTML = [...this.state.events]
      .sort((left, right) => left.time.localeCompare(right.time))
      .map((event) => {
        const isActive = event.id === this.state.selectedEventId;
        const linkedEntry = this.state.entities.find((entry) => entry.id === event.locationEntryId);

        return `
          <button type="button" class="manager-list-item ${isActive ? "is-active" : ""}" data-event-id="${escapeHtml(event.id)}">
            <strong>${escapeHtml(event.time || "--:--")} · ${escapeHtml(localizedText(event.title) || event.id)}</strong>
            <span>${escapeHtml(linkedEntry ? localizedText(linkedEntry.name) : "")}</span>
            <small>${escapeHtml(localizedText(event.description))}</small>
          </button>
        `;
      })
      .join("");

    this.eventListNode.querySelectorAll("[data-event-id]").forEach((button) => {
      button.addEventListener("click", () => {
        this.state.selectedEventId = button.dataset.eventId;
        this.state.activeTab = "events";
        this.render();
      });
    });
  }

  renderEventForm() {
    const event = this.selectedEvent;

    this.setFormDisabled(this.eventForm, !event);
    this.renderEventLocationOptions();

    if (!event) {
      this.eventForm.reset();
      return;
    }

    const { elements } = this.eventForm;
    elements.id.value = event.id;
    elements.time.value = event.time ?? "";
    elements.locationEntryId.value = event.locationEntryId ?? "";
    elements.titleDe.value = event.title?.de ?? "";
    elements.titleEn.value = event.title?.en ?? "";
    elements.descriptionDe.value = event.description?.de ?? "";
    elements.descriptionEn.value = event.description?.en ?? "";
  }

  renderEventLocationOptions() {
    const select = this.eventForm.elements.locationEntryId;
    const currentValue = select.value;

    select.innerHTML = [
      '<option value="">No linked entry</option>',
      ...this.state.entities.map(
        (entry) => `<option value="${escapeHtml(entry.id)}">${escapeHtml(localizedText(entry.name) || entry.id)}</option>`,
      ),
    ].join("");

    select.value = currentValue;
  }

  renderAssetPreview() {
    const asset = this.selectedAsset;

    if (!asset) {
      this.assetPreviewNode.innerHTML = "<span class=\"manager-note\">No asset selected.</span>";
      this.assetMetaNode.textContent = "Select an asset to preview it here.";
      return;
    }

    this.assetPreviewNode.innerHTML = `<img src="${escapeHtml(asset.path)}" alt="${escapeHtml(asset.name)}">`;
    this.assetMetaNode.textContent = `${asset.path} · ${asset.inUse ? "currently in use" : "not referenced"}${asset.deletable ? " · deletable" : ""}`;
  }

  applyEntryForm() {
    const entry = this.selectedEntry;

    if (!entry) {
      return;
    }

    const { elements } = this.entryForm;
    entry.id = slugify(elements.id.value, entry.id);
    entry.type = elements.type.value;
    entry.markerKind = elements.markerKind.value;
    entry.useLogoMarker = elements.useLogoMarker.checked;
    entry.image = elements.image.value.trim();
    entry.coordinates = [
      parseNumber(elements.latitude.value, entry.coordinates[0]),
      parseNumber(elements.longitude.value, entry.coordinates[1]),
    ];
    entry.website = elements.website.value.trim();
    entry.phone = elements.phone.value.trim();
    entry.email = elements.email.value.trim();
    entry.name = { de: elements.nameDe.value, en: elements.nameEn.value };
    entry.location = { de: elements.locationDe.value, en: elements.locationEn.value };
    entry.summary = { de: elements.summaryDe.value, en: elements.summaryEn.value };
    entry.description = { de: elements.descriptionDe.value, en: elements.descriptionEn.value };
    this.state.selectedEntryId = entry.id;
    this.state.dirty = true;
    this.renderEntryList();
    this.renderMap();
  }

  applyEventForm() {
    const event = this.selectedEvent;

    if (!event) {
      return;
    }

    const { elements } = this.eventForm;
    event.id = slugify(elements.id.value, event.id);
    event.time = elements.time.value;
    event.locationEntryId = elements.locationEntryId.value;
    event.title = { de: elements.titleDe.value, en: elements.titleEn.value };
    event.description = { de: elements.descriptionDe.value, en: elements.descriptionEn.value };
    this.state.selectedEventId = event.id;
    this.state.dirty = true;
    this.renderEventList();
  }

  applyOverlayForm() {
    const overlay = this.selectedOverlay;

    if (!overlay) {
      return;
    }

    const { elements } = this.overlayForm;
    overlay.id = slugify(elements.id.value, overlay.id);
    overlay.kind = elements.kind.value === "polygon" ? "polygon" : "route";
    overlay.category = elements.category.value;

    const defaults = overlayCategoryDefaults[overlay.category] ?? overlayCategoryDefaults.area;

    overlay.tone = overlay.category === "event" ? "eventBlue" : elements.tone.value || defaults.tone;
    elements.tone.value = overlay.tone;
    overlay.label = { de: elements.labelDe.value, en: elements.labelEn.value };
    overlay.weight = parseNumber(elements.weight.value, null);
    overlay.opacity = parseNumber(elements.opacity.value, null);
    overlay.fillOpacity = parseNumber(elements.fillOpacity.value, null);
    overlay.dashArray = elements.dashArray.value.trim();
    overlay.arrowFractions = parseArrowFractions(elements.arrowFractions.value);
    this.state.selectedOverlayId = overlay.id;
    this.state.dirty = true;
    this.renderOverlayList();
    this.renderMap();
  }

  markDirty(message, { skipMessage = false } = {}) {
    this.state.dirty = true;
    this.render();

    if (!skipMessage) {
      this.setMessage(message);
    }
  }

  deleteSelectedEntry() {
    const entry = this.selectedEntry;

    if (!entry) {
      return;
    }

    if (!window.confirm(`Delete entry "${localizedText(entry.name) || entry.id}"?`)) {
      return;
    }

    this.state.entities = this.state.entities.filter((item) => item.id !== entry.id);
    this.state.selectedEntryId = this.state.entities[0]?.id ?? null;
    this.markDirty("Deleted entry.");
  }

  deleteSelectedOverlay() {
    const overlay = this.selectedOverlay;

    if (!overlay) {
      return;
    }

    if (!window.confirm(`Delete overlay "${localizedText(overlay.label) || overlay.id}"?`)) {
      return;
    }

    this.state.overlays = this.state.overlays.filter((item) => item.id !== overlay.id);
    this.state.selectedOverlayId = null;
    this.state.selectedVertexIndex = null;
    this.markDirty("Deleted overlay.");
  }

  addEvent() {
    const event = createDefaultEvent();
    this.state.events.push(event);
    this.state.selectedEventId = event.id;
    this.state.activeTab = "events";
    this.markDirty("Added timetable entry.");
  }

  deleteSelectedEvent() {
    const event = this.selectedEvent;

    if (!event) {
      return;
    }

    if (!window.confirm(`Delete event "${localizedText(event.title) || event.id}"?`)) {
      return;
    }

    this.state.events = this.state.events.filter((item) => item.id !== event.id);
    this.state.selectedEventId = this.state.events[0]?.id ?? null;
    this.markDirty("Deleted timetable entry.");
  }

  removeSelectedVertex() {
    const overlay = this.selectedOverlay;
    const index = this.state.selectedVertexIndex;

    if (!overlay || index === null) {
      this.setMessage("Select a vertex on the map first.");
      return;
    }

    const minPoints = overlay.kind === "polygon" ? 3 : 2;

    if (overlay.points.length <= minPoints) {
      this.setMessage(`This ${overlay.kind} cannot have fewer than ${minPoints} points.`);
      return;
    }

    overlay.points.splice(index, 1);
    this.state.selectedVertexIndex = null;
    this.markDirty("Removed a vertex.");
  }

  assignSelectedAsset() {
    const entry = this.selectedEntry;
    const asset = this.selectedAsset;

    if (!entry) {
      this.setMessage("Select an entry first.");
      return;
    }

    if (!asset) {
      this.setMessage("Select an asset first.");
      return;
    }

    entry.image = asset.path;
    this.markDirty("Assigned asset to entry.");
  }

  async uploadAsset() {
    const fileInput = this.uploadForm.querySelector('input[type="file"]');
    const file = fileInput.files?.[0];

    if (!file) {
      this.setMessage("Select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/assets", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      this.setMessage(payload.error || "Asset upload failed.");
      return;
    }

    this.state.assets.push(payload.asset);
    this.state.selectedAssetPath = payload.asset.path;
    fileInput.value = "";
    this.renderAssetList();
    this.renderAssetPreview();
    this.setMessage("Uploaded a new asset.");
  }

  async deleteSelectedAsset() {
    const asset = this.selectedAsset;

    if (!asset) {
      this.setMessage("Select an asset first.");
      return;
    }

    if (!asset.deletable) {
      this.setMessage("Only uploaded assets can be deleted.");
      return;
    }

    if (!window.confirm(`Delete asset "${asset.name}"?`)) {
      return;
    }

    const response = await fetch("/api/assets", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: asset.path }),
    });

    const payload = await response.json();

    if (!response.ok) {
      this.setMessage(payload.error || "Asset deletion failed.");
      return;
    }

    this.state.assets = this.state.assets.filter((item) => item.path !== asset.path);
    this.state.selectedAssetPath = null;
    this.renderAssetList();
    this.renderAssetPreview();
    this.setMessage("Deleted asset.");
  }

  async saveAll() {
    const entitiesResponse = await fetch("/api/entities", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.entities),
    });

    if (!entitiesResponse.ok) {
      const payload = await entitiesResponse.json();
      this.setMessage(payload.error || "Failed to save entries.");
      return;
    }

    const overlaysResponse = await fetch("/api/overlays", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.overlays),
    });

    if (!overlaysResponse.ok) {
      const payload = await overlaysResponse.json();
      this.setMessage(payload.error || "Failed to save overlays.");
      return;
    }

    const eventsResponse = await fetch("/api/events", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.events),
    });

    if (!eventsResponse.ok) {
      const payload = await eventsResponse.json();
      this.setMessage(payload.error || "Failed to save events.");
      return;
    }

    await this.reloadAll({ fitMap: false });
    this.setMessage("Saved Fest Map data to the repo.");
  }

  renderMap() {
    this.entityLayer.clearLayers();
    this.overlayLayer.clearLayers();
    this.handleLayer.clearLayers();
    this.draftLayer.clearLayers();

    this.state.entities.forEach((entity) => {
      const marker = window.L.marker(entity.coordinates, {
        draggable: true,
        icon: createEntityMarkerIcon(entity, {
          selected: entity.id === this.state.selectedEntryId,
        }),
      });

      marker.on("click", () => {
        this.state.selectedEntryId = entity.id;
        this.state.selectedOverlayId = null;
        this.state.selectedVertexIndex = null;
        this.state.activeTab = "entries";
        this.render();
      });

      marker.on("dragend", (event) => {
        const { lat, lng } = event.target.getLatLng();
        entity.coordinates = [lat, lng];
        this.markDirty("Moved an entry point.");
      });

      marker.addTo(this.entityLayer);
    });

    this.state.overlays.forEach((overlay) => {
      const palette = overlayPalette[overlay.tone] ?? overlayPalette.light;
      const isSelected = overlay.id === this.state.selectedOverlayId;
      const style = overlay.kind === "polygon"
        ? {
            color: palette.color,
            weight: overlay.weight ?? 2.5,
            fillColor: palette.fillColor,
            fillOpacity: overlay.fillOpacity ?? 0.1,
            dashArray: overlay.dashArray || null,
          }
        : {
            color: palette.routeColor,
            weight: overlay.weight ?? 4,
            opacity: overlay.opacity ?? 0.92,
            dashArray: overlay.dashArray || null,
            lineCap: "round",
            lineJoin: "round",
          };

      if (isSelected) {
        style.weight = (style.weight ?? 4) + 1.25;
      }

      const layer =
        overlay.kind === "polygon"
          ? window.L.polygon(overlay.points, style)
          : window.L.polyline(overlay.points, style);

      layer.on("click", () => {
        this.state.selectedOverlayId = overlay.id;
        this.state.selectedEntryId = null;
        this.state.selectedVertexIndex = null;
        this.state.activeTab = "overlays";
        this.render();
      });

      const label = localizedText(overlay.label);

      if (label) {
        layer.bindTooltip(label, {
          sticky: true,
          direction: "top",
          opacity: 0.92,
        });
      }

      layer.addTo(this.overlayLayer);

      if (overlay.kind === "route") {
        this.renderRouteArrows(overlay);
      }

      if (isSelected) {
        this.renderOverlayHandles(overlay);
      }
    });

    this.renderDraft();
  }

  renderRouteArrows(overlay) {
    const palette = overlayPalette[overlay.tone] ?? overlayPalette.light;

    overlay.arrowFractions.forEach((fraction) => {
      const arrowData = this.getPointAlongRoute(overlay.points, fraction);
      const arrowIcon = window.L.divIcon({
        className: "taxi-arrow-wrapper",
        html: `<span class="${palette.arrowClass}" style="transform: rotate(${arrowData.bearing}deg)">➜</span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      window.L.marker(arrowData.point, {
        icon: arrowIcon,
        interactive: false,
      }).addTo(this.overlayLayer);
    });
  }

  renderOverlayHandles(overlay) {
    overlay.points.forEach((point, index) => {
      const marker = window.L.marker(point, {
        draggable: true,
        icon: window.L.divIcon({
          className: "manager-overlay-vertex",
          html: `<span class="manager-overlay-vertex__dot${index === this.state.selectedVertexIndex ? " is-active" : ""}"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      });

      marker.on("click", () => {
        this.state.selectedVertexIndex = index;
        this.renderMap();
      });

      marker.on("dragend", (event) => {
        const { lat, lng } = event.target.getLatLng();
        overlay.points[index] = [lat, lng];
        this.markDirty("Updated overlay geometry.");
      });

      marker.addTo(this.handleLayer);
    });

    const segmentCount = overlay.kind === "polygon" ? overlay.points.length : overlay.points.length - 1;

    for (let index = 0; index < segmentCount; index += 1) {
      const start = overlay.points[index];
      const end = overlay.points[(index + 1) % overlay.points.length];

      if (!end) {
        continue;
      }

      const marker = window.L.marker(midpoint(start, end), {
        icon: window.L.divIcon({
          className: "manager-overlay-vertex",
          html: "<span class=\"manager-overlay-midpoint__dot\"></span>",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      });

      marker.on("click", () => {
        overlay.points.splice(index + 1, 0, midpoint(start, end));
        this.state.selectedVertexIndex = index + 1;
        this.markDirty("Inserted a new vertex.");
      });

      marker.addTo(this.handleLayer);
    }
  }

  renderDraft() {
    if (!this.state.draftPoints.length) {
      return;
    }

    const isPolygon = this.state.mode === "drawing-polygon";
    const layer = isPolygon
      ? window.L.polygon(this.state.draftPoints, {
          color: "#cc5a43",
          weight: 2,
          fillColor: "#cc5a43",
          fillOpacity: 0.08,
          dashArray: "6 4",
        })
      : window.L.polyline(this.state.draftPoints, {
          color: "#cc5a43",
          weight: 3,
          dashArray: "6 4",
        });

    layer.addTo(this.draftLayer);

    this.state.draftPoints.forEach((point) => {
      window.L.marker(point, {
        icon: window.L.divIcon({
          className: "manager-draft-point",
          html: "<span class=\"manager-draft-point__dot\"></span>",
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
        interactive: false,
      }).addTo(this.draftLayer);
    });
  }

  getPointAlongRoute(points, fraction) {
    const clampedFraction = Math.max(0, Math.min(1, fraction));
    const segments = [];
    let totalLength = 0;

    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      segments.push({ start, end, length });
      totalLength += length;
    }

    const targetLength = totalLength * clampedFraction;
    let traversedLength = 0;

    for (const segment of segments) {
      const nextLength = traversedLength + segment.length;

      if (targetLength <= nextLength) {
        const segmentFraction = segment.length === 0 ? 0 : (targetLength - traversedLength) / segment.length;
        const lat = segment.start[0] + (segment.end[0] - segment.start[0]) * segmentFraction;
        const lng = segment.start[1] + (segment.end[1] - segment.start[1]) * segmentFraction;
        const bearing =
          (Math.atan2(-(segment.end[0] - segment.start[0]), segment.end[1] - segment.start[1]) * 180) / Math.PI;

        return { point: [lat, lng], bearing };
      }

      traversedLength = nextLength;
    }

    const fallbackStart = points[points.length - 2] ?? points[0];
    const fallbackEnd = points[points.length - 1] ?? points[0];
    const fallbackBearing =
      (Math.atan2(-(fallbackEnd[0] - fallbackStart[0]), fallbackEnd[1] - fallbackStart[1]) * 180) / Math.PI;

    return {
      point: fallbackEnd,
      bearing: fallbackBearing,
    };
  }
}

const app = new ManagerApp();

app.init().catch((error) => {
  console.error(error);
  const messageNode = document.querySelector('[data-role="message"]');

  if (messageNode) {
    messageNode.textContent = `Manager failed to initialize: ${error.message}`;
  }
});
