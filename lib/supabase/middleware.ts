// Stub — runs BEFORE handlers when DEMO_MODE=false (AGENTS.md)
import type { NextRequest } from "next/server";
export function authGuard(request: NextRequest): { ok: boolean; status?: number } {
  // supabase auth check would be here when wired
  return { ok: true };
}
