import type { TrainingEntry, StrengthWeaknessInsight } from "@/lib/types";

interface TagCount {
  tag: string;
  count: number;
  contexts: string[];
}

interface ConditionCount {
  key: string;
  count: number;
  badMoodCount: number;
  badEnergyCount: number;
}

function countTags(entries: TrainingEntry[], extractor: (e: TrainingEntry) => string[]): TagCount[] {
  const map = new Map<string, TagCount>();
  for (const entry of entries) {
    const tags = extractor(entry);
    for (const tag of tags) {
      if (!map.has(tag)) {
        map.set(tag, { tag, count: 0, contexts: [] });
      }
      const t = map.get(tag)!;
      t.count += 1;
      if (entry.whatWentWell) t.contexts.push(entry.whatWentWell);
      if (entry.whatNeedsWork) t.contexts.push(entry.whatNeedsWork);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

function countConditions(entries: TrainingEntry[]): {
  ballCondition: ConditionCount[];
  heatLevel: ConditionCount[];
} {
  const ballMap = new Map<string, ConditionCount>();
  const heatMap = new Map<string, ConditionCount>();

  const badMoods: string[] = ["tired", "stressed", "frustrated"];
  const badEnergies = (e: TrainingEntry) => e.energyAfter < e.energyBefore;

  for (const entry of entries) {
    const bc = entry.ballCondition;
    if (!ballMap.has(bc)) {
      ballMap.set(bc, { key: bc, count: 0, badMoodCount: 0, badEnergyCount: 0 });
    }
    const b = ballMap.get(bc)!;
    b.count += 1;
    if (badMoods.includes(entry.mood)) b.badMoodCount += 1;
    if (badEnergies(entry)) b.badEnergyCount += 1;

    const hl = entry.heatLevel;
    if (!heatMap.has(hl)) {
      heatMap.set(hl, { key: hl, count: 0, badMoodCount: 0, badEnergyCount: 0 });
    }
    const h = heatMap.get(hl)!;
    h.count += 1;
    if (badMoods.includes(entry.mood)) h.badMoodCount += 1;
    if (badEnergies(entry)) h.badEnergyCount += 1;
  }

  return {
    ballCondition: Array.from(ballMap.values()).sort((a, b) => b.count - a.count),
    heatLevel: Array.from(heatMap.values()).sort((a, b) => b.count - a.count),
  };
}

export function generateInsights(entries: TrainingEntry[]): StrengthWeaknessInsight[] {
  if (entries.length === 0) return [];

  const insights: StrengthWeaknessInsight[] = [];

  // Strength tags (what went well repeatedly)
  const strengthTags = countTags(entries, (e) => e.strengthTags);
  // Weakness tags
  const weaknessTags = countTags(entries, (e) => e.weaknessTags);
  // Trigger tags
  const triggerTags = countTags(entries, (e) => e.triggerTags);

  // Condition analysis
  const { ballCondition, heatLevel } = countConditions(entries);

  // Top 3 strengths
  for (const st of strengthTags.slice(0, 3)) {
    insights.push({
      label: st.tag,
      category: "strength",
      score: Math.min(100, st.count * 25),
      evidenceCount: st.count,
      relatedTags: [st.tag],
      explanation: `"${st.tag}" เป็นจุดแข็งที่เกิดขึ้นซ้ำ ${st.count} ครั้ง แสดงถึงความสม่ำเสมอที่ดี`,
      recommendation: `รักษามาตรฐาน "${st.tag}" ไว้และพัฒนาให้ดียิ่งขึ้น`,
    });
  }

  // Top 3 weaknesses
  for (const wt of weaknessTags.slice(0, 3)) {
    insights.push({
      label: wt.tag,
      category: "weakness",
      score: Math.min(100, wt.count * 25),
      evidenceCount: wt.count,
      relatedTags: [wt.tag],
      explanation: `"${wt.tag}" เป็นจุดที่ต้องพัฒนาซ้ำ ${wt.count} ครั้ง`,
      recommendation: `ใส่ใจฝึกซ้อม "${wt.tag}" อย่างมีแบบแผน`,
    });
  }

  // Top 3 repeated triggers (appearing with bad mood/energy)
  for (const tt of triggerTags.slice(0, 3)) {
    const badEntries = entries.filter(
      (e) =>
        e.triggerTags.includes(tt.tag) &&
        (e.mood === "tired" || e.mood === "stressed" || e.mood === "frustrated" || e.energyAfter < e.energyBefore)
    );
    insights.push({
      label: tt.tag,
      category: "trigger",
      score: Math.min(100, tt.count * 20),
      evidenceCount: tt.count,
      relatedTags: [tt.tag],
      explanation:
        badEntries.length > 0
          ? `สิ่งกระตุ้น "${tt.tag}" เกิดขึ้น ${tt.count} ครั้ง โดย ${badEntries.length} ครั้งพบร่วมกับอารมณ์หรือพลังงานที่ลดลง`
          : `สิ่งกระตุ้น "${tt.tag}" เกิดขึ้น ${tt.count} ครั้ง`,
      recommendation: `สังเกตและเตรียมตัวรับมือเมื่อเจอ "${tt.tag}" อีก`,
    });
  }

  // Best condition
  if (ballCondition.length > 0) {
    const bestBall = ballCondition.reduce((best, cur) =>
      cur.badMoodCount + cur.badEnergyCount < best.badMoodCount + best.badEnergyCount ? cur : best
    );
    insights.push({
      label: `สภาพบอลดีที่สุด: ${ballConditionLabel(bestBall.key)}`,
      category: "condition",
      score: Math.max(50, 100 - (bestBall.badMoodCount + bestBall.badEnergyCount) * 15),
      evidenceCount: bestBall.count,
      relatedTags: [bestBall.key],
      explanation: `เมื่อใช้บอล "${ballConditionLabel(bestBall.key)}" มีวันที่แย่น้อยที่สุด (${bestBall.badMoodCount + bestBall.badEnergyCount}/${bestBall.count} ครั้ง)`,
      recommendation: "เมื่อเป็นไปได้ ควรเลือกใช้สภาพบอลที่ถนัด",
    });
  }

  // Worst condition
  if (heatLevel.length > 0) {
    const worstHeat = heatLevel.reduce((worst, cur) =>
      cur.badMoodCount + cur.badEnergyCount > worst.badMoodCount + worst.badEnergyCount ? cur : worst
    );
    insights.push({
      label: `สภาพอากาศที่ท้าทาย: ${heatLevelLabel(worstHeat.key)}`,
      category: "condition",
      score: Math.min(80, (worstHeat.badMoodCount + worstHeat.badEnergyCount) * 20),
      evidenceCount: worstHeat.count,
      relatedTags: [worstHeat.key],
      explanation: `ในวันที่ "${heatLevelLabel(worstHeat.key)}" มีวันที่พลังงานตกหรืออารมณ์เสีย ${worstHeat.badMoodCount + worstHeat.badEnergyCount}/${worstHeat.count} ครั้ง`,
      recommendation:
        worstHeat.key === "hot" || worstHeat.key === "very_hot"
          ? "Hot Day Protocol: ดื่มน้ำเพิ่ม, พักในร่มระหว่างเซต, ใช้ผ้าเย็น"
          : "เตรียมตัวรับมือกับสภาพอากาศที่แปรปรวน",
    });
  }

  // New ball adaptation rule
  const newBallEntries = entries.filter((e) => e.ballCondition === "new_ball");
  if (newBallEntries.length > 0) {
    const newBallWeakness = newBallEntries.filter(
      (e) =>
        e.weaknessTags.includes("สมาธิหลุด") ||
        e.weaknessTags.includes("ตีพลาด") ||
        e.weaknessTags.includes("ปรับตัวกับบอลช้า") ||
        e.weaknessTags.includes("โดนบอลใหม่แล้วหลุด")
    );
    if (newBallWeakness.length > 0) {
      insights.push({
        label: "ปรับตัวกับบอลใหม่",
        category: "trigger",
        score: Math.min(90, newBallWeakness.length * 30),
        evidenceCount: newBallWeakness.length,
        relatedTags: ["new_ball", "สมาธิหลุด", "ตีพลาด"],
        explanation: `พบ ${newBallWeakness.length} ครั้งที่บอลใหม่ส่งผลต่อสมาธิหรือความแม่นยำ`,
        recommendation: "ซ้อม New Ball Start 10 นาที ก่อนเล่นแต้มจริง — เริ่มเซตด้วยลูกใหม่เพื่อให้ชิน",
      });
    }
  }

  // Hot day protocol rule
  const hotEntries = entries.filter((e) => e.heatLevel === "hot" || e.heatLevel === "very_hot");
  if (hotEntries.length > 0) {
    const hotBad = hotEntries.filter(
      (e) => e.energyAfter < e.energyBefore || e.mood === "tired" || e.mood === "frustrated"
    );
    if (hotBad.length > 0) {
      insights.push({
        label: "Hot Day Protocol",
        category: "condition",
        score: Math.min(90, hotBad.length * 25),
        evidenceCount: hotBad.length,
        relatedTags: ["hot", "very_hot"],
        explanation: `ในวันที่อากาศร้อนหรือร้อนจัด ${hotBad.length}/${hotEntries.length} ครั้งพบพลังงานตกลงหรืออารมณ์เสีย`,
        recommendation: "Hot Day Protocol: พักยาวขึ้นระหว่างเซต, ดื่มน้ำทุก 15 นาที, ใช้ผ้าเย็น, ลดความคาดหวัง",
      });
    }
  }

  // Opponent pressure rule (useful pressure practice)
  const pressureEntries = entries.filter(
    (e) =>
      (e.opponentLevel === "stronger" || e.opponentLevel === "older") &&
      e.resultType === "loss" &&
      e.focusTags.length > 0
  );
  if (pressureEntries.length > 0) {
    insights.push({
      label: "แรงกดดันที่มีประโยชน์",
      category: "strength",
      score: Math.min(85, 50 + pressureEntries.length * 10),
      evidenceCount: pressureEntries.length,
      relatedTags: ["stronger", "older"],
      explanation: `ถึงแม้ผลแข่งจะแพ้ ${pressureEntries.length} ครั้ง แต่คุณยังทำตามแท็กที่โฟกัสได้ — นี่คือแรงกดดันที่ช่วยพัฒนา`,
      recommendation: "การแข่งกับคู่ที่แข็งกว่าเป็น practice ที่มีค่า — มองเป็นโอกาสเรียนรู้ ไม่ใช่ตัดสินตัวเอง",
    });
  }

  // Recommendation for next 7 days (aggregate top advice)
  const recommendations = insights
    .filter((i) => i.category === "weakness" || i.category === "trigger")
    .slice(0, 3)
    .map((i) => i.recommendation);

  if (recommendations.length > 0) {
    insights.push({
      label: "คำแนะนำ 7 วัน",
      category: "condition",
      score: 60,
      evidenceCount: entries.length,
      relatedTags: [],
      explanation: "สรุปจากข้อมูลทั้งหมด",
      recommendation: recommendations.join(" | "),
    });
  }

  return insights;
}

function ballConditionLabel(key: string): string {
  const map: Record<string, string> = {
    normal: "ปกติ",
    new_ball: "บอลใหม่",
    different_brand: "เปลี่ยนยี่ห้อบอล",
    heavy_ball: "บอลหนัก",
    old_ball: "บอลเก่า",
  };
  return map[key] ?? key;
}

function heatLevelLabel(key: string): string {
  const map: Record<string, string> = {
    normal: "ปกติ",
    hot: "ร้อน",
    very_hot: "ร้อนจัด",
  };
  return map[key] ?? key;
}