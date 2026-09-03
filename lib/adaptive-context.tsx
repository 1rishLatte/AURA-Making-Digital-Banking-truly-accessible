"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type Profile = "standard" | "motor" | "cognitive" | "vision";

export interface ImpairmentFlags {
  cognitive: boolean;
  motor: boolean;
  vision: boolean;
  hearing: boolean;
  dyslexia: boolean;
  anxiety: boolean;
}

export interface AdaptiveVars {
  targetMin: number;
  fontScale: number;
  density: string;
  contrast: "normal" | "high";
}

interface AdaptiveState {
  profile: Profile;
  setProfile: (p: Profile) => void;
  simpleMode: boolean;
  setSimpleMode: (v: boolean) => void;
  dyslexiaMode: boolean;
  setDyslexiaMode: (v: boolean) => void;
  impairments: ImpairmentFlags;
  setImpairments: (f: ImpairmentFlags) => void;
  vars: AdaptiveVars;
}

const defaults: ImpairmentFlags = {
  cognitive: false,
  motor: false,
  vision: false,
  hearing: false,
  dyslexia: false,
  anxiety: false,
};

const AdaptiveContext = createContext<AdaptiveState | null>(null);

function deriveVars(profile: Profile, simpleMode: boolean, flags: ImpairmentFlags): AdaptiveVars {
  if (flags.vision || profile === "vision") return { targetMin: 72, fontScale: 1.3, density: "24px", contrast: "high" };
  if (flags.motor || profile === "motor") return { targetMin: 68, fontScale: 1.05, density: "24px", contrast: "normal" };
  if (flags.cognitive || simpleMode || profile === "cognitive") return { targetMin: 56, fontScale: 1.15, density: "20px", contrast: "normal" };
  if (flags.dyslexia) return { targetMin: 48, fontScale: 1.08, density: "16px", contrast: "normal" };
  return { targetMin: 44, fontScale: 1, density: "16px", contrast: "normal" };
}

export function AdaptiveProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileRaw] = useState<Profile>("standard");
  const [simpleMode, setSimpleModeRaw] = useState(false);
  const [dyslexiaMode, setDyslexiaModeRaw] = useState(false);
  const [impairments, setImpairmentsRaw] = useState<ImpairmentFlags>(defaults);

  // hydrate from localStorage — intentional sync on mount for a11y preferences
  useEffect(() => {
    const p = localStorage.getItem("aura:profile") as Profile | null;
    const s = localStorage.getItem("aura:simpleMode");
    const d = localStorage.getItem("aura:dyslexia");
    const imp = localStorage.getItem("aura:impairments");
    if (p) setProfileRaw(p);
    if (s) setSimpleModeRaw(s === "true");
    if (d) setDyslexiaModeRaw(d === "true");
    if (imp) try { setImpairmentsRaw(JSON.parse(imp)); } catch {}
  }, []);

  const setProfile = useCallback((p: Profile) => {
    setProfileRaw(p);
    localStorage.setItem("aura:profile", p);
  }, []);
  const setSimpleMode = useCallback((v: boolean) => {
    setSimpleModeRaw(v);
    localStorage.setItem("aura:simpleMode", String(v));
    // simpleMode maps to cognitive
    setImpairmentsRaw(prev => {
      const n = { ...prev, cognitive: v };
      localStorage.setItem("aura:impairments", JSON.stringify(n));
      return n;
    });
  }, []);
  const setDyslexiaMode = useCallback((v: boolean) => {
    setDyslexiaModeRaw(v);
    localStorage.setItem("aura:dyslexia", String(v));
    setImpairmentsRaw(prev => {
      const n = { ...prev, dyslexia: v };
      localStorage.setItem("aura:impairments", JSON.stringify(n));
      return n;
    });
  }, []);
  const setImpairments = useCallback((f: ImpairmentFlags) => {
    setImpairmentsRaw(f);
    localStorage.setItem("aura:impairments", JSON.stringify(f));
    localStorage.setItem("aura:dyslexia", String(f.dyslexia));
    localStorage.setItem("aura:simpleMode", String(f.cognitive));
  }, []);

  const vars = useMemo(() => deriveVars(profile, simpleMode, impairments), [profile, simpleMode, impairments]);

  // apply CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--aura-target", `${vars.targetMin}px`);
    root.style.setProperty("--aura-font-scale", String(vars.fontScale));
    root.setAttribute("data-dyslexia", dyslexiaMode ? "true" : "false");
  }, [vars, dyslexiaMode]);

  const value = useMemo(() => ({ profile, setProfile, simpleMode, setSimpleMode, dyslexiaMode, setDyslexiaMode, impairments, setImpairments, vars }), [profile, simpleMode, dyslexiaMode, impairments, vars, setProfile, setSimpleMode, setDyslexiaMode, setImpairments]);

  return <AdaptiveContext.Provider value={value}>{children}</AdaptiveContext.Provider>;
}

export function useAdaptive() {
  const ctx = useContext(AdaptiveContext);
  if (!ctx) throw new Error("useAdaptive must be used within AdaptiveProvider");
  return ctx;
}
