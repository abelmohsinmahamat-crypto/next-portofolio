import Image from "next/image";
import CallToAction from "@/components/CallToAction";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { objectives, site, skillGroups } from "@/lib/site";
import styles from "./about.module.css";

export const metadata = {
  title: "À propos",
  description:
    "Découvrez le parcours, les compétences et les objectifs de Mohsin, développeur full-stack spécialisé dans l'écosystème JavaScript.",
};

const facts = [
  { label: "Rôle", value: "Développeur full-stack" },
  { label: "Focus", value: "Produits web" },
  { label: "Stack", value: "Next.js · React" },
  { label: "Approche", value: "Qualité & accessibilité" },
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="À propos"
            title="Développeur full-stack, curieux et orienté produit."
            description="J'aime transformer des idées en interfaces claires et en systèmes fiables, en gardant toujours l'utilisateur au centre."
          />

          <div className={styles.introGrid}>
            <Reveal>
              <div className={styles.photoCard}>
                <Image
                  src="/images/portrait.jpg"
                  alt={`Portrait de ${site.name}, ${site.role.toLowerCase()}`}
                  width={409}
                  height={526}
                  sizes="(max-width: 900px) 70vw, 320px"
                  className={styles.photo}
                />
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className={styles.bio}>
                <p>
                  Je m’appelle <strong>{site.name}</strong> et je suis développeur full-stack. Mon travail se situe à la
                  frontière du design et de l’ingénierie : je construis des applications avec React et Next.js, je
                  structure les données et les APIs, puis je soigne les détails qui font la différence.
                </p>
                <p>
                  J’utilise principalement <strong>React, Next.js, Node.js, Express et MongoDB</strong>. J’aime les
                  interfaces sobres, les architectures compréhensibles et le code que l’on peut faire évoluer sans
                  craindre d’y revenir.
                </p>
                <p>
                  Ce portfolio rassemble une sélection de projets personnels. Chaque projet est l’occasion d’explorer un
                  problème concret, d’apprendre un nouvel outil et de livrer une expérience complète.
                </p>

                <dl className={styles.facts}>
                  {facts.map((fact) => (
                    <div key={fact.label} className={styles.fact}>
                      <dt className={styles.factLabel}>{fact.label}</dt>
                      <dd className={styles.factValue}>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="skills-title"
              eyebrow="Compétences"
              title="Une base full-stack, du navigateur à la base de données."
              description="Les technologies que je mobilise pour concevoir, développer et maintenir des applications web complètes."
            />
          </Reveal>

          <div className={styles.skillsGrid}>
            {skillGroups.map((group, index) => (
              <Reveal key={group.title} delay={index * 70} className={styles.cardWrap}>
                <article className={styles.skillCard}>
                  <h3 className={styles.skillTitle}>
                    <span className={styles.skillBar} aria-hidden="true" />
                    {group.title}
                  </h3>
                  <ul className="tags">
                    {group.skills.map((skill) => (
                      <li key={skill} className="tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="objectives-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="objectives-title"
              eyebrow="Objectifs"
              title="Ce que je cherche à construire."
              description="Trois directions qui guident mes projets et ma progression."
            />
          </Reveal>

          <div className={styles.objectivesGrid}>
            {objectives.map((objective, index) => (
              <Reveal key={objective.title} delay={index * 70} className={styles.cardWrap}>
                <article className={styles.objectiveCard}>
                  <span className={styles.objectiveIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={styles.objectiveTitle}>{objective.title}</h3>
                  <p className={styles.objectiveText}>{objective.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Collaboration"
        title="Travaillons ensemble."
        description="Vous avez une idée, un besoin ou un projet à faire avancer ? Je serais ravi d'en discuter."
      />
    </>
  );
}
