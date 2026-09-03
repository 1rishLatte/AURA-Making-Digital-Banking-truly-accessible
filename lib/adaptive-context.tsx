'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type AccessibilityProfile = 'standard' | 'motor' | 'cognitive' | 'vision';
export type FocusIndicatorStyle = 'standard' | 'neon' | 'pulsing';
export type UIScale = '100' | '115' | '130';
export type ButtonLayout = 'default' | 'stacked';

export interface TrustedContact {
  fullName: string;
  phone: string;
  relationship: 'Family Member' | 'Caregiver' | 'Legal Guardian' | 'Trusted Friend';
  verified: boolean;
}

interface AccessibilityContextType {
  activeProfile: AccessibilityProfile;
  setActiveProfile: (profile: AccessibilityProfile) => void;
  dyslexiaFontEnabled: boolean;
  setDyslexiaFontEnabled: (enabled: boolean) => void;
  simpleViewEnabled: boolean;
  setSimpleViewEnabled: (enabled: boolean) => void;
  tremorFilterEnabled: boolean;
  setTremorFilterEnabled: (enabled: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  trustedContact: TrustedContact | null;
  setTrustedContact: (c: TrustedContact | null) => void;
  // New UI reconfiguration
  focusStyle: FocusIndicatorStyle;
  setFocusStyle: (s: FocusIndicatorStyle) => void;
  uiScale: UIScale;
  setUiScale: (s: UIScale) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  buttonLayout: ButtonLayout;
  setButtonLayout: (v: ButtonLayout) => void;
  resetAll: () => void;
  // Legacy aliases for existing components (keep build green)
  profile: AccessibilityProfile;
  setProfile: (p: AccessibilityProfile) => void;
  simpleMode: boolean;
  setSimpleMode: (v: boolean) => void;
  dyslexiaMode: boolean;
  setDyslexiaMode: (v: boolean) => void;
  impairments: { cognitive: boolean; motor: boolean; vision: boolean; hearing: boolean; dyslexia: boolean; anxiety: boolean };
  setImpairments: (f: { cognitive: boolean; motor: boolean; vision: boolean; hearing: boolean; dyslexia: boolean; anxiety: boolean }) => void;
  vars: { targetMin: number; fontScale: number; density: string; contrast: 'normal' | 'high' };
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfile, setActiveProfile] = useState<AccessibilityProfile>('standard');
  const [dyslexiaFontEnabled, setDyslexiaFontEnabled] = useState(false);
  const [simpleViewEnabled, setSimpleViewEnabled] = useState(false);
  const [tremorFilterEnabled, setTremorFilterEnabled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trustedContact, setTrustedContact] = useState<TrustedContact | null>(null);
  const [focusStyle, setFocusStyle] = useState<FocusIndicatorStyle>('neon');
  const [uiScale, setUiScale] = useState<UIScale>('100');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<ButtonLayout>('default');

  useEffect(() => {
    const root = document.documentElement;
    if (dyslexiaFontEnabled) {
      root.classList.add('font-dyslexia');
      root.setAttribute('data-dyslexia', 'true');
    } else {
      root.classList.remove('font-dyslexia');
      root.removeAttribute('data-dyslexia');
    }

    if (activeProfile === 'vision') {
      root.classList.add('theme-vision-aaa');
    } else {
      root.classList.remove('theme-vision-aaa');
    }

    // New UI reconfiguration attributes
    root.setAttribute('data-focus-style', focusStyle);
    root.setAttribute('data-ui-scale', uiScale);
    root.setAttribute('data-reduced-motion', String(reducedMotion));
    root.setAttribute('data-button-layout', buttonLayout);

    // Apply CSS vars for backward compat (simpleMode etc. drive --aura-target)
    const targetMin = simpleViewEnabled || activeProfile === 'cognitive' ? 72 : activeProfile === 'vision' ? 72 : activeProfile === 'motor' ? 68 : dyslexiaFontEnabled ? 48 : 44;
    const fontScale = simpleViewEnabled || activeProfile === 'cognitive' ? 1.35 : activeProfile === 'vision' ? 1.3 : activeProfile === 'motor' ? 1.05 : dyslexiaFontEnabled ? 1.08 : 1;
    root.style.setProperty('--aura-target', `${targetMin}px`);
    root.style.setProperty('--aura-font-scale', String(fontScale));

    // Persist
    try {
      localStorage.setItem('aura:profile', activeProfile);
      localStorage.setItem('aura:simpleMode', String(simpleViewEnabled));
      localStorage.setItem('aura:dyslexia', String(dyslexiaFontEnabled));
      localStorage.setItem('aura:impairments', JSON.stringify({ cognitive: simpleViewEnabled, motor: activeProfile === 'motor', vision: activeProfile === 'vision', hearing: false, dyslexia: dyslexiaFontEnabled, anxiety: false }));
      if (trustedContact) localStorage.setItem('aura:trustedContact', JSON.stringify(trustedContact));
      else localStorage.removeItem('aura:trustedContact');
      localStorage.setItem('aura_ui_config_v1', JSON.stringify({ focusStyle, uiScale, reducedMotion, buttonLayout }));
    } catch {}
  }, [dyslexiaFontEnabled, activeProfile, simpleViewEnabled, trustedContact, focusStyle, uiScale, reducedMotion, buttonLayout]);

