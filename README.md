# AI Decision Wizard

An enterprise-ready web application that helps teams decide whether a business task is a strong candidate for AI automation, and if so, which implementation pattern is most appropriate.

The wizard is inspired by modern AI agent evaluation frameworks and designed for practical stakeholder conversations across product, operations, engineering, and leadership teams.

## Why this tool exists

Most organizations face the same challenge:
- Too much pressure to "use AI agents"
- Too little structure for deciding where agents actually make sense
- Too many pilots launched before process, data, and governance are ready

This tool turns a fuzzy discussion into a clear, explainable assessment.

## What the wizard answers

For a given use case, the wizard outputs:
- Final recommendation category
- Readiness score (0-100)
- Confidence score (0-100)
- Reasoning summary
- Strengths
- Blockers
- Risks
- Suggested implementation pattern
- Recommended operating model
- Suggested first pilot scope
- Recommended next step

## Recommendation categories

The current classification model maps outcomes to one of:

1. **AI agent with guardrails**
2. **Human-in-the-loop automation**
3. **Simple LLM workflow**
4. **RAG assistant**
5. **Deterministic automation**
6. **Not ready / not suitable**

## Methodology

The decision model is intentionally **hybrid and interpretable**.

### 1) Hard gates (safety/readiness boundaries)

Hard gates identify structural blockers and governance constraints early.
Examples:
- Low process clarity + low metric clarity -> likely not ready
- High criticality + low error tolerance -> autonomous mode is unsafe
- Low data readiness -> automation quality risk
- High compliance and traceability pressure -> stronger controls required

Hard gates prevent false confidence from a high numeric score.

### 2) Weighted readiness scoring

A weighted scoring model produces a readiness score from 0-100.
Dimensions include:
- Repetitiveness/frequency
- Time consumption
- Process clarity
- Data structure/availability
- Error tolerance
- Human judgment requirement
- Risk/criticality
- Metrics clarity
- Integration complexity
- Auditability need
- Compliance sensitivity
- Business value

Some dimensions are inverse-weighted (e.g., high complexity, high risk, high judgment need).

### 3) Confidence scoring

Confidence is separate from readiness:
- Readiness = "how suitable this use case appears"
- Confidence = "how reliable this recommendation is"

Confidence is based on:
- answer completeness
- gate severity
- consistency signals

This distinction avoids conflating "strong fit" with "strong certainty."

### 4) Deterministic classification

A rules-based classifier maps gate + score + key answer patterns into the final recommendation category.

This keeps the engine transparent, auditable, and easier to calibrate with stakeholders than a black-box model.

### 5) Explanation layer

The output includes plain-language rationale:
- why this recommendation was chosen
- what helps (strengths)
- what blocks progress (blockers)
- where risk remains
- what to do next

## Assessment dimensions

The wizard assesses the following dimensions:
- Repetitiveness / frequency
- Time consumption
- Process clarity
- Data structure and availability
- Tolerance for imperfect accuracy
- Need for human judgment
- Risk / business criticality
- Presence of clear success metrics
- System integration complexity
- Auditability / traceability need
- Compliance / governance sensitivity
- Expected business value

## User flow

1. Welcome / context
2. Use case definition
3. Process and data assessment
4. Risk and governance assessment
5. Delivery and value assessment
6. Review answers
7. Results and recommendation
8. Restart / new assessment

## UX principles

The product is designed to feel:
- Modern
- Minimal
- Premium
- Enterprise-ready
- Easy to scan
- Professional for mixed technical audiences

Design choices include:
- strong typography hierarchy
- clear whitespace and card rhythm
- explicit progress visibility
- accessible contrast
- subtle motion only where it improves orientation

## Technical stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn-style UI primitives

## Project structure

```text
docs/
  product-spec.md
  technical-spec.md
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    ui/
    wizard/
  features/
    decision-wizard/
      config/
      domain/
      state/
      utils/
```

Key design rule: domain logic is isolated from UI for future backend extraction.

## Calibration approach

The repository includes canonical scenario definitions used to calibrate the model:
- Expected recommendation per scenario
- Threshold tuning support
- Contradiction detection

Calibration helps avoid shipping a polished UI with weak decision quality.

## Local development

## Requirements

- Node.js 20+ (recommended: 20 LTS or newer)
- npm 10+

## Run

```bash
npm install
npm run dev
```

Then open:
- [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Quality checks

Run all project checks in one command:

```bash
npm run check
```

Or run them separately:

```bash
npm run typecheck
npm run lint
npm run test
```

## Notes

- The app currently uses local state and local storage persistence.
- No backend is required for v1.
- Save/resume behavior is prepared for future server-side persistence.

## Current limitations (v1)

- No authentication or multi-user collaboration
- No export/report generation
- No direct enterprise system integrations
- No historical benchmark dataset

## Roadmap ideas

- Backend persistence and team workspaces
- Scenario library by function/industry
- Exportable summary artifacts (PDF/slides)
- Adjustable organization-specific scoring profiles
- Governance templates by risk tier
- Workflow handoff into implementation planning

## Methodology origin and adaptation

The conceptual foundation is informed by contemporary AI agent playbook guidance (agent vs assistant distinction, human accountability, workflow scope, and governance concerns).

This implementation intentionally extends those concepts into a practical enterprise decision system with:
- explicit gates
- weighted scoring
- separate confidence modeling
- deterministic classification
- explainable outputs suitable for stakeholder alignment

## License

Internal/prototype use unless your organization defines an explicit license.
