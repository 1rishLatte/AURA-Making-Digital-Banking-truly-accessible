import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Single demo ID — server-only, never exposed via NEXT_PUBLIC_ (AGENTS.md: secrets server-only)
const DEMO_ID = process.env.DEMO_LOGIN_ID ?? "AURA-DEMO-001";
const DEMO_ID_ALT = "demo@aura.local";
const DEMO_PASS = process.env.DEMO_LOGIN_PASSWORD ?? "AURA2026";

// Rate limit: 5/min/IP for login (AGENTS.md: login must have rate limiting)
const buckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (b.count >= 5) return false;
  b.count++;
  return true;
}

const Body = z.object({
  id: z.string().min(1).max(120),
  password: z.string().min(1).max(120),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }

  const idNorm = parsed.data.id.trim();
  const pass = parsed.data.password;

  const idOk = idNorm === DEMO_ID || idNorm === DEMO_ID_ALT || idNorm.toLowerCase() === DEMO_ID.toLowerCase() || idNorm.toLowerCase() === DEMO_ID_ALT.toLowerCase();
  const passOk = pass === DEMO_PASS;

  if (!idOk || !passOk) {
    // Generic error: never reveal which field failed
    return NextResponse.json({ error: "Invalid ID or passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Secure session cookie — httpOnly, sameSite lax (AGENTS.md)
  // Secure only in production (https) — localhost http needs insecure for dev
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("aura_session", "demo", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}
