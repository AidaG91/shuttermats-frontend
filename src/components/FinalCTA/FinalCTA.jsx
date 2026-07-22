import { Link } from "react-router";
import Button from "../../components/Button/Button";
import styles from "./FinalCTA.module.scss";

const FinalCTA = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.cta__container}>
        <h2 className={styles.cta__title}>
          Creemos juntos algo que te represente de la manera más auténtica.
        </h2>

        <p className={styles.cta__text}>
          Contacta con nosotros y cuéntanos en qué podemos ayudarte. Si compites
          o organizas un evento, podemos ofrecer cobertura profesional enfocada
          en la intensidad y la esencia del tatami.
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
