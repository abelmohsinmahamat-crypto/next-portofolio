import { Suspense } from "react";
import { connection } from "next/server";
import SectionHeading from "@/components/SectionHeading";
import styles from "./ssr.module.css";

export const metadata = {
  title: "SSR",
  description: "Exemple de rendu côté serveur à la demande avec Next.js et Cache Components.",
};

async function GeneratedAt() {
  await connection();

  const generatedAt = new Date().toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Africa/Ndjamena",
  });

  return (
    <div className={styles.card}>
      <span className={styles.label}>Générée à</span>
      <p className={styles.time}>{generatedAt}</p>
      <p className={styles.note}>Fuseau horaire : Africa/Ndjamena.</p>
    </div>
  );
}

export default function SSRPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow="Démonstration"
          title="Rendu côté serveur à la demande."
          description="Cette page utilise connection() pour générer la date à chaque requête, tandis que le reste de l'interface est prérendu avec Cache Components."
        />

        <Suspense
          fallback={
            <div className={styles.card} role="status">
              <span className={styles.label}>Générée à</span>
              <p className={styles.time}>Calcul en cours…</p>
            </div>
          }
        >
          <GeneratedAt />
        </Suspense>
      </div>
    </section>
  );
}
