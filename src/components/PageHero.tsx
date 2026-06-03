import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.66 0.27 5 / 0.12), transparent 70%), radial-gradient(50% 50% at 100% 30%, oklch(0.74 0.21 50 / 0.10), transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 pt-12 pb-10 text-center md:pt-20 md:pb-14">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-soft">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
        )}
        {children && <div className="mx-auto mt-8 max-w-2xl">{children}</div>}
      </div>
    </section>
  );
}
