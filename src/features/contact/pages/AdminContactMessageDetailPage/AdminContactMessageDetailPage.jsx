import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import StatusBadge from "../../../coverage-requests/components/StatusBadge/StatusBadge";
import Button from "../../../../shared/components/Button/Button";
import { useAdminContactMessageDetail } from "../../hooks/useAdminContactMessageDetail";
import { markContactMessageAsRead } from "../../services/adminContactMessageService";
import { clearAdminSession } from "../../../auth/services/authService";
import { useToast } from "../../../../shared/components/Toast/useToast";
import { CONTACT_SUBJECT_LABELS } from "../../utils/contactOptions";
import styles from "./AdminContactMessageDetailPage.module.scss";

export default function AdminContactMessageDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { message: fetched, loading, error } = useAdminContactMessageDetail(id);

  const initialMessage = fetched ?? location.state?.message;

  const [updatedMessage, setUpdatedMessage] = useState(null);
  const message = updatedMessage ?? initialMessage;

  const [marking, setMarking] = useState(false);

  const sessionExpired = error?.status === 401 || error?.status === 403;
  const notFound = error?.status === 404;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  const handleMarkAsRead = async () => {
    setMarking(true);
    try {
      const result = await markContactMessageAsRead(id);
      setUpdatedMessage(result);
      showToast("Mensaje marcado como leído.", "success");
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
        return;
      }
      showToast(`No se ha podido marcar como leído: ${err.message}`, "error");
    } finally {
      setMarking(false);
    }
  };

  if (loading && !message) {
    return (
      <main className={styles.detailPage}>
        <p>Cargando mensaje...</p>
      </main>
    );
  }

  if (!message) {
    return (
      <main className={styles.detailPage}>
        <p className={styles.errorMessage} role="alert">
          {notFound
            ? `No existe ningún mensaje con id ${id}.`
            : `No se han podido cargar los datos del mensaje #${id}.`}
        </p>
        <Link to="/admin/contact-messages" className={styles.link}>
          Volver a mensajes
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.detailPage}>
      <div className={styles.header}>
        <div>
          <Link to="/admin/contact-messages" className={styles.backLink}>
            ← Volver a mensajes
          </Link>
          <h1>Mensaje #{message.id}</h1>
        </div>
        <StatusBadge status={message.read ? "READ" : "NEW"} />
      </div>

      <div className={styles.card}>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Remitente</h2>
          <div className={styles.row}>
            <span className={styles.label}>Nombre</span>
            <span>{message.name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <span>{message.email}</span>
          </div>
          {message.phone && (
            <div className={styles.row}>
              <span className={styles.label}>Teléfono</span>
              <span>{message.phone}</span>
            </div>
          )}
          <div className={styles.row}>
            <span className={styles.label}>Fecha</span>
            <span>{new Date(message.createdAt).toLocaleDateString("es-ES")}</span>
          </div>
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Asunto</h2>
          <p className={styles.messageBody}>
            {CONTACT_SUBJECT_LABELS[message.subject] ?? message.subject}
          </p>
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Mensaje</h2>
          <p className={styles.messageBody}>{message.message}</p>
        </div>
      </div>

      {!message.read && (
        <div className={styles.actions}>
          <Button onClick={handleMarkAsRead} loading={marking}>
            Marcar como leído
          </Button>
        </div>
      )}
    </main>
  );
}
