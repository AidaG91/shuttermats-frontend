import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, HelpCircle } from "lucide-react";
import { sendContactMessage } from "../../services/contactService";
import { useToast } from "../../../../shared/components/Toast/useToast";
import Input from "../../../../shared/components/Input/Input";
import Select from "../../../../shared/components/Select/Select";
import Textarea from "../../../../shared/components/Textarea/Textarea";
import Button from "../../../../shared/components/Button/Button";
import InstagramIcon from "../../../../shared/components/icons/InstagramIcon";
import { CONTACT_SUBJECT_OPTIONS } from "../../utils/contactOptions";
import contactHero from "../../../../assets/images/contact-hero.jpg";
import styles from "./ContactPage.module.scss";

const CONTACT_EMAIL = "contact@shuttermats.com";
const CONTACT_PHONE = "676289686";
const CONTACT_PHONE_DISPLAY = "676 28 96 86";
const INSTAGRAM_HANDLE = "@shuttermats";
const INSTAGRAM_URL = "https://www.instagram.com/shuttermats/";

// The backend is the source of truth for validation (@Valid on ContactMessageRequestDTO).
// This map translates the field names the API returns into the form's keys.
const FIELD_ERROR_MAP = {
  name: "name",
  email: "email",
  phone: "phone",
  subject: "subject",
  message: "message",
  privacyAccepted: "privacyAccepted",
};

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacyAccepted: false,
};

export default function ContactPage() {
  const { showToast } = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // TODO(security): without reCAPTCHA/Turnstile this public form is an easy
  // target for automated spam (see the matching TODO in ContactController.java,
  // backend). When tackled: mount the widget here (reCAPTCHA v3 is invisible,
  // no puzzles) and send the token inside `form` for the backend to verify
  // before saving.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    setSubmitting(true);
    try {
      await sendContactMessage(form);
      setForm(INITIAL_FORM);
      showToast("Mensaje enviado. Te responderemos lo antes posible.", "success");
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        const mappedErrors = Object.fromEntries(
          Object.entries(err.fieldErrors).map(([field, msg]) => [FIELD_ERROR_MAP[field] ?? field, msg]),
        );
        setErrors(mappedErrors);
      }
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.contactPage}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img
            src={contactHero}
            alt=""
            aria-hidden="true"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <h1>Ponte en contacto</h1>
          <p>
            Capturamos la intensidad, el sudor y la victoria en la fracción de
            segundo de los deportes de combate. Hablemos de tu próximo evento.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.layout}>
            <form onSubmit={handleSubmit} className={styles.card} noValidate>
              {submitError && (
                <p className={styles.errorBanner} role="alert">
                  {submitError}
                </p>
              )}

              <Input
                label="Nombre completo"
                id="name"
                required
                placeholder="Nombre y apellidos"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={errors.name}
              />
              <Input
                label="Email"
                id="email"
                type="email"
                required
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                error={errors.email}
              />
              <Input
                label="Teléfono"
                id="phone"
                placeholder="Opcional"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                error={errors.phone}
              />
              <Select
                label="Asunto"
                id="subject"
                required
                options={CONTACT_SUBJECT_OPTIONS}
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                error={errors.subject}
              />
              <Textarea
                label="Mensaje"
                id="message"
                required
                rows={6}
                placeholder="Cuéntanos qué necesitas..."
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                error={errors.message}
              />

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.privacyAccepted}
                  onChange={(e) => updateField("privacyAccepted", e.target.checked)}
                />
                <span>
                  He leído y acepto la{" "}
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
              {errors.privacyAccepted && (
                <span className={styles.errorMessage} role="alert">
                  {errors.privacyAccepted}
                </span>
              )}

              <Button type="submit" variant="primary" fullWidth loading={submitting}>
                {submitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>

            <aside className={styles.infoStack}>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.infoCard}>
                <span className={styles.infoIcon}>
                  <Mail size={20} aria-hidden="true" />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>Escríbenos</span>
                  <span className={styles.infoValue}>{CONTACT_EMAIL}</span>
                </span>
              </a>

              <a href={`tel:+34${CONTACT_PHONE}`} className={styles.infoCard}>
                <span className={styles.infoIcon}>
                  <Phone size={20} aria-hidden="true" />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>Llámanos</span>
                  <span className={styles.infoValue}>{CONTACT_PHONE_DISPLAY}</span>
                </span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoCard}
              >
                <span className={styles.infoIcon}>
                  <InstagramIcon size={20} aria-hidden="true" />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>Instagram</span>
                  <span className={styles.infoValue}>{INSTAGRAM_HANDLE}</span>
                </span>
              </a>

              <div
                className={`${styles.infoCard} ${styles.infoCardDisabled}`}
                aria-disabled="true"
                title="Próximamente"
              >
                <span className={styles.infoIcon}>
                  <HelpCircle size={20} aria-hidden="true" />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>¿Necesitas respuesta rápida?</span>
                  <span className={styles.infoValue}>
                    Sección de FAQ próximamente
                  </span>
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
