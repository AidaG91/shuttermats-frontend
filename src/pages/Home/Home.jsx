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
          <h2 className={styles.intro__title}>Bienvenidos a ShutterMats</h2>

          <p className={styles.intro__text}>
            En Shuttermats lo vivimos desde dentro, ya que somos practicantes y
            por eso entendemos que cada combate, cada entrenamiento y cada
            persona sobre el tatami tiene una historia que merece ser contada.
          </p>

          <p className={styles.intro__text}>
            Creamos fotografía y contenido audiovisual con una mirada auténtica,
            cinematográfica y humana, capturando la intensidad, pero también la
            comunidad, el respeto y la pasión que lo hacen único.
          </p>

          <p className={styles.intro__text}>
            No estamos aquí solo para hacer fotos y vídeos, sino para
            representar la esencia del BJJ y el Grappling tal y como lo vivimos
            nosotros.
          </p>
        </div>
      </section>

      <HowItWorks />
      <RecentGalleries />
      <FinalCTA />
    </main>
  );
};

export default Home;
