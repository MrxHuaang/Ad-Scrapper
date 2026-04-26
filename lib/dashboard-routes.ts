/**
 * First URL segment under `/dashboard` (optional catch-all). The overview is `/dashboard` with no segment.
 * The path `/dashboard/dashboard` is invalid.
 */
export const DASHBOARD_PATH_SEGMENTS = [
  "search",
  "aircraft",
  "saved",
  "watchlist",
  "exports",
  "alerts",
  "bulletins",
  "analytics",
] as const;

export const DASHBOARD_TAB_IDS = [
  "dashboard",
  ...DASHBOARD_PATH_SEGMENTS,
] as const;

export type DashboardPathSegment = (typeof DASHBOARD_PATH_SEGMENTS)[number];
export type DashboardTabId = (typeof DASHBOARD_TAB_IDS)[number];

function isPathSegmentString(s: string): s is DashboardPathSegment {
  return (DASHBOARD_PATH_SEGMENTS as readonly string[]).includes(s);
}

function isTabIdString(s: string): s is DashboardTabId {
  return (DASHBOARD_TAB_IDS as readonly string[]).includes(s);
}

export function pathForTab(tab: string): string {
  if (tab === "dashboard") return "/dashboard";
  if (isPathSegmentString(tab)) return `/dashboard/${tab}`;
  return "/dashboard";
}

/**
 * @param section - `useParams().section` from `[[...section]]` (undefined = `/dashboard` only)
 */
export function tabFromSection(section: string[] | undefined): DashboardTabId | null {
  if (!section || section.length === 0) return "dashboard";
  if (section.length > 1) return null;
  const s = (section[0] ?? "").toLowerCase();
  if (s === "dashboard") return null;
  if (isPathSegmentString(s) && isTabIdString(s)) return s;
  return null;
}

export function isValidDashboardTabId(tab: string): tab is DashboardTabId {
  return isTabIdString(tab);
}
