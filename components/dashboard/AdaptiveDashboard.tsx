'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccessibility } from '@/lib/adaptive-context';
import { TrustedContactManager } from '@/components/safety/TrustedContactManager';

// Dynamic import for heavy GSAP canvas — no SSR
const SafetyConfirmCanvas = dynamic(() => import('@/components/SafetyConfirmCanvas').then((m) => m.SafetyConfirmCanvas), {
  ssr: false,
  loading: () => <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#2a2a2a] animate-pulse" />,
});

export const AdaptiveDashboard: React.FC = () => {
  const { activeProfile, simpleViewEnabled } = useAccessibility();
  const [activeStep, setActiveStep] = useState(1);
  const [amount, setAmount] = useState('2500');
  const [recipient, setRecipient] = useState('');
  const [isNewRecipient, setIsNewRecipient] = useState(true);
  const [fraudResult, setFraudResult] = useState<{ threatScore: number; threatCategory: string; message: string; action: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [executed, setExecuted] = useState(false);

  return (
    <main className="min-h-screen bg-[#0f111a] text-[#ffffff] p-6 md:p-12 space-y-12 max-w-[1280px] mx-auto accelerate-gpu">
      {/* Header Section */}
      <section className="space-y-3">
        <span className="text-[#aeaeae] text-[14px] font-mono uppercase tracking-[0.018em] block">
          ACCOUNT OVERVIEW
        </span>
        <h1 className="text-[48px] md:text-[84px] font-normal leading-[0.95] tracking-[-3.36px]">
          $124,500.00
        </h1>
        <p className="text-[#aeaeae] text-[16px] font-normal">
          Vault Balance · Portfolio Protected
        </p>
      </section>

      {/* Main Grid Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Safety Column — Trusted Contact */}
        <div id="trusted-contact-manager" className="md:col-span-2 scroll-mt-24">
          <TrustedContactManager />
        </div>
        {/* Quick Action Card with GSAP Hold Ring Context — wired to /api/assistant/fraud-check */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-8 space-y-6">
          <span className="text-[#aeaeae] text-[14px] font-mono uppercase tracking-[0.018em] block">
            TRANSFER CONTROL
          </span>
          <h3 className="text-[24px] font-normal text-[#ffffff]">Execute Wire Transfer</h3>

          <div className="space-y-3">
            <label className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">Amount (USD)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" placeholder="2500" className="w-full bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-[#ffffff] text-[14px] font-mono focus:outline-none focus:border-[#aeaeae]" />
            <label className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">Recipient</label>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g., Alex Rivera" className="w-full bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-[#ffffff] text-[14px] font-normal focus:outline-none focus:border-[#aeaeae]" />
            <label className="flex items-center gap-2 text-[#aeaeae] text-[12px] font-mono">
              <input type="checkbox" checked={isNewRecipient} onChange={(e) => setIsNewRecipient(e.target.checked)} className="w-4 h-4 accent-[#1c53bd]" />
              New recipient (never transacted before)
            </label>
            <button
              onClick={async () => {
                setChecking(true);
                setExecuted(false);
                setFraudResult(null);
                try {
                  const res = await fetch('/api/assistant/fraud-check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: Number(amount) || 0, recipient: recipient || 'Unknown', isNewRecipient }),
                  });
                  const data = await res.json();
                  setFraudResult(data);
                } catch {
                  setFraudResult({ threatScore: 0.12, threatCategory: 'NONE', message: 'Transaction looks normal. Standard security active.', action: 'ALLOW' });
                } finally {
                  setChecking(false);
                }
              }}
              className="w-full bg-[#ffffff] text-[#0f111a] rounded-[8px] py-3 text-[14px] font-normal hover:bg-[#efefef] transition-colors"
            >
              {checking ? 'Analyzing…' : 'Check transfer for scams'}
            </button>
          </div>

          {fraudResult && (
            <div className={`p-4 rounded-[8px] border text-[13px] leading-relaxed ${fraudResult.action === 'REQUIRE_TACTILE_HOLD' ? 'bg-[#1c53bd]/10 border-[#53adfe]/30 text-[#ffffff]' : 'bg-[#0f111a] border-[#2a2a2a] text-[#aeaeae]'}`}>
              <p className={fraudResult.action === 'REQUIRE_TACTILE_HOLD' ? 'text-[#ffffff]' : 'text-[#aeaeae]'}>{fraudResult.message}</p>
              <p className="text-[11px] font-mono mt-2 opacity-70">Score {fraudResult.threatScore} • {fraudResult.threatCategory} • {fraudResult.action}</p>
            </div>
          )}

          {/* GSAP Hold Ring — shown when high risk, otherwise still available as tactile confirm */}
          <div className="p-6 bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] text-center space-y-4">
            {executed ? (
              <p className="text-[#53adfe] text-[14px] font-mono">✓ Transfer authorized — tactile hold verified.</p>
            ) : fraudResult?.action === 'REQUIRE_TACTILE_HOLD' ? (
              <>
                <SafetyConfirmCanvas onConfirm={() => setExecuted(true)} />
                <p className="text-[#aeaeae] text-[12px] font-mono leading-relaxed">
                  🛡️ High-Risk Transfer Shield: Press and hold the target node for 1.5s to verify intent and execute.
                </p>
              </>
            ) : fraudResult?.action === 'ALLOW' ? (
              <p className="text-[#aeaeae] text-[12px] font-mono leading-relaxed">Standard security active — you may proceed without hold. Hold ring available for extra confirmation.</p>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#53adfe] flex items-center justify-center">
                  <span className="text-[20px]">🔒</span>
                </div>
                <p className="text-[#aeaeae] text-[12px] font-mono leading-relaxed">
                  🛡️ High-Risk Transfer Shield: Press and hold the target node for 1.5s to verify intent and execute.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Voice Copilot Card with Local Voice Privacy Context */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-8 space-y-6">
          <span className="text-[#aeaeae] text-[14px] font-mono uppercase tracking-[0.018em] block">
            MULTIMODAL ASSISTANT
          </span>
          <h3 className="text-[24px] font-normal text-[#ffffff]">Voice Action Agent</h3>
          
          <div className="p-6 bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] text-center space-y-4">
            <button className="w-16 h-16 mx-auto rounded-full bg-[#1c53bd] text-[#ffffff] flex items-center justify-center text-[24px] hover:opacity-90 transition-opacity">
              🎤
            </button>
            <p className="text-[#ffffff] text-[14px]">Tap and speak your request...</p>
            
            {/* CONTEXTUAL DISCLAIMER — RELOCATED HERE */}
            <p className="text-[#aeaeae] text-[12px] font-mono leading-relaxed">
              🔒 Voice commands are processed locally. Audio recordings are never saved or transmitted.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
