import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { resolveAssetUrl } from "../../utils/url";
import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__background}>
        <img
          src={resolveAssetUrl("/images/hero-bjj.jpg")}
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
          <Link to="/events" className={styles["hero__btn--primary"]}>
            Ver Eventos
          </Link>

          <Link to="/reserva" className={styles["hero__btn--outline"]}>
            Reservar Cobertura
          </Link>
        </div>
      </div>

      <span className={styles.hero__scrollCue} aria-hidden="true">
        <ChevronDown size={28} />
      </span>
    </section>
  );
};

export default Hero;
