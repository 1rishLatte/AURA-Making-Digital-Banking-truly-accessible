'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility, AccessibilityProfile } from '@/lib/adaptive-context';

export const AccessibilityDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    activeProfile,
    setActiveProfile,
    dyslexiaFontEnabled,
    setDyslexiaFontEnabled,
    simpleViewEnabled,
    setSimpleViewEnabled,
    tremorFilterEnabled,
    setTremorFilterEnabled,
    trustedContact,
    resetAll,
  } = useAccessibility();

  const profiles: { id: AccessibilityProfile; label: string; desc: string }[] = [
    { id: 'standard', label: 'Standard View', desc: 'Default density and default spacing' },
    { id: 'motor', label: 'Motor Assist', desc: 'Expands touch targets to 68px+ & activates magnetic snapping' },
    { id: 'cognitive', label: 'Cognitive Clarity', desc: 'Simplifies tables into progressive 1-step cards' },
    { id: 'vision', label: 'Vision Assist', desc: 'Forces WCAG AAA 18:1+ high-contrast monochrome mode' },
  ];

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Side Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-[380px] bg-[#0f111a] border-l border-[#2a2a2a] z-50 p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Top Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#2a2a2a]">
                <div>
                  <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">
                    SYSTEM CONTROL
                  </span>
                  <h2 className="text-[#ffffff] text-[22px] font-normal tracking-[-0.44px] mt-1">
                    Accessibility Options
                  </h2>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-[#aeaeae] hover:text-[#ffffff] text-[20px] p-2 rounded-[8px] border border-transparent hover:border-[#2a2a2a]"
                >
                  ✕
                </button>
              </div>

              {/* Profile Selection */}
              <div className="mt-6 space-y-3">
                <span className="text-[#aeaeae] text-[14px] font-mono uppercase tracking-[0.018em] block">
                  Interaction Profile
                </span>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProfile(p.id)}
                    className={`w-full text-left p-4 rounded-[8px] border transition-all ${
                      activeProfile === p.id
                        ? 'border-[#ffffff] bg-[#141414]'
                        : 'border-[#2a2a2a] bg-transparent hover:border-[#aeaeae]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#ffffff] text-[16px] font-normal">{p.label}</span>
                      {activeProfile === p.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#53adfe]" />
                      )}
                    </div>
                    <p className="text-[#aeaeae] text-[14px] mt-1 font-normal leading-relaxed">{p.desc}</p>
                  </button>
                ))}
              </div>

              {/* Individual Feature Toggles */}
              <div className="mt-8 space-y-4 pt-6 border-t border-[#2a2a2a]">
                <span className="text-[#aeaeae] text-[14px] font-mono uppercase tracking-[0.018em] block">
                  Fine-Tuned Adjustments
                </span>

                {/* Dyslexia Toggle */}
                <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#2a2a2a]">
                  <div>
                    <span className="text-[#ffffff] text-[14px] block">Dyslexia-Friendly Font</span>
                    <span className="text-[#aeaeae] text-[12px] block">Enforces high-legibility character spacing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dyslexiaFontEnabled}
                    onChange={(e) => setDyslexiaFontEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#1c53bd] cursor-pointer"
                  />
                </div>

                {/* Simplified View Toggle */}
                <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#2a2a2a]">
                  <div>
                    <span className="text-[#ffffff] text-[14px] block">Simplified 1-Step View</span>
                    <span className="text-[#aeaeae] text-[12px] block">Removes non-essential analytical panels</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={simpleViewEnabled}
                    onChange={(e) => setSimpleViewEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#1c53bd] cursor-pointer"
                  />
                </div>

                {/* Tremor Filter Toggle */}
                <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#2a2a2a]">
                  <div>
                    <span className="text-[#ffffff] text-[14px] block">Jitter & Tremor Filter</span>
                    <span className="text-[#aeaeae] text-[12px] block">Debounces accidental double-taps</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tremorFilterEnabled}
                    onChange={(e) => setTremorFilterEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#1c53bd] cursor-pointer"
                  />
                </div>
                {/* Trusted Contact Status */}
                <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#2a2a2a] bg-[#141414]">
                  <div>
                    <span className="text-[#ffffff] text-[14px] block">Trusted Safety Contact</span>
                    <span className="text-[#aeaeae] text-[12px] block">{trustedContact ? `${trustedContact.fullName} • ${trustedContact.phone}` : 'No contact configured'}</span>
                  </div>
                  {trustedContact?.verified ? (
                    <span className="inline-flex items-center rounded-full bg-[#1c53bd]/20 border border-[#53adfe]/30 text-[#53adfe] text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1">Active</span>
                  ) : (
                    <button onClick={() => { setIsDrawerOpen(false); document.getElementById('trusted-contact-manager')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-[#53adfe] hover:text-[#ffffff] text-[12px] font-mono underline">Add Phone Number</button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#2a2a2a] mt-8 flex items-center justify-between">
              <button
                onClick={resetAll}
                className="text-[#aeaeae] hover:text-[#ffffff] text-[14px] underline font-mono"
              >
                Reset to Default
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="bg-[#ffffff] text-[#0f111a] text-[14px] px-4 py-2 rounded-[8px] hover:bg-[#efefef] transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
