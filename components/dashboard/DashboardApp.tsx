"use client";

export const dynamic = "force-dynamic";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, X, Zap } from "lucide-react";
import type { ADResult, SearchParams } from "@/types";
import type { SourceKey } from "@/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  isValidDashboardTabId,
  pathForTab,
  tabFromSection,
  type DashboardTabId,
} from "@/lib/dashboard-routes";
import { useAdSearch } from "@/hooks/useAdSearch";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { showToast } from "@/hooks/useToast";

import { SearchForm } from "@/components/search/SearchForm";
import { SearchStatus } from "@/components/search/SearchStatus";
import { ResultsHeader } from "@/components/search/ResultsHeader";
import { ResultsTable } from "@/components/search/ResultsTable";
import { ADCard } from "@/components/search/ADCard";
import { Pagination } from "@/components/search/Pagination";
import { BulkBar } from "@/components/search/BulkBar";
import { getSortedResults } from "@/components/search/searchUtils";
import { StatCards } from "@/components/dashboard/StatCards";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AircraftDashboardView } from "@/components/aircraft/AircraftDashboardView";
import { SOURCE_KEYS } from "@/types";
import { listMySavedAds } from "@/lib/ads/adPersistence";
import Link from "next/link";

/* ───── Source pill config ───── */
const SOURCES: { key: SourceKey; label: string; flag?: string; color?: string; comingSoon?: boolean }[] = [
  { key: "all",                label: "All sources",    color: "#ffffff" },
  { key: "federal_register",   label: "FAA",  flag: "🇺🇸", color: "#e8b84b" },
  { key: "easa",               label: "EASA", flag: "🇪🇺", color: "#e8b84b" },
  { key: "transport_canada",   label: "TCCA", flag: "🇨🇦", color: "#e8b84b" },
  { key: "anac_brazil",        label: "ANAC BR", flag: "🇧🇷", color: "#e8b84b" },
  { key: "anac_argentina",     label: "ANAC AR", flag: "🇦🇷", color: "#e8b84b" },
  { key: "dgac_chile",         label: "DGAC",  flag: "🇨🇱", color: "#e8b84b" },
  { key: "casa_australia",     label: "CASA",  flag: "🇦🇺", color: "#e8b84b", comingSoon: true },
  { key: "gcaa_uae",           label: "GCAA",  flag: "🇦🇪", color: "#e8b84b", comingSoon: true },
];

/* ───── Animation variants ───── */
const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};

const SESSION_KEY = "zephr_session";
const SESSION_TTL = 30 * 60 * 1000;

function sectionFromParams(params: { section?: string | string[] } | null): string[] | undefined {
  if (!params) return undefined;
  const r = params.section;
  if (r === undefined || r === null) return undefined;
  return Array.isArray(r) ? r : [r];
}

