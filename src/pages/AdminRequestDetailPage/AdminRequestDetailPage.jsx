import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { useAdminRequest } from "../../hooks/useAdminRequest";
import { clearAdminSession } from "../../services/authService";
import styles from "./AdminRequestDetailPage.module.scss";

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { request: fetched, loading, error } = useAdminRequest(id);
  // Mientras carga, mostramos al instante lo que ya trajimos de la tabla
  // (si venimos de ahí) y lo sustituimos por la respuesta del servidor.
  const request = fetched ?? location.state?.request;

  const sessionExpired = error?.status === 401 || error?.status === 403;
  const notFound = error?.status === 404;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

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

      <p className={styles.comingSoon}>
        La actualización de estado se añadirá en la próxima historia.
      </p>
    </main>
  );
}
