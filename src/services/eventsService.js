import { get } from "./httpClient";

export function getEvents({
  status,
  location,
  page = 0,
  size = 6,
  sort = "date,asc",
} = {}) {
  return get("/events", {
    status: status && status !== "all" ? status : undefined,
    location,
    page,
    size,
    sort,
  });
}

export function getEventLocations() {
  return get("/events/locations");
}

export function getEventById(id) {
  return get(`/events/${id}`);
}
