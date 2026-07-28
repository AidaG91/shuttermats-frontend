import { Link, useLocation, useParams } from "react-router";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import styles from "./AdminRequestDetailPage.module.scss";

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const request = location.state?.request;

  if (!request) {
    return (
      <main className={styles.detailPage}>
        <p className={styles.errorMessage} role="alert">
          No tenemos los datos de la solicitud #{id} a mano (esto pasa si
          recargas la página o entras directamente por la URL). Vuelve al
          panel y accede desde la tabla.
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
