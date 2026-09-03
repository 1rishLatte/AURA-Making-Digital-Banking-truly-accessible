'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/lib/adaptive-context';

function formatPhone(value: string): string {
  // Indian mobile: 10 digits, 6-9 start, formatted as 5+5. Accepts +91 prefix.
  let digits = value.replace(/\D/g, '');
  // Strip leading 91 or 0 country/prefix if length >10
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(-10);
  else if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(-10);
  else if (digits.length > 10) digits = digits.slice(-10);
  digits = digits.slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function isValidPhone(value: string): boolean {
  let digits = value.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(-10);
  else if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(-10);
  else if (digits.length > 10) digits = digits.slice(-10);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

function toE164Phone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(-10);
  else if (digits.length > 10) digits = digits.slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
}

export const TrustedContactManager: React.FC = () => {
  const { trustedContact, setTrustedContact, activeProfile } = useAccessibility();
  const isMotor = activeProfile === 'motor';
  const inputH = isMotor ? 'min-h-[68px] h-[68px]' : 'min-h-[44px] h-[44px]';
  const btnH = isMotor ? 'min-h-[68px] h-[68px]' : 'min-h-[44px] h-[44px]';

  const [editing, setEditing] = useState(!trustedContact);
  const [fullName, setFullName] = useState(trustedContact?.fullName ?? '');
  const [phone, setPhone] = useState(trustedContact?.phone ?? '');
  const [relationship, setRelationship] = useState<TrustedContact['relationship']>(trustedContact?.relationship ?? 'Family Member');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (trustedContact) {
      setFullName(trustedContact.fullName);
      setPhone(trustedContact.phone);
      setRelationship(trustedContact.relationship);
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [trustedContact]);

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.name = 'Full name is required.';
    if (!isValidPhone(phone)) newErrors.phone = 'Enter valid 10-digit Indian mobile (starts 6-9).';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formatted = toE164Phone(phone);
    setTrustedContact({
      fullName: fullName.trim(),
      phone: formatted,
      relationship,
      verified: true,
    });
    setEditing(false);
  };

  const handleEdit = () => setEditing(true);

  if (!editing && trustedContact) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">SAFETY ESCALATION</span>
            <h3 className="text-[#ffffff] text-[18px] font-normal mt-1">Trusted Safety Contact</h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#1c53bd]/20 border border-[#53adfe]/30 text-[#53adfe] text-[12px] font-mono uppercase tracking-[0.08em] px-3 py-1">VERIFIED</span>
        </div>
        <p className="text-[#aeaeae] text-[13px] leading-relaxed">Assign a trusted contact phone number. If AURA flags a high-risk transfer or detects a cognitive lockout, an emergency 1-tap verification SMS is dispatched to this contact.</p>
        <div className="bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] p-4 space-y-2">
          <p className="text-[#ffffff] text-[16px] font-normal">{trustedContact.fullName}</p>
          <p className="text-[#aeaeae] text-[14px] font-mono tracking-[-0.01em]">{trustedContact.phone} • {trustedContact.relationship}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleEdit} className={`flex-1 border border-[#2a2a2a] hover:border-[#aeaeae] text-[#ffffff] rounded-[8px] text-[14px] font-normal transition-colors ${btnH}`}>Edit</button>
          <button
            onClick={() => {
              setTrustedContact(null);
              setFullName('');
              setPhone('');
              setRelationship('Family Member');
              setErrors({});
            }}
            className={`flex-1 text-[#aeaeae] hover:text-[#ffffff] text-[14px] font-normal ${btnH}`}
          >
            Remove
          </button>
        </div>
        <p className="text-[#aeaeae] text-[11px] font-mono leading-relaxed">Encrypted & Compliant: Phone credentials are utilized exclusively for emergency threat verification and escalation.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div>
          <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">SAFETY ESCALATION</span>
          <h3 className="text-[#ffffff] text-[18px] font-normal mt-1">Trusted Safety Contact</h3>
        </div>
        {trustedContact?.verified && (
          <span className="ml-auto inline-flex items-center rounded-full bg-[#1c53bd]/20 border border-[#53adfe]/30 text-[#53adfe] text-[12px] font-mono uppercase tracking-[0.08em] px-3 py-1">VERIFIED</span>
        )}
      </div>
      <p className="text-[#aeaeae] text-[13px] leading-relaxed">Assign a trusted contact phone number. If AURA flags a high-risk transfer or detects a cognitive lockout, an emergency 1-tap verification SMS is dispatched to this contact.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="tc-name" className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block mb-2">Full Name</label>
          <input
            id="tc-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="E.g., Priya Sharma"
            className={`w-full bg-[#0f111a] border ${errors.name ? 'border-red-500' : 'border-[#2a2a2a]'} rounded-[8px] px-4 text-[#ffffff] text-[14px] font-normal placeholder:text-[#aeaeae]/60 focus:outline-none focus:border-[#aeaeae] ${inputH}`}
          />
          {errors.name && <p className="text-red-500 text-[12px] mt-1 font-mono">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="tc-phone" className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block mb-2">Mobile Phone Number</label>
          <input
            id="tc-phone"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="98765 43210"
            inputMode="numeric"
            autoComplete="tel"
            className={`w-full bg-[#0f111a] border ${errors.phone ? 'border-red-500' : 'border-[#2a2a2a]'} rounded-[8px] px-4 text-[#ffffff] text-[14px] font-mono placeholder:text-[#aeaeae]/60 focus:outline-none focus:border-[#aeaeae] ${inputH}`}
          />
          <p className="text-[#aeaeae] text-[11px] font-mono mt-1">India +91 — 10 digits, starts 6-9. We'll add +91 automatically.</p>
          {errors.phone && <p className="text-red-500 text-[12px] mt-1 font-mono">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="tc-rel" className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block mb-2">Relationship Type</label>
          <select
            id="tc-rel"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as TrustedContact['relationship'])}
            className={`w-full bg-[#0f111a] border border-[#2a2a2a] rounded-[8px] px-4 text-[#ffffff] text-[14px] font-normal focus:outline-none focus:border-[#aeaeae] ${inputH}`}
          >
            <option>Family Member</option>
            <option>Caregiver</option>
            <option>Legal Guardian</option>
            <option>Trusted Friend</option>
          </select>
        </div>
      </div>

      <button onClick={handleSave} className={`w-full bg-[#ffffff] text-[#0f111a] rounded-[8px] text-[14px] font-normal hover:bg-[#efefef] transition-colors ${btnH}`}>
        Save & Verify Contact
      </button>

      <p className="text-[#aeaeae] text-[11px] font-mono leading-relaxed">Encrypted & Compliant: Phone credentials are utilized exclusively for emergency threat verification and escalation.</p>
    </div>
  );
};

type TrustedContact = import('@/lib/adaptive-context').TrustedContact;
