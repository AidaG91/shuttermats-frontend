import styles from "./Home.module.scss";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import RecentGalleries from "../../components/RecentGalleries/RecentGalleries";
import FinalCTA from "../../components/FinalCTA/FinalCTA";

const Home = () => {
  return (
    <main className={styles.home}>
      <Hero />

      <section className={styles.intro}>
        <div className={styles.intro__container}>
          <span className={styles.intro__eyebrow}>Quiénes somos</span>

          <blockquote className={styles.intro__quote}>
            No solo hacemos fotos: contamos la historia de cada combate, cada
            entrenamiento y cada persona sobre el tatami — porque nosotros
            también lo vivimos.
          </blockquote>

          <p className={styles.intro__attribution}>— El equipo de ShutterMats</p>
        </div>
      </section>

      <HowItWorks />
      <RecentGalleries />
      <FinalCTA />
    </main>
  );
};

export default Home;
