import type {
  AthleteProfile,
  TrainingEntry,
  PlanActivity,
  StrengthWeaknessInsight,
} from "@/lib/types";

const STORAGE_PREFIX = "tennisrecap_mvp_";

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  } catch {
    // quota exceeded or disabled — silently ignore
  }
}

// ===== Athlete Profile =====

const DEFAULT_ATHLETE: AthleteProfile = {
  id: "athlete_1",
  name: "",
  ageGroup: "U14",
  dominantHand: "right",
  mainGoal: "",
  nextTournamentName: "",
  nextTournamentDate: "",
};

export function getAthleteProfile(): AthleteProfile {
  return safeGet<AthleteProfile>("athlete_profile", { ...DEFAULT_ATHLETE });
}

export function saveAthleteProfile(profile: AthleteProfile): void {
  safeSet("athlete_profile", profile);
}

// ===== Training Entries =====

export function getEntries(): TrainingEntry[] {
  return safeGet<TrainingEntry[]>("entries", []);
}

export function addEntry(entry: TrainingEntry): void {
  const entries = getEntries();
  entries.unshift(entry);
  safeSet("entries", entries);
}

export function updateEntry(updated: TrainingEntry): void {
  const entries = getEntries();
  const idx = entries.findIndex((e) => e.id === updated.id);
  if (idx !== -1) {
    entries[idx] = updated;
    safeSet("entries", entries);
  }
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter((e) => e.id !== id);
  safeSet("entries", entries);
}

// ===== Plan Activities =====

export function getPlanActivities(): PlanActivity[] {
  return safeGet<PlanActivity[]>("plan_activities", []);
}

export function addPlanActivity(activity: PlanActivity): void {
  const activities = getPlanActivities();
  activities.push(activity);
  safeSet("plan_activities", activities);
}

export function updatePlanActivity(updated: PlanActivity): void {
  const activities = getPlanActivities();
  const idx = activities.findIndex((a) => a.id === updated.id);
  if (idx !== -1) {
    activities[idx] = updated;
    safeSet("plan_activities", activities);
  }
}

export function deletePlanActivity(id: string): void {
  const activities = getPlanActivities().filter((a) => a.id !== id);
  safeSet("plan_activities", activities);
}

// ===== Insights =====

export function saveInsights(insights: StrengthWeaknessInsight[]): void {
  safeSet("insights", insights);
}

export function getCachedInsights(): StrengthWeaknessInsight[] {
  return safeGet<StrengthWeaknessInsight[]>("insights", []);
}

// ===== Export / Import =====

export interface AppSnapshot {
  version: string;
  exportedAt: string;
  athleteProfile: AthleteProfile;
  entries: TrainingEntry[];
  planActivities: PlanActivity[];
}

export function exportSnapshot(): AppSnapshot {
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    athleteProfile: getAthleteProfile(),
    entries: getEntries(),
    planActivities: getPlanActivities(),
  };
}

export function importSnapshot(snapshot: AppSnapshot): void {
  if (snapshot.athleteProfile) {
    saveAthleteProfile(snapshot.athleteProfile);
  }
  if (snapshot.entries) {
    safeSet("entries", snapshot.entries);
  }
  if (snapshot.planActivities) {
    safeSet("plan_activities", snapshot.planActivities);
  }
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}