'use client';
import React from 'react';

export const PageTwoAccount: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
        <h3 className="text-[#ffffff] text-[18px] font-normal">Account Details</h3>
        <p className="text-[#aeaeae] text-[13px] mt-2">Balance breakdown, transaction history, and settings — simplified for clarity.</p>
        <div className="mt-4 space-y-2 text-[13px] font-mono">
          <div className="flex justify-between"><span className="text-[#aeaeae]">Checking</span><span className="text-[#ffffff]">₹84,200.00</span></div>
          <div className="flex justify-between"><span className="text-[#aeaeae]">Savings</span><span className="text-[#ffffff]">₹40,300.00</span></div>
        </div>
      </div>
      <div className="rounded-[8px] bg-[#0f111a] border border-[#2a2a2a] p-6">
        <p className="text-[#aeaeae] text-[12px] font-mono uppercase">Recent Transactions</p>
        <div className="mt-3 space-y-2 text-[13px]">
          <div className="flex justify-between"><span>Asha Medical • 28 Aug</span><span>−₹1,250</span></div>
          <div className="flex justify-between"><span>Pension Credit • 25 Aug</span><span className="text-emerald-400">+₹32,000</span></div>
        </div>
      </div>
    </div>
  );
};
