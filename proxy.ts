import { type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

const AUTH_PATHS = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await refreshSession(request);

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/search";
    return Response.redirect(url);
  }

  const isAppRoute =
    pathname.startsWith("/search") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/ads") ||
    pathname.startsWith("/aircraft");

  if (isAppRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return Response.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
