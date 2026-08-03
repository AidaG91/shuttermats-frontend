import { get, patch } from "../../../shared/services/httpClient";
import { getAdminAuthHeaders } from "../../auth/services/authService";

export function getAdminContactMessages({
  read,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
} = {}) {
  return get(
    "/admin/contact-messages",
    { read, page, size, sort },
    getAdminAuthHeaders(),
  );
}

export function getAdminContactMessageById(id) {
  return get(`/admin/contact-messages/${id}`, undefined, getAdminAuthHeaders());
}

export function markContactMessageAsRead(id) {
  return patch(`/admin/contact-messages/${id}/read`, {}, getAdminAuthHeaders());
}

export function saveContactMessageResponse(id, adminResponse) {
  return patch(
    `/admin/contact-messages/${id}/response`,
    { adminResponse },
    getAdminAuthHeaders(),
  );
}
