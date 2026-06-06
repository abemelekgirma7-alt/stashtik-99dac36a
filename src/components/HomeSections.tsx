import {
  Zap,
  ShieldCheck,
  Sparkles,
  Video,
  Infinity as InfinityIcon,
  Lock,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepsSection } from "./StepsSection";
import { LogoMark } from "./Logo";

/** Shared marketing sections reused on Video, Stories, and MP3 pages. */
export function HomeSections() {
  return (
    <>
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="What is StashTik?"
          title="The fastest TikTok downloader on the web"
          description="StashTik is a free online TikTok downloader that saves videos in HD MP4 without watermark. Works on iOS, Android, Windows, and macOS — just paste the URL."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          <Feature icon={<Zap />} title="Fast & Free Downloads" desc="Grab HD clips in seconds. No registration, no apps, no hidden costs." />
          <Feature icon={<Video />} title="MP4 & MP3" desc="Save the full video as HD MP4 or just the audio as MP3 with a single tap." />
          <Feature icon={<Sparkles />} title="HD Quality" desc="Preserves sharp details and original resolution every time." />
          <Feature icon={<ShieldCheck />} title="No Watermark" desc="Removes the TikTok logo automatically — perfect for repurposing." />
          <Feature icon={<InfinityIcon />} title="Unlimited Use" desc="No daily limits. Download as many videos as you want, for free." />
          <Feature icon={<Lock />} title="Private & Secure" desc="We never store your downloads. Everything happens on the fly." />
        </div>
      </section>

      <StepsSection />

      <section className="container mx-auto px-4 py-12">
        <Link
          to="/app"
          className="group relative mx-auto flex max-w-4xl flex-col items-center gap-5 overflow-hidden rounded-3xl bg-brand-gradient p-6 text-center text-white shadow-brand transition-transform hover:scale-[1.01] sm:flex-row sm:p-8 sm:text-left"
        >
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
            <LogoMark className="h-12 w-12 sm:h-14 sm:w-14" />
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <Smartphone className="h-3 w-3" /> Install App
              <span className="ml-1 rounded-full bg-white/30 px-1.5 py-0.5 text-[9px]">Coming soon</span>
            </span>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl md:text-3xl">Get StashTik on your home screen</h3>
            <p className="mt-1 text-sm text-white/85 sm:text-base">
              Native iOS, Android, and desktop apps are on the way — install the web app today for one-tap launch.
            </p>
          </div>
          <span className="inline-flex flex-none items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-transform group-hover:translate-x-1">
            Learn more <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers about StashTik and our TikTok tools."
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
    </>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-gradient">{eyebrow}</span>
      <h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-1 hover:shadow-brand sm:p-6">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand sm:mb-4 sm:h-11 sm:w-11 [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
        {icon}
      </div>
      <h3 className="text-sm font-semibold sm:text-lg">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{desc}</p>
    </div>
  );
}

const faqs = [
  {
    q: "How can I download TikTok videos without a watermark?",
    a: "Paste your TikTok link into StashTik. We automatically strip the TikTok watermark and serve a clean HD MP4 ready to share or repost.",
  },
  {
    q: "Is StashTik safe and secure?",
    a: "Yes. We never ask for your TikTok login, we don't store any of the videos you download, and the entire process happens through your browser.",
  },
  {
    q: "Does it work on iPhone, Android, and PC?",
    a: "StashTik is a web app that works in every modern browser — iOS Safari, Android Chrome, Windows, and macOS. No installation required.",
  },
  {
    q: "Is it free? Are there any limits?",
    a: "Completely free with no daily limits. Download as many TikToks as you need.",
  },
  {
    q: "Can I save TikTok audio or MP3 files?",
    a: "Yes — every download includes a one-tap MP3 export. You can also use the dedicated Audio page to grab just the soundtrack.",
  },
  {
    q: "Can I reuse or repost downloaded TikTok videos?",
    a: "Only if you have the rights. StashTik is for personal use; always respect the original creator and TikTok's terms.",
  },
];
