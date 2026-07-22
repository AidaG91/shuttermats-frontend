import Navbar from "../../layouts/Navbar/Navbar";
import styles from "./Home.module.scss";
import { Link } from "react-router";
import Button from "../../components/Button/Button";

function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.landing}>
        <section className={styles.landingHero}>
          <div className={styles.landingHeroInner}>
            <h1 className={styles.landingTitle}>
              No te pierdas <span>tu momento</span> BJJ
            </h1>
            <p className={styles.landingSubtitle}>
              El subtitlo del hero, algo motivador
            </p>
            <div>
              <Link to="/login">
                <Button variant="primary" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Register
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost" size="lg">
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
