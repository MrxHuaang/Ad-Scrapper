"use client";

import { createClient } from "@/lib/supabase/client";

export type AdKey = { adNumber: string; source: string };

export type SavedAdSnapshot = {
  subject?: string;
  pdf_link?: string;
  make?: string;
  model?: string;
  effective_date?: string;
  status?: string;
  product_type?: string;
};

async function requireUserId() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error("You must be signed in to save AD state.");
  return { supabase, userId };
}

export async function getMyAdState(ad: AdKey) {
  const { supabase, userId } = await requireUserId();
  const [{ data: saved }, { data: reviewed }, { data: notes }] =
    await Promise.all([
      supabase
        .from("ad_saved")
        .select("created_at")
        .eq("user_id", userId)
        .eq("ad_number", ad.adNumber)
        .maybeSingle(),
      supabase
        .from("ad_reviewed")
        .select("reviewed_at")
        .eq("user_id", userId)
        .eq("ad_number", ad.adNumber)
        .maybeSingle(),
      supabase
        .from("ad_notes")
        .select("id, body, updated_at")
        .eq("user_id", userId)
        .eq("ad_number", ad.adNumber)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  return {
    isSaved: Boolean(saved),
    isReviewed: Boolean(reviewed),
    noteId: notes?.id ?? null,
    noteBody: notes?.body ?? "",
    noteUpdatedAt: notes?.updated_at ?? null,
  };
}

export async function toggleSaveAd(ad: AdKey, nextSaved: boolean, snapshot?: SavedAdSnapshot) {
  const { supabase, userId } = await requireUserId();
  if (nextSaved) {
    const baseRow = {
      user_id: userId,
      ad_number: ad.adNumber,
      source: ad.source,
    };
    const { error } = await supabase.from("ad_saved").insert({
      ...baseRow,
      ...(snapshot ?? {}),
    });
    if (error) {
      // If snapshot columns aren't present yet, fall back to the minimal insert.
      const msg = (error as { message?: string } | null)?.message ?? "";
      if (/column .* does not exist/i.test(msg) || /schema cache/i.test(msg)) {
        const { error: retry } = await supabase.from("ad_saved").insert(baseRow);
        if (retry) throw retry;
      } else {
        throw error;
      }
    }
    return;
  }

  const { error } = await supabase
    .from("ad_saved")
    .delete()
    .eq("user_id", userId)
    .eq("ad_number", ad.adNumber);
  if (error) throw error;
}

export async function updateMySavedAdSnapshot(adNumber: string, snapshot: SavedAdSnapshot) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from("ad_saved")
    .update(snapshot)
    .eq("user_id", userId)
    .eq("ad_number", adNumber);
  if (error) throw error;
}

export type SavedAdRow = {
  ad_number: string;
  source: string;
  created_at: string;
  subject: string | null;
  pdf_link: string | null;
  make: string | null;
  model: string | null;
  effective_date: string | null;
  status: string | null;
  product_type: string | null;
};

export async function listMySavedAds(): Promise<SavedAdRow[]> {
  const { supabase, userId } = await requireUserId();
  const fullSelect =
    "ad_number, source, created_at, subject, pdf_link, make, model, effective_date, status, product_type";

  const { data, error } = await supabase
    .from("ad_saved")
    .select(fullSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    const msg = (error as { message?: string } | null)?.message ?? "";
    if (/column .* does not exist/i.test(msg) || /schema cache/i.test(msg)) {
      const { data: basic, error: basicErr } = await supabase
        .from("ad_saved")
        .select("ad_number, source, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (basicErr) throw basicErr;
      return ((basic ?? []) as Array<{ ad_number: string; source: string; created_at: string }>).map(
        (r) => ({
          ...r,
          subject: null,
          pdf_link: null,
          make: null,
          model: null,
          effective_date: null,
          status: null,
          product_type: null,
        }),
      );
    }
    throw error;
  }

  return (data ?? []) as SavedAdRow[];
}

export async function getMySavedAdByNumber(adNumber: string): Promise<SavedAdRow | null> {
  const { supabase, userId } = await requireUserId();
  const fullSelect =
    "ad_number, source, created_at, subject, pdf_link, make, model, effective_date, status, product_type";

  const { data, error } = await supabase
    .from("ad_saved")
    .select(fullSelect)
    .eq("user_id", userId)
    .eq("ad_number", adNumber)
    .maybeSingle();

  if (error) {
    const msg = (error as { message?: string } | null)?.message ?? "";
    if (/column .* does not exist/i.test(msg) || /schema cache/i.test(msg)) {
      const { data: basic, error: basicErr } = await supabase
        .from("ad_saved")
        .select("ad_number, source, created_at")
        .eq("user_id", userId)
        .eq("ad_number", adNumber)
        .maybeSingle();
      if (basicErr) throw basicErr;
      if (!basic) return null;
      return {
        ...basic,
        subject: null,
        pdf_link: null,
        make: null,
        model: null,
        effective_date: null,
        status: null,
        product_type: null,
      } as SavedAdRow;
    }
    throw error;
  }

  return (data ?? null) as SavedAdRow | null;
}

export async function toggleReviewedAd(ad: AdKey, nextReviewed: boolean) {
  const { supabase, userId } = await requireUserId();
  if (nextReviewed) {
    const { error } = await supabase.from("ad_reviewed").insert({
      user_id: userId,
      ad_number: ad.adNumber,
      source: ad.source,
    });
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("ad_reviewed")
    .delete()
    .eq("user_id", userId)
    .eq("ad_number", ad.adNumber);
  if (error) throw error;
}

export type ReviewedAdRow = {
  ad_number: string;
  source: string;
  reviewed_at: string;
};

export async function listMyReviewedAds(limit = 20): Promise<ReviewedAdRow[]> {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("ad_reviewed")
    .select("ad_number, source, reviewed_at")
    .eq("user_id", userId)
    .order("reviewed_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ReviewedAdRow[];
}

export async function upsertAdNote(ad: AdKey, body: string, noteId?: string) {
  const { supabase, userId } = await requireUserId();

  if (noteId) {
    const { error } = await supabase
      .from("ad_notes")
      .update({ body })
      .eq("user_id", userId)
      .eq("id", noteId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("ad_notes").insert({
    user_id: userId,
    ad_number: ad.adNumber,
    source: ad.source,
    body,
  });
  if (error) throw error;
}

