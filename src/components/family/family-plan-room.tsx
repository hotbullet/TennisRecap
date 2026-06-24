"use client";

import { useState } from "react";
import type { Proposal, PlanComparison } from "@/lib/types";

interface FamilyPlanRoomProps {
  proposal: Proposal;
  onSaveDecision: (planId: "A" | "B" | "C") => void;
}

export default function FamilyPlanRoom({ proposal, onSaveDecision }: FamilyPlanRoomProps) {
  const [savedPlan, setSavedPlan] = useState<"A" | "B" | "C" | null>(
    proposal.savedDecision
  );

  const handleSave = (planId: "A" | "B" | "C") => {
    setSavedPlan(planId);
    onSaveDecision(planId);
  };

  const { tournament, reactions, comparisons } = proposal;

  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-lg font-bold text-tennis-green">👨‍👩‍👧 Family Plan Room</h2>

      {/* Proposal Card */}
      <div className="bg-tennis-blue-light rounded-2xl p-4">
        <p className="text-xs text-tennis-blue font-medium">ข้อเสนอ</p>
        <p className="font-bold text-sm mt-1">
          เพิ่ม {tournament.name} {tournament.startDate} – {tournament.endDate} ?
        </p>
        <p className="text-xs text-tennis-gray-dark mt-1">{tournament.venue}</p>
        <p className="text-xs text-tennis-gray-dark mt-1">
          ระดับ {tournament.level} • {tournament.days} วัน
        </p>
      </div>

      {/* Family Reactions */}
      <div>
        <p className="text-xs font-medium text-tennis-gray-dark mb-2">
          ความเห็นครอบครัว
        </p>
        <div className="space-y-2">
          {reactions.map((reaction) => (
            <div
              key={reaction.member.id}
              className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-tennis-green-bg flex items-center justify-center text-lg flex-shrink-0">
                {reaction.member.avatarUrl ? "🙂" : "🧑"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{reaction.member.name}</p>
                  <span className="text-xs text-tennis-gray-dark">
                    ({reaction.member.role})
                  </span>
                </div>
                <p
                  className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${
                    reaction.reaction === "เห็นด้วย" || reaction.reaction === "อยากแข่ง"
                      ? "bg-tennis-green-bg text-tennis-green"
                      : reaction.reaction === "แนะนำ Match Simulation"
                      ? "bg-tennis-yellow-light text-tennis-clay"
                      : "bg-tennis-gray text-tennis-gray-dark"
                  }`}
                >
                  {reaction.reaction}
                </p>
                <p className="text-xs text-tennis-gray-dark mt-1">
                  {reaction.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Comparisons */}
      <div>
        <p className="text-xs font-medium text-tennis-gray-dark mb-2">
          เปรียบเทียบแผน
        </p>
        <div className="space-y-3">
          {comparisons.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={savedPlan === plan.id}
              onSelect={() => handleSave(plan.id)}
            />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => savedPlan && handleSave(savedPlan)}
        disabled={!savedPlan}
        className={`w-full py-3 rounded-xl text-sm font-bold min-h-[48px] transition-colors ${
          savedPlan
            ? "bg-tennis-green text-white hover:bg-tennis-green/90"
            : "bg-tennis-gray text-tennis-gray-dark cursor-not-allowed"
        }`}
      >
        {savedPlan ? "📝 บันทึกการตัดสินใจ" : "เลือกแผนก่อนบันทึก"}
      </button>
    </div>
  );
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: PlanComparison;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const riskColor =
    plan.recoveryRisk === "high"
      ? "text-red-500"
      : plan.recoveryRisk === "medium"
      ? "text-tennis-yellow"
      : "text-tennis-green";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl p-4 border-2 transition-colors ${
        isSelected
          ? "border-tennis-green bg-tennis-green-bg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">{plan.name}</h3>
        {isSelected && (
          <span className="text-tennis-green text-lg">✅</span>
        )}
      </div>
      <p className="text-xs text-tennis-gray-dark mb-3">{plan.description}</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-tennis-gray rounded-lg p-2 text-center">
          <p className="text-xs text-tennis-gray-dark">Readiness</p>
          <p className="font-bold text-sm">{plan.readiness}%</p>
        </div>
        <div className="bg-tennis-gray rounded-lg p-2 text-center">
          <p className="text-xs text-tennis-gray-dark">วันซ้อม</p>
          <p className="font-bold text-sm">{plan.trainingDays}</p>
        </div>
        <div className="bg-tennis-gray rounded-lg p-2 text-center">
          <p className="text-xs text-tennis-gray-dark">ความเสี่ยง</p>
          <p className={`font-bold text-sm ${riskColor}`}>
            {plan.recoveryRisk === "high" ? "สูง" : plan.recoveryRisk === "medium" ? "กลาง" : "ต่ำ"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {plan.pros.map((pro, i) => (
          <div key={`pro-${i}`} className="flex items-start gap-1 text-xs">
            <span className="text-tennis-green">✅</span>
            <span>{pro}</span>
          </div>
        ))}
        {plan.cons.map((con, i) => (
          <div key={`con-${i}`} className="flex items-start gap-1 text-xs">
            <span className="text-red-500">❌</span>
            <span>{con}</span>
          </div>
        ))}
      </div>
    </button>
  );
}