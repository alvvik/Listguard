interface StepItem {
  label: string;
  primary?: boolean;
}

const steps: StepItem[] = [
  { label: "Zaloguj się przez discord", primary: true },
  { label: "Wypełnij nasz formularz" },
  { label: "Poczekaj aż Twoje podanie zostanie zaakceptowane" },
  { label: "Graj z naszą społecznościa!", primary: true },
];

export default function Steps() {
  return (
    <section className="flex   items-center justify-center py-4">
      <ul className="steps steps-vertical lg:steps-horizontal justify-center text-center max-w-1/2">
        {steps.map((step) => (
          <li
            key={step.label}
            className={`step ${step.primary ? "step-primary font-bold" : ""} text-center `}
          >
            {step.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
