import CallToAction from "@/components/CallToAction";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import { projects } from "@/lib/projects";
import styles from "./projects.module.css";

export const metadata = {
  title: "Projets",
  description:
    "Sélection de projets personnels de Mohsin : analyse de CV avec IA, tableau de bord météo et portfolio Next.js.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className={styles.projects}>
        <div className="container">
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <span className={styles.eyebrow}>Portfolio</span>
              <span className={styles.headerLine} aria-hidden="true" />
              <span className={styles.headerCount}>{String(projects.length).padStart(2, "0")} projets</span>
            </div>

            <div className={styles.headerGrid}>
              <h1 className={styles.title}>
                Des projets qui résolvent des <span className="text-gradient">problèmes concrets</span>.
              </h1>
              <div className={styles.intro}>
                <p className={styles.description}>
                  Chaque projet est l’occasion de travailler une problématique complète : compréhension du besoin,
                  interface, données et mise en ligne.
                </p>
              </div>
            </div>
          </header>

          <ProjectsExplorer projects={projects} />
        </div>
      </section>

      <CallToAction
        eyebrow="Votre projet"
        title="Une idée à transformer en application ?"
        description="Parlons de votre besoin, de vos contraintes et de la manière de construire quelque chose d'utile et de durable."
        label="Me contacter"
      />
    </>
  );
}
