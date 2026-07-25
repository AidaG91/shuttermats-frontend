import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EventsPage from "../../../pages/EventsPage/EventsPage";
import { getEventLocations, getEvents } from "../../../services/eventsService";

vi.mock("../../../services/eventsService");

describe("EventsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getEventLocations.mockResolvedValue(["Madrid", "Barcelona"]);
  });

  it("shows a loading message while the events are being fetched", () => {
    getEvents.mockReturnValue(new Promise(() => {}));

    render(<EventsPage />);

    expect(screen.getByText("Cargando eventos...")).toBeInTheDocument();
  });

  it("renders the list of events once loaded", async () => {
    getEvents.mockResolvedValue({
      content: [
        { id: 1, name: "Open BJJ", date: "2030-01-01", location: "Madrid" },
      ],
      totalPages: 1,
      totalElements: 1,
    });

    render(<EventsPage />);

    expect(await screen.findByText("Open BJJ")).toBeInTheDocument();
  });

  it("shows an empty state message when there are no events", async () => {
    getEvents.mockResolvedValue({ content: [], totalPages: 0, totalElements: 0 });

    render(<EventsPage />);

    expect(
      await screen.findByText("No hay eventos disponibles en este momento."),
    ).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    getEvents.mockRejectedValue(new Error("No se ha podido conectar con el servidor"));

    render(<EventsPage />);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "No se han podido cargar los eventos",
      ),
    );
  });
});
