
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      {" | "}
      <Link href="/about">À propos</Link>
      {" | "}
      <Link href="/projects">Projets</Link>
      {" | "}
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
