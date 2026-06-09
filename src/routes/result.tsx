import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, useCallback } from "react";
import { z } from "zod";
import { Loader2, RotateCcw, CheckCircle2, AlertTriangle, X } from "lucide-react";
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
  const [status, setStatus] = useState("Contacting TikTok…");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TikTokSuccess | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const attemptRef = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearProgress = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
  };

  const startFetch = useCallback(() => {
    attemptRef.current += 1;
    const myAttempt = attemptRef.current;
    setError(null);
    setResult(null);
    setLoading(true);
    setProgress(8);
    setStatus("Contacting TikTok…");
    clearProgress();

    // Real-ish staged status updates based on elapsed time.
    const stages = [
      { at: 600, p: 25, s: "Resolving TikTok link…" },
      { at: 1400, p: 45, s: "Fetching media…" },
      { at: 2600, p: 60, s: "Removing watermark…" },
      { at: 4200, p: 75, s: "Preparing download…" },
      { at: 7000, p: 85, s: "Servers are busy — retrying for you…" },
      { at: 12000, p: 92, s: "Still working — high demand, hang tight…" },
    ];
    const t0 = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - t0;
      const stage = [...stages].reverse().find((x) => elapsed >= x.at);
      if (stage) {
        setProgress((p) => (p < stage.p ? stage.p : p));
        setStatus((s) => (s === stage.s ? s : stage.s));
      }
      setProgress((p) => (p < 95 ? p + Math.max(0.2, (96 - p) / 60) : p));
    }, 200);


    const ctrl = new AbortController();
    abortRef.current = ctrl;

    (async () => {
      try {
        const res = await fetchFn({ data: { url: u }, signal: ctrl.signal } as never);
        if (myAttempt !== attemptRef.current) return; // stale
        if (!res.ok) {
          const transient = /trouble|demand|busy|rate|limit|moment|network|reaching/i.test(res.error);
          if (transient) {
            setStatus("High demand — still retrying for you…");
            setProgress((p) => Math.max(p, 88));
            retryTimer.current = setTimeout(() => {
              if (myAttempt === attemptRef.current) startFetch();
            }, 1800);
            return;
          }
          setError(res.error);
        } else {
          // Mode-specific validation.
          if (m === "photos" && (!res.images || res.images.length === 0)) {
            setError(
              "Error — this isn't a photo link. The URL you pasted is a video or audio. Please paste a TikTok photo / slideshow link, or use the Video downloader.",
            );
          } else {
            setStatus("Ready!");
            setResult(res);
          }
        }
      } catch (err) {
        if (myAttempt !== attemptRef.current) return;
        if ((err as Error)?.name === "AbortError") {
          setError("Canceled.");
          return;
        }
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(
          msg.includes("[")
            ? "That link doesn't look like a valid TikTok URL. Please paste a video link from tiktok.com."
            : msg,
        );
      } finally {
        if (myAttempt !== attemptRef.current) return;
        clearProgress();
        setProgress(100);
        setLoading(false);
      }
    })();
  }, [fetchFn, u, m]);

  useEffect(() => {
    startFetch();
    return () => {
      clearProgress();
      abortRef.current?.abort();
    };
  }, [startFetch]);

  const cancel = () => {
    abortRef.current?.abort();
    clearProgress();
    setLoading(false);
    setError("Canceled.");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-2xl px-4 py-10 md:py-16">
          <h1 className="text-center text-2xl font-bold sm:text-3xl">
            Your <span className="text-brand-gradient">TikTok</span> download
          </h1>

          {(loading || (progress < 100 && !error && !result)) && (
            <div className="mx-auto mt-6 max-w-xl">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {progress >= 100 && !error ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {status} <span className="opacity-60">({Math.round(progress)}%)</span>
                </p>
                {loading && (
                  <button
                    type="button"
                    onClick={cancel}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold hover:bg-secondary"
                  >
                    <X className="h-3 w-3" /> Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                <div className="flex-1">
                  <p className="font-semibold">We couldn't process that link.</p>
                  <p className="mt-1 opacity-90">{error}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={startFetch}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <RotateCcw className="h-3 w-3" /> Retry
                    </button>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      Try another link
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
