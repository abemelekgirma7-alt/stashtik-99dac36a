import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/how-to")({
  head: () => ({
    meta: [
      { title: "How to Download TikTok Videos — Step-by-Step Guide | SnapTok" },
      {
        name: "description",
        content:
          "Learn how to download TikTok videos without watermark, save stories, and convert TikTok to MP3 in just a few steps.",
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
    desc: "Open TikTok on your phone or browser. Tap the Share button on the video or story you want to download, then choose Copy Link.",
  },
  {
    title: "Open SnapTok",
    desc: "Go to snaptok.app and pick the tool you need: Video, Stories, or MP3.",
  },
  {
    title: "Paste the link",
    desc: "Tap the input field and paste your link. You can use the Paste shortcut for one-tap pasting.",
  },
  {
    title: "Choose your format",
    desc: "Pick HD MP4 for video, or MP3 for audio. For stories, you'll see the photo or video result directly.",
  },
  {
    title: "Tap Download",
    desc: "Your file is processed instantly. Hit Download to save it to your device — no watermark.",
  },
];

function HowTo() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Guide"
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
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-muted-foreground">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
