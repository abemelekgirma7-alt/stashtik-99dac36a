import {
  Zap,
  ShieldCheck,
  Sparkles,
  Video,
  Music,
  Infinity as InfinityIcon,
  Lock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Shared marketing sections reused on Video, Stories, and MP3 pages. */
export function HomeSections() {
  return (
    <>
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="What is SnapTok?"
          title="The fastest TikTok downloader on the web"
          description="SnapTok is a free online TikTok downloader that saves videos in HD MP4 without watermark. Works on iOS, Android, Windows, and macOS — just paste the URL."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Feature icon={<Zap />} title="Fast & Free Downloads" desc="Grab HD clips in seconds. No registration, no apps, no hidden costs." />
          <Feature icon={<Video />} title="MP4 & MP3" desc="Save the full video as HD MP4 or just the audio as MP3 with a single tap." />
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
            title="Download a TikTok in 4 steps"
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
    </>
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
  { title: "Auto-process", desc: "As soon as we detect a valid link, we start fetching — no extra clicks." },
  { title: "Save the file", desc: "Tap Download to keep your no-watermark HD video, story, or MP3." },
];

const faqs = [
  {
    q: "How can I download TikTok videos without a watermark?",
    a: "Paste your TikTok link into SnapTok. We automatically strip the TikTok watermark and serve a clean HD MP4 ready to share or repost.",
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
    a: "Yes — every download includes a one-tap MP3 export. You can also use the dedicated Audio page to grab just the soundtrack.",
  },
  {
    q: "Can I reuse or repost downloaded TikTok videos?",
    a: "Only if you have the rights. SnapTok is for personal use; always respect the original creator and TikTok's terms.",
  },
];
