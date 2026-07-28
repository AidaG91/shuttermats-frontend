import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import Button from "../../components/Button/Button";
import { clearAdminSession } from "../../services/authService";
import styles from "./AdminDashboardPage.module.scss";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  return (
    <main className={styles.dashboardPage}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>Panel de administración</h1>
            <p>Sesión iniciada correctamente.</p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
            Cerrar sesión
          </Button>
        </div>

        <div className={styles.placeholder}>
          <p>
            Aquí irá la gestión de eventos y solicitudes de cobertura en las
            próximas iteraciones.
          </p>
        </div>
      </div>
    </main>
  );
}
