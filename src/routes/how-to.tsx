import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { StepsSection } from "@/components/StepsSection";
import { absUrl, faqSchema, jsonLd } from "@/lib/seo";

const HOWTO_FAQ = [
  { q: "How do I download a TikTok video?", a: "Copy the TikTok video link, paste it into StashTik, then tap Download to save it without watermark." },
  { q: "Where do I find the TikTok link?", a: "In the TikTok app, tap Share on any video and choose Copy Link. Then paste it into StashTik." },
  { q: "Do I need an account?", a: "No. StashTik works instantly without any login or signup." },
];

export const Route = createFileRoute("/how-to")({
  head: () => ({
    meta: [
      { title: "How to Download TikTok Videos — Step-by-Step Guide | StashTik" },
      {
        name: "description",
        content:
          "Learn how to download TikTok videos without watermark, save stories, and download TikTok audio as MP3 in just a few steps.",
      },
      { property: "og:title", content: "How to Use StashTik" },
      { property: "og:description", content: "Step-by-step TikTok download guide." },
      { property: "og:url", content: absUrl("/how-to") },
    ],
    links: [{ rel: "canonical", href: absUrl("/how-to") }],
    scripts: [jsonLd(faqSchema(HOWTO_FAQ))],
  }),
  component: HowTo,
});

function HowTo() {
  return (
    <SiteLayout>
      <PageHero
        title={<>How to use <span className="text-brand-gradient">StashTik</span></>}
        description="Download TikTok videos, stories, and audio in 4 simple steps."
      />
      <StepsSection title="Download a TikTok in 4 steps" description="Quick, simple, and works on any device." />
    </SiteLayout>
  );
}
