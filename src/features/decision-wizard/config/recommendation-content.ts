import { RecommendationCategory } from "@/features/decision-wizard/domain/types";

export const recommendationContent: Record<
  RecommendationCategory,
  { title: string; pattern: string; nextStep: string; pilotScope: string }
> = {
  agent_guardrails: {
    title: "Ideal for AI Agent Automation",
    pattern: "AI agent with guardrails",
    nextStep: "Start a scoped pilot with explicit constraints, escalation paths, and quality monitoring.",
    pilotScope: "Automate one high-volume sub-process with clear boundaries and human override."
  },
  human_in_loop: {
    title: "Needs Human Supervision",
    pattern: "Human-in-the-loop workflow",
    nextStep: "Design checkpoints for approval/review at critical decision moments.",
    pilotScope: "Automate preparation and recommendations, keep final decisions with human reviewers."
  },
  simple_llm: {
    title: "Better for a Simple LLM Workflow",
    pattern: "Simple LLM assistant",
    nextStep: "Start with prompt templates and lightweight guardrails before adding autonomy.",
    pilotScope: "Support one repetitive drafting or summarization task for a single team."
  },
  rag_assistant: {
    title: "Better for a RAG Assistant",
    pattern: "RAG assistant",
    nextStep: "Build retrieval quality first, then add workflow actions only if needed.",
    pilotScope: "Answer domain questions using a curated document subset with citations."
  },
  deterministic: {
    title: "Better for Deterministic Automation",
    pattern: "Deterministic automation",
    nextStep: "Implement rules-based automation first and introduce AI only where ambiguity exists.",
    pilotScope: "Automate one stable decision path with explicit business rules."
  },
  not_ready: {
    title: "Not Ready / Not Suitable Right Now",
    pattern: "Not recommended for now",
    nextStep: "Improve process definition, data readiness, and success metrics before piloting automation.",
    pilotScope: "Run a readiness sprint to document process, data sources, and measurable outcomes."
  }
};
