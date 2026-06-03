import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import { HomeSections } from "@/components/HomeSections";
import illustrationAudio from "@/assets/illustration-audio.png";

export const Route = createFileRoute("/mp3")({
  head: () => ({
    meta: [
      { title: "TikTok Audio Downloader — Save TikTok MP3 Free | StashTik" },
      {
        name: "description",
        content:
          "Download the audio from any TikTok video as a high-quality MP3 file. Free, fast, and works in your browser — no conversion needed.",
      },
      { property: "og:title", content: "TikTok MP3 Downloader — StashTik" },
      { property: "og:description", content: "Download TikTok audio as MP3 instantly." },
    ],
  }),
  component: Mp3,
});

function Mp3() {
  return (
    <SiteLayout>
      <PageHero
        illustration={illustrationAudio}
        title={
          <>
            Download TikTok <span className="text-brand-gradient">Audio (MP3)</span>
          </>
        }
        description="Paste any TikTok link — we save just the sound as MP3."
      >
        <DownloaderForm mode="mp3" ctaLabel="Download MP3" placeholder="Paste TikTok video link…" />
      </PageHero>

      <section className="container mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold">About TikTok audio downloads</h2>
        <p className="mt-3 text-muted-foreground">
          StashTik grabs the original audio track from any TikTok and saves it as an MP3 — no re-encoding, no quality loss.
          Perfect for sounds, music snippets, voiceovers, and trending audio clips for personal use. It's a downloader,
          not a converter — even if you paste a video link, only the audio is saved.
        </p>
      </section>

      <HomeSections />
    </SiteLayout>
  );
}
