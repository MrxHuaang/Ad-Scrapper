"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface InfiniteGridProps {
  className?: string;
  baseOpacity?: number;
  revealOpacity?: number;
  revealRadius?: number;
  speed?: number; // seconds for one 40px cycle
  color?: string;
  revealColor?: string;
}

export function InfiniteGrid({
  className,
  baseOpacity = 0.06,
  revealOpacity = 0.45,
  revealRadius = 280,
  speed = 4,
  color = "#ffffff",
  revealColor,
}: InfiniteGridProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  // Removed mouse handlers for performance and non-interaction

  const gridStyle = (c: string, op: number): React.CSSProperties => ({
    backgroundImage: [
      `linear-gradient(${c} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${c} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: "40px 40px",
    opacity: op,
    animation: `zl-grid-scroll ${speed}s linear infinite`,
  });

  return (
    <div
      className={cn("pointer-events-none relative h-full w-full", className)}
    >
      {/* Base layer — always visible, very faint */}
      <div className="absolute inset-0" style={gridStyle(color, baseOpacity)} />

      {/* Reveal layer — static center glow instead of mouse tracking */}
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{
          ...gridStyle(revealColor ?? color, revealOpacity),
          maskImage: `radial-gradient(${revealRadius}px circle at 50% 50%, black, transparent)`,
          WebkitMaskImage: `radial-gradient(${revealRadius}px circle at 50% 50%, black, transparent)`,
        }}
      />
    </div>
  );
}
