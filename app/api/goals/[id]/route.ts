import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { dbToGoal } from "@/lib/supabase";

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { deposit } = body;

  if (typeof deposit !== "number" || deposit === 0) {
    return NextResponse.json({ error: "deposit must be a non-zero number" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const goal = dbToGoal(existing);
  const newSaved = Math.max(0, Math.min(goal.savedAmount + deposit, goal.targetAmount));

  const ym = thisMonth();
  const history = [...(goal.history ?? [])];
  const existingEntry = history.find((h) => h.yearMonth === ym);
  if (existingEntry) {
    existingEntry.savedAmount = newSaved;
  } else {
    history.push({ yearMonth: ym, savedAmount: newSaved });
  }

  const { data, error } = await supabase
    .from("goals")
    .update({ saved_amount: newSaved, history })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(dbToGoal(data));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data, error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

  return NextResponse.json(dbToGoal(data));
}
