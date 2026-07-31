import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAdminContactMessageList } from "../../hooks/useAdminContactMessageList";
import Select from "../../../../shared/components/Select/Select";
import StatusBadge from "../../../coverage-requests/components/StatusBadge/StatusBadge";
import AdminPagination from "../../../../shared/components/AdminPagination/AdminPagination";
import { clearAdminSession } from "../../../auth/services/authService";
import { CONTACT_SUBJECT_LABELS } from "../../utils/contactOptions";
import styles from "./AdminContactMessagesPage.module.scss";

const READ_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "false", label: "Nuevos" },
  { value: "true", label: "Leídos" },
];

export default function AdminContactMessagesPage() {
  const navigate = useNavigate();
  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(0);

  const read = readFilter === "" ? undefined : readFilter === "true";

  const {
    content: messages,
    totalPages,
    totalElements,
    loading,
    error,
  } = useAdminContactMessageList({ read, page });

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

  return (
    <main className={styles.messagesPage}>
      <div className={styles.header}>
        <div>
          <h1>Mensajes de contacto</h1>
          <p>Consultas generales enviadas desde el formulario de contacto.</p>
        </div>
      </div>

      <div className={styles.filters}>
        <Select
          label="Estado"
          id="read-filter"
          options={READ_OPTIONS}
          value={readFilter}
          onChange={(e) => changeReadFilter(e.target.value)}
        />
      </div>

      <div aria-live="polite">
        {loading && <p>Cargando mensajes...</p>}

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
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Asunto</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
                <th scope="col" className={styles.actionsHeader}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td className={styles.senderName}>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{CONTACT_SUBJECT_LABELS[message.subject] ?? message.subject}</td>
                  <td>{new Date(message.createdAt).toLocaleDateString("es-ES")}</td>
                  <td>
                    <StatusBadge status={message.read ? "READ" : "NEW"} />
                  </td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/admin/contact-messages/${message.id}`}
                      state={{ message }}
                      className={styles.detailsLink}
                    >
                      Ver
                    </Link>
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
        label="Paginación de mensajes"
      />
    </main>
  );
}
