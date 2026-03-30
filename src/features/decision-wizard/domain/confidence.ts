import { AssessmentInput, ConfidenceResult, GateResult } from "@/features/decision-wizard/domain/types";
import { questionBank } from "@/features/decision-wizard/config/question-bank";

export function calculateConfidence(input: AssessmentInput, gates: GateResult[]): ConfidenceResult {
  const totalRequired = questionBank.filter((q) => q.required).length;
  const answered = questionBank.filter((q) => q.required && input.answers[q.id] !== undefined).length;
  const completionRatio = answered / Math.max(totalRequired, 1);

  const failCount = gates.filter((g) => g.status === "fail").length;
  const warnCount = gates.filter((g) => g.status === "warn").length;

  const penalty = failCount * 20 + warnCount * 8;
  const base = Math.round(completionRatio * 100);
  const confidenceScore = Math.max(20, Math.min(98, base - penalty + 10));

  const drivers = [
    `${answered}/${totalRequired} required answers provided`,
    `${failCount} fail gate(s), ${warnCount} warning gate(s)`
  ];

  return { confidenceScore, drivers };
}
