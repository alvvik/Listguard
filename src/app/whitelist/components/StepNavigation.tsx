interface StepNavigationProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  loading?: boolean;
  nextDisabled?: boolean;
  isLastStep?: boolean;
}

export function StepNavigation({
  currentStep,

  onBack,
  onNext,
  loading = false,
  nextDisabled = false,
  isLastStep = false,
}: StepNavigationProps) {
  return (
    <div className="flex gap-3 mt-2">
      <button
        className="btn btn-outline flex-1"
        onClick={onBack}
        type="button"
        disabled={currentStep === 0}
      >
        Cofnij
      </button>
      <button
        className="btn btn-primary flex-1"
        onClick={onNext}
        type={isLastStep ? "submit" : "button"}
        disabled={loading || nextDisabled}
      >
        {loading && <span className="loading loading-spinner"></span>}
        {isLastStep ? "Wyślij" : "Dalej"}
      </button>
    </div>
  );
}
