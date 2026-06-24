"use client";

import { useState } from "react";
import type { PlanDay, Tournament, DecisionImpact } from "@/lib/types";
import { calculateTournamentImpact } from "@/lib/decision-engine";

interface TimelineViewProps {
  plan: PlanDay[];
}

const ACTIVITY_COLORS: Record<string, { bg: string; text: string }> = {
  tennis: { bg: "#2e7d32", text: "#ffffff" },
  fitness: { bg: "#e07a5f", text: "#ffffff" },
  recovery: { bg: "#a5d6a7", text: "#1f2937" },
  "match-sim": { bg: "#ffb703", text: "#1f2937" },
  school: { bg: "#0077b6", text: "#ffffff" },
  tournament: { bg: "#ffb703", text: "#1f2937" },
};

const ACTIVITY_EMOJI: Record<string, string> = {
  tennis: "🎾 Tennis",
  fitness: "💪 Fitness",
  recovery: "🧘 Recovery",
  "match-sim": "⚡ Match Sim",
  school: "📚 School",
  tournament: "🏆 Tournament",
};

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

  const isTournamentDay = (index: number) =>
    previewTournament && index >= 10 && index <= 13;

  const todayIndex = plan.findIndex(
    (d) => new Date(d.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-tennis-green">📅 14-Day Plan</h2>
        <span className="text-[11px] text-tennis-gray-dark bg-tennis-gray px-2 py-1 rounded-full font-medium">
          {new Date(plan[0].date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
          })}{" "}
          –{" "}
          {new Date(plan[13].date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
        {Object.entries(ACTIVITY_EMOJI).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: ACTIVITY_COLORS[key]?.bg }}
            />
            <span className="text-tennis-gray-dark">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block bg-gray-300" />
          <span className="text-tennis-gray-dark">พัก</span>
        </div>
      </div>

      {/* Add Tournament Button */}
      <div className="flex gap-2">
        <button
          onClick={previewTournament ? handleClearPreview : handlePreviewTournament}
          className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold min-h-[44px] transition-all active:scale-95 ${
            previewTournament
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-tennis-yellow text-gray-800 hover:bg-tennis-yellow/80"
          }`}
        >
          {previewTournament ? "✕ ยกเลิก Preview" : "➕ เพิ่ม Tournament 4 วัน"}
        </button>
      </div>

      {/* Empty / Preview State */}
      {!previewTournament && (
        <div className="text-center py-4">
          <p className="text-xs text-tennis-gray-dark">
            💡 ลองกดปุ่มด้านบนเพื่อดูตัวอย่างการเพิ่ม Tournament
          </p>
        </div>
      )}

      {/* Impact Card */}
      {impact && (
        <div className="bg-tennis-yellow-light border border-tennis-yellow rounded-2xl p-3 space-y-2.5">
          <p className="font-bold text-[13px]">📊 Impact Analysis</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl px-2 py-2 text-center">
              <p className="text-[10px] text-tennis-gray-dark uppercase">Readiness Δ</p>
              <p className="font-bold text-base text-red-500 mt-0.5">
                {impact.readinessDelta}%
              </p>
            </div>
            <div className="bg-white rounded-xl px-2 py-2 text-center">
              <p className="text-[10px] text-tennis-gray-dark uppercase">เสียวันซ้อม</p>
              <p className="font-bold text-base text-red-500 mt-0.5">
                {impact.trainingDaysLost} วัน
              </p>
            </div>
            <div className="bg-white rounded-xl px-2 py-2 text-center">
              <p className="text-[10px] text-tennis-gray-dark uppercase">ความเสี่ยง</p>
              <p
                className={`font-bold text-sm mt-0.5 ${
                  impact.recoveryRisk === "high"
                    ? "text-red-500"
                    : impact.recoveryRisk === "medium"
                    ? "text-tennis-yellow"
                    : "text-tennis-green"
                }`}
              >
                {impact.recoveryRisk === "high"
                  ? "🔼 สูง"
                  : impact.recoveryRisk === "medium"
                  ? "➡️ กลาง"
                  : "🔽 ต่ำ"}
              </p>
            </div>
            <div className="bg-white rounded-xl px-2 py-2 text-center">
              <p className="text-[10px] text-tennis-gray-dark uppercase">แนะนำ</p>
              <p
                className={`font-bold text-[11px] mt-0.5 ${
                  impact.recommendation === "Go with limit"
                    ? "text-tennis-blue"
                    : "text-tennis-clay"
                }`}
              >
                {impact.recommendation === "Go with limit"
                  ? "⚡ Go with limit"
                  : "🔄 Match Sim"}
              </p>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-start gap-1.5 text-[11px]">
              <span className="text-tennis-green flex-shrink-0">✅</span>
              <span>ได้ match pressure</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px]">
              <span className="text-tennis-green flex-shrink-0">✅</span>
              <span>อาจช่วย ranking / seeding</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px]">
              <span className="text-red-500 flex-shrink-0">❌</span>
              <span>เสียวันซ้อม {impact.trainingDaysLost} วัน</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px]">
              <span className="text-red-500 flex-shrink-0">❌</span>
              <span>readiness รายการหลักลดลง</span>
            </div>
          </div>

          <div className="bg-tennis-green-bg rounded-xl px-3 py-2.5">
            <p className="text-[11px] font-semibold text-tennis-green">
              💡 {impact.recommendation}
            </p>
            <p className="text-[11px] text-tennis-gray-dark mt-0.5 leading-snug">
              {impact.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Timeline — compact day rows with clear activity blocks */}
      <div className="space-y-[2px]">
        {plan.map((day, index) => {
          const tDay = isTournamentDay(index);
          const isToday = index === todayIndex;
          const dateLabel = new Date(day.date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
          });

          return (
            <div
              key={day.date}
              className={`rounded-lg px-2 py-1.5 transition-colors ${
                tDay
                  ? "bg-tennis-yellow-light border-2 border-tennis-yellow"
                  : isToday
                  ? "bg-white border border-tennis-green/30"
                  : "bg-tennis-gray/70"
              }`}
            >
              {/* Day label row */}
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`text-[11px] font-bold w-6 text-center rounded px-0.5 ${
                    isToday
                      ? "bg-tennis-green text-white"
                      : "text-tennis-gray-dark"
                  }`}
                >
                  {day.dayLabel}
                </span>
                <span className="text-[11px] text-tennis-gray-dark w-16">
                  {dateLabel}
                </span>
                {isToday && (
                  <span className="text-[9px] bg-tennis-green text-white px-1.5 py-0.5 rounded-full font-semibold">
                    วันนี้
                  </span>
                )}
                {tDay && (
                  <span className="text-[9px] bg-tennis-yellow text-gray-800 px-1.5 py-0.5 rounded-full font-bold">
                    🏆 TOURNAMENT
                  </span>
                )}
              </div>

              {/* Activity blocks row */}
              <div className="flex flex-wrap gap-1">
                {tDay ? (
                  <div
                    className="flex-1 rounded-md px-2 py-1 text-[11px] font-bold text-center"
                    style={{
                      backgroundColor: ACTIVITY_COLORS["tournament"].bg,
                      color: ACTIVITY_COLORS["tournament"].text,
                    }}
                  >
                    🏆 TCA ชิงชนะเลิศ
                  </div>
                ) : day.activities.length === 0 ? (
                  <div className="flex-1 rounded-md px-2 py-1 text-[11px] text-tennis-gray-dark text-center bg-gray-200/60">
                    พัก
                  </div>
                ) : (
                  day.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex-1 rounded-md px-1.5 py-1 text-[10px] font-semibold text-center truncate leading-tight"
                      style={{
                        backgroundColor: activity.color,
                        color: "#ffffff",
                      }}
                      title={
                        activity.venue
                          ? `${activity.label} at ${activity.venue}`
                          : activity.label
                      }
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