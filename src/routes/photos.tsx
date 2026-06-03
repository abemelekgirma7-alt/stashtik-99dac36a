import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import { HomeSections } from "@/components/HomeSections";

export const Route = createFileRoute("/photos")({
  head: () => ({
    meta: [
      { title: "TikTok Photo Downloader — Save Photos Without Watermark | StashTik" },
      {
        name: "description",
        content:
          "Download TikTok photos and slideshow images without watermark. Save all images at once as a ZIP or individually. Free and unlimited.",
      },
      { property: "og:title", content: "TikTok Photo Downloader — StashTik" },
      { property: "og:description", content: "Save TikTok slideshow photos without watermark." },
    ],
  }),
  component: Photos,
});

function Photos() {
  return (
    <SiteLayout>
      <PageHero
        withLogo
        title={
          <>
            Download TikTok <span className="text-brand-gradient">Photos</span>
          </>
        }
        description="Paste a TikTok slideshow link — grab all images in HD."
      >
        <DownloaderForm mode="photos" ctaLabel="Download Photos" placeholder="Paste TikTok photo / slideshow link…" />
      </PageHero>

      <HomeSections />
    </SiteLayout>
  );
}
