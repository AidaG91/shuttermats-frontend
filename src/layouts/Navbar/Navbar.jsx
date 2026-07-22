import styles from "./Navbar.module.scss";
import { Link } from "react-router";

const Navbar = ({ user, onLogout }) => {
  return (
    <header className={styles.smNavbar}>
      <div className={styles.smNavbarInner}>
        <Link to="/" className={styles.smNavbarBrand}>
          Shutter<span>Mats</span>
        </Link>

        <nav className={styles.smNavbarLinks}>
          <Link to="/events" className={styles.smNavbarLink}>
            Events
          </Link>
          {user ? (
            <button className={styles.smNavbarLogout} onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={styles.smNavbarLink}>
                Login
              </Link>
              <Link to="/register" className={styles.smNavbarCta}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
