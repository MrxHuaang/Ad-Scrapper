"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";

interface SearchRecord {
  id: string;
  keyword: string;
  make?: string;
  model?: string;
  timestamp: number;
}

interface SearchHistoryProps {
  onSelect: (record: Omit<SearchRecord, "id" | "timestamp">) => void;
  isOpen: boolean;
}

const MAX_HISTORY = 10;
const STORAGE_KEY = "zephr_search_history";

export function SearchHistory({ onSelect, isOpen }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const addToHistory = (keyword: string, make?: string, model?: string) => {
    const record: SearchRecord = {
      id: Math.random().toString(36).slice(2),
      keyword,
      make,
      model,
      timestamp: Date.now(),
    };

    const updated = [record, ...history.filter((r) => !(r.keyword === keyword && r.make === make && r.model === model))].slice(0, MAX_HISTORY);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeRecord = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  if (!isOpen || history.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full mt-2 w-full rounded-2xl border border-white/5 bg-[#0a0a0a] shadow-2xl z-50"
      >
        <div className="max-h-80 overflow-y-auto">
          {history.map((record, idx) => (
            <motion.button
              key={record.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => {
                onSelect({ keyword: record.keyword, make: record.make, model: record.model });
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0 group"
            >
              <Clock size={14} className="text-white/30 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/80 truncate">{record.keyword}</p>
                {(record.make || record.model) && (
                  <p className="text-xs text-white/35 truncate">
                    {[record.make, record.model].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecord(record.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} className="text-white/35 hover:text-white/60" />
              </button>
            </motion.button>
          ))}
        </div>
        <div className="border-t border-white/[0.02] px-4 py-2">
          <button
            type="button"
            onClick={clearHistory}
            className="w-full text-xs text-white/35 hover:text-white/60 transition-colors py-1"
          >
            Clear history
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const addToHistory = (keyword: string, make?: string, model?: string) => {
    const record: SearchRecord = {
      id: Math.random().toString(36).slice(2),
      keyword,
      make,
      model,
      timestamp: Date.now(),
    };

    const updated = [record, ...history.filter((r) => !(r.keyword === keyword && r.make === make && r.model === model))].slice(0, MAX_HISTORY);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  return { history, addToHistory };
}
