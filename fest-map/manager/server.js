import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const festMapDir = path.resolve(repoRoot, "fest-map");
const publicDir = festMapDir;
const managerDir = path.join(festMapDir, "manager");
const assetsDir = path.join(festMapDir, "assets");
const uploadsDir = path.join(assetsDir, "uploads");
const dataDir = path.join(festMapDir, "data");
const entitiesPath = path.join(dataDir, "entities.json");
const overlaysPath = path.join(dataDir, "overlays.json");
const eventsPath = path.join(dataDir, "events.json");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const tones = new Set([
  "cyan",
  "light",
  "parking",
  "alert",
  "eventBlue",
  "eventRed",
  "eventGreen",
  "eventPurple",
  "eventCyan",
  "eventYellow",
  "eventPink",
  "eventOrange",
  "eventTeal",
]);
const markerTones = new Set([
  "eventBlue",
  "eventRed",
  "eventGreen",
  "eventPurple",
  "eventCyan",
  "eventYellow",
  "eventPink",
  "eventOrange",
  "eventTeal",
]);
const overlayCategories = new Set(["parking", "exit", "fence", "route", "area", "event"]);
const entityTypes = new Set(["company", "point", "service", "entry", "roundflight"]);
const legacyEntityTypes = new Map([
  ["building", "company"],
  ["area", "company"],
]);
const markerKinds = new Set([
  "area",
  "airplane",
  "authority",
  "beer",
  "boat",
  "building",
  "club",
  "coffee",
  "disabled-parking",
  "drink",
  "drinks",
  "exit",
  "first-aid",
  "flight",
  "food",
  "gate",
  "heli",
  "hub",
  "ice-cream",
  "info",
  "numbered",
  "parking",
  "parking-direction-t",
  "restaurant",
  "school",
  "shop",
  "submarine",
  "ticket",
  "toilet",
  "wc",
  "wc-disabled",
]);

const app = express();
const port = Number(process.env.PORT || 4173);

await fs.mkdir(uploadsDir, { recursive: true });

app.use(express.json({ limit: "10mb" }));

app.use("/manager", express.static(managerDir));
app.use(express.static(publicDir));

function okJson(response, payload) {
  response.setHeader("Cache-Control", "no-store");
  response.json(payload);
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeLocalizedText(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      de: String(value.de ?? "").trim(),
      en: String(value.en ?? "").trim(),
    };
  }

  const text = String(value ?? "").trim();
  return { de: text, en: text };
}

function normalizeCoordinates(value) {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }

  const latitude = Number(value[0]);
  const longitude = Number(value[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return [latitude, longitude];
}

function slugify(value, fallback) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

function normalizeEntity(entity, index) {
  const coordinates = normalizeCoordinates(entity.coordinates) ?? [49.3088, 8.44895];
  const fallbackId = `entry-${index + 1}`;
  const markerKind = markerKinds.has(entity.markerKind) ? entity.markerKind : "info";
  const type = entityTypes.has(entity.type)
    ? entity.type
    : legacyEntityTypes.get(entity.type) ?? "service";
  const image = String(entity.image ?? "").trim();
  const markerLabel = String(entity.markerLabel ?? "").trim();
  const markerTone = markerTones.has(entity.markerTone) ? entity.markerTone : "";

  const normalized = {
    id: slugify(entity.id, fallbackId),
    type,
    markerKind,
    coordinates,
    name: normalizeLocalizedText(entity.name),
    location: normalizeLocalizedText(entity.location),
    summary: normalizeLocalizedText(entity.summary),
    description: normalizeLocalizedText(entity.description),
    website: String(entity.website ?? "").trim(),
    phone: String(entity.phone ?? "").trim(),
    email: String(entity.email ?? "").trim(),
    image,
    useLogoMarker: Boolean(entity.useLogoMarker),
  };

  if (markerLabel) {
    normalized.markerLabel = markerLabel;
  }

  if (markerTone) {
    normalized.markerTone = markerTone;
  }

  return normalized;
}

function normalizePointList(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points.map(normalizeCoordinates).filter(Boolean);
}

function normalizeArrowFractions(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item >= 0 && item <= 1);
}

function normalizeOverlay(overlay, index) {
  const kind = overlay.kind === "polygon" ? "polygon" : "route";
  const points = normalizePointList(overlay.points);
  const minPoints = kind === "polygon" ? 3 : 2;
  const tone = tones.has(overlay.tone) ? overlay.tone : kind === "polygon" ? "cyan" : "light";
  const category = overlayCategories.has(overlay.category) ? overlay.category : kind === "polygon" ? "area" : "route";

  if (points.length < minPoints) {
    return null;
  }

  return {
    id: slugify(overlay.id, `overlay-${index + 1}`),
    kind,
    label: normalizeLocalizedText(overlay.label),
    points,
    tone,
    weight: Number.isFinite(Number(overlay.weight)) ? Number(overlay.weight) : null,
    opacity: Number.isFinite(Number(overlay.opacity)) ? Number(overlay.opacity) : null,
    fillOpacity: Number.isFinite(Number(overlay.fillOpacity)) ? Number(overlay.fillOpacity) : null,
    dashArray: String(overlay.dashArray ?? "").trim(),
    arrowFractions: normalizeArrowFractions(overlay.arrowFractions),
    category,
  };
}

