import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({
  amount: z.number().min(0).max(1_000_000),
  recipient: z.string().min(1).max(120),
  isNewRecipient: z.boolean(),
});

// Simple in-memory rate limit: 20/min/IP
const buckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (b.count >= 20) return false;
  b.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { amount, recipient, isNewRecipient } = parsed.data;

  const isHighRisk = isNewRecipient || amount > 2500;
  const threatScore = isHighRisk ? 0.88 : 0.12;
  const threatCategory = isHighRisk ? 'IMPOSTER_COERCION' : 'NONE';
  const message = isHighRisk
    ? 'This transfer is going to a new account. Scammers often use pressure tactics to rush wire transfers. Take a moment to verify.'
    : 'Transaction looks normal. Standard security active.';
  const action = isHighRisk ? 'REQUIRE_TACTILE_HOLD' : 'ALLOW';

  return NextResponse.json(
    {
      amount,
      recipient,
      isNewRecipient,
      threatScore,
      threatCategory,
      message,
      action,
      timestamp: new Date().toISOString(),
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
