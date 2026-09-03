import { Transaction } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="rounded-[8px] bg-white p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] tracking-[-0.48px] text-vault-ink" style={{ fontFamily: "var(--font-inter), system-ui" }}>Recent transactions</h2>
        <span className="text-[14px] text-silver-veil tabular-nums">{transactions.length} items</span>
      </div>
      <div className="divide-y divide-silver-veil/30" role="table" aria-label="Transactions">
        <div className="hidden md:grid grid-cols-[1fr_140px_140px] gap-4 px-4 py-2 text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          <span>Description</span><span className="text-right">Date</span><span className="text-right">Amount</span>
        </div>
        {transactions.slice(0, 8).map(t => (
          <div key={t.id} className="grid md:grid-cols-[1fr_140px_140px] gap-2 md:gap-4 px-4 py-4 items-center min-h-[56px]">
            <div>
              <p className={`text-[16px] text-vault-ink ${t.flagged ? "font-medium" : ""}`} style={{ fontFamily: "var(--font-inter), system-ui" }}>{t.payee} {t.flagged && <span className="ml-2 text-[12px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Flagged</span>}</p>
              <p className="text-[14px] text-silver-veil">{t.category}</p>
            </div>
            <span className="text-[14px] text-charcoal md:text-right tabular-nums">{formatDate(t.date)}</span>
            <span className={`text-[16px] tabular-nums md:text-right ${t.type === "credit" ? "text-emerald-700" : "text-vault-ink"}`}>{t.type === "credit" ? "+" : "−"}{formatCurrency(t.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
