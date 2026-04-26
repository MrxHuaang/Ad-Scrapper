"use client";

import { createClient } from "@/lib/supabase/client";
import { getOrCreateMyWorkspace } from "@/lib/workspaces/workspaces";

export type AircraftRow = {
  id: string;
  workspace_id: string;
  registration: string;
  make: string;
  model: string;
  serial: string;
  created_at: string;
};

function normalizeRegistration(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, "");
}

export async function listAircraft(): Promise<AircraftRow[]> {
  const supabase = createClient();
  const ws = await getOrCreateMyWorkspace();
  const { data, error } = await supabase
    .from("aircraft")
    .select("id, workspace_id, registration, make, model, serial, created_at")
    .eq("workspace_id", ws.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AircraftRow[];
}

export async function getAircraft(id: string): Promise<AircraftRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("aircraft")
    .select("id, workspace_id, registration, make, model, serial, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as AircraftRow | null;
}

export async function createAircraft(input: {
  registration: string;
  make?: string;
  model?: string;
  serial?: string;
}): Promise<AircraftRow> {
  const supabase = createClient();
  const ws = await getOrCreateMyWorkspace();

  const payload = {
    workspace_id: ws.id,
    registration: normalizeRegistration(input.registration),
    make: (input.make ?? "").trim(),
    model: (input.model ?? "").trim(),
    serial: (input.serial ?? "").trim(),
  };

  const { data, error } = await supabase
    .from("aircraft")
    .insert(payload)
    .select("id, workspace_id, registration, make, model, serial, created_at")
    .single();
  if (error) throw error;
  return data as AircraftRow;
}

export async function updateAircraft(
  id: string,
  patch: Partial<Pick<AircraftRow, "registration" | "make" | "model" | "serial">>,
): Promise<AircraftRow> {
  const supabase = createClient();
  const payload: Record<string, string> = {};
  if (patch.registration != null) payload.registration = normalizeRegistration(patch.registration);
  if (patch.make != null) payload.make = patch.make.trim();
  if (patch.model != null) payload.model = patch.model.trim();
  if (patch.serial != null) payload.serial = patch.serial.trim();

  const { data, error } = await supabase
    .from("aircraft")
    .update(payload)
    .eq("id", id)
    .select("id, workspace_id, registration, make, model, serial, created_at")
    .single();
  if (error) throw error;
  return data as AircraftRow;
}

export async function deleteAircraft(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("aircraft").delete().eq("id", id);
  if (error) throw error;
}

