import { StepDefinition } from "@/features/decision-wizard/domain/types";

export const wizardSteps: StepDefinition[] = [
  {
    id: "intro",
    title: "Welcome",
    description: "Understand how this assessment works.",
    questionIds: []
  },
  {
    id: "use_case",
    title: "Use Case",
    description: "Define the business task and context.",
    questionIds: []
  },
  {
    id: "process_data",
    title: "Process & Data",
    description: "Assess foundations for automation.",
    questionIds: ["repetitiveness", "time_consumption", "process_clarity", "data_structure"]
  },
  {
    id: "risk_governance",
    title: "Risk & Governance",
    description: "Evaluate control requirements and exposure.",
    questionIds: ["error_tolerance", "human_judgment", "criticality", "auditability_need", "compliance_sensitivity"]
  },
  {
    id: "delivery_value",
    title: "Delivery & Value",
    description: "Assess feasibility and business impact.",
    questionIds: ["metrics_clarity", "integration_complexity", "business_value"]
  },
  {
    id: "review",
    title: "Review",
    description: "Review answers before generating recommendation.",
    questionIds: []
  },
  {
    id: "results",
    title: "Results",
    description: "Recommendation and suggested next step.",
    questionIds: []
  }
];
