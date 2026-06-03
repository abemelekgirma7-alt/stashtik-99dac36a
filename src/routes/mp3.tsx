import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";

export const Route = createFileRoute("/mp3")({
  head: () => ({
    meta: [
      { title: "TikTok to MP3 — Convert TikTok Audio to MP3 Free | SnapTok" },
      {
        name: "description",
        content:
          "Extract audio from any TikTok video and download it as a high-quality MP3 file. Free, fast, and works in your browser.",
      },
      { property: "og:title", content: "TikTok to MP3 — SnapTok" },
      { property: "og:description", content: "Convert TikTok videos to MP3 audio instantly." },
    ],
  }),
  component: Mp3,
});

function Mp3() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Audio"
        title={
          <>
            Convert TikTok to <span className="text-brand-gradient">MP3</span>
          </>
        }
        description="Extract crisp audio from any TikTok video. Paste the link and download high-quality MP3 in one tap."
      >
        <DownloaderForm mode="mp3" ctaLabel="Convert to MP3" placeholder="Paste TikTok video link…" />
      </PageHero>

      <section className="container mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold">About TikTok MP3 conversion</h2>
        <p className="mt-3 text-muted-foreground">
          SnapTok extracts the original audio stream from the TikTok video — no re-encoding, no quality loss.
          Perfect for saving sounds, music snippets, voiceovers, and trending audio clips for personal use.
        </p>
      </section>
    </SiteLayout>
  );
}
