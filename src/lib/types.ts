export type ActivityType =
  | "tennis"
  | "fitness"
  | "recovery"
  | "match-sim"
  | "school"
  | "tournament";

export type CheckInChip =
  | "ซ้อมดี"
  | "ล้า"
  | "ร้อน"
  | "บอลใหม่"
  | "สมาธิหลุด"
  | "มั่นใจ";

export type VisibilityMode =
  | "private"
  | "share-with-parents"
  | "share-with-coach"
  | "summary-share";

export type Reaction =
  | "เห็นด้วย"
  | "ไม่เห็นด้วย"
  | "ขอคิดก่อน"
  | "อยากแข่ง"
  | "แนะนำ Match Simulation";

export type TabId =
  | "today"
  | "timeline"
  | "family"
  | "investment"
  | "notes";

export interface Athlete {
  id: string;
  name: string;
  age: number;
  level: string;
  primaryGoal: string;
  avatarUrl: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  label: string;
  date: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  color: string;
  venue?: string;
  note?: string;
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: number;
  venue: string;
  level: string;
  seedingBenefit: boolean;
}

export interface PlanDay {
  date: string;
  dayLabel: string;
  activities: Activity[];
}

export interface PlanComparison {
  id: "A" | "B" | "C";
  name: string;
  description: string;
  hasTournament: boolean;
  tournamentDays: number;
  readiness: number;
  trainingDays: number;
  recoveryRisk: "low" | "medium" | "high";
  pros: string[];
  cons: string[];
}

export interface Proposal {
  id: string;
  tournament: Tournament;
  status: "pending" | "accepted" | "rejected" | "modified";
  reactions: FamilyReaction[];
  comparisons: PlanComparison[];
  savedDecision: PlanComparison["id"] | null;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: "พ่อ" | "แม่" | "นักกีฬา" | "โค้ช";
  avatarUrl: string;
}

export interface FamilyReaction {
  member: FamilyMember;
  reaction: Reaction;
  comment: string;
  timestamp: string;
}

export interface DecisionImpact {
  readinessDelta: number;
  trainingDaysLost: number;
  recoveryRisk: "low" | "medium" | "high";
  recommendation: "Go with limit" | "Replace with Match Simulation";
  explanation: string;
}

export interface CostItem {
  id: string;
  category: string;
  label: string;
  budget: number;
  actual: number;
}

export interface InvestmentValue {
  id: string;
  category: "เวลา" | "พลังงาน" | "เงิน" | "บทเรียนที่ได้";
  description: string;
  value: string;
}

export interface PrivateNote {
  id: string;
  title: string;
  content: string;
  visibility: VisibilityMode;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ReadinessSummary {
  score: number;
  mood: string;
  energy: string;
  goodPoints: string[];
  improvePoints: string[];
  checkIns: CheckInChip[];
}

export interface TodayData {
  athlete: Athlete;
  nextTournament: Tournament;
  readiness: ReadinessSummary;
  plan: PlanDay;
}