import styles from "./StatusBadge.module.scss";

const STATUS_META = {
  PENDING: { label: "Pendiente", tone: "pending" },
  RECEIVED: { label: "Recibida", tone: "info" },
  CONFIRMED: { label: "Confirmada", tone: "success" },
  REJECTED: { label: "Rechazada", tone: "danger" },
  IN_PROGRESS: { label: "En progreso", tone: "info" },
  DELIVERED: { label: "Entregada", tone: "success" },
  NEW: { label: "Nuevo", tone: "pending" },
  READ: { label: "Leído", tone: "success" },
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? { label: status, tone: "default" };

  return (
    <span className={`${styles.badge} ${styles[meta.tone]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
