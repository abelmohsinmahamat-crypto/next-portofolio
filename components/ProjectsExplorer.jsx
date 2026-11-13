"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./ProjectsExplorer.module.css";

const accents = {
  violet: "#8b7bff",
  blue: "#5b8cff",
  cyan: "#22d3ee",
  emerald: "#34d399",
};

const EASE = [0.22, 0.61, 0.36, 1];

/* Collapsed preview: 2 lines at 0.93rem × 1.75 plus the 10px top margin.
   Keeping this as the only collapsed height avoids animating two heights at once. */
const PREVIEW_HEIGHT = 64;

const contentVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function getMonogram(title) {
  const words = title.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.6c0-.8.9-1.3 1.6-.9l9 6.4c.6.4.6 1.4 0 1.8l-9 6.4c-.7.4-1.6-.1-1.6-.9V5.6Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.35 9.35 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function ProjectShowcaseCard({ project, index, open, onOpen, onClose, eager }) {
  const panelId = useId();
  const toggleRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const accent = accents[project.accent] ?? "var(--accent)";
  const hasImage = Boolean(project.image);
  const techCount = project.tech?.length ?? 0;
  const tiltEnabled = !reduceMotion && !open;

  function handlePointerMove(event) {
    if (!tiltEnabled) return;
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    event.currentTarget.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--tilt-x", `${((0.5 - y) * 3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${((x - 0.5) * 3).toFixed(2)}deg`);
  }

  function resetTilt(event) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  function handleKeyDown(event) {
    if (event.key !== "Escape" || !open) return;
    event.stopPropagation();
    onClose();
    window.requestAnimationFrame(() => toggleRef.current?.focus());
  }

  return (
    <article
      className={styles.card}
      data-open={open ? "" : undefined}
      style={{ "--project-accent": accent }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onKeyDown={handleKeyDown}
    >
      <div className={`${styles.media} ${hasImage ? "" : styles.mediaFallback}`}>
        {hasImage ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? `Aperçu du projet ${project.title}`}
            fill
            sizes="(max-width: 760px) 92vw, (max-width: 1200px) 44vw, 520px"
            loading={eager ? "eager" : "lazy"}
            className={styles.mediaImage}
          />
        ) : (
          <>
            <span className={styles.mediaGrid} aria-hidden="true" />
            <span className={styles.monogram} aria-hidden="true">
              {getMonogram(project.title)}
            </span>
          </>
        )}

        <span className={styles.mediaShade} aria-hidden="true" />
        <span className={styles.mediaIndex} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.mediaStatus}>{project.status}</span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{project.title}</h2>

        <motion.div
          id={panelId}
          className={styles.expander}
          initial={false}
          animate={{ height: open ? "auto" : PREVIEW_HEIGHT }}
          transition={reduceMotion ? { duration: 0 } : { height: { duration: 0.5, ease: EASE } }}
        >
          <p className={styles.description}>{project.description}</p>

          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                key="content"
                className={styles.detailsInner}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 6, transition: { duration: 0.18 } }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE, delay: reduceMotion ? 0 : 0.08 }}
              >
                <div className={styles.block}>
                  <p className={styles.label}>Points clés</p>
                  <ul className={styles.highlights}>
                    {project.highlights?.map((highlight) => (
                      <li key={highlight} className={styles.highlight}>
                        <span className={styles.check} aria-hidden="true">
                          <CheckIcon />
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  className={styles.block}
                  variants={contentVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE, delay: reduceMotion ? 0 : 0.16 }}
                >
                  <p className={styles.label}>Technologies</p>
                  <ul className={styles.techList}>
                    {project.tech?.map((tech) => (
                      <li key={tech} className={styles.tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  className={styles.actions}
                  variants={contentVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE, delay: reduceMotion ? 0 : 0.22 }}
                >
                  {project.demo ? (
                    <a
                      className={`${styles.action} ${styles.actionPrimary}`}
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Démo en ligne de ${project.title} (ouvre un nouvel onglet)`}
                    >
                      <PlayIcon />
                      <span>Démo en ligne</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.action} ${styles.actionDisabled}`}
                      disabled
                      title="Aucune démo publique disponible pour ce projet"
                    >
                      <PlayIcon />
                      <span>Démo à venir</span>
                    </button>
                  )}

                  {project.href ? (
                    <a
                      className={`${styles.action} ${styles.actionGhost}`}
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Code source de ${project.title} sur GitHub (ouvre un nouvel onglet)`}
                    >
                      <GitHubIcon />
                      <span>Code source</span>
                    </a>
                  ) : null}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <div className={styles.footer}>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Réduire les détails de ${project.title}` : `Voir les détails de ${project.title}`}
            onClick={open ? onClose : onOpen}
          >
            <span>{open ? "Réduire" : "Voir le projet"}</span>
            <span className={styles.toggleIcon} aria-hidden="true">
              <ChevronIcon />
            </span>
          </button>

          <span className={styles.techCount}>
            {String(techCount).padStart(2, "0")} techno{techCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsExplorer({ projects }) {
  const [openSlug, setOpenSlug] = useState(null);

  return (
    <div className={styles.grid}>
      {projects.map((project, index) => (
        <ProjectShowcaseCard
          key={project.slug}
          project={project}
          index={index}
          open={openSlug === project.slug}
          onOpen={() => setOpenSlug(project.slug)}
          onClose={() => setOpenSlug((current) => (current === project.slug ? null : current))}
          eager={index < 2}
        />
      ))}
    </div>
  );
}
