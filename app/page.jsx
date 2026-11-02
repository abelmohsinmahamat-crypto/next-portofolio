import Link from "next/link";
import CallToAction from "@/components/CallToAction";
import HeroBackdrop from "@/components/HeroBackdrop";
import LanyardBadge from "@/components/LanyardBadge";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/projects";
import { services, site, technologies } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.description,
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <HeroBackdrop />

        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={`badge ${styles.heroBadge}`}>
                <span className={styles.heroBadgeDot} aria-hidden="true" />
                {site.name} · {site.role}
              </span>

              <h1 className={styles.heroTitle}>
                Je construis des <span className="text-gradient">expériences web</span> modernes, du frontend jusqu’à l’API.
              </h1>

              <p className={styles.heroText}>{site.description}</p>

              <div className={styles.heroActions}>
                <Link href="/projects" className="btn btn-primary">
                  Voir mes projets
                  <ArrowIcon />
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Me contacter
                </Link>
              </div>

              <div className={styles.heroTech}>
                <span className={styles.heroTechLabel}>Stack principale</span>
                <ul className="tags">
                  {technologies.slice(0, 5).map((technology) => (
                    <li key={technology.name} className="tag">
                      {technology.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <LanyardBadge />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="services-title"
              eyebrow="Ce que je fais"
              title="Des produits complets, pas seulement des pages."
              description="De l'interface au serveur, je prends en charge les étapes qui transforment une idée en application utilisable."
            />
          </Reveal>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 80}>
                <article className={styles.serviceCard}>
                  <span className={styles.serviceIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceText}>{service.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="work-title">
        <div className="container">
          <Reveal>
            <div className={styles.workHeader}>
              <SectionHeading
                id="work-title"
                eyebrow="Sélection"
                title="Projets récents"
                description="Une sélection de projets personnels qui couvrent l'interface, les données et l'intégration d'APIs."
              />
              <Link href="/projects" className={styles.textLink}>
                Tous les projets
                <ArrowIcon />
              </Link>
            </div>
          </Reveal>

          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 80} className={styles.cardWrap}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="stack-title">
        <div className="container">
          <div className={styles.stackPanel}>
            <Reveal>
              <SectionHeading
                id="stack-title"
                eyebrow="Stack"
                title="Les outils que j'utilise au quotidien."
                description="Une base technique volontairement ciblée, choisie pour livrer des applications claires et maintenables."
              />
            </Reveal>

            <Reveal delay={80}>
              <ul className={styles.stackList}>
                {technologies.map((technology) => (
                  <li key={technology.name} className={styles.stackItem}>
                    <span>{technology.name}</span>
                    <small>{technology.note}</small>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
