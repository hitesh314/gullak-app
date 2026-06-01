export type HistoryEntry = {
  yearMonth: string; // "YYYY-MM"
  savedAmount: number;
};

export type MonthlyPlanEntry = { yearMonth: string; amount: number };

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  emoji: string;
  color: string;
  monthlyContribution: number;        // used when divideEqually
  monthlyPlan: MonthlyPlanEntry[];    // used when custom per-month plan
  startDate: string;   // "YYYY-MM"
  targetDate: string;  // "YYYY-MM"
  history: HistoryEntry[];
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __goals__: Goal[] | undefined;
}

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

if (!global.__goals__) {
  const now = thisMonth();
  global.__goals__ = [
    {
      id: "1",
      title: "Emergency Fund",
      targetAmount: 100000,
      savedAmount: 42000,
      emoji: "🛡️",
      color: "blue",
      monthlyContribution: 5000,
      monthlyPlan: [],
      startDate: "2025-01",
      targetDate: "2026-12",
      history: [
        { yearMonth: "2025-01", savedAmount: 5000 },
        { yearMonth: "2025-02", savedAmount: 10000 },
        { yearMonth: "2025-03", savedAmount: 15000 },
        { yearMonth: "2025-04", savedAmount: 19000 },
        { yearMonth: "2025-05", savedAmount: 24000 },
        { yearMonth: "2025-06", savedAmount: 29000 },
        { yearMonth: "2025-07", savedAmount: 33000 },
        { yearMonth: "2025-08", savedAmount: 37000 },
        { yearMonth: "2025-09", savedAmount: 42000 },
        { yearMonth: now, savedAmount: 42000 },
      ],
      createdAt: new Date().toISOString(),
    },
  ];
}

export const goals: Goal[] = global.__goals__;

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
