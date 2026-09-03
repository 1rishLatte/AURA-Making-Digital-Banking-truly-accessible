import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreFraud } from "@/lib/fraud-rules";
import { stripToIntent } from "@/lib/intent-strip";

// Rate limit: 10/min/IP (memory — AGENTS.md: don't trust X-Forwarded-For unless behind trusted proxy, Vercel is trusted)
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (b.count >= 10) return false;
  b.count++;
  return true;
}

const Body = z.object({
  query: z.string().min(1).max(500),
  amount: z.number().optional(),
  payee: z.string().max(120).optional(),
  new_device: z.boolean().optional(),
});

const FraudResult = z.object({
  intent: z.enum(["transfer", "query", "other"]),
  riskScore: z.number().min(0).max(100),
  summary: z.string().max(120),
  flags: z.array(z.enum(["unknown_payee", "urgency_language", "large_amount", "new_device"])),
  action: z.enum(["allow", "intercept"]),
});

export async function POST(req: NextRequest) {
  // auth middleware stub — before handler (AGENTS.md): reject unauth if DEMO_MODE false and no session
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }

  const { query, amount, payee, new_device } = parsed.data;

  // server-side intent strip (defense in depth) — raw query not logged with PII
  const stripped = stripToIntent(query, amount);

  // Try Vercel AI SDK generateObject if key present, else deterministic fallback
  let result: z.infer<typeof FraudResult>;
  const hasKey = !!process.env.OPENAI_API_KEY;

  if (hasKey) {
    try {
      const { generateObject } = await import("ai");
      const { openai } = await import("@ai-sdk/openai");
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: FraudResult,
        prompt: `You are AURA fraud shield for elderly Indian users. Score risk 0-100. Query: "${query}" Amount: ${amount ?? stripped.amount} Payee: ${payee ?? stripped.recipient_type}. Return plain-language summary ≤20 words, elderly-friendly. Flags: unknown_payee, urgency_language, large_amount (>=25000 INR), new_device. action intercept if riskScore>=70 else allow.`,
      });
      result = object;
    } catch (e) {
      console.error("AI generateObject failed, falling back to rules", (e as Error).message);
      result = scoreFraud({ query, amount: amount ?? stripped.amount, payee, new_device });
    }
  } else {
    result = scoreFraud({ query, amount: amount ?? stripped.amount, payee, new_device });
  }

  // In DEMO_MODE we would insert into fraud_events if Supabase wired; skip when no DB

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
