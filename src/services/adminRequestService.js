import { get, patch } from "./httpClient";
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

// adminResponse es siempre opcional en el backend: si no se incluye (undefined)
// no se toca el valor ya guardado; "" explícito lo borra.
export function updateRequestStatus(id, status, adminResponse) {
  const token = getAdminToken();

  return patch(
    `/admin/requests/${id}/status`,
    { status, adminResponse },
    { Authorization: `Bearer ${token}` },
  );
}
