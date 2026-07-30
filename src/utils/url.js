import { API_BASE_URL } from "../services/httpClient";

// Origen del backend (sin el /api final) para servir /uploads/** estatico.
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveAssetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;

  // Imagenes subidas desde el admin: viven en el backend (/uploads/...).
  if (path.startsWith("/uploads/")) {
    return `${API_ORIGIN}${path}`;
  }

  // Imagenes semilla que ya vienen empaquetadas con el frontend.
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}
