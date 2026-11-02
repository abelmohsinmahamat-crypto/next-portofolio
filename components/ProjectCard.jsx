import Image from "next/image";
import styles from "./ProjectCard.module.css";

const accents = {
  violet: "#8b7bff",
  blue: "#5b8cff",
  cyan: "#22d3ee",
  emerald: "#34d399",
};

function getMonogram(title) {
  const words = title.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 5h5v5M19 5l-8 8" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export default function ProjectCard({ project, headingLevel = 3, eager = false }) {
  const accent = accents[project.accent] ?? "var(--accent)";
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const hasImage = Boolean(project.image);

  return (
    <article className={styles.card} style={{ "--project-accent": accent }}>
      <div
        className={`${styles.visual} ${hasImage ? styles.visualImage : ""}`}
        aria-hidden={hasImage ? undefined : "true"}
      >
        {hasImage ? (
          <>
            <Image
              src={project.image}
              alt={project.imageAlt ?? `Aperçu du projet ${project.title}`}
              fill
              sizes="(max-width: 680px) 100vw, (max-width: 1199px) 50vw, 270px"
              loading={eager ? "eager" : "lazy"}
              className={styles.image}
            />
            <span className={styles.imageShade} aria-hidden="true" />
            <span className={styles.shine} aria-hidden="true" />
          </>
        ) : (
          <>
            <span className={styles.grid} aria-hidden="true" />
            <span className={styles.monogram}>{getMonogram(project.title)}</span>
          </>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{project.status}</span>
        </div>
        <Heading className={styles.title}>{project.title}</Heading>
        <p className={styles.description}>{project.description}</p>

        {project.tech?.length ? (
          <ul className="tags" aria-label={`Technologies : ${project.tech.join(", ")}`}>
            {project.tech.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        {project.href ? (
          <a
            href={project.href}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.hrefLabel ?? "Voir le projet"} : ${project.title} (ouvre un nouvel onglet)`}
          >
            <span className={styles.linkLabel}>{project.hrefLabel ?? "Voir le projet"}</span>
            <span className={styles.linkIcon} aria-hidden="true">
              <ExternalIcon />
            </span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
