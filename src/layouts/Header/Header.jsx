import { NavLink, Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogIn } from "lucide-react";
import styles from "./Header.module.scss";
import Logo from "../../assets/logos/logo-side-to-side.svg";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/events", label: "Eventos" },
  { to: "/galerias", label: "Galerías" },
];

const SCROLL_THRESHOLD = 40;

const Header = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const updateScrolledState = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState);
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    const closeMenuOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener("keydown", closeMenuOnEscape);
    }

    return () => {
      window.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", closeMenuOnOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
    };
  }, [menuOpen]);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles["header--solid"] : ""}`}
    >
      <div className={styles.header__inner}>
        <Link to="/" className={styles.header__brand}>
          <img
            src={Logo}
            alt="ShutterMats Logo"
            className={styles.header__logo}
          />
        </Link>

        <nav className={styles.header__nav} aria-label="Menú principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${styles.header__link} ${isActive ? styles["header__link--active"] : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.header__actions}>
          {user ? (
            <button className={styles.header__logout} onClick={onLogout}>
              Cerrar sesión
            </button>
          ) : (
            <span
              className={styles.header__linkDisabled}
              aria-disabled="true"
              title="Próximamente"
              aria-label="Login (próximamente)"
            >
              <LogIn size={18} aria-hidden="true" />
            </span>
          )}
        </div>

        <button
          className={`${styles.header__hamburger} ${
            menuOpen ? styles["header__hamburger--open"] : ""
          }`}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.header__hamburgerLine}></span>
          <span className={styles.header__hamburgerLine}></span>
          <span className={styles.header__hamburgerLine}></span>
        </button>
      </div>

      {menuOpen &&
        createPortal(
          <div className={styles.mobileOverlay}>
            <nav
              id="mobile-menu"
              className={styles.mobileMenu}
              ref={menuRef}
              aria-label="Menú principal móvil"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `${styles.mobileMenu__link} ${isActive ? styles["mobileMenu__link--active"] : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <button
                  className={styles.mobileMenu__logout}
                  onClick={onLogout}
                >
                  Cerrar sesión
                </button>
              ) : (
                <span
                  className={styles.mobileMenu__linkDisabled}
                  aria-disabled="true"
                  title="Próximamente"
                >
                  Login
                </span>
              )}
            </nav>
          </div>,
          document.body,
        )}
    </header>
  );
};

export default Header;
