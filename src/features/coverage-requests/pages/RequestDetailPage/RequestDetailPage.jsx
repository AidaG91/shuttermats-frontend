import { CheckCircle2, Mail } from "lucide-react";
import { Link, useLocation } from "react-router";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import confirmedHero from "../../../../assets/images/request-confirmed-hero.jpg";
import combatImage from "../../../../assets/images/combat.jpg";
import styles from "./RequestDetailPage.module.scss";

export default function RequestDetailPage() {
  const location = useLocation();
  const request = location.state?.request;

  const basePriceMultiplier = request?.modality === "BOTH" ? 2 : 1;
  const estimatedBasePrice = request ? request.event.basePrice * basePriceMultiplier : 0;
  const extrasTotal = request ? request.extras.reduce((sum, extra) => sum + extra.price, 0) : 0;
  const estimatedTotal = estimatedBasePrice + extrasTotal;

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
        <div className={styles.heroBackground}>
          <img
            src={confirmedHero}
            alt=""
            aria-hidden="true"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.successIcon} aria-hidden="true">
            <CheckCircle2 size={40} />
          </div>
          <h1>¡Solicitud enviada!</h1>
          <p>Hemos recibido tu petición de cobertura para {request.event.name}.</p>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.sideImage}>
              <img
                src={combatImage}
                alt=""
                aria-hidden="true"
              />
            </div>

            <div className={styles.content}>
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
                  <h2 className={styles.groupTitle}>Evento</h2>
                  <p className={styles.eventName}>
                    {request.event.name} ·{" "}
                    {new Date(request.event.date).toLocaleDateString("es-ES")}
                  </p>
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
                      <span>
                        {request.extras
                          .map((extra) => `${extra.name} (+${extra.price}€)`)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.group}>
                  <h2 className={styles.groupTitle}>Precio</h2>
                  <p className={styles.eventName}>
                    <strong>{estimatedTotal.toFixed(2)}€</strong>
                  </p>
                  <p className={styles.label}>
                    Incluye la cobertura del primer combate de la modalidad seleccionada y los
                    extras seleccionados. Cada combate adicional tiene un coste de +
                    {request.event.extraMatchPrice}€. Se puede confirmar el mismo día
                    del evento (sujeto a disponibilidad).
                  </p>
                </div>
              </div>

              <div className={styles.nextSteps}>
                <Mail size={18} aria-hidden="true" />
                <p>
                  Revisaremos tu solicitud y te escribiremos a{" "}
                  <strong>{request.athleteEmail}</strong> para confirmar la
                  cobertura en cuanto tengamos los horarios y brackets del evento.
                </p>
              </div>

              <Link to="/events" className={styles.link}>
                Volver a eventos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
