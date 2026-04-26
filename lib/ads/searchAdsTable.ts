"use client";

import { createClient } from "@/lib/supabase/client";
import type { ADResult } from "@/types";

/**
 * Query the global `ads` table (populated by the scraper) for ADs matching
 * a make and/or model string. Uses ilike for fuzzy prefix matching.
 */
export async function queryAdsTable(
  make: string,
  model: string,
  limit = 100,
): Promise<ADResult[]> {
  const supabase = createClient();

  let query = supabase
    .from("ads")
    .select(
      "ad_number, source, subject, make, model, effective_date, status, product_type, docket, pdf_link",
    )
    .limit(limit);

  if (make.trim()) {
    query = query.ilike("make", `%${make.trim()}%`);
  }
  if (model.trim()) {
    query = query.ilike("model", `%${model.trim()}%`);
  }
  if (!make.trim() && !model.trim()) {
    return [];
  }

  const { data, error } = await query.order("effective_date", {
    ascending: false,
    nullsFirst: false,
  });

  if (error) throw error;

  return ((data ?? []) as Array<{
    ad_number: string;
    source: string;
    subject: string | null;
    make: string | null;
    model: string | null;
    effective_date: string | null;
    status: string | null;
    product_type: string | null;
    docket: string | null;
    pdf_link: string | null;
  }>).map((r) => ({
    AD_Number: r.ad_number,
    Source: r.source,
    Subject: r.subject ?? "",
    Make: r.make ?? "",
    Model: r.model ?? "",
    Effective_Date: r.effective_date ?? "",
    Status: r.status ?? "",
    Product_Type: r.product_type ?? "",
    Docket: r.docket ?? "",
    PDF_Link: r.pdf_link ?? "",
  }));
}
