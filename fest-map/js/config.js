export const assetVersion = "20260508-cache-refresh-1";

export function withAssetVersion(value) {
  const url = String(value ?? "").trim();

  if (!url || /^(?:data:|blob:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(assetVersion)}`;
}

export const defaultMapView = {
  center: [49.3088, 8.44895],
  zoom: 18,
};

export const dataEndpoints = {
  entities: withAssetVersion("/data/entities.json"),
  overlays: withAssetVersion("/data/overlays.json"),
  events: withAssetVersion("/data/events.json"),
};
