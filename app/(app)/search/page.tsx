"use client";

import { useCallback, useState } from "react";
import type { SearchParams } from "@/types";
import { useAdSearch } from "@/hooks/useAdSearch";
import { SearchForm } from "@/components/search/SearchForm";
import { SearchStatus } from "@/components/search/SearchStatus";
import { ResultsTable } from "@/components/search/ResultsTable";
import { ExportBar } from "@/components/search/ExportBar";

export default function SearchPage() {
  const { search, results, status, errors, elapsedMs } = useAdSearch();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(
    (params: SearchParams) => {
      setSelectedIds(new Set());
      search(params);
    },
    [search],
  );

  const handleToggleSelect = useCallback((adNumber: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(adNumber)) next.delete(adNumber);
      else next.add(adNumber);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allSelected =
        results.length > 0 &&
        results.every((r) => prev.has(r.AD_Number));
      if (allSelected) return new Set();
      return new Set(results.map((r) => r.AD_Number));
    });
  }, [results]);

  return (
    <div className="flex min-h-0 w-full flex-col lg:min-h-[calc(100dvh-7rem)] lg:flex-row">
      <aside className="w-full shrink-0 border-b border-[var(--border)] bg-[var(--surface)] p-4 lg:w-[280px] lg:border-b-0 lg:border-r lg:border-[var(--border)]">
        <SearchForm onSearch={handleSearch} isSearching={status === "searching"} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-4 bg-[var(--bg)] p-4">
        <SearchStatus
          status={status}
          count={results.length}
          ms={elapsedMs}
          errors={errors}
        />
        <ResultsTable
          results={results}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
        />
        <ExportBar selectedIds={selectedIds} results={results} />
      </div>
    </div>
  );
}
