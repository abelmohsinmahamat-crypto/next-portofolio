import Link from "next/link";
import CopyrightYear from "@/components/CopyrightYear";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label={`${site.name} — Accueil`}>
            {site.name}
            <span className={styles.logoDot}>.</span>
          </Link>
          <p className={styles.tagline}>{site.tagline}</p>
        </div>

        <nav className={styles.nav} aria-label="Navigation de pied de page">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.social}>
          <a
            href={site.github}
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil GitHub (ouvre un nouvel onglet)"
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © <CopyrightYear /> {site.name}. Tous droits réservés.
        </span>
        <span>Conçu et développé avec Next.js.</span>
      </div>
    </footer>
  );
}
