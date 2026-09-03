// Deterministic fallback — no OpenAI key needed for demo
export interface FraudInput {
  query: string;
  amount?: number;
  payee?: string;
  payee_trusted?: boolean;
  new_device?: boolean;
}

export interface FraudResult {
  intent: "transfer" | "query" | "other";
  riskScore: number;
  summary: string;
  flags: ("unknown_payee" | "urgency_language" | "large_amount" | "new_device")[];
  action: "allow" | "intercept";
}

const URGENCY_WORDS = ["emergency", "bail", "urgent", "immediately", "today", "now", "gift card", "stranded", "abroad", "help"];
const KNOWN_PAYEES = ["sunita devi", "maa kirana", "asha medical", "bsnl", "lic", "apollo", "daughter", "pension"];

export function scoreFraud(input: FraudInput): FraudResult {
  const q = (input.query + " " + (input.payee ?? "")).toLowerCase();
  const amount = input.amount ?? 0;
  const flags: FraudResult["flags"] = [];
  let score = 0;

  // unknown payee
  const isKnown = KNOWN_PAYEES.some(k => q.includes(k));
  if (!isKnown && q.includes("unknown") || (!isKnown && amount > 4000)) {
    flags.push("unknown_payee");
    score += 35;
  }
  // urgency language
  if (URGENCY_WORDS.some(w => q.includes(w))) {
    flags.push("urgency_language");
    score += 30;
  }
  // large amount (INR threshold)
  if (amount >= 25000) {
    flags.push("large_amount");
    score += 25;
  } else if (amount >= 10000) {
    score += 12;
  }
  // new device
  if (input.new_device) {
    flags.push("new_device");
    score += 20;
  }

  // cap
  score = Math.min(98, score);

  // if benign known payee + low amount, suppress
  if (isKnown && amount <= 8000 && !q.includes("emergency") && !q.includes("bail")) score = Math.min(score, 12);

  const intent: FraudResult["intent"] = q.includes("transfer") || q.includes("wire") || q.includes("send") || amount > 0 ? "transfer" : q.includes("balance") || q.includes("history") ? "query" : "other";

  const summary = score >= 70
    ? "This looks risky — new account and large amount. Take 5 seconds to review."
    : score >= 30
      ? "Check the details before you confirm."
      : "This looks like your usual transfer.";

  return {
    intent,
    riskScore: Math.round(score),
    summary,
    flags,
    action: score >= 70 ? "intercept" : "allow",
  };
}
