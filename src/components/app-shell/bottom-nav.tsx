"use client";

import type { TabId } from "@/lib/types";

const tabs: {
  id: TabId;
  label: string;
  icon: string;
  activeIcon: string;
}[] = [
  { id: "today", label: "วันนี้", icon: "📋", activeIcon: "📋" },
  { id: "timeline", label: "14 วัน", icon: "📅", activeIcon: "📅" },
  { id: "family", label: "ครอบครัว", icon: "👨‍👩‍👧", activeIcon: "👨‍👩‍👧" },
  { id: "investment", label: "การลงทุน", icon: "📊", activeIcon: "📊" },
  { id: "notes", label: "บันทึก", icon: "📝", activeIcon: "📝" },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md bg-tennis-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-1 h-[64px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              className={`relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[60px] transition-all duration-200 rounded-lg ${
                isActive
                  ? "text-tennis-green scale-105"
                  : "text-tennis-gray-dark hover:text-tennis-green/70 active:scale-95"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-tennis-green rounded-b-full" />
              )}
              <span className="text-[22px] leading-none mb-0.5">
                {tab.icon}
              </span>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}