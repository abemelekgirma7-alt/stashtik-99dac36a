// Centralized SEO constants. Update SITE_URL once a custom domain is connected.
export const SITE_URL = "https://id-preview--002429d0-6b52-483b-932d-5d1a249cf859.lovable.app";
export const SITE_NAME = "StashTik";

export const absUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Build a canonical <link> + og:url meta pair for a leaf route. */
export const canonicalMeta = (path: string) => ({
  link: { rel: "canonical" as const, href: absUrl(path) },
  meta: { property: "og:url", content: absUrl(path) },
});

export const jsonLd = (data: unknown) => ({
  type: "application/ld+json" as const,
  children: JSON.stringify(data),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  sameAs: [] as string[],
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
});