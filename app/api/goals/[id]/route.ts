import { NextRequest, NextResponse } from "next/server";
import { goals, recordHistory } from "@/lib/store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { deposit } = body;

  if (typeof deposit !== "number" || deposit === 0) {
    return NextResponse.json({ error: "deposit must be a non-zero number" }, { status: 400 });
  }

  const goal = goals.find((g) => g.id === id);
  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  goal.savedAmount = Math.max(0, Math.min(goal.savedAmount + deposit, goal.targetAmount));
  recordHistory(goal);
  return NextResponse.json(goal);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }
  const [deleted] = goals.splice(index, 1);
  return NextResponse.json(deleted);
}
