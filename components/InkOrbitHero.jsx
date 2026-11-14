"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";
import InkOrbitSculpture from "./InkOrbitSculpture";
import styles from "./InkOrbitHero.module.css";

const DEFAULT_ACCENTS = ["expériences web", "APIs robustes", "produits utiles"];
const ROTATE_INTERVAL = 3600;
const BLUR_DURATION = 420;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FrameCorners() {
  return (
    <>
      <span className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true" />
    </>
  );
}

function Action({ href, onClick, className, children }) {
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

/**
 * Hero panel with a cycling serif headline and an interactive ink sculpture.
 *
 * The CTAs render as links when a `href` is provided, so navigation keeps
 * working with keyboard, middle-click and search engines.
 */
export default function InkOrbitHero({
  titleTop = "Je construis des",
  titleAccent = DEFAULT_ACCENTS,
  description,
  primaryCta = "Voir mes projets",
  primaryHref = "/projects",
  onPrimary,
  secondaryCta = "Me contacter",
  secondaryHref = "/contact",
  onSecondary,
  stack = [],
  stackLabel = "Stack principale",
  sculptureSeed = 7,
  onReforge,
  sculptureLabel = "INK · 3D",
  sculptureHint = "Glissez pour tourner · Cliquez pour reforger",
  className = "",
}) {
  const reducedMotion = usePrefersReducedMotion();
  const normalizedAccents = (Array.isArray(titleAccent) ? titleAccent : [titleAccent]).filter(
    Boolean,
  );
  const accents = normalizedAccents.length > 0 ? normalizedAccents : [""];

  const [wordIndex, setWordIndex] = useState(0);
  const [wordLeaving, setWordLeaving] = useState(false);

  useEffect(() => {
    if (reducedMotion || accents.length < 2) return undefined;

    let swapTimer;

    const rotateTimer = window.setInterval(() => {
      setWordLeaving(true);
      swapTimer = window.setTimeout(() => {
        setWordIndex((index) => (index + 1) % accents.length);
        setWordLeaving(false);
      }, BLUR_DURATION);
    }, ROTATE_INTERVAL);

    return () => {
      window.clearInterval(rotateTimer);
      window.clearTimeout(swapTimer);
      /* If reduced motion or a prop change interrupts the blur-out, reveal it again. */
      setWordLeaving(false);
    };
  }, [accents.length, reducedMotion]);

  const currentWord = accents[wordIndex % accents.length];

  return (
    <section className={`${styles.root} ${className}`.trim()} aria-label="Introduction">
      <div className={`container ${styles.shell}`}>
        <div className={styles.panel}>
          <div className={styles.copy}>
            <div className={styles.band}>
              <h1 id="hero-title" className={styles.title}>
                <span className={styles.titleTop}>{titleTop}</span>
                <span className={styles.titleAccent}>
                  <span
                    key={wordIndex}
                    className={`${styles.word} ${wordLeaving ? styles.wordOut : ""}`.trim()}
                  >
                    {currentWord}
                  </span>
                </span>
              </h1>
            </div>

            <div className={styles.body}>
              {description ? <p className={styles.lede}>{description}</p> : null}

              {primaryCta || secondaryCta ? (
                <div className={styles.actions}>
                  {primaryCta ? (
                    <Action href={primaryHref} onClick={onPrimary} className={styles.primary}>
                      {primaryCta}
                      <ArrowIcon />
                    </Action>
                  ) : null}

                  {secondaryCta ? (
                    <span className={styles.frame}>
                      <FrameCorners />
                      <Action
                        href={secondaryHref}
                        onClick={onSecondary}
                        className={styles.secondary}
                      >
                        {secondaryCta}
                      </Action>
                    </span>
                  ) : null}
                </div>
              ) : null}

              {stack.length > 0 ? (
                <div className={styles.stack}>
                  <span className={styles.stackLabel}>{stackLabel}</span>
                  <ul className={styles.stackTags}>
                    {stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.art}>
            <div className={styles.artFill}>
              <InkOrbitSculpture
                height="100%"
                seed={sculptureSeed}
                onReforge={onReforge}
                label={sculptureLabel}
                hint={sculptureHint}
                density={0.9}
                maxDpr={1.75}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
