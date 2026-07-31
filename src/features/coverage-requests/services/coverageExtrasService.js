import { get } from "../../../shared/services/httpClient";

export function getActiveExtras() {
  return get("/extras");
}
