import { useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { useEventLocations } from "../../hooks/useEventLocations";
import EventCard from "../../components/EventCard/EventCard";
import Select from "../../../../shared/components/Select/Select";
import Button from "../../../../shared/components/Button/Button";
import eventsHero from "../../../../assets/images/events-hero.jpg";
import styles from "./EventsPage.module.scss";

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Próximos" },
  { value: "past", label: "Pasados" },
  { value: "all", label: "Todos" },
];

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
  const locationOptions = [
    { value: "", label: "Todas las ubicaciones" },
    ...locations.map((loc) => ({ value: loc, label: loc })),
  ];

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
        <div className={styles.heroBackground}>
          <img
            src={eventsHero}
            alt=""
            aria-hidden="true"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <h1>Eventos</h1>
          <p>
            Descubre las competiciones en las que ShutterMats captura la acción.
          </p>
        </div>
      </section>

      <section className={styles.eventsList}>
        <div className="container">
          <div className={styles.filters}>
            <Select
              id="status-filter"
              label="Estado"
              value={status}
              onChange={(e) => changeStatus(e.target.value)}
              options={STATUS_OPTIONS}
            />

            <Select
              id="location-filter"
              label="Ubicación"
              value={location}
              onChange={(e) => changeLocation(e.target.value)}
              options={locationOptions}
            />
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
              <Button
                variant="subtle"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className={styles.pageInfo}>
                Página {page + 1} de {totalPages}
              </span>
              <Button
                variant="subtle"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
