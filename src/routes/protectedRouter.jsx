import { Navigate, Outlet } from "react-router";
import { isAdminAuthenticated } from "../services/authService";

export default function AdminProtectedRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
