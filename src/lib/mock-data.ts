import type {
  Athlete,
  Tournament,
  PlanDay,
  FamilyMember,
  FamilyReaction,
  Proposal,
  PlanComparison,
  TodayData,
  ReadinessSummary,
  CostItem,
  InvestmentValue,
  PrivateNote,
} from "@/lib/types";

export const athlete: Athlete = {
  id: "a1",
  name: "Daniel",
  age: 13,
  level: "U14",
  primaryGoal: "Top 10 U14 Thailand",
  avatarUrl: "/avatars/athlete.png",
};

export const nextTournament: Tournament = {
  id: "t1",
  name: "PTT ลอนเทนนิสพัฒนาฝีมือ ครั้งที่ 3",
  startDate: "2026-07-15",
  endDate: "2026-07-18",
  days: 4,
  venue: "ศูนย์พัฒนากีฬาเทนนิสแห่งชาติ เมืองทองธานี",
  level: "U14",
  seedingBenefit: false,
};

export const readinessSummary: ReadinessSummary = {
  score: 78,
  mood: "🙂 สดใส",
  energy: "⚡ พร้อม",
  goodPoints: [
    "โฟร์แฮนด์ลงน้ำหนักดีขึ้น",
    "เสิร์ฟแรกเข้าเป้า 70%",
  ],
  improvePoints: [
    "ดรอปช็อตยังไม่นิ่ง",
    "สมาธิช่วงเกมที่ 3",
  ],
  checkIns: ["ซ้อมดี", "ร้อน", "มั่นใจ"],
};

export const todayPlan: PlanDay = {
  date: "2026-06-24",
  dayLabel: "พุธ",
  activities: [
    {
      id: "act1",
      type: "tennis",
      label: "ซ้อมเทนนิส",
      date: "2026-06-24",
      startTime: "06:30",
      endTime: "08:30",
      durationMinutes: 120,
      color: "#2e7d32",
      venue: "คอร์ท 3",
      note: "เน้นเสิร์ฟ + รีเทิร์น",
    },
    {
      id: "act2",
      type: "school",
      label: "โรงเรียน",
      date: "2026-06-24",
      startTime: "09:00",
      endTime: "15:00",
      durationMinutes: 360,
      color: "#0077b6",
    },
    {
      id: "act3",
      type: "fitness",
      label: "ฟิตเนส",
      date: "2026-06-24",
      startTime: "16:00",
      endTime: "17:30",
      durationMinutes: 90,
      color: "#e07a5f",
    },
  ],
};

export const todayData: TodayData = {
  athlete,
  nextTournament: nextTournament,
  readiness: readinessSummary,
  plan: todayPlan,
};

export const familyMembers: FamilyMember[] = [
  {
    id: "f1",
    name: "พ่อ",
    role: "พ่อ",
    avatarUrl: "/avatars/dad.png",
  },
  {
    id: "f2",
    name: "แม่",
    role: "แม่",
    avatarUrl: "/avatars/mom.png",
  },
  {
    id: "f3",
    name: "Daniel",
    role: "นักกีฬา",
    avatarUrl: "/avatars/athlete.png",
  },
  {
    id: "f4",
    name: "โค้ชหนึ่ง",
    role: "โค้ช",
    avatarUrl: "/avatars/coach.png",
  },
];

export const familyReactions: FamilyReaction[] = [
  {
    member: familyMembers[0],
    reaction: "เห็นด้วย",
    comment: "ได้ประสบการณ์แข่งจริง ดีกว่าซ้อม",
    timestamp: "2026-06-24T08:00:00",
  },
  {
    member: familyMembers[1],
    reaction: "ขอคิดก่อน",
    comment: "ห่างสนามหลัก เกินไปไหม",
    timestamp: "2026-06-24T09:30:00",
  },
  {
    member: familyMembers[2],
    reaction: "อยากแข่ง",
    comment: "อยากเจอคู่แข่งใหม่ๆ",
    timestamp: "2026-06-24T07:45:00",
  },
  {
    member: familyMembers[3],
    reaction: "แนะนำ Match Simulation",
    comment: "ยังไม่จำเป็นต้องแข่ง ถ้าต้องการแมทช์ให้ซ้อมแมทช์ ดีกว่าเสี่ยง readiness หล่น",
    timestamp: "2026-06-24T10:15:00",
  },
];

