"use client";

import type { CostItem, InvestmentValue } from "@/lib/types";

interface InvestmentViewProps {
  costs: CostItem[];
  values: InvestmentValue[];
}

const VALUE_EMOJI: Record<string, string> = {
  เวลา: "⏱️",
  พลังงาน: "⚡",
  เงิน: "💰",
  "บทเรียนที่ได้": "📚",
};

export default function InvestmentView({ costs, values }: InvestmentViewProps) {
  const totalBudget = costs.reduce((sum, c) => sum + c.budget, 0);
  const totalActual = costs.reduce((sum, c) => sum + c.actual, 0);
  const totalPct = Math.min(100, Math.round((totalActual / totalBudget) * 100));

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      <div>
        <h2 className="text-lg font-bold text-tennis-green">📊 การลงทุน</h2>
        <p className="text-[11px] text-tennis-gray-dark mt-0.5">
          ลงทุนวันนี้ ได้อะไรกลับมา
        </p>
      </div>

      {/* Budget vs Actual Summary */}
      <div className="bg-tennis-blue-light rounded-2xl px-3 py-3">
        <p className="text-[11px] text-tennis-blue font-semibold uppercase tracking-wide">
          งบประมาณรวม
        </p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <p className="text-2xl font-bold text-tennis-blue leading-none">
            ฿{totalActual.toLocaleString()}
          </p>
          <p className="text-xs text-tennis-gray-dark">
            / ฿{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-tennis-blue h-full rounded-full transition-all duration-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-tennis-blue min-w-[36px] text-right">
            {totalPct}%
          </span>
        </div>
      </div>

      {/* Cost Categories */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          หมวดหมู่ค่าใช้จ่าย
        </p>
        <div className="space-y-1.5">
          {costs.map((cost) => {
            const pct = Math.min(100, Math.round((cost.actual / cost.budget) * 100));
            const isOver = cost.actual > cost.budget;
            return (
              <div
                key={cost.id}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-[13px] font-semibold leading-tight truncate">
                      {cost.label}
                    </p>
                    <p className="text-[10px] text-tennis-gray-dark leading-tight">
                      {cost.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-[13px] font-bold leading-tight ${
                        isOver ? "text-red-500" : "text-tennis-green"
                      }`}
                    >
                      ฿{cost.actual.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-tennis-gray-dark leading-tight">
                      / ฿{cost.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 bg-tennis-gray rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? "bg-red-400" : "bg-tennis-green"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold min-w-[28px] text-right ${
                      isOver ? "text-red-500" : "text-tennis-gray-dark"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Returned */}
      <div>
        <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide mb-1.5 px-0.5">
          ได้อะไรกลับมา
        </p>
        <div className="grid grid-cols-2 gap-2">
          {values.map((value) => (
            <div
              key={value.id}
              className="bg-tennis-green-bg rounded-2xl px-3 py-3 flex flex-col"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-base leading-none">
                  {VALUE_EMOJI[value.category] || "📌"}
                </span>
                <p className="text-[11px] text-tennis-green font-bold uppercase">
                  {value.category}
                </p>
              </div>
              <p className="text-[11px] text-tennis-gray-dark leading-snug mb-2 flex-1">
                {value.description}
              </p>
              <p className="text-[13px] font-bold text-tennis-green leading-tight">
                {value.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}