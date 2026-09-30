import { config } from "../../../../config";
import { useState, memo, useCallback } from "react";

interface QuestionInputProps {
  question: (typeof config.whitelistQuestions)[0];
  answer: string;
  onChange: (questionKey: string, value: string) => void;
}

const QuestionInput = memo(
  ({ question, answer, onChange }: QuestionInputProps) => {
    const [hadText, setHadText] = useState(false);
    const questionKey = `question-${question.id}`;

    const trimmedAnswer = answer.trim();
    const error =
      question.required && trimmedAnswer.length === 0
        ? "To pole jest wymagane"
        : trimmedAnswer.length > 0 && trimmedAnswer.length < 3
          ? "Minimum 3 znaki"
          : null;
    const hasError = hadText && error !== null;

    return (
      <div className="form-control">
        <label className="label" htmlFor={questionKey}>
          <span className="label-text">{question.label}</span>
          {question.required && <span className="label-text-alt">*</span>}
        </label>
        <input
          type="text"
          id={questionKey}
          className={`input input-bordered ${hasError ? "input-error" : ""}`}
          value={answer}
          onChange={(e) => {
            const val = e.target.value;
            if (!hadText && val.trim().length > 0) {
              setHadText(true);
            }
            onChange(questionKey, val);
          }}
        />
        {hasError && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  },
);

QuestionInput.displayName = "QuestionInput";

export function QAStep({
  answers,
  setAnswers,
}: {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const handleAnswerChange = useCallback(
    (questionKey: string, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionKey]: value,
      }));
    },
    [setAnswers],
  );

  return (
    <div className="flex flex-col gap-4">
      {config.whitelistQuestions.map((question) => {
        const questionKey = `question-${question.id}`;
        const answer = answers[questionKey] || "";

        return (
          <QuestionInput
            key={question.id}
            question={question}
            answer={answer}
            onChange={handleAnswerChange}
          />
        );
      })}
    </div>
  );
}
