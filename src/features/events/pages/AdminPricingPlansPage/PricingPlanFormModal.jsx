import { useState } from "react";
import Modal from "../../../../shared/components/Modal/Modal";
import Input from "../../../../shared/components/Input/Input";
import Button from "../../../../shared/components/Button/Button";
import styles from "./AdminPricingPlansPage.module.scss";

const EMPTY_VALUES = { name: "", basePrice: "", extraMatchPrice: "", isDefault: false };

export default function PricingPlanFormModal({ open, plan, onClose, onSubmit, submitting, submitError }) {
  const isEditMode = Boolean(plan);
  const [form, setForm] = useState(() => ({
    ...EMPTY_VALUES,
    ...(plan
      ? {
          name: plan.name,
          basePrice: plan.basePrice,
          extraMatchPrice: plan.extraMatchPrice,
          isDefault: plan.isDefault,
        }
      : {}),
  }));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "El nombre es obligatorio";
    if (!form.basePrice || Number(form.basePrice) <= 0) {
      nextErrors.basePrice = "Indica un precio base mayor que 0";
    }
    if (!form.extraMatchPrice || Number(form.extraMatchPrice) <= 0) {
      nextErrors.extraMatchPrice = "Indica un precio de combate extra mayor que 0";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      basePrice: Number(form.basePrice),
      extraMatchPrice: Number(form.extraMatchPrice),
      isDefault: form.isDefault,
    });
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="pricing-plan-modal-title">
      <h2 id="pricing-plan-modal-title" className={styles.modalTitle}>
        {isEditMode ? `Editar "${plan.name}"` : "Nueva tarifa"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.modalForm} noValidate>
        {submitError && (
          <p className={styles.errorBanner} role="alert">
            {submitError}
          </p>
        )}

        <Input
          label="Nombre"
          id="plan-name"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="Precio primer combate (€)"
          id="plan-base-price"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={form.basePrice}
          onChange={(e) => updateField("basePrice", e.target.value)}
          error={errors.basePrice}
        />
        <Input
          label="Precio combate extra (€)"
          id="plan-extra-match-price"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={form.extraMatchPrice}
          onChange={(e) => updateField("extraMatchPrice", e.target.value)}
          error={errors.extraMatchPrice}
        />

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.isDefault}
            disabled={plan?.isDefault}
            onChange={(e) => updateField("isDefault", e.target.checked)}
          />
          {plan?.isDefault
            ? "Ya es la tarifa predeterminada"
            : "Marcar como tarifa predeterminada (se usa cuando un evento no elige ninguna)"}
        </label>

        <Button type="submit" loading={submitting} fullWidth>
          {submitting ? "Guardando..." : isEditMode ? "Guardar cambios" : "Crear tarifa"}
        </Button>
      </form>
    </Modal>
  );
}
