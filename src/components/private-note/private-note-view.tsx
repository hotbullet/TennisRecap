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
  private: "bg-purple-100 text-purple-700 border-purple-200",
  "share-with-parents": "bg-tennis-green-bg text-tennis-green border-tennis-green-light",
  "share-with-coach": "bg-tennis-blue-light text-tennis-blue border-tennis-blue-light",
  "summary-share": "bg-tennis-yellow-light text-tennis-clay border-tennis-yellow",
};

export default function PrivateNoteView({ notes, onAddNote }: PrivateNoteViewProps) {
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
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-tennis-green">📝 Private Note</h2>
        <button
          onClick={() => setShowNewNote(!showNewNote)}
          className="bg-tennis-green text-white px-3 py-2 rounded-xl text-sm font-medium min-h-[44px]"
        >
          {showNewNote ? "✕ ยกเลิก" : "+ เขียนใหม่"}
        </button>
      </div>

      {/* Helper Text */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3">
        <p className="text-xs text-purple-700">
          ยังไม่พร้อมแชร์ก็ได้ ที่นี่คือพื้นที่ปลอดภัยของนักกีฬา
        </p>
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <input
            type="text"
            placeholder="หัวข้อ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-tennis-green"
          />
          <textarea
            placeholder="เขียนสิ่งที่อยู่ในใจ..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-tennis-green resize-none"
          />
          <div className="flex flex-wrap gap-2">
            {(Object.entries(visibilityLabels) as [VisibilityMode, string][]).map(
              ([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setVisibility(mode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    visibility === mode
                      ? visibilityColors[mode]
                      : "bg-tennis-gray text-tennis-gray-dark border-transparent"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="w-full py-2 rounded-xl text-sm font-medium bg-tennis-green text-white disabled:bg-tennis-gray disabled:text-tennis-gray-dark min-h-[44px]"
          >
            บันทึก
          </button>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`border rounded-2xl p-4 ${
              note.visibility === "private"
                ? "border-purple-200 bg-purple-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm">{note.title}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  visibilityColors[note.visibility]
                }`}
              >
                {visibilityLabels[note.visibility]}
              </span>
            </div>
            <p className="text-sm text-tennis-gray-dark whitespace-pre-wrap">
              {note.content}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-tennis-gray px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-tennis-gray-dark">
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
    </div>
  );
}