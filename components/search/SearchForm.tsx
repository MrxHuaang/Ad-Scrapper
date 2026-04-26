"use client";

import { type FormEvent, useState, useRef, useEffect } from "react";
import type { SearchParams } from "@/types";
import { Search, SlidersHorizontal, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";

const PRODUCT_TYPES = [
  { label: "All product types", value: "" },
  { label: "Aircraft", value: "Aircraft" },
  { label: "Engine", value: "Engine" },
  { label: "Propeller", value: "Propeller" },
];

function parseDateInput(value: string): string {
  const parts = value.split("/");
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

interface SearchRecord {
  keyword: string;
  make?: string;
  model?: string;
  timestamp: number;
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

const HISTORY_KEY = "zephr_search_history";
const MAX_HISTORY = 8;

export function SearchForm({ onSearch, isSearching, defaultValues }: SearchFormProps) {
  const [keyword, setKeyword] = useState(defaultValues?.keyword ?? "");
  const [make, setMake] = useState(defaultValues?.make ?? "");
  const [model, setModel] = useState(defaultValues?.model ?? "");
  const [productType, setProductType] = useState(defaultValues?.product_type ?? "");
  const [dateFrom, setDateFrom] = useState(defaultValues?.date_from ?? "");
  const [dateTo, setDateTo] = useState(defaultValues?.date_to ?? "");
  const [showAdv, setShowAdv] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showHistory]);

  function saveToHistory() {
    const trimmedKw = keyword.trim();
    const trimmedMk = make.trim();
    const trimmedMd = model.trim();

    if (!trimmedKw) return;

    const record: SearchRecord = {
      keyword: trimmedKw,
      make: trimmedMk || undefined,
      model: trimmedMd || undefined,
      timestamp: Date.now(),
    };

    const filtered = history.filter(
      (r) => !(r.keyword === trimmedKw && r.make === trimmedMk && r.model === trimmedMd)
    );
    const updated = [record, ...filtered].slice(0, MAX_HISTORY);
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    saveToHistory();
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

  function handleSelectHistory(record: SearchRecord) {
    setKeyword(record.keyword);
    setMake(record.make ?? "");
    setModel(record.model ?? "");
    setShowHistory(false);
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

        {/* History toggle */}
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          title="Search history"
          disabled={history.length === 0}
          className={cn(
            "flex cursor-pointer items-center justify-center border-l border-[#252525] px-3.5 transition-colors",
            showHistory ? "text-white/70 bg-white/[0.04]" : "text-white/25 hover:text-white/55 disabled:opacity-30",
          )}
        >
          <Clock size={14} />
        </button>

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

      {/* ── Search History ── */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            ref={historyRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-[#1e1e1e] bg-[#080808] overflow-hidden"
          >
            {history.map((record, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHistory(record)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors border-b border-[#1e1e1e] last:border-0 group text-sm"
              >
                <Clock size={12} className="text-white/20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-white/80 truncate">{record.keyword}</p>
                  {(record.make || record.model) && (
                    <p className="text-xs text-white/30 truncate">
                      {[record.make, record.model].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
          <Select
            value={productType}
            onChange={setProductType}
            options={PRODUCT_TYPES}
            placeholder="All product types"
            className="lg:col-span-1"
          />
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
