import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EventCard from "../../../components/EventCard/EventCard";

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

describe("EventCard", () => {
  it("shows the name and location of the event", () => {
    render(<EventCard event={buildEvent()} />);

    expect(screen.getByRole("heading", { name: "Polaris Barcelona" })).toBeInTheDocument();
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
  });

  it("shows a 'Solicitar cobertura' action for upcoming events", () => {
    render(<EventCard event={buildEvent({ date: "2030-08-22" })} />);
    expect(screen.getByRole("button", { name: "Solicitar cobertura" })).toBeInTheDocument();
  });

  it("shows a 'Ver galería' action for past events", () => {
    render(<EventCard event={buildEvent({ date: "2020-01-01" })} />);
    expect(screen.getByRole("button", { name: "Ver galería" })).toBeInTheDocument();
  });

  it("does not render an image when the event has no imageUrl", () => {
    render(<EventCard event={buildEvent({ imageUrl: null })} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
