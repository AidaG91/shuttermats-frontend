import styles from "./RecentGalleries.module.scss";

const galleries = [
  {
    id: 1,
    title: "Open de Andalucía 2024",
    image: "/images/gallery-1.jpg",
  },
  {
    id: 2,
    title: "Copa España Grappling",
    image: "/images/gallery-2.jpg",
  },
  {
    id: 3,
    title: "BJJ Summer Camp",
    image: "/images/gallery-3.jpg",
  },
];

const RecentGalleries = () => {
  return (
    <section className={styles.galleries}>
      <div className={styles.galleries__container}>
        <h2 className={styles.galleries__title}>Galerías Recientes</h2>

        <div className={styles.galleries__grid}>
          {galleries.map((gallery) => (
            <a
              key={gallery.id}
              href={`/galeria/${gallery.id}`}
              className={styles.galleries__item}
            >
              <img
                src={gallery.image}
                alt={gallery.title}
                className={styles.galleries__image}
              />
              <span className={styles.galleries__label}>{gallery.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentGalleries;
