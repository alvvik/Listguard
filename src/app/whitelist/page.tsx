"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LoginStep } from "./components/LoginStep";
import { ConfirmStep } from "./components/ConfirmStep";
import { StepNavigation } from "./components/StepNavigation";

const STEPS = ["Zaloguj się", "Potwierdź"] as const;
type Step = 0 | 1;

export default function WhitelistPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  /* const [hasCheckedWhitelist, setHasCheckedWhitelist] = useState(false);
  useEffect(() => {
    async function checkWhitelist() {
      if (session?.user?.discordId) {
        try {
          const response = await fetch("/api/check-whitelist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ discordId: session.user.discordId }),
          });
          const result = await response.json();
          setHasCheckedWhitelist(result.isInWhitelist);
        } catch (error) {
          console.error("Error checking whitelist:", error);
        }
      }
    }
    checkWhitelist();
  }, [session]);
*/
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
    const data = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
    };

    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 rounded-lg bg-base-100 p-6 text-center ring">
          <p className="text-lg font-semibold">Formularz wysłany!</p>
          <p className="text-base-content/70 text-sm">
            Dziękujemy za zgłoszenie do whitelisty.
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

        {step === 0 && <LoginStep session={session} onContinue={handleNext} />}

        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <ConfirmStep />
          </form>
        )}

        <StepNavigation
          currentStep={step}
          onBack={handleBack}
          onNext={handleNext}
          loading={loading}
          nextDisabled={step === 0 && !session}
          isLastStep={step === 1}
        />
      </div>
    </div>
  );
}
