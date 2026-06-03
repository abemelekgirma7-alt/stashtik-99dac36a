import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={`Last updated: ${updated}`} />
      <section className="container mx-auto max-w-3xl px-4 pb-16">
        <article
          className="rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground shadow-soft sm:p-8 sm:text-base
            [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground sm:[&_h2]:text-xl
            [&_a]:text-foreground [&_a]:underline
            [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1
            [&_p]:mt-3
            [&_strong]:text-foreground"
        >
          {children}
        </article>
      </section>
    </>
  );
}
