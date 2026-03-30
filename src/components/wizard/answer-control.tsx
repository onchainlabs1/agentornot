import { Lightbulb } from "lucide-react";
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
        <p className="text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">{question.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{question.help}</p>
        {question.whyThisMatters ? (
          <details className="group mt-3 overflow-hidden rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 to-slate-50/60 shadow-sm ring-1 ring-indigo-100/60">
            <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3.5 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-100/40 [&::-webkit-details-marker]:hidden">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/15 text-indigo-700">
                <Lightbulb className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span>Why this matters</span>
              <span className="ml-auto text-xs font-medium text-indigo-600/80 group-open:hidden">Tap to expand</span>
              <span className="ml-auto hidden text-xs font-medium text-indigo-600/80 group-open:inline">Tap to collapse</span>
            </summary>
            <div className="border-t border-indigo-100/90 bg-white/70 px-3.5 py-3.5 text-sm leading-relaxed text-slate-700">
              {question.whyThisMatters}
            </div>
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
