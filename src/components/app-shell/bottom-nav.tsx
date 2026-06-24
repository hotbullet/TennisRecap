"use client";

import type { TabId } from "@/lib/types";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "today", label: "วันนี้", icon: "📋" },
  { id: "timeline", label: "14 วัน", icon: "📅" },
  { id: "family", label: "ครอบครัว", icon: "👨‍👩‍👧" },
  { id: "investment", label: "การลงทุน", icon: "📊" },
  { id: "notes", label: "บันทึก", icon: "📝" },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md bg-tennis-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[48px] min-w-[48px] transition-colors ${
                isActive
                  ? "text-tennis-green border-t-2 border-tennis-green -mt-[2px]"
                  : "text-tennis-gray-dark"
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}