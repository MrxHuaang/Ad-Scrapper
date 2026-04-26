"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";

function toGview(url: string) {
  // Google gview works even when the PDF host blocks iframes via X-Frame-Options.
  // It only works for publicly reachable URLs.
  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
}

function toProxy(url: string) {
  return `/api/pdf?url=${encodeURIComponent(url)}`;
}

export function PdfInlinePreview({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [mode, setMode] = useState<"proxy" | "viewer" | "direct">("proxy");
  const [frameLoaded, setFrameLoaded] = useState(false);
  const iframeSrc = useMemo(() => {
    if (mode === "proxy") return toProxy(url);
    if (mode === "viewer") return toGview(url);
    return url;
  }, [mode, url]);

  return (
    <div
      className={className}
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-[12px] text-white/55">
        <span>PDF preview</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "proxy" ? "viewer" : m === "viewer" ? "direct" : "proxy"))
            }
            className="cursor-pointer text-white/45 hover:text-white/80"
          >
            {mode === "proxy"
              ? "Use viewer"
              : mode === "viewer"
                ? "Use direct embed"
                : "Use proxy (recommended)"}
          </button>
          <Link
            href={url}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer text-white/45 hover:text-white/80"
          >
            Open in new tab
          </Link>
        </div>
      </div>
      <div className="relative h-[70vh] overflow-hidden bg-black/10">
        {!frameLoaded && (
          <div className="absolute inset-0 z-10 p-4">
            <div className="h-full rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="mt-4 grid grid-cols-12 gap-3">
                <Skeleton className="col-span-8 h-3" />
                <Skeleton className="col-span-4 h-3" />
              </div>
              <div className="mt-6 space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        )}
        <iframe
          title="PDF preview"
          src={iframeSrc}
          className="h-full w-full"
          style={{ border: "none" }}
          onLoad={() => setFrameLoaded(true)}
        />
      </div>
    </div>
  );
}

