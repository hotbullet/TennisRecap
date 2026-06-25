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
  const todayIndex = plan.findIndex(
    (d) => new Date(d.date).toDateString() === new Date().toDateString()
  );

  const [view, setView] = useState<CalendarView>("day");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    todayIndex >= 0 ? todayIndex : 0
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Activity form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ActivityType>("tennis");
  const [newDuration, setNewDuration] = useState(90);
  const [newPriority, setNewPriority] = useState<PlanPriority>("medium");
  const [newCost, setNewCost] = useState(0);
  const [newPurpose, setNewPurpose] = useState("");

  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex((prev) => prev - 1);
      setShowAddForm(false);
    }
  };

  const handleNextDay = () => {
    if (selectedDayIndex < plan.length - 1) {
      setSelectedDayIndex((prev) => prev + 1);
      setShowAddForm(false);
    }
  };

  const handleGoToday = () => {
    setSelectedDayIndex(todayIndex >= 0 ? todayIndex : 0);
    setShowAddForm(false);
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

  const handleAddActivity = () => {
    const day = plan[selectedDayIndex];
    if (!day || !newTitle.trim()) return;

    onAddActivity({
      id: `pa_${Date.now()}`,
      date: day.date,
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
    setShowAddForm(false);
  };

  // ---- Weekly view calculations ----

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

  // ---- Day View computations ----
  const day = plan[selectedDayIndex];
  const totalMinutes = day ? getDayTotalMinutes(day.date) : 0;
  const totalCost = day ? getDayCost(day.date) : 0;
  const extraActivities = day ? getDayPlanActivities(day.date) : [];
  const totalHours = Math.floor(totalMinutes / 60);
  const remainMins = totalMinutes % 60;
  const isSelectedToday = selectedDayIndex === todayIndex;
  const isLast = selectedDayIndex === plan.length - 1;
  const isFirst = selectedDayIndex === 0;

  let loadLevel: "empty" | "light" | "balanced" | "heavy" | "very_heavy" = "empty";
  if (totalMinutes === 0) loadLevel = "empty";
  else if (totalMinutes <= 120) loadLevel = "light";
  else if (totalMinutes <= 300) loadLevel = "balanced";
  else if (totalMinutes < 600) loadLevel = "heavy";
  else loadLevel = "very_heavy";

  const loadLevelLabel: Record<string, string> = {
    empty: "ไม่มีโหลด",
    light: "เบา",
    balanced: "สมดุล",
    heavy: "หนัก",
    very_heavy: "หนักมาก",
  };

  const loadLevelColor: Record<string, string> = {
    empty: "text-gray-400",
    light: "text-blue-500",
    balanced: "text-tennis-green",
    heavy: "text-red-500",
    very_heavy: "text-red-600",
  };

  const activityCount = day ? day.activities.length + extraActivities.length : 0;
  const hasRecoveryDay =
    day &&
    (day.activities.some((a) => a.type === "recovery") ||
      extraActivities.some((pa) => pa.type === "recovery"));

  let decisionText = "";
  if (loadLevel === "empty") {
    decisionText = "วันนี้ยังไม่มีแผน ลองเพิ่มกิจกรรมหรือกำหนดให้เป็นวันพักก็ได้";
  } else if (loadLevel === "light") {
    decisionText = "วันนี้เป็นวันเบา เหมาะกับฟื้นตัวหรือซ้อมเทคนิค";
  } else if (loadLevel === "balanced") {
    decisionText = "วันนี้โหลดซ้อมสมดุลดี";
  } else if (loadLevel === "heavy") {
    decisionText = "วันนี้โหลดหนัก ควรวาง recovery ให้ชัด";
  } else {
    decisionText = "วันนี้โหลดหนักมาก เสี่ยงบาดเจ็บ ควรลดหรือเพิ่ม recovery";
  }

  const decisionBorder =
    loadLevel === "heavy" || loadLevel === "very_heavy"
      ? "border-red-200 bg-red-50"
      : loadLevel === "empty"
      ? "border-gray-200 bg-gray-50"
      : "border-tennis-green/30 bg-tennis-green-bg";

  const decisionTextColor =
    loadLevel === "heavy" || loadLevel === "very_heavy"
      ? "text-red-600"
      : loadLevel === "empty"
      ? "text-tennis-gray-dark"
      : "text-tennis-green";

  const dateObj = day ? new Date(day.date) : new Date();
  const dayOfWeekFull = FULL_DAY_NAMES[dateObj.getDay()];
  const dateLabel = dateObj.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
              setShowAddForm(false);
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
      {view === "day" && day && (
        <>
          {/* Day Navigator */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              disabled={isFirst}
              className="px-3 py-2 rounded-lg text-[13px] font-semibold bg-tennis-gray text-tennis-gray-dark hover:bg-gray-200 disabled:opacity-40 active:scale-95 min-h-[44px] transition-all"
            >
              ◀
            </button>

            <div className="flex-1 bg-white border-2 border-tennis-green rounded-2xl px-4 py-2.5 text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-[15px] font-bold text-tennis-green">
                  {dayOfWeekFull} {dateLabel}
                </p>
                {isSelectedToday && (
                  <span className="text-[10px] bg-tennis-green text-white px-2 py-0.5 rounded-full font-semibold">
                    วันนี้
                  </span>
                )}
              </div>
              <p className="text-[11px] text-tennis-gray-dark mt-0.5">
                วันที่ {selectedDayIndex + 1} จาก {plan.length} วัน
              </p>
            </div>

            <button
              onClick={handleNextDay}
              disabled={isLast}
              className="px-3 py-2 rounded-lg text-[13px] font-semibold bg-tennis-gray text-tennis-gray-dark hover:bg-gray-200 disabled:opacity-40 active:scale-95 min-h-[44px] transition-all"
            >
              ▶
            </button>
          </div>

          {/* Today shortcut + quick nav strip */}
          <div className="flex items-center gap-2">
            {!isSelectedToday && (
              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-tennis-green text-white hover:bg-tennis-green/90 active:scale-95 min-h-[36px] transition-all flex-shrink-0"
              >
                📍 กลับไปวันนี้
              </button>
            )}
            <div className="flex-1 flex gap-1 overflow-x-auto pb-1">
              {plan.map((d, idx) => {
                const isSel = idx === selectedDayIndex;
                const isDayToday = idx === todayIndex;
                return (
                  <button
                    key={d.date}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      setShowAddForm(false);
                    }}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                      isSel
                        ? "bg-tennis-green text-white shadow-sm"
                        : isDayToday
                        ? "bg-tennis-green-bg text-tennis-green border border-tennis-green/50"
                        : "bg-tennis-gray text-tennis-gray-dark hover:bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Readiness Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-3 space-y-2">
            <p className="text-[12px] font-bold text-tennis-green">
              📋 สรุปวันนี้
            </p>
            <div className="grid grid-cols-2 gap-2">
              <SummaryMetric
                label="โหลดรวม"
                value={
                  totalMinutes > 0
                    ? `${totalHours} ชม. ${remainMins} นาที`
                    : "—"
                }
                color={loadLevelColor[loadLevel]}
              />
              <SummaryMetric
                label="กิจกรรม"
                value={`${activityCount} รายการ`}
                color="text-tennis-blue"
              />
              <SummaryMetric
                label="ระดับโหลด"
                value={loadLevelLabel[loadLevel]}
                color={loadLevelColor[loadLevel]}
              />
              <SummaryMetric
                label="ค่าใช้จ่าย"
                value={totalCost > 0 ? `฿${totalCost.toLocaleString()}` : "—"}
                color="text-tennis-clay"
              />
            </div>

            {/* Load bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  loadLevel === "very_heavy"
                    ? "bg-red-500"
                    : loadLevel === "heavy"
                    ? "bg-red-400"
                    : loadLevel === "balanced"
                    ? "bg-tennis-yellow"
                    : loadLevel === "light"
                    ? "bg-blue-400"
                    : "bg-gray-300"
                }`}
                style={{
                  width: `${Math.min((totalMinutes / 600) * 100, 100)}%`,
                }}
              />
            </div>

            {hasRecoveryDay && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-2 py-1.5 text-center">
                <p className="text-[10px] text-tennis-green font-semibold">
                  🧘 วันนี้มี Recovery — ร่างกายจะได้ฟื้นตัว
                </p>
              </div>
            )}
            {loadLevel === "very_heavy" && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-2 py-1.5 text-center">
                <p className="text-[10px] text-red-600 font-semibold">
                  ⚠️ วันนี้โหลดหนักมาก (เกิน 10 ชม.) — เสี่ยงบาดเจ็บและล้าสะสม
                </p>
              </div>
            )}
          </div>

          {/* Decision Helper */}
          <div
            className={`rounded-xl border px-3 py-3 text-center space-y-1 ${decisionBorder}`}
          >
            <p className={`text-[12px] font-semibold ${decisionTextColor}`}>
              {decisionText}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="py-3 rounded-xl text-[13px] font-bold bg-tennis-green text-white hover:bg-tennis-green/90 active:scale-[0.98] min-h-[48px] transition-all shadow-sm"
            >
              ➕ เพิ่มกิจกรรม
            </button>
            <button
              onClick={() => {
                // Guide user to today tab for entry
              }}
              className="py-3 rounded-xl text-[13px] font-bold bg-tennis-yellow text-gray-800 hover:bg-tennis-yellow/80 active:scale-[0.98] min-h-[48px] transition-all shadow-sm"
              title="ไปที่แท็บ วันนี้ → บันทึก"
            >
              ✏️ บันทึกผลวันนี้
            </button>
            <button
              onClick={() => {
                // Guide user to notes tab
              }}
              className="col-span-2 py-3 rounded-xl text-[13px] font-bold bg-tennis-blue text-white hover:bg-tennis-blue/90 active:scale-[0.98] min-h-[48px] transition-all shadow-sm"
              title="ไปที่แท็บ Notes"
            >
              📝 เพิ่ม Private Note
            </button>
          </div>

          {/* Add activity form */}
          {showAddForm && (
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
                    style={
                      newType === key
                        ? { backgroundColor: ACTIVITY_COLORS[key]?.bg }
                        : {}
                    }
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
                    <option key={m} value={m}>
                      {m} นาที
                    </option>
                  ))}
                </select>
                <select
                  value={newPriority}
                  onChange={(e) =>
                    setNewPriority(e.target.value as PlanPriority)
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
                  onClick={handleAddActivity}
                  disabled={!newTitle.trim()}
                  className="flex-1 py-2 rounded-lg text-[12px] font-semibold bg-tennis-green text-white disabled:bg-tennis-gray disabled:text-tennis-gray-dark min-h-[40px] active:scale-[0.98] transition-all"
                >
                  ✅ เพิ่มกิจกรรม
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTitle("");
                  }}
                  className="py-2 px-4 rounded-lg text-[12px] text-tennis-gray-dark hover:bg-gray-200 min-h-[40px] active:scale-95"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          {/* Today's Activities */}
          <div className="space-y-2">
            <p className="text-[12px] font-bold text-tennis-green">
              🎯 กิจกรรมวันนี้
            </p>

            {day.activities.length === 0 && extraActivities.length === 0 ? (
              /* Empty state */
              <div className="bg-tennis-gray rounded-2xl px-4 py-5 text-center space-y-2">
                <span className="text-2xl">📭</span>
                <p className="text-[13px] font-semibold text-tennis-gray-dark">
                  ยังไม่มีแผนของวันนี้
                </p>
                <p className="text-[11px] text-tennis-gray-dark leading-snug">
                  เพิ่มกิจกรรม หรือกำหนดให้เป็นวันพักก็ได้
                </p>
              </div>
            ) : (
              <>
                {/* Legacy activities */}
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2.5"
                  >
                    <div
                      className="w-2 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: act.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold">
                        {ACTIVITY_EMOJI[act.type] || ""} {act.label}
                      </p>
                      <p className="text-[11px] text-tennis-gray-dark mt-0.5">
                        {act.startTime} – {act.endTime}
                        {act.durationMinutes && (
                          <span> · {act.durationMinutes} นาที</span>
                        )}
                        {act.venue && <span> · {act.venue}</span>}
                      </p>
                      {act.note && (
                        <p className="text-[10px] text-tennis-gray-dark mt-0.5 italic">
                          💬 {act.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Plan activities */}
                {extraActivities.map((pa) => (
                  <div
                    key={pa.id}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5"
                    style={{
                      borderLeft: `3px solid ${
                        ACTIVITY_COLORS[pa.type]?.bg || "#ccc"
                      }`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0 mt-0.5">
                        {ACTIVITY_EMOJI[pa.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-[13px] font-semibold">
                            {pa.title}
                          </p>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${priorityConfig[pa.priority].bg} ${priorityConfig[pa.priority].text}`}
                          >
                            {priorityConfig[pa.priority].label}
                          </span>
                        </div>
                        <p className="text-[11px] text-tennis-gray-dark mt-0.5">
                          {pa.durationMinutes} นาที
                          <span className="mx-1">·</span>
                          {ACTIVITY_LABELS[pa.type]}
                          {pa.costEstimate > 0 && (
                            <>
                              <span className="mx-1">·</span>
                              <span className="text-tennis-clay font-semibold">
                                ฿{pa.costEstimate.toLocaleString()}
                              </span>
                            </>
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
                  </div>
                ))}
              </>
            )}
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
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <div>
                <p className="text-[14px] font-bold text-tennis-green">
                  สรุปสัปดาห์
                </p>
                <p className="text-[10px] text-tennis-gray-dark">
                  สำหรับการตัดสินใจของนักกีฬาและผู้ปกครอง
                </p>
              </div>
            </div>

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
                label="ค่าใช้จ่ายประมาณ"
                value={`฿${weekSummary.totalCost.toLocaleString()}`}
                color="text-tennis-clay"
              />
            </div>

            {/* Decision helper verdict */}
            <div
              className={`rounded-xl px-3 py-3 text-center space-y-1 ${
                weekSummary.balanced
                  ? "bg-tennis-green-bg border border-tennis-green/30"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-[13px] font-bold ${
                  weekSummary.balanced
                    ? "text-tennis-green"
                    : "text-red-600"
                }`}
              >
                {weekSummary.balanced ? "✅ " : "⚠️ "}
                {weekSummary.recommendation}
              </p>
              {weekSummary.balanced ? (
                <p className="text-[10px] text-tennis-gray-dark leading-snug">
                  จำนวนวันหนักและ recovery อยู่ในเกณฑ์เหมาะสม —{" "}
                  นักกีฬาพร้อมซ้อมต่อเนื่อง
                </p>
              ) : (
                <p className="text-[10px] text-red-500 leading-snug">
                  {weekSummary.intenseDays > 3
                    ? "มีวันโหลดหนักมากเกินไป "
                    : ""}
                  {weekSummary.recoveryDays < 1
                    ? "ไม่มีวัน recovery เลย "
                    : ""}
                  — เสี่ยงล้าและบาดเจ็บ ควรปรับแผนก่อนเริ่มสัปดาห์
                </p>
              )}
            </div>
          </div>

          {/* 7 Day Cards */}
          <div className="space-y-2">
            {weekDays.map((weekDay) => {
              const wTotalMinutes = getDayTotalMinutes(weekDay.date);
              const wDayCost = getDayCost(weekDay.date);
              const wExtra = getDayPlanActivities(weekDay.date);
              const wTotalHours = Math.floor(wTotalMinutes / 60);
              const wRemainMins = wTotalMinutes % 60;
              const wDateObj = new Date(weekDay.date);
              const wDayOfWeek = FULL_DAY_NAMES[wDateObj.getDay()];
              const wDateLabel = wDateObj.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              });
              const wIsToday =
                wDateObj.toDateString() === new Date().toDateString();
              const wIsRest =
                weekDay.activities.length === 0 &&
                wExtra.length === 0;
              const wIsHeavy = wTotalMinutes > 300;
              const wIsLight = wTotalMinutes > 0 && wTotalMinutes <= 120;
              const wIsMedium = wTotalMinutes > 120 && wTotalMinutes <= 300;
              const wIsRecovery =
                weekDay.activities.some((a) => a.type === "recovery") ||
                wExtra.some((pa) => pa.type === "recovery");

              const loadPercent = Math.min((wTotalMinutes / 600) * 100, 100);

              return (
                <div
                  key={weekDay.date}
                  className={`rounded-xl border-2 px-3 py-2.5 ${
                    wIsToday
                      ? "border-tennis-green bg-white shadow-md"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[13px] font-bold ${
                          wIsToday ? "text-tennis-green" : ""
                        }`}
                      >
                        {wDayOfWeek}
                      </span>
                      <span className="text-[11px] text-tennis-gray-dark">
                        {wDateLabel}
                      </span>
                      {wIsToday && (
                        <span className="text-[9px] bg-tennis-green text-white px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                          วันนี้
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!wIsRest && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            wIsHeavy
                              ? "bg-red-50 text-red-500"
                              : wIsMedium
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {wIsHeavy ? "หนัก" : wIsMedium ? "ปานกลาง" : "เบา"}
                        </span>
                      )}
                      {wIsRecovery && (
                        <span className="text-[9px] bg-green-50 text-tennis-green px-1.5 py-0.5 rounded-full font-semibold">
                          🧘 Recovery
                        </span>
                      )}
                      {wIsRest && (
                        <span className="text-[9px] bg-gray-100 text-tennis-gray-dark px-1.5 py-0.5 rounded-full font-semibold">
                          😴 พัก
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {weekDay.activities.map((act) => (
                      <span
                        key={act.id}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: act.color }}
                      >
                        {ACTIVITY_EMOJI[act.type]} {act.label}
                      </span>
                    ))}
                    {wExtra.map((pa) => (
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

                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        wIsHeavy
                          ? "bg-red-400"
                          : wIsMedium
                          ? "bg-tennis-yellow"
                          : wIsLight
                          ? "bg-blue-400"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-tennis-gray-dark">
                      {wTotalMinutes > 0
                        ? `${wTotalHours} ชม. ${wRemainMins} นาที`
                        : "ไม่มีโหลด"}
                      {wIsHeavy && (
                        <span className="ml-1 text-red-500 font-semibold">
                          ⚠️ เสี่ยงล้า
                        </span>
                      )}
                    </span>
                    {wDayCost > 0 && (
                      <span className="text-tennis-clay font-semibold">
                        ฿{wDayCost.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!weekSummary.balanced && (
            <div className="bg-tennis-yellow-light border border-tennis-yellow rounded-xl px-3 py-3 space-y-1.5">
              <p className="text-[12px] font-bold text-yellow-800">
                💡 คำแนะนำสำหรับผู้ปกครอง
              </p>
              <ul className="text-[11px] text-yellow-700 space-y-1 list-disc list-inside">
                {weekSummary.intenseDays > 3 && (
                  <li>ลดวันที่โหลดเกิน 5 ชม. ลงเหลืออย่างน้อย 1–2 วัน</li>
                )}
                {weekSummary.recoveryDays < 1 && (
                  <li>เพิ่มวัน Recovery อย่างน้อย 1 วัน เพื่อให้ร่างกายฟื้นตัว</li>
                )}
                <li>ตรวจสอบค่าใช้จ่ายรวม — ฿
                  {weekSummary.totalCost.toLocaleString()} ในสัปดาห์นี้</li>
                <li>ปรึกษาโค้ชก่อนปรับแผนถ้าใกล้ถึงทัวร์นาเมนต์</li>
              </ul>
            </div>
          )}

          {weekSummary.balanced && (
            <div className="bg-tennis-green-bg border border-tennis-green/20 rounded-xl px-3 py-3 text-center">
              <p className="text-[11px] text-tennis-green font-semibold">
                ✅ การวางแผนสัปดาห์นี้ดูดี — นักกีฬามีทั้งโหลดซ้อมและพักฟื้นที่สมดุล
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
                  {group.days.map((gd) => {
                    const mins = getDayTotalMinutes(gd.date);
                    const gdDateObj = new Date(gd.date);
                    const barH = Math.min(
                      Math.max(Math.round(mins / 30), 1),
                      12
                    );
                    const isHeavy = mins > 300;
                    return (
                      <div
                        key={gd.date}
                        className="flex flex-col items-center gap-0.5"
                        title={`${gdDateObj.toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}: ${Math.round(mins / 60)} ชม.`}
                      >
                        <span className="text-[9px] text-tennis-gray-dark">
                          {gdDateObj.getDate()}
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

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, mi) => {
              const monthName = new Date(2026, mi, 1).toLocaleDateString(
                "th-TH",
                { month: "long" }
              );
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