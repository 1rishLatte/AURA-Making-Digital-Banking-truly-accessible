export function FeatureCard({ title, children, eyebrow }: { title: string; children: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="rounded-[8px] bg-white p-10 flex flex-col gap-4">
      {eyebrow && <p className="text-[14px] uppercase tracking-[0.018em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{eyebrow}</p>}
      <h3 className="text-[24px] leading-[1.2] tracking-[-0.48px] text-vault-ink" style={{ fontFamily: "var(--font-inter), system-ui" }}>{title}</h3>
      <div className="text-[16px] leading-[1.5] text-charcoal" style={{ fontFamily: "var(--font-inter), system-ui" }}>{children}</div>
    </div>
  );
}
