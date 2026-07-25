import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvents } from "../../hooks/useEvents";
import { getEvents } from "../../services/eventsService";

vi.mock("../../services/eventsService");

describe("useEvents", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("exposes the events and stops loading once the request resolves", async () => {
    getEvents.mockResolvedValue({
      content: [{ id: 1, name: "Open BJJ" }],
      totalPages: 1,
      totalElements: 1,
    });

    const { result } = renderHook(() => useEvents());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.content).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("exposes an error message when the request fails", async () => {
    getEvents.mockRejectedValue(new Error("No se ha podido conectar con el servidor"));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("No se ha podido conectar con el servidor");
    expect(result.current.content).toEqual([]);
  });
});
