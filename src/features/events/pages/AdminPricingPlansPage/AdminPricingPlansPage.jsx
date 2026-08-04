import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useAdminPricingPlans } from "../../hooks/useAdminPricingPlans";
import { createPricingPlan, updatePricingPlan, deletePricingPlan } from "../../services/adminPricingPlansService";
import { clearAdminSession } from "../../../auth/services/authService";
import ConfirmModal from "../../../../shared/components/ConfirmModal/ConfirmModal";
import { useToast } from "../../../../shared/components/Toast/useToast";
import PricingPlanFormModal from "./PricingPlanFormModal";
import styles from "./AdminPricingPlansPage.module.scss";

export default function AdminPricingPlansPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { plans, loading, error, refetch } = useAdminPricingPlans();

  const [formModal, setFormModal] = useState(null); // null | "new" | plan
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const sessionExpired = error?.status === 401 || error?.status === 403;

  useEffect(() => {
    if (sessionExpired) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  const closeFormModal = () => {
    if (submitting) return;
    setFormModal(null);
    setSubmitError(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (formModal && formModal !== "new") {
        await updatePricingPlan(formModal.id, values);
        showToast("Tarifa actualizada correctamente.", "success");
      } else {
        await createPricingPlan(values);
        showToast("Tarifa creada correctamente.", "success");
      }
      setFormModal(null);
      refetch();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    setDeleting(true);
    try {
      await deletePricingPlan(planToDelete.id);
      showToast(`"${planToDelete.name}" se ha borrado correctamente.`, "success");
      setPlanToDelete(null);
      refetch();
    } catch (err) {
      showToast(`No se ha podido borrar la tarifa: ${err.message}`, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Tarifas</h1>
          <p>Gestiona las tarifas disponibles para asignar a los eventos.</p>
        </div>
        <button type="button" className={styles.newButton} onClick={() => setFormModal("new")}>
          <Plus size={18} />
          Nueva tarifa
        </button>
      </div>

      <div aria-live="polite">
        {loading && <p>Cargando tarifas...</p>}

        {!loading && error && !sessionExpired && (
          <p className={styles.errorMessage} role="alert">
            No se han podido cargar las tarifas: {error.message}.
          </p>
        )}

        {!loading && !error && plans.length === 0 && (
          <p className={styles.emptyState}>Todavía no hay tarifas creadas.</p>
        )}
      </div>

      {!loading && !error && plans.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Primer combate</th>
                <th scope="col">Combate extra</th>
                <th scope="col" className={styles.actionsHeader}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td className={styles.planName}>
                    {plan.name}
                    {plan.isDefault && (
                      <span className={styles.defaultBadge}>
                        <Star size={12} />
                        Predeterminada
                      </span>
                    )}
                  </td>
                  <td>{plan.basePrice}€</td>
                  <td>{plan.extraMatchPrice}€</td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionsGroup}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => setFormModal(plan)}
                        aria-label={`Editar ${plan.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => setPlanToDelete(plan)}
                        disabled={plan.isDefault}
                        title={plan.isDefault ? "No puedes borrar la tarifa predeterminada" : undefined}
                        aria-label={`Borrar ${plan.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formModal && (
        <PricingPlanFormModal
          open
          plan={formModal === "new" ? null : formModal}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      )}

      <ConfirmModal
        open={planToDelete !== null}
        title="Borrar tarifa"
        message={
          planToDelete
            ? `¿Seguro que quieres borrar "${planToDelete.name}"? Los eventos que ya la usaban mantienen su precio actual, solo dejarán de mostrar esta tarifa como referencia.`
            : ""
        }
        confirmText="Borrar"
        cancelText="Cancelar"
        danger
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlanToDelete(null)}
      />
    </main>
  );
}
