"use client";

import { useCallback, useRef, useState } from "react";
import type { AD, SearchParams, SearchStatus } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";

function toQueryString(params: SearchParams): string {
  const entries: [string, string][] = [];
  if (params.source) entries.push(["source", params.source]);
  if (params.keyword) entries.push(["keyword", params.keyword]);
  if (params.make) entries.push(["make", params.make]);
  if (params.model) entries.push(["model", params.model]);
  if (params.product_type) entries.push(["product_type", params.product_type]);
  if (params.date_from) entries.push(["date_from", params.date_from]);
  if (params.date_to) entries.push(["date_to", params.date_to]);
  entries.push(["max_results", String(params.max_results)]);
  return new URLSearchParams(entries).toString();
}

export function useAdSearch() {
  const { session } = useAuth();
  const [results, setResults] = useState<AD[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const search = useCallback(
    (params: SearchParams) => {
      const token = session?.access_token;
      abort();
      setResults([]);
      setErrors([]);
      setElapsedMs(0);
      setStatus("searching");

      const controller = new AbortController();
      abortRef.current = controller;
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 100);

      const url = `/api/proxy/search/stream?${toQueryString(params)}`;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      fetch(url, { signal: controller.signal, headers })
        .then(async (res) => {
          if (!res.ok || !res.body) {
            setStatus("error");
            setErrors((p) => [...p, `HTTP ${res.status}`]);
            abort();
            return;
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              try {
                const data = JSON.parse(line.slice(6));
                if (data.event === "done") {
                  setStatus("done");
                  setElapsedMs(Date.now() - startTimeRef.current);
                  abort();
                  return;
                }
                if (data.error) {
                  setErrors((p) => [...p, `${data.source}: ${data.error}`]);
                }
                if (data.results?.length) {
                  setResults((p) => [...p, ...data.results]);
                }
              } catch {
                setErrors((p) => [...p, "Failed to parse server event"]);
              }
            }
          }
          setStatus((s) => (s === "searching" ? "done" : s));
          setElapsedMs(Date.now() - startTimeRef.current);
          abort();
        })
        .catch((err: Error) => {
          if (err.name !== "AbortError") {
            setStatus("error");
            setErrors((p) => [...p, err.message]);
            abort();
          }
        });
    },
    [abort, session],
  );

  return { search, abort, results, status, errors, elapsedMs };
}
