import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEvent } from "../../hooks/useEvent";
import { useCoverageExtras } from "../../hooks/useCoverageExtras";
import { requestCoverage } from "../../services/coverageRequestService";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import { resolveAssetUrl } from "../../utils/url";
import styles from "./CoverageRequestFormPage.module.scss";

const BELT_OPTIONS = [
  { value: "", label: "Selecciona un cinturón" },
  { value: "WHITE", label: "Blanco" },
  { value: "BLUE", label: "Azul" },
  { value: "PURPLE", label: "Morado" },
  { value: "BROWN", label: "Marrón" },
  { value: "BLACK", label: "Negro" },
];

const DIVISION_OPTIONS = [
  { value: "", label: "Selecciona una división" },
  { value: "KIDS", label: "Infantil" },
  { value: "JUVENILE", label: "Juvenil" },
  { value: "ADULT", label: "Adulto" },
  { value: "MASTER", label: "Máster" },
];

const MODALITY_OPTIONS = [
  { value: "", label: "Selecciona modalidad" },
  { value: "GI", label: "Gi" },
  { value: "NO_GI", label: "No-Gi" },
  { value: "BOTH", label: "Gi y No-Gi" },
];

const INITIAL_FORM = {
  athlete: { name: "", email: "", phone: "", instagram: "", gym: "", city: "", country: "" },
  category: { weight: "", belt: "", division: "", modality: "" },
  locate: { smoothcompDisplayName: "", smoothcompProfileLink: "", estimatedFirstFightTime: "" },
  extraIds: [],
  preferences: { photoPreferences: "", specialMoments: "", additionalNotes: "" },
  billing: { needsInvoice: false, invoiceName: "", invoiceTaxId: "", invoiceAddress: "", invoiceCountry: "" },
  confirmations: { termsAccepted: false, portfolioConsent: false },
};

