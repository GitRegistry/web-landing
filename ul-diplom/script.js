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
const pdfButton = document.querySelector("#pdfButton");

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
let currentPoints = null;
let currentDistanceKm = null;
let currentStats = null;

const fallbackCustomer = "Name des Kunden";
const fallbackPilot = "Name des Piloten";
const scriptBaseUrl = new URL(document.currentScript?.src || window.location.href, window.location.href);

function assetUrl(path) {
  return new URL(path, scriptBaseUrl).href;
}

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
  currentPoints = null;
  currentDistanceKm = null;
  currentStats = null;
  pdfButton.disabled = true;
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

function statText(value, unit, maximumFractionDigits = 0) {
  return Number.isFinite(value) ? `${formatNumber(value, maximumFractionDigits)} ${unit}` : `- ${unit}`;
}

function resetStats() {
  maxSpeedOutput.textContent = "- km/h";
  maxAltitudeOutput.textContent = "- ft";
  flightTimeOutput.textContent = "--:--";
}

function updateStats(stats) {
  maxSpeedOutput.textContent = statText(stats.maxSpeedKmh, "km/h");
  maxAltitudeOutput.textContent = statText(stats.maxAltitudeFt, "ft");
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

function scheduleFitRoute() {
  fitRoute();
  window.setTimeout(fitRoute, 80);
  window.setTimeout(fitRoute, 260);
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

function loadImage(src, timeout = 6500) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => {
      image.onload = null;
      image.onerror = null;
      reject(new Error(`Bild konnte nicht rechtzeitig geladen werden: ${src}`));
    }, timeout);

    image.crossOrigin = "anonymous";
    image.onload = () => {
      window.clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error(`Bild konnte nicht geladen werden: ${src}`));
    };
    image.src = src;
  });
}

function imageToDataUrl(src) {
  return loadImage(src).then((image) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return canvas.toDataURL("image/png");
  });
}

