import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAdminRequestList } from "../../hooks/useAdminRequestList";
import { useEvents } from "../../hooks/useEvents";
import Select from "../../components/Select/Select";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { clearAdminSession } from "../../services/authService";
import styles from "./AdminDashboardPage.module.scss";

const STATUS_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "PENDING", label: "Pendiente" },
  { value: "RECEIVED", label: "Recibida" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "DELIVERED", label: "Entregada" },
  { value: "REJECTED", label: "Rechazada" },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [eventId, setEventId] = useState("");
  const [page, setPage] = useState(0);

  const {
    content: requests,
    totalPages,
    totalElements,
    loading,
    error,
  } = useAdminRequestList({ status, eventId, page });

  const { content: events } = useEvents({ status: "all", size: 100, sort: "date,desc" });

  const eventOptions = [
    { value: "", label: "Todos" },
    ...events.map((event) => ({
      value: String(event.id),
      label: `${event.name} · ${new Date(event.date).toLocaleDateString("es-ES")}`,
    })),
  ];

  const sessionExpired = error?.status === 401 || error?.status === 403;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  const changeStatus = (value) => {
    setStatus(value);
    setPage(0);
  };

  const changeEvent = (value) => {
    setEventId(value);
    setPage(0);
  };

  return (
    <main className={styles.dashboardPage}>
      <div className={styles.header}>
        <div>
          <h1>Solicitudes de cobertura</h1>
          <p>Gestiona las peticiones de cobertura fotográfica de los atletas.</p>
        </div>
      </div>

      <div className={styles.filters}>
        <Select
          label="Estado"
          id="status-filter"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => changeStatus(e.target.value)}
        />
        <Select
          label="Evento"
          id="event-filter"
          options={eventOptions}
          value={eventId}
          onChange={(e) => changeEvent(e.target.value)}
        />
      </div>

      <div aria-live="polite">
        {loading && <p>Cargando solicitudes...</p>}

        {!loading && error && !sessionExpired && (
          <p className={styles.errorMessage} role="alert">
            No se han podido cargar las solicitudes: {error.message}.
          </p>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className={styles.emptyState}>No hay solicitudes con este filtro.</p>
        )}
      </div>

      {!loading && !error && requests.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Evento</th>
                <th>Fecha solicitud</th>
                <th>Estado</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className={styles.athleteName}>{request.athleteName}</td>
                  <td>{request.event?.name}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString("es-ES")}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/admin/requests/${request.id}`}
                      state={{ request }}
                      className={styles.detailsLink}
                    >
                      Gestionar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Paginación de solicitudes">
          <button
            className={styles.pageButton}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {page + 1} de {totalPages} · {totalElements} en total
          </span>
          <button
            className={styles.pageButton}
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}
    </main>
  );
}
