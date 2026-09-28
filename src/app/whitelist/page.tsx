"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { LoginStep } from "./components/LoginStep";

import { ConfirmStep } from "./components/ConfirmStep";
import { StepNavigation } from "./components/StepNavigation";
import { submitWhitelistForm } from "@/lib/actions";
import { QAStep } from "./components/QAStep";

const STEPS = ["Zaloguj się", "Pytania whitelist", "Potwierdź"] as const;
type Step = 0 | 1 | 2;

export default function WhitelistPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);

    const result = await submitWhitelistForm(formData);

    if (result.success) {
      setSuccess(true);
    } else if (result.error) {
      console.error(result.error);
    }

    setLoading(false);
  };

  if (success) {
    return <p>succes</p>;
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm space-y-6 mx-auto ring bg-base-100 p-4 rounded-lg min-h-96 flex flex-col justify-center">
        <ul className="steps w-full">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`step ${i <= step ? "step-primary" : ""}`}
            >
              {label}
            </li>
          ))}
        </ul>

        {step === 0 && <LoginStep session={session} onContinue={handleNext} />}
        {step === 1 && <QAStep answers={answers} setAnswers={setAnswers} />}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <ConfirmStep />
            {/* Przekazujemy odpowiedzi dalej, aby FormData je przechwyciło */}
            {Object.entries(answers).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
            <StepNavigation
              currentStep={step}
              onBack={handleBack}
              onNext={handleNext}
              loading={loading}
              nextDisabled={false}
              isLastStep={true}
            />
          </form>
        )}
        {step !== 2 && (
          <StepNavigation
            currentStep={step}
            onBack={handleBack}
            onNext={handleNext}
            loading={loading}
            nextDisabled={step === 0 && !session}
            isLastStep={false}
          />
        )}
      </div>
    </div>
  );
}
