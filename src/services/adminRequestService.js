import { get } from "./httpClient";
import { getAdminToken } from "./authService";

export function getAdminRequests({
  status,
  eventId,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
} = {}) {
  const token = getAdminToken();

  return get(
    "/admin/requests",
    { status, eventId, page, size, sort },
    { Authorization: `Bearer ${token}` },
  );
}

export function getAdminRequestById(id) {
  const token = getAdminToken();

  return get(`/admin/requests/${id}`, undefined, {
    Authorization: `Bearer ${token}`,
  });
}
