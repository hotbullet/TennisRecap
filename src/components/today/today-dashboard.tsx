"use client";

import type { TodayData, CheckInChip } from "@/lib/types";

interface TodayDashboardProps {
  data: TodayData;
  onCheckIn: (chip: CheckInChip) => void;
}

export default function TodayDashboard({ data, onCheckIn }: TodayDashboardProps) {
  const { athlete, nextTournament, readiness, plan } = data;

  const daysUntil = Math.ceil(
    (new Date(nextTournament.startDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
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
    <div className="p-4 space-y-4 pb-20">
      {/* Athlete Profile */}
      <div className="bg-tennis-green-bg rounded-2xl p-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-tennis-green flex items-center justify-center text-white text-2xl font-bold">
          {athlete.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-lg text-tennis-green">{athlete.name}</h2>
          <p className="text-sm text-tennis-gray-dark">
            {athlete.level} • {athlete.age} ปี
          </p>
          <p className="text-xs text-tennis-gray-dark">{athlete.primaryGoal}</p>
        </div>
      </div>

      {/* Tournament Countdown */}
      <div className="bg-tennis-blue-light rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-tennis-blue font-medium">รายการต่อไป</p>
            <p className="font-bold text-sm text-tennis-blue">{nextTournament.name}</p>
            <p className="text-xs text-tennis-gray-dark mt-1">{nextTournament.venue}</p>
          </div>
          <div className="bg-tennis-blue text-white rounded-xl px-4 py-3 text-center min-w-[72px]">
            <p className="text-2xl font-bold">{daysUntil}</p>
            <p className="text-xs">วัน</p>
          </div>
        </div>
      </div>

      {/* Readiness Score */}
      <div className="bg-tennis-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#2e7d32"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(readiness.score / 100) * 176} 176`}
              />
            </svg>
            <span className="absolute text-lg font-bold text-tennis-green">
              {readiness.score}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">ความพร้อมวันนี้</p>
            <p className="text-sm text-tennis-gray-dark">
              {readiness.mood} • {readiness.energy}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Check-in Chips */}
      <div>
        <p className="text-xs font-medium text-tennis-gray-dark mb-2">
          เช็คอินเร็ว
        </p>
        <div className="flex flex-wrap gap-2">
          {allChips.map((chip) => {
            const active = readiness.checkIns.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => onCheckIn(chip)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                  active
                    ? "bg-tennis-green text-white"
                    : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-green-light"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Plan */}
      <div>
        <p className="text-xs font-medium text-tennis-gray-dark mb-2">
          แผนวันนี้
        </p>
        <div className="space-y-2">
          {plan.activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 bg-tennis-gray rounded-xl p-3"
            >
              <div
                className="w-2 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: activity.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.label}</p>
                {activity.venue && (
                  <p className="text-xs text-tennis-gray-dark">{activity.venue}</p>
                )}
                {activity.note && (
                  <p className="text-xs text-tennis-gray-dark italic">{activity.note}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium">{activity.startTime}</p>
                <p className="text-xs text-tennis-gray-dark">
                  {activity.endTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-tennis-green-bg rounded-2xl p-3">
          <p className="text-sm font-bold text-tennis-green mb-2">✅ ทำได้ดี</p>
          <ul className="space-y-1">
            {readiness.goodPoints.map((point, i) => (
              <li key={i} className="text-xs text-tennis-gray-dark">
                • {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-tennis-yellow-light rounded-2xl p-3">
          <p className="text-sm font-bold text-tennis-clay mb-2">🎯 ควรพัฒนา</p>
          <ul className="space-y-1">
            {readiness.improvePoints.map((point, i) => (
              <li key={i} className="text-xs text-tennis-gray-dark">
                • {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}