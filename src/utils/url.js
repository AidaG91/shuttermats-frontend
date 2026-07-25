export function resolveAssetUrl(path) {
  if (!path) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}
