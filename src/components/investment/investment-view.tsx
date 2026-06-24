"use client";

import type { CostItem, InvestmentValue } from "@/lib/types";

interface InvestmentViewProps {
  costs: CostItem[];
  values: InvestmentValue[];
}

export default function InvestmentView({ costs, values }: InvestmentViewProps) {
  const totalBudget = costs.reduce((sum, c) => sum + c.budget, 0);
  const totalActual = costs.reduce((sum, c) => sum + c.actual, 0);

  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-lg font-bold text-tennis-green">📊 การลงทุน</h2>
      <p className="text-xs text-tennis-gray-dark">
        ลงทุนวันนี้ ได้อะไรกลับมา
      </p>

      {/* Budget vs Actual Summary */}
      <div className="bg-tennis-blue-light rounded-2xl p-4">
        <p className="text-sm font-bold text-tennis-blue mb-2">
          งบประมาณรวม
        </p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold text-tennis-blue">
            ฿{totalActual.toLocaleString()}
          </p>
          <p className="text-sm text-tennis-gray-dark mb-1">
            / ฿{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="mt-2 bg-white rounded-full h-3 overflow-hidden">
          <div
            className="bg-tennis-blue h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, (totalActual / totalBudget) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Cost Categories */}
      <div>
        <p className="text-xs font-medium text-tennis-gray-dark mb-2">
          หมวดหมู่ค่าใช้จ่าย
        </p>
        <div className="space-y-2">
          {costs.map((cost) => {
            const pct = Math.min(100, (cost.actual / cost.budget) * 100);
            const isOver = cost.actual > cost.budget;
            return (
              <div key={cost.id} className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium">{cost.label}</p>
                    <p className="text-xs text-tennis-gray-dark">{cost.category}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${isOver ? "text-red-500" : "text-tennis-green"}`}
                    >
                      ฿{cost.actual.toLocaleString()}
                    </p>
                    <p className="text-xs text-tennis-gray-dark">
                      / ฿{cost.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-tennis-gray rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isOver ? "bg-red-400" : "bg-tennis-green"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Returned */}
      <div>
        <p className="text-xs font-medium text-tennis-gray-dark mb-2">
          ได้อะไรกลับมา
        </p>
        <div className="grid grid-cols-2 gap-2">
          {values.map((value) => (
            <div
              key={value.id}
              className="bg-tennis-green-bg rounded-2xl p-3 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-tennis-green font-bold">
                  {value.category}
                </p>
                <p className="text-xs text-tennis-gray-dark mt-1">
                  {value.description}
                </p>
              </div>
              <p className="text-sm font-bold text-tennis-green mt-2">
                {value.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}