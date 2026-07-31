import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Paperclip, FileText } from "lucide-react";
import StatusBadge from "../../../coverage-requests/components/StatusBadge/StatusBadge";
import Textarea from "../../../../shared/components/Textarea/Textarea";
import Button from "../../../../shared/components/Button/Button";
import { useAdminContactMessageDetail } from "../../hooks/useAdminContactMessageDetail";
import {
  markContactMessageAsRead,
  saveContactMessageResponse,
} from "../../services/adminContactMessageService";
import { clearAdminSession } from "../../../auth/services/authService";
import { useToast } from "../../../../shared/components/Toast/useToast";
import { CONTACT_SUBJECT_LABELS } from "../../utils/contactOptions";
import styles from "./AdminContactMessageDetailPage.module.scss";

function getInitials(name) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function AdminContactMessageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refetchList } = useOutletContext();

  const { message: fetched, loading, error } = useAdminContactMessageDetail(id);
  const [updatedMessage, setUpdatedMessage] = useState(null);
  const message = updatedMessage ?? fetched;

  const [responseText, setResponseText] = useState("");
  const [saving, setSaving] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    setUpdatedMessage(null);
    setResponseText("");
  }, [id]);

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
      refetchList();
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

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setSaving(true);
    try {
      const result = await saveContactMessageResponse(id, responseText.trim());
      setUpdatedMessage(result);
      setResponseText("");
      refetchList();
      showToast("Respuesta guardada.", "success");
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
        return;
      }
      showToast(`No se ha podido guardar la respuesta: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !message) {
    return (
      <div className={styles.stateWrapper}>
        <p>Cargando mensaje...</p>
      </div>
    );
  }

  if (!message) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.errorMessage} role="alert">
          {notFound
            ? `No existe ningún mensaje con id ${id}.`
            : `No se han podido cargar los datos del mensaje #${id}.`}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.detail}>
      <header className={styles.detailHeader}>
        <div className={styles.identity}>
          <span className={styles.avatar} aria-hidden="true">
            {getInitials(message.name)}
          </span>
          <div>
            <h2>{message.name}</h2>
            <span className={styles.identitySub}>
              {CONTACT_SUBJECT_LABELS[message.subject] ?? message.subject}
            </span>
          </div>
        </div>
        <StatusBadge status={message.read ? "READ" : "NEW"} />
      </header>

      <div className={styles.thread}>
        <div className={styles.bubble}>
          <div className={styles.bubbleMeta}>
            <span>{message.email}</span>
            {message.phone && <span>· {message.phone}</span>}
            <span>· {new Date(message.createdAt).toLocaleString("es-ES")}</span>
          </div>
          <p className={styles.bubbleText}>{message.message}</p>
        </div>

        {message.adminResponse && (
          <div className={`${styles.bubble} ${styles.bubbleResponse}`}>
            <div className={styles.bubbleMeta}>Respuesta (nota interna)</div>
            <p className={styles.bubbleText}>{message.adminResponse}</p>
          </div>
        )}
      </div>

      <form className={styles.replyBox} onSubmit={handleSaveResponse}>
        <Textarea
          id="adminResponse"
          label="Respuesta / nota interna"
          rows={3}
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Escribe qué le has respondido..."
        />
        <p className={styles.replyHint}>
          Esto no envía ningún email al remitente: queda guardado como nota
          interna. Respóndele directamente a <strong>{message.email}</strong>.
        </p>

        <div className={styles.replyActions}>
          <div className={styles.replyExtras}>
            <button
              type="button"
              className={styles.extraButton}
              disabled
              aria-disabled="true"
              title="Próximamente"
            >
              <Paperclip size={16} aria-hidden="true" />
              Adjuntar archivo
            </button>
            <button
              type="button"
              className={styles.extraButton}
              disabled
              aria-disabled="true"
              title="Próximamente"
            >
              <FileText size={16} aria-hidden="true" />
              Plantilla
            </button>
          </div>

          <div className={styles.replySubmitGroup}>
            {!message.read && (
              <Button
                type="button"
                variant="subtle"
                size="sm"
                onClick={handleMarkAsRead}
                loading={marking}
              >
                Marcar como leído
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              disabled={!responseText.trim()}
            >
              Guardar respuesta
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
