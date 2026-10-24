interface StepItem {
  label: string;
  primary?: boolean;
}

const steps: StepItem[] = [
  { label: "Zaloguj się przez Discord", primary: true },
  { label: "Wypełnij formularz whitelisty" },
  { label: "Poczekaj na rozpatrzenie podania" },
  { label: "Dołącz i graj z nami!", primary: true },
];

export default function Steps() {
  return (
    <section className="flex flex-col items-center justify-center py-8 px-4 max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Jak zacząć?</h2>
        <p className="text-base-content/70 text-sm max-w-md mx-auto">
          Cztery proste kroki dzielą Cię od dołączenia do naszej społeczności.
        </p>
      </div>
      <div className="w-full overflow-x-auto py-4 flex justify-center">
        <ul className="steps steps-vertical lg:steps-horizontal w-full max-w-3xl">
          {steps.map((step) => (
            <li
              key={step.label}
              className={`step ${step.primary ? "step-primary font-semibold" : ""} text-sm px-2`}
            >
              {step.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
