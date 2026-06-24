"use client";

import type { TodayData, CheckInChip } from "@/lib/types";

interface TodayDashboardProps {
  data: TodayData;
  onCheckIn: (chip: CheckInChip) => void;
}

export default function TodayDashboard({ data, onCheckIn }: TodayDashboardProps) {
  const { athlete, nextTournament, readiness, plan } = data;

  const daysUntil = Math.max(
    0,
    Math.ceil(
      (new Date(nextTournament.startDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const allChips: CheckInChip[] = [
    "ซ้อมดี",
    "ล้า",
    "ร้อน",
    "บอลใหม่",
    "สมาธิหลุด",
    "มั่นใจ",
  ];

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      {/* Athlete Profile — compact for 375px */}
      <div className="bg-tennis-green-bg rounded-2xl px-3 py-3 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full bg-tennis-green flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
          aria-label={athlete.name}
        >
          {athlete.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-base text-tennis-green leading-tight">
            {athlete.name}
          </h2>
          <p className="text-xs text-tennis-gray-dark leading-tight">
            {athlete.level} &middot; {athlete.age} ปี
          </p>
          <p className="text-[11px] text-tennis-gray-dark truncate leading-tight">
            🎯 {athlete.primaryGoal}
          </p>
        </div>
      </div>

      {/* Tournament Countdown — tighter padding */}
      <div className="bg-tennis-blue-light rounded-2xl px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-tennis-blue font-semibold uppercase tracking-wide">
              รายการต่อไป
            </p>
            <p className="font-bold text-sm text-tennis-blue truncate mt-0.5">
              {nextTournament.name}
            </p>
            <p className="text-[11px] text-tennis-gray-dark truncate mt-0.5">
              {nextTournament.venue}
            </p>
          </div>
          <div className="bg-tennis-blue text-white rounded-xl px-3 py-2.5 text-center min-w-[64px] flex-shrink-0">
            <p className="text-2xl font-bold leading-none">{daysUntil}</p>
            <p className="text-[10px] mt-0.5 leading-none">วัน</p>
          </div>
        </div>
      </div>

      {/* Readiness Score — more compact */}
      <div className="bg-tennis-white border border-gray-200 rounded-2xl px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="5"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#2e7d32"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(readiness.score / 100) * 176} 176`}
              />
            </svg>
            <span className="absolute text-sm font-bold text-tennis-green leading-none">
              {readiness.score}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">ความพร้อมวันนี้</p>
            <p className="text-xs text-tennis-gray-dark leading-tight mt-0.5">
              {readiness.mood} &middot; {readiness.energy}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Check-in Chips — increase gap, ensure wrapping works at 375px */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          เช็คอินเร็ว
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allChips.map((chip) => {
            const active = readiness.checkIns.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => onCheckIn(chip)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 min-h-[40px] ${
                  active
                    ? "bg-tennis-green text-white shadow-sm"
                    : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-green-light active:bg-tennis-green-light"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Plan — better activity blocks */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          แผนวันนี้
        </p>
        <div className="space-y-1.5">
          {plan.activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-2.5 bg-tennis-gray rounded-xl px-3 py-2.5"
            >
              <div
                className="w-1.5 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: activity.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] leading-tight">
                  {activity.label}
                </p>
                <div className="flex flex-wrap gap-x-2 mt-0.5">
                  {activity.venue && (
                    <p className="text-[11px] text-tennis-gray-dark leading-tight">
                      📍 {activity.venue}
                    </p>
                  )}
                  {activity.note && (
                    <p className="text-[11px] text-tennis-gray-dark italic leading-tight">
                      💬 {activity.note}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-semibold leading-tight">
                  {activity.startTime}
                </p>
                <p className="text-[11px] text-tennis-gray-dark leading-tight">
                  {activity.endTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards — clearer section headers, tight grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-tennis-green-bg rounded-2xl px-3 py-3">
          <p className="text-[11px] font-bold text-tennis-green uppercase tracking-wide mb-1.5">
            ✅ ทำได้ดี
          </p>
          <ul className="space-y-1">
            {readiness.goodPoints.map((point, i) => (
              <li
                key={i}
                className="text-[12px] text-tennis-gray-dark leading-snug"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-tennis-yellow-light rounded-2xl px-3 py-3">
          <p className="text-[11px] font-bold text-tennis-clay uppercase tracking-wide mb-1.5">
            🎯 ควรพัฒนา
          </p>
          <ul className="space-y-1">
            {readiness.improvePoints.map((point, i) => (
              <li
                key={i}
                className="text-[12px] text-tennis-gray-dark leading-snug"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}