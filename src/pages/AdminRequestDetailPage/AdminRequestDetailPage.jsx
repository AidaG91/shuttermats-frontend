import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import { useAdminRequest } from "../../hooks/useAdminRequest";
import { clearAdminSession } from "../../services/authService";
import { updateRequestStatus } from "../../services/adminRequestService";
import styles from "./AdminRequestDetailPage.module.scss";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "RECEIVED", label: "Recibida" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "REJECTED", label: "Rechazada" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "DELIVERED", label: "Entregada" },
];

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { request: fetched, loading, error } = useAdminRequest(id);
  // Mientras carga, mostramos al instante lo que ya trajimos de la tabla
  // (si venimos de ahí) y lo sustituimos por la respuesta del servidor.
  const initialRequest = fetched ?? location.state?.request;

  // Copia local que se actualiza tras un PATCH correcto, para reflejar el
  // nuevo estado/respuesta sin tener que recargar la página.
  const [updatedRequest, setUpdatedRequest] = useState(null);
  const request = updatedRequest ?? initialRequest;

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const sessionExpired = error?.status === 401 || error?.status === 403;
  const notFound = error?.status === 404;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  // Inicializa el formulario cuando llegan (o cambian) los datos de la
  // solicitud, para partir siempre del estado y respuesta ya guardados.
  useEffect(() => {
    if (!request) return;
    setSelectedStatus(request.status);
    setAdminResponse(request.adminResponse ?? "");
    // Solo nos importan estos 3 valores, no la identidad del objeto request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id, request?.status, request?.adminResponse]);

  const hasChanges =
    request &&
    (selectedStatus !== request.status ||
      adminResponse !== (request.adminResponse ?? ""));

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await updateRequestStatus(id, selectedStatus, adminResponse);
      setUpdatedRequest(result);
      setSubmitSuccess(true);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
        return;
      }
      setSubmitError(err.message || "No se ha podido actualizar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !request) {
    return (
      <main className={styles.detailPage}>
        <p>Cargando solicitud...</p>
      </main>
    );
  }

  if (!request) {
    return (
      <main className={styles.detailPage}>
        <p className={styles.errorMessage} role="alert">
          {notFound
            ? `No existe ninguna solicitud con id ${id}.`
            : `No se han podido cargar los datos de la solicitud #${id}.`}
        </p>
        <Link to="/admin" className={styles.link}>
          Volver al panel
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.detailPage}>
      <div className={styles.header}>
        <div>
          <Link to="/admin" className={styles.backLink}>
            ← Volver al panel
          </Link>
          <h1>Solicitud #{request.id}</h1>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className={styles.card}>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Atleta</h2>
          <div className={styles.row}>
            <span className={styles.label}>Nombre</span>
            <span>{request.athleteName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <span>{request.athleteEmail}</span>
          </div>
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Evento</h2>
          <p className={styles.eventName}>
            {request.event?.name} ·{" "}
            {request.event?.date &&
              new Date(request.event.date).toLocaleDateString("es-ES")}
          </p>
          <div className={styles.row}>
            <span className={styles.label}>División</span>
            <span>{request.division}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Modalidad</span>
            <span>{request.modality}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Cinturón</span>
            <span>{request.belt}</span>
          </div>
          {request.weight && (
            <div className={styles.row}>
              <span className={styles.label}>Peso</span>
              <span>{request.weight}</span>
            </div>
          )}
          {request.extras?.length > 0 && (
            <div className={styles.row}>
              <span className={styles.label}>Extras</span>
              <span>{request.extras.join(", ")}</span>
            </div>
          )}
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Solicitud</h2>
          <div className={styles.row}>
            <span className={styles.label}>Fecha de solicitud</span>
            <span>
              {new Date(request.createdAt).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>
      </div>

      <form className={styles.statusPanel} onSubmit={handleSubmitStatus}>
        <h2 className={styles.groupTitle}>Actualizar estado</h2>

        <div className={styles.statusOptions} role="group" aria-label="Estado de la solicitud">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={[
                styles.statusOption,
                selectedStatus === option.value ? styles.statusOptionActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={selectedStatus === option.value}
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Textarea
          id="adminResponse"
          label="Respuesta para el atleta (opcional)"
          value={adminResponse}
          onChange={(e) => setAdminResponse(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Ej: Confirmada, nos vemos en el evento."
        />

        {submitError && (
          <p className={styles.errorMessage} role="alert">
            {submitError}
          </p>
        )}

        {submitSuccess && !hasChanges && (
          <p className={styles.successMessage} role="status">
            Solicitud actualizada correctamente.
          </p>
        )}

        <Button type="submit" disabled={!hasChanges} loading={submitting}>
          Actualizar estado
        </Button>
      </form>
    </main>
  );
}
