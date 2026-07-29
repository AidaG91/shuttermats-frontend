import styles from "./AdminPagination.module.scss";

const AdminPagination = ({ page, totalPages, totalElements, onPageChange, label }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label={label}>
      <button
        type="button"
        className={styles.pageButton}
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>

      <span className={styles.pageInfo}>
        Página {page + 1} de {totalPages}
        {typeof totalElements === "number" && ` · ${totalElements} en total`}
      </span>

      <button
        type="button"
        className={styles.pageButton}
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
};

export default AdminPagination;
