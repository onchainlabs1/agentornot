"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StepCard } from "@/components/wizard/step-card";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { ReviewScreen } from "@/components/wizard/review-screen";
import { ResultsScreen } from "@/components/wizard/results-screen";
import { AnswerControl } from "@/components/wizard/answer-control";
import { questionBank } from "@/features/decision-wizard/config/question-bank";
import { wizardSteps } from "@/features/decision-wizard/config/steps.config";
import { useWizardStore } from "@/features/decision-wizard/state/wizard-store";
import { evaluateGates } from "@/features/decision-wizard/domain/gates";
import { calculateReadinessScore } from "@/features/decision-wizard/domain/scoring";
import { calculateConfidence } from "@/features/decision-wizard/domain/confidence";
import { classifyRecommendation } from "@/features/decision-wizard/domain/recommendations";
import { buildExplanation } from "@/features/decision-wizard/domain/explanation";
import { deriveMethodologyInsights } from "@/features/decision-wizard/domain/methodology";

export function WizardShell() {
  const wizard = useWizardStore();
  const step = wizard.currentStep;

  const assessment = useMemo(() => {
    const input = { profile: wizard.profile, answers: wizard.answers };
    const gates = evaluateGates(input);
    const score = calculateReadinessScore(input);
    const confidence = calculateConfidence(input, gates);
    const recommendation = classifyRecommendation(input, score.readinessScore, gates);
    const explanation = buildExplanation(input, recommendation, gates, score.readinessScore);
    const methodology = deriveMethodologyInsights(input, recommendation, score.readinessScore, gates);
    return { gates, score, confidence, recommendation, explanation, methodology };
  }, [wizard.profile, wizard.answers]);

  function canGoNext() {
    if (step.id === "use_case") {
      return Boolean(wizard.profile.name && wizard.profile.team && wizard.profile.objective);
    }
    if (["process_data", "risk_governance", "delivery_value"].includes(step.id)) {
      return step.questionIds.every((id) => wizard.answers[id] !== undefined);
    }
    return true;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:py-10">
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Enterprise Decision Framework</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-4xl">Is This an Agent Job?</h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Enterprise decision wizard for choosing the right AI delivery pattern.
        </p>
      </div>
      <WizardProgress value={wizard.progress} currentStepIndex={wizard.currentStepIndex} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {step.id === "intro" && (
            <StepCard title="Welcome" description="Assess AI suitability with gates, scoring, and recommendation logic.">
              <p className="text-sm leading-relaxed text-muted">
                You will answer structured questions, review all answers, and receive a clear recommendation with risks and next steps.
              </p>
            </StepCard>
          )}
          {step.id === "use_case" && (
            <StepCard title="Use Case Definition" description="Capture basic context before assessment.">
              <div className="grid gap-3">
                <input
                  className="h-11 rounded-xl border border-border bg-white px-3 text-sm"
                  placeholder="Use case name"
                  value={wizard.profile.name}
                  onChange={(e) => wizard.setProfile({ ...wizard.profile, name: e.target.value })}
                />
                <input
                  className="h-11 rounded-xl border border-border bg-white px-3 text-sm"
                  placeholder="Team / function"
                  value={wizard.profile.team}
                  onChange={(e) => wizard.setProfile({ ...wizard.profile, team: e.target.value })}
                />
                <textarea
                  className="min-h-24 rounded-xl border border-border bg-white p-3 text-sm"
                  placeholder="Business objective"
                  value={wizard.profile.objective}
                  onChange={(e) => wizard.setProfile({ ...wizard.profile, objective: e.target.value })}
                />
              </div>
            </StepCard>
          )}
          {["process_data", "risk_governance", "delivery_value"].includes(step.id) && (
            <StepCard title={step.title} description={step.description}>
              <div className="space-y-3">
                {step.questionIds.map((qid) => {
                  const q = questionBank.find((item) => item.id === qid);
                  if (!q) return null;
                  return (
                    <AnswerControl
                      key={q.id}
                      question={q}
                      value={wizard.answers[q.id]}
                      onChange={(value) => wizard.setAnswers({ ...wizard.answers, [q.id]: value })}
                    />
                  );
                })}
              </div>
            </StepCard>
          )}
          {step.id === "review" && (
            <ReviewScreen profile={wizard.profile} answers={wizard.answers} onEditStep={(id) => wizard.goToStep(id)} />
          )}
          {step.id === "results" && (
            <ResultsScreen
              score={assessment.score}
              confidence={assessment.confidence}
              recommendation={assessment.recommendation}
              explanation={assessment.explanation}
              methodology={assessment.methodology}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="sticky bottom-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-soft backdrop-blur">
        <Button variant="outline" onClick={wizard.prevStep} disabled={wizard.currentStepIndex === 0}>
          Back
        </Button>
        <div className="flex gap-2">
          {step.id === "results" ? (
            <Button onClick={wizard.restart}>Restart</Button>
          ) : (
            <Button onClick={wizard.nextStep} disabled={!canGoNext()}>
              {wizard.currentStepIndex === wizardSteps.length - 2 ? "Generate Result" : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
