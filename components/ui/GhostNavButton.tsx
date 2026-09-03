import { cn } from "@/lib/utils";

export function GhostNavButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] border border-white bg-transparent px-4 py-2 text-[14px] uppercase tracking-[0.018em] text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-frost min-h-[44px]",
        className
      )}
      style={{ fontFamily: "var(--font-inter), system-ui" }}
    >
      {children}
    </button>
  );
}

export function InlineArrowButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-3 rounded-[8px] bg-charcoal/60 px-4 py-3 text-[14px] text-white transition hover:bg-charcoal/80 min-h-[44px]",
        className
      )}
      style={{ fontFamily: "var(--font-inter), system-ui" }}
    >
      <span>{children}</span>
      <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: "linear-gradient(90deg, #1c53bd, #53adfe)" }} aria-hidden />
    </button>
  );
}
