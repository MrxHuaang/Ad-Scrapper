"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Plan = "free" | "pro" | "team";

interface AuthContext {
  user: User | null;
  session: Session | null;
  plan: Plan;
  isLoading: boolean;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  session: null,
  plan: "free",
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
    return createClient();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [isLoading, setIsLoading] = useState(!!supabase);

  async function fetchPlan(sb: SupabaseClient, userId: string) {
    const { data } = await sb
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .single();
    setPlan((data?.plan as Plan) ?? "free");
    setIsLoading(false);
  }

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchPlan(supabase, s.user.id);
      else setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchPlan(supabase, s.user.id);
      else {
        setPlan("free");
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);



  return (
    <AuthCtx value={{ user, session, plan, isLoading }}>
      {children}
    </AuthCtx>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
