import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import illustrationHowto from "@/assets/illustration-howto.png";
import illustrationVideo from "@/assets/illustration-video.png";
import illustrationStories from "@/assets/illustration-stories.png";
import illustrationAudio from "@/assets/illustration-audio.png";

export const Route = createFileRoute("/how-to")({
  head: () => ({
    meta: [
      { title: "How to Download TikTok Videos — Step-by-Step Guide | SnapTok" },
      {
        name: "description",
        content:
          "Learn how to download TikTok videos without watermark, save stories, and download TikTok audio as MP3 in just a few steps.",
      },
      { property: "og:title", content: "How to Use SnapTok" },
      { property: "og:description", content: "Step-by-step TikTok download guide." },
    ],
  }),
  component: HowTo,
});

const steps = [
  {
    title: "Copy the TikTok link",
    desc: "Open TikTok on your phone or browser. Tap Share on the video or story you want, then choose Copy Link.",
    img: illustrationVideo,
  },
  {
    title: "Open SnapTok",
    desc: "Go to snaptok.app and pick the tool you need: Video, Stories, or Audio (MP3).",
    img: illustrationHowto,
  },
  {
    title: "Paste the link",
    desc: "Tap the input field and paste your link. The Paste button drops it in with one tap.",
    img: illustrationHowto,
  },
  {
    title: "We auto-process",
    desc: "The moment we detect a valid link, SnapTok starts fetching — no extra clicks needed.",
    img: illustrationAudio,
  },
  {
    title: "Download instantly",
    desc: "Pick HD MP4 for video, MP3 for audio, or save photos for stories. The file downloads straight to your device, named after the original TikTok title.",
    img: illustrationStories,
  },
];

function HowTo() {
  return (
    <SiteLayout>
      <PageHero
        illustration={illustrationHowto}
        title={<>How to use <span className="text-brand-gradient">SnapTok</span></>}
        description="Download TikTok videos, stories, and audio in 5 simple steps."
      />
      <section className="container mx-auto max-w-3xl px-4 pb-12">
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-brand">
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-muted-foreground">{s.desc}</p>
              </div>
              <img
                src={s.img}
                alt=""
                aria-hidden
                loading="lazy"
                className="hidden h-20 w-20 flex-none object-contain sm:block"
              />
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
