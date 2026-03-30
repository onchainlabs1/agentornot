import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toPercent } from "@/features/decision-wizard/utils/format";
import {
  ConfidenceResult,
  ExplanationResult,
  MethodologyInsights,
  RecommendationResult,
  ScoreResult
} from "@/features/decision-wizard/domain/types";

type ResultsScreenProps = {
  score: ScoreResult;
  confidence: ConfidenceResult;
  recommendation: RecommendationResult;
  explanation: ExplanationResult;
  methodology: MethodologyInsights;
};

function ScoreGauge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-semibold text-slate-900">{toPercent(value)}</p>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function KeyFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted">
          {items.length ? items.map((item) => <li key={item}>- {item}</li>) : <li>- None flagged</li>}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ResultsScreen({ score, confidence, recommendation, explanation, methodology }: ResultsScreenProps) {
  return (
    <div className="space-y-5">
      <Card className="border-slate-200">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Executive Recommendation</p>
            <Badge className="border-blue-200 bg-blue-50 text-blue-700">{recommendation.patternLabel}</Badge>
          </div>
          <CardTitle className="text-2xl">Decision: {recommendation.patternLabel}</CardTitle>
          <p className="text-sm leading-relaxed text-muted">{explanation.summary}</p>
          <div className="grid gap-3 md:grid-cols-3">
            <KeyFact label="Operating model" value={recommendation.operatingModel} />
            <KeyFact label="Precision profile" value={methodology.precisionProfile} />
            <KeyFact label="Autonomy mode" value={methodology.recommendedAutonomyMode} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <ScoreGauge label="Readiness score" value={score.readinessScore} />
          <ScoreGauge label="Confidence score" value={confidence.confidenceScore} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Suggested first pilot scope</p>
            <p className="text-sm text-muted">{explanation.suggestedPilotScope}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Best first pilot</p>
            <p className="text-sm text-muted">{methodology.bestFirstPilot}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Recommended next step</p>
            <p className="text-sm text-muted">{explanation.nextStep}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>What this assessment is telling you</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted">
            {methodology.lessons.map((lesson) => (
              <li key={lesson} className="rounded-lg bg-slate-50 px-3 py-2">
                {lesson}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <BulletList title="Strengths" items={explanation.strengths} />
        <BulletList title="Blockers" items={explanation.blockers} />
        <BulletList title="Risks" items={explanation.risks} />
      </div>
    </div>
  );
}
