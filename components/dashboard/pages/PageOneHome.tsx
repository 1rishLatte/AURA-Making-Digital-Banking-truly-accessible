'use client';
import React from 'react';

export const PageOneHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-[8px] bg-[#0f111a] p-8 border border-[#2a2a2a]">
        <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">WELCOME BACK</span>
        <h2 className="text-[#ffffff] text-[32px] md:text-[40px] font-normal leading-none tracking-[-1.2px] mt-2">Good morning, Priya</h2>
        <p className="text-[#aeaeae] text-[14px] mt-2">Your vault is secure and ready.</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#aeaeae] text-[11px] font-mono uppercase tracking-[0.08em]">Balance</p>
            <p className="text-[#ffffff] text-[28px] font-normal tracking-[-0.8px]">₹1,24,500.00</p>
            <p className="text-[#aeaeae] text-[12px] font-mono">Across 1 account • Updated just now</p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1c53bd]/20 border border-[#53adfe]/30 text-[#53adfe] text-[12px] font-mono uppercase tracking-[0.08em] px-3 py-1.5">● System Safe</span>
            <span className="text-[#aeaeae] text-[11px] font-mono mt-2">Verified • No threats</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
          <p className="text-[#ffffff] text-[16px] font-normal">Send Money</p>
          <p className="text-[#aeaeae] text-[12px] font-mono mt-1">We check every transfer</p>
        </div>
        <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
          <p className="text-[#ffffff] text-[16px] font-normal">Safety Setup</p>
          <p className="text-[#aeaeae] text-[12px] font-mono mt-1">Add trusted contact</p>
        </div>
        <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
          <p className="text-[#ffffff] text-[16px] font-normal">Accessibility</p>
          <p className="text-[#aeaeae] text-[12px] font-mono mt-1">Make it easier to use</p>
        </div>
      </div>
    </div>
  );
};
