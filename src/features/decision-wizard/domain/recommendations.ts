import { recommendationContent } from "@/features/decision-wizard/config/recommendation-content";
import {
  AssessmentInput,
  GateResult,
  OperatingModel,
  RecommendationCategory,
  RecommendationResult
} from "@/features/decision-wizard/domain/types";

export function classifyRecommendation(input: AssessmentInput, readinessScore: number, gates: GateResult[]): RecommendationResult {
  const hasFail = gates.some((g) => g.status === "fail");
  const hasHighRisk = (input.answers.criticality ?? 3) >= 4 && (input.answers.error_tolerance ?? 3) <= 2;
  const highJudgment = (input.answers.human_judgment ?? 3) >= 4;
  const lowIntegration = (input.answers.integration_complexity ?? 3) <= 2;
  const lowProcess = (input.answers.process_clarity ?? 3) <= 2;
  const lowMetrics = (input.answers.metrics_clarity ?? 3) <= 2;
  const ragHint = (input.answers.data_structure ?? 3) <= 3 && (input.answers.human_judgment ?? 3) <= 3 && lowIntegration;

  let category: RecommendationCategory = "simple_llm";
  let operatingModel: OperatingModel = "assistive-only";

  if (hasFail || (lowProcess && lowMetrics)) {
    category = "not_ready";
    operatingModel = "assistive-only";
  } else if (hasHighRisk || highJudgment) {
    category = "human_in_loop";
    operatingModel = "human-in-the-loop";
  } else if (readinessScore >= 78) {
    category = "agent_guardrails";
    operatingModel = "autonomous";
  } else if (ragHint) {
    category = "rag_assistant";
    operatingModel = "assistive-only";
  } else if ((input.answers.process_clarity ?? 3) >= 4 && (input.answers.data_structure ?? 3) >= 4 && (input.answers.human_judgment ?? 3) <= 2) {
    category = "deterministic";
    operatingModel = "assistive-only";
  }

  return {
    category,
    operatingModel,
    patternLabel: recommendationContent[category].pattern
  };
}