/* ───── Page (`/dashboard`, `/dashboard/search`, …) ───── */
function DashboardAppInner() {
  const router = useRouter();
  const params = useParams();
  const section = useMemo(
    () => sectionFromParams(params as { section?: string | string[] }),
    [params],
  );
  const sp = useSearchParams();
  const { search, results: sseResults, status, errors, elapsedMs } = useAdSearch();
  const { selectedSource, setSelectedSource, setSearchStatus, setResultCount, setElapsedMs: setSidebarMs } = useSidebar();

  const [activeTab, setActiveTab] = useState<DashboardTabId>(
    () => tabFromSection(section) ?? "dashboard",
  );
  const [results, setResults] = useState<ADResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ADResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState("_relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24; // divisible by 2 and 3 for the grid
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [quickFilter, setQuickFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearchMs, setLastSearchMs] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [restoredCount, setRestoredCount] = useState(0);
  const [restoredAgo, setRestoredAgo] = useState(0);
  const [dashboardQuery, setDashboardQuery] = useState("");
  const [savedAds, setSavedAds] = useState<Awaited<ReturnType<typeof listMySavedAds>>>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [prefillMake, setPrefillMake] = useState("");
  const [prefillModel, setPrefillModel] = useState("");

  // URL segment <-> tab; prefill make/model from query.
  useEffect(() => {
    if (section && section.length > 1) {
      router.replace(pathForTab(section[0] ?? "dashboard"));
      return;
    }
    const t = tabFromSection(section);
    if (t) {
      setActiveTab(t);
    } else if (section?.length === 1) {
      router.replace("/dashboard");
      setActiveTab("dashboard");
    }
    const mk = sp.get("make");
    const mo = sp.get("model");
    if (mk) setPrefillMake(mk);
    if (mo) setPrefillModel(mo);
  }, [section, sp, router]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!isValidDashboardTabId(tab)) return;
      setActiveTab(tab);
      router.replace(pathForTab(tab));
    },
    [router],
  );

  useEffect(() => {
    if (activeTab !== "saved") return;
    let cancelled = false;
    setSavedLoading(true);
    (async () => {
      try {
        const rows = await listMySavedAds();
        if (!cancelled) setSavedAds(rows);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Could not load saved ADs";
        showToast(msg, "error");
      } finally {
        if (!cancelled) setSavedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  /* Restore from sessionStorage */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const { results: r, timestamp } = JSON.parse(raw);
      const age = Date.now() - timestamp;
      if (age < SESSION_TTL && Array.isArray(r) && r.length > 0) {
        setResults(r);
        setHasSearched(true);
        setRestoredCount(r.length);
        setRestoredAgo(Math.round(age / 60_000));
        setShowRestoreBanner(true);
      }
    } catch { /* ignore */ }
  }, []);

  /* Sync SSE */
  useEffect(() => { setResults(sseResults); }, [sseResults]);

  /* Sync status */
  useEffect(() => {
    setSearchStatus(status);
    setResultCount(sseResults.length);
    setSidebarMs(elapsedMs);
    if (status === "searching") setIsSearching(true);
    if (status === "done" || status === "error") {
      setIsSearching(false);
      setLastSearchMs(elapsedMs);
      if (sseResults.length > 0) {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify({ results: sseResults, timestamp: Date.now() }));
        } catch { /* ignore */ }
      }
    }
  }, [status, sseResults.length, elapsedMs, errors, setSearchStatus, setResultCount, setSidebarMs, sseResults]);

  /* Quick filter */
  useEffect(() => {
    if (!quickFilter) { setFilteredResults(null); return; }
    const q = quickFilter.toLowerCase();
    setFilteredResults(
      results.filter((r) =>
        r.AD_Number?.toLowerCase().includes(q) ||
        r.Make?.toLowerCase().includes(q) ||
        r.Model?.toLowerCase().includes(q) ||
        r.Subject?.toLowerCase().includes(q),
      ),
    );
    setCurrentPage(1);
  }, [quickFilter, results]);

  const activeResults = filteredResults ?? results;
  const topbarFiltered = useMemo(() => {
    const q = dashboardQuery.trim().toLowerCase();
    if (!q) return activeResults;
    return activeResults.filter((r) => {
      return (
        r.AD_Number?.toLowerCase().includes(q) ||
        r.Make?.toLowerCase().includes(q) ||
        r.Model?.toLowerCase().includes(q) ||
        r.Subject?.toLowerCase().includes(q)
      );
    });
  }, [activeResults, dashboardQuery]);

  const sorted = useMemo(
    () => getSortedResults(topbarFiltered, sortField, sortOrder, searchTerm),
    [topbarFiltered, sortField, sortOrder, searchTerm],
  );
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageResults = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = useCallback((params: SearchParams) => {
    setResults([]);
    setFilteredResults(null);
    setSelectedIds(new Set());
    setHasSearched(true);
    setShowRestoreBanner(false);
    setCurrentPage(1);
    setSearchTerm([params.keyword, params.make, params.model].filter(Boolean).join(" "));
    search({ ...params, source: selectedSource });
  }, [search, selectedSource]);

  const handleToggleSelect = useCallback((adNumber: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(adNumber)) next.delete(adNumber);
      else next.add(adNumber);
      return next;
    });
  }, []);

  const handleSort = useCallback((field: string) => {
    if (field === sortField) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortOrder("desc"); }
  }, [sortField]);

  async function exportResults(format: "csv" | "excel") {
    const data = filteredResults ?? results;
    if (data.length === 0) return;
    try {
      const res = await fetch(`/api/proxy/export/${format}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: data }),
      });
      if (!res.ok) { showToast("Export failed", "error"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ad_results_${Date.now()}.${format === "excel" ? "xlsx" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported as ${format.toUpperCase()}`, "success");
    } catch { showToast("Export failed", "error"); }
  }

  async function exportSelected(format: "csv" | "excel") {
    const data = results.filter((r) => selectedIds.has(r.AD_Number));
    if (data.length === 0) return;
    try {
      const res = await fetch(`/api/proxy/export/${format}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: data }),
      });
      if (!res.ok) { showToast("Export failed", "error"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ad_selected_${Date.now()}.${format === "excel" ? "xlsx" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`${selectedIds.size} rows exported`, "success");
    } catch { showToast("Export failed", "error"); }
  }

  const activeSource = SOURCES.find((s) => s.key === selectedSource);

  return (
    <DashboardShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      query={dashboardQuery}
      onQueryChange={setDashboardQuery}
      results={topbarFiltered}
      configuredAuthorities={SOURCE_KEYS.filter((k) => k !== "all").map((k) => k)}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-6">
          {/* Stats Overview */}
          {activeTab === "dashboard" && (
            <div className="mb-8">
              <StatCards results={topbarFiltered} />
            </div>
          )}

          {activeTab === "search" && (
            <div>
              {/* ══ Search UI ══ */}
              <div className="mb-8">
                <div className="mx-auto max-w-4xl">
                  <div className="mb-6">
                    <SearchForm
                      onSearch={handleSearch}
                      isSearching={isSearching}
                      defaultValues={{ make: prefillMake, model: prefillModel }}
                    />
                  </div>

                  {/* Source pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {SOURCES.map((s) => {
                      const isActive = selectedSource === s.key;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => !s.comingSoon && setSelectedSource(s.key)}
                          disabled={s.comingSoon}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-35"
                          style={
                            isActive
                              ? {
                                  background: "rgba(232, 184, 75, 0.1)",
                                  border: "1px solid rgba(232, 184, 75, 0.4)",
                                  color: "#e8b84b",
                                }
                              : {
                                  background: "rgba(255,255,255,0.03)",
                                  border: "1px solid rgba(255,255,255,0.06)",
                                  color: "rgba(255,255,255,0.4)",
                                }
                          }
                        >
                          {s.flag && <span>{s.flag}</span>}
                          {s.label}
                          {s.comingSoon && <span className="text-[9px] opacity-60">soon</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ══ Results ══ */}
              <div className="pb-24">
                <SearchStatus status={status} count={results.length} ms={elapsedMs} errors={errors} />

                {showRestoreBanner && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm glass border-white/5">
                    <Clock size={13} className="text-white/35" />
                    <span className="text-white/50">
                      Previous session — {restoredCount} ADs · {restoredAgo}m ago
                    </span>
                    <button type="button" onClick={() => { setShowRestoreBanner(false); setResults([]); setHasSearched(false); }} className="ml-auto cursor-pointer text-xs font-semibold text-[#e8b84b] hover:text-[#e8b84b]/80 transition-colors">
                      Clear
                    </button>
                    <button type="button" onClick={() => setShowRestoreBanner(false)} className="cursor-pointer text-white/25 hover:text-white/60 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                )}

                {hasSearched && results.length > 0 && (
                  <div id="results-section">
                    <div className="mb-6">
                      <ResultsHeader
                        total={results.length}
                        filtered={
                          filteredResults
                            ? filteredResults.length
                            : dashboardQuery.trim()
                              ? topbarFiltered.length
                              : null
                        }
                        lastSearchMs={lastSearchMs}
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                        quickFilter={quickFilter}
                        onQuickFilterChange={setQuickFilter}
                        onExportCsv={() => exportResults("csv")}
                        onExportExcel={() => exportResults("excel")}
                      />
                    </div>

                    {selectedSource !== "all" && activeSource && (
                      <p className="zl-text-spectrum mb-6 text-[13px] font-medium">
                        {activeSource.flag} Showing compliance for {activeSource.label}
                      </p>
                    )}

                    {viewMode === "cards" ? (
                      <motion.div
                        key={`cards-p${currentPage}`}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        variants={cardContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {pageResults.map((ad) => (
                          <motion.div key={ad.AD_Number} variants={cardItem}>
                            <ADCard
                              ad={ad}
                              isSelected={selectedIds.has(ad.AD_Number)}
                              onToggle={handleToggleSelect}
                              searchTerm={searchTerm}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="glass overflow-hidden rounded-2xl border-white/5">
                        <ResultsTable
                          results={pageResults}
                          selectedIds={selectedIds}
                          onToggleSelect={handleToggleSelect}
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                          searchTerm={searchTerm}
                        />
                      </div>
                    )}

                    <div className="mt-10">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                  </div>
                )}

                {hasSearched && !isSearching && results.length === 0 && status !== "idle" && (
                  <div className="flex flex-col items-center gap-6 py-32 text-center">
                    <div>
                      <p className="text-lg font-medium text-white/70 mb-2">No directives found</p>
                      <p className="text-sm text-white/40 max-w-sm mx-auto">
                        Try adjusting your search criteria or selecting different authorities
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setResults([]);
                          setHasSearched(false);
                        }}
                        className="px-4 py-2 text-sm rounded-lg border border-white/10 text-white/60 hover:bg-white/[0.03] transition-colors"
                      >
                        Clear search
                      </button>
                      <button
                        onClick={() => setSelectedSource("all")}
                        className="px-4 py-2 text-sm rounded-lg border border-[#e8b84b]/30 bg-[#e8b84b]/5 text-[#e8b84b] hover:bg-[#e8b84b]/10 transition-colors"
                      >
                        View all sources
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="pb-24">
              <div className="glass rounded-2xl border-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/80">Saved ADs</p>
                    <p className="mt-1 text-xs text-white/35">
                      Your saved directives, synced to your account.
                    </p>
                  </div>
                  <p className="text-xs text-white/35">
                    {savedLoading ? "Loading…" : `${savedAds.length} saved`}
                  </p>
                </div>

                <div className="mt-4 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5">
                  {savedLoading ? (
                    <div className="p-4 text-sm text-white/40">Loading saved ADs…</div>
                  ) : savedAds.length === 0 ? (
                    <div className="p-4 text-sm text-white/40">
                      No saved ADs yet. Open an AD and click “Save”.
                    </div>
                  ) : (
                    savedAds.map((row) => {
                      const qs = new URLSearchParams();
                      qs.set("source", row.source);
                      qs.set("from", "saved");
                      if (row.pdf_link) qs.set("pdf", row.pdf_link);
                      if (row.subject) qs.set("subject", row.subject);
                      if (row.make) qs.set("make", row.make);
                      if (row.model) qs.set("model", row.model);
                      if (row.effective_date) qs.set("effective", row.effective_date);
                      if (row.status) qs.set("status", row.status);
                      if (row.product_type) qs.set("product", row.product_type);

                      return (
                        <Link
                          key={`${row.source}:${row.ad_number}`}
                          href={`/ads/${encodeURIComponent(row.ad_number)}?${qs.toString()}`}
                          className="group flex cursor-pointer items-start justify-between gap-4 bg-white/[0.01] p-4 hover:bg-white/[0.03]"
                        >
                          <div className="min-w-0">
                            <p className="font-mono text-sm text-white/85">{row.ad_number}</p>
                            <p className="mt-1 truncate text-sm text-white/45">
                              {row.subject || "No subject"}
                            </p>
                            <p className="mt-2 text-[11px] text-white/30">
                              {(row.source || "—") +
                                (row.make ? ` · ${row.make}` : "") +
                                (row.model ? ` · ${row.model}` : "") +
                                (row.effective_date ? ` · Effective ${row.effective_date}` : "")}
                            </p>
                          </div>
                          <div className="shrink-0 text-xs text-white/25 group-hover:text-white/45">
                            Open →
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "aircraft" && (
            <AircraftDashboardView />
          )}

          {activeTab !== "search" && activeTab !== "saved" && activeTab !== "aircraft" && activeTab !== "dashboard" && (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <Zap size={64} className="mb-6 text-[#e8b84b]" />
              <p className="text-xl font-serif">Module coming soon</p>
            </div>
          )}
        </div>
      <BulkBar
        selectedCount={selectedIds.size}
        hasActiveFilter={quickFilter.length > 0 || dashboardQuery.trim().length > 0}
        onExportCsv={() => exportSelected("csv")}
        onExportExcel={() => exportSelected("excel")}
        onExportZip={() => showToast("PDF bulk download coming soon", "info")}
        onDeselect={() => setSelectedIds(new Set())}
      />
    </DashboardShell>
  );
}

export function DashboardApp() {
  return (
    <Suspense fallback={null}>
      <DashboardAppInner />
    </Suspense>
  );
}
