"use client";

import { type FormEvent, useState } from "react";
import type { SearchParams } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

function parseDateInput(value: string): string {
  const parts = value.split("/");
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
  defaultValues?: Partial<SearchParams>;
}

const fieldCls =
  "bg-transparent py-4 text-sm text-white placeholder:text-white/25 focus:outline-none w-full";

const advFieldCls =
  "w-full rounded-lg border border-[#252525] bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-white/20 focus:bg-[#161616] focus:outline-none transition-colors";

export function SearchForm({ onSearch, isSearching, defaultValues }: SearchFormProps) {
  const [keyword, setKeyword] = useState(defaultValues?.keyword ?? "");
  const [make, setMake] = useState(defaultValues?.make ?? "");
  const [model, setModel] = useState(defaultValues?.model ?? "");
  const [productType, setProductType] = useState(defaultValues?.product_type ?? "");
  const [dateFrom, setDateFrom] = useState(defaultValues?.date_from ?? "");
  const [dateTo, setDateTo] = useState(defaultValues?.date_to ?? "");
  const [showAdv, setShowAdv] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch({
      source: "federal_register",
      keyword: keyword.trim(),
      make: make.trim(),
      model: model.trim(),
      product_type: productType,
      date_from: parseDateInput(dateFrom),
      date_to: parseDateInput(dateTo),
      max_results: 2000,
    });
  }

  const hasAdv = productType || dateFrom || dateTo;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* ── Command bar ── */}
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-[#252525] bg-[#0d0d0d] focus-within:border-white/[0.15]">
        {/* Fields */}
        <div className="flex flex-1 items-center divide-x divide-[#252525]">
          {/* Keyword */}
          <div className="relative flex flex-1 items-center min-w-0">
            <Search size={15} className="pointer-events-none absolute left-4 shrink-0 text-white/25" />
            <input
              type="text"
              placeholder="Keyword or AD number…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={cn(fieldCls, "pl-10 pr-4")}
            />
          </div>
          {/* Make */}
          <input
            type="text"
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={cn(fieldCls, "hidden w-36 px-4 sm:block")}
          />
          {/* Model */}
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={cn(fieldCls, "hidden w-32 px-4 sm:block")}
          />
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdv((v) => !v)}
          title="Advanced filters"
          className={cn(
            "flex cursor-pointer items-center justify-center border-l border-[#252525] px-3.5 transition-colors",
            showAdv || hasAdv ? "text-white/70 bg-white/[0.04]" : "text-white/25 hover:text-white/55",
          )}
        >
          <SlidersHorizontal size={14} />
          {hasAdv && (
            <span className="ml-1.5 flex h-[6px] w-[6px] rounded-full bg-blue-400" />
          )}
        </button>

        {/* Search button */}
        <button
          type="submit"
          disabled={isSearching}
          className="m-2 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.97] disabled:opacity-50"
        >
          {isSearching && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
          )}
          {isSearching ? "Searching…" : "Search"}
        </button>
      </div>

      {/* ── Advanced filters ── */}
      {showAdv && (
        <div className="grid grid-cols-1 gap-2 rounded-xl border border-[#1e1e1e] bg-[#080808] p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Make/Model on mobile (hidden on desktop since they're in the bar) */}
          <input
            type="text"
            placeholder="Make (e.g. Boeing)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={cn(advFieldCls, "sm:hidden")}
          />
          <input
            type="text"
            placeholder="Model (e.g. 737)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={cn(advFieldCls, "sm:hidden")}
          />
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className={cn(advFieldCls, "cursor-pointer text-white/60 lg:col-span-1")}
          >
            <option value="">All product types</option>
            <option value="Aircraft">Aircraft</option>
            <option value="Engine">Engine</option>
            <option value="Propeller">Propeller</option>
          </select>
          <input
            type="text"
            placeholder="From (dd/mm/yyyy)"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            maxLength={10}
            className={advFieldCls}
          />
          <input
            type="text"
            placeholder="To (dd/mm/yyyy)"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            maxLength={10}
            className={advFieldCls}
          />
        </div>
      )}
    </form>
  );
}
