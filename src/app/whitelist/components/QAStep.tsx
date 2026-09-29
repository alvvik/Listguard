import { config } from "../../../../config";

export function QAStep({
  answers,
  setAnswers,
}: {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const validateAnswer = (
    question: (typeof config.whitelistQuestions)[0],
    value: string,
  ) => {
    const errors: string[] = [];
    const trimmedValue = value.trim();

    if (question.required && trimmedValue.length === 0) {
      errors.push("To pole jest wymagane");
    }

    if (trimmedValue.length > 0) {
      if (trimmedValue.length < 3) {
        errors.push("Minimum 3 znaki");
      }
    }

    return errors;
  };

  return (
    <div className="flex flex-col gap-4">
      {config.whitelistQuestions.map((question) => {
        const answer = answers[`question-${question.id}`] || "";
        const errors = validateAnswer(question, answer);
        const hasError = errors.length > 0;

        return (
          <div key={question.id} className="form-control">
            <label className="label" htmlFor={`question-${question.id}`}>
              <span className="label-text">{question.label}</span>
              {question.required && (
                <span className="label-text-alt text-error">*</span>
              )}
            </label>
            <input
              type="text"
              id={`question-${question.id}`}
              className={`input input-bordered ${hasError ? "input-error" : ""}`}
              value={answer}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [`question-${question.id}`]: e.target.value,
                }))
              }
            />
            {hasError && (
              <label className="label">
                <span className="label-text-alt text-error">{errors[0]}</span>
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
}
