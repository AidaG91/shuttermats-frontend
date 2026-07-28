import { postForm, putForm, del } from "./httpClient";
import { getAdminToken } from "./authService";

// imageUrl en el JSON tiene 3 significados para el backend:
//  - no se incluye / null  -> el campo no se ha tocado, conserva la imagen actual
//  - ""                    -> quitar la imagen explícitamente
//  - archivo adjunto       -> gana siempre sobre imageUrl
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
  const token = getAdminToken();
  return postForm(
    "/admin/events",
    buildEventFormData(event, imageFile, false),
    { Authorization: `Bearer ${token}` },
  );
}

export function updateAdminEvent(id, event, imageFile, imageRemoved) {
  const token = getAdminToken();
  return putForm(
    `/admin/events/${id}`,
    buildEventFormData(event, imageFile, imageRemoved),
    { Authorization: `Bearer ${token}` },
  );
}

export function deleteAdminEvent(id) {
  const token = getAdminToken();
  return del(`/admin/events/${id}`, { Authorization: `Bearer ${token}` });
}
