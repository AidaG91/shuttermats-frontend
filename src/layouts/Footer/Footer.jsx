import { NavLink, Link } from "react-router";
import styles from "./Footer.module.scss";
import Logo from "../../assets/logos/logo-white.svg";

const FOOTER_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/events", label: "Eventos" },
  { to: "/galerias", label: "Galerías" },
  { to: "/reserva", label: "Reserva" },
];

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
          <span className={styles.footer__wordmark}>ShutterMats</span>
        </Link>

        <nav className={styles.footer__nav} aria-label="Enlaces del pie de página">
          {FOOTER_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${styles.footer__link} ${isActive ? styles["footer__link--active"] : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <p className={styles.footer__copy}>
          © {new Date().getFullYear()} ShutterMats
        </p>
      </div>
    </footer>
  );
};

export default Footer;
