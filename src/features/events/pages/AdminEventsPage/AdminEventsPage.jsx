import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { useAdminEventList } from "../../hooks/useAdminEventList";
import { deleteAdminEvent } from "../../services/adminEventsService";
import { clearAdminSession } from "../../../auth/services/authService";
import { resolveAssetUrl } from "../../../../shared/utils/url";
import ConfirmModal from "../../../../shared/components/ConfirmModal/ConfirmModal";
import AdminPagination from "../../../../shared/components/AdminPagination/AdminPagination";
import styles from "./AdminEventsPage.module.scss";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const {
    content: events,
    totalPages,
    totalElements,
    loading,
    error,
    refetch,
  } = useAdminEventList({ page });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.flashMessage ?? null);

  const sessionExpired = error?.status === 401 || error?.status === 403;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  useEffect(() => {
    // Evita que el mensaje reaparezca si el usuario recarga la página o vuelve con el botón atrás.
    if (location.state?.flashMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (event) => {
    setDeleteError(null);
    setSuccessMessage(null);
    setEventToDelete(event);
  };

  const handleCancelDelete = () => {
    if (deletingId) return;
    setEventToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setDeleteError(null);
    setDeletingId(eventToDelete.id);
    try {
      await deleteAdminEvent(eventToDelete.id);
      refetch();
      setSuccessMessage(`"${eventToDelete.name}" se ha borrado correctamente.`);
      setEventToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

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

      {successMessage && !deleteError && (
        <p className={styles.successMessage} role="status">
          {successMessage}
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
                <th scope="col">
                  <span className={styles.srOnly}>Miniatura</span>
                </th>
                <th scope="col">Nombre</th>
                <th scope="col">Fecha</th>
                <th scope="col">Ubicación</th>
                <th scope="col" className={styles.actionsHeader}>
                  Acciones
                </th>
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
                    <div className={styles.actionsGroup}>
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
                        onClick={() => handleDeleteClick(event)}
                        disabled={deletingId === event.id}
                        aria-label={`Borrar ${event.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        label="Paginación de eventos"
      />

      <ConfirmModal
        open={eventToDelete !== null}
        title="Borrar evento"
        message={
          eventToDelete
            ? `¿Seguro que quieres borrar "${eventToDelete.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Borrar"
        cancelText="Cancelar"
        danger
        loading={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  );
}
