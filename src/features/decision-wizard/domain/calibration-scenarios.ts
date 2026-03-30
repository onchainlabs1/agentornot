import { AssessmentInput, RecommendationCategory } from "@/features/decision-wizard/domain/types";

export type CalibrationScenario = {
  id: string;
  label: string;
  input: AssessmentInput;
  expectedCategory: RecommendationCategory;
};

export const calibrationScenarios: CalibrationScenario[] = [
  {
    id: "agent_candidate",
    label: "Repetitive, clear, structured, moderate risk",
    expectedCategory: "agent_guardrails",
    input: {
      profile: { name: "Ticket triage", team: "Support", objective: "Reduce handling time" },
      answers: {
        repetitiveness: 5,
        time_consumption: 4,
        process_clarity: 5,
        data_structure: 4,
        error_tolerance: 4,
        human_judgment: 2,
        criticality: 3,
        metrics_clarity: 4,
        integration_complexity: 3,
        auditability_need: 3,
        compliance_sensitivity: 2,
        business_value: 4
      }
    }
  },
  {
    id: "hitl_candidate",
    label: "High criticality and low error tolerance",
    expectedCategory: "human_in_loop",
    input: {
      profile: { name: "Policy exception handling", team: "Finance", objective: "Improve turnaround" },
      answers: {
        repetitiveness: 4,
        time_consumption: 4,
        process_clarity: 4,
        data_structure: 4,
        error_tolerance: 1,
        human_judgment: 4,
        criticality: 5,
        metrics_clarity: 4,
        integration_complexity: 3,
        auditability_need: 5,
        compliance_sensitivity: 5,
        business_value: 4
      }
    }
  }
];
