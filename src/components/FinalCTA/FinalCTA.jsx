import styles from "./FinalCTA.module.scss";

const FinalCTA = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.cta__container}>
        <h2 className={styles.cta__title}>
          ¿Quieres cobertura profesional para tus combates?
        </h2>

        <p className={styles.cta__text}>
          Ofrecemos cobertura fotográfica y audiovisual especializada en
          Brazilian Jiu‑Jitsu y Grappling. Si compites o organizas un evento,
          capturamos cada momento con una estética cinematográfica y enfocada en
          la intensidad del tatami.
        </p>

        <a href="/reserva" className={styles.cta__button}>
          Reservar Cobertura
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;
