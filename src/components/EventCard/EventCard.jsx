import styles from "./EventCard.module.scss";

export default function EventCard({ event }) {
  return (
    <article className={styles.card}>
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.name} className={styles.image} />
      )}

      <div className={styles.content}>
        <h3>{event.name}</h3>
        <p className={styles.meta}>
          {event.date} — {event.location}
        </p>

        {event.description && (
          <p className={styles.description}>{event.description}</p>
        )}

        <button className={styles.button}>View details</button>
      </div>
    </article>
  );
}
