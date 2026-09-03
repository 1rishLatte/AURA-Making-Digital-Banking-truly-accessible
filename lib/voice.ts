"use client";
// Clear, natural TTS for elderly — picks best en-IN / en-GB voice, slow rate, warm pitch

export function getBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer natural Google/Microsoft en-IN, then en-GB, then any en
  const pref = [
    (v: SpeechSynthesisVoice) => v.name.includes("Google") && v.lang.startsWith("en-IN"),
    (v: SpeechSynthesisVoice) => v.name.includes("Microsoft") && v.lang.startsWith("en-IN"),
    (v: SpeechSynthesisVoice) => v.lang === "en-IN",
    (v: SpeechSynthesisVoice) => v.name.includes("Google") && v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
  ];
  for (const fn of pref) {
    const f = voices.find(fn);
    if (f) return f;
  }
  return voices[0] ?? null;
}

export function speakClear(text: string, opts?: { rate?: number; pitch?: number; volume?: number; lang?: string }) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // Cancel any ongoing
  window.speechSynthesis.cancel();
  // Make INR amounts clearer: "₹50,000" -> "50 thousand rupees"
  const clear = text
    .replace(/₹\s?([\d,]+(?:\.\d+)?)/g, (_, n) => {
      const num = Number(String(n).replace(/,/g, ""));
      if (isNaN(num)) return _;
      if (num >= 100000) return `${Math.round(num / 1000)} thousand rupees`;
      if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)} thousand rupees`;
      return `${num} rupees`;
    })
    .replace(/\s+/g, " ")
    .trim();

  // Add tiny pauses for clarity: after periods and commas
  const withPauses = clear.replace(/([.,])/g, "$1 ");

  const u = new SpeechSynthesisUtterance(withPauses);
  const best = getBestVoice();
  if (best) {
    u.voice = best;
    u.lang = best.lang;
  } else {
    u.lang = opts?.lang ?? "en-IN";
  }
  u.rate = opts?.rate ?? 0.85; // slower = clearer for elderly
  u.pitch = opts?.pitch ?? 1.05; // slightly warm, not robotic
  u.volume = opts?.volume ?? 1;
  window.speechSynthesis.speak(u);
  return u;
}

export function stopSpeak() {
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}

// Preload voices (Chrome loads async)
export function preloadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
