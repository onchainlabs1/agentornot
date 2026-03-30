export type DimensionGroup = "fit" | "risk" | "readiness" | "deliveryPattern";
export type RecommendationCategory =
  | "agent_guardrails"
  | "human_in_loop"
  | "simple_llm"
  | "rag_assistant"
  | "deterministic"
  | "not_ready";

export type OperatingModel = "autonomous" | "human-in-the-loop" | "assistive-only";
export type GateStatus = "pass" | "warn" | "fail";

export type QuestionScaleValue = 1 | 2 | 3 | 4 | 5;

export type QuestionDefinition = {
  id: string;
  label: string;
  help: string;
  whyThisMatters?: string;
  example?: string;
  dimensionGroup: DimensionGroup;
  weight: number;
  inverse?: boolean;
  required?: boolean;
};

export type StepDefinition = {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
};

export type AnswerMap = Record<string, QuestionScaleValue>;

export type UseCaseProfile = {
  name: string;
  team: string;
  objective: string;
};

export type AssessmentInput = {
  profile: UseCaseProfile;
  answers: AnswerMap;
};

export type GateResult = {
  id: string;
  status: GateStatus;
  reason: string;
};

export type ScoreResult = {
  readinessScore: number;
  weightedBreakdown: Array<{ questionId: string; weighted: number }>;
};

export type ConfidenceResult = {
  confidenceScore: number;
  drivers: string[];
};

export type RecommendationResult = {
  category: RecommendationCategory;
  operatingModel: OperatingModel;
  patternLabel: string;
};

export type ExplanationResult = {
  summary: string;
  strengths: string[];
  blockers: string[];
  risks: string[];
  nextStep: string;
  suggestedPilotScope: string;
};

export type PrecisionProfile = "Low precision" | "Medium precision" | "High precision";

export type MethodologyInsights = {
  precisionProfile: PrecisionProfile;
  recommendedAutonomyMode: "Assistive only" | "Human-in-the-loop" | "Semi-autonomous" | "Autonomous with guardrails";
  bestFirstPilot: string;
  lessons: string[];
};
