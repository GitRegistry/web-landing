import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { sampleEntities } from "../js/data/entities.js";
import { airfieldOverlays } from "../js/data/airfield-overlays.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const festMapDir = path.resolve(__dirname, "..");
const dataDir = path.join(festMapDir, "data");

async function ensureDir(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

function normalizeEntity(entity) {
  return {
    id: entity.id,
    type: entity.type,
    markerKind: entity.markerKind,
    coordinates: entity.coordinates,
    name: entity.name,
    location: entity.location,
    summary: entity.summary,
    description: entity.description,
    website: entity.website ?? "",
    phone: entity.phone ?? "",
    email: entity.email ?? "",
    image: entity.logo ?? entity.image ?? "",
    useLogoMarker: false,
  };
}

function normalizeOverlay(overlay) {
  const categoryByTone = {
    parking: "parking",
    alert: "exit",
    light: "route",
    cyan: "area",
  };

  return {
    id: overlay.id,
    kind: overlay.kind,
    label: overlay.label ?? { de: "", en: "" },
    points: overlay.points,
    tone: overlay.tone ?? "light",
    weight: overlay.weight ?? null,
    opacity: overlay.opacity ?? null,
    fillOpacity: overlay.fillOpacity ?? null,
    dashArray: overlay.dashArray ?? "",
    arrowFractions: Array.isArray(overlay.arrowFractions) ? overlay.arrowFractions : [],
    category: overlay.category ?? categoryByTone[overlay.tone] ?? "area",
  };
}

async function writeJson(filename, value) {
  const targetPath = path.join(dataDir, filename);
  await fs.writeFile(targetPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

await ensureDir(dataDir);
await writeJson("entities.json", sampleEntities.map(normalizeEntity));
await writeJson("overlays.json", airfieldOverlays.map(normalizeOverlay));

console.log(`Exported Fest Map data to ${dataDir}`);
