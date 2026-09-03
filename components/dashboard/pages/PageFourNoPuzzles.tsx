'use client';
import React from 'react';

export const PageFourNoPuzzles: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
        <h3 className="text-[#ffffff] text-[18px] font-normal">No Puzzles — No hard reading</h3>
        <p className="text-[#aeaeae] text-[13px] mt-2">We check in the background. No distorted text, no grid puzzles.</p>
        <div className="mt-4 p-4 bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] text-center">
          <p className="text-[#53adfe] text-[14px] font-mono">✓ Verified • Score 89/100</p>
          <p className="text-[#aeaeae] text-[12px] font-mono mt-1">Passive — background risk + PAT</p>
        </div>
      </div>
      <div className="rounded-[8px] bg-[#0f111a] border border-[#2a2a2a] p-6">
        <h4 className="text-[#ffffff] text-[16px] font-normal">Passkeys & WebAuthn</h4>
        <p className="text-[#aeaeae] text-[13px] mt-1">Face ID, Touch ID, Windows Hello — no captchas.</p>
      </div>
    </div>
  );
};
