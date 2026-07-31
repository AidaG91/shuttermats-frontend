import { API_BASE_URL } from "../services/httpClient";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveAssetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;

  if (path.startsWith("/uploads/")) {
    return `${API_ORIGIN}${path}`;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}
