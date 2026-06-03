import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { dbToGoal, goalToDb } from "@/lib/supabase";
export type { Goal } from "@/lib/supabase";

export async function GET() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userGoals = (data ?? []).map(dbToGoal);
  const total = userGoals.reduce((sum, g) => sum + g.savedAmount, 0);
  const target = userGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  return NextResponse.json({ goals: userGoals, total, target });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, targetAmount, emoji, color, monthlyContribution, monthlyPlan, startDate, targetDate, initialSaved } = body;

  if (!title || !targetAmount) {
    return NextResponse.json({ error: "title and targetAmount are required" }, { status: 400 });
  }

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const saved = Math.min(Number(initialSaved) || 0, Number(targetAmount));

  const newGoal = {
    userId: user.id,
    title,
    targetAmount: Number(targetAmount),
    savedAmount: saved,
    emoji: emoji || "🎯",
    color: color || "green",
    monthlyContribution: Number(monthlyContribution) || 0,
    monthlyPlan: monthlyPlan || [],
    startDate: startDate || ym,
    targetDate: targetDate || "",
    history: saved > 0 ? [{ yearMonth: ym, savedAmount: saved }] : [],
  };

  const { data, error } = await supabase
    .from("goals")
    .insert(goalToDb(newGoal))
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(dbToGoal(data), { status: 201 });
}
