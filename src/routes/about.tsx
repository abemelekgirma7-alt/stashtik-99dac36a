import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Smartphone, Globe, AppWindow, Mail } from "lucide-react";
import illustrationVideo from "@/assets/illustration-video.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SnapTok — Free TikTok Downloader" },
      { name: "description", content: "Learn about SnapTok, our mission, and what's coming next." },
      { property: "og:title", content: "About SnapTok" },
      { property: "og:description", content: "Who we are and what SnapTok does." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        illustration={illustrationVideo}
        title={<>About <span className="text-brand-gradient">SnapTok</span></>}
        description="A tiny, independent team building the friendliest TikTok downloader on the web."
      />
      <section className="container mx-auto max-w-3xl space-y-5 px-4 pb-10 text-muted-foreground">
        <p>
          SnapTok is a free online tool that helps people save TikTok videos, stories, and audio for offline
          viewing. We believe great content should be easy to keep, share with friends, and remix — within the
          limits of the original creator's rights.
        </p>
        <p>
          We built SnapTok to be the fastest, cleanest, and most privacy-friendly TikTok downloader on the web.
          No accounts, no tracking, no ads inside your downloads.
        </p>
        <p>
          SnapTok is not affiliated with TikTok, ByteDance, or Douyin. All trademarks belong to their respective
          owners. If you're a creator and want a video removed,
          reach out via our <Link to="/contact" className="text-foreground underline">contact page</Link>.
        </p>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold">Coming soon: native app & browser extension</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We're working on dedicated SnapTok apps so you can save TikToks even faster.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SoonCard icon={<Globe />} label="Web Extension" sub="Chrome, Edge, Brave, Firefox" />
            <SoonCard icon={<Smartphone />} label="iOS App" sub="iPhone & iPad" />
            <SoonCard icon={<AppWindow />} label="Android App" sub="Phones & tablets" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Want early access?{" "}
            <Link to="/contact" className="inline-flex items-center gap-1 text-foreground underline">
              <Mail className="h-3 w-3" /> Email us
            </Link>{" "}
            and we'll notify you the moment they launch.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function SoonCard({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-brand [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
      <span className="mt-2 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
        Coming soon
      </span>
    </div>
  );
}
