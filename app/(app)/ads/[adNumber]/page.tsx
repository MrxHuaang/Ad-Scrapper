"use client";

export const dynamic = "force-dynamic";

import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, CheckCircle2, ExternalLink, Save, Check } from "lucide-react";
import type { ADResult } from "@/types";
import { PdfInlinePreview } from "@/components/ads/PdfInlinePreview";
import {
  getMyAdState,
  getMySavedAdByNumber,
  toggleReviewedAd,
  toggleSaveAd,
  updateMySavedAdSnapshot,
  upsertAdNote,
} from "@/lib/ads/adPersistence";
import { showToast } from "@/hooks/useToast";

const SESSION_KEY = "zephr_session";

function decodeParam(v: string | null) {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function AdDetailPageInner({
  params: paramsPromise,
}: {
  params: Promise<{ adNumber: string }>;
}) {
  const router = useRouter();
  const params = use(paramsPromise);
  const sp = useSearchParams();
  const adNumber = decodeParam(params.adNumber);

  // We pass the selected row/card data through querystring to avoid needing a backend AD table right now.
  const initialAd = useMemo(() => {
    const source = decodeParam(sp.get("source"));
    const pdf = decodeParam(sp.get("pdf"));
    const subject = decodeParam(sp.get("subject"));
    const make = decodeParam(sp.get("make"));
    const model = decodeParam(sp.get("model"));
    const effective = decodeParam(sp.get("effective"));
    const status = decodeParam(sp.get("status"));
    const product = decodeParam(sp.get("product"));
    return {
      Source: source,
      AD_Number: adNumber,
      Subject: subject,
      Make: make,
      Model: model,
      Effective_Date: effective,
      Status: status,
      Product_Type: product,
      Docket: "",
      PDF_Link: pdf,
    } satisfies ADResult;
  }, [adNumber, sp]);

  const [ad, setAd] = useState<ADResult>(() => initialAd);

  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteBody, setNoteBody] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedBodyRef = useRef<string>("");
  const autoSaveTimerRef = useRef<number | null>(null);

  const adKey = useMemo(
    () => ({ adNumber: ad.AD_Number, source: ad.Source || "unknown" }),
    [ad.AD_Number, ad.Source],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const st = await getMyAdState(adKey);
        if (cancelled) return;
        setIsSaved(st.isSaved);
        setIsReviewed(st.isReviewed);
        setNoteId(st.noteId);
        setNoteBody(st.noteBody);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Could not load AD state";
        showToast(msg, "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [adKey]);

  // If user opened this page from "Saved ADs", querystring may be missing fields (pdf/subject/etc).
  // Hydrate from Supabase so preview + header render correctly.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const needsHydration =
        !ad.Source || !ad.Subject || !ad.PDF_Link || !ad.Product_Type || !ad.Effective_Date;
      if (!needsHydration) return;
      try {
        const row = await getMySavedAdByNumber(adNumber);
        if (cancelled || !row) return;
        setAd((prev) => ({
          ...prev,
          Source: prev.Source || row.source || "",
          Subject: prev.Subject || row.subject || "",
          PDF_Link: prev.PDF_Link || row.pdf_link || "",
          Make: prev.Make || row.make || "",
          Model: prev.Model || row.model || "",
          Effective_Date: prev.Effective_Date || row.effective_date || "",
          Status: prev.Status || row.status || "",
          Product_Type: prev.Product_Type || row.product_type || "",
        }));
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adNumber]);

  // If still missing PDF/metadata, try to hydrate from the last session search dataset.
  useEffect(() => {
    if (ad.PDF_Link) return;
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { results?: ADResult[] };
      const list = Array.isArray(parsed?.results) ? parsed.results : [];
      const hit = list.find((r) => r.AD_Number === adNumber);
      if (!hit) return;
      setAd((prev) => ({
        ...prev,
        Source: prev.Source || hit.Source || "",
        Subject: prev.Subject || hit.Subject || "",
        PDF_Link: prev.PDF_Link || hit.PDF_Link || "",
        Make: prev.Make || hit.Make || "",
        Model: prev.Model || hit.Model || "",
        Effective_Date: prev.Effective_Date || hit.Effective_Date || "",
        Status: prev.Status || hit.Status || "",
        Product_Type: prev.Product_Type || hit.Product_Type || "",
      }));

      // If this AD is saved but was missing snapshot fields, backfill them so Saved view can open it properly next time.
      if (isSaved && hit.PDF_Link) {
        void updateMySavedAdSnapshot(adNumber, {
          subject: hit.Subject || undefined,
          pdf_link: hit.PDF_Link || undefined,
          make: hit.Make || undefined,
          model: hit.Model || undefined,
          effective_date: hit.Effective_Date || undefined,
          status: hit.Status || undefined,
          product_type: hit.Product_Type || undefined,
        });
      }
    } catch {
      // ignore
    }
  }, [ad.PDF_Link, adNumber, isSaved]);

  // Autosave notes with debounce (no manual Save needed).
  useEffect(() => {
    if (loading) return;
    if (noteBody === lastSavedBodyRef.current) return;

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    autoSaveTimerRef.current = window.setTimeout(async () => {
      setAutoSaveStatus("saving");
      setSavingNote(true);
      try {
        await upsertAdNote(adKey, noteBody, noteId ?? undefined);
        lastSavedBodyRef.current = noteBody;
        setAutoSaveStatus("saved");
        // Ensure we keep noteId after first insert
        const st = await getMyAdState(adKey);
        setNoteId(st.noteId);
      } catch {
        setAutoSaveStatus("idle");
      } finally {
        setSavingNote(false);
      }
    }, 750);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [adKey, loading, noteBody, noteId]);

  useEffect(() => {
    // Sync initial load into autosave baseline
    if (loading) return;
    lastSavedBodyRef.current = noteBody;
    setAutoSaveStatus("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const canPreview = Boolean(ad.PDF_Link);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <div className="mb-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => {
            const from = sp.get("from");
            if (from === "saved") {
              router.push("/dashboard/saved");
              return;
            }
            if (typeof window !== "undefined" && window.history.length > 1) router.back();
            else router.push("/dashboard/search");
          }}
          className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm text-white/45 hover:text-white/80"
        >
          ← Back
        </button>

        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <h1 className="font-mono text-3xl font-light tracking-tight text-white/90">
              {ad.AD_Number}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
              {ad.Subject || "No subject provided."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={isSaved}
              disabled={loading}
              onClick={async () => {
                const next = !isSaved;
                setIsSaved(next);
                try {
                  await toggleSaveAd(adKey, next, {
                    subject: ad.Subject || undefined,
                    pdf_link: ad.PDF_Link || undefined,
                    make: ad.Make || undefined,
                    model: ad.Model || undefined,
                    effective_date: ad.Effective_Date || undefined,
                    status: ad.Status || undefined,
                    product_type: ad.Product_Type || undefined,
                  });
                } catch (e: unknown) {
                  setIsSaved(!next);
                  const msg = e instanceof Error ? e.message : "Could not update saved state";
                  showToast(msg, "error");
                }
              }}
              className={[
                "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40",
                isSaved
                  ? "bg-white/[0.08] text-white/90 hover:bg-white/[0.10]"
                  : "bg-[var(--surface-2)] text-white/70 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
              {isSaved ? "Saved" : "Save"}
            </button>

            <button
              type="button"
              aria-pressed={isReviewed}
              disabled={loading}
              onClick={async () => {
                const next = !isReviewed;
                setIsReviewed(next);
                try {
                  await toggleReviewedAd(adKey, next);
                } catch (e: unknown) {
                  setIsReviewed(!next);
                  const msg = e instanceof Error ? e.message : "Could not update reviewed state";
                  showToast(msg, "error");
                }
              }}
              className={[
                "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40",
                isReviewed
                  ? "bg-white/[0.08] text-white/90 hover:bg-white/[0.10]"
                  : "bg-[var(--surface-2)] text-white/70 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              <CheckCircle2 size={16} className={isReviewed ? "text-white/85" : "text-white/55"} />
              {isReviewed ? "Reviewed" : "Mark reviewed"}
            </button>

            {ad.PDF_Link && (
              <a
                href={ad.PDF_Link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <ExternalLink size={16} />
                Open PDF
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[var(--surface)] p-4 text-[12px] text-white/55 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <p className="text-white/35">Source</p>
            <p className="mt-1 truncate text-white/80">{ad.Source || "—"}</p>
          </div>
          <div className="min-w-0">
            <p className="text-white/35">Product</p>
            <p className="mt-1 truncate text-white/80">{ad.Product_Type || "—"}</p>
          </div>
          <div className="min-w-0">
            <p className="text-white/35">Make / model</p>
            <p className="mt-1 truncate text-white/80">
              {(ad.Make || "—") + (ad.Model ? ` · ${ad.Model}` : "")}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-white/35">Effective date</p>
            <p className="mt-1 truncate text-white/80">{ad.Effective_Date || "—"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-4">
          {canPreview ? (
            <PdfInlinePreview url={ad.PDF_Link} className="bg-transparent" />
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/55">
              No PDF available for this AD.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white/80">Notes</h2>
            <div className="flex items-center gap-2 text-[12px] text-white/35">
              {autoSaveStatus === "saving" ? (
                <>
                  <Save size={14} className="text-white/35" />
                  <span>Saving…</span>
                </>
              ) : autoSaveStatus === "saved" ? (
                <>
                  <Check size={14} className="text-white/45" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Autosave</span>
              )}
            </div>
          </div>

          <textarea
            value={noteBody}
            onChange={(e) => {
              setAutoSaveStatus("idle");
              setNoteBody(e.target.value);
            }}
            placeholder="Add notes about applicability, parts, deadlines…"
            className="mt-4 h-[260px] w-full resize-none rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-sm text-white/85 placeholder:text-white/25 focus:border-white/20 focus:outline-none"
          />

          <p className="mt-3 text-[11px] text-white/30">
            Notes are private to your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdDetailPage(props: { params: Promise<{ adNumber: string }> }) {
  return (
    <Suspense fallback={null}>
      <AdDetailPageInner {...props} />
    </Suspense>
  );
}
