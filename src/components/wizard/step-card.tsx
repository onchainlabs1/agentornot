import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StepCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function StepCard({ title, description, children }: StepCardProps) {
  return (
    <Card className="border-slate-200/90 bg-white/95">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
