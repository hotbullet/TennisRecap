"use client";

import { useState, useMemo, useCallback } from "react";
import type { PlanDay, PlanActivity, ActivityType, PlanPriority, Tournament, DecisionImpact } from "@/lib/types";
import { calculateTournamentImpact } from "@/lib/decision-engine";

interface ExpandedPlanViewProps {
  plan: PlanDay[];
  planActivities: PlanActivity[];
  onAddActivity: (activity: PlanActivity) => void;
  onRemoveActivity: (id: string) => void;
}

const ACTIVITY_COLORS: Record<string, { bg: string; text: string }> = {
  tennis: { bg: "#2e7d32", text: "#ffffff" },
  fitness: { bg: "#e07a5f", text: "#ffffff" },
  recovery: { bg: "#a5d6a7", text: "#1f2937" },
  "match-sim": { bg: "#ffb703", text: "#1f2937" },
  school: { bg: "#0077b6", text: "#ffffff" },
  tournament: { bg: "#ffb703", text: "#1f2937" },
  travel: { bg: "#9b59b6", text: "#ffffff" },
  rest: { bg: "#bdc3c7", text: "#1f2937" },
};

const ACTIVITY_EMOJI: Record<string, string> = {
  tennis: "🎾",
  fitness: "💪",
  recovery: "🧘",
  "match-sim": "⚡",
  school: "📚",
  tournament: "🏆",
  travel: "🚗",
  rest: "😴",
};

const ACTIVITY_LABELS: Record<string, string> = {
  tennis: "เทนนิส",
  fitness: "ฟิตเนส",
  recovery: "รีคัฟเวอรี่",
  "match-sim": "ซ้อมแมตช์",
  school: "โรงเรียน",
  tournament: "ทัวร์นาเมนต์",
  travel: "เดินทาง",
  rest: "พัก",
};

const priorityConfig: Record<PlanPriority, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-gray-100", text: "text-gray-600", label: "ต่ำ" },
  medium: { bg: "bg-tennis-yellow-light", text: "text-yellow-700", label: "กลาง" },
  high: { bg: "bg-red-50", text: "text-red-600", label: "สูง" },
};

