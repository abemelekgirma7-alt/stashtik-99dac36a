import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import { HomeSections } from "@/components/HomeSections";

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
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <PageHero
        withLogo
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
