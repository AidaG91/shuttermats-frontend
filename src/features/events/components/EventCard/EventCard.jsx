import { Calendar, MapPin } from "lucide-react";
import { resolveAssetUrl } from "../../../../shared/utils/url";
import Button from "../../../../shared/components/Button/Button";
import styles from "./EventCard.module.scss";

export default function EventCard({ event, onOpenDetails }) {
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.detailsTrigger}
        onClick={() => onOpenDetails?.(event)}
        aria-label={`Ver detalles de ${event.name}`}
      >
        {event.imageUrl && (
          <img
            src={resolveAssetUrl(event.imageUrl)}
            alt={event.name}
            className={styles.image}
          />
        )}
      </button>

      <div className={styles.content}>
        <button type="button" className={styles.titleTrigger} onClick={() => onOpenDetails?.(event)}>
          <h3>{event.name}</h3>
        </button>

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

        {isPastEvent ? (
          <Button
            variant="subtle"
            fullWidth
            disabled
            title="Disponible próximamente"
          >
            Ver galería
          </Button>
        ) : (
          <Button variant="subtle" fullWidth to={`/events/${event.id}/request`}>
            Solicitar cobertura
          </Button>
        )}
      </div>
    </article>
  );
}