export default function ExpandedPlanView({
  plan,
  planActivities,
  onAddActivity,
  onRemoveActivity,
}: ExpandedPlanViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<number | null>(null);
  const [showTournamentPreview, setShowTournamentPreview] = useState(false);

  const todayIndex = plan.findIndex(
    (d) => new Date(d.date).toDateString() === new Date().toDateString()
  );

  const toggleExpanded = (idx: number) => {
    setExpandedDay(expandedDay === idx ? null : idx);
    setShowAddForm(null);
  };

  // Activity form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ActivityType>("tennis");
  const [newDuration, setNewDuration] = useState(90);
  const [newPriority, setNewPriority] = useState<PlanPriority>("medium");
  const [newCost, setNewCost] = useState(0);
  const [newPurpose, setNewPurpose] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newRisk, setNewRisk] = useState("");

  const handleAddActivity = (dayIndex: number) => {
    const date = plan[dayIndex]?.date;
    if (!date || !newTitle.trim()) return;

    onAddActivity({
      id: `pa_${Date.now()}`,
      date,
      title: newTitle.trim(),
      type: newType,
      durationMinutes: newDuration,
      priority: newPriority,
      costEstimate: newCost,
      purpose: newPurpose.trim(),
      expectedBenefit: newBenefit.trim(),
      risk: newRisk.trim(),
    });

    setNewTitle("");
    setNewPurpose("");
    setNewBenefit("");
    setNewRisk("");
    setNewCost(0);
    setShowAddForm(null);
  };

  // Total load per day
  const getDayTotalMinutes = useCallback(
    (day: PlanDay) => {
      const legacyMinutes = day.activities.reduce((sum, a) => sum + (a.durationMinutes ?? 0), 0);
      const planMinutes = planActivities
        .filter((pa) => pa.date === day.date)
        .reduce((sum, pa) => sum + pa.durationMinutes, 0);
      return legacyMinutes + planMinutes;
    },
    [planActivities]
  );

  const getDayCost = useCallback(
    (day: PlanDay) => {
      return planActivities
        .filter((pa) => pa.date === day.date)
        .reduce((sum, pa) => sum + pa.costEstimate, 0);
    },
    [planActivities]
  );

  const getDayActivities = useCallback(
    (day: PlanDay) => {
      const legacy = day.activities;
      const extra = planActivities.filter((pa) => pa.date === day.date);
      return { legacy, extra };
    },
    [planActivities]
  );

  // Tournament preview impact
  const impact: DecisionImpact | null = useMemo(() => {
    if (!showTournamentPreview) return null;
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
    return calculateTournamentImpact(plan, tournament);
  }, [showTournamentPreview, plan]);

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-tennis-green">📅 แผน 14 วัน</h2>
        <span className="text-[11px] text-tennis-gray-dark bg-tennis-gray px-2 py-1 rounded-full font-medium">
          {new Date(plan[0].date).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}{" "}
          –{" "}
          {new Date(plan[13].date).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
        {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: ACTIVITY_COLORS[key]?.bg }}
            />
            <span className="text-tennis-gray-dark">{label}</span>
          </div>
        ))}
      </div>

      {/* Tournament Preview Button */}
      <button
        onClick={() => setShowTournamentPreview(!showTournamentPreview)}
        className={`w-full py-3 rounded-xl text-[13px] font-bold min-h-[48px] transition-all active:scale-[0.98] ${
          showTournamentPreview
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-tennis-yellow text-gray-800 hover:bg-tennis-yellow/80 shadow-sm"
        }`}
      >
        {showTournamentPreview
          ? "✕ ปิดตัวอย่าง Tournament"
          : "🏆 ลองดูตัวอย่างการเพิ่ม Tournament 4 วัน"}
      </button>

      {/* Tournament Preview Panel */}
      {impact && (
        <div className="bg-tennis-yellow-light border-2 border-tennis-yellow rounded-2xl p-3 space-y-2.5">
          <p className="font-bold text-[14px] text-gray-800">📊 ผลกระทบ Tournament 4 วัน</p>

          <div className="grid grid-cols-2 gap-2">
            <MetricBox label="วันถูกแทนที่" value={`${impact.trainingDaysLost} วัน`} color="text-red-500" />
            <MetricBox label="วันซ้อมที่เสีย" value={`${impact.trainingDaysLost} วัน`} color="text-red-500" />
            <MetricBox label="ค่าใช้จ่ายเพิ่ม" value="~฿8,000" color="text-tennis-clay" />
            <MetricBox label="Readiness Δ" value={`${impact.readinessDelta}%`} color="text-red-500" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl px-2 py-2 text-center">
              <p className="text-[10px] text-tennis-gray-dark uppercase">ความเสี่ยง Recovery</p>
              <p className={`font-bold text-sm mt-0.5 ${
                impact.recoveryRisk === "high" ? "text-red-500" : impact.recoveryRisk === "medium" ? "text-yellow-600" : "text-tennis-green"
              }`}>
                {impact.recoveryRisk === "high" ? "🔼 สูง" : impact.recoveryRisk === "medium" ? "➡️ กลาง" : "🔽 ต่ำ"}
              </p>
            </div>
            <div className="bg-white rounded-xl px-2 py-2 text-center">
              <p className="text-[10px] text-tennis-gray-dark uppercase">คำแนะนำ</p>
              <p className={`font-bold text-[11px] mt-0.5 ${impact.recommendation === "Go with limit" ? "text-tennis-blue" : "text-tennis-clay"}`}>
                {impact.recommendation === "Go with limit" ? "⚡ ไปแบบจำกัด" : "🔄 Match Sim แทน"}
              </p>
            </div>
          </div>

          <div className="bg-tennis-green-bg rounded-xl px-3 py-2.5">
            <p className="text-[11px] font-semibold text-tennis-green">💡 {impact.recommendation === "Go with limit" ? "Go with limit" : "Replace with Match Simulation"}</p>
            <p className="text-[11px] text-tennis-gray-dark mt-0.5 leading-snug">{impact.explanation}</p>
          </div>
        </div>
      )}

      {/* Day Cards — vertical layout */}
      <div className="space-y-2">
        {plan.map((day, index) => {
          const isToday = index === todayIndex;
          const isExpanded = expandedDay === index;
          const isShowingForm = showAddForm === index;
          const totalMinutes = getDayTotalMinutes(day);
          const totalCost = getDayCost(day);
          const { legacy, extra } = getDayActivities(day);
          const isTooPacked = totalMinutes > 600;

          const dateLabel = new Date(day.date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
          });
          const dayOfWeek = new Date(day.date).toLocaleDateString("th-TH", { weekday: "short" });

          return (
            <div
              key={day.date}
              className={`rounded-2xl border-2 transition-all ${
                isToday
                  ? "border-tennis-green bg-white shadow-md"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Day card header */}
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full flex items-center gap-3 px-3 py-3 text-left active:bg-tennis-gray/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isToday
                      ? "bg-tennis-green text-white"
                      : "bg-tennis-gray text-tennis-gray-dark"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-bold leading-tight ${isToday ? "text-tennis-green" : ""}`}>
                    {dayOfWeek} {dateLabel}
                    {isToday && (
                      <span className="ml-1.5 text-[10px] bg-tennis-green text-white px-1.5 py-0.5 rounded-full inline-block">
                        วันนี้
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-tennis-gray-dark mt-0.5">
                    {totalMinutes > 0
                      ? `${Math.round(totalMinutes / 60)} ชม. ${totalMinutes % 60} นาที`
                      : "ยังไม่มีกิจกรรม"}
                    {totalCost > 0 && (
                      <span className="ml-2 text-tennis-clay">฿{totalCost.toLocaleString()}</span>
                    )}
                  </p>
                </div>
                {isTooPacked && (
                  <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                    ⚠️ หนัก
                  </span>
                )}
                <span className="text-tennis-gray-dark text-sm flex-shrink-0">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
                  {/* Legacy activities */}
                  {legacy.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center gap-2 bg-tennis-gray rounded-xl px-3 py-2"
                    >
                      <div
                        className="w-1.5 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: act.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold">{act.label}</p>
                        <p className="text-[10px] text-tennis-gray-dark">
                          {act.startTime} – {act.endTime}
                          {act.durationMinutes && ` (${act.durationMinutes} นาที)`}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Plan activities */}
                  {extra.map((pa) => (
                    <div
                      key={pa.id}
                      className="flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{
                        backgroundColor: ACTIVITY_COLORS[pa.type]?.bg + "15",
                        borderLeft: `3px solid ${ACTIVITY_COLORS[pa.type]?.bg}`,
                      }}
                    >
                      <span className="text-sm flex-shrink-0">{ACTIVITY_EMOJI[pa.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold">{pa.title}</p>
                        <p className="text-[10px] text-tennis-gray-dark">
                          {pa.durationMinutes} นาที
                          <span className={`ml-1.5 ${priorityConfig[pa.priority].text} ${priorityConfig[pa.priority].bg} px-1.5 py-0.5 rounded-full text-[9px]`}>
                            {priorityConfig[pa.priority].label}
                          </span>
                          {pa.costEstimate > 0 && (
                            <span className="ml-1.5 text-tennis-clay">฿{pa.costEstimate}</span>
                          )}
                        </p>
                        {pa.purpose && (
                          <p className="text-[10px] text-tennis-gray-dark mt-0.5">🎯 {pa.purpose}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveActivity(pa.id);
                        }}
                        className="text-red-400 hover:text-red-600 text-sm px-1.5 py-1 rounded active:scale-95 flex-shrink-0 min-h-[36px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add activity button */}
                  {isShowingForm ? (
                    <div className="bg-tennis-gray rounded-xl p-3 space-y-2">
                      <input
                        type="text"
                        placeholder="ชื่อกิจกรรม..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 min-h-[44px] placeholder:text-gray-400"
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => setNewType(key as ActivityType)}
                            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold min-h-[36px] transition-all active:scale-95 ${
                              newType === key
                                ? "text-white shadow-sm"
                                : "bg-white text-tennis-gray-dark hover:bg-gray-200"
                            }`}
                            style={newType === key ? { backgroundColor: ACTIVITY_COLORS[key]?.bg } : {}}
                          >
                            {ACTIVITY_EMOJI[key]} {label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <select
                          value={newDuration}
                          onChange={(e) => setNewDuration(Number(e.target.value))}
                          className="px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
                        >
                          {[30, 45, 60, 90, 120, 150, 180].map((m) => (
                            <option key={m} value={m}>{m} นาที</option>
                          ))}
                        </select>
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value as PlanPriority)}
                          className="px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
                        >
                          <option value="low">⭐ ต่ำ</option>
                          <option value="medium">⭐⭐ กลาง</option>
                          <option value="high">⭐⭐⭐ สูง</option>
                        </select>
                        <input
                          type="number"
                          placeholder="฿ ค่าใช้จ่าย"
                          value={newCost || ""}
                          onChange={(e) => setNewCost(Number(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="วัตถุประสงค์..."
                        value={newPurpose}
                        onChange={(e) => setNewPurpose(e.target.value)}
                        className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 min-h-[40px] placeholder:text-gray-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddActivity(index)}
                          disabled={!newTitle.trim()}
                          className="flex-1 py-2 rounded-lg text-[12px] font-semibold bg-tennis-green text-white disabled:bg-tennis-gray disabled:text-tennis-gray-dark min-h-[40px] active:scale-[0.98] transition-all"
                        >
                          ✅ เพิ่มกิจกรรม
                        </button>
                        <button
                          onClick={() => {
                            setShowAddForm(null);
                            setNewTitle("");
                          }}
                          className="py-2 px-4 rounded-lg text-[12px] text-tennis-gray-dark hover:bg-gray-200 min-h-[40px] active:scale-95"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddForm(index);
                      }}
                      className="w-full py-2 rounded-xl text-[12px] font-semibold border-2 border-dashed border-tennis-green-light text-tennis-green hover:bg-tennis-green-bg active:scale-[0.98] transition-all min-h-[44px]"
                    >
                      + เพิ่มกิจกรรมในวันนี้
                    </button>
                  )}

                  {/* Recovery warning */}
                  {isTooPacked && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
                      <p className="text-[11px] text-red-600 font-semibold">
                        ⚠️ วันนี้แน่นเกิน ({Math.round(totalMinutes / 60)} ชม.) — เสี่ยง overtraining
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data safety note */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] text-tennis-gray-dark leading-snug">
          ⚠️ ข้อมูลนี้เก็บในเครื่องนี้เท่านั้น ยังไม่ซิงก์ข้ามอุปกรณ์
        </p>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl px-2 py-2 text-center">
      <p className="text-[10px] text-tennis-gray-dark uppercase">{label}</p>
      <p className={`font-bold text-sm mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}