"use client";

import { type FormEvent, useState } from "react";
import type { SearchParams } from "@/types";
import { cn } from "@/lib/utils";

const fc =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-white placeholder:text-[var(--text-2)] focus:border-white/25 focus:outline-none";

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

export function SearchForm({
  onSearch,
  isSearching,
  defaultValues,
}: SearchFormProps) {
  const [keyword, setKeyword] = useState(defaultValues?.keyword ?? "");
  const [make, setMake] = useState(defaultValues?.make ?? "");
  const [model, setModel] = useState(defaultValues?.model ?? "");
  const [productType, setProductType] = useState(
    defaultValues?.product_type ?? "",
  );
  const [dateFrom, setDateFrom] = useState(defaultValues?.date_from ?? "");
  const [dateTo, setDateTo] = useState(defaultValues?.date_to ?? "");

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-2)]">
        Search criteria
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input type="text" placeholder="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className={cn(fc, "sm:col-span-2")} />
        <input type="text" placeholder="Make (e.g. Boeing)" value={make} onChange={(e) => setMake(e.target.value)} className={fc} />
        <input type="text" placeholder="Model (e.g. 737)" value={model} onChange={(e) => setModel(e.target.value)} className={fc} />
        <select value={productType} onChange={(e) => setProductType(e.target.value)} className={cn(fc, "text-[var(--text-2)] sm:col-span-2")}>
          <option value="">All types</option>
          <option value="Aircraft">Aircraft</option>
          <option value="Engine">Engine</option>
          <option value="Propeller">Propeller</option>
        </select>
        <input type="text" placeholder="From (dd/mm/yyyy)" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} maxLength={10} className={fc} />
        <input type="text" placeholder="To (dd/mm/yyyy)" value={dateTo} onChange={(e) => setDateTo(e.target.value)} maxLength={10} className={fc} />
      </div>
      <button type="submit" disabled={isSearching} className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-white/90 disabled:opacity-50">
        {isSearching ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
