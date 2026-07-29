import { postForm, putForm, del } from "./httpClient";
import { getAdminAuthHeaders } from "./authService";

function buildEventFormData(event, imageFile, imageRemoved) {
  const formData = new FormData();
  const eventBlob = new Blob(
    [
      JSON.stringify({
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description || null,
        imageUrl: imageRemoved ? "" : null,
      }),
    ],
    { type: "application/json" },
  );
  formData.append("event", eventBlob);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return formData;
}

export function createAdminEvent(event, imageFile) {
  return postForm(
    "/admin/events",
    buildEventFormData(event, imageFile, false),
    getAdminAuthHeaders(),
  );
}

export function updateAdminEvent(id, event, imageFile, imageRemoved) {
  return putForm(
    `/admin/events/${id}`,
    buildEventFormData(event, imageFile, imageRemoved),
    getAdminAuthHeaders(),
  );
}

export function deleteAdminEvent(id) {
  return del(`/admin/events/${id}`, getAdminAuthHeaders());
}
