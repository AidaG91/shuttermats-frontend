import { useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { useEventLocations } from "../../hooks/useEventLocations";
import EventCard from "../../components/EventCard/EventCard";
import styles from "./EventsPage.module.scss";

export default function EventsPage() {
  const [status, setStatus] = useState("upcoming");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(0);

  const sort = status === "past" ? "date,desc" : "date,asc";
  const {
    content: events,
    totalPages,
    loading,
    error,
  } = useEvents({ status, location, page, sort });
  const { locations } = useEventLocations();

  const changeStatus = (value) => {
    setStatus(value);
    setPage(0);
  };
  const changeLocation = (value) => {
    setLocation(value);
    setPage(0);
  };

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
          <div className={styles.filters}>
            <div className={styles.field}>
              <label htmlFor="status-filter" className={styles.fieldLabel}>
                Estado
              </label>
              <select
                id="status-filter"
                className={styles.select}
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
              >
                <option value="upcoming">Próximos</option>
                <option value="past">Pasados</option>
                <option value="all">Todos</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="location-filter" className={styles.fieldLabel}>
                Ubicación
              </label>
              <select
                id="location-filter"
                className={styles.select}
                value={location}
                onChange={(e) => changeLocation(e.target.value)}
              >
                <option value="">Todas las ubicaciones</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div aria-live="polite">
            {loading && <p>Cargando eventos...</p>}

            {!loading && error && (
              <p className={styles.errorMessage} role="alert">
                No se han podido cargar los eventos: {error}. Inténtalo de
                nuevo más tarde.
              </p>
            )}

            {!loading && !error && events.length === 0 && (
              <p>No hay eventos disponibles en este momento.</p>
            )}
          </div>

          {!loading && !error && events.length > 0 && (
            <div className={styles.grid}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <nav
              className={styles.pagination}
              aria-label="Paginación de eventos"
            >
              <button
                className={styles.pageButton}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <span className={styles.pageInfo}>
                Página {page + 1} de {totalPages}
              </span>
              <button
                className={styles.pageButton}
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
