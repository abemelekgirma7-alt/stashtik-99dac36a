import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import { HomeSections } from "@/components/HomeSections";
import illustrationStories from "@/assets/illustration-stories.png";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "TikTok Story Downloader — Save Stories Without Watermark | SnapTok" },
      {
        name: "description",
        content:
          "Download public TikTok stories — videos and photos — without watermark. Paste the story link and save instantly. Free and unlimited.",
      },
      { property: "og:title", content: "TikTok Story Downloader — SnapTok" },
      { property: "og:description", content: "Save public TikTok stories without watermark." },
    ],
  }),
  component: Stories,
});

function Stories() {
  return (
    <SiteLayout>
      <PageHero
        illustration={illustrationStories}
        title={
          <>
            Download TikTok <span className="text-brand-gradient">Stories</span>
          </>
        }
        description="Save public stories — photos & video — in seconds."
      >
        <DownloaderForm mode="stories" ctaLabel="Get Story" placeholder="Paste TikTok story link…" />
      </PageHero>

      <HomeSections />
    </SiteLayout>
  );
}
