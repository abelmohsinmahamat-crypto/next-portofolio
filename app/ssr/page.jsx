
export const dynamic = "force-dynamic";

export default function SSRPage() {
  const generatedAt = new Date().toLocaleString(
    "fr-FR",
    {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "Africa/Ndjamena",
    }
  );

  return (
    <main>
      <h1>Exemple de SSR</h1>

      <p>
        Cette page a été générée côté serveur.
      </p>

      <p>Générée à : {generatedAt}</p>
    </main>
  );
}
