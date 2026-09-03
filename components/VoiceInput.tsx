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
  const isListeningRef = useRef(false);
  const transcriptBufferRef = useRef('');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleStateUpdate = (text: string) => {
    transcriptBufferRef.current = text;
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      const buffered = transcriptBufferRef.current;
      // Only commit if still listening or final
      if (buffered) {
        onValueChange?.(buffered);
      }
    }, 100); // 100ms debounce for interim, final commits immediately below
  };

  useEffect(() => {
    preloadVoices();
    // Keep ref in sync for onend auto-restart
    isListeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    const SR = (typeof window !== "undefined" && ((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition)) as unknown as new () => unknown;
    if (!SR) return;
    const rec = new SR() as unknown as {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onstart: (() => void) | null;
      onend: (() => void) | null;
      onerror: ((e: { error: string }) => void) | null;
      onresult: ((e: { results: unknown[] }) => void) | null;
      start: () => void;
      stop: () => void;
    };
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";
    rec.onstart = () => setListening(true);
    rec.onend = () => {
      setListening(false);
      // Auto-restart if browser unexpectedly cuts connection while active (30s safety)
      if (isListeningRef.current) {
        try {
          rec.start();
          setListening(true);
        } catch {
          console.log('Restarting recognition session...');
        }
      }
    };
    rec.onerror = (e) => setError(e.error === "not-allowed" ? "Microphone permission denied — please type instead." : "Voice error — please type.");
    rec.onresult = (e) => {
      const res = e.results as Array<{ 0: { transcript: string }; isFinal: boolean }>;
      let interim = '';
      for (let i = (e as unknown as { resultIndex: number }).resultIndex ?? 0; i < res.length; i++) {
        if ((e as unknown as { results: { isFinal: boolean }[] }).results[i]?.isFinal) {
          transcriptBufferRef.current += res[i][0].transcript + ' ';
        } else {
          interim += res[i][0].transcript;
        }
      }
      const finalBuffered = transcriptBufferRef.current.trim();
      if (finalBuffered) {
        // Final results commit immediately (no debounce)
        setLastTranscript(finalBuffered + (interim ? ` ${interim}` : ''));
        if ((e as unknown as { results: { isFinal: boolean }[] }).results[res.length - 1]?.isFinal) {
          onTranscript(finalBuffered);
          transcriptBufferRef.current = '';
        } else {
          scheduleStateUpdate(finalBuffered + (interim ? ` ${interim}` : ''));
        }
      } else if (interim) {
        scheduleStateUpdate(interim);
      }
    };
    recognitionRef.current = rec as unknown;
    return () => {
      isListeningRef.current = false;
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      try { (rec as unknown as { stop: () => void }).stop(); } catch {}
    };
  }, [onTranscript, onValueChange]);

  const toggle = () => {
    const rec = recognitionRef.current as unknown as { start: () => void; stop: () => void } | null;
    if (!rec) {
      setError("Voice not supported in this browser — please type.");
      return;
    }
    if (listening) {
      isListeningRef.current = false;
      rec.stop();
    } else {
      setError(null);
      isListeningRef.current = true;
      try { rec.start(); } catch {}
      // Safety: auto-stop after 30s continuous idle
      setTimeout(() => {
        if (isListeningRef.current) {
          isListeningRef.current = false;
          try { rec.stop(); } catch {}
          setListening(false);
        }
      }, 30000);
    }
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

      {/* Clear voice playback — FIXED FLEX LAYOUT (no vertical 0 . 8 5 x stack) */}
      {(value || lastTranscript) && (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-4 my-3 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => speakClear(value || lastTranscript, { rate })}
                className="h-[40px] px-4 rounded-[128px] bg-[#ffffff] text-[#0f111a] text-[13px] font-normal flex items-center space-x-2 shrink-0 hover:bg-[#efefef]"
              >
                <span>🔊</span>
                <span>Hear clearly</span>
              </button>
              <button type="button" onClick={stopSpeak} className="h-[40px] px-3 rounded-[128px] border border-[#2a2a2a] text-[#aeaeae] text-[13px] hover:text-[#ffffff] shrink-0">
                Stop
              </button>
            </div>
            <div className="flex items-center space-x-2 shrink-0 bg-[#0f111a] border border-[#2a2a2a] px-3 py-1.5 rounded-[128px]">
              <label htmlFor="voice-speed" className="text-[12px] text-[#aeaeae] shrink-0 font-mono">
                Speed
              </label>
              <input
                id="voice-speed"
                type="range"
                min={0.5}
                max={1.5}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-[80px] sm:w-[100px] h-1.5 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#53adfe]"
                aria-label="Speech rate speed"
              />
              <span className="text-[12px] font-mono text-[#ffffff] whitespace-nowrap shrink-0 min-w-[42px] text-right">
                {rate.toFixed(2)}x
              </span>
            </div>
          </div>
          <p className="text-[12px] text-[#aeaeae] leading-relaxed">Clear voice: slower rate, warm pitch, INR spoken as “thousand rupees” — easy for elderly.</p>
        </div>
      )}

      {error && <p role="alert" className="text-[14px] text-red-700">{error}</p>}
    </div>
  );
}
