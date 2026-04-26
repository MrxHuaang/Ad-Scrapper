"use client";

import { createClient } from "@/lib/supabase/client";

export async function getMakeSuggestions(): Promise<string[]> {
  const supabase = createClient();
  // Get unique makes from ad_saved where make is not null
  const { data, error } = await supabase
    .from("ad_saved")
    .select("make")
    .not("make", "is", null)
    .neq("make", "");

  if (error) {
    console.error("Error fetching make suggestions:", error);
    return [];
  }

  // Deduplicate and sort
  const uniqueMakes = Array.from(new Set(data.map(r => r.make))).sort() as string[];
  return uniqueMakes;
}

export async function getModelSuggestions(make: string): Promise<string[]> {
  if (!make) return [];
  
  const supabase = createClient();
  // Get unique models from ad_saved for a specific make
  const { data, error } = await supabase
    .from("ad_saved")
    .select("model")
    .eq("make", make)
    .not("model", "is", null)
    .neq("model", "");

  if (error) {
    console.error("Error fetching model suggestions:", error);
    return [];
  }

  // Deduplicate and sort
  const uniqueModels = Array.from(new Set(data.map(r => r.model))).sort() as string[];
  return uniqueModels;
}
