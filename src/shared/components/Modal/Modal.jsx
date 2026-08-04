import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.scss";

// Generic modal shell (overlay + panel + escape-to-close + body scroll
// lock), reused by anything that needs a dialog: pricing plan forms in the
// admin, the public event detail modal, etc. Pass your own content as
// children; this only handles the chrome.
export default function Modal({ open, onClose, labelledBy, describedBy, className, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[styles.modal, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
