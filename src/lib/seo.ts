// ===============================
// StashTik SEO CONFIG (FIXED)
// ===============================

// Automatically switch between environments
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  "https://id-preview--002429d0-6b52-483b-932d-5d1a249cf859.lovable.app";

export const SITE_NAME = "StashTik";

/**
 * Ensure clean absolute URLs
 */
export const absUrl = (path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${cleanPath}`;
};

/**
 * Canonical + OG tags
 */
export const canonicalMeta = (path: string) => ({
  link: {
    rel: "canonical" as const,
    href: absUrl(path),
  },
  meta: {
    property: "og:url",
    content: absUrl(path),
  },
});

/**
 * JSON-LD helper
 */
export const jsonLd = (data: unknown) => ({
  type: "application/ld+json" as const,
  children: JSON.stringify(data),
});

/**
 * Website schema (SEO boost)
 */
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

/**
 * Organization schema (branding + trust)
 */
export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/$/, "")}/favicon.ico`,
  sameAs: [],
});

/**
 * FAQ schema
 */
export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: it.a,
    },
  })),
});
