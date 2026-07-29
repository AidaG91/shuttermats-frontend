const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    return body.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

export async function get(path, params, headers) {
  let response;
  try {
    response = await fetch(buildUrl(path, params), { headers });
  } catch {
    throw new ApiError("No se ha podido conectar con el servidor", 0);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return response.json();
}

export async function post(path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("No se ha podido conectar con el servidor", 0);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return response.json();
}

export async function patch(path, body, headers) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("No se ha podido conectar con el servidor", 0);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return response.json();
}

// Para multipart/form-data (p.ej. subir imagen de evento junto a los datos).
// No se fija Content-Type a mano: el navegador debe generar el boundary.
async function sendForm(method, path, formData, headers) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: formData,
    });
  } catch {
    throw new ApiError("No se ha podido conectar con el servidor", 0);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function postForm(path, formData, headers) {
  return sendForm("POST", path, formData, headers);
}

export function putForm(path, formData, headers) {
  return sendForm("PUT", path, formData, headers);
}

export async function del(path, headers) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers,
    });
  } catch {
    throw new ApiError("No se ha podido conectar con el servidor", 0);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return null;
}
