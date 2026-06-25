"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  PlanDay,
  PlanActivity,
  ActivityType,
  PlanPriority,
} from "@/lib/types";

type CalendarView = "day" | "week" | "month" | "year";

interface PlanCalendarViewProps {
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

const priorityConfig: Record<
  PlanPriority,
  { bg: string; text: string; label: string }
> = {
  low: { bg: "bg-gray-100", text: "text-gray-600", label: "ต่ำ" },
  medium: {
    bg: "bg-tennis-yellow-light",
    text: "text-yellow-700",
    label: "กลาง",
  },
  high: { bg: "bg-red-50", text: "text-red-600", label: "สูง" },
};

const VIEW_OPTIONS: { id: CalendarView; label: string }[] = [
  { id: "day", label: "วัน" },
  { id: "week", label: "สัปดาห์" },
  { id: "month", label: "เดือน" },
  { id: "year", label: "ปี" },
];

const DAY_NAMES = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const FULL_DAY_NAMES = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

export default function PlanCalendarView({
  plan,
  planActivities,
  onAddActivity,
  onRemoveActivity,
}: PlanCalendarViewProps) {
  const [view, setView] = useState<CalendarView>("day");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<number | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  // Activity form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ActivityType>("tennis");
  const [newDuration, setNewDuration] = useState(90);
  const [newPriority, setNewPriority] = useState<PlanPriority>("medium");
  const [newCost, setNewCost] = useState(0);
  const [newPurpose, setNewPurpose] = useState("");

  const todayIndex = plan.findIndex(
    (d) => new Date(d.date).toDateString() === new Date().toDateString()
  );

  const toggleExpanded = (idx: number) => {
    setExpandedDay(expandedDay === idx ? null : idx);
    setShowAddForm(null);
  };

  const getDayTotalMinutes = useCallback(
    (date: string) => {
      const day = plan.find((d) => d.date === date);
      const legacy = day
        ? day.activities.reduce((s, a) => s + (a.durationMinutes ?? 0), 0)
        : 0;
      const extra = planActivities
        .filter((pa) => pa.date === date)
        .reduce((s, pa) => s + pa.durationMinutes, 0);
      return legacy + extra;
    },
    [plan, planActivities]
  );

  const getDayCost = useCallback(
    (date: string) =>
      planActivities
        .filter((pa) => pa.date === date)
        .reduce((s, pa) => s + pa.costEstimate, 0),
    [planActivities]
  );

  const getDayPlanActivities = useCallback(
    (date: string) => planActivities.filter((pa) => pa.date === date),
    [planActivities]
  );

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
      expectedBenefit: "",
      risk: "",
    });

    setNewTitle("");
    setNewPurpose("");
    setNewCost(0);
    setShowAddForm(null);
  };

  // ---- Weekly view calculations ----

  // Get the current week's days (7 days starting from weekOffset)
  const weekDays = useMemo(() => {
    const startIdx = todayIndex >= 0 ? todayIndex + weekOffset * 7 : weekOffset * 7;
    const result: PlanDay[] = [];
    for (let i = 0; i < 7; i++) {
      const idx = startIdx + i;
      if (idx >= 0 && idx < plan.length) {
        result.push(plan[idx]);
      }
    }
    return result;
  }, [plan, todayIndex, weekOffset]);

  const weekSummary = useMemo(() => {
    let totalLoad = 0;
    let intenseDays = 0;
    let recoveryDays = 0;
    let totalCost = 0;

    weekDays.forEach((day) => {
      const mins = getDayTotalMinutes(day.date);
      totalLoad += mins;
      if (mins > 300) intenseDays++;
      const hasRecovery =
        day.activities.some((a) => a.type === "recovery") ||
        getDayPlanActivities(day.date).some((pa) => pa.type === "recovery");
      if (hasRecovery) recoveryDays++;
      totalCost += getDayCost(day.date);
    });

    const balanced = intenseDays <= 3 && recoveryDays >= 1 && totalLoad < 3000;
    const recommendation = balanced
      ? "สัปดาห์นี้โหลดซ้อมสมดุลดี"
      : "ควรเพิ่ม recovery";

    return { totalLoad, intenseDays, recoveryDays, totalCost, balanced, recommendation };
  }, [weekDays, getDayTotalMinutes, getDayCost, getDayPlanActivities]);

  // ---- Monthly view helper ----
  const monthlyGroups = useMemo(() => {
    const groups: { label: string; days: PlanDay[] }[] = [];
    for (let i = 0; i < plan.length; i += 7) {
      const chunk = plan.slice(i, Math.min(i + 7, plan.length));
      if (chunk.length > 0) {
        groups.push({
          label: `${i + 1}–${Math.min(i + 7, plan.length)}`,
          days: chunk,
        });
      }
    }
    return groups;
  }, [plan]);

  const safePlan = plan.length > 0 ? plan : [];

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-tennis-green">
          📅 แผนซ้อม
        </h2>
        <span className="text-[11px] text-tennis-gray-dark bg-tennis-gray px-2 py-1 rounded-full font-medium">
          {safePlan.length > 0
            ? `${new Date(safePlan[0].date).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              })} – ${new Date(
                safePlan[safePlan.length - 1].date
              ).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              })}`
            : "ไม่มีข้อมูล"}
        </span>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-tennis-gray rounded-xl p-1 gap-0.5">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setView(opt.id);
              setExpandedDay(null);
              setShowAddForm(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold min-h-[44px] transition-all active:scale-95 ${
              view === opt.id
                ? "bg-white text-tennis-green shadow-sm"
                : "text-tennis-gray-dark hover:bg-gray-200/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ---- DAY VIEW ---- */}
      {view === "day" && (
        <>
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

          <div className="space-y-2">
            {plan.map((day, index) => {
              const isToday = index === todayIndex;
              const isExpanded = expandedDay === index;
              const isShowingForm = showAddForm === index;
              const totalMinutes = getDayTotalMinutes(day.date);
              const totalCost = getDayCost(day.date);
              const extra = getDayPlanActivities(day.date);
              const isTooPacked = totalMinutes > 420;
              const totalHours = Math.floor(totalMinutes / 60);
              const remainMins = totalMinutes % 60;

              const dateLabel = new Date(day.date).toLocaleDateString(
                "th-TH",
                { day: "numeric", month: "short" }
              );
              const dayOfWeek =
                DAY_NAMES[new Date(day.date).getDay()];

              return (
                <div
                  key={day.date}
                  className={`rounded-2xl border-2 transition-all ${
                    isToday
                      ? "border-tennis-green bg-white shadow-md"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left active:bg-tennis-gray/50 transition-colors rounded-2xl"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isToday
                          ? "bg-tennis-green text-white"
                          : "bg-tennis-gray text-tennis-gray-dark"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[13px] font-bold leading-tight ${
                          isToday ? "text-tennis-green" : ""
                        }`}
                      >
                        {dayOfWeek} {dateLabel}
                        {isToday && (
                          <span className="ml-1.5 text-[10px] bg-tennis-green text-white px-1.5 py-0.5 rounded-full inline-block">
                            วันนี้
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-tennis-gray-dark mt-0.5">
                        {totalMinutes > 0
                          ? `${totalHours} ชม. ${remainMins} นาที`
                          : "ยังไม่มีกิจกรรม"}
                        {totalCost > 0 && (
                          <span className="ml-2 text-tennis-clay">
                            ฿{totalCost.toLocaleString()}
                          </span>
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

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
                      {/* Legacy activities */}
                      {day.activities.map((act) => (
                        <div
                          key={act.id}
                          className="flex items-center gap-2 bg-tennis-gray rounded-xl px-3 py-2"
                        >
                          <div
                            className="w-1.5 h-8 rounded-full flex-shrink-0"
                            style={{ backgroundColor: act.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold">
                              {act.label}
                            </p>
                            <p className="text-[10px] text-tennis-gray-dark">
                              {act.startTime} – {act.endTime}
                              {act.durationMinutes &&
                                ` (${act.durationMinutes} นาที)`}
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
                            backgroundColor:
                              ACTIVITY_COLORS[pa.type]?.bg + "15",
                            borderLeft: `3px solid ${
                              ACTIVITY_COLORS[pa.type]?.bg
                            }`,
                          }}
                        >
                          <span className="text-sm flex-shrink-0">
                            {ACTIVITY_EMOJI[pa.type]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold">
                              {pa.title}
                            </p>
                            <p className="text-[10px] text-tennis-gray-dark">
                              {pa.durationMinutes} นาที
                              <span
                                className={`ml-1.5 ${priorityConfig[pa.priority].text} ${priorityConfig[pa.priority].bg} px-1.5 py-0.5 rounded-full text-[9px]`}
                              >
                                {priorityConfig[pa.priority].label}
                              </span>
                              {pa.costEstimate > 0 && (
                                <span className="ml-1.5 text-tennis-clay">
                                  ฿{pa.costEstimate}
                                </span>
                              )}
                            </p>
                            {pa.purpose && (
                              <p className="text-[10px] text-tennis-gray-dark mt-0.5">
                                🎯 {pa.purpose}
                              </p>
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

                      {/* Add activity */}
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
                            {Object.entries(ACTIVITY_LABELS).map(
                              ([key, label]) => (
                                <button
                                  key={key}
                                  onClick={() =>
                                    setNewType(key as ActivityType)
                                  }
                                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold min-h-[36px] transition-all active:scale-95 ${
                                    newType === key
                                      ? "text-white shadow-sm"
                                      : "bg-white text-tennis-gray-dark hover:bg-gray-200"
                                  }`}
                                  style={
                                    newType === key
                                      ? {
                                          backgroundColor:
                                            ACTIVITY_COLORS[key]?.bg,
                                        }
                                      : {}
                                  }
                                >
                                  {ACTIVITY_EMOJI[key]} {label}
                                </button>
                              )
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <select
                              value={newDuration}
                              onChange={(e) =>
                                setNewDuration(Number(e.target.value))
                              }
                              className="px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
                            >
                              {[30, 45, 60, 90, 120, 150, 180].map((m) => (
                                <option key={m} value={m}>
                                  {m} นาที
                                </option>
                              ))}
                            </select>
                            <select
                              value={newPriority}
                              onChange={(e) =>
                                setNewPriority(
                                  e.target.value as PlanPriority
                                )
                              }
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
                              onChange={(e) =>
                                setNewCost(Number(e.target.value) || 0)
                              }
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

                      {isTooPacked && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
                          <p className="text-[11px] text-red-600 font-semibold">
                            ⚠️ วันนี้แน่นเกิน ({totalHours} ชม.) — เสี่ยง
                            overtraining
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ---- WEEK VIEW ---- */}
      {view === "week" && (
        <>
          {/* Week navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="px-3 py-2 rounded-lg text-[13px] font-semibold bg-tennis-gray text-tennis-gray-dark hover:bg-gray-200 active:scale-95 min-h-[40px]"
            >
              ◀ ก่อนหน้า
            </button>
            <span className="text-[13px] font-bold text-tennis-green">
              {weekDays.length > 0
                ? `${new Date(weekDays[0].date).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  })} – ${new Date(
                    weekDays[weekDays.length - 1].date
                  ).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  })}`
                : "ไม่มีข้อมูล"}
            </span>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="px-3 py-2 rounded-lg text-[13px] font-semibold bg-tennis-gray text-tennis-gray-dark hover:bg-gray-200 active:scale-95 min-h-[40px]"
            >
              ถัดไป ▶
            </button>
          </div>

          {/* Weekly Summary Card */}
          <div className="bg-gradient-to-br from-tennis-green-bg to-blue-50 rounded-2xl border border-tennis-green/20 p-4 space-y-3">
            <p className="text-[13px] font-bold text-tennis-green">
              📊 สรุปสัปดาห์
            </p>
            <div className="grid grid-cols-2 gap-2">
              <SummaryMetric
                label="โหลดรวม"
                value={`${Math.round(weekSummary.totalLoad / 60)} ชม. ${
                  weekSummary.totalLoad % 60
                } นาที`}
                color="text-tennis-blue"
              />
              <SummaryMetric
                label="วันที่หนัก"
                value={`${weekSummary.intenseDays} วัน`}
                color={
                  weekSummary.intenseDays > 3
                    ? "text-red-500"
                    : "text-tennis-green"
                }
              />
              <SummaryMetric
                label="Recovery"
                value={`${weekSummary.recoveryDays} วัน`}
                color={
                  weekSummary.recoveryDays < 1
                    ? "text-red-500"
                    : "text-tennis-green"
                }
              />
              <SummaryMetric
                label="ค่าใช้จ่าย"
                value={`฿${weekSummary.totalCost.toLocaleString()}`}
                color="text-tennis-clay"
              />
            </div>

            <div
              className={`rounded-xl px-3 py-2.5 text-center ${
                weekSummary.balanced
                  ? "bg-tennis-green-bg border border-tennis-green/30"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-[12px] font-semibold ${
                  weekSummary.balanced
                    ? "text-tennis-green"
                    : "text-red-600"
                }`}
              >
                {weekSummary.balanced ? "✅ " : "⚠️ "}
                {weekSummary.recommendation}
              </p>
            </div>
          </div>

          {/* 7 Day Cards */}
          <div className="space-y-2">
            {weekDays.map((day) => {
              const totalMinutes = getDayTotalMinutes(day.date);
              const dayCost = getDayCost(day.date);
              const extraActivities = getDayPlanActivities(day.date);
              const totalHours = Math.floor(totalMinutes / 60);
              const remainMins = totalMinutes % 60;
              const dateObj = new Date(day.date);
              const dayOfWeek = FULL_DAY_NAMES[dateObj.getDay()];
              const dateLabel = dateObj.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              });
              const isToday =
                dateObj.toDateString() === new Date().toDateString();
              const isRest =
                day.activities.length === 0 &&
                extraActivities.length === 0;
              const isHeavy = totalMinutes > 300;
              const isRecovery =
                day.activities.some((a) => a.type === "recovery") ||
                extraActivities.some((pa) => pa.type === "recovery");

              return (
                <div
                  key={day.date}
                  className={`rounded-xl border-2 px-3 py-2.5 ${
                    isToday
                      ? "border-tennis-green bg-white shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[13px] font-bold ${
                          isToday ? "text-tennis-green" : ""
                        }`}
                      >
                        {dayOfWeek}
                      </span>
                      <span className="text-[11px] text-tennis-gray-dark">
                        {dateLabel}
                      </span>
                      {isToday && (
                        <span className="text-[9px] bg-tennis-green text-white px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                          วันนี้
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isHeavy && (
                        <span className="text-[9px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-semibold">
                          ⚠️ หนัก
                        </span>
                      )}
                      {isRecovery && (
                        <span className="text-[9px] bg-green-50 text-tennis-green px-1.5 py-0.5 rounded-full font-semibold">
                          🧘 Recovery
                        </span>
                      )}
                      {isRest && (
                        <span className="text-[9px] bg-gray-100 text-tennis-gray-dark px-1.5 py-0.5 rounded-full font-semibold">
                          😴 พัก
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Activity pills */}
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {day.activities.map((act) => (
                      <span
                        key={act.id}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: act.color }}
                      >
                        {ACTIVITY_EMOJI[act.type]} {act.label}
                      </span>
                    ))}
                    {extraActivities.map((pa) => (
                      <span
                        key={pa.id}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{
                          backgroundColor:
                            ACTIVITY_COLORS[pa.type]?.bg,
                        }}
                      >
                        {ACTIVITY_EMOJI[pa.type]} {pa.title}
                      </span>
                    ))}
                  </div>

                  {/* Load + cost bar */}
                  <div className="flex items-center justify-between text-[10px] text-tennis-gray-dark">
                    <span>
                      {totalMinutes > 0
                        ? `${totalHours} ชม. ${remainMins} นาที`
                        : "ไม่มีโหลด"}
                    </span>
                    {dayCost > 0 && (
                      <span className="text-tennis-clay font-semibold">
                        ฿{dayCost.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Week action tips */}
          {!weekSummary.balanced && (
            <div className="bg-tennis-yellow-light border border-tennis-yellow rounded-xl px-3 py-2 text-center">
              <p className="text-[11px] text-yellow-700 font-semibold">
                💡 ลองเพิ่ม recovery อีก 1–2 วัน หรือลดวันโหลดหนัก
                เพื่อสมดุลที่ดีขึ้น
              </p>
            </div>
          )}
        </>
      )}

      {/* ---- MONTH VIEW ---- */}
      {view === "month" && (
        <div className="space-y-3">
          <p className="text-[12px] text-tennis-gray-dark text-center">
            🗓️ ภาพรวมรายเดือน – แตะเพื่อขยายแต่ละสัปดาห์
          </p>
          {monthlyGroups.map((group, gi) => {
            const weekMins = group.days.reduce(
              (s, d) => s + getDayTotalMinutes(d.date),
              0
            );
            const weekCost = group.days.reduce(
              (s, d) => s + getDayCost(d.date),
              0
            );
            return (
              <div
                key={gi}
                className="bg-white border border-gray-200 rounded-xl p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[12px] font-bold text-tennis-green">
                    สัปดาห์ที่ {gi + 1}
                  </p>
                  <span className="text-[10px] text-tennis-gray-dark">
                    {Math.round(weekMins / 60)} ชม. · ฿
                    {weekCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.days.map((day) => {
                    const mins = getDayTotalMinutes(day.date);
                    const dateObj = new Date(day.date);
                    const barH = Math.min(
                      Math.max(Math.round(mins / 30), 1),
                      12
                    );
                    const isHeavy = mins > 300;
                    return (
                      <div
                        key={day.date}
                        className="flex flex-col items-center gap-0.5"
                        title={`${dateObj.toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}: ${Math.round(mins / 60)} ชม.`}
                      >
                        <span className="text-[9px] text-tennis-gray-dark">
                          {dateObj.getDate()}
                        </span>
                        <div
                          className={`w-6 rounded-sm ${
                            isHeavy
                              ? "bg-red-400"
                              : mins > 0
                              ? "bg-tennis-green/60"
                              : "bg-gray-200"
                          }`}
                          style={{ height: `${barH * 4}px`, minHeight: "4px" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- YEAR VIEW ---- */}
      {view === "year" && (
        <div className="space-y-3">
          <p className="text-[12px] text-tennis-gray-dark text-center pb-1">
            📅 ภาพรวมรายปี 2026
          </p>

          {/* Simple month blocks for the year */}
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, mi) => {
              const monthName = new Date(2026, mi, 1).toLocaleDateString(
                "th-TH",
                { month: "long" }
              );
              // Find plan activities in this month
              const monthPlanDays = plan.filter((d) => {
                const m = new Date(d.date).getMonth();
                return m === mi;
              });
              const monthMins = monthPlanDays.reduce(
                (s, d) => s + getDayTotalMinutes(d.date),
                0
              );
              const monthCost = monthPlanDays.reduce(
                (s, d) => s + getDayCost(d.date),
                0
              );
              const hasData = monthMins > 0;

              return (
                <div
                  key={mi}
                  className={`rounded-xl border-2 px-3 py-2.5 text-center ${
                    hasData
                      ? "border-tennis-green/30 bg-tennis-green-bg"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p
                    className={`text-[12px] font-bold ${
                      hasData ? "text-tennis-green" : "text-tennis-gray-dark"
                    }`}
                  >
                    {monthName}
                  </p>
                  {hasData ? (
                    <>
                      <p className="text-[11px] text-tennis-gray-dark mt-0.5">
                        {Math.round(monthMins / 60)} ชม.
                      </p>
                      {monthCost > 0 && (
                        <p className="text-[10px] text-tennis-clay">
                          ฿{monthCost.toLocaleString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[10px] text-tennis-gray-dark mt-0.5">
                      —
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data safety note */}
      <div className="text-center pt-1 pb-4">
        <p className="text-[10px] text-tennis-gray-dark leading-snug">
          ⚠️ ข้อมูลนี้เก็บในเครื่องนี้เท่านั้น ยังไม่ซิงก์ข้ามอุปกรณ์
        </p>
      </div>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl px-2 py-2 text-center">
      <p className="text-[10px] text-tennis-gray-dark uppercase">{label}</p>
      <p className={`font-bold text-sm mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}