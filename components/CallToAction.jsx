import Link from "next/link";
import styles from "./CallToAction.module.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function CallToAction({
  eyebrow = "Prochaine étape",
  title = "Un projet en tête ?",
  description = "Discutons de ce que vous voulez construire et de la meilleure façon de le livrer.",
  href = "/contact",
  label = "Démarrer la conversation",
}) {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.copy}>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.text}>{description}</p>
          </div>
          <Link href={href} className="btn btn-primary">
            {label}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
