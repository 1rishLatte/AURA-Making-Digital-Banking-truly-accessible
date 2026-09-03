"use client";
import { useEffect, useRef, useState } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  value?: string;
  onValueChange?: (v: string) => void;
}

export function VoiceInput({ onTranscript, onValueChange }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    const SR = (typeof window !== "undefined" && ((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition)) as unknown as new () => unknown;
    if (!SR) return;
    const rec = new SR() as unknown as { continuous: boolean; interimResults: boolean; lang: string; onstart: (() => void) | null; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null; onresult: ((e: { results: unknown[] }) => void) | null; start: () => void; stop: () => void };
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-IN";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => setError(e.error === "not-allowed" ? "Microphone permission denied — please type instead." : "Voice error — please type.");
    rec.onresult = (e) => {
      const res = e.results as Array<{ 0: { transcript: string }; isFinal: boolean }>;
      const text = Array.from(res).map((r) => r[0].transcript).join("");
      if (res[0]?.isFinal) onTranscript(text);
      else onValueChange?.(text);
    };
    recognitionRef.current = rec as unknown;
    return () => { try { (rec as unknown as { stop: () => void }).stop(); } catch {} };
  }, [onTranscript, onValueChange]);

  const toggle = () => {
    const rec = recognitionRef.current as unknown as { start: () => void; stop: () => void } | null;
    if (!rec) {
      setError("Voice not supported in this browser — please type.");
      return;
    }
    if (listening) rec.stop();
    else { setError(null); try { rec.start(); } catch {} }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          aria-pressed={listening}
          aria-label={listening ? "Stop listening" : "Start voice input"}
          onClick={toggle}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] min-h-[44px] border ${listening ? "bg-red-600 text-white border-red-600 animate-pulse" : "bg-white text-vault-ink border-silver-veil"}`}
        >
          <span className={`h-2 w-2 rounded-full ${listening ? "bg-white" : "bg-cobalt-signal"}`} aria-hidden /> {listening ? "Listening…" : "Tap to speak"}
        </button>
        <span className="text-[12px] text-silver-veil self-center" aria-live="polite">{listening ? "Speak now — en-IN" : "or type below"}</span>
      </div>
      {error && <p role="alert" className="text-[14px] text-red-700">{error}</p>}
    </div>
  );
}
