import { Link } from "react-router";
import styles from "./NotFoundPage.module.scss";

export default function NotFoundPage() {
  return (
    <main className={styles.notFound}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1>Página no encontrada</h1>
        <p>La página que buscas no existe o todavía no está disponible.</p>
        <Link to="/" className={styles.homeLink}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
