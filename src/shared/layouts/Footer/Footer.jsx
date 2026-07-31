import { forwardRef } from "react";
import { NavLink, Link } from "react-router";
import { Lock } from "lucide-react";
import styles from "./Footer.module.scss";
import Logo from "../../../assets/logos/logo-side-to-side.svg";
import InstagramIcon from "../../components/icons/InstagramIcon";

const INSTAGRAM_URL = "https://www.instagram.com/shuttermats/";

const FOOTER_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/events", label: "Eventos" },
  { to: "/contacto", label: "Contacto" },
];

const FOOTER_DISABLED_LINKS = [{ label: "Galerías" }];

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.footer__inner}>
        <Link to="/" className={styles.footer__brand}>
          <img
            src={Logo}
            alt="ShutterMats Logo"
            className={styles.footer__logo}
          />
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

          {FOOTER_DISABLED_LINKS.map((link) => (
            <span
              key={link.label}
              className={styles.footer__linkDisabled}
              aria-disabled="true"
              title="Próximamente"
            >
              {link.label}
              <span className={styles.srOnly}> (próximamente)</span>
            </span>
          ))}
        </nav>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footer__social}
          aria-label="ShutterMats en Instagram"
          title="ShutterMats en Instagram"
        >
          <InstagramIcon size={18} aria-hidden="true" />
        </a>

        <p className={styles.footer__copy}>
          © {new Date().getFullYear()} ShutterMats{" "}
          <Link
            to="/admin/login"
            className={styles.footer__adminLink}
            title="Acceso administrador"
            aria-label="Acceso administrador"
          >
            <Lock size={14} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
