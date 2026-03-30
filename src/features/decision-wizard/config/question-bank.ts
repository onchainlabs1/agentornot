import { QuestionDefinition } from "@/features/decision-wizard/domain/types";

export const questionBank: QuestionDefinition[] = [
  {
    id: "repetitiveness",
    label: "How repetitive is this task?",
    help: "Frequent, repeated work is usually a better automation candidate.",
    whyThisMatters: "Repetitive work is often the safest place to start because outcomes are easier to standardize.",
    dimensionGroup: "fit",
    weight: 10,
    required: true
  },
  {
    id: "time_consumption",
    label: "How much time does this task consume today?",
    help: "Tasks that take significant effort can create stronger ROI.",
    dimensionGroup: "fit",
    weight: 8,
    required: true
  },
  {
    id: "process_clarity",
    label: "How clearly is the current process defined?",
    help: "If the process is unclear, automation quality usually drops.",
    whyThisMatters: "Agents perform better when steps and decision points are explicit instead of implicit.",
    dimensionGroup: "readiness",
    weight: 12,
    required: true
  },
  {
    id: "data_structure",
    label: "How structured and available is the required data?",
    help: "Reliable, accessible data is a core foundation for automation.",
    whyThisMatters: "Weak data quality creates inconsistent outputs, even when the model is strong.",
    dimensionGroup: "readiness",
    weight: 12,
    required: true
  },
  {
    id: "error_tolerance",
    label: "How much imperfect accuracy is acceptable?",
    help: "Lower tolerance usually means stronger controls are required.",
    whyThisMatters: "When errors are costly, autonomous behavior should be reduced and review should increase.",
    dimensionGroup: "risk",
    weight: 10,
    required: true
  },
  {
    id: "human_judgment",
    label: "How much human judgment is required?",
    help: "Heavy judgment tasks often need human-in-the-loop operation.",
    whyThisMatters: "If context and nuance drive decisions, AI should assist rather than decide alone.",
    dimensionGroup: "risk",
    weight: 10,
    inverse: true,
    required: true
  },
  {
    id: "criticality",
    label: "How business-critical is this task?",
    help: "Critical tasks usually need stronger controls and traceability.",
    dimensionGroup: "risk",
    weight: 10,
    inverse: true,
    required: true
  },
  {
    id: "metrics_clarity",
    label: "How clear are success metrics?",
    help: "Clear metrics are needed to prove value and tune performance.",
    whyThisMatters: "Without measurable outcomes, it is hard to know if automation is actually helping.",
    dimensionGroup: "readiness",
    weight: 8,
    required: true
  },
  {
    id: "integration_complexity",
    label: "How complex are required system integrations?",
    help: "Lower integration complexity improves initial delivery speed.",
    dimensionGroup: "deliveryPattern",
    weight: 6,
    inverse: true,
    required: true
  },
  {
    id: "auditability_need",
    label: "How important is auditability and traceability?",
    help: "When high, choose patterns with strong logging and checkpoints.",
    dimensionGroup: "risk",
    weight: 6,
    required: true
  },
  {
    id: "compliance_sensitivity",
    label: "How sensitive is this task from compliance/governance perspective?",
    help: "Higher sensitivity may limit autonomous operation in early rollout.",
    dimensionGroup: "risk",
    weight: 4,
    inverse: true,
    required: true
  },
  {
    id: "business_value",
    label: "What is the expected business value if successful?",
    help: "High value justifies deeper investment and stronger controls.",
    dimensionGroup: "fit",
    weight: 4,
    required: true
  }
];

export const scoreScaleLabels = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Very High" }
] as const;
