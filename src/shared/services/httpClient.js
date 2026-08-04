export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
  }
}

async function parseErrorBody(response) {
  try {
    const body = await response.json();
    return {
      message: body.message ?? response.statusText,
      fieldErrors: body.fieldErrors ?? {},
    };
  } catch {
    return { message: response.statusText, fieldErrors: {} };
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

async function request(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError("No se ha podido conectar con el servidor", 0);
  }

  if (!response.ok) {
    const { message, fieldErrors } = await parseErrorBody(response);
    throw new ApiError(message, response.status, fieldErrors);
  }

  return response;
}

function jsonRequestOptions(method, body, headers) {
  return {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
}

export async function get(path, params, headers) {
  const response = await request(buildUrl(path, params), { headers });
  return response.json();
}

export async function post(path, body, headers) {
  const response = await request(
    `${API_BASE_URL}${path}`,
    jsonRequestOptions("POST", body, headers),
  );
  return response.json();
}

export async function patch(path, body, headers) {
  const response = await request(
    `${API_BASE_URL}${path}`,
    jsonRequestOptions("PATCH", body, headers),
  );
  return response.json();
}

export async function put(path, body, headers) {
  const response = await request(
    `${API_BASE_URL}${path}`,
    jsonRequestOptions("PUT", body, headers),
  );
  return response.json();
}

async function sendForm(method, path, formData, headers) {
  const response = await request(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: formData,
  });

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
  await request(`${API_BASE_URL}${path}`, { method: "DELETE", headers });
  return null;
}
