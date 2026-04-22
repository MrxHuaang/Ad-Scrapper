"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, X, List, LayoutGrid, Zap } from "lucide-react";
import type { ADResult, SearchParams } from "@/types";
import type { SourceKey } from "@/types";
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
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCards } from "@/components/dashboard/StatCards";

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

/* ───── Page ───── */
export default function SearchPage() {
  const { search, results: sseResults, status, errors, elapsedMs } = useAdSearch();
  const { selectedSource, setSelectedSource, setSearchStatus, setResultCount, setElapsedMs: setSidebarMs } = useSidebar();

  const [activeTab, setActiveTab] = useState("search");
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
  const [lastErrors, setLastErrors] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [restoredCount, setRestoredCount] = useState(0);
  const [restoredAgo, setRestoredAgo] = useState(0);

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
      setLastErrors(errors);
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
  const sorted = useMemo(() => getSortedResults(activeResults, sortField, sortOrder, searchTerm), [activeResults, sortField, sortOrder, searchTerm]);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageResults = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = useCallback((params: SearchParams) => {
    setResults([]);
    setFilteredResults(null);
    setSelectedIds(new Set());
    setLastErrors([]);
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
    <div className="flex h-dvh overflow-hidden bg-black">
      {/* ══ Dashboard Sidebar ══ */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ══ Main Content ══ */}
      <main className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="mx-auto max-w-[1400px] px-8 py-8">
          
          {/* Dashboard Header */}
          <header className="mb-10 flex items-end justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-serif text-4xl font-semibold text-white"
              >
                {activeTab === "search" ? "Search Engine" : "Fleet Overview"}
              </motion.h1>
              <p className="mt-1 text-sm text-white/30 font-medium">
                Tuesday, April 21 · <span className="text-[#e8b84b]">Updated 4h ago</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="btn-glass btn-sm border-white/5 bg-white/[0.02] text-white/40">
                Export Fleet Report
              </button>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="mb-12">
            <StatCards />
          </div>

          {activeTab === "search" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* ══ Search UI ══ */}
              <div className="mb-10">
                <div className="mx-auto max-w-4xl">
                  <div className="mb-6">
                    <SearchForm onSearch={handleSearch} isSearching={isSearching} />
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
                        filtered={filteredResults ? filteredResults.length : null}
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
                  <div className="flex flex-col items-center gap-4 py-24 text-center glass rounded-3xl border-white/5">
                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] text-3xl">✈️</div>
                    <p className="text-lg font-medium text-white/60 font-serif">No directives found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab !== "search" && (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <Zap size={64} className="mb-6 text-[#e8b84b]" />
              <p className="text-xl font-serif">Module coming soon</p>
            </div>
          )}
        </div>
      </main>

      <BulkBar
        selectedCount={selectedIds.size}
        hasActiveFilter={quickFilter.length > 0}
        onExportCsv={() => exportSelected("csv")}
        onExportExcel={() => exportSelected("excel")}
        onExportZip={() => showToast("PDF bulk download coming soon", "info")}
        onDeselect={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
