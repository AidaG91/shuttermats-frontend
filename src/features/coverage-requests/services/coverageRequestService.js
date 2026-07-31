import { post } from "../../../shared/services/httpClient";

export function requestCoverage(data) {
  return post("/requests", data);
}
