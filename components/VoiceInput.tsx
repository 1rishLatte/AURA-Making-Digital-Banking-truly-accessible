"use client";
import { useEffect, useRef, useState } from "react";
import { speakClear, stopSpeak, preloadVoices } from "@/lib/voice";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  value?: string;
  onValueChange?: (v: string) => void;
}

export function VoiceInput({ onTranscript, onValueChange, value }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState(0.85);
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    preloadVoices();
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
      if (res[0]?.isFinal) { setLastTranscript(text); onTranscript(text); }
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={listening}
          aria-label={listening ? "Stop listening" : "Start voice input"}
          onClick={toggle}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] min-h-[44px] border ${listening ? "bg-red-600 text-white border-red-600 animate-pulse" : "bg-white text-vault-ink border-silver-veil"}`}
        >
          <span className={`h-2 w-2 rounded-full ${listening ? "bg-white" : "bg-cobalt-signal"}`} aria-hidden /> {listening ? "Listening… speak clearly" : "Tap to speak — clear voice"}
        </button>
        <span className="text-[12px] text-silver-veil" aria-live="polite">{listening ? "Speak slowly and clearly — en-IN" : "or type below"}</span>
        {listening && (
          <span className="flex gap-1 items-center ml-1" aria-hidden>
            <span className="w-1 h-3 bg-red-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
            <span className="w-1 h-5 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
            <span className="w-1 h-3 bg-red-500 rounded-full animate-[pulse_0.9s_ease-in-out_infinite]" />
          </span>
        )}
      </div>

      {/* Clear voice playback */}
      {(value || lastTranscript) && (
        <div className="flex flex-wrap items-center gap-2 rounded-[8px] bg-ash-mist border border-silver-veil/30 p-3">
          <button
            type="button"
            onClick={() => speakClear(value || lastTranscript, { rate })}
            className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-4 py-2 text-[13px] min-h-[36px]"
            aria-label="Hear in clear voice"
          >
            🔊 Hear clearly
          </button>
          <button type="button" onClick={stopSpeak} className="text-[12px] text-silver-veil underline">Stop</button>
          <label className="flex items-center gap-2 text-[12px] ml-auto">
            Speed
            <input type="range" min={0.7} max={1.1} step={0.05} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-20 accent-vault-ink" aria-label="Voice speed" />
            <span className="tabular-nums w-8">{rate.toFixed(2)}×</span>
          </label>
          <span className="text-[11px] text-silver-veil w-full">Clear voice: slower rate, warm pitch, INR spoken as “thousand rupees” — easy for elderly.</span>
        </div>
      )}

      {error && <p role="alert" className="text-[14px] text-red-700">{error}</p>}
    </div>
  );
}
