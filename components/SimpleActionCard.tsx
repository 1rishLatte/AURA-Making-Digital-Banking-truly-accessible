import { Transaction } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function SimpleActionCard({ amount, payee, onClick }: { amount?: number; payee?: string; onClick?: () => void }) {
  return (
    <div className="rounded-[8px] bg-white p-8 flex flex-col gap-6 min-h-[180px]">
      <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Next step</p>
      <h3 className="text-[40px] leading-[1.06] tracking-[-1.2px] text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{amount ? formatCurrency(amount) : "Check balance"}</h3>
      <p className="text-[16px] text-charcoal">{payee ? `Send to ${payee}` : "Your money is safe. One tap to continue."}</p>
      <button onClick={onClick} className="mt-auto min-h-[56px] rounded-[8px] bg-vault-ink text-white text-[16px] px-6 py-3">Continue</button>
    </div>
  );
}

export function SimpleTransactionCard({ t }: { t: Transaction }) {
  return (
    <div className="rounded-[8px] bg-white p-6 flex items-center justify-between min-h-[72px]">
      <div>
        <p className="text-[22px] tracking-[-0.44px]" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{t.payee}</p>
        <p className="text-[14px] text-silver-veil">{t.category}</p>
      </div>
      <span className="text-[22px] tabular-nums">{formatCurrency(t.amount)}</span>
    </div>
  );
}
