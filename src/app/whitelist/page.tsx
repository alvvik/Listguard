"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { LoginStep } from "./components/LoginStep";

import { ConfirmStep } from "./components/ConfirmStep";
import { StepNavigation } from "./components/StepNavigation";
import { submitWhitelistForm } from "@/lib/actions";
import { QAStep } from "./components/QAStep";
import { config } from "../../../config";

const STEPS = ["Zaloguj się", "Pytania whitelist", "Potwierdź"] as const;
type Step = 0 | 1 | 2;

export default function WhitelistPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const handleNext = () => {
    if (step === 1) {
      const validationErrors: string[] = [];

      for (const question of config.whitelistQuestions) {
        const answer = answers[`question-${question.id}`] || "";
        const trimmedAnswer = answer.trim();

        if (question.required && trimmedAnswer.length === 0) {
          validationErrors.push(`Pytanie "${question.label}" jest wymagane`);
        }

        if (trimmedAnswer.length > 0) {
          if (trimmedAnswer.length < 3) {
            validationErrors.push(
              `Pytanie "${question.label}" musi mieć minimum 3 znaki`,
            );
          }

          if (question.style === "short" && trimmedAnswer.length > 100) {
            validationErrors.push(
              `Pytanie "${question.label}" nie może przekraczać 100 znaków`,
            );
          }

          if (question.style === "paragraph" && trimmedAnswer.length > 1000) {
            validationErrors.push(
              `Pytanie "${question.label}" nie może przekraczać 1000 znaków`,
            );
          }
        }
      }

      if (validationErrors.length > 0) {
        setError(validationErrors.join("; "));
        return;
      }
    }

    setError(null);

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
    setError(null);

    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);

    const result = await submitWhitelistForm(formData);

    if (result.success) {
      setSuccess(true);
    } else if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-full max-w-sm space-y-6 mx-auto ring bg-base-100 p-4 rounded-lg min-h-96 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center">Podanie wysłane!</h1>
          <p className="text-center">
            Twoje podanie zostało pomyślnie wysłane. Oczekuj na kontakt od
            moderacji serwera!
          </p>
        </div>
      </div>
    );
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

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

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
