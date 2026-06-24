"use client";

import { useState } from "react";
import type { PlanDay, Tournament, DecisionImpact } from "@/lib/types";
import { calculateTournamentImpact } from "@/lib/decision-engine";

interface TimelineViewProps {
  plan: PlanDay[];
}

export default function TimelineView({ plan }: TimelineViewProps) {
  const [previewTournament, setPreviewTournament] = useState(false);
  const [impact, setImpact] = useState<DecisionImpact | null>(null);

  const handlePreviewTournament = () => {
    const tournament: Tournament = {
      id: "t2",
      name: "TCA ชิงชนะเลิศภาคกลาง",
      startDate: "2026-07-08",
      endDate: "2026-07-11",
      days: 4,
      venue: "สนามเทนนิสจังหวัดนครสวรรค์",
      level: "U14",
      seedingBenefit: false,
    };
    const result = calculateTournamentImpact(plan, tournament);
    setImpact(result);
    setPreviewTournament(true);
  };

  const handleClearPreview = () => {
    setPreviewTournament(false);
    setImpact(null);
  };

  // Determine which days would have tournament overlay (days 10-13 = July 8-11)
  const isTournamentDay = (index: number) => {
    return previewTournament && index >= 10 && index <= 13;
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-tennis-green">📅 14-Day Plan</h2>
        <span className="text-xs text-tennis-gray-dark bg-tennis-gray px-2 py-1 rounded-full">
          24 มิ.ย. – 7 ก.ค.
        </span>
      </div>

      {/* Add Tournament Button */}
      <div className="flex gap-2">
        <button
          onClick={previewTournament ? handleClearPreview : handlePreviewTournament}
          className={`px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] transition-colors ${
            previewTournament
              ? "bg-red-100 text-red-600"
              : "bg-tennis-yellow text-gray-800 hover:bg-tennis-yellow/80"
          }`}
        >
          {previewTournament ? "✕ ยกเลิก Preview" : "➕ เพิ่ม Tournament 4 วัน"}
        </button>
      </div>

      {/* Impact Card */}
      {impact && (
        <div className="bg-tennis-yellow-light border border-tennis-yellow rounded-2xl p-4 space-y-3">
          <p className="font-bold text-sm">📊 Impact Analysis</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-xl p-2 text-center">
              <p className="text-xs text-tennis-gray-dark">Readiness Δ</p>
              <p className="font-bold text-red-500">{impact.readinessDelta}%</p>
            </div>
            <div className="bg-white rounded-xl p-2 text-center">
              <p className="text-xs text-tennis-gray-dark">วันซ้อมที่เสีย</p>
              <p className="font-bold text-red-500">{impact.trainingDaysLost} วัน</p>
            </div>
            <div className="bg-white rounded-xl p-2 text-center">
              <p className="text-xs text-tennis-gray-dark">Recovery Risk</p>
              <p className={`font-bold ${
                impact.recoveryRisk === "high" ? "text-red-500" :
                impact.recoveryRisk === "medium" ? "text-tennis-yellow" :
                "text-tennis-green"
              }`}>
                {impact.recoveryRisk === "high" ? "🔼 สูง" :
                 impact.recoveryRisk === "medium" ? "➡️ กลาง" : "🔽 ต่ำ"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-2 text-center">
              <p className="text-xs text-tennis-gray-dark">คำแนะนำ</p>
              <p className={`font-bold text-xs ${
                impact.recommendation === "Go with limit"
                  ? "text-tennis-blue"
                  : "text-tennis-clay"
              }`}>
                {impact.recommendation}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-start gap-1 text-xs">
              <span className="text-tennis-green">✅</span>
              <span>ได้ match pressure</span>
            </div>
            <div className="flex items-start gap-1 text-xs">
              <span className="text-tennis-green">✅</span>
              <span>อาจช่วย ranking / seeding</span>
            </div>
            <div className="flex items-start gap-1 text-xs">
              <span className="text-red-500">❌</span>
              <span>เสียวันซ้อม {impact.trainingDaysLost} วัน</span>
            </div>
            <div className="flex items-start gap-1 text-xs">
              <span className="text-red-500">❌</span>
              <span>readiness รายการหลักลดลง</span>
            </div>
          </div>

          <div className="bg-tennis-green-bg rounded-xl p-3">
            <p className="text-xs font-medium text-tennis-green">
              💡 {impact.recommendation}
            </p>
            <p className="text-xs text-tennis-gray-dark mt-1">{impact.explanation}</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-1">
        {plan.map((day, index) => {
          const tDay = isTournamentDay(index);
          return (
            <div
              key={day.date}
              className={`rounded-xl p-2 transition-colors ${
                tDay
                  ? "bg-tennis-yellow-light border-2 border-tennis-yellow"
                  : "bg-tennis-gray"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold w-8 text-tennis-gray-dark">
                  {day.dayLabel}
                </span>
                <span className="text-xs text-tennis-gray-dark w-16">
                  {new Date(day.date).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                {tDay && (
                  <span className="text-xs bg-tennis-yellow text-gray-800 px-2 py-0.5 rounded-full font-bold">
                    🏆 TOURNAMENT
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {tDay ? (
                  <div
                    className="flex-1 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                    style={{ backgroundColor: "#ffb703" }}
                  >
                    🏆 TCA ชิงชนะเลิศ
                  </div>
                ) : day.activities.length === 0 ? (
                  <div className="flex-1 rounded-lg px-2 py-1.5 text-xs text-tennis-gray-dark text-center bg-gray-200">
                    พัก
                  </div>
                ) : (
                  day.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex-1 rounded-lg px-2 py-1.5 text-xs font-medium text-white text-center truncate"
                      style={{ backgroundColor: activity.color }}
                      title={activity.label}
                    >
                      {activity.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}