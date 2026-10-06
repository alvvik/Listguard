interface PrivacySection {
  title: string;
  content: string;
}

const privacySections: PrivacySection[] = [
  {
    title: "1. Postanowienia ogólne",
    content:
      "Niniejsza polityka prywatności określa zasady przetwarzania danych osobowych przez serwis Listguard. Administracja zobowiązuje się do ochrony danych użytkowników zgodnie z RODO.",
  },
  {
    title: "2. Zbierane dane",
    content:
      "Serwis zbiera: Discord ID, nazwę użytkownika, odpowiedzi z formularza whitelist. Dane te są niezbędne do obsługi podań.",
  },
  {
    title: "3. Cel przetwarzania",
    content:
      "Dane są przetwarzane w celu weryfikacji podań o whitelist oraz komunikacji z użytkownikami. Nie są udostępniane osobom trzecim.",
  },
  {
    title: "4. Prawa użytkownika",
    content:
      "Użytkownik ma prawo do wglądu, modyfikacji i usunięcia swoich danych. W celu realizacji tych praw należy skontaktować się z administracją.",
  },
  {
    title: "5. Przechowywanie danych",
    content:
      "Dane są przechowywane przez okres niezbędny do realizacji celu przetwarzania, nie dłużej niż 2 lata od ostatniej aktywności.",
  },
];

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-2 max-w-4xl mx-auto justify-center items-center">
      <h1 className="text-3xl font-bold text-center my-8">
        Polityka prywatności
      </h1>

      <div className="prose prose-invert max-w-none">
        {privacySections.map((section) => (
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
