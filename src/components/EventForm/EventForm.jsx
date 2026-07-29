import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Input from "../Input/Input";
import Textarea from "../Textarea/Textarea";
import Button from "../Button/Button";
import { resolveAssetUrl } from "../../utils/url";
import styles from "./EventForm.module.scss";

const EMPTY_VALUES = {
  name: "",
  date: "",
  location: "",
  description: "",
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
  const [form, setForm] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [imageFile, setImageFile] = useState(null);
  const [objectPreviewUrl, setObjectPreviewUrl] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) URL.revokeObjectURL(objectPreviewUrl);
    };
  }, [objectPreviewUrl]);

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

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "El nombre es obligatorio";
    if (!form.date) nextErrors.date = "La fecha es obligatoria";
    if (!form.location.trim()) nextErrors.location = "La ubicación es obligatoria";
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form, imageFile, imageRemoved);
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

      <Button type="submit" loading={submitting} fullWidth>
        {submitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
