import step1 from "@/assets/step-1-copy.png";
import step2 from "@/assets/step-2-paste.png";
import step3 from "@/assets/step-3-process.png";
import step4 from "@/assets/step-4-save.png";

const steps = [
  { title: "Copy TikTok link", desc: "Open the TikTok app, tap Share, and choose Copy Link.", img: step1 },
  { title: "Paste the URL", desc: "Paste the link into the search bar above on StashTik.", img: step2 },
  { title: "Auto-process", desc: "As soon as we detect a valid link, we start fetching — no extra clicks.", img: step3 },
  { title: "Save the file", desc: "Tap Download to keep your no-watermark HD video, story, or MP3.", img: step4 },
];

export function StepsSection({
  title = "Download a TikTok in 4 steps",
  description = "Quick, simple, and works on any device.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="flex min-h-screen items-center bg-secondary/40 py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-gradient sm:text-xs">
            How to use
          </span>
          <h2 className="mt-2 text-xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
          <p className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-base">{description}</p>
        </div>

        {/* Mobile: 2x2 compact grid. Desktop: alternating image/text rows */}
        <ol className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 md:grid-cols-1 md:gap-5">
          {steps.map((s, i) => {
            const reversed = i % 2 === 1;
            return (
              <li
                key={s.title}
                className={`group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-2.5 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-brand sm:gap-4 sm:p-4 md:gap-6 md:p-6 md:text-left ${reversed ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="relative flex-none">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="h-16 w-16 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28 md:h-48 md:w-48"
                  />
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[9px] font-bold text-white shadow-brand sm:h-7 sm:w-7 sm:text-[11px] md:h-9 md:w-9 md:text-sm">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px] md:text-xs">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-0.5 text-xs font-semibold sm:text-base md:text-xl">{s.title}</h3>
                  <p className="mt-1 line-clamp-3 text-[10px] text-muted-foreground sm:text-xs md:text-base md:line-clamp-none">
                    {s.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