function lonLatToPixel(point, zoom) {
  const sinLat = Math.sin((point.lat * Math.PI) / 180);
  const scale = 256 * 2 ** zoom;

  return {
    x: ((point.lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function chooseMapZoom(points, width, height, padding) {
  for (let zoom = 17; zoom >= 4; zoom -= 1) {
    const pixels = points.map((point) => lonLatToPixel(point, zoom));
    const xs = pixels.map((point) => point.x);
    const ys = pixels.map((point) => point.y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);

    if (spanX <= width - padding * 2 && spanY <= height - padding * 2) {
      return zoom;
    }
  }

  return 4;
}

async function drawSatelliteRouteImage(points) {
  const width = 1800;
  const height = 1164;
  const padding = 180;
  const tileSize = 256;
  const zoom = chooseMapZoom(points, width, height, padding);
  const pixels = points.map((point) => lonLatToPixel(point, zoom));
  const xs = pixels.map((point) => point.x);
  const ys = pixels.map((point) => point.y);
  const center = {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
  const topLeft = {
    x: Math.round(center.x - width / 2),
    y: Math.round(center.y - height / 2),
  };
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  context.fillStyle = "#dbe7ee";
  context.fillRect(0, 0, width, height);

  const firstTileX = Math.floor(topLeft.x / tileSize);
  const lastTileX = Math.floor((topLeft.x + width) / tileSize);
  const firstTileY = Math.floor(topLeft.y / tileSize);
  const lastTileY = Math.floor((topLeft.y + height) / tileSize);
  const tileCount = 2 ** zoom;
  const tilePromises = [];

  for (let x = firstTileX; x <= lastTileX; x += 1) {
    for (let y = firstTileY; y <= lastTileY; y += 1) {
      if (y < 0 || y >= tileCount) {
        continue;
      }

      const wrappedX = ((x % tileCount) + tileCount) % tileCount;
      const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${wrappedX}`;

      tilePromises.push(
        loadImage(url)
          .then((image) => {
            context.drawImage(image, x * tileSize - topLeft.x, y * tileSize - topLeft.y, tileSize, tileSize);
          })
          .catch(() => {
            context.fillStyle = "#cfdce5";
            context.fillRect(x * tileSize - topLeft.x, y * tileSize - topLeft.y, tileSize, tileSize);
          }),
      );
    }
  }

  await Promise.all(tilePromises);

  const projected = pixels.map((point) => ({
    x: point.x - topLeft.x,
    y: point.y - topLeft.y,
  }));

  function strokeRoute(color, widthPx, alpha = 1) {
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = color;
    context.lineWidth = widthPx;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();
    context.restore();
  }

  strokeRoute("#07131f", 34, 0.82);
  strokeRoute("#ffffff", 22);
  strokeRoute("#ff2b6d", 12);

  function drawMarker(point, fill) {
    context.beginPath();
    context.arc(point.x, point.y, 22, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = 8;
    context.strokeStyle = "#ffffff";
    context.stroke();
  }

  drawMarker(projected[0], "#1e8a78");
  drawMarker(projected[projected.length - 1], "#ff2b6d");

  return canvas.toDataURL("image/jpeg", 0.92);
}

function drawCenteredText(pdf, text, x, y, maxWidth, lineHeight) {
  const lines = pdf.splitTextToSize(text, maxWidth);
  lines.forEach((line, index) => {
    pdf.text(line, x, y + index * lineHeight, { align: "center" });
  });
}

function drawRightText(pdf, text, x, y, maxWidth, lineHeight) {
  const lines = pdf.splitTextToSize(text, maxWidth);
  lines.forEach((line, index) => {
    pdf.text(line, x, y + index * lineHeight, { align: "right" });
  });
}

function sanitizeFilenamePart(value) {
  return (value || "ul-diplom")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "ul-diplom";
}

async function createDiplomaPdf() {
  if (!currentPoints) {
    statusText.textContent = "Bitte zuerst eine GPX-Datei hochladen.";
    return;
  }

  if (!window.jspdf?.jsPDF) {
    statusText.textContent = "PDF-Bibliothek konnte nicht geladen werden.";
    return;
  }

  pdfButton.disabled = true;
  statusText.textContent = "PDF wird erstellt...";

  try {
    const [{ jsPDF }, mapImage, paluvLogo, fasLogo] = await Promise.all([
      Promise.resolve(window.jspdf),
      drawSatelliteRouteImage(currentPoints),
      imageToDataUrl(assetUrl("assets/paluvlogo.png")),
      imageToDataUrl(assetUrl("assets/FASLogo.png")),
    ]);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    const customerName = customerInput.value.trim() || fallbackCustomer;
    const pilotName = pilotInput.value.trim() || fallbackPilot;
    const routeSummary = `${formatNumber(currentDistanceKm)} km Flugroute · ${formatNumber(currentPoints.length, 0)} GPX-Punkte`;

    pdf.setFillColor(255, 250, 240);
    pdf.rect(0, 0, 210, 297, "F");
    pdf.setFillColor(246, 238, 218);
    pdf.rect(0, 0, 210, 297, "F");
    pdf.setDrawColor(201, 154, 53);
    pdf.setLineWidth(0.35);
    pdf.rect(7, 7, 196, 283);

    pdf.addImage(paluvLogo, "PNG", 16, 14, 33, 15);
    pdf.addImage(fasLogo, "PNG", 170, 14, 23, 23);

    pdf.setFont("times", "normal");
    pdf.setTextColor(17, 98, 84);
    pdf.setFontSize(13);
    pdf.text("Flight Academy Speyer", 105, 38, { align: "center" });

    pdf.setTextColor(36, 48, 60);
    pdf.setFont("times", "bold");
    pdf.setFontSize(48);
    pdf.text("UL Flug-", 105, 59, { align: "center" });
    pdf.text("Diplom", 105, 78, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(122, 95, 32);
    pdf.text("Einmal Himmel und zurueck", 105, 88, { align: "center" });

    pdf.setFillColor(255, 255, 255);
    pdf.rect(10, 94, 190, 126, "F");
    pdf.addImage(mapImage, "JPEG", 13, 97, 184, 119);
    pdf.setDrawColor(190, 190, 190);
    pdf.setLineWidth(0.25);
    pdf.rect(10, 94, 190, 126);

    const statY = 226;
    const statWidth = 50;
    const statGap = 6;
    const statX = [23, 23 + statWidth + statGap, 23 + (statWidth + statGap) * 2];
    const stats = [
      ["MAX SPEED", statText(currentStats.maxSpeedKmh, "km/h")],
      ["MAX ALTITUDE", statText(currentStats.maxAltitudeFt, "ft")],
      ["FLIGHT TIME", formatDuration(currentStats.flightTimeMs)],
    ];

    pdf.setLineWidth(0.2);
    stats.forEach(([label, value], index) => {
      pdf.setDrawColor(201, 154, 53);
      pdf.rect(statX[index], statY, statWidth, 15);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(109, 116, 124);
      pdf.text(label, statX[index] + statWidth / 2, statY + 5.5, { align: "center" });
      pdf.setFontSize(12);
      pdf.setTextColor(36, 48, 60);
      pdf.text(value, statX[index] + statWidth / 2, statY + 11.7, { align: "center" });
    });

    pdf.setDrawColor(52, 65, 83);
    pdf.setLineWidth(0.6);
    pdf.line(23, 250, 87, 250);
    pdf.line(123, 250, 187, 250);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(109, 116, 124);
    pdf.text("KUNDE", 23, 257);
    pdf.text("PILOT", 187, 257, { align: "right" });

    pdf.setFont("times", "bold");
    pdf.setFontSize(23);
    pdf.setTextColor(23, 32, 42);
    drawCenteredText(pdf, customerName, 55, 267, 66, 9);
    drawRightText(pdf, pilotName, 187, 267, 66, 9);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(122, 95, 32);
    pdf.text(routeSummary, 105, 287, { align: "center" });

    pdf.save(`ul-diplom-${sanitizeFilenamePart(customerName)}.pdf`);
    statusText.textContent = "PDF wurde erstellt.";
  } catch (error) {
    statusText.textContent = `PDF konnte nicht erstellt werden: ${error.message}`;
  } finally {
    pdfButton.disabled = !currentPoints;
  }
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
  scheduleFitRoute();
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
    currentPoints = points;
    currentDistanceKm = kilometers;
    currentStats = stats;
    updateStats(stats);
    routeInfo.textContent = `${formatNumber(kilometers)} km Flugroute · ${formatNumber(points.length, 0)} GPX-Punkte`;
    await waitForTiles();
    pdfButton.disabled = false;
    statusText.textContent = `Route geladen: ${formatNumber(kilometers)} km aus ${formatNumber(points.length, 0)} Punkten.`;
  } catch (error) {
    clearRoute();
    resetStats();
    pdfButton.disabled = true;
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
    pdfButton.disabled = true;
    emptyMap.classList.remove("is-hidden");

    clearRoute();
    map.setView([49.302, 8.451], 11);
  }, 0);
});

pdfButton.addEventListener("click", () => {
  createDiplomaPdf();
});

window.addEventListener("resize", () => {
  scheduleFitRoute();
});

window.addEventListener("load", () => {
  syncNames();
  scheduleFitRoute();
});
