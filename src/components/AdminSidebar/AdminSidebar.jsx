import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, CalendarDays, Settings, LogOut } from "lucide-react";
import Logo from "../../assets/logos/logo-white.svg";
import { clearAdminSession } from "../../services/authService";
import styles from "./AdminSidebar.module.scss";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Eventos", icon: CalendarDays, end: false },
];

const DISABLED_ITEMS = [{ label: "Ajustes", icon: Settings }];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={Logo} alt="ShutterMats" className={styles.logo} />
        <p className={styles.tag}>Admin Console</p>
      </div>

      <nav className={styles.nav} aria-label="Menú de administración">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}

        {DISABLED_ITEMS.map(({ label, icon: Icon }) => (
          <span key={label} className={styles.navLinkDisabled} title="Próximamente">
            <Icon size={20} />
            <span>{label}</span>
          </span>
        ))}
      </nav>

      <button className={styles.logout} onClick={handleLogout}>
        <LogOut size={20} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}
