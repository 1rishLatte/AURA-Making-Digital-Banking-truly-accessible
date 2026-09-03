import { Transaction } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function SimpleActionCard({ amount, payee, onClick }: { amount?: number; payee?: string; onClick?: () => void }) {
  return (
    <div className="rounded-[12px] bg-white p-8 md:p-10 flex flex-col gap-6 min-h-[240px] border-[3px] border-vault-ink shadow-[0_8px_32px_rgba(15,17,26,0.12)]">
      <div className="inline-flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-vault-ink text-white text-[14px]">1</span>
        <p className="text-[13px] uppercase tracking-[0.12em] font-medium text-vault-ink" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Next step — One tap only</p>
      </div>
      <h3 className="text-[42px] md:text-[48px] leading-[1.0] tracking-[-1.44px] text-vault-ink font-medium" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{amount ? formatCurrency(amount) : "Check balance"}</h3>
      <p className="text-[18px] md:text-[20px] leading-[1.4] text-charcoal font-medium">{payee ? `Send to ${payee}` : "Your money is safe. One tap to continue."}</p>
      <p className="text-[14px] text-silver-veil">Large button • 72px tall • High contrast</p>
      <button onClick={onClick} className="mt-auto min-h-[72px] h-[72px] rounded-[12px] bg-vault-ink text-white text-[20px] font-semibold px-8 tracking-[-0.01em] shadow-lg hover:bg-carbon transition flex items-center justify-center gap-3">Continue — Tap here <span aria-hidden className="inline-flex w-8 h-8 rounded-full bg-white text-vault-ink items-center justify-center text-[16px]">→</span></button>
    </div>
  );
}

export function SimpleTransactionCard({ t }: { t: Transaction }) {
  return (
    <div className="rounded-[12px] bg-white p-6 md:p-8 flex items-center justify-between min-h-[88px] border-2 border-silver-veil/30 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="text-[24px] md:text-[26px] leading-none tracking-[-0.5px] font-medium text-vault-ink truncate" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{t.payee}</p>
        <p className="text-[14px] md:text-[15px] text-silver-veil mt-1">{t.category}</p>
      </div>
      <span className="text-[24px] md:text-[26px] font-semibold tabular-nums text-vault-ink ml-4 shrink-0">{formatCurrency(t.amount)}</span>
    </div>
  );
}
