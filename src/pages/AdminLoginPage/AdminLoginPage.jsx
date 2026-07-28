import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock } from "lucide-react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { adminLogin } from "../../services/authService";
import styles from "./AdminLoginPage.module.scss";

const INITIAL_FORM = { username: "", password: "" };

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "El usuario es obligatorio";
    if (!form.password) nextErrors.password = "La contraseña es obligatoria";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await adminLogin(form);
      navigate("/admin");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <Lock size={28} />
        </div>
        <h1>Acceso administrador</h1>
        <p>Inicia sesión para gestionar eventos y solicitudes de cobertura.</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {submitError && (
            <p className={styles.errorBanner} role="alert">
              {submitError}
            </p>
          )}

          <Input
            label="Usuario"
            id="username"
            required
            autoComplete="username"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            error={errors.username}
          />

          <Input
            label="Contraseña"
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            error={errors.password}
          />

          <Button type="submit" variant="primary" fullWidth loading={submitting} disabled={submitting}>
            {submitting ? "Entrando..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </main>
  );
}
