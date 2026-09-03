import { formatCurrency } from "@/lib/utils";

export function BalanceCard({ balance }: { balance: number }) {
  return (
    <div className="rounded-[8px] bg-charcoal/90 p-8 md:p-10 text-white">
      <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Total balance</p>
      <p className="text-[40px] md:text-[48px] leading-[1.06] tracking-[-1.44px] tabular-nums" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{formatCurrency(balance)}</p>
      <p className="mt-4 text-[14px] text-silver-veil">Across 1 account • Last updated just now</p>
      <div className="mt-6 h-px bg-white/10" />
      <div className="mt-6 flex gap-3">
        <span className="text-[14px] text-frost">INR • en-IN • Asia/Kolkata</span>
      </div>
    </div>
  );
}
