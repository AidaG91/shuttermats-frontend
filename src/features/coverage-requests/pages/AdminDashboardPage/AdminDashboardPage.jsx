import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { useAdminRequestList } from "../../hooks/useAdminRequestList";
import { useEvents } from "../../../events/hooks/useEvents";
import Select from "../../../../shared/components/Select/Select";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import AdminPagination from "../../../../shared/components/AdminPagination/AdminPagination";
import { clearAdminSession } from "../../../auth/services/authService";
import styles from "./AdminDashboardPage.module.scss";

// TODO(dashboard): this is the v1 "modern" listing (cards instead of a
// table + stats up top). The long-term vision is a dashboard with charts,
// more stats, and an events calendar; once that's tackled, this page will
// likely be split into several widgets/sections.
const STATUS_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "PENDING", label: "Pendiente" },
  { value: "RECEIVED", label: "Recibida" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "DELIVERED", label: "Entregada" },
  { value: "REJECTED", label: "Rechazada" },
];

function getInitials(name) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

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

  const { totalElements: totalCount } = useAdminRequestList({ page: 0, size: 1 });
  const { totalElements: pendingCount } = useAdminRequestList({
    status: "PENDING",
    page: 0,
    size: 1,
  });

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

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{totalCount}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pendientes</span>
            <span className={`${styles.statValue} ${styles.statValueAccent}`}>
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div
          className={styles.statusFilters}
          role="group"
          aria-label="Filtrar por estado"
        >
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.filterButton} ${
                status === option.value ? styles.filterButtonActive : ""
              }`}
              onClick={() => changeStatus(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Select
          label="Evento"
          id="event-filter"
          options={eventOptions}
          value={eventId}
          onChange={(e) => changeEvent(e.target.value)}
        />
      </div>

      <div aria-live="polite">
        {loading && <p className={styles.status}>Cargando solicitudes...</p>}

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
        <ul className={styles.requestList}>
          {requests.map((request) => (
            <li key={request.id}>
              <Link
                to={`/admin/requests/${request.id}`}
                state={{ request }}
                className={styles.requestCard}
              >
                <span className={styles.avatar} aria-hidden="true">
                  {getInitials(request.athleteName)}
                </span>

                <div className={styles.requestInfo}>
                  <span className={styles.athleteName}>{request.athleteName}</span>
                  <span className={styles.eventName}>{request.event?.name}</span>
                </div>

                <span className={styles.requestDate}>
                  {formatShortDate(request.createdAt)}
                </span>

                <StatusBadge status={request.status} />

                <span className={styles.manageLink}>
                  Gestionar
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        label="Paginación de solicitudes"
      />
    </main>
  );
}
