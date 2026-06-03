import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type HistoryEntry = {
  yearMonth: string;
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
  startDate: string;
  targetDate: string;
  history: HistoryEntry[];
  createdAt: string;
};

type DbGoal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  emoji: string;
  color: string;
  monthly_contribution: number;
  monthly_plan: MonthlyPlanEntry[];
  start_date: string;
  target_date: string;
  history: HistoryEntry[];
  created_at: string;
};

export function dbToGoal(row: DbGoal): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    targetAmount: Number(row.target_amount),
    savedAmount: Number(row.saved_amount),
    emoji: row.emoji,
    color: row.color,
    monthlyContribution: Number(row.monthly_contribution),
    monthlyPlan: row.monthly_plan ?? [],
    startDate: row.start_date,
    targetDate: row.target_date,
    history: row.history ?? [],
    createdAt: row.created_at,
  };
}

export function goalToDb(goal: Omit<Goal, "id" | "createdAt"> & { id?: string }): Omit<DbGoal, "created_at" | "id"> & { id?: string } {
  return {
    ...(goal.id ? { id: goal.id } : {}),
    user_id: goal.userId,
    title: goal.title,
    target_amount: goal.targetAmount,
    saved_amount: goal.savedAmount,
    emoji: goal.emoji,
    color: goal.color,
    monthly_contribution: goal.monthlyContribution,
    monthly_plan: goal.monthlyPlan,
    start_date: goal.startDate,
    target_date: goal.targetDate,
    history: goal.history,
  };
}
