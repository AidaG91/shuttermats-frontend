import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import EventForm from "../../components/EventForm/EventForm";
import { useEvent } from "../../hooks/useEvent";
import { createAdminEvent, updateAdminEvent } from "../../services/adminEventsService";
import { useToast } from "../../../../shared/components/Toast/ToastProvider";
import styles from "./AdminEventFormPage.module.scss";

export default function AdminEventFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { event, loading, error } = useEvent(id);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (values, imageFile, imageRemoved) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateAdminEvent(id, values, imageFile, imageRemoved);
      } else {
        await createAdminEvent(values, imageFile);
      }
      showToast(
        isEditMode ? "Evento actualizado correctamente." : "Evento creado correctamente.",
        "success",
      );
      navigate("/admin/events");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && loading) {
    return (
      <main className={styles.formPage}>
        <p>Cargando evento...</p>
      </main>
    );
  }

  if (isEditMode && (error || !event)) {
    return (
      <main className={styles.formPage}>
        <p className={styles.errorMessage} role="alert">
          No se ha podido cargar el evento.
        </p>
        <Link to="/admin/events" className={styles.backLink}>
          ← Volver a eventos
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.formPage}>
      <Link to="/admin/events" className={styles.backLink}>
        ← Volver a eventos
      </Link>
      <h1>{isEditMode ? `Editar ${event.name}` : "Nuevo evento"}</h1>

      <EventForm
        initialValues={isEditMode ? event : undefined}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        submitLabel={isEditMode ? "Guardar cambios" : "Crear evento"}
      />
    </main>
  );
}
