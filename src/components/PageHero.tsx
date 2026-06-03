import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  illustration: _illustration,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  illustration?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.66 0.27 5 / 0.14), transparent 70%), radial-gradient(50% 50% at 100% 30%, oklch(0.74 0.21 50 / 0.12), transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 pt-8 pb-8 text-center md:pt-14 md:pb-12">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full bg-brand-gradient px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-brand">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-2 max-w-4xl text-2xl font-bold leading-tight animate-fade-up sm:text-3xl md:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">{description}</p>
        )}
        {children && <div className="mx-auto mt-5 max-w-2xl md:mt-7">{children}</div>}
      </div>
    </section>
  );
}
