// AURA — CAPTCHA-free verification. Replaces visual CAPTCHAs (WCAG fail) with passive + accessible.
// Primary: behavioral risk + PATs. Fallback: tactile hold / plain-language / audio / push.

export type VerifyMethod =
  | "passive_pass"
  | "tactile_hold"
  | "plain_language"
  | "audio_clean"
  | "push_approve"
  | "webauthn";

export interface VerifyResult {
  passed: boolean;
  method: VerifyMethod;
  score: number; // 0-100 passive risk (100 = human, 0 = bot)
  summary: string; // calm reassurance
  fallback?: VerifyMethod;
}

// Mock behavioral telemetry: UA, hardwareConcurrency, time to interact, IP reputation proxy
function passiveScore(): number {
  if (typeof navigator === "undefined") return 88;
  let s = 70;
  // PATs / trusted device hint
  try {
    if (navigator.webdriver === false) s += 8;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 2) s += 5;
    if (navigator.language) s += 4;
  } catch {}
  s += Math.floor(Math.random() * 10); // jitter for demo
  return Math.min(98, s);
}

function hasPAT(): boolean {
  // Private Access Tokens: OS-level crypto trust (Apple PAT / Android Attestation) — mock: platform has secure enclave
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("mac") || ua.includes("iphone") || ua.includes("android");
}

export function verifyPassive(opts?: { requireInteraction?: boolean }): VerifyResult {
  const score = passiveScore();
  const pat = hasPAT();
  const passed = score >= 72 || pat;
  if (passed) {
    return {
      passed: true,
      method: "passive_pass",
      score,
      summary: "Verification complete. You're safe to proceed.",
    };
  }
  // not passed → choose accessible fallback, never visual CAPTCHA
  return {
    passed: false,
    method: "tactile_hold",
    score,
    summary: "Quick check needed — hold to verify, no puzzle required.",
    fallback: "tactile_hold",
  };
}

export function nextFallback(method: VerifyMethod, vector?: "motor" | "cognitive" | "visual" | "calm"): VerifyMethod {
  if (vector === "motor") return "tactile_hold";
  if (vector === "cognitive") return "plain_language";
  if (vector === "visual") return "audio_clean";
  if (vector === "calm") return "push_approve";
  if (method === "tactile_hold") return "plain_language";
  if (method === "plain_language") return "audio_clean";
  return "push_approve";
}
