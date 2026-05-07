import { createEntityMarkerIcon } from "./map-icons.js";

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

export class MapController {
  constructor(container, { center, zoom, onSelect }) {
    this.container = container;
    this.center = center;
    this.zoom = zoom;
    this.onSelect = onSelect;
    this.entities = [];
    this.markers = new Map();
    this.overlayDefinitions = [];
    this.overlayLayers = [];
    this.overlayBounds = [];
    this.selectedId = null;
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
    this.overlayBounds = [];

    this.overlayLayers.forEach((layer) => layer.remove());
    this.overlayLayers = [];

    this.overlayDefinitions.forEach((overlay) => {
      const layers = this.createOverlayLayers(overlay);
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
    const scale = Math.max(0.42, Math.min(1.08, 0.42 + (zoom - 13) * 0.11));
    this.container.style.setProperty("--marker-scale", scale.toFixed(2));
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

  focusEntity(entity, { flyTo = true } = {}) {
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

    if (flyTo) {
      const nextZoom = Math.max(this.map.getZoom(), 18);
      this.map.flyTo(entity.coordinates, nextZoom, { duration: 0.9 });
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
    const palette = overlayPalette[overlay.tone] ?? overlayPalette.cyan;
    const layer = window.L.polygon(overlay.points, {
      pane: "airfield-zone-pane",
      color: palette.color,
      weight: overlay.weight ?? 2.5,
      fillColor: palette.fillColor,
      fillOpacity: overlay.fillOpacity ?? 0.08,
      dashArray: overlay.dashArray ?? "8 6",
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
    const routeLayer = window.L.polyline(overlay.points, {
      pane: "airfield-route-pane",
      color: palette.routeColor,
      weight: overlay.weight ?? (overlay.tone === "alert" ? 4 : 5),
      opacity: overlay.opacity ?? 0.92,
      dashArray: overlay.dashArray ?? null,
      lineCap: "round",
      lineJoin: "round",
    });

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
