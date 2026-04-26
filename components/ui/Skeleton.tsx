"use client";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  as = "div",
}: {
  className?: string;
  as?: "div" | "span";
}) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "animate-pulse rounded-md bg-white/[0.06] ring-1 ring-inset ring-white/[0.06]",
        className,
      )}
    />
  );
}

