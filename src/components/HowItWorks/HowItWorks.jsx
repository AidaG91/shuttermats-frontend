import styles from "./HowItWorks.module.scss";

const steps = [
  {
    number: "01",
    title: "Capturamos el evento",
    text: "Fotografiamos y grabamos cada combate, cada detalle y cada momento clave del evento.",
  },
  {
    number: "02",
    title: "Procesamos y editamos",
    text: "Seleccionamos, editamos y tratamos cada imagen y vídeo con un estilo cinematográfico y profesional.",
  },
  {
    number: "03",
    title: "Publicamos la galería",
    text: "Subimos el contenido a la plataforma para que atletas, academias y público puedan acceder a él.",
  },
  {
    number: "04",
    title: "Descarga y compra",
    text: "Los usuarios pueden ver, descargar o adquirir sus fotos y vídeos favoritos de forma segura.",
  },
];

const HowItWorks = () => {
  return (
    <section className={styles.how}>
      <div className={styles.how__container}>
        <h2 className={styles.how__title}>Cómo Funciona</h2>

        <div className={styles.how__steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.how__step}>
              <span className={styles.how__number}>{step.number}</span>
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
