import Link from "next/link";
import CallToAction from "@/components/CallToAction";
import InkOrbitHero from "@/components/InkOrbitHero";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/SpotlightCard";
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

function LayoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}

function ApiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01M12 7h5M12 17h5" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 18l4.2-4.8" />
      <circle cx="12" cy="18" r="1.4" />
    </svg>
  );
}

const serviceIcons = [LayoutIcon, ApiIcon, GaugeIcon];
const serviceAccents = ["#8b7bff", "#5b8cff", "#fbbf24"];

export default function HomePage() {
  const serviceCards = services.map((service, index) => {
    const Icon = serviceIcons[index] ?? LayoutIcon;
    const accent = serviceAccents[index] ?? "#8b7bff";

    return (
      <SpotlightCard
        key={service.title}
        className={styles.serviceCard}
        color={accent}
        style={{ "--service-accent": accent }}
        intensity={0.18}
        size={300}
        borderGlow={0.45}
        proximity={80}
      >
        <div className={styles.serviceTop}>
          <span className={styles.serviceIcon}>
            <Icon />
          </span>
          <span className={styles.serviceIndex}>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3 className={styles.serviceTitle}>{service.title}</h3>
        <p className={styles.serviceText}>{service.description}</p>
        <span className={styles.serviceLine} aria-hidden="true" />
      </SpotlightCard>
    );
  });

  return (
    <>
      <InkOrbitHero
        titleTop="Je construis des"
        titleAccent={["expériences web", "APIs robustes", "produits utiles"]}
        description={site.description}
        primaryCta="Voir mes projets"
        primaryHref="/projects"
        secondaryCta="Me contacter"
        secondaryHref="/contact"
        stack={technologies.slice(0, 5).map((technology) => technology.name)}
        stackLabel="Stack principale"
      />

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

          <Reveal className={styles.marqueeReveal}>
            <div className={styles.servicesMarquee}>
              <div className={styles.servicesViewport}>
                <div className={styles.servicesTrack}>
                  <div className={styles.servicesGroup}>{serviceCards}</div>
                  <div className={styles.servicesGroup} aria-hidden="true">
                    {serviceCards}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
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
