import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.scss";

const Header = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Cerrar al hacer click fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        {/* Brand */}
        <Link to="/" className={styles.header__brand}>
          <img
            src="/images/logo-icon.png"
            alt="ShutterMats Logo"
            className={styles.header__logo}
          />
          <span className={styles.header__title}>SHUTTERMATS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.header__nav}>
          <Link to="/" className={styles.header__link}>
            Inicio
          </Link>
          <Link to="/eventos" className={styles.header__link}>
            Eventos
          </Link>
          <Link to="/galerias" className={styles.header__link}>
            Galerías
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className={styles.header__actions}>
          {user ? (
            <button className={styles.header__logout} onClick={onLogout}>
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className={styles.header__link}>
                Login
              </Link>
              <Link to="/reserva">
                <button className={styles.header__cta}>
                  Reservar Cobertura
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
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

      {/* Backdrop + Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileOverlay}>
          <nav
            id="mobile-menu"
            className={styles.mobileMenu}
            ref={menuRef}
            aria-label="Menú principal móvil"
          >
            <Link to="/" className={styles.mobileMenu__link}>
              Inicio
            </Link>
            <Link to="/eventos" className={styles.mobileMenu__link}>
              Eventos
            </Link>
            <Link to="/galerias" className={styles.mobileMenu__link}>
              Galerías
            </Link>

            {user ? (
              <button className={styles.mobileMenu__logout} onClick={onLogout}>
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link to="/login" className={styles.mobileMenu__link}>
                  Login
                </Link>
                <Link to="/reserva" className={styles.mobileMenu__cta}>
                  Reservar Cobertura
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
