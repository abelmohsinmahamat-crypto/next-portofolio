import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact",
  description:
    "Contactez Mohsin pour discuter d'un projet web, d'une collaboration ou d'une opportunité en développement full-stack.",
};

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 5h5v5M19 5l-8 8" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <section className={styles.contact}>
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Discutons de votre projet."
          description="Une question, une idée ou une collaboration ? Écrivez-moi quelques lignes et je reviendrai vers vous."
        />

        <div className={styles.grid}>
          <Reveal>
            <aside className={styles.info}>
              <h2 className={styles.infoTitle}>Coordonnées</h2>
              <p className={styles.infoText}>
                Le meilleur moyen de me joindre pour le moment est GitHub. Je pourrai ajouter un email public dès qu’il
                sera disponible.
              </p>

              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoLabel}>GitHub</span>
                  <a
                    href={site.github}
                    className={styles.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Profil GitHub (ouvre un nouvel onglet)"
                  >
                    {site.githubLabel}
                    <ExternalIcon />
                  </a>
                </li>
                <li>
                  <span className={styles.infoLabel}>Réponse</span>
                  <span className={styles.infoValue}>Via GitHub</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Projets</span>
                  <span className={styles.infoValue}>Sites, apps web, APIs</span>
                </li>
              </ul>

              <p className={styles.infoNote}>
                Aucun email public n’est affiché pour le moment et aucun message n’est transmis automatiquement via ce
                site.
              </p>
            </aside>
          </Reveal>

          <Reveal delay={80}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
