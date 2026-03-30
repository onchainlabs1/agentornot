import { questionBank } from "@/features/decision-wizard/config/question-bank";
import { AssessmentInput, ScoreResult } from "@/features/decision-wizard/domain/types";

export function calculateReadinessScore(input: AssessmentInput): ScoreResult {
  const breakdown: Array<{ questionId: string; weighted: number }> = [];
  let total = 0;

  for (const q of questionBank) {
    const raw = input.answers[q.id] ?? 3;
    const normalized = q.inverse ? 6 - raw : raw;
    const weighted = (normalized / 5) * q.weight;
    total += weighted;
    breakdown.push({ questionId: q.id, weighted: Number(weighted.toFixed(2)) });
  }

  return {
    readinessScore: Math.round(total),
    weightedBreakdown: breakdown
  };
}
