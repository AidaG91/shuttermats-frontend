import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, CalendarDays, Mail, Settings, LogOut } from "lucide-react";
import LogoDesktop from "../../../assets/logos/logo-side-to-side.svg";
import LogoMobile from "../../../assets/logos/logo-bars-only.svg";
import { clearAdminSession } from "../../../features/auth/services/authService";
import { useUnreadContactMessagesCount } from "../../../features/contact/hooks/useUnreadContactMessagesCount";
import styles from "./AdminSidebar.module.scss";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Eventos", icon: CalendarDays, end: false },
  { to: "/admin/contact-messages", label: "Mensajes", icon: Mail, end: false, badgeKey: "contactMessages" },
  { to: "/admin/pricing-plans", label: "Tarifas", icon: Settings, end: false },
];

const DISABLED_ITEMS = [];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const unreadContactMessages = useUnreadContactMessagesCount();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img
          src={LogoDesktop}
          alt="ShutterMats"
          className={styles.logoDesktop}
        />
        <img src={LogoMobile} alt="ShutterMats" className={styles.logoMobile} />
        <p className={styles.tag}>Admin Console</p>
      </div>

      <nav className={styles.nav} aria-label="Menú de administración">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, badgeKey }) => {
          const badgeCount = badgeKey === "contactMessages" ? unreadContactMessages : 0;

          return (
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
              {badgeCount > 0 && (
                <span
                  className={styles.badge}
                  aria-label={`${badgeCount} mensajes sin leer`}
                >
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}

        {DISABLED_ITEMS.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className={styles.navLinkDisabled}
            aria-disabled="true"
            title="Próximamente"
          >
            <Icon size={20} aria-hidden="true" />
            <span>
              {label}
              <span className={styles.srOnly}> (próximamente)</span>
            </span>
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
