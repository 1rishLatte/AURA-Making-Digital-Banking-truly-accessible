import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recipientName: string;
  recipientId: string;
  amount: number;
}

export const TransactionConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  recipientName,
  recipientId,
  amount,
}) => {
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100%
  const [isHolding, setIsHolding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Convert numeric amount to spoken words helper
  const amountInWords = `${amount.toLocaleString('en-IN')} rupees`;

  // Voice Readout Handler
  const handleReadSummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const summaryText = `Confirming transfer of ${amountInWords} to ${recipientName}. Security status is verified clean. Press and hold the confirm button for one point five seconds to authorize.`;
    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Try to use best voice if available
    try {
      const voices = window.speechSynthesis.getVoices();
      const best = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      if (best) utterance.voice = best;
    } catch {}

    window.speechSynthesis.speak(utterance);
  };

  // Hold-to-Confirm Physics (1.5 seconds = 1500ms)
  const startHold = () => {
    setIsHolding(true);
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 5; // increment every 75ms (1500ms total)
      setHoldProgress(current);
      if (current >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsHolding(false);
        onSuccess();
      }
    }, 75);
  };

  const stopHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  // Close on Escape Key press + focus trap
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    // Focus the close button when opened
    setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      // Simple focus trap: keep focus within modal
      if (e.key === 'Tab' && isOpen) {
        const focusable = document.querySelectorAll<HTMLElement>(
          '[role="dialog"] button, [role="dialog"] [href], [role="dialog"] input, [role="dialog"] select, [role="dialog"] textarea, [role="dialog"] [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Hide siblings from screen readers
    const siblings = Array.from(document.body.children).filter((el) => !el.contains(document.querySelector('[role="dialog"]')));
    siblings.forEach((el) => el.setAttribute('aria-hidden', 'true'));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      siblings.forEach((el) => el.removeAttribute('aria-hidden'));
      // Restore focus
      previousFocusRef.current?.focus();
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#0f111a] border border-[#2a2a2a] rounded-[16px] p-6 text-[#ffffff] shadow-2xl space-y-5 accelerate-gpu"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
            <h2 id="confirm-modal-title" className="text-[18px] font-normal text-[#ffffff]">
              Confirm Transfer
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 min-w-[32px] min-h-[32px] rounded-full hover:bg-[#2a2a2a] text-[#aeaeae] hover:text-[#ffffff] focus-visible:outline-2 focus-visible:outline-[#53adfe]"
              aria-label="Cancel and close modal"
            >
              ✕
            </button>
          </div>

          {/* Transfer Summary Card */}
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-[12px] p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[12px] text-[#aeaeae] uppercase tracking-wider font-mono">Recipient</p>
                <p className="text-[16px] font-normal text-[#ffffff]">{recipientName}</p>
                <p className="text-[12px] text-[#aeaeae] font-mono">{recipientId}</p>
              </div>
              <span className="bg-[#122b1c] text-[#4ade80] border border-[#1e5230] text-[11px] px-2.5 py-1 rounded-full font-mono">
                🛡️ Low Risk
              </span>
            </div>

            <hr className="border-[#2a2a2a]" />

            <div>
              <p className="text-[12px] text-[#aeaeae] uppercase tracking-wider font-mono">Total Amount</p>
              <p className="text-[28px] font-mono font-medium text-[#53adfe]">₹{amount.toLocaleString('en-IN')}</p>
              <p className="text-[13px] text-[#aeaeae] capitalize">{amountInWords}</p>
            </div>
          </div>

          {/* Voice Audio Readout Action */}
          <button
            onClick={handleReadSummary}
            className={`w-full h-[40px] rounded-[128px] border border-[#2a2a2a] text-[13px] font-normal flex items-center justify-center space-x-2 transition-all ${
              isSpeaking ? 'bg-[#53adfe] text-[#0f111a]' : 'bg-[#141414] hover:bg-[#1f1f1f] text-[#ffffff]'
            }`}
          >
            <span>🔊</span>
            <span>{isSpeaking ? 'Speaking summary...' : 'Hear summary out loud'}</span>
          </button>

          {/* Hold-to-Confirm Button (Tactile Circuit Breaker) */}
          <div className="space-y-2 pt-2">
            <p className="text-[12px] text-[#aeaeae] text-center">Press and hold for 1.5 seconds to authorize payment:</p>

            <button
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              className="relative w-full h-[52px] bg-[#141414] border border-[#53adfe] rounded-[12px] overflow-hidden select-none touch-none focus-visible:outline-2 focus-visible:outline-[#53adfe]"
              aria-label="Hold to confirm transaction"
            >
              {/* Progress Fill Layer */}
              <div className="absolute top-0 left-0 bottom-0 bg-[#53adfe] transition-all ease-linear duration-75" style={{ width: `${holdProgress}%` }} />

              {/* Label Layer */}
              <span className={`relative z-10 text-[15px] font-normal transition-colors ${holdProgress > 50 ? 'text-[#0f111a]' : 'text-[#ffffff]'}`}>
                {isHolding ? `Hold... ${Math.round(holdProgress)}%` : 'Press & Hold to Confirm Transfer'}
              </span>
            </button>

            {/* Cancel Button */}
            <button onClick={onClose} className="w-full h-[44px] text-[#aeaeae] hover:text-[#ffffff] text-[13px] rounded-[8px] hover:bg-[#2a2a2a]/40 transition-colors">
              Cancel and Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
