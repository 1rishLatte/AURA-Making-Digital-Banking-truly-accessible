import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("aura_session", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
export async function GET() {
  const res = NextResponse.redirect(new URL("/login", "http://localhost"), 302);
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("aura_session", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
