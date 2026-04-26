import type { User } from "@supabase/supabase-js";

const STORAGE_KEY = "zephr_last_oauth_provider";
export const OAUTH_LAST_COOKIE = "zephr_last_oauth";

export type OauthProviderId = "google" | "github";


function readOauthCookie(): OauthProviderId | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${OAUTH_LAST_COOKIE}=([^;]*)`)
  );
  if (!m?.[1]) return null;
  const v = decodeURIComponent(m[1]);
  if (v === "google" || v === "github") return v;
  return null;
}

/** Provider used for the current OAuth identity (after sign-in), for callback route */
export function getOauthProviderFromUser(user: User | null): OauthProviderId | null {
  if (!user?.identities?.length) return null;
  for (const id of user.identities) {
    if (id.provider === "google" || id.provider === "github") return id.provider;
  }
  return null;
}

export function subscribeLastOauth(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
  };
}

export function getLastOauthProvider(): OauthProviderId | null {
  if (typeof window === "undefined") return null;
  const fromCookie = readOauthCookie();
  if (fromCookie) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return fromCookie;
  }
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "google" || v === "github") return v;
  } catch {
    /* ignore */
  }
  return null;
}
