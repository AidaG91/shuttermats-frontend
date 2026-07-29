import { get, patch } from "./httpClient";
import { getAdminAuthHeaders } from "./authService";

export function getAdminRequests({
  status,
  eventId,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
} = {}) {
  return get(
    "/admin/requests",
    { status, eventId, page, size, sort },
    getAdminAuthHeaders(),
  );
}

export function getAdminRequestById(id) {
  return get(`/admin/requests/${id}`, undefined, getAdminAuthHeaders());
}

export function updateRequestStatus(id, status, adminResponse) {
  return patch(
    `/admin/requests/${id}/status`,
    { status, adminResponse },
    getAdminAuthHeaders(),
  );
}
