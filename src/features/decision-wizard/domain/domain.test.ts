import test from "node:test";
import assert from "node:assert/strict";
import { evaluateGates } from "@/features/decision-wizard/domain/gates";
import { calculateReadinessScore } from "@/features/decision-wizard/domain/scoring";
import { calculateConfidence } from "@/features/decision-wizard/domain/confidence";
import { classifyRecommendation } from "@/features/decision-wizard/domain/recommendations";
import { buildExplanation } from "@/features/decision-wizard/domain/explanation";
import { AssessmentInput } from "@/features/decision-wizard/domain/types";
import { questionBank } from "@/features/decision-wizard/config/question-bank";
import { calibrationScenarios } from "@/features/decision-wizard/domain/calibration-scenarios";
import { deriveMethodologyInsights } from "@/features/decision-wizard/domain/methodology";

function makeInput(answers: AssessmentInput["answers"]): AssessmentInput {
  return {
    profile: {
      name: "Sample use case",
      team: "Ops",
      objective: "Improve cycle time"
    },
    answers
  };
}

test("evaluateGates: returns baseline pass when no gate is triggered", () => {
    const input = makeInput({
      process_clarity: 4,
      metrics_clarity: 4,
      data_structure: 4,
      criticality: 3,
      error_tolerance: 4,
      compliance_sensitivity: 2,
      auditability_need: 2
    });

    const gates = evaluateGates(input);
    assert.equal(gates.length, 1);
    assert.equal(gates[0]?.status, "pass");
    assert.equal(gates[0]?.id, "baseline");
});

test("evaluateGates: triggers fail and warn gates for weak readiness and high risk", () => {
    const input = makeInput({
      process_clarity: 1,
      metrics_clarity: 1,
      data_structure: 1,
      criticality: 5,
      error_tolerance: 1,
      compliance_sensitivity: 5,
      auditability_need: 5
    });

    const gates = evaluateGates(input);
    assert.equal(gates.some((g) => g.id === "process_metrics_foundation" && g.status === "fail"), true);
    assert.equal(gates.some((g) => g.id === "data_readiness" && g.status === "fail"), true);
    assert.equal(gates.some((g) => g.id === "critical_low_tolerance" && g.status === "warn"), true);
    assert.equal(gates.some((g) => g.id === "compliance_traceability" && g.status === "warn"), true);
});

test("calculateReadinessScore: returns bounded score and full breakdown", () => {
    const allHigh = Object.fromEntries(questionBank.map((q) => [q.id, 5])) as AssessmentInput["answers"];
    const input = makeInput(allHigh);
    const score = calculateReadinessScore(input);

    assert.ok(score.readinessScore >= 0);
    assert.ok(score.readinessScore <= 100);
    assert.equal(score.weightedBreakdown.length, questionBank.length);
});

test("calculateReadinessScore: inverse dimensions reduce score for riskier answers", () => {
    const saferInput = makeInput({ human_judgment: 1, criticality: 1, integration_complexity: 1, compliance_sensitivity: 1 });
    const riskierInput = makeInput({ human_judgment: 5, criticality: 5, integration_complexity: 5, compliance_sensitivity: 5 });

    const saferScore = calculateReadinessScore(saferInput).readinessScore;
    const riskierScore = calculateReadinessScore(riskierInput).readinessScore;

    assert.ok(saferScore > riskierScore);
});

test("calculateConfidence: more gate penalties lower confidence", () => {
    const completeInput = makeInput(Object.fromEntries(questionBank.map((q) => [q.id, 3])) as AssessmentInput["answers"]);
    const lowPenalty = calculateConfidence(completeInput, [{ id: "baseline", status: "pass", reason: "ok" }]);
    const highPenalty = calculateConfidence(completeInput, [
      { id: "x", status: "fail", reason: "bad" },
      { id: "y", status: "warn", reason: "warn" }
    ]);

    assert.ok(lowPenalty.confidenceScore > highPenalty.confidenceScore);
});

test("classifyRecommendation: classifies not_ready when fail gates exist", () => {
    const input = makeInput({ process_clarity: 2, metrics_clarity: 2 });
    const result = classifyRecommendation(input, 80, [{ id: "fail", status: "fail", reason: "x" }]);
    assert.equal(result.category, "not_ready");
    assert.equal(result.operatingModel, "assistive-only");
});

test("classifyRecommendation: classifies human_in_loop for high criticality and low tolerance", () => {
    const input = makeInput({ criticality: 5, error_tolerance: 1, human_judgment: 3 });
    const result = classifyRecommendation(input, 70, [{ id: "baseline", status: "pass", reason: "ok" }]);
    assert.equal(result.category, "human_in_loop");
    assert.equal(result.operatingModel, "human-in-the-loop");
});

test("classifyRecommendation: classifies agent_guardrails for high readiness and no blockers", () => {
    const input = makeInput({
      process_clarity: 5,
      metrics_clarity: 5,
      data_structure: 4,
      criticality: 2,
      error_tolerance: 4,
      human_judgment: 2
    });
    const result = classifyRecommendation(input, 82, [{ id: "baseline", status: "pass", reason: "ok" }]);
    assert.equal(result.category, "agent_guardrails");
    assert.equal(result.operatingModel, "autonomous");
});

test("buildExplanation: returns structured explanation fields", () => {
    const input = makeInput({
      repetitiveness: 5,
      process_clarity: 4,
      data_structure: 4,
      metrics_clarity: 4,
      criticality: 2,
      error_tolerance: 4,
      compliance_sensitivity: 2
    });

    const recommendation = {
      category: "agent_guardrails" as const,
      operatingModel: "autonomous" as const,
      patternLabel: "AI agent with guardrails"
    };

    const explanation = buildExplanation(input, recommendation, [{ id: "baseline", status: "pass", reason: "ok" }], 80);

    assert.equal(explanation.summary.includes("Readiness score is 80/100"), true);
    assert.ok(explanation.nextStep.length > 10);
    assert.ok(explanation.suggestedPilotScope.length > 10);
    assert.ok(explanation.strengths.length > 0);
});

test("calibration scenarios: expected categories match classification", () => {
    const results = calibrationScenarios.map((scenario) => {
      const gates = evaluateGates(scenario.input);
      const score = calculateReadinessScore(scenario.input);
      const recommendation = classifyRecommendation(scenario.input, score.readinessScore, gates);
      return scenario.expectedCategory === recommendation.category;
    });
    assert.ok(results.length > 0);
    assert.equal(results.every(Boolean), true);
});

test("deriveMethodologyInsights: returns precision, autonomy mode, pilot, and lessons", () => {
  const input = makeInput({
    repetitiveness: 5,
    time_consumption: 4,
    process_clarity: 4,
    data_structure: 4,
    error_tolerance: 2,
    human_judgment: 4,
    criticality: 4,
    metrics_clarity: 2,
    compliance_sensitivity: 4,
    auditability_need: 4
  });
  const gates = evaluateGates(input);
  const score = calculateReadinessScore(input);
  const recommendation = classifyRecommendation(input, score.readinessScore, gates);
  const insights = deriveMethodologyInsights(input, recommendation, score.readinessScore, gates);

  assert.ok(["Low precision", "Medium precision", "High precision"].includes(insights.precisionProfile));
  assert.ok(
    ["Assistive only", "Human-in-the-loop", "Semi-autonomous", "Autonomous with guardrails"].includes(
      insights.recommendedAutonomyMode
    )
  );
  assert.ok(insights.bestFirstPilot.length > 10);
  assert.ok(insights.lessons.length >= 1);
});
