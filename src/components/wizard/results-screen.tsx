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

function readinessBarClass(value: number): string {
  if (value >= 75) return "from-emerald-400 to-teal-600";
  if (value >= 50) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-orange-500";
}

function readinessTextClass(value: number): string {
  if (value >= 75) return "text-emerald-600";
  if (value >= 50) return "text-amber-600";
  return "text-rose-600";
}

function confidenceBarClass(value: number): string {
  if (value >= 85) return "from-emerald-500 to-emerald-700";
  if (value >= 60) return "from-sky-500 to-indigo-600";
  return "from-amber-400 to-amber-600";
}

function confidenceTextClass(value: number): string {
  if (value >= 85) return "text-emerald-600";
  if (value >= 60) return "text-indigo-600";
  return "text-amber-600";
}

function ScoreGauge({
  label,
  value,
  variant
}: {
  label: string;
  value: number;
  variant: "readiness" | "confidence";
}) {
  const isReadiness = variant === "readiness";
  const barClass = isReadiness ? readinessBarClass(value) : confidenceBarClass(value);
  const numClass = isReadiness ? readinessTextClass(value) : confidenceTextClass(value);
  const ringClass = isReadiness
    ? value >= 75
      ? "ring-emerald-500/20 bg-emerald-50/50"
      : value >= 50
        ? "ring-amber-500/20 bg-amber-50/40"
        : "ring-rose-500/20 bg-rose-50/40"
    : value >= 85
      ? "ring-emerald-500/20 bg-emerald-50/50"
      : value >= 60
        ? "ring-indigo-500/20 bg-indigo-50/40"
        : "ring-amber-500/20 bg-amber-50/40";

  return (
    <div className={`rounded-2xl border border-slate-200/80 p-5 shadow-md ring-1 ${ringClass}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-5xl font-black tabular-nums tracking-tight ${numClass}`}>{toPercent(value)}</span>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200/80">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barClass} shadow-inner transition-all duration-700`}
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function KeyFact({ label, value, accent }: { label: string; value: string; accent: "slate" | "blue" | "violet" }) {
  const accents = {
    slate: "border-l-slate-900 bg-white",
    blue: "border-l-blue-600 bg-blue-50/60",
    violet: "border-l-violet-600 bg-violet-50/60"
  };
  return (
    <div className={`rounded-xl border border-slate-200/90 p-4 shadow-sm ${accents[accent]} border-l-4`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1.5 text-base font-bold leading-snug text-slate-900">{value}</p>
    </div>
  );
}

function BulletList({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" | "danger" }) {
  const tones = {
    success: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    warning: "border-amber-200 bg-amber-50/50 text-amber-950",
    danger: "border-rose-200 bg-rose-50/50 text-rose-950"
  };
  return (
    <Card className={`overflow-hidden border-2 shadow-sm ${tones[tone]}`}>
      <CardHeader className="border-b border-black/5 py-4">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2.5 text-sm font-medium leading-relaxed text-slate-700">
          {items.length ? (
            items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                {item}
              </li>
            ))
          ) : (
            <li className="text-slate-500">None flagged</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ResultsScreen({ score, confidence, recommendation, explanation, methodology }: ResultsScreenProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/10">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-200/90">Executive recommendation</p>
            <Badge className="w-fit shrink-0 border-white/25 bg-white/15 text-sm font-semibold text-white backdrop-blur">
              {recommendation.patternLabel}
            </Badge>
          </div>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
            Decision: <span className="text-indigo-100">{recommendation.patternLabel}</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-300 md:text-lg">
            {explanation.summary}
          </p>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-5 md:px-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Operating posture</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <KeyFact label="Operating model" value={recommendation.operatingModel} accent="slate" />
            <KeyFact label="Precision profile" value={methodology.precisionProfile} accent="blue" />
            <KeyFact label="Autonomy mode" value={methodology.recommendedAutonomyMode} accent="violet" />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-6 md:px-8">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Score snapshot</p>
          <div className="grid gap-4 md:grid-cols-2">
            <ScoreGauge label="Readiness" value={score.readinessScore} variant="readiness" />
            <ScoreGauge label="Confidence in this assessment" value={confidence.confidenceScore} variant="confidence" />
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 bg-white px-6 py-6 md:px-8">
          <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50/40 p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">Suggested first pilot scope</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{explanation.suggestedPilotScope}</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50/35 p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">Best first pilot</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{methodology.bestFirstPilot}</p>
          </div>
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">Recommended next step</p>
            <p className="mt-2 text-base font-semibold text-slate-800">{explanation.nextStep}</p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-2 border-slate-200 shadow-md">
        <CardHeader className="border-b border-slate-100 bg-slate-900 py-4">
          <CardTitle className="text-lg font-bold text-white">What this assessment is telling you</CardTitle>
        </CardHeader>
        <CardContent className="bg-slate-50/50 pt-5">
          <ul className="space-y-3">
            {methodology.lessons.map((lesson) => (
              <li
                key={lesson}
                className="border-l-4 border-indigo-500 bg-white px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 shadow-sm"
              >
                {lesson}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <BulletList title="Strengths" items={explanation.strengths} tone="success" />
        <BulletList title="Blockers" items={explanation.blockers} tone="warning" />
        <BulletList title="Risks" items={explanation.risks} tone="danger" />
      </div>
    </div>
  );
}
