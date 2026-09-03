'use client';
import React from 'react';

export const PageFiveHelp: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
          <h4 className="text-[#ffffff] text-[16px] font-normal">Thinking and reading</h4>
          <p className="text-[#aeaeae] text-[13px] mt-1">Big text. One clear step at a time.</p>
        </div>
        <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
          <h4 className="text-[#ffffff] text-[16px] font-normal">Hands and movement</h4>
          <p className="text-[#aeaeae] text-[13px] mt-1">Big buttons. No dragging.</p>
        </div>
        <div className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6">
          <h4 className="text-[#ffffff] text-[16px] font-normal">Seeing and hearing</h4>
          <p className="text-[#aeaeae] text-[13px] mt-1">Loud and clear. Works with screen readers.</p>
        </div>
      </div>
      <div className="rounded-[8px] bg-[#0f111a] border border-[#2a2a2a] p-6 text-center">
        <p className="text-[#aeaeae] text-[12px] font-mono">Calm & Safety — No countdown, no panic</p>
        <p className="text-[#ffffff] text-[14px] mt-2">You’re safe to proceed. Take your time.</p>
      </div>
    </div>
  );
};
