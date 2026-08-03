import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useMatch, useNavigate } from "react-router";
import { useAdminContactMessageList } from "../../hooks/useAdminContactMessageList";
import AdminPagination from "../../../../shared/components/AdminPagination/AdminPagination";
import { clearAdminSession } from "../../../auth/services/authService";
import { formatRelativeTime } from "../../utils/relativeTime";
import styles from "./AdminContactMessagesPage.module.scss";

const READ_FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "false", label: "Nuevos" },
  { value: "true", label: "Leídos" },
];

export default function AdminContactMessagesPage() {
  const navigate = useNavigate();
  const match = useMatch("/admin/contact-messages/:id");
  const selectedId = match?.params.id;

  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(0);

  const read = readFilter === "" ? undefined : readFilter === "true";

  const {
    content: messages,
    totalPages,
    totalElements,
    loading,
    error,
    refetch,
  } = useAdminContactMessageList({ read, page });

  const { totalElements: totalCount } = useAdminContactMessageList({ page: 0, size: 1 });
  const { totalElements: unreadCount } = useAdminContactMessageList({
    read: false,
    page: 0,
    size: 1,
  });

  const sessionExpired = error?.status === 401 || error?.status === 403;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  const changeReadFilter = (value) => {
    setReadFilter(value);
    setPage(0);
  };

  const refetchAll = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <main className={styles.inboxPage}>
      <div className={styles.header}>
        <div>
          <h1>Inbox</h1>
          <p>Gestiona las consultas de contacto y las peticiones de los atletas.</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{totalCount}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>No leídos</span>
            <span className={`${styles.statValue} ${styles.statValueAccent}`}>
              {unreadCount}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.listPanelHeader}>
            <h2>Actividad reciente</h2>
            <div className={styles.filterGroup} role="group" aria-label="Filtrar mensajes">
              {READ_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.filterButton} ${
                    readFilter === option.value ? styles.filterButtonActive : ""
                  }`}
                  onClick={() => changeReadFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite">
            {loading && <p className={styles.status}>Cargando mensajes...</p>}

            {!loading && error && !sessionExpired && (
              <p className={styles.errorMessage} role="alert">
                No se han podido cargar los mensajes: {error.message}.
              </p>
            )}

            {!loading && !error && messages.length === 0 && (
              <p className={styles.emptyState}>No hay mensajes con este filtro.</p>
            )}
          </div>

          {!loading && !error && messages.length > 0 && (
            <ul className={styles.messageList}>
              {messages.map((message) => (
                <li key={message.id}>
                  <Link
                    to={`/admin/contact-messages/${message.id}`}
                    className={`${styles.messageItem} ${
                      selectedId === String(message.id) ? styles.messageItemActive : ""
                    }`}
                  >
                    <span className={styles.messageItemHeader}>
                      <span
                        className={`${styles.messageSender} ${
                          !message.read ? styles.messageSenderUnread : ""
                        }`}
                      >
                        {message.name}
                      </span>
                      <span className={styles.messageTime}>
                        {formatRelativeTime(message.createdAt)}
                      </span>
                    </span>
                    <span className={styles.messageSnippet}>
                      {!message.read && (
                        <span className={styles.unreadDot} aria-hidden="true" />
                      )}
                      <span className={styles.messageSnippetText}>{message.message}</span>
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
            label="Paginación de mensajes"
          />
        </section>

        <section className={styles.detailPanel}>
          <Outlet context={{ refetchList: refetchAll }} />
        </section>
      </div>
    </main>
  );
}
