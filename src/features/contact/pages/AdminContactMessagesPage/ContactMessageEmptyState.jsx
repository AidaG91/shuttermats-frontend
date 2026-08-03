import { MessageSquare } from "lucide-react";
import styles from "./ContactMessageEmptyState.module.scss";

export default function ContactMessageEmptyState() {
  return (
    <div className={styles.emptyState}>
      <MessageSquare size={32} aria-hidden="true" />
      <p>Selecciona un mensaje de la lista para ver los detalles.</p>
    </div>
  );
}
