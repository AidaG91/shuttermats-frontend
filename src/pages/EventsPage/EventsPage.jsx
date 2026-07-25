import { useEvents } from "../../hooks/useEvents";
import EventCard from "../../components/EventCard/EventCard";
import styles from "./EventsPage.module.scss";

export default function EventsPage() {
  const { events, loading } = useEvents();

  return (
    <main className={styles.eventsPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1>Events</h1>
          <p>
            Descubre las competiciones en las que ShutterMats captura la acción.
          </p>
        </div>
      </section>

      <section className={styles.eventsList}>
        <div className="container">
          {loading && <p>Cargando eventos...</p>}

          {!loading && events.length === 0 && (
            <p>No hay eventos disponibles en este momento.</p>
          )}

          <div className={styles.grid}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
