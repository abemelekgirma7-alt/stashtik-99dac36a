import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { DownloaderForm } from "@/components/DownloaderForm";
import {
  Zap,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Music,
  Video,
  ImageIcon,
  Infinity as InfinityIcon,
  Lock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        eyebrow="Free • No Login • Unlimited"
        title={
          <>
            Download TikTok Videos{" "}
            <span className="text-brand-gradient">Without Watermark</span> Instantly
          </>
        }
        description="100% Free in HD MP4 & MP3. Save TikTok videos, stories, and audio in seconds — no app required."
      >
        <DownloaderForm mode="video" />
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <QuickLink to="/stories" icon={<ImageIcon className="h-3.5 w-3.5" />}>Story Downloader</QuickLink>
          <QuickLink to="/mp3" icon={<Music className="h-3.5 w-3.5" />}>MP3 Converter</QuickLink>
          <QuickLink to="/how-to" icon={<Sparkles className="h-3.5 w-3.5" />}>How it Works</QuickLink>
          <QuickLink to="/app" icon={<Smartphone className="h-3.5 w-3.5" />}>Install App</QuickLink>
        </div>
      </PageHero>

      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="What is SnapTok?"
          title="The fastest TikTok downloader on the web"
          description="SnapTok is a free online TikTok downloader that saves videos in HD MP4 without watermark. Works on iOS, Android, Windows, and macOS — just paste the URL."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Feature icon={<Zap />} title="Fast & Free Downloads" desc="Grab HD clips in seconds. No registration, no apps, no hidden costs." />
          <Feature icon={<Video />} title="MP4 & MP3 Conversion" desc="Download as HD MP4 or extract crisp MP3 audio with a single tap." />
          <Feature icon={<Sparkles />} title="HD Quality" desc="Preserves sharp details and original resolution every time." />
          <Feature icon={<ShieldCheck />} title="No Watermark" desc="Removes the TikTok logo automatically — perfect for repurposing." />
          <Feature icon={<InfinityIcon />} title="Unlimited Use" desc="No daily limits. Download as many videos as you want, for free." />
          <Feature icon={<Lock />} title="Private & Secure" desc="We never store your downloads. Everything happens on the fly." />
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="How to use"
            title="Download a TikTok video in 4 steps"
            description="Quick, simple, and works on any device."
          />
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="relative rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers about SnapTok and our TikTok tools."
        />
        <div className="mx-auto mt-8 max-w-3xl">
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-2 shadow-soft">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="px-4">
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
}

function QuickLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-gradient">{eyebrow}</span>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

const steps = [
  { title: "Copy TikTok link", desc: "Open the TikTok app, tap Share, and choose Copy Link." },
  { title: "Paste the URL", desc: "Paste the link into the search bar above on SnapTok." },
  { title: "Press Download", desc: "Pick MP4 video or MP3 audio — we process instantly." },
  { title: "Save the file", desc: "Tap Save to keep your no-watermark HD download." },
];

const faqs = [
  {
    q: "How can I download TikTok videos without a watermark?",
    a: "Paste your TikTok link into SnapTok and click Download Video. We automatically strip the TikTok watermark and serve a clean HD MP4 ready to share or repost.",
  },
  {
    q: "Is SnapTok safe and secure?",
    a: "Yes. We never ask for your TikTok login, we don't store any of the videos you download, and the entire process happens through your browser.",
  },
  {
    q: "Does it work on iPhone, Android, and PC?",
    a: "SnapTok is a web app that works in every modern browser — iOS Safari, Android Chrome, Windows, and macOS. No installation required.",
  },
  {
    q: "Is it free? Are there any limits?",
    a: "Completely free with no daily limits. Download as many TikToks as you need.",
  },
  {
    q: "Can I save TikTok audio or MP3 files?",
    a: "Yes — every download includes a one-tap MP3 export. You can also use the dedicated MP3 page to convert any video.",
  },
  {
    q: "Can I reuse or repost downloaded TikTok videos?",
    a: "Only if you have the rights. SnapTok is for personal use; always respect the original creator and TikTok's terms.",
  },
];
