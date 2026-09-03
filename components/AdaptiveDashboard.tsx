"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAdaptive } from "@/lib/adaptive-context";
import { BalanceCard } from "./BalanceCard";
import { TransactionList } from "./TransactionList";
import { SimpleActionCard, SimpleTransactionCard } from "./SimpleActionCard";
import { MOCK_BALANCE, MOCK_TRANSACTIONS } from "@/lib/mock-data";

export function AdaptiveDashboard() {
  const { profile, simpleMode, vars, impairments } = useAdaptive();
  const isCognitive = simpleMode || profile === "cognitive" || impairments.cognitive;
  const gap = vars.targetMin >= 68 ? "gap-6" : "gap-4";

  return (
    <motion.div layout layoutId="dashboard-shell" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-[1280px] mx-auto px-6 md:px-10 py-10 flex flex-col gap-8" id="dashboard">
      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
        <BalanceCard balance={MOCK_BALANCE} />
        <div className="rounded-[8px] bg-charcoal text-white p-8 flex flex-col gap-4">
          <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Profile active</p>
          <p className="text-[24px] tracking-[-0.48px]" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{profile} {simpleMode ? "• simple" : ""}</p>
          <p className="text-[14px] text-silver-veil">Target {vars.targetMin}px • Scale {vars.fontScale}× • {vars.contrast} contrast • {impairments.dyslexia ? "Atkinson ON" : "Atkinson OFF"}</p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {isCognitive ? (
          <motion.div key="cognitive" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`grid md:grid-cols-2 ${gap}`}>
            <SimpleActionCard amount={5000} payee="Sunita Devi (Daughter)" />
            <SimpleActionCard amount={MOCK_BALANCE} />
            <div className="md:col-span-2 flex flex-col gap-3">
              {MOCK_TRANSACTIONS.slice(0, 3).map(t => <SimpleTransactionCard key={t.id} t={t} />)}
            </div>
          </motion.div>
        ) : (
          <motion.div key="standard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`flex flex-col ${gap}`}>
            <TransactionList transactions={MOCK_TRANSACTIONS} />
            <div className={`grid md:grid-cols-3 ${gap}`}>
              <div className="rounded-[8px] bg-white p-8">
                <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Quick send</p>
                <p className="text-[22px] mt-2">UPI → Daughter</p>
                <button className="mt-4 min-h-[var(--aura-target)] w-full rounded-[8px] bg-vault-ink text-white px-4">Send ₹5,000</button>
              </div>
              <div className="rounded-[8px] bg-white p-8">
                <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Help</p>
                <p className="text-[14px] mt-2 text-charcoal">Help stays in the same place across every page (WCAG 3.2.6) — bottom-right.</p>
              </div>
              <div className="rounded-[8px] bg-vault-ink text-white p-8">
                <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>WCAG 2.2</p>
                <p className="text-[16px] mt-2">2.4.11 Focus not obscured • 2.5.7 Drag alternative • 2.5.8 Target 24px (we ship 44-72) • 3.2.6 Consistent help</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
