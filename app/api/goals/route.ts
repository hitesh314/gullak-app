import { NextRequest, NextResponse } from "next/server";
import { goals } from "@/lib/store";
export type { Goal } from "@/lib/store";

function getUserId(req: NextRequest): string | null {
  return req.cookies.get("gullak_uid")?.value ?? null;
}

export async function GET(req: NextRequest) {
  const uid = getUserId(req);
  if (!uid) return NextResponse.json({ error: "No session" }, { status: 401 });

  const userGoals = goals.filter((g) => g.userId === uid);
  const total = userGoals.reduce((sum, g) => sum + g.savedAmount, 0);
  const target = userGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  return NextResponse.json({ goals: userGoals, total, target });
}

export async function POST(req: NextRequest) {
  const uid = getUserId(req);
  if (!uid) return NextResponse.json({ error: "No session" }, { status: 401 });

  const body = await req.json();
  const { title, targetAmount, emoji, color, monthlyContribution, monthlyPlan, startDate, targetDate, initialSaved } = body;

  if (!title || !targetAmount) {
    return NextResponse.json({ error: "title and targetAmount are required" }, { status: 400 });
  }

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const saved = Math.min(Number(initialSaved) || 0, Number(targetAmount));

  const newGoal = {
    id: Date.now().toString(),
    userId: uid,
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
    createdAt: new Date().toISOString(),
  };

  goals.push(newGoal);
  return NextResponse.json(newGoal, { status: 201 });
}
