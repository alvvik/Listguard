import { config } from "../../../../config";

export function QAStep({
  answers,
  setAnswers,
}: {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {config.whitelistQuestions.map((question, index) => (
        <div key={index} className="form-control">
          <label className="label" htmlFor={`question-${index}`}>
            <span className="label-text">{question.label}</span>
          </label>
          <input
            type="text"
            id={`question-${index}`}
            className="input input-bordered"
            value={answers[`question-${index}`] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [`question-${index}`]: e.target.value,
              }))
            }
          />
        </div>
      ))}
    </div>
  );
}
