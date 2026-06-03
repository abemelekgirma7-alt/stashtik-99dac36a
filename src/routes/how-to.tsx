import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { StepsSection } from "@/components/StepsSection";

export const Route = createFileRoute("/how-to")({
  head: () => ({
    meta: [
      { title: "How to Download TikTok Videos — Step-by-Step Guide | SnapTok" },
      {
        name: "description",
        content:
          "Learn how to download TikTok videos without watermark, save stories, and download TikTok audio as MP3 in just a few steps.",
      },
      { property: "og:title", content: "How to Use SnapTok" },
      { property: "og:description", content: "Step-by-step TikTok download guide." },
    ],
  }),
  component: HowTo,
});

function HowTo() {
  return (
    <SiteLayout>
      <PageHero
        title={<>How to use <span className="text-brand-gradient">SnapTok</span></>}
        description="Download TikTok videos, stories, and audio in 4 simple steps."
      />
      <StepsSection title="Download a TikTok in 4 steps" description="Quick, simple, and works on any device." />
    </SiteLayout>
  );
}
