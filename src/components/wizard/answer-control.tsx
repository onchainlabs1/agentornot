import { scoreScaleLabels } from "@/features/decision-wizard/config/question-bank";
import { QuestionDefinition, QuestionScaleValue } from "@/features/decision-wizard/domain/types";
import { cn } from "@/lib/utils";

type AnswerControlProps = {
  question: QuestionDefinition;
  value?: QuestionScaleValue;
  onChange: (value: QuestionScaleValue) => void;
};

export function AnswerControl({ question, value, onChange }: AnswerControlProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-900">{question.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{question.help}</p>
        {question.whyThisMatters ? (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-medium text-blue-700">Why this matters</summary>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{question.whyThisMatters}</p>
          </details>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {scoreScaleLabels.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-xs transition",
              value === item.value
                ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <span className="block text-sm font-semibold">{item.value}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
