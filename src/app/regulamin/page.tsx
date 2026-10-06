interface RegulationSection {
  title: string;
  content: string;
}

const regulations: RegulationSection[] = [
  {
    title: "1. Postanowienia ogólne",
    content:
      "Korzystanie z serwisu jest równoznaczne z akceptacją niniejszego regulaminu. Serwis służy do składania podań o whitelist na serwer gry.",
  },
  {
    title: "2. Zasady zachowania",
    content:
      "Zabrania się używania cheatów i exploitów oraz obrażania innych graczy. Należy przestrzegać zasad RP",
  },
  {
    title: "3. Zasady whitelist",
    content:
      "Podanie musi być wypełnione zgodnie z prawdą Zabrania się spamowania podaniami. Czas rozpatrzenia: do 48 godzin",
  },
  {
    title: "4. Odpowiedzialność",
    content:
      "Naruszenie regulaminu może skutkować banem.Administracja nie odpowiada za szkody wynikające z korzystania z serwisu.",
  },
];

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-2 max-w-4xl mx-auto justify-center items-center">
      <h1 className="text-3xl font-bold text-center my-8">Regulamin serwisu</h1>

      <div className="prose prose-invert max-w-none">
        {regulations.map((section) => (
          <section key={section.title} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            {section.content}
          </section>
        ))}
      </div>

      <p>Ostatnia aktualizacja: 10.06.2026</p>
    </div>
  );
}
