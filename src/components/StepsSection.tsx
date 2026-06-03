import step1 from "@/assets/step-1-copy.png";
import step2 from "@/assets/step-2-paste.png";
import step3 from "@/assets/step-3-process.png";
import step4 from "@/assets/step-4-save.png";

const steps = [
  { title: "Copy TikTok link", desc: "Open the TikTok app, tap Share, and choose Copy Link.", img: step1 },
  { title: "Paste the URL", desc: "Paste the link into the search bar above on SnapTok.", img: step2 },
  { title: "Auto-process", desc: "As soon as we detect a valid link, we start fetching — no extra clicks.", img: step3 },
  { title: "Save the file", desc: "Tap Download to keep your no-watermark HD video, story, or MP3.", img: step4 },
];

export function StepsSection({ title = "Download a TikTok in 4 steps", description = "Quick, simple, and works on any device." }: { title?: string; description?: string }) {
  return (
    <section className="bg-secondary/40 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-gradient">How to use</span>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        <ol className="mx-auto mt-10 flex max-w-4xl flex-col gap-5">
          {steps.map((s, i) => {
            const reversed = i % 2 === 1;
            return (
              <li
                key={s.title}
                className={`group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-brand sm:gap-6 sm:p-6 ${reversed ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="relative flex-none">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="h-28 w-28 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-40 sm:w-40 md:h-48 md:w-48"
                  />
                  <span className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white shadow-brand sm:h-9 sm:w-9 sm:text-sm">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold sm:text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">{s.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}