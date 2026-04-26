"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export function Autocomplete({ 
  value, 
  onChange, 
  options, 
  placeholder = "Type to search...", 
  className = "", 
  label,
  required 
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(opt => 
        opt.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [value, options]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-xs text-white/40 mb-1.5">{label}</label>}
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors hover:bg-white/[0.05] focus:border-white/20 focus:outline-none"
      />

      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-[70] mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#151619] p-1 shadow-2xl backdrop-blur-xl scrollbar-custom"
          >
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
