const customerInput = document.querySelector("#customerName");
const pilotInput = document.querySelector("#pilotName");
const fileInput = document.querySelector("#gpxFile");
const fileLabel = document.querySelector("#fileLabel");
const customerOutput = document.querySelector("#customerOutput");
const pilotOutput = document.querySelector("#pilotOutput");
const maxSpeedOutput = document.querySelector("#maxSpeedOutput");
const maxAltitudeOutput = document.querySelector("#maxAltitudeOutput");
const flightTimeOutput = document.querySelector("#flightTimeOutput");
const routeInfo = document.querySelector("#routeInfo");
const statusText = document.querySelector("#statusText");
const emptyMap = document.querySelector("#emptyMap");
const form = document.querySelector("#diplomaForm");
const printButton = document.querySelector("#printButton");

const map = L.map("map", {
  zoomControl: false,
  attributionControl: true,
  scrollWheelZoom: false,
  dragging: true,
  fadeAnimation: false,
  markerZoomAnimation: false,
  zoomAnimation: false,
}).setView([49.302, 8.451], 11);

const imageryLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "Tiles &copy; Esri",
  fadeAnimation: false,
  keepBuffer: 4,
  maxZoom: 19,
}).addTo(map);

let routeLayer = null;
let markerLayer = null;
let routeBounds = null;
let tilesLoading = false;

const fallbackCustomer = "Name des Kunden";
const fallbackPilot = "Name des Piloten";

imageryLayer.on("loading", () => {
  tilesLoading = true;
});

imageryLayer.on("load", () => {
  tilesLoading = false;
});

function syncNames() {
  customerOutput.textContent = customerInput.value.trim() || fallbackCustomer;
  pilotOutput.textContent = pilotInput.value.trim() || fallbackPilot;
}

function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits }).format(value);
}

