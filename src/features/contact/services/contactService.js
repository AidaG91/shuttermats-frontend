import { post } from "../../../shared/services/httpClient";

export function sendContactMessage(data) {
  return post("/contact", data);
}
