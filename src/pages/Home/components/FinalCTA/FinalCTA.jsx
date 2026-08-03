import Button from "../../../../shared/components/Button/Button";
import ctaBackground from "../../../../assets/images/cta-bg.jpg";
import styles from "./FinalCTA.module.scss";

const FinalCTA = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.cta__background}>
        <img
          src={ctaBackground}
          alt=""
          aria-hidden="true"
          className={styles.cta__image}
        />
        <div className={styles.cta__overlay}></div>
      </div>

      <div className={styles.cta__container}>
        <h2 className={styles.cta__title}>
          Los momentos más importantes merecen ser recordados.
        </h2>

        <p className={styles.cta__text}>
          Contacta con nosotros y cuéntanos qué necesitas.
        </p>

        <Button to="/contacto" variant="primary" size="md">
          Hablemos
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
