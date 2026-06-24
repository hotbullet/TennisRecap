"use client";

import { useState } from "react";
import type { PrivateNote, VisibilityMode } from "@/lib/types";

interface PrivateNoteViewProps {
  notes: PrivateNote[];
  onAddNote: (note: Omit<PrivateNote, "id" | "createdAt" | "updatedAt">) => void;
}

const visibilityLabels: Record<VisibilityMode, string> = {
  private: "🔒 Private",
  "share-with-parents": "👨‍👩‍👧 แชร์กับพ่อแม่",
  "share-with-coach": "🎾 แชร์กับโค้ช",
  "summary-share": "📋 สรุปให้แชร์",
};

const visibilityColors: Record<VisibilityMode, string> = {
  private:
    "bg-purple-100 text-purple-700 border-purple-200",
  "share-with-parents":
    "bg-tennis-green-bg text-tennis-green border-tennis-green-light",
  "share-with-coach":
    "bg-tennis-blue-light text-tennis-blue border-tennis-blue-light",
  "summary-share":
    "bg-tennis-yellow-light text-tennis-clay border-tennis-yellow",
};

export default function PrivateNoteView({
  notes,
  onAddNote,
}: PrivateNoteViewProps) {
  const [showNewNote, setShowNewNote] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<VisibilityMode>("private");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onAddNote({
      title: title.trim(),
      content: content.trim(),
      visibility,
      tags: [],
    });
    setTitle("");
    setContent("");
    setVisibility("private");
    setShowNewNote(false);
  };

  return (
    <div className="px-3 py-3 space-y-3 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-tennis-green">📝 Private Note</h2>
        <button
          onClick={() => setShowNewNote(!showNewNote)}
          className="bg-tennis-green text-white px-3 py-2 rounded-xl text-[13px] font-semibold min-h-[44px] active:scale-95 transition-transform"
        >
          {showNewNote ? "✕ ยกเลิก" : "+ เขียนใหม่"}
        </button>
      </div>

      {/* Helper Text */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl px-3 py-2.5 text-center">
        <p className="text-[11px] text-purple-700 leading-snug">
          🔐 ยังไม่พร้อมแชร์ก็ได้ ที่นี่คือพื้นที่ปลอดภัยของนักกีฬา
        </p>
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <div className="bg-white border border-gray-200 rounded-2xl p-3 space-y-2.5">
          <input
            type="text"
            placeholder="หัวข้อ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 focus:border-tennis-green placeholder:text-gray-400"
            autoFocus
          />
          <textarea
            placeholder="เขียนสิ่งที่อยู่ในใจ..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 focus:border-tennis-green resize-none placeholder:text-gray-400"
          />
          <div className="flex flex-wrap gap-1.5">
            {(
              Object.entries(visibilityLabels) as [VisibilityMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setVisibility(mode)}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all active:scale-95 ${
                  visibility === mode
                    ? visibilityColors[mode]
                    : "bg-tennis-gray text-tennis-gray-dark border-transparent hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-tennis-green text-white disabled:bg-tennis-gray disabled:text-tennis-gray-dark min-h-[44px] active:scale-[0.98] transition-all"
          >
            📝 บันทึก
          </button>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-2xl mb-2">📝</p>
          <p className="text-sm text-tennis-gray-dark font-medium">
            ยังไม่มีบันทึก
          </p>
          <p className="text-[11px] text-tennis-gray-dark mt-1">
            กด + เขียนใหม่ เพื่อเริ่มต้น
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`border rounded-2xl px-3 py-3 ${
                note.visibility === "private"
                  ? "border-purple-200 bg-purple-50/50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-1.5 gap-2">
                <h3 className="font-bold text-[13px] leading-snug flex-1 min-w-0">
                  {note.title}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap ${
                    visibilityColors[note.visibility]
                  }`}
                >
                  {visibilityLabels[note.visibility]}
                </span>
              </div>
              <p className="text-[13px] text-tennis-gray-dark whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {note.tags.length > 0 ? (
                    note.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-tennis-gray px-2 py-0.5 rounded-full text-tennis-gray-dark"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-tennis-gray-dark/50">
                      ไม่มีแท็ก
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-tennis-gray-dark">
                  {new Date(note.updatedAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}