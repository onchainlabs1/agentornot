import { questionBank } from "@/features/decision-wizard/config/question-bank";
import { AnswerMap, UseCaseProfile } from "@/features/decision-wizard/domain/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReviewScreenProps = {
  profile: UseCaseProfile;
  answers: AnswerMap;
  onEditStep: (stepId: string) => void;
};

export function ReviewScreen({ profile, answers, onEditStep }: ReviewScreenProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Use Case Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          <p>
            <span className="font-medium text-foreground">Use case:</span> {profile.name || "-"}
          </p>
          <p>
            <span className="font-medium text-foreground">Team:</span> {profile.team || "-"}
          </p>
          <p>
            <span className="font-medium text-foreground">Objective:</span> {profile.objective || "-"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Answers</CardTitle>
          <Button variant="outline" onClick={() => onEditStep("process_data")}>
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {questionBank.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-sm">
              <span>{q.label}</span>
              <span className="font-semibold">{answers[q.id] ?? "-"}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
