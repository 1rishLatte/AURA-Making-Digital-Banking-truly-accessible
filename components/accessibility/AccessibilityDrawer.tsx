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
    focusStyle,
    setFocusStyle,
    uiScale,
    setUiScale,
    reducedMotion,
    setReducedMotion,
    buttonLayout,
    setButtonLayout,
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
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : undefined}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Side Panel */}
          <motion.aside
            initial={reducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
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

                {/* Focus Indicator Selector */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono uppercase text-[#aeaeae]">Focus Indicator (Head / Foot Mouse)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', label: 'Blue Ring' },
                      { id: 'neon', label: 'Neon Yellow' },
                      { id: 'pulsing', label: 'Pulsing' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setFocusStyle(item.id as typeof focusStyle)}
                        className={`p-2.5 rounded-[8px] border text-[12px] font-medium transition-all ${
                          focusStyle === item.id ? 'bg-[#141414] border-[#facc15] text-[#facc15]' : 'bg-[#0f111a] border-[#2a2a2a] text-[#aeaeae]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UI Scaling */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono uppercase text-[#aeaeae]">UI Scale & Text Zoom</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '100', label: '100%' },
                      { id: '115', label: '115%' },
                      { id: '130', label: '130%' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setUiScale(item.id as typeof uiScale)}
                        className={`p-2.5 rounded-[8px] border text-[12px] font-medium transition-all ${
                          uiScale === item.id ? 'bg-[#141414] border-[#53adfe] text-[#ffffff]' : 'bg-[#0f111a] border-[#2a2a2a] text-[#aeaeae]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motion & Button Layout Toggles — Image 2 style: green ON with ON text, outline OFF */}
                <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#2a2a2a] rounded-[8px]">
                  <div>
                    <p className="text-[14px] text-[#ffffff]">Suppress Animations</p>
                    <p className="text-[12px] text-[#aeaeae]">Disables all motion effects</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={reducedMotion}
                    aria-label="Toggle suppress animations"
                    onClick={() => setReducedMotion(!reducedMotion)}
                    className={`relative inline-flex items-center shrink-0 rounded-full border-2 p-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]
                      ${activeProfile === 'vision'
                        ? reducedMotion
                          ? 'bg-white border-white'
                          : 'bg-black border-white'
                        : reducedMotion
                        ? 'bg-[#00D492] border-[#00D492]'
                        : 'bg-transparent border-white'}
                      w-[64px] h-[32px]`}
                  >
                    {reducedMotion ? (
                      <>
                        <span className={`text-[11px] font-bold tracking-wide select-none ml-1 ${activeProfile === 'vision' ? 'text-black' : 'text-black'}`} aria-hidden>ON</span>
                        <span className={`ml-auto w-[24px] h-[24px] rounded-full shadow-sm ${activeProfile === 'vision' ? 'bg-black' : 'bg-white'}`} />
                      </>
                    ) : (
                      <>
                        <span className="w-[24px] h-[24px] rounded-full bg-white shadow-sm" />
                        <span className="text-[11px] font-bold tracking-wide text-white mr-1 select-none" aria-hidden>OFF</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#2a2a2a] rounded-[8px]">
                  <div>
                    <p className="text-[14px] text-[#ffffff]">Stack Action Buttons</p>
                    <p className="text-[12px] text-[#aeaeae]">Full-width targets for foot mice</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={buttonLayout === 'stacked'}
                    aria-label="Toggle stack action buttons"
                    onClick={() => setButtonLayout(buttonLayout === 'stacked' ? 'default' : 'stacked')}
                    className={`relative inline-flex items-center shrink-0 rounded-full border-2 p-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]
                      ${activeProfile === 'vision'
                        ? buttonLayout === 'stacked'
                          ? 'bg-white border-white'
                          : 'bg-black border-white'
                        : buttonLayout === 'stacked'
                        ? 'bg-[#00D492] border-[#00D492]'
                        : 'bg-transparent border-white'}
                      w-[64px] h-[32px]`}
                  >
                    {buttonLayout === 'stacked' ? (
                      <>
                        <span className="text-[11px] font-bold tracking-wide text-black ml-1 select-none" aria-hidden>ON</span>
                        <span className={`ml-auto w-[24px] h-[24px] rounded-full shadow-sm ${activeProfile === 'vision' ? 'bg-black' : 'bg-white'}`} />
                      </>
                    ) : (
                      <>
                        <span className="w-[24px] h-[24px] rounded-full bg-white shadow-sm" />
                        <span className="text-[11px] font-bold tracking-wide text-white mr-1 select-none" aria-hidden>OFF</span>
                      </>
                    )}
                  </button>
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