function normalizeEvent(event, index) {
  return {
    id: slugify(event.id, `event-${index + 1}`),
    date: String(event.date ?? "").trim(),
    time: String(event.time ?? "").trim(),
    title: normalizeLocalizedText(event.title),
    description: normalizeLocalizedText(event.description),
    locationEntryId: String(event.locationEntryId ?? "").trim(),
  };
}

async function listAssets(directoryPath = assetsDir, prefix = "/assets") {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const absolutePath = path.join(directoryPath, entry.name);
    const relativePath = `${prefix}/${entry.name}`;

    if (entry.isDirectory()) {
      results.push(...(await listAssets(absolutePath, relativePath)));
      continue;
    }

    if (!/\.(svg|png|jpe?g|gif|webp|avif)$/i.test(entry.name)) {
      continue;
    }

    results.push({
      path: relativePath,
      name: entry.name,
      deletable: relativePath.startsWith("/assets/uploads/"),
    });
  }

  return results.sort((left, right) => left.path.localeCompare(right.path));
}

function getReferencedAssetPaths(entities) {
  return new Set(
    entities
      .map((entity) => String(entity.image ?? "").trim())
      .filter(Boolean),
  );
}

function ensureUploadPath(assetPath) {
  const normalized = String(assetPath ?? "").trim();

  if (!normalized.startsWith("/assets/uploads/")) {
    return null;
  }

  const relativePath = normalized.replace(/^\/+/, "");
  const absolutePath = path.resolve(festMapDir, relativePath);

  if (!absolutePath.startsWith(uploadsDir)) {
    return null;
  }

  return { normalized, absolutePath };
}

app.get("/api/entities", async (_request, response, next) => {
  try {
    okJson(response, await readJson(entitiesPath));
  } catch (error) {
    next(error);
  }
});

app.put("/api/entities", async (request, response, next) => {
  try {
    const input = Array.isArray(request.body) ? request.body : request.body?.entities;

    if (!Array.isArray(input)) {
      response.status(400).json({ error: "Expected an array of entities." });
      return;
    }

    const normalized = input.map(normalizeEntity);
    await writeJson(entitiesPath, normalized);
    okJson(response, { ok: true, count: normalized.length });
  } catch (error) {
    next(error);
  }
});

app.get("/api/overlays", async (_request, response, next) => {
  try {
    okJson(response, await readJson(overlaysPath));
  } catch (error) {
    next(error);
  }
});

app.put("/api/overlays", async (request, response, next) => {
  try {
    const input = Array.isArray(request.body) ? request.body : request.body?.overlays;

    if (!Array.isArray(input)) {
      response.status(400).json({ error: "Expected an array of overlays." });
      return;
    }

    const normalized = input.map(normalizeOverlay).filter(Boolean);
    await writeJson(overlaysPath, normalized);
    okJson(response, { ok: true, count: normalized.length });
  } catch (error) {
    next(error);
  }
});

app.get("/api/events", async (_request, response, next) => {
  try {
    okJson(response, await readJson(eventsPath));
  } catch (error) {
    next(error);
  }
});

app.put("/api/events", async (request, response, next) => {
  try {
    const input = Array.isArray(request.body) ? request.body : request.body?.events;

    if (!Array.isArray(input)) {
      response.status(400).json({ error: "Expected an array of events." });
      return;
    }

    const normalized = input
      .map(normalizeEvent)
      .sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`));
    await writeJson(eventsPath, normalized);
    okJson(response, { ok: true, count: normalized.length });
  } catch (error) {
    next(error);
  }
});

app.get("/api/assets", async (_request, response, next) => {
  try {
    const [entities, assets] = await Promise.all([readJson(entitiesPath), listAssets()]);
    const referencedPaths = getReferencedAssetPaths(entities);
    okJson(
      response,
      assets.map((asset) => ({
        ...asset,
        inUse: referencedPaths.has(asset.path),
      })),
    );
  } catch (error) {
    next(error);
  }
});

app.post("/api/assets", upload.single("file"), async (request, response, next) => {
  try {
    if (!request.file) {
      response.status(400).json({ error: "Missing file upload." });
      return;
    }

    if (!request.file.mimetype.startsWith("image/")) {
      response.status(400).json({ error: "Only image uploads are supported." });
      return;
    }

    const extension = path.extname(request.file.originalname) || ".bin";
    const basename = slugify(path.basename(request.file.originalname, extension), "asset");
    const filename = `${basename}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension.toLowerCase()}`;
    const targetPath = path.join(uploadsDir, filename);

    await fs.writeFile(targetPath, request.file.buffer);

    okJson(response, {
      ok: true,
      asset: {
        path: `/assets/uploads/${filename}`,
        name: filename,
        deletable: true,
        inUse: false,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/assets", async (request, response, next) => {
  try {
    const uploadPath = ensureUploadPath(request.body?.path);

    if (!uploadPath) {
      response.status(400).json({ error: "Only uploaded assets inside /assets/uploads can be deleted." });
      return;
    }

    const entities = await readJson(entitiesPath);
    const referencedPaths = getReferencedAssetPaths(entities);

    if (referencedPaths.has(uploadPath.normalized)) {
      response.status(409).json({ error: "This asset is still referenced by an entry." });
      return;
    }

    await fs.rm(uploadPath.absolutePath, { force: true });
    okJson(response, { ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/manager", (_request, response) => {
  response.sendFile(path.join(managerDir, "index.html"));
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: "Unexpected manager server error.",
    detail: error instanceof Error ? error.message : String(error),
  });
});

app.listen(port, () => {
  console.log(`Fest Map manager running at http://localhost:${port}/manager/`);
});
