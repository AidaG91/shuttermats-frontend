import { Calendar, MapPin } from "lucide-react";
import { resolveAssetUrl } from "../../utils/url";
import styles from "./EventCard.module.scss";

export default function EventCard({ event }) {
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <article className={styles.card}>
      {event.imageUrl && (
        <img
          src={resolveAssetUrl(event.imageUrl)}
          alt={event.name}
          className={styles.image}
        />
      )}

      <div className={styles.content}>
        <h3>{event.name}</h3>

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

        <button className={styles.button}>
          {isPastEvent ? "Ver galería" : "Solicitar cobertura"}
        </button>
      </div>
    </article>
  );
}
