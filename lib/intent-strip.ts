// Client-side intent stripping — raw audio/transcript never leaves device
export interface StrippedIntent {
  action: "TRANSFER" | "QUERY" | "OTHER";
  amount: number;
  recipient_type: "EXISTING_CONTACT" | "UNKNOWN_NEW_CONTACT" | "SELF";
}

const KNOWN = ["sunita devi", "maa kirana", "asha medical", "pension", "daughter"];

export function stripToIntent(transcript: string, amountHint?: number): StrippedIntent {
  const q = transcript.toLowerCase();
  const amount = amountHint ?? extractAmount(q);
  const isKnown = KNOWN.some(k => q.includes(k));
  const recipient_type = q.includes("unknown") || q.includes("new") || q.includes("overseas") || q.includes("gift card")
    ? "UNKNOWN_NEW_CONTACT"
    : isKnown ? "EXISTING_CONTACT" : "SELF";

  const action = q.includes("transfer") || q.includes("wire") || q.includes("send") || amount > 0 ? "TRANSFER" : q.includes("balance") || q.includes("history") ? "QUERY" : "OTHER";

  return { action, amount, recipient_type };
}

function extractAmount(q: string): number {
  const m = q.match(/₹?\s?(\d[\d,]*\.?\d*)/);
  if (!m) return 0;
  return Number(m[1].replace(/,/g, "")) || 0;
}
