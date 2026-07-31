import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import styles from "./ToastProvider.module.scss";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, variant = "success") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className={styles.stack} aria-live="polite" role="status">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={toast.variant === "error" ? `${styles.toast} ${styles.toastError}` : styles.toast}
            >
              {toast.variant === "error" ? (
                <AlertCircle size={18} className={styles.icon} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={18} className={styles.icon} aria-hidden="true" />
              )}
              <span className={styles.message}>{toast.message}</span>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => dismissToast(toast.id)}
                aria-label="Cerrar aviso"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
