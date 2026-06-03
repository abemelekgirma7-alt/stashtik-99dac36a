import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import { HomeSections } from "@/components/HomeSections";
import { Music, Image as ImageIcon, Sparkles, Smartphone } from "lucide-react";
import illustrationVideo from "@/assets/illustration-video.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapTok — TikTok Video Downloader Without Watermark (HD, MP4, MP3)" },
      {
        name: "description",
        content:
          "Free TikTok downloader. Save TikTok videos without watermark in HD MP4, extract MP3 audio, and download TikTok stories. No login, unlimited, works on any device.",
      },
      { property: "og:title", content: "SnapTok — Download TikTok Without Watermark" },
      { property: "og:description", content: "HD MP4, MP3 audio, and stories. Free and unlimited." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <PageHero
        illustration={illustrationVideo}
        title={
          <>
            Download TikTok Videos{" "}
            <span className="text-brand-gradient">Without Watermark</span> Instantly
          </>
        }
        description="Free, HD, no watermark."
      >
        <DownloaderForm mode="video" />

        {/* Compact quick links so an ad can slot underneath */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
          <QuickLink to="/stories" icon={<ImageIcon className="h-3 w-3" />}>Stories</QuickLink>
          <QuickLink to="/mp3" icon={<Music className="h-3 w-3" />}>Audio / MP3</QuickLink>
          <QuickLink to="/how-to" icon={<Sparkles className="h-3 w-3" />}>How it Works</QuickLink>
          <QuickLink to="/app" icon={<Smartphone className="h-3 w-3" />}>Install App</QuickLink>
        </div>

        <div
          data-ad-slot="hero-below"
          className="mx-auto mt-4 flex min-h-[90px] max-w-2xl items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground"
        >
          Ad space
        </div>
      </PageHero>

      <HomeSections />
    </SiteLayout>
  );
}

function QuickLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}
