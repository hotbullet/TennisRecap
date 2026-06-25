"use client";

import type { StrengthWeaknessInsight } from "@/lib/types";

interface StrengthWeaknessViewProps {
  insights: StrengthWeaknessInsight[];
}

const categoryConfig: Record<
  StrengthWeaknessInsight["category"],
  { badge: string; bg: string; border: string; text: string; icon: string }
> = {
  strength: {
    badge: "จุดแข็ง",
    bg: "bg-tennis-green-bg",
    border: "border-tennis-green-light",
    text: "text-tennis-green",
    icon: "✅",
  },
  weakness: {
    badge: "ต้องแก้",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-tennis-clay",
    icon: "🎯",
  },
  trigger: {
    badge: "สิ่งกระตุ้น",
    bg: "bg-tennis-yellow-light",
    border: "border-tennis-yellow",
    text: "text-yellow-700",
    icon: "⚡",
  },
  condition: {
    badge: "สภาพ",
    bg: "bg-tennis-blue-light",
    border: "border-blue-200",
    text: "text-tennis-blue",
    icon: "🌤️",
  },
};

export default function StrengthWeaknessView({
  insights,
}: StrengthWeaknessViewProps) {
  if (insights.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <p className="text-3xl mb-2">📊</p>
        <p className="text-sm font-semibold text-tennis-gray-dark">
          ยังไม่มีข้อมูลเพียงพอ
        </p>
        <p className="text-[11px] text-tennis-gray-dark mt-1 leading-snug">
          บันทึกการซ้อมหรือแข่งอย่างน้อย 2-3 ครั้ง
          <br />
          เพื่อให้ระบบช่วยวิเคราะห์จุดแข็ง-จุดอ่อน
        </p>
      </div>
    );
  }

  const strengths = insights.filter((i) => i.category === "strength");
  const weaknesses = insights.filter((i) => i.category === "weakness");
  const triggers = insights.filter((i) => i.category === "trigger");
  const conditions = insights.filter((i) => i.category === "condition");

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      <h2 className="text-lg font-bold text-tennis-green">
        📊 จุดแข็ง / จุดที่ต้องแก้
      </h2>

      {/* Top 3 Summary */}
      {(strengths.length > 0 || weaknesses.length > 0 || triggers.length > 0) && (
        <div className="bg-tennis-green-bg rounded-2xl px-3 py-3 space-y-2">
          {strengths.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-tennis-green uppercase tracking-wide mb-1">
                ✅ จุดแข็งที่เห็นบ่อย
              </p>
              <p className="text-[13px] font-semibold text-tennis-green leading-snug">
                {strengths.slice(0, 3).map((s) => s.label).join(", ") || "—"}
              </p>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-tennis-clay uppercase tracking-wide mb-1">
                🎯 จุดที่ต้องแก้ซ้ำ
              </p>
              <p className="text-[13px] font-semibold text-tennis-clay leading-snug">
                {weaknesses.slice(0, 3).map((w) => w.label).join(", ") || "—"}
              </p>
            </div>
          )}
          {triggers.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-yellow-700 uppercase tracking-wide mb-1">
                ⚡ สิ่งกระตุ้นที่เจอบ่อย
              </p>
              <p className="text-[13px] font-semibold text-yellow-700 leading-snug">
                {triggers.slice(0, 3).map((t) => t.label).join(" + ") || "—"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 7-Day Recommendation */}
      {conditions
        .filter((c) => c.label === "คำแนะนำ 7 วัน")
        .map((rec) => (
          <div
            key={rec.label}
            className="bg-tennis-blue-light border border-blue-200 rounded-2xl px-3 py-3"
          >
            <p className="text-[11px] font-bold text-tennis-blue uppercase tracking-wide mb-1">
              💡 คำแนะนำ 7 วัน
            </p>
            <p className="text-[13px] text-tennis-blue font-medium leading-relaxed">
              {rec.recommendation}
            </p>
          </div>
        ))}

      {/* Best/Worst Condition Cards */}
      {conditions.filter((c) => c.label !== "คำแนะนำ 7 วัน").length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
            🌤️ สภาพที่ดีที่สุด / ท้าทายที่สุด
          </p>
          <div className="space-y-1.5">
            {conditions
              .filter((c) => c.label !== "คำแนะนำ 7 วัน")
              .map((c) => {
                const config = categoryConfig[c.category];
                const isBest = c.label.includes("ดีที่สุด");
                return (
                  <div
                    key={c.label}
                    className={`${config.bg} border ${config.border} rounded-xl px-3 py-2.5`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">
                        {isBest ? "🌟" : "⚠️"}
                      </span>
                      <p className={`font-bold text-[13px] ${config.text} leading-tight`}>
                        {c.label}
                      </p>
                    </div>
                    <p className="text-[11px] text-tennis-gray-dark leading-snug ml-6">
                      {c.explanation}
                    </p>
                    <p className="text-[11px] font-semibold text-tennis-green leading-snug mt-1 ml-6">
                      → {c.recommendation}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Detailed Insights */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          📋 รายละเอียดทั้งหมด
        </p>
        <div className="space-y-2">
          {insights
            .filter((i) => i.label !== "คำแนะนำ 7 วัน")
            .map((insight, idx) => {
              const config = categoryConfig[insight.category];
              return (
                <div
                  key={`${insight.label}-${idx}`}
                  className={`${config.bg} border ${config.border} rounded-2xl px-3 py-3`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm flex-shrink-0">{config.icon}</span>
                      <p className={`font-bold text-[13px] ${config.text} leading-tight truncate`}>
                        {insight.label}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                        config.bg
                      } border ${config.border} ${config.text}`}
                    >
                      {config.badge}
                    </span>
                  </div>
                  <p className="text-[12px] text-tennis-gray-dark leading-snug ml-6">
                    {insight.explanation}
                  </p>
                  <p className="text-[12px] font-semibold text-tennis-green leading-snug mt-1 ml-6">
                    → {insight.recommendation}
                  </p>
                  <div className="flex items-center gap-2 mt-2 ml-6">
                    <div className="flex-1 bg-white rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-tennis-green rounded-full transition-all"
                        style={{ width: `${insight.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-tennis-gray-dark font-medium">
                      หลักฐาน {insight.evidenceCount} ครั้ง
                    </span>
                  </div>
                  {insight.relatedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 ml-6">
                      {insight.relatedTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-white/70 px-1.5 py-0.5 rounded-full text-tennis-gray-dark"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Supportive tone footer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[11px] text-tennis-gray-dark italic leading-snug">
          💚 ข้อมูลนี้ช่วยให้เห็นภาพรวม ไม่ใช่การตัดสิน
          <br />
          ทุกการซ้อมคือการเรียนรู้
        </p>
      </div>
    </div>
  );
}