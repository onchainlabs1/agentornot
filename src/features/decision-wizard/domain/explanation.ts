import { recommendationContent } from "@/features/decision-wizard/config/recommendation-content";
import {
  AssessmentInput,
  ExplanationResult,
  GateResult,
  RecommendationResult
} from "@/features/decision-wizard/domain/types";

export function buildExplanation(
  input: AssessmentInput,
  recommendation: RecommendationResult,
  gates: GateResult[],
  readinessScore: number
): ExplanationResult {
  const content = recommendationContent[recommendation.category];
  const strengths: string[] = [];
  const blockers: string[] = [];
  const risks: string[] = [];

  if ((input.answers.repetitiveness ?? 3) >= 4) strengths.push("Task frequency supports automation ROI.");
  if ((input.answers.process_clarity ?? 3) >= 4) strengths.push("Process is clearly defined.");
  if ((input.answers.data_structure ?? 3) >= 4) strengths.push("Data readiness is strong.");
  if ((input.answers.metrics_clarity ?? 3) >= 4) strengths.push("Success metrics are well defined.");

  if ((input.answers.process_clarity ?? 3) <= 2) blockers.push("Process needs clearer definition.");
  if ((input.answers.data_structure ?? 3) <= 2) blockers.push("Data quality/availability is insufficient.");
  if ((input.answers.metrics_clarity ?? 3) <= 2) blockers.push("Metrics are not clear enough to measure impact.");

  if ((input.answers.criticality ?? 3) >= 4) risks.push("High business criticality demands stronger controls.");
  if ((input.answers.error_tolerance ?? 3) <= 2) risks.push("Low error tolerance requires human oversight.");
  if ((input.answers.compliance_sensitivity ?? 3) >= 4) risks.push("Compliance sensitivity requires auditable operation.");

  const failReasons = gates.filter((g) => g.status === "fail").map((g) => g.reason);
  blockers.push(...failReasons);

  const summary = `${content.title}. Readiness score is ${readinessScore}/100, indicating ${
    readinessScore >= 75 ? "strong" : readinessScore >= 55 ? "moderate" : "limited"
  } suitability under current conditions.`;

  return {
    summary,
    strengths: strengths.slice(0, 4),
    blockers: blockers.slice(0, 4),
    risks: risks.slice(0, 4),
    nextStep: content.nextStep,
    suggestedPilotScope: content.pilotScope
  };
}
