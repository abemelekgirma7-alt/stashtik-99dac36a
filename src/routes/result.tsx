import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Loader2, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultCard, type Mode } from "@/components/ResultCard";
import { fetchTikTok, type TikTokSuccess } from "@/lib/tiktok.functions";

const searchSchema = z.object({
  u: z.string().min(1),
  m: z.enum(["video", "mp3", "stories", "photos"]).catch("video"),
});

export const Route = createFileRoute("/result")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Processing your TikTok — StashTik" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { u, m } = Route.useSearch();
  const navigate = useNavigate();
  const fetchFn = useServerFn(fetchTikTok);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(8);
  const [status, setStatus] = useState("Fetching TikTok…");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TikTokSuccess | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    progressTimer.current = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.max(1, (95 - p) / 12) : p));
    }, 180);

    (async () => {
      try {
        const res = await fetchFn({ data: { url: u } });
        if (!res.ok) setError(res.error);
        else {
          setStatus("Ready!");
          setResult(res);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(
          msg.includes("[")
            ? "That link doesn't look like a valid TikTok URL. Please paste a video link from tiktok.com."
            : msg,
        );
      } finally {
        if (progressTimer.current) clearInterval(progressTimer.current);
        setProgress(100);
        setLoading(false);
      }
    })();

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [u]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-2xl px-4 py-10 md:py-16">
          <h1 className="text-center text-2xl font-bold sm:text-3xl">
            Your <span className="text-brand-gradient">TikTok</span> download
          </h1>

          {(loading || progress < 100) && (
            <div className="mx-auto mt-6 max-w-xl">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                {progress >= 100 && !error ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {status}
              </p>
            </div>
          )}

          {error && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                <div>
                  <p className="font-semibold">We couldn't process that link.</p>
                  <p className="mt-1 opacity-90">{error}</p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <RotateCcw className="h-3 w-3" /> Try another link
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <ResultCard
                result={result}
                mode={m as Mode}
                onReset={() => navigate({ to: "/" })}
              />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
