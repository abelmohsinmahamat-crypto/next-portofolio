import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { site } from "@/lib/site";
import "./globals.css";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  keywords: ["développeur full-stack", "Next.js", "React", "JavaScript", "portfolio"],
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.description,
    type: "website",
    locale: "fr_FR",
    siteName: `${site.name} Portfolio`,
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
};

export const viewport = {
  themeColor: "#070a13",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>
        <div className={styles.shell}>
          <Navbar />
          <main id="main" className={styles.main}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
