import { Outlet } from "react-router";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import styles from "./AdminLayout.module.scss";

export default function AdminLayout() {
  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
