
const projects = [
  {
    name: "AI CV Analyzer",
    description:
      "Une application d'analyse de CV et de matching d'offres.",
    technologies: "React, Node.js, MongoDB",
  },
  {
    name: "Weather Dashboard",
    description:
      "Un tableau de bord pour consulter la météo.",
    technologies: "React, API météo, CSS",
  },
  {
    name: "Portfolio",
    description:
      "Un site pour présenter mes compétences et projets.",
    technologies: "Next.js, React, CSS",
  },
];

export default function ProjectsPage() {
  return (
    <main>
      <h1>Mes projets</h1>

      {projects.map((project) => (
        <article key={project.name}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <p>{project.technologies}</p>
        </article>
      ))}
    </main>
  );
}
