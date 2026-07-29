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
          Tu combate. <br />
          <span className={styles.hero__stroke}>Tu historia.</span>
        </h1>

        <p className={styles.hero__subtitle}>
          Fotografiamos BJJ desde dentro del deporte. Sabemos cuándo pasa algo
          importante en un combate, y estamos ahí para verlo.
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
