// Stub — runs BEFORE handlers when DEMO_MODE=false (AGENTS.md)
import type { NextRequest } from "next/server";
export function authGuard(_request: NextRequest): { ok: boolean; status?: number } { // eslint-disable-line @typescript-eslint/no-unused-vars

  // supabase auth check would be here when wired
  return { ok: true };
}
