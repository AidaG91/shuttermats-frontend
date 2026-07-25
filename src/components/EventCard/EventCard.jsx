import { Calendar, MapPin } from "lucide-react";
import styles from "./EventCard.module.scss";

export default function EventCard({ event }) {
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <article className={styles.card}>
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.name} className={styles.image} />
      )}

      <div className={styles.content}>
        <h3>{event.name}</h3>

        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <Calendar size={16} className={styles.metaIcon} />
            <span>
              {new Date(event.date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className={styles.metaRow}>
            <MapPin size={16} className={styles.metaIcon} />
            <span>{event.location}</span>
          </div>
        </div>

        {/* {event.description && ( 
          <p className={styles.description}>{event.description}</p>
        )}
         */}

        <button className={styles.button}>
          {isPastEvent ? "Ver galería" : "Solicitar cobertura"}
        </button>
      </div>
    </article>
  );
}
