"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  TabId,
  PrivateNote,
  TrainingEntry,
  PlanActivity,
  StrengthWeaknessInsight,
} from "@/lib/types";
import BottomNav from "@/components/app-shell/bottom-nav";
import TodayDashboard from "@/components/today/today-dashboard";
import PlanCalendarView from "@/components/timeline/plan-calendar-view";
import FamilyPlanRoom from "@/components/family/family-plan-room";
import InvestmentView from "@/components/investment/investment-view";
import PrivateNoteView from "@/components/private-note/private-note-view";
import DailyEntryForm from "@/components/entry/daily-entry-form";
import StrengthWeaknessView from "@/components/insights/strength-weakness-view";
import {
  todayData,
  fourteenDayPlan,
  proposalData,
  investmentCosts,
  investmentValues,
  privateNotes as initialPrivateNotes,
} from "@/lib/mock-data";
import {
  getEntries,
  addEntry,
  getPlanActivities,
  addPlanActivity,
  deletePlanActivity,
  exportSnapshot,
  importSnapshot,
  clearAllData,
} from "@/lib/storage";
import { generateInsights } from "@/lib/insight-engine";
import type { AppSnapshot } from "@/lib/storage";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const [notes, setNotes] = useState<PrivateNote[]>(initialPrivateNotes);

  // ---- Local data state ----
  const [entries, setEntries] = useState<TrainingEntry[]>(getEntries);
  const [planActivities, setPlanActivities] = useState<PlanActivity[]>(getPlanActivities);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // ---- Compute insights ----
  const insights: StrengthWeaknessInsight[] = useMemo(
    () => generateInsights(entries),
    [entries]
  );

  // ---- Entry handlers ----
  const handleAddEntry = useCallback((entry: TrainingEntry) => {
    addEntry(entry);
    setEntries(getEntries());
    setShowEntryForm(false);
  }, []);

  // ---- Plan activity handlers ----
  const handleAddPlanActivity = useCallback((activity: PlanActivity) => {
    addPlanActivity(activity);
    setPlanActivities(getPlanActivities());
  }, []);

  const handleRemovePlanActivity = useCallback((id: string) => {
    deletePlanActivity(id);
    setPlanActivities(getPlanActivities());
  }, []);

  // ---- Legacy handlers ----
  const handleCheckIn = useCallback(() => {
    // MVP: check-in is now handled through the full entry form
  }, []);

  const handleSaveDecision = useCallback(() => {
    // In a real app this would persist the decision
  }, []);

  const handleAddNote = useCallback(
    (note: Omit<PrivateNote, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newNote: PrivateNote = {
        ...note,
        id: `n${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    },
    []
  );

  // ---- Export / Import ----
  const handleExport = useCallback(() => {
    const snapshot = exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tennisrecap-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const snapshot = JSON.parse(ev.target?.result as string) as AppSnapshot;
          importSnapshot(snapshot);
          setEntries(getEntries());
          setPlanActivities(getPlanActivities());
          alert("นำเข้าข้อมูลสำเร็จ ✅");
        } catch {
          alert("ไฟล์ไม่ถูกต้อง ❌");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleClearData = useCallback(() => {
    if (confirm("คุณแน่ใจที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      clearAllData();
      setEntries([]);
      setPlanActivities([]);
    }
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 bg-tennis-green text-white px-4 py-3 shadow-md">
        <h1 className="text-lg font-bold text-center">🎾 TennisRecap</h1>
      </header>

      {/* Data safety banner */}
      <div className="bg-tennis-yellow-light border-b border-tennis-yellow px-3 py-1.5 text-center">
        <p className="text-[10px] text-yellow-800 font-medium">
          ⚠️ ข้อมูลนี้เก็บในเครื่องนี้เท่านั้น ยังไม่ซิงก์ข้ามอุปกรณ์
        </p>
      </div>

      {activeTab === "today" && (
        <div className="pb-20">
          {/* Toggle: Dashboard vs Entry Form vs Insights */}
          <div className="flex gap-1 px-3 pt-2">
            <button
              onClick={() => {
                setShowEntryForm(false);
                setShowInsights(false);
              }}
              className={`flex-1 py-2 rounded-lg text-[12px] font-semibold min-h-[40px] transition-all active:scale-95 ${
                !showEntryForm && !showInsights
                  ? "bg-tennis-green text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark"
              }`}
            >
              📋 ภาพรวม
            </button>
            <button
              onClick={() => {
                setShowEntryForm(true);
                setShowInsights(false);
              }}
              className={`flex-1 py-2 rounded-lg text-[12px] font-semibold min-h-[40px] transition-all active:scale-95 ${
                showEntryForm
                  ? "bg-tennis-green text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark"
              }`}
            >
              ✏️ บันทึก
            </button>
            <button
              onClick={() => {
                setShowEntryForm(false);
                setShowInsights(true);
              }}
              className={`flex-1 py-2 rounded-lg text-[12px] font-semibold min-h-[40px] transition-all active:scale-95 ${
                showInsights
                  ? "bg-tennis-green text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark"
              }`}
            >
              📊 จุดแข็ง/อ่อน
            </button>
          </div>

          {showEntryForm ? (
            <div className="px-3 pt-3">
              <DailyEntryForm
                onAddEntry={handleAddEntry}
                onCancel={() => setShowEntryForm(false)}
              />
            </div>
          ) : showInsights ? (
            <StrengthWeaknessView insights={insights} />
          ) : (
            <>
              <TodayDashboard data={todayData} onCheckIn={handleCheckIn} />

              {/* Recent entries summary */}
              {entries.length > 0 && (
                <div className="px-3 pb-3 space-y-2">
                  <p className="text-[11px] font-semibold text-tennis-gray-dark uppercase tracking-wide px-0.5">
                    📝 บันทึกล่าสุด ({entries.length})
                  </p>
                  {entries.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold leading-tight">
                            {entry.type === "training"
                              ? "🎾 ซ้อม"
                              : entry.type === "match"
                              ? "⚔️ แข่ง"
                              : entry.type === "tournament"
                              ? "🏆 ทัวร์นาเมนต์"
                              : entry.type === "fitness_entry"
                              ? "💪 ฟิตเนส"
                              : "🧘 รีคัฟเวอรี่"}{" "}
                            {new Date(entry.date).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="text-[11px] text-tennis-gray-dark leading-snug mt-0.5">
                            {entry.strengthTags.length > 0 && (
                              <span className="text-tennis-green">
                                ✅ {entry.strengthTags.join(", ")}{" "}
                              </span>
                            )}
                            {entry.weaknessTags.length > 0 && (
                              <span className="text-tennis-clay">
                                🎯 {entry.weaknessTags.join(", ")}
                              </span>
                            )}
                            {entry.strengthTags.length === 0 &&
                              entry.weaknessTags.length === 0 &&
                              "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick link to record entry */}
              {entries.length === 0 && (
                <div className="px-3 pt-1 pb-3">
                  <button
                    onClick={() => setShowEntryForm(true)}
                    className="w-full py-3 rounded-xl text-[13px] font-bold bg-tennis-green text-white hover:bg-tennis-green/90 active:scale-[0.98] min-h-[48px] transition-all shadow-sm"
                  >
                    ✏️ บันทึกข้อมูลวันนี้ครั้งแรก
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "timeline" && (
        <PlanCalendarView
          plan={fourteenDayPlan}
          planActivities={planActivities}
          onAddActivity={handleAddPlanActivity}
          onRemoveActivity={handleRemovePlanActivity}
        />
      )}

      {activeTab === "family" && (
        <FamilyPlanRoom
          proposal={proposalData}
          onSaveDecision={handleSaveDecision}
        />
      )}
      {activeTab === "investment" && (
        <InvestmentView costs={investmentCosts} values={investmentValues} />
      )}
      {activeTab === "notes" && (
        <PrivateNoteView notes={notes} onAddNote={handleAddNote} />
      )}

      {/* Export/Import/Data safety section */}
      <div className="px-3 pb-24 space-y-2">
        <p className="text-[10px] text-tennis-gray-dark text-center pt-1">
          💾 ข้อมูลภายในเครื่อง (localStorage)
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-tennis-blue text-white hover:bg-tennis-blue/90 active:scale-95 min-h-[40px] transition-all shadow-sm"
          >
            📤 Export JSON
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-tennis-gray text-tennis-gray-dark hover:bg-gray-200 active:scale-95 min-h-[40px] transition-all"
          >
            📥 Import JSON
          </button>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 min-h-[40px] transition-all"
          >
            🗑️ ล้างข้อมูล
          </button>
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}