import { AssessmentInput, GateResult } from "@/features/decision-wizard/domain/types";

export function evaluateGates(input: AssessmentInput): GateResult[] {
  const a = input.answers;
  const result: GateResult[] = [];

  if ((a.process_clarity ?? 3) <= 2 && (a.metrics_clarity ?? 3) <= 2) {
    result.push({
      id: "process_metrics_foundation",
      status: "fail",
      reason: "Process and success metrics are both unclear."
    });
  }

  if ((a.criticality ?? 3) >= 4 && (a.error_tolerance ?? 3) <= 2) {
    result.push({
      id: "critical_low_tolerance",
      status: "warn",
      reason: "High criticality with low error tolerance requires stronger supervision."
    });
  }

  if ((a.data_structure ?? 3) <= 2) {
    result.push({
      id: "data_readiness",
      status: "fail",
      reason: "Data is not structured/available enough for reliable automation."
    });
  }

  if ((a.compliance_sensitivity ?? 3) >= 4 && (a.auditability_need ?? 3) >= 4) {
    result.push({
      id: "compliance_traceability",
      status: "warn",
      reason: "High governance and traceability needs suggest tighter control patterns."
    });
  }

  if (result.length === 0) {
    result.push({ id: "baseline", status: "pass", reason: "No hard gate triggered." });
  }

  return result;
}
