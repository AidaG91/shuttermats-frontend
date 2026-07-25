import { useEvents } from "../../hooks/useEvents";
import EventCard from "../EventCard/EventCard";
import styles from "./RecentGalleries.module.scss";

const RecentGalleries = () => {
  const { content: events, loading, error } = useEvents({
    status: "past",
    size: 3,
    sort: "date,desc",
  });

  if (!loading && !error && events.length === 0) {
    return null;
  }

  return (
    <section className={styles.galleries}>
      <div className={styles.galleries__container}>
        <h2 className={styles.galleries__title}>Galerías Recientes</h2>

        {loading && (
          <p className={styles.galleries__status}>Cargando galerías...</p>
        )}

        {!loading && error && (
          <p className={styles.galleries__status} role="alert">
            No se han podido cargar las galerías recientes.
          </p>
        )}

        {!loading && !error && (
          <div className={styles.galleries__grid}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentGalleries;
