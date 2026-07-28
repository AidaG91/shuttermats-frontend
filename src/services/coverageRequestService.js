import { post } from "./httpClient";

export function requestCoverage(data) {
  return post("/requests", data);
}
