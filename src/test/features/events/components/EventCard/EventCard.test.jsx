import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import EventCard from "../../../../../features/events/components/EventCard/EventCard";

function buildEvent(overrides = {}) {
  return {
    id: 1,
    name: "Polaris Barcelona",
    date: "2030-08-22",
    location: "Barcelona",
    imageUrl: "/images/events/polaris-barcelona.jpg",
    description: "Superfights profesionales",
    ...overrides,
  };
}

// EventCard usa <Link> de react-router para eventos futuros, por lo que
// necesita un Router alrededor para no petar con "useContext(...) is null".
function renderEventCard(event) {
  return render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>,
  );
}

describe("EventCard", () => {
  it("shows the name and location of the event", () => {
    renderEventCard(buildEvent());

    expect(screen.getByRole("heading", { name: "Polaris Barcelona" })).toBeInTheDocument();
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
  });

  it("shows a 'Solicitar cobertura' action for upcoming events", () => {
    renderEventCard(buildEvent({ date: "2030-08-22" }));
    expect(screen.getByRole("link", { name: "Solicitar cobertura" })).toBeInTheDocument();
  });

  it("shows a 'Ver galería' action for past events", () => {
    renderEventCard(buildEvent({ date: "2020-01-01" }));
    expect(screen.getByRole("button", { name: "Ver galería" })).toBeInTheDocument();
  });

  it("does not render an image when the event has no imageUrl", () => {
    renderEventCard(buildEvent({ imageUrl: null }));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
