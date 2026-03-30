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
import { CheckCircle2, Sparkles } from "lucide-react";

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
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/30 p-6 shadow-soft backdrop-blur md:p-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Enterprise Decision Framework</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">Is This an Agent Job?</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Enterprise decision wizard for choosing the right AI delivery pattern.
            </p>
          </div>
        </div>
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
              <div className="space-y-5">
                <p className="text-sm leading-relaxed text-slate-600">
                  You will answer structured questions, review your answers, and get a clear recommendation with risks and practical next steps.
                </p>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Pattern fit (agent, workflow, RAG, and more)",
                    "Readiness and confidence signals",
                    "Pilot scope you can take to stakeholders"
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-xs font-medium leading-snug text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-950">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-800/90">Why it matters</p>
                  <p className="mt-1.5 leading-relaxed text-indigo-950/90">
                    Choosing the wrong automation pattern wastes time and budget. This wizard helps you align on{" "}
                    <span className="font-semibold">what to build first</span> and <span className="font-semibold">how much autonomy</span> is appropriate.
                  </p>
                </div>
              </div>
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
