"use client";

import { type FormEvent, useState } from "react";
import { SOURCE_KEYS, type SearchParams, type SourceKey } from "@/types";
import { cn } from "@/lib/utils";

const SRC_ES: Record<SourceKey, string> = {
  federal_register: "FAA",
  easa: "EASA",
  transport_canada: "TC",
  anac_brazil: "ANAC Brasil",
  dgac_chile: "DGAC Chile",
  anac_argentina: "ANAC Argentina",
  all: "Todas",
};

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
  const [source, setSource] = useState<SourceKey>(
    defaultValues?.source ?? "federal_register",
  );
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
      source,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-2)]">Fuente</p>
        <div className="flex flex-wrap gap-2">
          {SOURCE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSource(key)}
              className={cn(
                "rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium transition-colors",
                source === key
                  ? "border-white/25 bg-[var(--surface)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)]",
              )}
            >
              {SRC_ES[key]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-2)]">Criterios</p>
        <div className="grid grid-cols-1 gap-3">
          <input type="text" placeholder="Palabra clave" value={keyword} onChange={(e) => setKeyword(e.target.value)} className={fc} />
          <input type="text" placeholder="Fabricante (p. ej. Boeing)" value={make} onChange={(e) => setMake(e.target.value)} className={fc} />
          <input type="text" placeholder="Modelo (p. ej. 737)" value={model} onChange={(e) => setModel(e.target.value)} className={fc} />
          <select value={productType} onChange={(e) => setProductType(e.target.value)} className={cn(fc, "text-[var(--text-2)]")}>
            <option value="">Todos los tipos</option>
            <option value="Aircraft">Aeronave</option>
            <option value="Engine">Motor</option>
            <option value="Propeller">Hélice</option>
          </select>
          <input type="text" placeholder="Desde (dd/mm/aaaa)" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} maxLength={10} className={fc} />
          <input type="text" placeholder="Hasta (dd/mm/aaaa)" value={dateTo} onChange={(e) => setDateTo(e.target.value)} maxLength={10} className={fc} />
        </div>
      </div>
      <button type="submit" disabled={isSearching} className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-white/90 disabled:opacity-50">
        {isSearching ? "Buscando…" : "Buscar"}
      </button>
    </form>
  );
}
