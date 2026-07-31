import { Link, useParams } from "react-router";
import { renderMarkdown } from "../../shared/utils/markdown.jsx";
import terminosServicio from "../../assets/legal/terminos-servicio-cobertura.md?raw";
import terminosImagenes from "../../assets/legal/terminos-uso-imagenes.md?raw";
import politicaPrivacidad from "../../assets/legal/politica-privacidad.md?raw";
import styles from "./LegalDocPage.module.scss";

const DOCS = {
  "condiciones-servicio": terminosServicio,
  "uso-imagenes": terminosImagenes,
  privacidad: politicaPrivacidad,
};

export default function LegalDocPage() {
  const { slug } = useParams();
  const markdown = DOCS[slug];

  if (!markdown) {
    return (
      <main className={styles.legalPage}>
        <div className="container">
          <p className={styles.errorMessage} role="alert">
            No hemos encontrado ese documento.
          </p>
          <Link to="/" className={styles.link}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.legalPage}>
      <div className={`container ${styles.content}`}>{renderMarkdown(markdown)}</div>
    </main>
  );
}
