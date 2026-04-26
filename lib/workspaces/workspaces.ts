"use client";

import { createClient } from "@/lib/supabase/client";

export type WorkspaceRow = {
  id: string;
  owner_user_id: string;
  name: string;
  created_at: string;
};

async function requireUserId() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error("You must be signed in.");
  return { supabase, userId };
}

export async function getOrCreateMyWorkspace(): Promise<WorkspaceRow> {
  const { supabase, userId } = await requireUserId();

  const { data: existing, error: selErr } = await supabase
    .from("workspaces")
    .select("id, owner_user_id, name, created_at")
    .eq("owner_user_id", userId)
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing) return existing as WorkspaceRow;

  const { data: inserted, error: insErr } = await supabase
    .from("workspaces")
    .insert({ owner_user_id: userId, name: "My workspace" })
    .select("id, owner_user_id, name, created_at")
    .maybeSingle();

  if (!insErr && inserted) return inserted as WorkspaceRow;

  // If unique constraint raced, re-select.
  const msg = (insErr as { message?: string } | null)?.message ?? "";
  if (/duplicate key value|unique/i.test(msg)) {
    const { data: retry, error: retryErr } = await supabase
      .from("workspaces")
      .select("id, owner_user_id, name, created_at")
      .eq("owner_user_id", userId)
      .maybeSingle();
    if (retryErr) throw retryErr;
    if (retry) return retry as WorkspaceRow;
  }

  if (insErr) throw insErr;
  throw new Error("Could not create workspace.");
}

