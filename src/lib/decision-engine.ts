import type { PlanDay, Tournament, DecisionImpact } from "@/lib/types";

export function calculateTournamentImpact(
  currentPlan: PlanDay[],
  tournament: Tournament
): DecisionImpact {
  const trainingDaysLost = tournament.days;
  const baseReadinessDrop = trainingDaysLost * 5;
  const readinessDelta = -baseReadinessDrop;

  let recoveryRisk: "low" | "medium" | "high" = "high";
  if (tournament.days <= 2) {
    recoveryRisk = "low";
  } else if (tournament.days <= 3) {
    recoveryRisk = "medium";
  }

  let recommendation: "Go with limit" | "Replace with Match Simulation";
  let explanation: string;

  if (tournament.seedingBenefit) {
    recommendation = "Go with limit";
    explanation =
      "Seeding benefit confirmed — tournament can improve ranking position. " +
      `Expect readiness drop of ~${Math.abs(readinessDelta)}%, ` +
      `lose ${trainingDaysLost} training days. ` +
      "Recommend limiting other activities and prioritizing recovery after the tournament.";
  } else {
    recommendation = "Replace with Match Simulation";
    explanation =
      "Seeding benefit is not confirmed — tournament may not help ranking significantly. " +
      `Would lose ${trainingDaysLost} training days and reduce readiness by ~${Math.abs(readinessDelta)}%. ` +
      "A Match Simulation session can deliver similar match pressure while maintaining readiness and training continuity.";
  }

  return {
    readinessDelta,
    trainingDaysLost,
    recoveryRisk,
    recommendation,
    explanation,
  };
}