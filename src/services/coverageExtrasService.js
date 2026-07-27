import { get } from "./httpClient";

export function getActiveExtras() {
  return get("/extras");
}
