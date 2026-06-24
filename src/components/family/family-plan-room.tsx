"use client";

import { useState } from "react";
import type { Proposal, PlanComparison } from "@/lib/types";

interface FamilyPlanRoomProps {
  proposal: Proposal;
  onSaveDecision: (planId: "A" | "B" | "C") => void;
}

const ROLE_EMOJI: Record<string, string> = {
  พ่อ: "👨",
  แม่: "👩",
  นักกีฬา: "🧒",
  โค้ช: "🧢",
};

export default function FamilyPlanRoom({ proposal, onSaveDecision }: FamilyPlanRoomProps) {
  const [savedPlan, setSavedPlan] = useState<"A" | "B" | "C" | null>(
    proposal.savedDecision
  );

  const handleSelect = (planId: "A" | "B" | "C") => {
    setSavedPlan(planId);
  };

  const handleSave = () => {
    if (savedPlan) {
      onSaveDecision(savedPlan);
    }
  };

  const { tournament, reactions, comparisons } = proposal;

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      <h2 className="text-lg font-bold text-tennis-green">👨‍👩‍👧 Family Plan Room</h2>

      {/* Proposal Card */}
      <div className="bg-tennis-blue-light rounded-2xl px-3 py-3">
        <p className="text-[11px] text-tennis-blue font-semibold uppercase tracking-wide">
          ข้อเสนอ
        </p>
        <p className="font-bold text-[13px] text-tennis-blue mt-1 leading-snug">
          เพิ่ม {tournament.name}
          <br />
          {tournament.startDate} – {tournament.endDate} ?
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
          <p className="text-[11px] text-tennis-gray-dark">
            📍 {tournament.venue}
          </p>
          <p className="text-[11px] text-tennis-gray-dark">
            ระดับ {tournament.level} &middot; {tournament.days} วัน
          </p>
        </div>
      </div>

      {/* Family Reactions */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          ความเห็นครอบครัว
        </p>
        <div className="space-y-1.5">
          {reactions.map((reaction) => (
            <div
              key={reaction.member.id}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-start gap-2.5"
            >
              <div
                className="w-9 h-9 rounded-full bg-tennis-gray flex items-center justify-center text-base flex-shrink-0"
                aria-label={reaction.member.name}
              >
                {ROLE_EMOJI[reaction.member.role] || "🧑"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[13px] font-semibold leading-tight">
                    {reaction.member.name}
                  </p>
                  <span className="text-[10px] text-tennis-gray-dark bg-tennis-gray px-1.5 py-0.5 rounded-full">
                    {reaction.member.role}
                  </span>
                </div>
                <p
                  className={`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${
                    reaction.reaction === "เห็นด้วย" || reaction.reaction === "อยากแข่ง"
                      ? "bg-tennis-green-bg text-tennis-green"
                      : reaction.reaction === "แนะนำ Match Simulation"
                      ? "bg-tennis-yellow-light text-tennis-clay"
                      : "bg-tennis-gray text-tennis-gray-dark"
                  }`}
                >
                  {reaction.reaction}
                </p>
                <p className="text-[11px] text-tennis-gray-dark mt-1 leading-snug">
                  {reaction.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Comparisons */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          เปรียบเทียบแผน
        </p>
        <div className="space-y-2">
          {comparisons.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={savedPlan === plan.id}
              onSelect={() => handleSelect(plan.id)}
            />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!savedPlan}
        className={`w-full py-3 rounded-xl text-[13px] font-bold min-h-[48px] transition-all active:scale-[0.98] ${
          savedPlan
            ? "bg-tennis-green text-white hover:bg-tennis-green/90 shadow-sm"
            : "bg-tennis-gray text-tennis-gray-dark cursor-not-allowed"
        }`}
      >
        {savedPlan
          ? `📝 บันทึกการตัดสินใจ (${savedPlan === "A" ? "Plan A" : savedPlan === "B" ? "Plan B" : "Plan C"})`
          : "เลือกแผนก่อนบันทึก"}
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

  const riskBg =
    plan.recoveryRisk === "high"
      ? "bg-red-50"
      : plan.recoveryRisk === "medium"
      ? "bg-tennis-yellow-light"
      : "bg-tennis-green-bg";

  const riskLabel =
    plan.recoveryRisk === "high"
      ? "สูง"
      : plan.recoveryRisk === "medium"
      ? "กลาง"
      : "ต่ำ";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl px-3 py-3 border-2 transition-all active:scale-[0.98] ${
        isSelected
          ? "border-tennis-green bg-tennis-green-bg shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="font-bold text-[13px] leading-tight">{plan.name}</h3>
        {isSelected && (
          <span className="text-tennis-green text-lg flex-shrink-0 ml-2">✅</span>
        )}
      </div>
      <p className="text-[11px] text-tennis-gray-dark mb-2.5 leading-snug">
        {plan.description}
      </p>

      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
        <div className="bg-tennis-gray rounded-lg px-2 py-1.5 text-center">
          <p className="text-[10px] text-tennis-gray-dark">Readiness</p>
          <p className="font-bold text-[13px] mt-0.5">{plan.readiness}%</p>
        </div>
        <div className="bg-tennis-gray rounded-lg px-2 py-1.5 text-center">
          <p className="text-[10px] text-tennis-gray-dark">วันซ้อม</p>
          <p className="font-bold text-[13px] mt-0.5">{plan.trainingDays}</p>
        </div>
        <div className={`${riskBg} rounded-lg px-2 py-1.5 text-center`}>
          <p className="text-[10px] text-tennis-gray-dark">ความเสี่ยง</p>
          <p className={`font-bold text-[13px] ${riskColor} mt-0.5`}>
            {riskLabel}
          </p>
        </div>
      </div>

      <div className="space-y-0.5">
        {plan.pros.map((pro, i) => (
          <div
            key={`pro-${i}`}
            className="flex items-start gap-1.5 text-[11px] leading-snug"
          >
            <span className="text-tennis-green flex-shrink-0 mt-px">✅</span>
            <span>{pro}</span>
          </div>
        ))}
        {plan.cons.map((con, i) => (
          <div
            key={`con-${i}`}
            className="flex items-start gap-1.5 text-[11px] leading-snug"
          >
            <span className="text-red-500 flex-shrink-0 mt-px">❌</span>
            <span>{con}</span>
          </div>
        ))}
      </div>
    </button>
  );
}