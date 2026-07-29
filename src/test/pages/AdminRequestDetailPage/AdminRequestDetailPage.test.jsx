import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminRequestDetailPage from "../../../pages/AdminRequestDetailPage/AdminRequestDetailPage";
import { useAdminRequestDetail } from "../../../hooks/useAdminRequestDetail";
import { updateRequestStatus } from "../../../services/adminRequestService";

vi.mock("../../../hooks/useAdminRequestDetail");
vi.mock("../../../services/adminRequestService");

const baseRequest = {
  id: 7,
  status: "PENDING",
  athleteName: "Laia Puig",
  athleteEmail: "laia@example.com",
  event: { name: "Open BJJ", date: "2030-01-01" },
  division: "ADULT",
  modality: "BOTH",
  belt: "BLUE",
  weight: null,
  extras: [],
  createdAt: "2026-01-01T10:00:00",
  adminResponse: null,
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/requests/7"]}>
      <Routes>
        <Route path="/admin/requests/:id" element={<AdminRequestDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminRequestDetailPage - actualizar estado", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("marca como seleccionado el estado actual de la solicitud", () => {
    useAdminRequestDetail.mockReturnValue({ request: baseRequest, loading: false, error: null });

    renderPage();

    expect(screen.getByRole("button", { name: "Pendiente" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Confirmada" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("deshabilita el botón de guardar cuando no hay cambios", () => {
    useAdminRequestDetail.mockReturnValue({ request: baseRequest, loading: false, error: null });

    renderPage();

    expect(screen.getByRole("button", { name: "Actualizar estado" })).toBeDisabled();
  });

  it("habilita el botón y llama al servicio al cambiar el estado", async () => {
    const user = userEvent.setup();
    useAdminRequestDetail.mockReturnValue({ request: baseRequest, loading: false, error: null });
    updateRequestStatus.mockResolvedValue({
      ...baseRequest,
      status: "CONFIRMED",
      adminResponse: "Todo listo",
    });

    renderPage();

    await user.click(screen.getByRole("button", { name: "Confirmada" }));
    await user.type(
      screen.getByLabelText("Respuesta para el atleta (opcional)"),
      "Todo listo",
    );

    const submitButton = screen.getByRole("button", { name: "Actualizar estado" });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    await waitFor(() =>
      expect(updateRequestStatus).toHaveBeenCalledWith("7", "CONFIRMED", "Todo listo"),
    );
    expect(await screen.findByText("Solicitud actualizada correctamente.")).toBeInTheDocument();
  });

  it("muestra un mensaje de error cuando falla la actualización", async () => {
    const user = userEvent.setup();
    useAdminRequestDetail.mockReturnValue({ request: baseRequest, loading: false, error: null });
    updateRequestStatus.mockRejectedValue(new Error("No se ha podido conectar con el servidor"));

    renderPage();

    await user.click(screen.getByRole("button", { name: "Confirmada" }));
    await user.click(screen.getByRole("button", { name: "Actualizar estado" }));

    expect(
      await screen.findByText("No se ha podido conectar con el servidor"),
    ).toBeInTheDocument();
  });
});
