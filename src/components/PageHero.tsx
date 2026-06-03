import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  illustration,
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
      <div className="container mx-auto px-4 pt-10 pb-10 text-center md:pt-16 md:pb-14">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full bg-brand-gradient px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-brand">
            {eyebrow}
          </span>
        )}
        {illustration && (
          <img
            src={illustration}
            alt=""
            aria-hidden
            className="mx-auto mt-4 h-28 w-auto md:h-36"
          />
        )}
        <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
        )}
        {children && <div className="mx-auto mt-7 max-w-2xl">{children}</div>}
      </div>
    </section>
  );
}
