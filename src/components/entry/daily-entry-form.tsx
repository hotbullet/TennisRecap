"use client";

import { useState, useCallback } from "react";
import type { TrainingEntry, EntryType, Mood, Soreness, HeatLevel, BallCondition, OpponentLevel, ResultType, EntryVisibility } from "@/lib/types";

interface DailyEntryFormProps {
  onAddEntry: (entry: TrainingEntry) => void;
  onCancel: () => void;
}

// ---- TAG PRESETS (A–D sections) ----

const typeOptions: { key: EntryType; label: string; emoji: string }[] = [
  { key: "training", label: "ซ้อม", emoji: "🎾" },
  { key: "match", label: "แข่ง", emoji: "⚔️" },
  { key: "tournament", label: "ทัวร์นาเมนต์", emoji: "🏆" },
  { key: "fitness_entry", label: "ฟิตเนส", emoji: "💪" },
  { key: "recovery_entry", label: "รีคัฟเวอรี่", emoji: "🧘" },
];

const conditionChips: string[] = [
  "ร้อน",
  "บอลใหม่",
  "เปลี่ยนยี่ห้อบอล",
  "นอนน้อย",
  "เหนื่อย",
  "เจอรุ่นพี่",
  "โดนนำเร็ว",
  "สมาธิหลุด",
];

const strengthChips: string[] = [
  "เสิร์ฟ",
  "รับเสิร์ฟ",
  "โฟร์แฮนด์",
  "แบ็คแฮนด์",
  "ฟุตเวิร์ก",
  "split step",
  "ใจนิ่ง",
  "เล่นตามแผน",
  "ปรับตัวกับบอล",
];

const weaknessChips: string[] = [
  "สมาธิ",
  "เสิร์ฟเสีย",
  "รีบจบแต้ม",
  "เท้าช้า",
  "กลัวตี",
  "โดนบอลใหม่แล้วหลุด",
  "ร้อนแล้วหลุด",
  "recovery ไม่พอ",
];

const moodOptions: { key: Mood; label: string; emoji: string }[] = [
  { key: "good", label: "ดี", emoji: "🙂" },
  { key: "okay", label: "เฉย ๆ", emoji: "😐" },
  { key: "tired", label: "เหนื่อย", emoji: "😴" },
  { key: "stressed", label: "เครียด", emoji: "😟" },
  { key: "confident", label: "มั่นใจ", emoji: "😤" },
  { key: "frustrated", label: "หงุดหงิด", emoji: "😤" },
];

// ---- COMPONENT ----

