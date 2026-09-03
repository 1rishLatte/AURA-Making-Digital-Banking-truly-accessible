"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface Props {
  onConfirm: () => void;
  duration?: number;
  label?: string;
  disabled?: boolean;
}

export function SafetyConfirmCanvas({ onConfirm, duration = 1500, label = "Hold to confirm", disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  const draw = useCallback((p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width * dpr;
    const h = rect.height * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const size = rect.width;
    const cx = size / 2, cy = size / 2, r = size / 2 - 6;
    ctx.clearRect(0, 0, size, size);
    // track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(168,174,209,0.25)";
    ctx.lineWidth = 6;
    ctx.stroke();
    // progress
    if (p > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
      ctx.strokeStyle = p >= 1 ? "#ffffff" : "#53adfe";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    // center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = p >= 1 ? "#ffffff" : "rgba(255,255,255,0.9)";
    ctx.fill();
  }, []);

  useEffect(() => { draw(progressRef.current); }, [draw]);

  const start = () => {
    if (disabled || startedRef.current) return;
    startedRef.current = true;
    const obj = { v: progressRef.current };
    tweenRef.current = gsap.to(obj, {
      v: 1,
      duration: duration / 1000,
      ease: "power2.out",
      onUpdate: () => {
        progressRef.current = obj.v;
        setProgress(obj.v);
        draw(obj.v);
        if (obj.v >= 1) {
          startedRef.current = false;
          onConfirm();
        }
      },
    });
  };

  const cancel = () => {
    startedRef.current = false;
    if (tweenRef.current) { tweenRef.current.kill(); tweenRef.current = null; }
    const obj = { v: progressRef.current };
    gsap.to(obj, {
      v: 0,
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => { progressRef.current = obj.v; setProgress(obj.v); draw(obj.v); },
    });
  };

  // keyboard hold
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); start(); } };
  const onKeyUp = (e: React.KeyboardEvent) => { if (e.key === " " || e.key === "Enter") cancel(); };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${label} — hold for ${duration / 1000} seconds`}
        aria-disabled={disabled}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={`relative rounded-full bg-vault-ink border border-white/20 shadow-lg touch-manipulation ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
        style={{ width: 200, height: 200, touchAction: "manipulation" }}
      >
        <canvas ref={canvasRef} width={200} height={200} className="absolute inset-0 w-full h-full rounded-full" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
          <span className="text-[40px] tabular-nums leading-none">{Math.round(progress * 100)}%</span>
          <span className="text-[12px] uppercase tracking-[0.08em] text-silver-veil mt-1" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{progress >= 1 ? "Confirmed" : label}</span>
        </div>
      </div>
      <p className="text-[14px] text-silver-veil text-center max-w-[260px]" aria-live="polite">
        {disabled ? "Unavailable" : "Hold the ring for 1.5 seconds to confirm. Release early to cancel. Press Space holds too."}
      </p>
      {/* reduced-motion fallback: native button shown via CSS if needed, but canvas already keyboard operable */}
    </div>
  );
}
