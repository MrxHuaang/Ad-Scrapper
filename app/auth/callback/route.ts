import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getOauthProviderFromUser,
  OAUTH_LAST_COOKIE,
} from "@/lib/auth/last-oauth-provider";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const provider = getOauthProviderFromUser(user);
      const res = NextResponse.redirect(`${origin}/dashboard`);
      if (provider) {
        res.cookies.set(OAUTH_LAST_COOKIE, provider, {
          path: "/",
          maxAge: COOKIE_MAX_AGE,
          sameSite: "lax",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        });
      }
      return res;
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/login?error=Missing+code`);
}
