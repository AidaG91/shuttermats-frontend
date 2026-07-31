import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "../../../../shared/components/Button/Button";

describe("Button", () => {
  it("renders the label passed as children", () => {
    render(<Button>Reservar</Button>);
    expect(screen.getByRole("button", { name: "Reservar" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Reservar</Button>);
    await user.click(screen.getByRole("button", { name: "Reservar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled and does not call onClick when loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={onClick} loading>
        Reservar
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Reservar" });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
