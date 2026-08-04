import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Input from "../../../../shared/components/Input/Input";
import Select from "../../../../shared/components/Select/Select";
import Textarea from "../../../../shared/components/Textarea/Textarea";
import Button from "../../../../shared/components/Button/Button";
import { resolveAssetUrl } from "../../../../shared/utils/url";
import { useAdminPricingPlans } from "../../hooks/useAdminPricingPlans";
import styles from "./EventForm.module.scss";

const EMPTY_VALUES = {
  name: "",
  date: "",
  location: "",
  description: "",
  registrationUrl: "",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function EventForm({
  initialValues,
  onSubmit,
  submitting = false,
  submitError = null,
  submitLabel = "Guardar",
}) {
  const isEditMode = Boolean(initialValues);
  const [form, setForm] = useState({
    ...EMPTY_VALUES,
    ...initialValues,
    registrationUrl: initialValues?.registrationUrl ?? "",
    pricingPlanId: initialValues?.pricingPlanId != null ? String(initialValues.pricingPlanId) : "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [objectPreviewUrl, setObjectPreviewUrl] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const { plans, loading: loadingPlans } = useAdminPricingPlans();

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) URL.revokeObjectURL(objectPreviewUrl);
    };
  }, [objectPreviewUrl]);

  // New events default to whichever plan is marked as predeterminada, once
  // plans have loaded. Editing an event never auto-picks anything - it
  // already starts from that event's current plan (or "mantener precio
  // actual" if that plan was since deleted, see pricingPlanOptions below).
  useEffect(() => {
    if (isEditMode || form.pricingPlanId) return;
    const defaultPlan = plans.find((plan) => plan.isDefault);
    if (defaultPlan) {
      setForm((prev) => ({ ...prev, pricingPlanId: String(defaultPlan.id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans]);

  const existingPreviewUrl =
    !imageRemoved && initialValues?.imageUrl
      ? resolveAssetUrl(initialValues.imageUrl)
      : null;
  const previewUrl = objectPreviewUrl || existingPreviewUrl;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Usa una imagen JPG, PNG o WEBP" }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image: "La imagen no puede superar los 5MB" }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: undefined }));
    setImageRemoved(false);
    setImageFile(file);
    setObjectPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setObjectPreviewUrl(null);
    setImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentPlanStillExists = plans.some(
    (plan) => String(plan.id) === form.pricingPlanId,
  );

  const pricingPlanOptions = [
    ...(isEditMode && !currentPlanStillExists
      ? [
          {
            value: "",
            label:
              initialValues?.basePrice != null
                ? `Mantener precio actual (${initialValues.basePrice}€ / ${initialValues.extraMatchPrice}€)`
                : "Mantener precio actual",
          },
        ]
      : []),
    ...(!isEditMode ? [{ value: "", label: "Selecciona una tarifa" }] : []),
    ...plans.map((plan) => ({
      value: String(plan.id),
      label: `${plan.name} — ${plan.basePrice}€ / ${plan.extraMatchPrice}€ combate extra${
        plan.isDefault ? " (por defecto)" : ""
      }`,
    })),
  ];

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "El nombre es obligatorio";
    if (!form.date) nextErrors.date = "La fecha es obligatoria";
    if (!form.location.trim()) nextErrors.location = "La ubicación es obligatoria";
    if (!isEditMode && !form.pricingPlanId) {
      nextErrors.pricingPlanId = "Selecciona una tarifa";
    }
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(
      {
        ...form,
        registrationUrl: form.registrationUrl.trim() || null,
        pricingPlanId: form.pricingPlanId ? Number(form.pricingPlanId) : null,
      },
      imageFile,
      imageRemoved,
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {submitError && (
        <p className={styles.errorBanner} role="alert">
          {submitError}
        </p>
      )}

      <div className={styles.imageField}>
        <span className={styles.label}>Imagen del evento</span>

        <div className={styles.imageRow}>
          {previewUrl ? (
            <div className={styles.preview}>
              <img src={previewUrl} alt="" />
              <button
                type="button"
                className={styles.removeImage}
                onClick={clearImage}
                aria-label="Quitar imagen"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className={styles.dropzone} htmlFor="event-image">
              <ImagePlus size={24} />
              <span>Sin imagen</span>
            </label>
          )}

          <div className={styles.imageHelp}>
            <label htmlFor="event-image" className={styles.chooseButton}>
              {previewUrl ? "Cambiar imagen" : "Seleccionar archivo"}
            </label>
            <input
              ref={fileInputRef}
              id="event-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className={styles.hiddenInput}
            />
            <p>JPG, PNG o WEBP · máx. 5MB</p>
            {errors.image && (
              <span className={styles.errorMessage} role="alert">
                {errors.image}
              </span>
            )}
          </div>
        </div>
      </div>

      <Input
        label="Nombre del evento"
        id="event-name"
        required
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
      />

      <Input
        label="Fecha"
        id="event-date"
        type="date"
        required
        value={form.date}
        onChange={(e) => updateField("date", e.target.value)}
        error={errors.date}
      />

      <Input
        label="Ubicación"
        id="event-location"
        required
        value={form.location}
        onChange={(e) => updateField("location", e.target.value)}
        error={errors.location}
      />

      <Textarea
        label="Descripción"
        id="event-description"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <Input
        label="Enlace oficial del campeonato (opcional)"
        id="event-registration-url"
        type="url"
        placeholder="https://smoothcomp.com/..."
        value={form.registrationUrl}
        onChange={(e) => updateField("registrationUrl", e.target.value)}
        hint="Página donde los atletas se inscriben al evento (Smoothcomp, Polaris, IBJJF...)"
      />

      <Select
        label="Tarifa"
        id="event-pricing-plan"
        required={!isEditMode}
        options={pricingPlanOptions}
        value={form.pricingPlanId}
        onChange={(e) => updateField("pricingPlanId", e.target.value)}
        error={errors.pricingPlanId}
        disabled={loadingPlans}
      />

      <Button type="submit" loading={submitting} fullWidth>
        {submitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