function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return "--:--";
  }

  const totalMinutes = Math.max(1, Math.round(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getGpxElements(xml, localName) {
  const plain = Array.from(xml.getElementsByTagName(localName));
  const namespaced = Array.from(xml.getElementsByTagNameNS("*", localName));
  return [...new Set([...plain, ...namespaced])];
}

function getChildText(element, localName) {
  return Array.from(element.children).find((child) => child.localName === localName)?.textContent?.trim() || "";
}

function readPoint(element) {
  const lat = Number.parseFloat(element.getAttribute("lat"));
  const lon = Number.parseFloat(element.getAttribute("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const elevationMeters = Number.parseFloat(getChildText(element, "ele"));
  const timeValue = Date.parse(getChildText(element, "time"));

  return {
    lat,
    lon,
    elevationMeters: Number.isFinite(elevationMeters) ? elevationMeters : null,
    timeMs: Number.isFinite(timeValue) ? timeValue : null,
  };
}

function parseGpx(text) {
  const xml = new DOMParser().parseFromString(text, "application/xml");
  const parseError = xml.querySelector("parsererror");

  if (parseError) {
    throw new Error("Die GPX-Datei konnte nicht gelesen werden.");
  }

  const trackPoints = getGpxElements(xml, "trkpt").map(readPoint).filter(Boolean);
  const routePoints = getGpxElements(xml, "rtept").map(readPoint).filter(Boolean);
  const wayPoints = getGpxElements(xml, "wpt").map(readPoint).filter(Boolean);
  const points = trackPoints.length ? trackPoints : routePoints.length ? routePoints : wayPoints;

  if (points.length < 2) {
    throw new Error("In dieser GPX-Datei wurden nicht genug Punkte gefunden.");
  }

  return points;
}

function clearRoute() {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }

  if (markerLayer) {
    map.removeLayer(markerLayer);
    markerLayer = null;
  }

  routeBounds = null;
}

function distanceBetween(a, b) {
  const earthRadiusKm = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = toRad(b.lat - a.lat);
  const deltaLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function routeDistance(points) {
  return points.slice(1).reduce((total, point, index) => total + distanceBetween(points[index], point), 0);
}

function routeStats(points) {
  const elevations = points
    .map((point) => point.elevationMeters)
    .filter((elevation) => Number.isFinite(elevation));
  const timestamps = points
    .map((point) => point.timeMs)
    .filter((timeMs) => Number.isFinite(timeMs));

  const maxAltitudeFt = elevations.length ? Math.max(...elevations) * 3.28084 : null;
  const flightTimeMs = timestamps.length >= 2 ? timestamps[timestamps.length - 1] - timestamps[0] : null;
  let maxSpeedKmh = null;

  points.slice(1).forEach((point, index) => {
    const previous = points[index];

    if (!Number.isFinite(previous.timeMs) || !Number.isFinite(point.timeMs)) {
      return;
    }

    const hours = (point.timeMs - previous.timeMs) / 3600000;

    if (hours <= 0) {
      return;
    }

    const speed = distanceBetween(previous, point) / hours;
    maxSpeedKmh = maxSpeedKmh === null ? speed : Math.max(maxSpeedKmh, speed);
  });

  return {
    maxAltitudeFt,
    maxSpeedKmh,
    flightTimeMs: Number.isFinite(flightTimeMs) && flightTimeMs > 0 ? flightTimeMs : null,
  };
}

function resetStats() {
  maxSpeedOutput.textContent = "- km/h";
  maxAltitudeOutput.textContent = "- ft";
  flightTimeOutput.textContent = "--:--";
}

function updateStats(stats) {
  maxSpeedOutput.textContent = Number.isFinite(stats.maxSpeedKmh)
    ? `${formatNumber(stats.maxSpeedKmh, 0)} km/h`
    : "- km/h";
  maxAltitudeOutput.textContent = Number.isFinite(stats.maxAltitudeFt)
    ? `${formatNumber(stats.maxAltitudeFt, 0)} ft`
    : "- ft";
  flightTimeOutput.textContent = formatDuration(stats.flightTimeMs);
}

function fitRoute() {
  map.invalidateSize();

  if (!routeBounds) {
    return;
  }

  map.fitBounds(routeBounds, {
    padding: [28, 28],
    maxZoom: 16,
  });
}

function waitForTiles(timeout = 1800) {
  if (!tilesLoading) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timer = window.setTimeout(done, timeout);

    function done() {
      window.clearTimeout(timer);
      imageryLayer.off("load", done);
      resolve();
    }

    imageryLayer.once("load", done);
  });
}

function drawRoute(points) {
  clearRoute();
  const latLngs = points.map((point) => [point.lat, point.lon]);
  routeBounds = L.latLngBounds(latLngs);

  const routeOutline = L.polyline(latLngs, {
    color: "#07131f",
    weight: 16,
    opacity: 0.82,
    lineCap: "round",
    lineJoin: "round",
  });

  const routeGlow = L.polyline(latLngs, {
    color: "#ffffff",
    weight: 10,
    opacity: 1,
    lineCap: "round",
    lineJoin: "round",
  });

  const routeLine = L.polyline(latLngs, {
    color: "#ff2b6d",
    weight: 6,
    opacity: 1,
    lineCap: "round",
    lineJoin: "round",
  });

  routeLayer = L.layerGroup([routeOutline, routeGlow, routeLine]).addTo(map);

  const start = latLngs[0];
  const end = latLngs[latLngs.length - 1];

  markerLayer = L.layerGroup([
    L.circleMarker(start, {
      radius: 10,
      color: "#ffffff",
      weight: 4,
      fillColor: "#1e8a78",
      fillOpacity: 1,
    }).bindTooltip("Start"),
    L.circleMarker(end, {
      radius: 10,
      color: "#ffffff",
      weight: 4,
      fillColor: "#ff2b6d",
      fillOpacity: 1,
    }).bindTooltip("Ziel"),
  ]).addTo(map);

  routeOutline.bringToFront();
  routeGlow.bringToFront();
  routeLine.bringToFront();
  markerLayer.eachLayer((layer) => layer.bringToFront());

  emptyMap.classList.add("is-hidden");
  fitRoute();
  window.setTimeout(fitRoute, 250);
}

async function handleGpxUpload(file) {
  if (!file) {
    return;
  }

  fileLabel.textContent = file.name;
  statusText.textContent = "GPX wird geladen...";

  try {
    const points = parseGpx(await file.text());
    drawRoute(points);

    const kilometers = routeDistance(points);
    const stats = routeStats(points);
    updateStats(stats);
    routeInfo.textContent = `${formatNumber(kilometers)} km Flugroute · ${formatNumber(points.length, 0)} GPX-Punkte`;
    await waitForTiles();
    statusText.textContent = `Route geladen: ${formatNumber(kilometers)} km aus ${formatNumber(points.length, 0)} Punkten.`;
  } catch (error) {
    clearRoute();
    resetStats();
    emptyMap.classList.remove("is-hidden");
    statusText.textContent = error.message;
    routeInfo.textContent = "Bitte eine GPX-Datei mit Track- oder Routenpunkten hochladen.";
  }
}

customerInput.addEventListener("input", syncNames);
pilotInput.addEventListener("input", syncNames);

fileInput.addEventListener("change", (event) => {
  handleGpxUpload(event.target.files[0]);
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    syncNames();
    fileLabel.textContent = "Datei auswählen";
    statusText.textContent = "Noch kein GPX geladen.";
    routeInfo.textContent = "Route wird nach dem Upload berechnet.";
    resetStats();
    emptyMap.classList.remove("is-hidden");

    clearRoute();
    map.setView([49.302, 8.451], 11);
  }, 0);
});

printButton.addEventListener("click", async () => {
  printButton.disabled = true;
  statusText.textContent = routeBounds ? "Karte wird fuer den Druck vorbereitet..." : statusText.textContent;

  fitRoute();
  window.setTimeout(fitRoute, 80);
  await waitForTiles(2200);

  printButton.disabled = false;
  window.print();
});

window.addEventListener("beforeprint", () => {
  fitRoute();
});

window.addEventListener("load", () => {
  syncNames();
  fitRoute();
});
