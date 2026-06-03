import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SnapTok — Free TikTok Downloader" },
      { name: "description", content: "Learn about SnapTok, our mission, and how the TikTok downloader works." },
      { property: "og:title", content: "About SnapTok" },
      { property: "og:description", content: "Who we are and what SnapTok does." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero eyebrow="About" title={<>About <span className="text-brand-gradient">SnapTok</span></>} />
      <section className="container mx-auto max-w-3xl space-y-5 px-4 pb-16 text-muted-foreground">
        <p>
          SnapTok is a free online tool that helps people save TikTok videos, stories, and audio for offline
          viewing. We believe great content should be easy to keep, share with friends, and remix — within the
          limits of the original creator's rights.
        </p>
        <p>
          Our small, independent team built SnapTok to be the fastest, cleanest, and most privacy-friendly
          TikTok downloader on the web. No accounts, no tracking, no ads in your downloads.
        </p>
        <p>
          SnapTok is not affiliated with TikTok, ByteDance, or Douyin. All trademarks belong to their respective
          owners. If you're a creator and want a video removed from our caches (we don't store anything long-term,
          but just in case), reach out via our <a href="/contact" className="text-foreground underline">contact page</a>.
        </p>
      </section>
    </SiteLayout>
  );
}
