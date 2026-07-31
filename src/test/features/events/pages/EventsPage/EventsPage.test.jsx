import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EventsPage from "../../../../../features/events/pages/EventsPage/EventsPage";
import { getEventLocations, getEvents } from "../../../../../features/events/services/eventsService";

vi.mock("../../../../../features/events/services/eventsService");

// EventsPage renderiza <EventCard>, que usa <Link>: necesita Router alrededor.
function renderEventsPage() {
  return render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
}

describe("EventsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getEventLocations.mockResolvedValue(["Madrid", "Barcelona"]);
  });

  it("shows a loading message while the events are being fetched", () => {
    getEvents.mockReturnValue(new Promise(() => {}));

    renderEventsPage();

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

    renderEventsPage();

    expect(await screen.findByText("Open BJJ")).toBeInTheDocument();
  });

  it("shows an empty state message when there are no events", async () => {
    getEvents.mockResolvedValue({ content: [], totalPages: 0, totalElements: 0 });

    renderEventsPage();

    expect(
      await screen.findByText("No hay eventos disponibles en este momento."),
    ).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    getEvents.mockRejectedValue(new Error("No se ha podido conectar con el servidor"));

    renderEventsPage();

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "No se han podido cargar los eventos",
      ),
    );
  });
});