export const planComparisons: PlanComparison[] = [
  {
    id: "A",
    name: "Plan A: มีแข่ง",
    description: "ลงแข่ง 8–11 ก.ค. ตามแผน 4 วัน",
    hasTournament: true,
    tournamentDays: 4,
    readiness: 70,
    trainingDays: 0,
    recoveryRisk: "high",
    pros: ["ได้ match pressure", "อาจช่วย ranking / seeding"],
    cons: ["เสียวันซ้อม 4 วัน", "readiness รายการหลักลดลง"],
  },
  {
    id: "B",
    name: "Plan B: จำกัดแข่ง",
    description: "ไปแข่งเฉพาะ 2 วัน สลับกลับซ้อม",
    hasTournament: true,
    tournamentDays: 2,
    readiness: 80,
    trainingDays: 2,
    recoveryRisk: "medium",
    pros: ["ได้ทั้งแข่งและซ้อม", "สมดุล readiness"],
    cons: ["ต้องเดินทางเพิ่ม", "ค่าใช้จ่ายเพิ่มขึ้น"],
  },
  {
    id: "C",
    name: "Plan C: ไม่แข่ง / Match Simulation",
    description: "ยกเลิกแข่ง จัดซ้อมแมทช์แทน",
    hasTournament: false,
    tournamentDays: 0,
    readiness: 90,
    trainingDays: 4,
    recoveryRisk: "low",
    pros: ["คงแผนซ้อมเดิม", "readiness ไม่ลด", "ประหยัดค่าใช้จ่าย"],
    cons: ["พลาดโอกาส ranking", "ไม่มีประสบการณ์แข่งจริง"],
  },
];

export const proposalData: Proposal = {
  id: "p1",
  tournament: {
    id: "t2",
    name: "TCA ชิงชนะเลิศภาคกลาง",
    startDate: "2026-07-08",
    endDate: "2026-07-11",
    days: 4,
    venue: "สนามเทนนิสจังหวัดนครสวรรค์",
    level: "U14",
    seedingBenefit: false,
  },
  status: "pending",
  reactions: familyReactions,
  comparisons: planComparisons,
  savedDecision: null,
};

export const fourteenDayPlan: PlanDay[] = (() => {
  const days: PlanDay[] = [];
  const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const baseDate = new Date("2026-06-24");

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dow = d.getDay();
    const dayLabel = dayNames[dow];

    const activities = [];
    if (dow !== 0) {
      activities.push({
        id: `act-${i}-1`,
        type: "tennis" as const,
        label: "ซ้อมเทนนิส",
        date: dateStr,
        startTime: "06:30",
        endTime: "08:30",
        durationMinutes: 120,
        color: "#2e7d32",
      });
    }
    if (dow >= 1 && dow <= 5) {
      activities.push({
        id: `act-${i}-2`,
        type: "school" as const,
        label: "โรงเรียน",
        date: dateStr,
        startTime: "09:00",
        endTime: "15:00",
        durationMinutes: 360,
        color: "#0077b6",
      });
    }
    if (dow === 2 || dow === 4) {
      activities.push({
        id: `act-${i}-3`,
        type: "fitness" as const,
        label: "ฟิตเนส",
        date: dateStr,
        startTime: "16:00",
        endTime: "17:30",
        durationMinutes: 90,
        color: "#e07a5f",
      });
    }
    if (dow === 3) {
      activities.push({
        id: `act-${i}-4`,
        type: "match-sim" as const,
        label: "Match Simulation",
        date: dateStr,
        startTime: "16:00",
        endTime: "18:00",
        durationMinutes: 120,
        color: "#ffb703",
      });
    }
    if (dow === 6) {
      activities.push({
        id: `act-${i}-5`,
        type: "recovery" as const,
        label: "Recovery",
        date: dateStr,
        startTime: "10:00",
        endTime: "11:30",
        durationMinutes: 90,
        color: "#a5d6a7",
      });
    }

    days.push({ date: dateStr, dayLabel, activities });
  }
  return days;
})();

