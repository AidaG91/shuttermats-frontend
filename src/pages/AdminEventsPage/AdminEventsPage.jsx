import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { getEvents } from "../../services/eventsService";
import { deleteAdminEvent } from "../../services/adminEventsService";
import { clearAdminSession } from "../../services/authService";
import { resolveAssetUrl } from "../../utils/url";
import styles from "./AdminEventsPage.module.scss";

const PAGE_SIZE = 10;

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    loading: true,
    error: null,
  });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    getEvents({ status: "all", page, size: PAGE_SIZE, sort: "date,desc" })
      .then((result) => {
        if (!cancelled) setState({ ...result, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: err }));
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => load(), [load, reloadToken]);

  const sessionExpired = state.error?.status === 401 || state.error?.status === 403;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `¿Seguro que quieres borrar "${event.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(event.id);
    try {
      await deleteAdminEvent(event.id);
      setReloadToken((t) => t + 1);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const { content: events, totalPages, totalElements, loading, error } = state;

  return (
    <main className={styles.eventsPage}>
      <div className={styles.header}>
        <div>
          <h1>Eventos</h1>
          <p>Gestiona los eventos publicados en ShutterMats.</p>
        </div>
        <Link to="/admin/events/new" className={styles.newButton}>
          <Plus size={18} />
          Nuevo evento
        </Link>
      </div>

      {deleteError && (
        <p className={styles.errorMessage} role="alert">
          No se ha podido borrar el evento: {deleteError}
        </p>
      )}

      <div aria-live="polite">
        {loading && <p>Cargando eventos...</p>}

        {!loading && error && !sessionExpired && (
          <p className={styles.errorMessage} role="alert">
            No se han podido cargar los eventos: {error.message}.
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className={styles.emptyState}>Todavía no hay eventos creados.</p>
        )}
      </div>

      {!loading && !error && events.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className={styles.thumbCell}>
                    {event.imageUrl ? (
                      <img
                        src={resolveAssetUrl(event.imageUrl)}
                        alt=""
                        className={styles.thumb}
                      />
                    ) : (
                      <div className={styles.thumbPlaceholder}>
                        <ImageOff size={16} />
                      </div>
                    )}
                  </td>
                  <td className={styles.eventName}>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString("es-ES")}</td>
                  <td>{event.location}</td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className={styles.iconLink}
                      aria-label={`Editar ${event.name}`}
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => handleDelete(event)}
                      disabled={deletingId === event.id}
                      aria-label={`Borrar ${event.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Paginación de eventos">
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
