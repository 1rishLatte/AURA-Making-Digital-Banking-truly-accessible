export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-[var(--font-fragmentmono)] text-[14px] uppercase tracking-[0.018em] text-silver-veil ${className}`} style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
      {children}
    </p>
  );
}
