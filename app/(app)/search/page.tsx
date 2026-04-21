"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ADResult, SearchParams } from "@/types";
import { useAdSearch } from "@/hooks/useAdSearch";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { showToast } from "@/hooks/useToast";

import { SearchForm } from "@/components/search/SearchForm";
import { SearchStatus } from "@/components/search/SearchStatus";
import { ResultsTable } from "@/components/search/ResultsTable";
import { CardsView } from "@/components/search/CardsView";
import { ResultsHeader } from "@/components/search/ResultsHeader";
import { Pagination } from "@/components/search/Pagination";
import { BulkBar } from "@/components/search/BulkBar";
import { getSortedResults } from "@/components/search/searchUtils";
import { Clock, X } from "lucide-react";

/* ───── Session Storage helpers ───── */
const SESSION_KEY = "zephr_session";
const SESSION_TTL = 30 * 60 * 1000; // 30 min

/* ───── Page Component ───── */
export default function SearchPage() {
  /* SSE hook */
  const { search, results: sseResults, status, errors, elapsedMs } = useAdSearch();

  /* Sidebar context */
  const {
    selectedSource,
    setSearchStatus,
    setResultCount,
    setElapsedMs: setSidebarMs,
  } = useSidebar();

  /* ───── Local state ───── */
  const [results, setResults] = useState<ADResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ADResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState("_relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [quickFilter, setQuickFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearchMs, setLastSearchMs] = useState<number | null>(null);
  const [lastErrors, setLastErrors] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  /* Restore banner */
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [restoredCount, setRestoredCount] = useState(0);
  const [restoredAgo, setRestoredAgo] = useState(0);

  /* ───── Restore from sessionStorage on mount ───── */
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
    } catch {
      /* invalid stored data — ignore */
    }
  }, []);

  /* ───── Sync SSE results → local state ───── */
  useEffect(() => {
    setResults(sseResults);
  }, [sseResults]);

  /* ───── Sync status → sidebar + local ───── */
  useEffect(() => {
    setSearchStatus(status);
    setResultCount(sseResults.length);
    setSidebarMs(elapsedMs);

    if (status === "searching") {
      setIsSearching(true);
    }

    if (status === "done" || status === "error") {
      setIsSearching(false);
      setLastSearchMs(elapsedMs);
      setLastErrors(errors);

      // Persist to sessionStorage
      if (sseResults.length > 0) {
        try {
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
              results: sseResults,
              timestamp: Date.now(),
            }),
          );
        } catch {
          /* quota exceeded — ignore */
        }
      }
    }
  }, [status, sseResults.length, elapsedMs, errors, setSearchStatus, setResultCount, setSidebarMs, sseResults]);

  /* ───── Quick filter ───── */
  useEffect(() => {
    if (!quickFilter) {
      setFilteredResults(null);
      return;
    }
    const q = quickFilter.toLowerCase();
    setFilteredResults(
      results.filter(
        (r) =>
          r.AD_Number?.toLowerCase().includes(q) ||
          r.Make?.toLowerCase().includes(q) ||
          r.Model?.toLowerCase().includes(q) ||
          r.Subject?.toLowerCase().includes(q),
      ),
    );
    setCurrentPage(1);
  }, [quickFilter, results]);

  /* ───── Derived data ───── */
  const activeResults = filteredResults ?? results;

  const sorted = useMemo(
    () => getSortedResults(activeResults, sortField, sortOrder, searchTerm),
    [activeResults, sortField, sortOrder, searchTerm],
  );

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageResults = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  /* ───── Handlers ───── */
  const handleSearch = useCallback(
    (params: SearchParams) => {
      setResults([]);
      setFilteredResults(null);
      setSelectedIds(new Set());
      setLastErrors([]);
      setHasSearched(true);
      setShowRestoreBanner(false);
      setCurrentPage(1);
      setSearchTerm(
        [params.keyword, params.make, params.model].filter(Boolean).join(" "),
      );

      search({ ...params, source: selectedSource });
    },
    [search, selectedSource],
  );

  const handleToggleSelect = useCallback((adNumber: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(adNumber)) next.delete(adNumber);
      else next.add(adNumber);
      return next;
    });
  }, []);

  const handleSort = useCallback(
    (field: string) => {
      if (field === sortField) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
    },
    [sortField],
  );

  /* ───── Export ───── */
  async function exportResults(format: "csv" | "excel") {
    const data = filteredResults ?? results;
    if (data.length === 0) return;
    try {
      const response = await fetch(`/api/proxy/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: data }),
      });
      if (!response.ok) {
        showToast("Export failed", "error");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ad_results_${Date.now()}.${format === "excel" ? "xlsx" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported as ${format.toUpperCase()}`, "success");
    } catch {
      showToast("Export failed", "error");
    }
  }

  async function exportSelected(format: "csv" | "excel") {
    const data = results.filter((r) => selectedIds.has(r.AD_Number));
    if (data.length === 0) return;
    try {
      const response = await fetch(`/api/proxy/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: data }),
      });
      if (!response.ok) {
        showToast("Export failed", "error");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ad_selected_${Date.now()}.${format === "excel" ? "xlsx" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`${selectedIds.size} rows exported`, "success");
    } catch {
      showToast("Export failed", "error");
    }
  }

  /* ───── Render ───── */
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search Form */}
      <SearchForm
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      {/* Search Status (live counter) */}
      <SearchStatus
        status={status}
        count={results.length}
        ms={elapsedMs}
        errors={errors}
      />

      {/* Restore Banner */}
      {showRestoreBanner && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2 px-3 text-sm text-[var(--text-2)]">
          <Clock size={14} aria-hidden />
          <span>
            Previous results ({restoredAgo} min ago) — {restoredCount} rows
          </span>
          <button
            type="button"
            onClick={() => {
              setShowRestoreBanner(false);
              setResults([]);
              setHasSearched(false);
            }}
            className="ml-auto text-xs font-semibold underline"
          >
            Search again
          </button>
          <button
            type="button"
            onClick={() => setShowRestoreBanner(false)}
            className="rounded p-0.5 text-[var(--text-3)] hover:text-[var(--text-1)]"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Results section */}
      {hasSearched && results.length > 0 && (
        <div id="results-section">
          {/* Results Header */}
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

          {/* Table or Cards */}
          {viewMode === "table" ? (
            <ResultsTable
              results={pageResults}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              searchTerm={searchTerm}
            />
          ) : (
            <CardsView
              results={pageResults}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              searchTerm={searchTerm}
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Error summary */}
          {lastErrors.length > 0 && status !== "searching" && (
            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="mb-1 text-xs font-semibold text-amber-300">
                Issues during search:
              </p>
              <ul className="space-y-0.5">
                {lastErrors.map((err, i) => (
                  <li key={i} className="text-xs text-amber-300/80">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty state after search */}
      {hasSearched && !isSearching && results.length === 0 && status !== "idle" && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-sm text-[var(--text-2)]">
            No results found.
          </p>
          <p className="text-xs text-[var(--text-3)]">
            Try different search criteria.
          </p>
        </div>
      )}

      {/* Bulk Bar (fixed) */}
      <BulkBar
        selectedCount={selectedIds.size}
        hasActiveFilter={quickFilter.length > 0}
        onExportCsv={() => exportSelected("csv")}
        onExportExcel={() => exportSelected("excel")}
        onExportZip={() => {
          showToast("PDF bulk download coming in a later release", "info");
        }}
        onDeselect={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
