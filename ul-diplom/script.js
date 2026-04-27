const customerInput = document.querySelector("#customerName");
const pilotInput = document.querySelector("#pilotName");
const fileInput = document.querySelector("#gpxFile");
const fileLabel = document.querySelector("#fileLabel");
const customerOutput = document.querySelector("#customerOutput");
const pilotOutput = document.querySelector("#pilotOutput");
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
}).setView([49.302, 8.451], 11);

L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "Tiles &copy; Esri",
  maxZoom: 19,
}).addTo(map);

let routeLayer = null;
let markerLayer = null;

const fallbackCustomer = "Name des Kunden";
const fallbackPilot = "Name des Piloten";

function syncNames() {
  customerOutput.textContent = customerInput.value.trim() || fallbackCustomer;
  pilotOutput.textContent = pilotInput.value.trim() || fallbackPilot;
}

function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits }).format(value);
}

function getGpxElements(xml, localName) {
  const plain = Array.from(xml.getElementsByTagName(localName));
  const namespaced = Array.from(xml.getElementsByTagNameNS("*", localName));
  return [...new Set([...plain, ...namespaced])];
}

function readPoint(element) {
  const lat = Number.parseFloat(element.getAttribute("lat"));
  const lon = Number.parseFloat(element.getAttribute("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return [lat, lon];
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
}

function distanceBetween(a, b) {
  const earthRadiusKm = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = toRad(b[0] - a[0]);
  const deltaLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function routeDistance(points) {
  return points.slice(1).reduce((total, point, index) => total + distanceBetween(points[index], point), 0);
}

function drawRoute(points) {
  clearRoute();

  const routeOutline = L.polyline(points, {
    color: "#ffef5f",
    weight: 7,
    opacity: 0.95,
    lineJoin: "round",
  });

  const routeLine = L.polyline(points, {
    color: "#12334d",
    weight: 3,
    opacity: 0.95,
    lineJoin: "round",
  });

  routeLayer = L.layerGroup([routeOutline, routeLine]).addTo(map);

  const start = points[0];
  const end = points[points.length - 1];

  markerLayer = L.layerGroup([
    L.circleMarker(start, {
      radius: 7,
      color: "#ffffff",
      weight: 3,
      fillColor: "#1e8a78",
      fillOpacity: 1,
    }).bindTooltip("Start"),
    L.circleMarker(end, {
      radius: 7,
      color: "#ffffff",
      weight: 3,
      fillColor: "#c99a35",
      fillOpacity: 1,
    }).bindTooltip("Ziel"),
  ]).addTo(map);

  map.fitBounds(routeLine.getBounds(), {
    padding: [34, 34],
    maxZoom: 13,
  });

  emptyMap.classList.add("is-hidden");
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
    routeInfo.textContent = `${formatNumber(kilometers)} km Flugroute · ${formatNumber(points.length, 0)} GPX-Punkte`;
    statusText.textContent = `Route geladen: ${formatNumber(kilometers)} km aus ${formatNumber(points.length, 0)} Punkten.`;
  } catch (error) {
    clearRoute();
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
    emptyMap.classList.remove("is-hidden");

    clearRoute();
    map.setView([49.302, 8.451], 11);
  }, 0);
});

printButton.addEventListener("click", () => {
  map.invalidateSize();
  window.setTimeout(() => window.print(), 160);
});

window.addEventListener("beforeprint", () => {
  map.invalidateSize();
});

window.addEventListener("load", () => {
  syncNames();
  map.invalidateSize();
});
