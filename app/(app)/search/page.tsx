import { redirect } from "next/navigation";
import { DASHBOARD_PATH_SEGMENTS, pathForTab } from "@/lib/dashboard-routes";

/**
 * `/search` is legacy. Maps to `/dashboard/...` and preserves other query (e.g. make/model).
 */
export default async function LegacySearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const tab = typeof p.tab === "string" ? p.tab : undefined;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (k === "tab") continue;
    if (typeof v === "string" && v.length) qs.set(k, v);
  }
  const q = qs.toString();
  const suffix = q ? `?${q}` : "";

  if (!tab) {
    redirect(`/dashboard/search${suffix}`);
  }
  if (tab === "search") {
    redirect(`/dashboard/search${suffix}`);
  }
  if (tab === "dashboard") {
    redirect(suffix ? `/dashboard${suffix}` : "/dashboard");
  }
  if ((DASHBOARD_PATH_SEGMENTS as readonly string[]).includes(tab)) {
    redirect(`${pathForTab(tab)}${suffix}`);
  }
  redirect(`/dashboard/search${suffix}`);
}
