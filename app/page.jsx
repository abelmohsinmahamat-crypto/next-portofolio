import Image from "next/image";
export default function HomePage() {
  return (
    <main>
      <h1>Bonjour, je suis développeur web</h1>
      <Image
        src="/image.JPG"
        alt="Photo de profil du développeur"
        width={240}
        height={240}
        />
              <p>
        Je crée des applications web modernes
        avec React, Next.js et Node.js.
      </p>

      <a href="/projects">
        Découvrir mes projets
      </a>
    </main>
  );
}
