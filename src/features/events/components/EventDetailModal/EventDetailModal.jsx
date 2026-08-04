import { Calendar, MapPin, ExternalLink } from "lucide-react";
import Modal from "../../../../shared/components/Modal/Modal";
import Button from "../../../../shared/components/Button/Button";
import { resolveAssetUrl } from "../../../../shared/utils/url";
import styles from "./EventDetailModal.module.scss";

export default function EventDetailModal({ event, onClose }) {
  if (!event) return null;

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <Modal open onClose={onClose} labelledBy="event-detail-title" className={styles.panel}>
      {event.imageUrl && (
        <img
          src={resolveAssetUrl(event.imageUrl)}
          alt=""
          aria-hidden="true"
          className={styles.image}
        />
      )}

      <h2 id="event-detail-title" className={styles.title}>
        {event.name}
      </h2>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <Calendar size={16} className={styles.metaIcon} aria-hidden="true" />
          <span>
            {new Date(event.date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className={styles.metaRow}>
          <MapPin size={16} className={styles.metaIcon} aria-hidden="true" />
          <span>{event.location}</span>
        </div>
      </div>

      {event.description && <p className={styles.description}>{event.description}</p>}

      <div className={styles.priceBox}>
        <p className={styles.priceLine}>
          Desde <strong>{event.basePrice}€</strong>
        </p>
        <p className={styles.priceHint}>
          Precio del primer combate. Combate extra +{event.extraMatchPrice}€, extras opcionales
          aparte.
        </p>
      </div>

      <div className={styles.footer}>
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.registrationLink}
          >
            Ver inscripción oficial
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}

        {isPastEvent ? (
          <Button variant="subtle" fullWidth disabled title="Disponible próximamente">
            Ver galería
          </Button>
        ) : (
          <Button variant="primary" fullWidth to={`/events/${event.id}/request`}>
            Solicitar cobertura
          </Button>
        )}
      </div>
    </Modal>
  );
}
