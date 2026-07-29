import styles from "./HowItWorks.module.scss";

const steps = [
  {
    number: "01",
    title: "Reserva",
    text: "A través de nuestra plataforma, reservas tu cobertura en un par de clics.",
  },
  {
    number: "02",
    title: "Confirmamos",
    text: "En cuanto tenemos horario y brackets. Sin rival o sin combate, te devolvemos el dinero. Cero riesgo.",
  },
  {
    number: "03",
    title: "Capturamos el evento",
    text: "Fotografiamos el combate completo: técnica, tensión y el momento en que todo se decide.",
  },
  {
    number: "04",
    title: "Seleccionamos y editamos",
    text: "Editamos cada imagen una a una, creando una colección documental única.",
  },
  {
    number: "05",
    title: "Publicamos la galería",
    text: "En galería privada, listas para descargar.",
  },
];

const HowItWorks = () => {
  return (
    <section className={styles.how}>
      <div className={styles.how__container}>
        <h2 className={styles.how__title}>Cómo Funciona</h2>

        <div className={styles.how__timeline}>
          {steps.map((step) => (
            <div key={step.number} className={styles.how__step}>
              <span className={styles.how__node}>{step.number}</span>
              <h3 className={styles.how__stepTitle}>{step.title}</h3>
              <p className={styles.how__text}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