  // Hydrate once
  useEffect(() => {
    try {
      const p = localStorage.getItem('aura:profile') as AccessibilityProfile | null;
      const s = localStorage.getItem('aura:simpleMode');
      const d = localStorage.getItem('aura:dyslexia');
      const tc = localStorage.getItem('aura:trustedContact');
      if (p) setActiveProfile(p);
      if (s) setSimpleViewEnabled(s === 'true');
      if (d) setDyslexiaFontEnabled(d === 'true');
      if (tc) setTrustedContact(JSON.parse(tc));
      const saved = localStorage.getItem('aura_ui_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.focusStyle) setFocusStyle(parsed.focusStyle);
        if (parsed.uiScale) setUiScale(parsed.uiScale);
        if (parsed.reducedMotion !== undefined) setReducedMotion(parsed.reducedMotion);
        if (parsed.buttonLayout) setButtonLayout(parsed.buttonLayout);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = useCallback(() => {
    setActiveProfile('standard');
    setDyslexiaFontEnabled(false);
    setSimpleViewEnabled(false);
    setTremorFilterEnabled(false);
    setTrustedContact(null);
    try { localStorage.removeItem('aura:trustedContact'); } catch {}
  }, []);

  // Legacy derived values for old consumers
  const legacyVars = useMemo(() => ({
    targetMin: simpleViewEnabled || activeProfile === 'cognitive' ? 72 : activeProfile === 'vision' ? 72 : activeProfile === 'motor' ? 68 : dyslexiaFontEnabled ? 48 : 44,
    fontScale: simpleViewEnabled || activeProfile === 'cognitive' ? 1.35 : activeProfile === 'vision' ? 1.3 : activeProfile === 'motor' ? 1.05 : dyslexiaFontEnabled ? 1.08 : 1,
    density: '16px',
    contrast: (activeProfile === 'vision' ? 'high' : 'normal') as 'normal' | 'high',
  }), [activeProfile, simpleViewEnabled, dyslexiaFontEnabled]);

  const impairments = useMemo(() => ({
    cognitive: simpleViewEnabled || activeProfile === 'cognitive',
    motor: activeProfile === 'motor',
    vision: activeProfile === 'vision',
    hearing: false,
    dyslexia: dyslexiaFontEnabled,
    anxiety: false,
  }), [activeProfile, simpleViewEnabled, dyslexiaFontEnabled]);

  const value: AccessibilityContextType = useMemo(() => ({
    activeProfile,
    setActiveProfile,
    dyslexiaFontEnabled,
    setDyslexiaFontEnabled,
    simpleViewEnabled,
    setSimpleViewEnabled,
    tremorFilterEnabled,
    setTremorFilterEnabled,
    isDrawerOpen,
    setIsDrawerOpen,
    trustedContact,
    setTrustedContact,
    focusStyle,
    setFocusStyle,
    uiScale,
    setUiScale,
    reducedMotion,
    setReducedMotion,
    buttonLayout,
    setButtonLayout,
    resetAll,
    // aliases
    profile: activeProfile,
    setProfile: setActiveProfile,
    simpleMode: simpleViewEnabled,
    setSimpleMode: setSimpleViewEnabled,
    dyslexiaMode: dyslexiaFontEnabled,
    setDyslexiaMode: setDyslexiaFontEnabled,
    impairments,
    setImpairments: (f: { cognitive: boolean; motor: boolean; vision: boolean; hearing: boolean; dyslexia: boolean; anxiety: boolean }) => {
      setSimpleViewEnabled(!!f.cognitive);
      setDyslexiaFontEnabled(!!f.dyslexia);
      if (f.motor) setActiveProfile('motor');
      else if (f.vision) setActiveProfile('vision');
      else if (f.cognitive) setActiveProfile('cognitive');
    },
    vars: legacyVars,
  }), [activeProfile, dyslexiaFontEnabled, simpleViewEnabled, tremorFilterEnabled, isDrawerOpen, trustedContact, focusStyle, uiScale, reducedMotion, buttonLayout, impairments, legacyVars, resetAll]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};

// Backward compat alias for older imports
export const useAdaptive = useAccessibility;
export const AdaptiveProvider = AccessibilityProvider;
