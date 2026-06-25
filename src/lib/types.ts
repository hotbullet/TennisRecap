export type ActivityType =
  | "tennis"
  | "fitness"
  | "recovery"
  | "match-sim"
  | "school"
  | "tournament"
  | "travel"
  | "rest";

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

// ===== NEW MVP DATA MODELS =====

export type EntryType =
  | "training"
  | "match"
  | "tournament"
  | "fitness_entry"
  | "recovery_entry";

export type Mood =
  | "good"
  | "okay"
  | "tired"
  | "stressed"
  | "confident"
  | "frustrated";

export type Soreness = "none" | "low" | "medium" | "high";

export type HeatLevel = "normal" | "hot" | "very_hot";

export type BallCondition =
  | "normal"
  | "new_ball"
  | "different_brand"
  | "heavy_ball"
  | "old_ball";

export type OpponentLevel = "easier" | "same" | "stronger" | "older" | "unknown";

export type ResultType = "win" | "loss" | "practice_only" | "not_scored";

export type EntryVisibility =
  | "private"
  | "family"
  | "coach"
  | "summary_only";

export type PlanPriority = "low" | "medium" | "high";

export interface AthleteProfile {
  id: string;
  name: string;
  ageGroup: string;
  dominantHand: "left" | "right";
  mainGoal: string;
  nextTournamentName: string;
  nextTournamentDate: string;
}

export interface TrainingEntry {
  id: string;
  date: string;
  type: EntryType;
  durationMinutes: number;
  intensityRpe: number;
  energyBefore: number;
  energyAfter: number;
  mood: Mood;
  sleepQuality: number;
  soreness: Soreness;
  heatLevel: HeatLevel;
  ballCondition: BallCondition;
  opponentLevel: OpponentLevel;
  resultType: ResultType;
  scoreText: string;
  focusTags: string[];
  strengthTags: string[];
  weaknessTags: string[];
  triggerTags: string[];
  whatWentWell: string;
  whatNeedsWork: string;
  parentNote: string;
  athletePrivateNote: string;
  visibility: EntryVisibility;
}

export interface PlanActivity {
  id: string;
  date: string;
  title: string;
  type: ActivityType;
  durationMinutes: number;
  priority: PlanPriority;
  costEstimate: number;
  purpose: string;
  expectedBenefit: string;
  risk: string;
  /** Optional extended fields for calendar views */
  startDate?: string;
  endDate?: string;
  timeOfDay?: string;
  isTournamentBlock?: boolean;
}

export interface StrengthWeaknessInsight {
  label: string;
  category: "strength" | "weakness" | "trigger" | "condition";
  score: number;
  evidenceCount: number;
  relatedTags: string[];
  explanation: string;
  recommendation: string;
}

// ===== LEGACY TYPES (preserved for backward compat) =====

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