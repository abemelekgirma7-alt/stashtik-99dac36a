import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import { HomeSections } from "@/components/HomeSections";
import { absUrl, faqSchema, jsonLd } from "@/lib/seo";

const HOME_FAQ = [
  { q: "Is StashTik free?", a: "Yes. StashTik is 100% free with no limits, no signup, and no watermark on downloads." },
  { q: "Can I download TikTok videos without watermark?", a: "Yes. Paste any TikTok link and we save the original video in HD MP4 without the TikTok watermark." },
  { q: "Does StashTik work on iPhone and Android?", a: "Yes. It works in any modern browser on iPhone, Android, Windows, macOS, and Linux." },
  { q: "Can I extract just the MP3 audio?", a: "Yes. Use the Audio mode to save only the TikTok sound as a high-quality MP3 file." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tiktok Downloader - Download Video tiktok Without Watermark" },
      {
        name: "description",
        content:
          "Free TikTok downloader. Save TikTok videos without watermark in HD MP4, extract MP3 audio, and download TikTok stories. No login, unlimited, works on any device.",
      },
      { property: "og:title", content: "Tiktok Downloader - Download Video tiktok Without Watermark" },
      { property: "og:description", content: "HD MP4, MP3 audio, and stories. Free and unlimited." },
      { property: "og:url", content: absUrl("/") },
    ],
    links: [{ rel: "canonical", href: absUrl("/") }],
    scripts: [jsonLd(faqSchema(HOME_FAQ))],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <PageHero
        withLogo
        showModeTabs
        title={
          <>
            Download TikTok <span className="text-brand-gradient">Without Watermark</span>
          </>
        }
        description="Free, HD, no watermark."
      >
        <DownloaderForm mode="video" />
      </PageHero>

      <HomeSections />
    </SiteLayout>
  );
}