export default function CoverageRequestFormPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { event, loading: loadingEvent, error: eventError } = useEvent(eventId);
  const { extras, loading: loadingExtras } = useCoverageExtras();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateSection = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const toggleExtra = (id) => {
    setForm((prev) => {
      const alreadySelected = prev.extraIds.includes(id);
      return {
        ...prev,
        extraIds: alreadySelected
          ? prev.extraIds.filter((extraId) => extraId !== id)
          : [...prev.extraIds, id],
      };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.athlete.name.trim()) nextErrors.athleteName = "El nombre es obligatorio";
    if (!form.athlete.email.trim()) nextErrors.athleteEmail = "El email es obligatorio";
    if (!form.athlete.phone.trim()) nextErrors.athletePhone = "El teléfono es obligatorio";
    if (!form.category.belt) nextErrors.belt = "Selecciona un cinturón";
    if (!form.category.division) nextErrors.division = "Selecciona una división";
    if (!form.category.modality) nextErrors.modality = "Selecciona una modalidad";
    if (!form.confirmations.termsAccepted) {
      nextErrors.termsAccepted = "Tienes que aceptar las condiciones del servicio";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    const payload = {
      athlete: form.athlete,
      championship: { eventId: Number(eventId), organizer: null, smoothcompLink: null },
      category: {
        weight: form.category.weight || null,
        belt: form.category.belt || null,
        division: form.category.division,
        modality: form.category.modality,
      },
      locate: form.locate,
      coverage: { extraIds: form.extraIds },
      preferences: form.preferences,
      billing: form.billing,
      confirmations: form.confirmations,
    };

    setSubmitting(true);
    try {
      const response = await requestCoverage(payload);
      navigate(`/requests/${response.id}`, { state: { request: response } });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <main className={styles.formPage}>
        <div className="container">
          <p>Cargando evento...</p>
        </div>
      </main>
    );
  }

  if (eventError || !event) {
    return (
      <main className={styles.formPage}>
        <div className="container">
          <p className={styles.errorMessage} role="alert">
            No se ha podido cargar el evento. Vuelve a la lista de eventos e inténtalo de nuevo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.formPage}>
      <section className={styles.hero}>
        {event.imageUrl && (
          <div className={styles.heroBackground}>
            <img
              src={resolveAssetUrl(event.imageUrl)}
              alt=""
              aria-hidden="true"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}></div>
          </div>
        )}
        <div className={`container ${styles.heroContent}`}>
          <h1>Solicitar cobertura</h1>
          <p>
            {event.name} · {new Date(event.date).toLocaleDateString("es-ES")} · {event.location}
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {submitError && (
              <p className={styles.errorBanner} role="alert">
                {submitError}
              </p>
            )}

            <fieldset className={styles.fieldset}>
              <legend>Datos del atleta</legend>
              <Input
                label="Nombre y apellidos"
                id="athleteName"
                required
                value={form.athlete.name}
                onChange={(e) => updateSection("athlete", "name", e.target.value)}
                error={errors.athleteName}
              />
              <Input
                label="Email"
                id="athleteEmail"
                type="email"
                required
                value={form.athlete.email}
                onChange={(e) => updateSection("athlete", "email", e.target.value)}
                error={errors.athleteEmail}
              />
              <Input
                label="Teléfono"
                id="athletePhone"
                required
                value={form.athlete.phone}
                onChange={(e) => updateSection("athlete", "phone", e.target.value)}
                error={errors.athletePhone}
              />
              <Input
                label="Instagram"
                id="athleteInstagram"
                value={form.athlete.instagram}
                onChange={(e) => updateSection("athlete", "instagram", e.target.value)}
              />
              <Input
                label="Gimnasio / Academia"
                id="athleteGym"
                value={form.athlete.gym}
                onChange={(e) => updateSection("athlete", "gym", e.target.value)}
              />
              <Input
                label="Ciudad"
                id="athleteCity"
                value={form.athlete.city}
                onChange={(e) => updateSection("athlete", "city", e.target.value)}
              />
              <Input
                label="País"
                id="athleteCountry"
                value={form.athlete.country}
                onChange={(e) => updateSection("athlete", "country", e.target.value)}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Categoría</legend>
              <Input
                label="Peso"
                id="weight"
                value={form.category.weight}
                onChange={(e) => updateSection("category", "weight", e.target.value)}
              />
              <Select
                label="Cinturón"
                id="belt"
                required
                options={BELT_OPTIONS}
                value={form.category.belt}
                onChange={(e) => updateSection("category", "belt", e.target.value)}
                error={errors.belt}
              />
              <Select
                label="División"
                id="division"
                required
                options={DIVISION_OPTIONS}
                value={form.category.division}
                onChange={(e) => updateSection("category", "division", e.target.value)}
                error={errors.division}
              />
              <Select
                label="Modalidad"
                id="modality"
                required
                options={MODALITY_OPTIONS}
                value={form.category.modality}
                onChange={(e) => updateSection("category", "modality", e.target.value)}
                error={errors.modality}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Información para localizarte</legend>
              <Input
                label="Nombre en Smoothcomp"
                id="smoothcompDisplayName"
                value={form.locate.smoothcompDisplayName}
                onChange={(e) => updateSection("locate", "smoothcompDisplayName", e.target.value)}
              />
              <Input
                label="Link a tu perfil de Smoothcomp"
                id="smoothcompProfileLink"
                value={form.locate.smoothcompProfileLink}
                onChange={(e) => updateSection("locate", "smoothcompProfileLink", e.target.value)}
              />
              <Input
                label="Hora aproximada del primer combate"
                id="estimatedFirstFightTime"
                value={form.locate.estimatedFirstFightTime}
                onChange={(e) => updateSection("locate", "estimatedFirstFightTime", e.target.value)}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Extras</legend>
              {loadingExtras && <p>Cargando extras...</p>}
              {!loadingExtras &&
                extras.map((extra) => (
                  <label key={extra.id} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={form.extraIds.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                    />
                    {extra.name} (+{extra.price}€)
                  </label>
                ))}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Preferencias</legend>
              <Textarea
                label="¿Qué tipo de fotos buscas?"
                id="photoPreferences"
                value={form.preferences.photoPreferences}
                onChange={(e) => updateSection("preferences", "photoPreferences", e.target.value)}
              />
              <Textarea
                label="¿Hay algún momento que quieras que intentemos capturar?"
                id="specialMoments"
                value={form.preferences.specialMoments}
                onChange={(e) => updateSection("preferences", "specialMoments", e.target.value)}
              />
              <Textarea
                label="¿Hay algo que debamos saber?"
                id="additionalNotes"
                value={form.preferences.additionalNotes}
                onChange={(e) => updateSection("preferences", "additionalNotes", e.target.value)}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Facturación</legend>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.billing.needsInvoice}
                  onChange={(e) => updateSection("billing", "needsInvoice", e.target.checked)}
                />
                Necesito factura
              </label>

              {form.billing.needsInvoice && (
                <>
                  <Input
                    label="Nombre o razón social"
                    id="invoiceName"
                    value={form.billing.invoiceName}
                    onChange={(e) => updateSection("billing", "invoiceName", e.target.value)}
                  />
                  <Input
                    label="NIF/CIF"
                    id="invoiceTaxId"
                    value={form.billing.invoiceTaxId}
                    onChange={(e) => updateSection("billing", "invoiceTaxId", e.target.value)}
                  />
                  <Input
                    label="Dirección de facturación"
                    id="invoiceAddress"
                    value={form.billing.invoiceAddress}
                    onChange={(e) => updateSection("billing", "invoiceAddress", e.target.value)}
                  />
                  <Input
                    label="País"
                    id="invoiceCountry"
                    value={form.billing.invoiceCountry}
                    onChange={(e) => updateSection("billing", "invoiceCountry", e.target.value)}
                  />
                </>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Confirmaciones</legend>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.confirmations.termsAccepted}
                  onChange={(e) => updateSection("confirmations", "termsAccepted", e.target.checked)}
                />
                <span>
                  He leído y acepto las{" "}
                  <Link
                    to="/legal/condiciones-servicio"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    condiciones del servicio
                  </Link>{" "}
                  y la{" "}
                  <Link
                    to="/legal/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    política de privacidad
                  </Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <span className={styles.errorMessage} role="alert">
                  {errors.termsAccepted}
                </span>
              )}

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.confirmations.portfolioConsent}
                  onChange={(e) => updateSection("confirmations", "portfolioConsent", e.target.checked)}
                />
                <span>
                  Autorizo el uso de algunas imágenes para el portfolio y redes
                  sociales de ShutterMats, conforme a los{" "}
                  <Link
                    to="/legal/uso-imagenes"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    términos de uso de imágenes
                  </Link>
                </span>
              </label>
            </fieldset>

            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
