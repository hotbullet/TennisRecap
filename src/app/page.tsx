"use client";

import { useState, useCallback } from "react";
import type { TabId, CheckInChip, PrivateNote } from "@/lib/types";
import BottomNav from "@/components/app-shell/bottom-nav";
import TodayDashboard from "@/components/today/today-dashboard";
import TimelineView from "@/components/timeline/timeline-view";
import FamilyPlanRoom from "@/components/family/family-plan-room";
import InvestmentView from "@/components/investment/investment-view";
import PrivateNoteView from "@/components/private-note/private-note-view";
import {
  todayData,
  fourteenDayPlan,
  proposalData,
  investmentCosts,
  investmentValues,
  privateNotes as initialPrivateNotes,
} from "@/lib/mock-data";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const [notes, setNotes] = useState<PrivateNote[]>(initialPrivateNotes);

  const handleCheckIn = useCallback((chip: CheckInChip) => {
    // In a real app this would update state/mock data
    // For MVP mock, just acknowledge the tap
  }, []);

  const handleSaveDecision = useCallback((planId: "A" | "B" | "C") => {
    // In a real app this would persist the decision
    // For MVP mock, just acknowledge the save
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

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 bg-tennis-green text-white px-4 py-3 shadow-md">
        <h1 className="text-lg font-bold text-center">🎾 TennisRecap</h1>
      </header>

      {activeTab === "today" && (
        <TodayDashboard data={todayData} onCheckIn={handleCheckIn} />
      )}
      {activeTab === "timeline" && (
        <TimelineView plan={fourteenDayPlan} />
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

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}