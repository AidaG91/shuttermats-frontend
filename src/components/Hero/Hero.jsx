import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__background}>
        <img
          src="/images/hero-bjj.jpg"
          alt="Dos atletas de Brazilian Jiu-Jitsu compitiendo sobre el tatami"
          className={styles.hero__image}
        />
        <div className={styles.hero__overlay}></div>
      </div>

      <div className={styles.hero__content}>
        <span className={styles.hero__tag}>
          Coberturas Profesionales de Combates
        </span>

        <h1 className={styles.hero__title}>
          Precisión en <br />
          <span className={styles.hero__stroke}>Cada Fotograma</span>
        </h1>

        <p className={styles.hero__subtitle}>
          Capturamos tus combates con una estética cinematográfica, enfocada en
          la intensidad, la técnica y la emoción del tatami.
        </p>

        <div className={styles.hero__actions}>
          <a href="/eventos" className={styles["hero__btn--primary"]}>
            Ver Eventos
          </a>

          <a href="/reserva" className={styles["hero__btn--outline"]}>
            Reservar Cobertura
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
