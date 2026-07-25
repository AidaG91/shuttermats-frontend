import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, get } from "../../services/httpClient";

function mockFetchOnce(response) {
  globalThis.fetch = vi.fn().mockResolvedValue(response);
}

describe("httpClient.get", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the parsed JSON body on a successful response", async () => {
    mockFetchOnce({
      ok: true,
      json: () => Promise.resolve({ content: [], totalPages: 0 }),
    });

    const result = await get("/events");

    expect(result).toEqual({ content: [], totalPages: 0 });
  });

  it("builds the URL including only the defined query params", async () => {
    mockFetchOnce({ ok: true, json: () => Promise.resolve({}) });

    await get("/events", { status: "upcoming", location: "", page: 0 });

    const calledUrl = globalThis.fetch.mock.calls[0][0];
    expect(calledUrl).toContain("status=upcoming");
    expect(calledUrl).toContain("page=0");
    expect(calledUrl).not.toContain("location=");
  });

  it("throws an ApiError with the server message when the response is not ok", async () => {
    mockFetchOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: () => Promise.resolve({ message: "No se ha encontrado ningún evento con id 99" }),
    });

    await expect(get("/events/99")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "No se ha encontrado ningún evento con id 99",
    });
  });

  it("throws an ApiError when the network request fails", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(get("/events")).rejects.toBeInstanceOf(ApiError);
  });
});
