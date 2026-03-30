# Technical Spec - Enterprise AI Decision Wizard (V1)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Local/mock data only (no backend in V1)

## Architecture

### Layers
1. Presentation layer (UI components and screens)
2. Flow orchestration layer (wizard state and navigation)
3. Decision engine layer (gates, scoring, confidence, classification, explanations)
4. Content/config layer (questions, steps, recommendation copy)

### Core principle
Decision logic must be isolated from the UI so it can move to a backend service later.

## Proposed File Structure

```text
src/
  app/
    page.tsx
    globals.css
  components/
    wizard/
      wizard-shell.tsx
      wizard-progress.tsx
      step-card.tsx
      answer-control.tsx
      review-screen.tsx
      results-screen.tsx
    ui/                        # shadcn components
  features/
    decision-wizard/
      config/
        dimensions.ts
        question-bank.ts
        steps.config.ts
        recommendation-content.ts
      domain/
        types.ts
        gates.ts
        scoring.ts
        confidence.ts
        recommendations.ts
        explanation.ts
        calibration-scenarios.ts
      state/
        wizard-store.ts
      utils/
        format.ts
docs/
  product-spec.md
  technical-spec.md
```

## Domain Model

### Core types
- `UseCaseProfile`: use case metadata and context
- `Answer`: structured answer by `questionId`
- `AssessmentInput`: profile + answers
- `GateResult`: pass/warn/fail with reasons
- `ScoreResult`: readiness and weighted dimension breakdown
- `ConfidenceResult`: confidence score and confidence drivers
- `ClassificationResult`: final category + suggested pattern
- `ExplanationResult`: strengths, blockers, risks, next step, operating model, pilot scope

## Assessment Model

### Dimension groups
- `fit`
- `risk`
- `readiness`
- `deliveryPattern`

### Content model
- `question-bank.ts`: question text, helper text, examples, answer scale
- `steps.config.ts`: step grouping and display order
- `recommendation-content.ts`: category-specific copy and action templates

## Decision Engines (Separated Responsibilities)

1. `gates.ts`
   - evaluates hard boundaries (safety/readiness constraints)
2. `scoring.ts`
   - computes weighted readiness/fit score (0-100)
3. `confidence.ts`
   - computes confidence (0-100) based on answer quality/completeness and gate consistency
4. `recommendations.ts`
   - deterministic mapping to final recommendation category
5. `explanation.ts`
   - builds output narrative from gates + score + classification

## Hard Gate Examples

- Process clarity very low + metrics clarity very low -> Not ready
- High criticality + very low error tolerance -> Require human supervision
- Poor data availability/quality -> Not ready unless redesigned scope
- High compliance sensitivity + weak traceability posture -> Block autonomous pattern

## Weighted Scoring (Initial Baseline)

- Process clarity: 12
- Data structure and availability: 12
- Repetitiveness/frequency: 10
- Time consumption: 8
- Error tolerance: 10
- Human judgment requirement (inverse): 10
- Risk/criticality (inverse): 10
- Success metrics clarity: 8
- Integration complexity (inverse): 6
- Auditability need fit: 6
- Compliance sensitivity (inverse): 4
- Business value: 4

Total: 100

## Recommendation Categories

- AI agent with guardrails
- Human-in-the-loop automation
- Simple LLM workflow
- RAG assistant
- Deterministic automation
- Not ready / not suitable

## Decision Model Calibration (Phase 3.5)

Define 10-15 canonical scenarios and expected outcomes. Use them to:
- tune gate thresholds,
- tune scoring weights/ranges,
- tune category cutoffs,
- validate explanation quality,
- prevent contradictory outputs.

Canonical scenarios include:
- repetitive, clear, structured, moderate risk -> agent
- high risk, low error tolerance -> human-in-the-loop
- unstructured knowledge retrieval task -> RAG
- narrow/simple ad hoc generation -> simple LLM workflow
- stable rule-based process -> deterministic automation
- unclear process + weak metrics -> not ready

## Wizard Steps

1. Intro
2. Use Case Definition
3. Process and Data Foundations
4. Risk and Governance
5. Execution Feasibility
6. Value and Metrics
7. Review
8. Results

## UI/UX Requirements

- Responsive layout (mobile to desktop)
- Premium enterprise styling with clear hierarchy
- Step cards with concise helper text
- Clear progress indicator with step context
- Subtle motion for transitions and reveal states
- Results page optimized for workshop readability

## State Model

Single store with:
- `currentStep`
- `answers`
- `profile`
- `isComplete`
- derived values:
  - gate results
  - readiness score
  - confidence score
  - classification
  - explanation

State should be serializable to enable future save/resume (localStorage or backend).

## Verification Plan

- Lint and typecheck
- Build verification
- Scenario-based validation against canonical calibration set
- Ensure no business logic inside presentational components
