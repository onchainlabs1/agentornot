import { wizardSteps } from "@/features/decision-wizard/config/steps.config";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type WizardProgressProps = {
  value: number;
  currentStepIndex: number;
};

export function WizardProgress({ value, currentStepIndex }: WizardProgressProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-medium uppercase tracking-wide">Assessment progress</span>
        <span>{value}% completed</span>
      </div>
      <Progress value={value} />
      <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4 xl:grid-cols-7">
        {wizardSteps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-2 py-1.5",
              index === currentStepIndex
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : index < currentStepIndex
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-muted"
            )}
          >
            <span
              className={cn(
                "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                index === currentStepIndex
                  ? "bg-blue-600 text-white"
                  : index < currentStepIndex
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-700"
              )}
            >
              {index + 1}
            </span>
            <span className="truncate">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
