import { useEffect, useState } from "react";
import styles from "./ScrollToTopButton.module.scss";

const VISIBILITY_THRESHOLD = 300;
const FOOTER_ROOT_MARGIN = "0px 0px 96px 0px";

const ScrollToTopButton = ({ footerRef }) => {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > VISIBILITY_THRESHOLD);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: FOOTER_ROOT_MARGIN },
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [footerRef]);

  if (!visible || nearFooter) return null;

  return (
    <button
      type="button"
      className={styles.scrollTop}
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
