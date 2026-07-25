import { Link } from "react-router";
import styles from "./Footer.module.scss";
import Logo from "../../assets/logos/logo-white.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
          <Link to="/" className={styles.footer__brand}>
            <img
              src={Logo}
              alt="ShutterMats Logo"
              className={styles.footer__logo}
            />
          </Link>

        <nav className={styles.footer__nav}>
          <Link to="/" className={styles.footer__link}>
            Inicio
          </Link>
          <Link to="/events" className={styles.footer__link}>
            Eventos
          </Link>
          <Link to="/galerias" className={styles.footer__link}>
            Galerías
          </Link>
          <Link to="/reserva" className={styles.footer__link}>
            Reserva
          </Link>
        </nav>

        <p className={styles.footer__copy}>
          © {new Date().getFullYear()} ShutterMats — Todos los derechos
          reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
