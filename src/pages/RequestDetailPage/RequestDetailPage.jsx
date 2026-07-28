import { CheckCircle2, Mail } from "lucide-react";
import { Link, useLocation } from "react-router";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import styles from "./RequestDetailPage.module.scss";

export default function RequestDetailPage() {
  const location = useLocation();
  const request = location.state?.request;

  if (!request) {
    return (
      <main className={styles.detailPage}>
        <div className="container">
          <p className={styles.errorMessage} role="alert">
            No tenemos los datos de esta solicitud a mano (esto pasa si recargas la
            página o entras directamente por la URL). Si acabas de enviar el
            formulario, revisa tu email para la confirmación.
          </p>
          <Link to="/events" className={styles.link}>
            Volver a eventos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.detailPage}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.successIcon} aria-hidden="true">
            <CheckCircle2 size={40} />
          </div>
          <h1>¡Solicitud enviada!</h1>
          <p>Hemos recibido tu petición de cobertura para {request.event.name}.</p>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className="container">
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>Estado de tu solicitud</span>
              <StatusBadge status={request.status} />
            </div>

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
              <h2 className={styles.groupTitle}>Competición</h2>
              <div className={styles.row}>
                <span className={styles.label}>Evento</span>
                <span>
                  {request.event.name} ·{" "}
                  {new Date(request.event.date).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>División</span>
                <span>{request.division}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Modalidad</span>
                <span>{request.modality}</span>
              </div>
              {request.extras.length > 0 && (
                <div className={styles.row}>
                  <span className={styles.label}>Extras</span>
                  <span>{request.extras.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.nextSteps}>
            <Mail size={18} aria-hidden="true" />
            <p>
              Revisaremos tu solicitud y te escribiremos a{" "}
              <strong>{request.athleteEmail}</strong> para confirmar la cobertura en
              cuanto tengamos los horarios y brackets del evento.
            </p>
          </div>

          <Link to="/events" className={styles.link}>
            Volver a eventos
          </Link>
        </div>
      </section>
    </main>
  );
}
