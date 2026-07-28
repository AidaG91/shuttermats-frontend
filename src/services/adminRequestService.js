import { get } from "./httpClient";
import { getAdminToken } from "./authService";

export function getAdminRequests({ status, page = 0, size = 10, sort = "createdAt,desc" } = {}) {
  const token = getAdminToken();

  return get(
    "/admin/requests",
    { status, page, size, sort },
    { Authorization: `Bearer ${token}` },
  );
}