export const investmentCosts: CostItem[] = [
  { id: "c1", category: "ค่าสมัคร", label: "ค่าสมัครแข่ง", budget: 15000, actual: 12000 },
  { id: "c2", category: "เดินทาง", label: "เดินทาง + ที่พัก", budget: 30000, actual: 25000 },
  { id: "c3", category: "คอร์ท", label: "ค่าเช่าคอร์ท", budget: 20000, actual: 20000 },
  { id: "c4", category: "โค้ช", label: "ค่าโค้ช", budget: 40000, actual: 38000 },
  { id: "c5", category: "ลูกบอล", label: "ลูกบอล + อุปกรณ์", budget: 8000, actual: 9000 },
  { id: "c6", category: "ฟิตเนส", label: "ฟิตเนส", budget: 12000, actual: 10000 },
];

export const investmentValues: InvestmentValue[] = [
  {
    id: "v1",
    category: "เวลา",
    description: "ชั่วโมงซ้อมทั้งหมดในเดือนนี้",
    value: "48 ชั่วโมง",
  },
  {
    id: "v2",
    category: "พลังงาน",
    description: "ความสม่ำเสมอในการซ้อม",
    value: "90% เข้าซ้อมครบ",
  },
  {
    id: "v3",
    category: "เงิน",
    description: "งบประมาณที่ใช้ไปเดือนนี้",
    value: "฿114,000 / ฿125,000",
  },
  {
    id: "v4",
    category: "บทเรียนที่ได้",
    description: "สิ่งที่พัฒนาขึ้น",
    value: "เสิร์ฟแรงขึ้น 15 km/h, ลด unforced error",
  },
];

export const privateNotes: PrivateNote[] = [
  {
    id: "n1",
    title: "ความรู้สึกหลังซ้อมวันนี้",
    content: "วันนี้รู้สึกว่าโฟร์แฮนด์ดีขึ้นเยอะ เสิร์ฟแรกก็เข้าเป้า แต่รู้สึกสมาธิหลุดตอนท้ายๆ คอร์ท ไม่แน่ใจว่าเป็นเพราะร้อนหรือเปล่า",
    visibility: "private",
    createdAt: "2026-06-24T18:30:00",
    updatedAt: "2026-06-24T18:30:00",
    tags: ["ซ้อม", "ความรู้สึก"],
  },
  {
    id: "n2",
    title: "เป้าหมายเดือนนี้",
    content: "อยากเสิร์ฟให้แรงและแม่นขึ้น ตั้งใจจะซ้อมเสิร์ฟเพิ่มอีก 30 นาทีทุกวัน พ่อบอกว่าถ้าทำได้จะพาไปแข่ง TCA",
    visibility: "share-with-parents",
    createdAt: "2026-06-20T20:00:00",
    updatedAt: "2026-06-23T21:00:00",
    tags: ["เป้าหมาย", "เสิร์ฟ", "ครอบครัว"],
  },
  {
    id: "n3",
    title: "เรื่องที่อยากคุยกับโค้ช",
    content: "ไม่แน่ใจว่าควรเปลี่ยนกริปหรือเปล่า ช่วงหลังรู้สึกว่าควบคุมบอลยากขึ้น เวลาตีท็อปสปินรู้สึกข้อมือล้า",
    visibility: "share-with-coach",
    createdAt: "2026-06-22T19:15:00",
    updatedAt: "2026-06-22T19:15:00",
    tags: ["เทคนิค", "โค้ช", "กริป"],
  },
];