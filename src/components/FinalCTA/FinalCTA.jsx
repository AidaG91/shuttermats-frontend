import { Link } from "react-router";
import Button from "../../components/Button/Button";
import styles from "./FinalCTA.module.scss";

const FinalCTA = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.cta__container}>
        <h2 className={styles.cta__title}>
          Los momentos más importantes merecen ser recordados.
        </h2>

        <p className={styles.cta__text}>
          Contacta con nosotros y cuéntanos qué necesitas.
        </p>

        <Link to="/reserva">
          <Button variant="primary" size="md">
            Hablemos
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
