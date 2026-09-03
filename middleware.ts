import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths — no auth needed
const PUBLIC = ["/login", "/api/login", "/api/logout", "/api/assistant", "/_next", "/favicon", "/public"];

function isPublic(pathname: string) {
  return PUBLIC.some(p => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith("/_next") || pathname.startsWith("/api/"));
  // _next/static, favicon etc handled by startsWith
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow public
  if (pathname.startsWith("/login") || pathname.startsWith("/api/") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // auth guard BEFORE handler (AGENTS.md: must run before, return 401/redirect)
  const session = request.cookies.get("aura_session")?.value;

  // For pages: redirect to login
  const wantsHtml = request.headers.get("accept")?.includes("text/html");
  if (!session) {
    if (wantsHtml || pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // API: 401
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // verify single demo session value — extensible to supabase auth later
  if (session !== "demo") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const res = NextResponse.redirect(url);
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set("aura_session", "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon|api|login).*)"],
};
