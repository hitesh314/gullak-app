export type HistoryEntry = {
  yearMonth: string; // "YYYY-MM"
  savedAmount: number;
};

export type MonthlyPlanEntry = { yearMonth: string; amount: number };

export type Goal = {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  emoji: string;
  color: string;
  monthlyContribution: number;
  monthlyPlan: MonthlyPlanEntry[];
  startDate: string;   // "YYYY-MM"
  targetDate: string;  // "YYYY-MM"
  history: HistoryEntry[];
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __goals__: Goal[] | undefined;
}

if (!global.__goals__) {
  global.__goals__ = [];
}

export const goals: Goal[] = global.__goals__;

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function recordHistory(goal: Goal) {
  if (!goal.history) goal.history = [];
  if (!goal.monthlyPlan) goal.monthlyPlan = [];
  const ym = thisMonth();
  const existing = goal.history.find((h) => h.yearMonth === ym);
  if (existing) {
    existing.savedAmount = goal.savedAmount;
  } else {
    goal.history.push({ yearMonth: ym, savedAmount: goal.savedAmount });
  }
}
