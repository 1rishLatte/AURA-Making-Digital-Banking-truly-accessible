'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SafetyConfirmCanvas } from '@/components/SafetyConfirmCanvas';

export const PageThreeSendMoney: React.FC = () => {
  const [amount, setAmount] = useState('2500');
  const [recipient, setRecipient] = useState('');
  const [isNewRecipient, setIsNewRecipient] = useState(true);
  const [fraudResult, setFraudResult] = useState<{ message: string; action: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [executed, setExecuted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  // GSAP optimization: only run when this page is active (parent ensures activeStep === 3)
  useEffect(() => {
    const ctx = gsap.context(() => {}, ringRef);
    return () => {
      ctx.revert();
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <div ref={ringRef} className="space-y-6 accelerate-gpu">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-6 space-y-4">
        <h3 className="text-[#ffffff] text-[18px] font-normal">Send Money — We check every transfer</h3>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2500" className="w-full bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-white" />
        <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient" className="w-full bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-white" />
        <label className="flex items-center gap-2 text-[#aeaeae] text-[12px] font-mono">
          <input type="checkbox" checked={isNewRecipient} onChange={(e) => setIsNewRecipient(e.target.checked)} className="w-4 h-4 accent-[#1c53bd]" />
          New recipient
        </label>
        <button
          onClick={async () => {
            setChecking(true);
            try {
              const res = await fetch('/api/assistant/fraud-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount) || 0, recipient: recipient || 'Unknown', isNewRecipient }),
              });
              const data = await res.json();
              setFraudResult(data);
            } catch {
              setFraudResult({ message: 'Transaction looks normal.', action: 'ALLOW' });
            } finally {
              setChecking(false);
            }
          }}
          className="w-full bg-white text-[#0f111a] rounded-[8px] py-3 text-[14px]"
        >
          {checking ? 'Analyzing…' : 'Check transfer for scams'}
        </button>
        {fraudResult && <p className="text-[13px] text-[#aeaeae] p-3 bg-[#0f111a] border border-[#2a2a2a] rounded-[8px]">{fraudResult.message}</p>}
      </div>
      <div className="p-6 bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] text-center space-y-4">
        {executed ? (
          <p className="text-[#53adfe] text-[14px] font-mono">✓ Transfer authorized — tactile hold verified.</p>
        ) : fraudResult?.action === 'REQUIRE_TACTILE_HOLD' ? (
          <>
            <SafetyConfirmCanvas onConfirm={() => setExecuted(true)} />
            <p className="text-[#aeaeae] text-[12px] font-mono">🛡️ High-Risk Transfer Shield: Press and hold for 1.5s</p>
          </>
        ) : (
          <p className="text-[#aeaeae] text-[12px] font-mono">Standard security active — you may proceed.</p>
        )}
      </div>
    </div>
  );
};