export default function DailyEntryForm({ onAddEntry, onCancel }: DailyEntryFormProps) {
  const today = new Date().toISOString().split("T")[0];

  // Core fields
  const [entryType, setEntryType] = useState<EntryType>("training");
  const [date, setDate] = useState(today);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [intensityRpe, setIntensityRpe] = useState(5);
  const [energyBefore, setEnergyBefore] = useState(7);
  const [energyAfter, setEnergyAfter] = useState(6);
  const [mood, setMood] = useState<Mood>("good");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [soreness, setSoreness] = useState<Soreness>("low");
  const [heatLevel, setHeatLevel] = useState<HeatLevel>("normal");
  const [ballCondition, setBallCondition] = useState<BallCondition>("normal");
  const [opponentLevel, setOpponentLevel] = useState<OpponentLevel>("unknown");
  const [resultType, setResultType] = useState<ResultType>("practice_only");
  const [scoreText, setScoreText] = useState("");

  // Tags
  const [strengthTags, setStrengthTags] = useState<string[]>([]);
  const [weaknessTags, setWeaknessTags] = useState<string[]>([]);
  const [triggerTags, setTriggerTags] = useState<string[]>([]);

  // Text notes
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatNeedsWork, setWhatNeedsWork] = useState("");
  const [parentNote, setParentNote] = useState("");
  const [athletePrivateNote, setAthletePrivateNote] = useState("");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");

  const toggleTag = useCallback(
    (tag: string, current: string[], setter: (v: string[]) => void) => {
      if (current.includes(tag)) {
        setter(current.filter((t) => t !== tag));
      } else {
        setter([...current, tag]);
      }
    },
    []
  );

  const handleConditionChip = (chip: string) => {
    const mappings: Record<string, () => void> = {
      ร้อน: () => setHeatLevel((prev) => (prev === "normal" ? "hot" : prev === "hot" ? "very_hot" : "normal")),
      บอลใหม่: () => setBallCondition((prev) => (prev === "new_ball" ? "normal" : "new_ball")),
      เปลี่ยนยี่ห้อบอล: () => setBallCondition((prev) => (prev === "different_brand" ? "normal" : "different_brand")),
      นอนน้อย: () => setSleepQuality((prev) => (prev <= 2 ? 3 : 2)),
      เหนื่อย: () => setSoreness("medium"),
      เจอรุ่นพี่: () => setOpponentLevel((prev) => (prev === "older" ? "unknown" : "older")),
      โดนนำเร็ว: () => toggleTag("โดนนำเร็ว", triggerTags, setTriggerTags),
      สมาธิหลุด: () => toggleTag("สมาธิหลุด", triggerTags, setTriggerTags),
    };

    if (mappings[chip]) {
      mappings[chip]();
    } else {
      toggleTag(chip, triggerTags, setTriggerTags);
    }
  };

  const handleSubmit = () => {
    const entry: TrainingEntry = {
      id: `entry_${Date.now()}`,
      date,
      type: entryType,
      durationMinutes,
      intensityRpe,
      energyBefore,
      energyAfter,
      mood,
      sleepQuality,
      soreness,
      heatLevel,
      ballCondition,
      opponentLevel,
      resultType,
      scoreText: scoreText.trim(),
      focusTags: [],
      strengthTags,
      weaknessTags,
      triggerTags,
      whatWentWell: whatWentWell.trim(),
      whatNeedsWork: whatNeedsWork.trim(),
      parentNote: parentNote.trim(),
      athletePrivateNote: athletePrivateNote.trim(),
      visibility,
    };
    onAddEntry(entry);
  };

  const activeConditions = [
    heatLevel !== "normal" ? heatLevelLabel(heatLevel) : null,
    ballCondition !== "normal" ? ballConditionLabel(ballCondition) : null,
    sleepQuality <= 2 ? "นอนน้อย" : null,
    soreness === "medium" || soreness === "high" ? "เมื่อย" : null,
    opponentLevel === "older" ? "เจอรุ่นพี่" : null,
    ...triggerTags,
  ].filter(Boolean) as string[];

  return (
    <div className="bg-tennis-white border border-gray-200 rounded-2xl p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-tennis-green">📝 บันทึกวันนี้</h3>
        <button
          onClick={onCancel}
          className="text-tennis-gray-dark text-sm px-2 py-1 rounded-lg hover:bg-tennis-gray active:scale-95 min-h-[36px]"
        >
          ✕ ปิด
        </button>
      </div>

      {/* A. วันนี้ทำอะไร */}
      <Section title="A. วันนี้ทำอะไร">
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setEntryType(opt.key)}
              className={`px-3 py-2.5 rounded-xl text-[13px] font-semibold min-h-[48px] transition-all active:scale-95 ${
                entryType === opt.key
                  ? "bg-tennis-green text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-green-light"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 min-h-[44px]"
          />
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 min-h-[44px]"
          >
            {[30, 45, 60, 90, 120, 150, 180, 240, 360].map((m) => (
              <option key={m} value={m}>
                {m >= 60 ? `${m / 60} ชม.` : `${m} นาที`}
                {m >= 60 && m % 60 > 0 ? ` ${m % 60} นาที` : ""}
              </option>
            ))}
          </select>
        </div>
      </Section>

      {/* Intensity + Energy sliders */}
      <Section title="⚡ ระดับความเข้มข้น & พลังงาน">
        <div className="grid grid-cols-2 gap-2">
          <SliderField
            label={`ความเข้มข้น: ${intensityRpe}/10`}
            value={intensityRpe}
            min={1}
            max={10}
            onChange={setIntensityRpe}
          />
          <SliderField
            label={`พลังงานก่อน: ${energyBefore}/10`}
            value={energyBefore}
            min={1}
            max={10}
            onChange={setEnergyBefore}
          />
          <SliderField
            label={`พลังงานหลัง: ${energyAfter}/10`}
            value={energyAfter}
            min={1}
            max={10}
            onChange={setEnergyAfter}
          />
          <SliderField
            label={`คุณภาพนอน: ${sleepQuality}/5`}
            value={sleepQuality}
            min={1}
            max={5}
            onChange={setSleepQuality}
          />
        </div>
      </Section>

      {/* Mood */}
      <Section title="😊 อารมณ์วันนี้">
        <div className="flex flex-wrap gap-1.5">
          {moodOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setMood(opt.key)}
              className={`px-3 py-2.5 rounded-xl text-[13px] font-semibold min-h-[48px] transition-all active:scale-95 ${
                mood === opt.key
                  ? "bg-tennis-green text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-green-light"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* B. สภาพวันนี้ */}
      <Section title="B. สภาพวันนี้">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {conditionChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleConditionChip(chip)}
              className={`px-2.5 py-2 rounded-full text-[13px] font-medium transition-all active:scale-95 min-h-[40px] ${
                activeConditions.includes(chip) ||
                (chip === "ร้อน" && heatLevel !== "normal") ||
                (chip === "บอลใหม่" && ballCondition === "new_ball") ||
                (chip === "เปลี่ยนยี่ห้อบอล" && ballCondition === "different_brand") ||
                (chip === "นอนน้อย" && sleepQuality <= 2) ||
                (chip === "เหนื่อย" && (soreness === "medium" || soreness === "high")) ||
                (chip === "เจอรุ่นพี่" && opponentLevel === "older")
                  ? "bg-tennis-yellow text-gray-800 shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-yellow-light"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <select
            value={soreness}
            onChange={(e) => setSoreness(e.target.value as Soreness)}
            className="px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
          >
            <option value="none">ไม่ปวด</option>
            <option value="low">ปวดนิดหน่อย</option>
            <option value="medium">ปวดปานกลาง</option>
            <option value="high">ปวดมาก</option>
          </select>
        </div>
      </Section>

      {/* C. ทำได้ดี */}
      <Section title="C. ✅ ทำได้ดี">
        <div className="flex flex-wrap gap-1.5">
          {strengthChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => toggleTag(chip, strengthTags, setStrengthTags)}
              className={`px-2.5 py-2 rounded-full text-[13px] font-medium transition-all active:scale-95 min-h-[40px] ${
                strengthTags.includes(chip)
                  ? "bg-tennis-green text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-green-light"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </Section>

      {/* D. ควรพัฒนา */}
      <Section title="D. 🎯 ควรพัฒนา">
        <div className="flex flex-wrap gap-1.5">
          {weaknessChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => toggleTag(chip, weaknessTags, setWeaknessTags)}
              className={`px-2.5 py-2 rounded-full text-[13px] font-medium transition-all active:scale-95 min-h-[40px] ${
                weaknessTags.includes(chip)
                  ? "bg-tennis-clay text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark hover:bg-red-100"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </Section>

      {/* Match details toggle */}
      {(entryType === "match" || entryType === "tournament") && (
        <Section title="⚔️ รายละเอียดแมตช์">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <select
              value={opponentLevel}
              onChange={(e) => setOpponentLevel(e.target.value as OpponentLevel)}
              className="px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
            >
              <option value="unknown">ระดับคู่แข่ง</option>
              <option value="easier">ง่ายกว่า</option>
              <option value="same">เท่ากัน</option>
              <option value="stronger">แข็งกว่า</option>
              <option value="older">รุ่นพี่</option>
            </select>
            <select
              value={resultType}
              onChange={(e) => setResultType(e.target.value as ResultType)}
              className="px-2 py-1.5 text-[12px] border border-gray-200 rounded-lg min-h-[36px]"
            >
              <option value="practice_only">ซ้อมเท่านั้น</option>
              <option value="win">ชนะ</option>
              <option value="loss">แพ้</option>
              <option value="not_scored">ไม่นับแต้ม</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="สกอร์ (เช่น 6-4, 3-6, 6-2)"
            value={scoreText}
            onChange={(e) => setScoreText(e.target.value)}
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 min-h-[44px] placeholder:text-gray-400"
          />
        </Section>
      )}

      {/* E. บันทึกสั้น ๆ */}
      <Section title="E. 📝 บันทึกสั้น ๆ">
        <textarea
          placeholder="วันนี้ทำได้ดีเพราะอะไร..."
          value={whatWentWell}
          onChange={(e) => setWhatWentWell(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 resize-none placeholder:text-gray-400 mb-2"
        />
        <textarea
          placeholder="วันนี้ทำได้ไม่ดีเพราะอะไร..."
          value={whatNeedsWork}
          onChange={(e) => setWhatNeedsWork(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 resize-none placeholder:text-gray-400 mb-2"
        />
        <input
          type="text"
          placeholder="สิ่งเดียวที่ต้องซ้อมต่อคือ..."
          value={parentNote}
          onChange={(e) => setParentNote(e.target.value)}
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tennis-green/30 min-h-[44px] placeholder:text-gray-400"
        />
        <input
          type="text"
          placeholder="🔒 บันทึกส่วนตัว (ไม่แชร์กับใคร)"
          value={athletePrivateNote}
          onChange={(e) => setAthletePrivateNote(e.target.value)}
          className="w-full px-3 py-2 text-[13px] border border-purple-200 bg-purple-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[44px] placeholder:text-gray-400 mt-2"
        />
      </Section>

      {/* Visibility */}
      <Section title="👁️ การมองเห็น">
        <div className="flex flex-wrap gap-1.5">
          {([
            ["private", "🔒 ส่วนตัว"],
            ["family", "👨‍👩‍👧 ครอบครัว"],
            ["coach", "🎾 โค้ช"],
            ["summary_only", "📋 สรุปเท่านั้น"],
          ] as [EntryVisibility, string][]).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setVisibility(val)}
              className={`px-2.5 py-2 rounded-full text-[12px] font-medium transition-all active:scale-95 min-h-[40px] ${
                visibility === val
                  ? "bg-tennis-blue text-white shadow-sm"
                  : "bg-tennis-gray text-tennis-gray-dark hover:bg-tennis-blue-light"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl text-[15px] font-bold bg-tennis-green text-white hover:bg-tennis-green/90 active:scale-[0.98] min-h-[52px] transition-all shadow-sm"
      >
        ✅ บันทึก
      </button>

      {/* Active state summary */}
      {(strengthTags.length > 0 || weaknessTags.length > 0) && (
        <div className="bg-tennis-green-bg rounded-xl px-3 py-2 text-[11px] text-tennis-green font-medium text-center">
          {strengthTags.length > 0 && (
            <span>✅ จุดแข็ง: {strengthTags.join(", ")} </span>
          )}
          {weaknessTags.length > 0 && (
            <span>🎯 ควรพัฒนา: {weaknessTags.join(", ")}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ---- helpers ----

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-tennis-gray-dark uppercase tracking-wide mb-1.5">
        {title}
      </p>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-tennis-gray rounded-xl px-3 py-2">
      <p className="text-[11px] text-tennis-gray-dark font-semibold mb-1">{label}</p>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-tennis-green h-2"
      />
    </div>
  );
}

function heatLevelLabel(key: string): string {
  const map: Record<string, string> = {
    normal: "ปกติ",
    hot: "ร้อน",
    very_hot: "ร้อนจัด",
  };
  return map[key] ?? key;
}

function ballConditionLabel(key: string): string {
  const map: Record<string, string> = {
    normal: "ปกติ",
    new_ball: "บอลใหม่",
    different_brand: "เปลี่ยนยี่ห้อ",
    heavy_ball: "บอลหนัก",
    old_ball: "บอลเก่า",
  };
  return map[key] ?? key;
}