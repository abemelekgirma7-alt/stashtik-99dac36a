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
      <article
        className="container mx-auto max-w-3xl space-y-4 px-4 pb-16 text-muted-foreground
          [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground
          [&_a]:text-foreground [&_a]:underline
          [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1
          [&_strong]:text-foreground"
      >
        {children}
      </article>
    </>
  );
}
