import {
  AssessmentInput,
  GateResult,
  MethodologyInsights,
  RecommendationResult
} from "@/features/decision-wizard/domain/types";

export function deriveMethodologyInsights(
  input: AssessmentInput,
  recommendation: RecommendationResult,
  readinessScore: number,
  gates: GateResult[]
): MethodologyInsights {
  const a = input.answers;
  const criticality = a.criticality ?? 3;
  const errorTolerance = a.error_tolerance ?? 3;
  const humanJudgment = a.human_judgment ?? 3;
  const compliance = a.compliance_sensitivity ?? 3;
  const auditability = a.auditability_need ?? 3;

  const precisionIndex = (criticality + humanJudgment + (6 - errorTolerance)) / 3;
  const precisionProfile =
    precisionIndex >= 4 ? "High precision" : precisionIndex >= 2.8 ? "Medium precision" : "Low precision";

  let recommendedAutonomyMode: MethodologyInsights["recommendedAutonomyMode"] = "Semi-autonomous";
  if (criticality >= 4 || compliance >= 4 || humanJudgment >= 4 || errorTolerance <= 2) {
    recommendedAutonomyMode = "Human-in-the-loop";
  } else if (readinessScore >= 80 && compliance <= 3 && auditability <= 3 && humanJudgment <= 2) {
    recommendedAutonomyMode = "Autonomous with guardrails";
  } else if (readinessScore < 60 || gates.some((g) => g.status === "fail")) {
    recommendedAutonomyMode = "Assistive only";
  }

  let bestFirstPilot = "Start with one team, one workflow, and one dataset.";
  if (recommendation.category === "simple_llm") {
    bestFirstPilot = "Start with draft generation and human approval for a single recurring task.";
  } else if (recommendation.category === "rag_assistant") {
    bestFirstPilot = "Start with internal knowledge retrieval before taking any automated actions.";
  } else if (recommendation.category === "human_in_loop") {
    bestFirstPilot = "Start with research and summarization only, with human decision checkpoints.";
  } else if (recommendation.category === "agent_guardrails") {
    bestFirstPilot = "Start with one bounded workflow and explicit guardrails for escalation and rollback.";
  } else if (recommendation.category === "deterministic") {
    bestFirstPilot = "Start with a rules-first automation slice and add AI only for edge-case assistance.";
  }

  const lessons: string[] = [];
  if ((a.repetitiveness ?? 3) >= 4 && (a.time_consumption ?? 3) >= 4) {
    lessons.push("This looks promising because the task is repetitive and time-consuming.");
  }
  if (criticality >= 4 || errorTolerance <= 2) {
    lessons.push("Human review is still important because the cost of errors is high.");
  }
  if ((a.metrics_clarity ?? 3) <= 2) {
    lessons.push("Clearer success metrics would improve implementation readiness.");
  }
  if ((a.process_clarity ?? 3) <= 2 || (a.data_structure ?? 3) <= 2) {
    lessons.push("Improving process and data foundations will raise reliability before scaling autonomy.");
  }
  if (lessons.length === 0) {
    lessons.push("Current signals are balanced, so start with a narrow pilot and measure outcomes quickly.");
  }

  return {
    precisionProfile,
    recommendedAutonomyMode,
    bestFirstPilot,
    lessons: lessons.slice(0, 4)
  };
}
