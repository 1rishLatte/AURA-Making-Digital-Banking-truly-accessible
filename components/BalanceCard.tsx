import { formatCurrency } from "@/lib/utils";
import { useAdaptive } from "@/lib/adaptive-context";

export function BalanceCard({ balance }: { balance: number }) {
  const { simpleMode } = useAdaptive();
  if (simpleMode) {
    return (
      <div className="rounded-[12px] bg-white p-8 md:p-10 text-vault-ink border-[3px] border-vault-ink shadow-[0_8px_32px_rgba(15,17,26,0.12)]">
        <p className="text-[13px] uppercase tracking-[0.14em] font-semibold text-silver-veil mb-2" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Your money</p>
        <p className="text-[48px] md:text-[56px] leading-[0.95] tracking-[-1.6px] tabular-nums font-semibold" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{formatCurrency(balance)}</p>
        <p className="mt-3 text-[16px] font-medium text-charcoal">Across 1 account • Safe & secure</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-[13px] font-medium text-emerald-800">Available now</span>
        </div>
      </div>
    );
  }
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
