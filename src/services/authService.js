import { post } from "./httpClient";

const TOKEN_KEY = "shuttermats_admin_token";
const EXPIRES_AT_KEY = "shuttermats_admin_token_expires_at";

export async function adminLogin(credentials) {
  const response = await post("/admin/login", credentials);
  setAdminSession(response.token, response.expiresInMs);
  return response;
}

export function setAdminSession(token, expiresInMs) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + expiresInMs));
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminAuthHeaders() {
  return { Authorization: `Bearer ${getAdminToken()}` };
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

export function isAdminAuthenticated() {
  const token = getAdminToken();
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY));
  return Boolean(token) && Number.isFinite(expiresAt) && expiresAt > Date.now();
}
