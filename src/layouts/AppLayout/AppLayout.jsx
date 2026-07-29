import { useEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./AppLayout.module.scss";

const AppLayout = ({ children }) => {
  const [showTop, setShowTop] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El botón es "fixed" respecto al viewport, no a la página, así que sin
  // esto se queda flotando encima del footer en cuanto llegas abajo del
  // todo. Lo escondemos un poco antes de que el footer entre en pantalla.
  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px 96px 0px" },
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      <main className={styles.main}>{children}</main>

      <Footer ref={footerRef} />

      {showTop && !nearFooter && (
        <button
          className={styles.scrollTop}
          aria-label="Volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </>
  );
};

export default AppLayout;
