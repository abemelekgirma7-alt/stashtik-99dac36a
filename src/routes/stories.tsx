import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";

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
        eyebrow="Stories"
        title={
          <>
            Download TikTok <span className="text-brand-gradient">Stories</span>
          </>
        }
        description="Paste a public TikTok story link to save the video or photos — no watermark, no login."
      >
        <DownloaderForm mode="stories" ctaLabel="Get Story" placeholder="Paste TikTok story link…" />
      </PageHero>

      <section className="container mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold">How TikTok story download works</h2>
        <ol className="mt-4 space-y-3 text-muted-foreground">
          <li>
            <strong className="text-foreground">1.</strong> Open the TikTok story you want to save and tap the share icon.
          </li>
          <li>
            <strong className="text-foreground">2.</strong> Choose <em>Copy Link</em>.
          </li>
          <li>
            <strong className="text-foreground">3.</strong> Paste it above and press <em>Get Story</em>.
          </li>
          <li>
            <strong className="text-foreground">4.</strong> Save the video file, or download photos one by one if it's a photo story.
          </li>
        </ol>
        <p className="mt-6 text-sm text-muted-foreground">
          Only public stories can be downloaded. Always respect the creator's rights when reusing content.
        </p>
      </section>
    </SiteLayout>
  );
}
