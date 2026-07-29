import Button from "../../components/Button/Button";
import { resolveAssetUrl } from "../../utils/url";
import styles from "./FinalCTA.module.scss";

const FinalCTA = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.cta__background}>
        <img
          src={resolveAssetUrl("/images/cta-bg.jpg")}
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

        <Button
          variant="primary"
          size="md"
          disabled
          title="Próximamente"
          aria-disabled="true"
        >
          Hablemos
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
