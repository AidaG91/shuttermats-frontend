import { useRef } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import styles from "./AppLayout.module.scss";

const AppLayout = ({ children }) => {
  const footerRef = useRef(null);

  return (
    <>
      <Header />

      <main className={styles.main}>{children}</main>

      <Footer ref={footerRef} />

      <ScrollToTopButton footerRef={footerRef} />
    </>
  );
};

export default AppLayout;
