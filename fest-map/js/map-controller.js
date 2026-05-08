import { createEntityMarkerIcon } from "./map-icons.js?v=20260508-cache-refresh-1";

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
  eventRed: {
    color: "#e33a43",
    fillColor: "#e33a43",
    routeColor: "#e33a43",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventGreen: {
    color: "#49b34f",
    fillColor: "#49b34f",
    routeColor: "#49b34f",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventPurple: {
    color: "#7b58b0",
    fillColor: "#7b58b0",
    routeColor: "#7b58b0",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventCyan: {
    color: "#39a9d2",
    fillColor: "#39a9d2",
    routeColor: "#39a9d2",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventYellow: {
    color: "#d0c42b",
    fillColor: "#d0c42b",
    routeColor: "#d0c42b",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventPink: {
    color: "#e51b93",
    fillColor: "#e51b93",
    routeColor: "#e51b93",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventOrange: {
    color: "#e89734",
    fillColor: "#e89734",
    routeColor: "#e89734",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
  eventTeal: {
    color: "#00a99d",
    fillColor: "#00a99d",
    routeColor: "#00a99d",
    arrowClass: "taxi-arrow-icon taxi-arrow-icon--event",
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
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

function searchTokens(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !["area", "flaeche", "flache", "parking"].includes(token));
}

export class MapController {
  constructor(container, { center, zoom, onSelect }) {
    this.container = container;
    this.center = center;
    this.zoom = zoom;
    this.onSelect = onSelect;
    this.entities = [];
    this.markers = new Map();
    this.overlayDefinitions = [];
    this.overlayEntries = [];
    this.overlayLayers = [];
    this.overlayBounds = [];
    this.selectedId = null;
    this.selectedOverlayId = null;
    this.map = null;
  }

  init() {
    if (!window.L) {
      throw new Error("Leaflet is not available on window.L");
    }

    this.map = window.L.map(this.container, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: false,
      attributionControl: true,
    });
    this.map.createPane("airfield-zone-pane");
    this.map.getPane("airfield-zone-pane").style.zIndex = 360;
    this.map.createPane("airfield-route-pane");
    this.map.getPane("airfield-route-pane").style.zIndex = 380;

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.updateMarkerScale();
    this.map.on("zoom", () => {
      this.updateMarkerScale();
    });
    this.map.on("zoomend", () => {
      this.updateMarkerScale();
    });
  }

  setOverlays(overlays) {
    this.overlayDefinitions = Array.isArray(overlays) ? overlays : [];
    this.overlayEntries = [];
    this.overlayBounds = [];
    this.selectedOverlayId = null;

    this.overlayLayers.forEach((layer) => layer.remove());
    this.overlayLayers = [];

    this.overlayDefinitions.forEach((overlay) => {
      const layers = this.createOverlayLayers(overlay);
      const bounds = window.L.latLngBounds(overlay.points);
      this.overlayEntries.push({ overlay, layers, bounds });
      this.overlayLayers.push(...layers);
    });
  }

  setEntities(entities, { fit = true } = {}) {
    this.entities = Array.isArray(entities) ? entities : [];

    for (const marker of this.markers.values()) {
      marker.remove();
    }

    this.markers.clear();

    this.entities.forEach((entity) => {
      const marker = window.L.marker(entity.coordinates, {
        icon: this.getMarkerIcon(entity, false),
      });

      marker.bindPopup(`
        <strong>${escapeHtml(entity.name)}</strong><br>
        <span>${escapeHtml(entity.location)}</span>
      `);

      marker.on("click", () => {
        this.onSelect?.(entity.id);
      });

      marker.addTo(this.map);
      this.markers.set(entity.id, marker);
    });

    if (fit) {
      this.fitToEntities();
    }
  }

  getMarkerIcon(entity, isSelected) {
    return createEntityMarkerIcon(entity, { selected: isSelected });
  }

  updateMarkerScale() {
    if (!this.map) {
      return;
    }

    const zoom = this.map.getZoom();
    const scale = Math.max(0.2, Math.min(1, (zoom - 8.5) / 14));
    const value = scale.toFixed(2);
    this.container.style.setProperty("--marker-scale", value);
    this.map.getPane("markerPane")?.style.setProperty("--marker-scale", value);
  }

  findOverlayForEntity(entity) {
    if (!entity) {
      return null;
    }

    const normalizedName = String(entity.name ?? "").trim().toLowerCase();
    const entityTokenSet = new Set(searchTokens(`${entity.id} ${entity.name ?? ""}`));

    if (!normalizedName) {
      return null;
    }

    const exactMatch = this.overlayEntries.find(
      ({ overlay }) => String(overlay.label ?? "").trim().toLowerCase() === normalizedName,
    );

    if (exactMatch) {
      return exactMatch;
    }

    let bestMatch = null;
    let bestScore = 0;

    this.overlayEntries.forEach((entry) => {
      const overlayTokenSet = new Set(searchTokens(`${entry.overlay.id} ${entry.overlay.label ?? ""}`));
      const score = [...overlayTokenSet].filter((token) => entityTokenSet.has(token)).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    return bestScore >= 2 ? bestMatch : null;
  }

  findEntityForOverlay(overlay) {
    const overlayTokenSet = new Set(searchTokens(`${overlay.id} ${overlay.label ?? ""}`));
    let bestMatch = null;
    let bestScore = 0;

    this.entities.forEach((entity) => {
      const entityTokenSet = new Set(searchTokens(`${entity.id} ${entity.name ?? ""}`));
      const score = [...overlayTokenSet].filter((token) => entityTokenSet.has(token)).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entity;
      }
    });

    return bestScore >= 2 ? bestMatch : null;
  }

  fitToEntities() {
    const entityPoints = this.entities.map(({ coordinates }) => coordinates);
    const points = [...entityPoints, ...this.overlayBounds];

    if (!points.length) {
      return;
    }

    const bounds = window.L.latLngBounds(points);

    this.map.fitBounds(bounds, {
      paddingTopLeft: [28, 140],
      paddingBottomRight: [28, 240],
      maxZoom: 18,
    });
  }

  getPolygonStyle(overlay, { selected = false } = {}) {
    const palette = overlayPalette[overlay.tone] ?? overlayPalette.cyan;
    const baseWeight = overlay.weight ?? 2.5;
    const baseFillOpacity = overlay.fillOpacity ?? 0.08;
    const baseOpacity = overlay.opacity ?? (baseWeight > 0 ? 0.92 : 0);

    return {
      pane: "airfield-zone-pane",
      color: palette.color,
      weight: selected ? Math.max(2.5, baseWeight || 0) : baseWeight,
      opacity: selected ? 0.96 : baseOpacity,
      fillColor: palette.fillColor,
      fillOpacity: selected ? Math.max(0.26, baseFillOpacity) : baseFillOpacity,
      dashArray: overlay.dashArray ?? "8 6",
    };
  }

  getRouteStyle(overlay, { selected = false } = {}) {
    const palette = overlayPalette[overlay.tone] ?? overlayPalette.light;
    const baseWeight = overlay.weight ?? (overlay.tone === "alert" ? 4 : 5);
    const baseOpacity = overlay.opacity ?? 0.92;

    return {
      pane: "airfield-route-pane",
      color: palette.routeColor,
      weight: selected ? Math.max(baseWeight + 1, 5) : baseWeight,
      opacity: selected ? 1 : baseOpacity,
      dashArray: overlay.dashArray ?? null,
      lineCap: "round",
      lineJoin: "round",
    };
  }

  applyOverlaySelection(overlayEntry) {
    if (this.selectedOverlayId) {
      const previousEntry = this.overlayEntries.find(({ overlay }) => overlay.id === this.selectedOverlayId);

      if (previousEntry) {
        previousEntry.layers.forEach((layer) => {
          if (typeof layer.setStyle !== "function") {
            return;
          }

          if (previousEntry.overlay.kind === "polygon") {
            layer.setStyle(this.getPolygonStyle(previousEntry.overlay));
            return;
          }

          layer.setStyle(this.getRouteStyle(previousEntry.overlay));
        });
      }
    }

    this.selectedOverlayId = overlayEntry?.overlay?.id ?? null;

    if (!overlayEntry) {
      return;
    }

    overlayEntry.layers.forEach((layer) => {
      if (typeof layer.setStyle !== "function") {
        return;
      }

      if (overlayEntry.overlay.kind === "polygon") {
        layer.setStyle(this.getPolygonStyle(overlayEntry.overlay, { selected: true }));
      } else {
        layer.setStyle(this.getRouteStyle(overlayEntry.overlay, { selected: true }));
      }

      layer.bringToFront?.();
    });
  }

  getFocusPadding({ sheetExpanded = false } = {}) {
    const viewportHeight = this.container?.clientHeight || window.innerHeight || 720;
    const bottomPadding = sheetExpanded
      ? Math.min(520, Math.max(320, Math.round(viewportHeight * 0.52)))
      : 240;

    return {
      paddingTopLeft: [28, 120],
      paddingBottomRight: [28, bottomPadding],
    };
  }

  getOffsetCenter(coordinates, zoom, { sheetExpanded = false } = {}) {
    if (!sheetExpanded) {
      return coordinates;
    }

    const viewportHeight = this.container?.clientHeight || window.innerHeight || 720;
    const verticalOffset = Math.min(190, Math.max(100, Math.round(viewportHeight * 0.22)));
    const projectedPoint = this.map.project(coordinates, zoom).add([0, verticalOffset]);
    return this.map.unproject(projectedPoint, zoom);
  }

  focusEntity(entity, { flyTo = true, sheetExpanded = false } = {}) {
    if (!entity) {
      return;
    }

    if (this.selectedId && this.markers.has(this.selectedId)) {
      const previousEntity = this.entities.find(({ id }) => id === this.selectedId);
      const previousMarker = this.markers.get(this.selectedId);
      previousMarker?.setIcon(this.getMarkerIcon(previousEntity ?? {}, false));
      previousMarker?.setZIndexOffset(0);
    }

    const marker = this.markers.get(entity.id);

    if (!marker) {
      return;
    }

    marker.setIcon(this.getMarkerIcon(entity, true));
    marker.setZIndexOffset(1000);
    marker.openPopup();
    this.selectedId = entity.id;

    const overlayEntry = this.findOverlayForEntity(entity);
    this.applyOverlaySelection(overlayEntry);

    if (flyTo) {
      if (overlayEntry) {
        const focusPadding = this.getFocusPadding({ sheetExpanded });
        this.map.flyToBounds(overlayEntry.bounds, {
          paddingTopLeft: focusPadding.paddingTopLeft,
          paddingBottomRight: focusPadding.paddingBottomRight,
          maxZoom: 17,
          duration: 0.9,
        });
        return;
      }

      const nextZoom = Math.max(this.map.getZoom(), 18);
      this.map.flyTo(this.getOffsetCenter(entity.coordinates, nextZoom, { sheetExpanded }), nextZoom, { duration: 0.9 });
    }
  }

  invalidateSize() {
    this.map?.invalidateSize();
  }

  destroy() {
    this.map?.remove();
    this.map = null;
    this.markers.clear();
    this.overlayLayers = [];
    this.overlayBounds = [];
  }

  createOverlayLayers(overlay) {
    switch (overlay.kind) {
      case "polygon":
        return [this.createPolygonOverlay(overlay)];
      case "route":
        return this.createRouteOverlay(overlay);
      default:
        return [];
    }
  }

  createPolygonOverlay(overlay) {
    const layer = window.L.polygon(overlay.points, this.getPolygonStyle(overlay));

    layer.on("click", () => {
      const entity = this.findEntityForOverlay(overlay);

      if (entity) {
        this.onSelect?.(entity.id);
        return;
      }

      const overlayEntry = this.overlayEntries.find(({ overlay: item }) => item.id === overlay.id);
      this.applyOverlaySelection(overlayEntry);
    });

    if (overlay.label) {
      layer.bindTooltip(overlay.label, {
        direction: "center",
        sticky: true,
        opacity: 0.92,
      });
    }

    layer.addTo(this.map);
    this.overlayBounds.push(...overlay.points);
    return layer;
  }

  createRouteOverlay(overlay) {
    const palette = overlayPalette[overlay.tone] ?? overlayPalette.light;
    const routeLayer = window.L.polyline(overlay.points, this.getRouteStyle(overlay));

    if (overlay.label) {
      routeLayer.bindTooltip(overlay.label, {
        direction: overlay.tooltipDirection ?? "top",
        sticky: true,
        opacity: 0.92,
      });
    }

    routeLayer.addTo(this.map);
    this.overlayBounds.push(...overlay.points);

    const arrowLayers = (overlay.arrowFractions ?? []).map((fraction) => {
      const arrowData = this.getPointAlongRoute(overlay.points, fraction);
      const arrowIcon = window.L.divIcon({
        className: "taxi-arrow-wrapper",
        html: `<span class="${palette.arrowClass}" style="transform: rotate(${arrowData.bearing}deg)">➜</span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const arrowMarker = window.L.marker(arrowData.point, {
        pane: "airfield-route-pane",
        icon: arrowIcon,
        interactive: false,
      });

      arrowMarker.addTo(this.map);
      return arrowMarker;
    });

    return [routeLayer, ...arrowLayers];
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

        return {
          point: [lat, lng],
          bearing,
        };
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
